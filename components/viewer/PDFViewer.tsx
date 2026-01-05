"use client";

import React from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  file: File | null;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
  // 這裡之後可以整合 pdf.js 或簡單使用 iframe/object 預覽
  return (
    <div className="w-full h-full bg-[#18181B] flex flex-col items-center justify-center text-gray-400 gap-4">
      <div className="bg-[#27272A] p-8 rounded-full shadow-2xl">
        <FileText size={64} className="text-[#D70036]" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">PDF 圖紙預覽</h3>
        <p className="text-sm">正在查看：{file?.name || "未選取檔案"}</p>
      </div>
      <div className="mt-8 p-4 bg-[#27272A] rounded-lg border border-[#FFFFFF1A] max-w-md text-xs leading-relaxed">
        提示：此處將整合 PDF 渲染引擎，讓您可以直接在瀏覽器中查看 BIM 相關圖紙與文件。
      </div>
    </div>
  );
};

export default PDFViewer;