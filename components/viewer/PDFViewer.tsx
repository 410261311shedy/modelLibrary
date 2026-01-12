"use client";

import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { PDFViewerRef } from './PDFViewerInternal';

interface PDFViewerProps {
  file: string | File | null;
}

// 將具備瀏覽器依賴的實作邏輯封裝在 PDFViewerInternal 中
// 並透過 dynamic import 禁用 SSR，確保組件自帶相容性
const PDFViewerInternal = dynamic(() => import('./PDFViewerInternal'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
      <Loader2 className="animate-spin" />
      <p className="text-sm">Initializing PDF Viewer...</p>
    </div>
  ),
});

// 使用 forwardRef 包裝動態組件，並將 ref 傳遞給內部組件
const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>((props, ref) => {
  return <PDFViewerInternal {...props} ref={ref} />;
});

PDFViewer.displayName = "PDFViewer";

export default PDFViewer;