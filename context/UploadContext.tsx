// src/context/UploadContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Uppy, { Uppy as UppyType } from "@uppy/core";
import Tus from "@uppy/tus";
import { io, Socket } from "socket.io-client";
import { addToast } from "@heroui/toast"; // 使用 HeroUI Toast

// 定義 TrackedFile 介面 (如上所述)
export interface TrackedFile {
    uppyId:string;  // Uppy 的 ID (前端用)
    tusId: string;  // Tus/Server 的 ID (後端用)
    name: string;
    progress: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    errorMessage?: string;
}

interface UploadContextType {
    uppy: UppyType;
    trackedFiles: Record<string, TrackedFile>; // Key 是 uppyId
    cancelFile: (fileId: string) => void;
    cancelAll: () => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    // 使用物件來儲存狀態，確保可以透過 ID 快速更新
    const [trackedFiles, setTrackedFiles] = useState<Record<string, TrackedFile>>({});

    // 1. 初始化 Uppy
    const [uppy] = useState(() => {
        const uppyInstance = new Uppy({
        id: 'uppy-global',
        autoProceed: true,
        restrictions: { allowedFileTypes: ['.ifc'] },
        });

        uppyInstance.use(Tus, {
        endpoint: "http://localhost:3003/files/", // 指向你的 Tus Server
        chunkSize: 5 * 1024 * 1024,
        retryDelays: [0, 1000, 3000, 5000],
        removeFingerprintOnSuccess: true,
        });

        return uppyInstance;
    });

    // 2. WebSocket 監聽 (處理轉檔通知)
    useEffect(() => {
        const socket: Socket = io("http://localhost:3003");

        socket.on("connect", () => {
        console.log("🔌 Socket connected");
        });

        // 監聽 Worker 完成訊號
        socket.on("conversion-complete", (data: { fileId: string, status: string, message?: string }) => {
            console.log("✅ Socket 收到通知:", data);

            setTrackedFiles((prev) => {
                // 用 data.fileId (TusId) 反查 uppyId
                const uppyId = Object.keys(prev).find(key => prev[key].tusId === data.fileId);
                // 如果找不到對應的檔案 (可能已被移除)，就直接返回
                if (!uppyId) {
                    console.warn(`⚠️ 收到通知但找不到對應檔案: TusID=${data.fileId}`);
                    console.warn(`🔍 目前的 TrackedFiles 狀態:`, JSON.stringify(prev, null, 2));
                    return prev;
                }

                const updatedFiles = { ...prev };
                const file = updatedFiles[uppyId];

                if (data.status === 'success') {
                    // 更新狀態為完成
                    updatedFiles[uppyId] = {
                        ...file, 
                        status: 'completed', 
                        progress: 100
                    };

                // 把副作用 (Side Effects) 移到 setTimeout 裡
                // 這樣可以確保它在當前渲染週期結束後才執行，避開 React 警告
                setTimeout(()=>{
                    // HeroUI Toast 通知
                    addToast({
                        title: "轉檔完成",
                        description: `${file.name} 已準備就緒`,
                        color: "success",
                        timeout: 5000,
                    });
                    //3秒後從追蹤清單中移除
                    setTimeout(() => removeFileFromTracking(uppyId), 3000);
                },0);

                } else {
                    // 更新狀態為錯誤
                    updatedFiles[uppyId] = { 
                        ...file, 
                        status: 'error', 
                        errorMessage: data.message 
                    };
                    
                    addToast({
                        title: "轉檔失敗",
                        description: data.message || "未知錯誤",
                        color: "danger",
                    });
                }
            return updatedFiles;
        });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // 輔助函式：從 React State 中移除檔案
    const removeFileFromTracking = (uppyId: string) => {
        setTrackedFiles((prev) => {
        const newState = { ...prev };
        delete newState[uppyId];
        return newState;
        });
        // 同步移除 Uppy 內部狀態 (如果還存在)
        try { uppy.removeFile(uppyId); } catch (e) {}
    };

    // 3. Uppy 事件監聽 (同步 React State)
    useEffect(() => {
        // A. 檔案加入：初始化狀態
        uppy.on('file-added', (file) => {
            setTrackedFiles(prev => ({
                ...prev,
                [file.id]: {
                    uppyId: file.id,
                    tusId: "",
                    name: file.name,
                    progress: 0,
                    status: 'uploading'
                }as TrackedFile
            }));
        });

        // B. 上傳進度更新
        uppy.on('upload-progress', (file, progress) => {
            if (!file || !progress.bytesTotal || !progress.bytesUploaded ) return;
            const percentage = progress.bytesTotal > 0 
                ? Math.round((progress.bytesUploaded / progress.bytesTotal) * 100) 
                : 0;

            setTrackedFiles(prev => {
                // 效能優化：進度沒變就不更新 State
                if (prev[file.id]?.progress === percentage) return prev;
                
                return {
                ...prev,
                [file.id]: { 
                    ...prev[file.id], 
                    progress: percentage, 
                    status: 'uploading' }
                };
            });
        });

        // C. 上傳完成 (Tus 結束 -> 進入 Worker 等待期)
        uppy.on('upload-success', (file) => {
        if (!file) return;
        console.log("🔍 [Debug] File Object:", file);
        console.log(`🚀 [Uppy] ${file.name} 上傳 MinIO 完畢，等待轉檔...`);
        const uploadUrlFromTus = file.tus?.uploadUrl;
        const fileid = uploadUrlFromTus?.split('/').pop();
        console.log(`🚀 [Uppy] 提取出fileid${fileid}，提供後續比對使用 填入tusId `);
        setTrackedFiles(prev => ({
            ...prev,
            [file.id]: { 
            ...prev[file.id], 
            tusId: fileid,
            progress: 100, 
            status: 'processing' // 切換狀態為轉檔中 (藍色流動條)
            } as TrackedFile
        }));
        });

        // D. 上傳錯誤
        uppy.on('upload-error', (file, error) => {
        if (!file) return;
        setTrackedFiles(prev => ({
            ...prev,
            [file.id]: { ...prev[file.id], status: 'error', errorMessage: error.message }
        }));
        addToast({ title: "上傳失敗", description: file.name, color: "danger" });
        });

        // E. 檔案被移除 (Cancel)
        uppy.on('file-removed', (file) => {
        removeFileFromTracking(file.id);
        });

        // F. 全部取消
        uppy.on('cancel-all', () => {
        setTrackedFiles({});
        addToast({ title: "已取消所有任務", color: "default" });
        });

    }, [uppy]);

    const cancelFile = (fileId: string) => {
        uppy.removeFile(fileId); // 這會觸發 'file-removed' 事件，進而清理 State
    };

    const cancelAll = () => {
        uppy.cancelAll();
    };

    return (
        <UploadContext.Provider value={{ uppy, trackedFiles, cancelFile, cancelAll }}>
        {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};