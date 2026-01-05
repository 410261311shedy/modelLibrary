'use client'
import React, { useState, useRef } from 'react';
import SidebarUpload from '@/components/sidebar/SidebarUpload';
import SidebarBlobs from '@/components/blobs/SidebarBlobs';
import Viewer3D, { Viewer3DRef } from '@/components/viewer/Viewer3D';
import PDFViewer from '@/components/viewer/PDFViewer';
import ModelUploadSidebar from '@/components/sidebar/ModelUploadSidebar';
import MetadataForm from '@/components/forms/MetadataForm';

// 定義檔案項目介面
interface FileItem {
  id: string;
  file: File;
  type: '3d' | 'pdf';
  name: string;
}

const Upload = () => {
    const [step, setStep] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    
    const viewerRef = useRef<Viewer3DRef>(null);

    // 處理下一步按鈕
    const handleNextButton = () => {
        if (step === 2 && viewerRef.current) {
            // 在 Step 2 點擊 Next 時擷取封面
            const screenshot = viewerRef.current.takeScreenshot();
            if (screenshot) {
                setCoverImage(screenshot);
                console.log("封面擷取成功！");
            }
        }
        if (step === 3) {
            // 最後一步點擊 Create
            handleCreate();
            return;
        }
        setStep((next) => Math.min(next + 1, 3));
    };

    // 處理最終建立邏輯
    const handleCreate = async () => {
        console.log("正在建立模型卡片...", {
            files: uploadedFiles,
            cover: coverImage,
            // 這裡之後會從 MetadataForm 取得資料
        });
        // 實作 API 呼叫
        alert("模型卡片建立成功！(API 串接開發中)");
    };

    // 處理上一步按鈕
    const handleBackButton = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
    <div className='min-h-screen bg-[#27272A] relative '>
        <div className='flex w-full h-screen gap-4 p-2 '>
            {/* 左側步驟導覽列 */}
            <div className='relative overflow-hidden rounded-lg border-[5px] border-[#FFFFFF29] shrink-0'>
                <SidebarBlobs/>
                {/* 建立一個絕對定位的層，專門放陰影，並確保它在背景之上 */}
                <div className='absolute inset-0 pointer-events-none shadow-[inset_0px_0px_27.1px_0px_#000000] z-10'/>
                <SidebarUpload 
                    currentStep={step}
                    onNext={handleNextButton}
                    onBack={handleBackButton}
                />
            </div>

            {/* 中間內容區域：包含模型上傳側邊欄與 Viewer */}
            <div className='flex-grow flex gap-4 overflow-hidden'>
                {/* Step 1 特有的模型上傳側邊欄 */}
                {step === 1 && (
                    <div className='shrink-0 h-full rounded-lg overflow-hidden border-[5px] border-[#FFFFFF29] relative'>
                        <ModelUploadSidebar 
                            onFilesChange={setUploadedFiles}
                            onSelectFile={setSelectedFile}
                            selectedFileId={selectedFile?.id || null}
                        />
                    </div>
                )}

                {/* 右側 Viewer 區域 */}
                <div className='relative rounded-lg bg-[#18181B] flex-grow overflow-hidden border-[5px] border-[#FFFFFF29]'>
                    {/* 內凹陰影裝飾層 */}
                    <div className='absolute inset-0 z-10 rounded-lg pointer-events-none shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_0px_#00000099,0px_3px_1.8px_0px_#FFFFFF29,0px_-2px_1.9px_0px_#00000040,0px_0px_4px_0px_#FBFBFB3D]'/>
                    
                    {/* 根據步驟與檔案類型渲染內容 */}
                    <div className='w-full h-full'>
                        {step === 1 && (
                            <>
                                {(!selectedFile || selectedFile.type === '3d') ? (
                                    <Viewer3D ref={viewerRef} file={selectedFile?.file} />
                                ) : (
                                    <PDFViewer file={selectedFile.file} />
                                )}
                            </>
                        )}
                        {step === 2 && (
                            <div className='w-full h-full flex items-center justify-center text-white relative'>
                                <Viewer3D ref={viewerRef} file={selectedFile?.file} />
                                {/* 封面擷取範圍框 (紅色方框) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[60%] aspect-video border-4 border-red-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                                </div>
                                <div className="absolute top-10 text-white bg-black/50 px-4 py-2 rounded-full">
                                    請調整視角，點擊 Next 將擷取紅框範圍作為封面
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className='w-full h-full bg-[#18181B] p-8 overflow-y-auto'>
                                <h2 className="text-2xl font-bold text-white mb-6">Metadata</h2>
                                <MetadataForm
                                    coverImage={coverImage}
                                    onSubmit={(data) => console.log("Metadata submitted:", data)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>  
    );
}

export default Upload;