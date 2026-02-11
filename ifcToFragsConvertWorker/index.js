import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as Minio from 'minio';
import { Job, JobScheduler, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

// 引入核心套件 (ESM)
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取上一層的 .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// === Redis 連線設定 ===
// 這是 BullMQ 用來連線 Redis 的設定
const redisConnection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null, // BullMQ 要求必須設為 null
})

// === 1. 初始化 MinIO 客戶端 ===
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY
});

const IFC_BUCKET = process.env.S3_IFC_BUCKET;
const FRAG_BUCKET = process.env.S3_FRAGS_BUCKET;

// === 2. 初始化 IfcImporter ===
const serializer = new FRAGS.IfcImporter();
serializer.wasm.path = "/"

// 這個 Queue 用來讓 Webhook 把任務丟進去
const conversionQueue = new Queue('ifc-conversion-queue', { 
    connection: redisConnection 
});

const PORT = 3005;

async function executeConversionTask(job, fileKey, fileName) {
    console.log(`🚀 [Job Start] 開始處理: ${fileName} (Key: ${fileKey})`);
    
    
    // 1. 下載 IFC
    const stat = await minioClient.statObject(IFC_BUCKET, fileKey);
    const totalSize = stat.size;
    let downloadedSize = 0;

    console.log(`⬇️ [MinIO] 正在下載...`);
    const fileStream = await minioClient.getObject(IFC_BUCKET, fileKey);
    const chunks = [];
    for await (const chunk of fileStream) {
        chunks.push(chunk);
        downloadedSize += chunk.length;

        // 下載進度：0% ~ 40%
        const percentage = Math.round((downloadedSize / totalSize) * 40);

        // 簡單節流：每 5% 更新一次
        if (percentage % 5 === 0){
            await job.updateProgress(percentage);
        }
    }

    const fileBuffer = Buffer.concat(chunks);
    console.log(`📦 [Worker] 下載完成，大小: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // ==========================================
    // ⚙️ 轉換階段 (使用 progressCallback)
    // ==========================================
    console.log(`⚙️ [Convert] 開始轉檔 (.frag)...`);
    // 定義節流變數，避免 Redis 被call爛
    let lastReportTime = 0;
    const start = performance.now();
    
    const modelData = await serializer.process({
        bytes: new Uint8Array(fileBuffer),
        progressCallback:(progress)=>{
            //progress 0-1
            const now = Date.now();
            // 節流：每 1 秒才允許更新一次 Redis
            if((now - lastReportTime) > 1000){
                lastReportTime = now;

                // 轉換階段進度映射：40% ~ 90%
                // 公式： 40 + (progress * 0.5)
                const totalProgress = Math.round(40 + (progress * 50));

                job.updateProgress(totalProgress).catch(e => console.error(e));
            }
            console.log(`正在進行${job.id}轉檔,總進度為${progress}`);
        }
    });
    const duration = (performance.now() - start) / 1000;
    console.log(`✅ [Convert] 轉檔成功！耗時: ${duration.toFixed(2)}s`);
    // ==========================================
    // ⬆️ 上傳階段
    // ==========================================
    // 手動更新到 90% (轉檔完成)
    await job.updateProgress(90);
    const fragKey = fileKey + '.frag'; 
    const fragBuffer = Buffer.from(modelData);

    const bucketExists = await minioClient.bucketExists(FRAG_BUCKET);
    if (!bucketExists) {
        await minioClient.makeBucket(FRAG_BUCKET);
    }

    console.log(`⬆️ [MinIO] 上傳 .frag 檔案: ${fragKey}`);
    await minioClient.putObject(FRAG_BUCKET, fragKey, fragBuffer);
    // 完成！更新到 100%
    await job.updateProgress(100);

    console.log(`🎉 [Job Done] 任務完成！`);
    return { fileKey, fileName, fragKey }; // 回傳結果給 Worker 事件
}

// 這是真正會在背景「一個接一個」執行任務的工人
// 會去檢查redis還有沒有工作
const worker = new Worker('ifc-conversion-queue', async (job) => {
    // job.data 包含我們在 Webhook 裡丟進去的 { fileKey, fileName }
    const { fileKey, fileName } = job.data;
    
    // 執行轉檔
    return await executeConversionTask(job, fileKey, fileName);

}, {
    connection: redisConnection,
    concurrency: 1 // 🔥 關鍵！同時只能有 1 個任務在跑 (避免 OOM)
});

// 監聽 Worker 事件 (通知 Tus Server)

// 成功時通知
worker.on('completed', async (job, result) => {
    const { fileKey, fileName } = job.data;
    console.log(`📞 [Worker] Job ${job.id} 完成，通知 Server...`);

    try {
        await fetch('http://localhost:3003/notify/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileKey: fileKey,
                fileName: fileName,
                status: 'success'
            })
        });
    } catch (e) {
        console.error("❌ 無法通知 Server (Success):", e.message);
    }
});
// 失敗時通知
worker.on('failed', async (job, err) => {
    const { fileKey, fileName } = job.data;
    console.error(`❌ [Worker] Job ${job.id} 失敗: ${err.message}`);

    try {
        await fetch('http://localhost:3003/notify/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileKey: fileKey,
                fileName: fileName,
                status: 'error',
                message: err.message
            })
        });
    } catch (e) {
        console.error("❌ 無法通知 Server (Error):", e.message);
    }
});

// === 設定 Web Server(Webhook 入口) ===
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/webhook/convert', async(req, res) => {
    const { fileKey, fileName } = req.body;
    
    if (!fileKey || !fileName) {
        return res.status(400).send({ error: 'Missing fileKey or fileName' });
    }

    // 把任務加入佇列，然後馬上回應
    try {
        await conversionQueue.add('convert-job', { 
            fileKey, 
            fileName 
        },{
            jobId: fileKey, //強制把 Job ID 設定成跟 fileKey 一樣！
            // 設定自動清理 (重要!!!!!!)
            removeOnComplete: {
                age: 3600, // 保留 1 小時內的紀錄 (秒)
                count: 100 // 或者最多保留最新的 100 筆
            },
            removeOnFail: {
                age: 24 * 3600, // 失敗的保留 24 小時讓我們查修
                count: 50
            }
        });

        console.log(`📨 [Webhook] 已將 ${fileName} 加入佇列等待處理`);
        
        // 這裡回應 200，告訴 Tus Server "我收到了，正在排隊中"
        // 前端會顯示 "Converting..." (因為 Tus Server 尚未廣播 success)
        res.status(200).send({ status: 'Queued', message: 'Job added to queue' });

    } catch (err) {
        console.error("❌ 無法加入佇列:", err);
        res.status(500).send({ error: 'Queue Error' });
    }
});

app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`👷 IfcImporter Worker (ESM) Listening on port ${PORT}`);
    console.log(`👷 IfcImporter Work List on port ${redisConnection.options.port}`);
    console.log(`🐂 BullMQ Worker Started with Concurrency: 1`);
    console.log(`--------------------------------------------------`);
});