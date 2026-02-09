"use client";

import React, { useState, useRef } from 'react';
import { Button,Tooltip } from "@heroui/react";
import { 
  PanelLeftClose, 
  PanelLeftOpen,
  FileText, 
  Box, 
  X, 
  FileUp,
  Download,
  Focus
} from 'lucide-react';
import * as OBC from "@thatopen/components"
import { useUpload } from "@/context/UploadContext";

interface FileItem {
  id: string;
  file: File;
  type: '3d' | 'pdf';
  name: string;
}

interface ModelUploadSidebarProps {
  onFilesChange: (files: FileItem[]) => void;
  onSelectFile: (file: FileItem | null) => void;
  onFocusAllModel: () => void;
  onFocusModel:(modelId:string) => void;
  onExportModelFrag: (modelId: string) => Promise<ArrayBuffer | null>;
  onDeleteModel: (modelId: string) => void;
  selectedFileId: string | null;
}

const ModelUploadSidebar = ({ 
  onFilesChange, 
  onSelectFile,
  onFocusAllModel,
  onFocusModel, 
  onDeleteModel,
  onExportModelFrag,
  selectedFileId 
}: ModelUploadSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  //從 Context 取得 uppy 實例
  const { uppy } = useUpload();

  // 處理檔案上傳邏輯
  const handleFiles = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    // 1. 處理本地狀態 (保持你原本的邏輯，讓 Viewer 可以直接看)
    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = (extension === 'ifc' || extension === 'frag') ? '3d' : 'pdf';
      // testing for telling whether the file loader work
      console.log(`File uploaded: ${file.name}, Extension: .${extension}, Type: ${type}`);
      
      // 我們只上傳 IFC 檔案 (根據你的需求)
      if (extension === 'ifc') {
        try {
          uppy.addFile({
            name: file.name, // 使用檔名作為識別
            type: file.type,
            data: file,      // 傳入原始 File 物件
            source: 'Local',
          });
          console.log(`[Uppy] 檔案 ${file.name} 已加入上傳佇列`);
        } catch (err) {
          // Uppy 如果遇到重複檔案會報錯，這裡攔截避免影響 UI
          console.warn(`[Uppy] 無法加入檔案 (可能已存在):`, err);
        }
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type,
        name: file.name
      };
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    // 處理完後清空 input 的值
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
    }
    // 如果是第一個上傳的檔案，自動選取
    if (files.length === 0 && newFiles.length > 0) {
      onSelectFile(newFiles[0]);
    }
  };

  const focusModel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const fileItem = files.find(f => f.id === id);

    if(fileItem && onFocusModel){
      const modelId = fileItem.name.replace(/\.(ifc|frag)$/i, "");
      onFocusModel(modelId);
    }
    

  }
  const exportFile = async(id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    //find the file
    const fileItem = files.find(f => f.id === id);

    if(fileItem && fileItem.type === '3d' && onExportModelFrag){
      //get model id
      const modelId = fileItem.name.replace(/\.(ifc|frag)$/i, "");

      //call exportModel to get the Uint8Array
      const fragsBuffer = await onExportModelFrag(modelId);

      if(fragsBuffer){

        const file = new File([fragsBuffer], `${modelId}.frag`);    
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);

        console.log(`模型 ${modelId} 匯出成功`);
      } else {
        console.error("無法取得模型數據");
      }
    }
  }
  // 移除檔案以及模型
  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const fileToDelete: FileItem | undefined = files.find(f =>f.id === id);

    if(fileToDelete && fileToDelete.type === '3d' && onDeleteModel){
      const modelId = fileToDelete.name.replace(/\.(ifc|frag)$/i, "");
      onDeleteModel(modelId);
    }

    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (selectedFileId === id) {
      onSelectFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
    }
  };

  // 拖放處理
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  if (isCollapsed) {
    return (
      <div className="relative z-50 flex justify-center items-center w-10 h-10 rounded-xl transition-all duration-300">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsCollapsed(false)}
          aria-label="Expand sidebar"
          className="text-white rounded-xl bg-[#3F3F46] transition-all duration-300 shadow-[0px_0px_2px_0px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33]"
        >
          <PanelLeftOpen size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative z-30 shadow-[inset_0px_1px_5px_rgba(255,255,255,0.8),inset_0px_-1px_3px_rgba(0,0,0,0.8)] dark:shadow-[inset_0px_2px_1px_rgba(255,255,245,0.2),inset_0px_-2px_8px_rgba(0,0,0,0.4),0px_25px_50px_-12px_#00000040] rounded-[14px] h-full w-72 bg-[#18181B] flex flex-col transition-all duration-300 overflow-hidden">
      {/* 標題欄 */}
      <div className="p-4 flex justify-between items-center border-b border-[#FFFFFF1A]">
        <h3 className="font-inter text-[#A1A1AA] flex items-center gap-2">
          <Box size={18} />
          2D/ 3D Models
        </h3>
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsCollapsed(true)}
          aria-label="Collapse sidebar"
          className="text-white rounded-xl bg-[#3F3F46] shadow-[0px_0px_2px_0px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33]"
        >
          <PanelLeftClose size={20} />
        </Button>
      </div>

      {/* 上傳區域 (Importing) */}
      <div className="p-4">
        <p className="text-[#A1A1AA] font-inter text-xs mb-2 uppercase">Importing</p>
        <div 
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#D70036] transition-colors bg-[#27272A]"
        >
          <div>
            <FileUp size={32} className="text-white" />
          </div>
          <p className="text-white text-xs text-center">
            Drop your files here or <span className="text-[#D70036] hover:underline">browse</span>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            aria-label="Upload 3D models or PDF files"
            className="hidden"
            multiple
            accept=".ifc,.frag,.pdf"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* 已載入列表 (Loaded Models) */}
      <div className="flex-grow overflow-y-auto p-4 border-t border-[#FFFFFF1A]">
        <div className='flex items-center justify-between px-2'>
          <p className="font-inter text-[#A1A1AA] text-xs mb-2 uppercase">Loaded Models</p>
          <button
            onClick={(e)=>{e.preventDefault(); onFocusAllModel();}}
            aria-label={`Focus whole`}
            className={`text-white`} 
            >
            <Focus size={14} className='mb-3'/>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {files.length === 0 ? (
            <p className="text-gray-500 text-xs italic text-center mt-4">No models loaded yet</p>
          ) : (
            files.map((fileItem) => (
              <div 
                key={fileItem.id}
                onClick={() => onSelectFile(fileItem)}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  selectedFileId === fileItem.id 
                  ? 'bg-[#D70036] text-white shadow-lg' 
                  : 'bg-[#27272A] text-gray-300 hover:bg-[#3F3F46]'
                }`}
              >
                {fileItem.type === '3d' ? <Box size={18} /> : <FileText size={18} />}
                <Tooltip content={`${fileItem.name}`} placement='bottom'>
                  <span className="text-xs truncate flex-grow">                    
                      {fileItem.name}
                  </span>
                </Tooltip>
                <Tooltip content={`Focus`} placement='bottom'>
                  <button
                    onClick={(e) => focusModel(fileItem.id, e)}
                    aria-label={`Focus ${fileItem.name}`}
                    className={`${fileItem.type === 'pdf' ? "hidden":null} opacity-0 group-hover:opacity-100 hover:text-white transition-opacity`}
                    >
                    <Focus size={14}/>
                  </button>
                </Tooltip>
                <Tooltip content={`Download`} placement='bottom'>
                  <button
                    onClick={(e) => exportFile(fileItem.id, e)}
                    aria-label={`export ${fileItem.name}`}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                    >
                    <Download size={14}/>
                  </button>
                </Tooltip>
                <Tooltip content={`Remove`} placement='bottom'>
                  <button
                    onClick={(e) => removeFile(fileItem.id, e)}
                    aria-label={`Remove ${fileItem.name}`}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelUploadSidebar;