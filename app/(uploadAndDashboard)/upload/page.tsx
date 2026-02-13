'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';
import SidebarUpload from '@/components/sidebar/SidebarUpload';
import SidebarBlobs from '@/components/blobs/SidebarBlobs';
import Viewer3D, { Viewer3DRef } from '@/components/viewer/Viewer3D';
import PDFViewer from '@/components/viewer/PDFViewer';
import { PDFViewerRef } from '@/components/viewer/PDFViewerInternal';
import ModelUploadSidebar from '@/components/sidebar/ModelUploadSidebar';
import MetadataForm, { Metadata, ImageFile } from '@/components/forms/MetadataForm';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Model,UIModel } from '@/types/upload';
import { create3DPost } from '@/lib/actions/post.action';

// 定義檔案項目介面
export interface FileItem {
    id: string;
    file: File;
    type: '3d' | 'pdf';
    name: string;
    fileid?:string;
}

const Upload = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [IFCProcessingStatus, setIFCProcessingStatus] = useState<{
        isIFCProcessing: boolean;
        fileName: string | null;
        progress?:number;
    }>({ isIFCProcessing: false, fileName: null, progress: undefined });
    const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
    // MetadataForm的狀態由父層存取 方便提交跟狀態管理
    const [metadata, setMetadata] = useState<Metadata>({
        title: "",
        category: "",
        keywords: [],
        description: "",
        permission: "standard",
        team: "",
        associatedModel: ""
    });

    const viewerRef = useRef<Viewer3DRef>(null);
    const pdfRef = useRef<PDFViewerRef>(null);

    //for breaking infinite rendering in viewer3D syncModels
    const handleIFCProcessingChange = useCallback((isIFCProcessing:boolean,fileName: string | null, progress?:number) => {
        setIFCProcessingStatus({isIFCProcessing,fileName,progress});
    }, []);
    // 將 Blob URL 轉回 File 物件並上傳
    const uploadImageToMinIO = async (blobUrl: string, filename: string = "image.png") => {
        try {
            // 1. fetch Blob URL 拿到 blob 資料
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            
            // 2. 建立 File 物件
            const file = new File([blob], filename, { type: blob.type });

            // 3. 透過 FormData 上傳到 API Route
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Image upload failed");
            
            const data = await uploadRes.json();
            return data.key as string; // 回傳 MinIO Key

        } catch (error) {
            console.error("Upload helper error:", error);
            return null;
        }
    };
    // 處理下一步按鈕
    const handleNextButton = async () => {
        if (step === 2) {
            let screenshotUrl: string | null = null;
            
            if (selectedFile?.type === 'pdf' && pdfRef.current) {
                // 如果 PDFViewer 也是回傳 Base64，建議之後也可以改成 Blob
                screenshotUrl = await pdfRef.current.takeScreenshot();
            } else if (viewerRef.current) {
                // 🔥 修改這裡：加上 await
                screenshotUrl = await viewerRef.current.takeScreenshot();
            }

            if (screenshotUrl) {
                // 這裡拿到的 screenshotUrl 現在是 "blob:http://localhost:3000/..."
                // 短小精幹，不會塞爆記憶體
                setCoverImage(screenshotUrl);
                console.log("封面擷取成功！(Blob URL)");
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
            additionalImages: additionalImages,
            metadata: metadata // 使用最新的 metadata 狀態
            // 這裡之後會從 MetadataForm 取得資料
        });

        if (!selectedFile) {
            alert("請選擇一個主要模型！");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("1. 開始上傳圖片...");
            
            // A. 上傳封面圖 (如果有)
            let coverKey: string | null = null;
            if (coverImage) {
                coverKey = await uploadImageToMinIO(coverImage, "cover.png");
            }

            // B. 上傳額外圖片 (平行處理，加快速度)
            const imageKeys: string[] = [];
            const uploadPromises = additionalImages.map((img, index) => 
                // 這裡傳入 img.preview (Blob URL) 或是 img.file (原始檔案) 都可以
                // 既然我們已經存了 img.file，直接用 img.file 上傳最快，不用再 fetch blob
                uploadFileDirectly(img.file) 
            );

            // 等待所有圖片上傳完成
            const results = await Promise.all(uploadPromises);
            results.forEach(key => {
                if (key) imageKeys.push(key);
            });

            console.log("2. 圖片上傳完成，寫入資料庫...", { coverKey, imageKeys });

            // C. 呼叫 Server Action 寫入 DB
            const result = await create3DPost({
                metadata: metadata,
                coverImageKey: coverKey,
                imageKeys: imageKeys,
                modelId: selectedFile.id, // 使用者選中的模型 ID
            });

            if (result.success) {
                console.log("✅ 建立成功！");
                redirect('/'); // 或是跳轉到該 Post 頁面
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error("建立失敗:", error);
            alert("建立失敗，請稍後再試");
            setIsSubmitting(false);
        }
    };

    // 直接上傳 File 物件 (給 additionalImages 用)
    const uploadFileDirectly = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/images", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                return data.key as string;
            }
        } catch (e) { console.error(e); }
        return null;
    };

    // 處理上一步按鈕
    const handleBackButton = () => {
        if(step === 1){

        }

        setStep((prev) => Math.max(prev - 1, 1));
    };
    useEffect(() => {
        console.log(`選擇file:${selectedFile?.name}`);
        console.log(uploadedFiles.map((a)=>(a.name)));   
    },[selectedFile,uploadedFiles])
    
    return (
    <div className='min-h-screen bg-[#27272A] relative'>
        {/* 全螢幕遮罩：當 isIFCProcessing 為 true 時顯示 */}
        {/* {IFCProcessingStatus.isIFCProcessing && ( */}
            
        <div className='flex w-full h-screen gap-4 p-2 '>
            {/* 左側步驟導覽列 */}
            <div className='relative overflow-hidden rounded-lg border-[5px] border-[rgba(40,48,62,0.6)] shrink-0'>
                <SidebarBlobs/>
                {/* 建立一個絕對定位的層，專門放陰影，並確保它在背景之上 */}
                <div className='absolute inset-0 pointer-events-none shadow-[inset_0px_0px_27.1px_0px_#000000] z-10'/>
                <SidebarUpload 
                    currentStep={step}
                    onNext={isSubmitting ? ()=>Promise<void> : handleNextButton}
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
                                        getComponents={() => viewerRef.current?.getComponents() || null}
                                        onFilesChange={setUploadedFiles}
                                        onSelectFile={setSelectedFile}
                                        selectedFileId={selectedFile?.id || null}
                                        onLoadModel={(buffer,modelName)=>viewerRef.current?.loadModel(buffer,modelName)}
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
                                        additionalImages={additionalImages}
                                        onAdditionalImagesChange={setAdditionalImages}
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