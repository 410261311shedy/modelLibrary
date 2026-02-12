// src/types/upload.ts (或是直接寫在 Context 裡)
export type FileStatus = 
  | 'uploading'   // Uppy 正在傳輸到 MinIO
  | 'processing'  // MinIO 上傳完成，等待 Worker 轉檔 (Socket 等待中)
  | 'completed'   // 轉檔完成
  | 'error';      // 失敗

export interface TrackedFile {
    id: string;
    name: string;
    progress: number; // 0-100
    status: FileStatus;
    errorMessage?: string;
}

export interface Model{
  id:string,
  shortId:string,
  name:string,
  fileId:string,
  size:string,
  status:"uploading" | "processing" | "success" | "error";
  createdAt:Date | string;
}

export interface UIModel extends Model {
  type: '3d' | 'pdf';
}

export interface UIModel extends Model {
  type: '3d' | 'pdf';
}