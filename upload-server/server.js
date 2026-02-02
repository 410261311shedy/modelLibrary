import { Server } from '@tus/server';
import { S3Store } from '@tus/s3-store';
import { S3Client } from '@aws-sdk/client-s3';
import http from 'http';
import dotenv from 'dotenv';

// 讀取 .env 環境變數
dotenv.config();

// 1. 設定 MinIO 連線 (模擬 AWS S3)
const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

// 2. 設定儲存庫 (Store)
const store = new S3Store({
  partSize: 8 * 1024 * 1024, // 8MB
  s3ClientConfig: {
    bucket: process.env.S3_BUCKET || 'ifc_files',
    client: s3Client,
  },
});

// 3. 建立 Tus 伺服器實例
const tusServer = new Server({
  path: '/files',
  datastore: store,
  namingFunction: (req) => {
    // 這裡我們暫時回傳 undefined，讓 tus 自動生成隨機 ID
    return undefined;
  }
});

// 4. 建立 HTTP 伺服器 (為了處理 CORS)
const server = http.createServer((req, res) => {
  // --- 設定 CORS Headers (解決跨域問題) ---
  // 允許的來源：在開發階段可以使用 '*'，正式上線建議改成你的前端網址
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 允許的方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, HEAD, OPTIONS');
  // 允許的標頭 (Tus 協議需要很多自定義標頭)
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Location, Tus-Resumable, Upload-Length, Upload-Metadata, Upload-Offset, Tus-Version, Tus-Extension, Tus-Max-Size, X-HTTP-Method-Override');
  // 允許暴露的標頭 (讓前端讀得到上傳進度)
  res.setHeader('Access-Control-Expose-Headers', 'Upload-Offset, Location, Upload-Length, Tus-Version, Tus-Resumable, Tus-Max-Size, Tus-Extension, Upload-Metadata');

  // --- 處理 Preflight (OPTIONS) 請求 ---
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- 交給 Tus 處理正常的上傳請求 ---
  tusServer.handle(req, res);
});

// 5. 啟動伺服器
const host = '127.0.0.1';
const port = 3001;

server.listen(port, host, () => {
  console.log(`[Tus Server] 上傳服務已啟動！(ESM Mode)`);
  console.log(`[Tus Server] 監聽位置: http://${host}:${port}/files`);
  console.log(`[Config] 目標 Bucket: ${process.env.S3_BUCKET || 'ifc_files'}`);
});
// ## 📊 目前專案進度總覽

// 根據開發日誌，你的專案目前已經完成了相當完整的基礎建設。讓我為你整理一下：

// ### ✅ 已完成的主要功能模組

// #### 1. __驗證系統 (Authentication)__ - 100% 完成

// - Credentials 登入/註冊（含密碼雜湊）
// - Google OAuth 整合
// - Session 管理與 JWT 配置
// - MongoDB 使用者資料同步

// #### 2. __3D BIM 視圖系統__ - 95% 完成

// - That Open Engine 整合
// - IFC/FRAG 模型載入與渲染
// - 模型聚焦、匯出、刪除功能
// - 截圖功能（用於封面擷取）
// - Web Worker 優化大型模型載入

// #### 3. __PDF 閱讀器__ - 100% 完成

// - SSR 相容性處理
// - 記憶體優化（Blob URL 管理）
// - 截圖功能整合
// - Canvas 渲染監聽（避免黑屏）

// #### 4. __模型上傳流程 (3 Steps)__ - 90% 完成

// - __Step 1__: 檔案上傳與類型偵測 ✅
// - __Step 2__: 封面圖片擷取（3D/PDF） ✅
// - __Step 3__: Metadata 表單 ✅

// #### 5. __UI/UX 系統__ - 100% 完成

// - 導航系統（Navbar + MegaMenu）
// - 儀表板側邊欄與狀態管理
// - 背景動畫系統（Blobs）
// - 無障礙優化（aria-label）
// - 深色模式支援

// ---

// ### 🚧 __最新進度：檔案上傳至雲端儲存__

// 從你目前打開的檔案來看，你正在實作：

// #### __Tus 協議 + MinIO (S3) 上傳系統__

// - ✅ 已建立 `upload-server/server.js`（Tus 伺服器）
// - ✅ 已建立 `components/upload-components/IfcUploader.tsx`（前端上傳元件）
// - ⚠️ __尚未整合至主要上傳流程__

// __目前狀態：__

// - Tus 伺服器已配置完成（支援斷點續傳、CORS）
// - IfcUploader 元件已建立（使用 Uppy + Tus）
// - __但尚未與 `app/(uploadAndDashboard)/upload/page.tsx` 的 3-Step 流程整合__

// ---

// ### 📋 接下來的工作建議

// 根據目前的進度，我建議以下優先順序：

// #### __優先級 1：完成檔案上傳整合__

// 1. 將 `IfcUploader` 整合至 Step 1 的上傳流程
// 2. 實作上傳完成後的檔案 URL 儲存邏輯
// 3. 測試大型 IFC 檔案的斷點續傳功能

// #### __優先級 2：Metadata 提交與資料庫儲存__

// 1. 建立 Server Action 處理 Step 3 表單提交
// 2. 將模型資訊（標題、類別、封面、檔案 URL）存入 MongoDB
// 3. 實作權限控制邏輯（Standard/Private）

// #### __優先級 3：模型瀏覽與搜尋__

// 1. 實作首頁的模型卡片列表（從資料庫讀取）
// 2. 整合 MegaMenu 的類別篩選功能
// 3. 實作搜尋功能（SearchBar）

// #### __優先級 4：模型詳細頁面__

// 1. 完善 `app/(root)/model/[id]/page.tsx`
// 2. 整合 3D Viewer 顯示已上傳的模型
// 3. 實作下載、收藏等互動功能

// ---

// ### ❓ 需要確認的問題

// 1. __你希望繼續完成 Tus 上傳整合嗎？__ 還是有其他優先要處理的功能？
// 2. __MinIO 服務是否已經啟動？__（需要 Docker Compose）
// 3. __是否需要我協助規劃 Metadata 提交的 Server Action 架構？__

// 請告訴我你想要優先處理哪個部分，我可以為你制定詳細的實作計畫
