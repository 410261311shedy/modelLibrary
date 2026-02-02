'use client'
import React, { useState, useRef, useCallback } from 'react';
import SidebarUpload from '@/components/sidebar/SidebarUpload';
import SidebarBlobs from '@/components/blobs/SidebarBlobs';
import Viewer3D, { Viewer3DRef } from '@/components/viewer/Viewer3D';
import PDFViewer from '@/components/viewer/PDFViewer';
import { PDFViewerRef } from '@/components/viewer/PDFViewerInternal';
import ModelUploadSidebar from '@/components/sidebar/ModelUploadSidebar';
import MetadataForm, { Metadata } from '@/components/forms/MetadataForm';
import { Loader2 } from 'lucide-react';

// 定義檔案項目介面
export interface FileItem {
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
    const [IFCProcessingStatus, setIFCProcessingStatus] = useState<{
        isIFCProcessing: boolean;
        fileName: string | null;
    }>({ isIFCProcessing: false, fileName: null });

    // MetadataForm的狀態由父層存取 方便提交跟狀態管理
    const [metadata, setMetadata] = useState<Metadata>({
        title: "",
        category: "",
        keywords: "",
        description: "",
        permission: "standard",
        team: "",
        associatedModel: ""
    });

    const viewerRef = useRef<Viewer3DRef>(null);
    const pdfRef = useRef<PDFViewerRef>(null);

    //for breaking infinite rendering in viewer3D syncModels
    const handleIFCProcessingChange = useCallback((isIFCProcessing:boolean,fileName: string | null) => {
        setIFCProcessingStatus({isIFCProcessing,fileName});
    }, []);

    // 處理下一步按鈕
    const handleNextButton = async () => {
        if (step === 2) {
            let screenshot = null;
            
            if (selectedFile?.type === 'pdf' && pdfRef.current) {
                // 處理 PDF 截圖
                screenshot = await pdfRef.current.takeScreenshot();
            } else if (viewerRef.current) {
                // 處理 3D 模型截圖
                screenshot = viewerRef.current.takeScreenshot();
            }

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
            metadata: metadata // 使用最新的 metadata 狀態
            // 這裡之後會從 MetadataForm 取得資料
        });
        // 實作 API 呼叫
        alert("模型卡片建立成功！(API 串接開發中)");
    };

    // 處理上一步按鈕
    const handleBackButton = () => {
        if(step === 1){

        }

        setStep((prev) => Math.max(prev - 1, 1));
    };
    console.log(`選擇file:${selectedFile?.name}`);
    console.log(uploadedFiles.map((a)=>(a.name)));
    return (
    <div className='min-h-screen bg-[#27272A] relative'>
        {/* 全螢幕遮罩：當 isIFCProcessing 為 true 時顯示 */}
        {IFCProcessingStatus.isIFCProcessing && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="bg-[#18181B] p-8 rounded-2xl shadow-2xl border border-[#FFFFFF1A] flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin text-[#D70036]" />
                    <div className="text-center">
                        <h3 className="text-white font-bold text-lg">正在解析模型中...</h3>
                        <p className="text-gray-400 text-sm">請勿關閉視窗或進行其他操作</p>
                        {/* 顯示目前處理的檔名 */}
                        {IFCProcessingStatus.fileName && (
                            <p className="text-[#D70036] text-xs mt-4 font-mono bg-[#D70036]/10 px-3 py-1 rounded-full">
                                Processing: {IFCProcessingStatus.fileName}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )}
        <div className='flex w-full h-screen gap-4 p-2 '>
            {/* 左側步驟導覽列 */}
            <div className='relative overflow-hidden rounded-lg border-[5px] border-[rgba(40,48,62,0.6)] shrink-0'>
                <SidebarBlobs/>
                {/* 建立一個絕對定位的層，專門放陰影，並確保它在背景之上 */}
                <div className='absolute inset-0 pointer-events-none shadow-[inset_0px_0px_27.1px_0px_#000000] z-10'/>
                <SidebarUpload 
                    currentStep={step}
                    onNext={handleNextButton}
                    onBack={handleBackButton}
                />
            </div>
            
                {/* 右側 Viewer 區域 */}
            
            <div className='flex grow rounded-lg overflow-hidden p-1'>{/*p-1 for showing the outer shadow*/}
                <div className='relative rounded-lg bg-[#18181B] grow shadow-[0px_3px_1.8px_0px_#FFFFFF29,0px_-2px_1.9px_0px_#00000040,0px_0px_4px_0px_#FBFBFB3D]'>
                    {/* 內凹陰影裝飾層 */}
                    <div className='absolute inset-0 z-50 rounded-lg pointer-events-none shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_0px_#00000099]'/>
                    {/* 根據步驟與檔案類型渲染內容 */}
                    <div className='rounded-lg w-full h-full overflow-hidden relative'>
                        <div className={`absolute inset-0 ${step === 3 ? "hidden":"block"}`} >
                                    {(!selectedFile || selectedFile.type === '3d') ? (
                                        <Viewer3D ref={viewerRef} allFiles={uploadedFiles} file={selectedFile?.file} onIFCProcessingChange={handleIFCProcessingChange} />
                                    ) : (
                                        <PDFViewer ref={pdfRef} file={selectedFile.file} />
                                    )}
                        </div>
                        <div className={`absolute left-2 top-[5%] h-[90%] ${(step === 2 || step === 3 )? "hidden":"block"}`}>
                                    <ModelUploadSidebar 
                                        onFilesChange={setUploadedFiles}
                                        onSelectFile={setSelectedFile}
                                        selectedFileId={selectedFile?.id || null}
                                        onFocusAllModel={()=>viewerRef.current?.focusAllModel()}
                                        onFocusModel={(modelId) => viewerRef.current?.focusModel(modelId)}
                                        onExportModelFrag={async (modelId) => {
                                            if (viewerRef.current) {
                                                return viewerRef.current.exportModelFrag(modelId);
                                            }
                                            return null;
                                        }}
                                        onDeleteModel={(modelId) => viewerRef.current?.deleteModel(modelId)}
                                    />
                        </div>
                        {step === 2 && (
                            <div className='w-full h-full flex items-center justify-center text-white relative pointer-events-none'>
                                
                                {/* 封面擷取範圍框 (紅色方框) */}
                                <div className="absolute z-30 inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-full h-full rounded-lg aspect-video border-4 border-red-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                                </div>
                                <div className="absolute top-10 text-white bg-black/50 px-4 py-2 rounded-full">
                                    請調整視角，點擊 Next 將擷取紅框範圍作為封面
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className='w-full h-full p-8 bg-[#27272A] overflow-y-auto'>
                                <div className='max-w-[90%] mx-auto w-full font-inter'>
                                    <h2 className="text-xl text-white">Metadata</h2>
                                    <p className='text-xs text-[#A1A1AA] mb-2'>Fill in the model metadata make people more understand your model</p>
                                    <MetadataForm
                                        coverImage={coverImage}
                                        onCoverChange={setCoverImage}
                                        metadata={metadata}
                                        onMetadataChange={setMetadata}
                                    />
                                </div>
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