// This is for upload IFC Files to tus then to minio
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Uppy, { Uppy as UppyType } from "@uppy/core";
import Tus from "@uppy/tus";

// 定義 Context 的內容
interface UploadContextType {
    uppy: UppyType;
    isUploading: boolean;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [isUploading, setIsUploading] = useState(false);
    
    // 1. 初始化 Uppy (只執行一次)
    const [uppy] = useState(() => {
        const uppyInstance = new Uppy({
        autoProceed: true, // 選完檔案自動上傳
        restrictions: {
            // maxFileSize: 3 * 1024 * 1024 * 1024, // 限制 3GB
            allowedFileTypes: ['.ifc'], // 只允許 IFC
        },
        });

        // 2. 設定 Tus Plugin (指向你的 Node.js Server)
        uppyInstance.use(Tus, {
        endpoint: "http://localhost:3003/files/", // ⚠️ 注意這裡是 3003
        chunkSize: 5 * 1024 * 1024, // 5MB 切片
        retryDelays: [0, 1000, 3000, 5000], // 斷線重連機制
        removeFingerprintOnSuccess: true,
        });

        return uppyInstance;
    });

    // 3. 監聽上傳狀態 (用來控制全域 UI 顯示)
    useEffect(() => {
        // 當有檔案新增時
        uppy.on('file-added', () => setIsUploading(true));
        // 當全部完成時
        uppy.on('complete', (result) => {
            console.log("全部上傳完成:", result.successful);
            // setIsUploading(false); // 這裡先註解，你可以讓使用者手動關閉
        });
    }, [uppy]);

    return (
        <UploadContext.Provider value={{ uppy, isUploading }}>
        {children}
        </UploadContext.Provider>
    );
};

// 匯出 Hook 方便在任何組件使用
export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};