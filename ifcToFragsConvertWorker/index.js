import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as Minio from 'minio';

// 引入核心套件 (ESM)
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取上一層的 .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

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

// === 3. 設定 Web Server ===
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3005;

async function processFile(fileKey, fileName) {
    console.log(`🚀 [Worker] 開始處理: ${fileName} (Key: ${fileKey})`);
    
    try {
        // 下載 IFC
        console.log(`⬇️ [MinIO] 正在下載...`);
        const fileStream = await minioClient.getObject(IFC_BUCKET, fileKey);
        const chunks = [];
        
        for await (const chunk of fileStream) {
            chunks.push(chunk);
        }
        
        const fileBuffer = Buffer.concat(chunks);
        
        console.log(`📦 [Worker] 下載完成，大小: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        // 執行轉換
        console.log(`⚙️ [Convert] 開始轉檔 (.frag)...`);
        const start = performance.now();
        
        // 核心轉換
        const modelData = await serializer.process({bytes: new Uint8Array(fileBuffer)});
        
        const duration = (performance.now() - start) / 1000;
        console.log(`✅ [Convert] 轉檔成功！耗時: ${duration.toFixed(2)}s`);

        // 上傳 .frag
        const fragKey = fileKey + '.frag'; 
        const fragBuffer = Buffer.from(modelData);

        const bucketExists = await minioClient.bucketExists(FRAG_BUCKET);
        if (!bucketExists) {
            await minioClient.makeBucket(FRAG_BUCKET);
        }

        console.log(`⬆️ [MinIO] 上傳 .frag 檔案: ${fragKey}`);
        await minioClient.putObject(FRAG_BUCKET, fragKey, fragBuffer);

        console.log(`🎉 [Done] 任務完成！`);

        // 通知tus server (socket hub)
        await fetch('http://localhost:3003/notify/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileKey: fileKey,
                fileName: fileName,
                status: 'success'
            })
        });
        console.log(`📞 [Worker] 已通知 Tus Server 廣播消息`);

    } catch (err) {
        console.error(`❌ [Error] 處理失敗: ${fileName}`);
        console.error(err);
        // 通知tus server 失敗也要通知
        await fetch('http://localhost:3003/notify/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileKey: fileKey,
                fileName: fileName,
                status: 'error',
                message: err.message
            })
        }).catch(e => console.error("無法通知 Server:", e));
    }
}

app.post('/webhook/convert', (req, res) => {
    const { fileKey, fileName } = req.body;
    
    if (!fileKey || !fileName) {
        return res.status(400).send({ error: 'Missing fileKey or fileName' });
    }

    console.log(`📨 [Webhook] 收到通知: ${fileName}`);
    res.status(200).send({ status: 'Processing started' });
    
    // 非同步處理
    processFile(fileKey, fileName);
});

app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`👷 IfcImporter Worker (ESM) Listening on port ${PORT}`);
    console.log(`--------------------------------------------------`);
});