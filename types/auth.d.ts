import NextAuth,{DefaultSession} from "next-auth";
import {JWT} from "next-auth/jwt"

declare module "next-auth" {
    /**
     * 擴充 Session 介面
     * 這裡定義 session.user 會有哪些欄位
     */
    interface Session {
        user: {
        id: string
        role: string // 🔥 宣告這裡有 role
        } & DefaultSession["user"]
    }

    /**
     * 擴充 User 介面
     * 這是 authorize 回傳的 user 物件型別
     */
    interface User {
        role: string // 🔥 宣告這裡有 role
    }
}

declare module "next-auth/jwt" {
    /**
     * 擴充 JWT 介面
     * 這是 token 物件的型別
     */
    interface JWT {
        id: string
        role: string // 🔥 宣告這裡有 role
    }
}
