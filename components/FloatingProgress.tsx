// src/components/FloatingProgress.tsx
"use client";

import { useUpload } from "@/context/UploadContext";
import { Card, CardBody, Progress, Button } from "@heroui/react";
import { useEffect, useState } from "react";

export const FloatingProgress = () => {
    const { uppy, isUploading } = useUpload();
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        // 監聽 Uppy 的進度事件
        uppy.on('progress', (progress) => {
        setProgress(progress);
        });

        uppy.on('file-added', (file) => {
        setFileName(file.name);
        });

        uppy.on('complete', () => {
            // 完成後可以讓卡片停留幾秒再消失，或是顯示打勾
        });
    }, [uppy]);

    if (!isUploading) return null; // 沒上傳時不顯示

    return (
        <div className="fixed bottom-5 right-5 z-[9999]">
        <Card className="w-[300px] shadow-2xl border border-default-200">
            <CardBody className="gap-3">
            <div className="flex justify-between items-center">
                <span className="text-small font-bold truncate max-w-[200px]">
                {fileName || "Uploading..."}
                </span>
                <span className="text-tiny text-default-500">{progress}%</span>
            </div>
            
            <Progress 
                size="sm" 
                value={progress} 
                color="success" 
                aria-label="Upload progress"
            />
            
            <div className="flex justify-end gap-2">
                <Button 
                    size="sm" 
                    variant="light" 
                    color="danger"
                    onPress={() => uppy.cancelAll()}
                >
                    Cancel
                </Button>
            </div>
            </CardBody>
        </Card>
        </div>
    );
};