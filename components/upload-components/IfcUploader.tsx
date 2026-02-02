"use client"; // Next.js App Router 必須加這行

import React, { useState } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/react/dashboard';

// 引入 Uppy 的 CSS (非常重要，不然介面會跑版)
import '@uppy/core';
import '@uppy/dashboard/dist/style.min.css';

export default function IfcUploader() {
  // 初始化 Uppy (使用 useState 確保只建立一次)
  const [uppy] = useState(() => new Uppy({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['.ifc'], // 限制只能傳 IFC 檔
    },
    autoProceed: false, // 選完檔案後是否自動上傳 (建議 false 讓使用者確認)
  }).use(Tus, {
    // 這裡填寫我們剛剛架設的 Node.js 上傳服務網址
    endpoint: 'http://localhost:3001/files', 
    retryDelays: [0, 1000, 3000, 5000], // 斷線重連機制
  }));

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">IFC 模型上傳區</h2>
      <Dashboard 
        uppy={uppy} 
        width="100%" 
        height="400px"
      />
    </div>
  );
}