// 這個文件將處理所有 NextAuth.js 的 API 請求。
import { handlers } from "@/auth"; // 引用您在 auth.ts 中導出的 handlers
export const { GET, POST } = handlers;