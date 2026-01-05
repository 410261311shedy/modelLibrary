"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@heroui/react";
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Upload, 
  FileText, 
  Box, 
  X 
} from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  type: '3d' | 'pdf';
  name: string;
}

interface ModelUploadSidebarProps {
  onFilesChange: (files: FileItem[]) => void;
  onSelectFile: (file: FileItem | null) => void;
  selectedFileId: string | null;
}

const ModelUploadSidebar = ({ 
  onFilesChange, 
  onSelectFile, 
  selectedFileId 
}: ModelUploadSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理檔案上傳邏輯
  const handleFiles = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = (extension === 'ifc' || extension === 'frag') ? '3d' : 'pdf';
      // testing for telling whether the file loader work
      console.log(`File uploaded: ${file.name}, Extension: .${extension}, Type: ${type}`);
      
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

    // 如果是第一個上傳的檔案，自動選取
    if (files.length === 0 && newFiles.length > 0) {
      onSelectFile(newFiles[0]);
    }
  };

  // 移除檔案
  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
      <div className="h-full w-12 bg-[#18181B] border-r border-[#FFFFFF1A] flex flex-col items-center py-4 gap-4 transition-all duration-300">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsCollapsed(false)}
          aria-label="Expand sidebar"
          className="text-white"
        >
          <PanelLeftOpen size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-72 bg-[#18181B] border-r border-[#FFFFFF1A] flex flex-col transition-all duration-300 overflow-hidden">
      {/* 標題欄 */}
      <div className="p-4 flex justify-between items-center border-b border-[#FFFFFF1A]">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Box size={18} />
          2D/ 3D Models
        </h3>
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsCollapsed(true)}
          aria-label="Collapse sidebar"
          className="text-white"
        >
          <PanelLeftClose size={20} />
        </Button>
      </div>

      {/* 上傳區域 (Importing) */}
      <div className="p-4">
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Importing</p>
        <div 
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#FFFFFF33] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#D70036] transition-colors bg-[#27272A]"
        >
          <div className="bg-[#3F3F46] p-2 rounded-lg">
            <Upload size={24} className="text-white" />
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
      <div className="flex-grow overflow-y-auto p-4">
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Loaded Models</p>
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
                <span className="text-xs truncate flex-grow">{fileItem.name}</span>
                <button
                  onClick={(e) => removeFile(fileItem.id, e)}
                  aria-label={`Remove ${fileItem.name}`}
                  className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelUploadSidebar;