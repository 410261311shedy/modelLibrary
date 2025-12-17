# Next.js 專案中的 Auth 認證功能建立指南

本文件將詳細說明如何在 Next.js 專案中建立 Auth 認證功能，並解釋認證流程以及登入訊息如何在專案中傳遞。我們將使用 NextAuth.js 作為認證解決方案。

## 1. Auth 認證流程概述

1. **NextAuth.js 配置**: 定義認證提供者（例如 GitHub, Google）和相關設定。
2. **API 路由**: 建立 NextAuth.js 的 API 路由來處理所有認證相關請求（登入、登出、回調等）。
3. **登入/註冊頁面**: 提供用戶介面讓用戶進行登入或註冊。
4. **會話管理**: 在應用程式中獲取並使用用戶的會話信息，以判斷用戶是否已登入。

## 2. 如何在新的專案中建立 Auth 功能

### 步驟 1: 安裝 NextAuth.js

首先，在您的 Next.js 專案中安裝 NextAuth.js 及其相關依賴：

```bash
npm install next-auth
# 或者
yarn add next-auth
```

### 步驟 2: 配置 NextAuth.js

在專案根目錄或 `lib` 目錄下創建一個 `auth.ts` 文件（例如：`auth.ts`），用於配置 NextAuth.js。

**`auth.ts` 範例:**

```typescript
// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
   providers: [
      GitHub({
         clientId: process.env.AUTH_GITHUB_ID,
         clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
      Google({
         clientId: process.env.AUTH_GOOGLE_ID,
         clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
   ],
   // 您可以在此處添加更多配置，例如 callbacks, pages 等
});
```

**說明:**

-  `NextAuth` 函數用於初始化 NextAuth.js。
-  `providers` 陣列中定義了您希望支持的認證提供者。這裡以 GitHub 和 Google 為例。
-  `clientId` 和 `clientSecret` 應從環境變數中獲取，以保護敏感信息。

### 步驟 3: 建立 NextAuth.js API 路由

在 `app/api/auth/[...nextauth]/route.ts` 路徑下創建一個文件。這個文件將處理所有 NextAuth.js 的 API 請求。

**`app/api/auth/[...nextauth]/route.ts` 範例:**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // 引用您在 auth.ts 中導出的 handlers
export const { GET, POST } = handlers;
```

**說明:**

-  這個文件將 `auth.ts` 中導出的 `handlers` 重新導出為 `GET` 和 `POST` 方法，Next.js 會自動將這些方法映射到 `/api/auth/*` 路徑。

### 步驟 4: 設定環境變數

在專案根目錄下創建 `.env.local` 文件，並添加您的 OAuth 提供者憑證。

**`.env.local` 範例:**

```
AUTH_GITHUB_ID=您的GitHubClientID
AUTH_GITHUB_SECRET=您的GitHubClientSecret
AUTH_GOOGLE_ID=您的GoogleClientID
AUTH_GOOGLE_SECRET=您的GoogleClientSecret
AUTH_SECRET=一個隨機的長字符串，用於簽署會話
```

**說明:**

-  `AUTH_SECRET` 是一個非常重要的環境變數，用於簽署會話 cookie。請確保它是一個長且隨機的字符串。

### 步驟 5: 在 Root Layout 中整合 SessionProvider

為了讓整個應用程式都能訪問會話信息，您需要在根佈局文件（例如 `app/layout.tsx`）中包裹 `SessionProvider`。

**`app/layout.tsx` 範例:**

```typescript
// app/layout.tsx
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth"; // 引用您在 auth.ts 中導出的 auth 函數

const RootLayout = async ({ children }: { children: ReactNode }) => {
   const session = await auth(); // 在伺服器端獲取會話信息
   return (
      <html lang="en">
         <body>
            {/* 將 session 傳遞給 SessionProvider */}
            <SessionProvider session={session}>{children}</SessionProvider>
         </body>
      </html>
   );
};

export default RootLayout;
```

**說明:**

-  `await auth()` 是一個伺服器組件函數，用於在伺服器端獲取當前用戶的會話。
-  `SessionProvider` 是一個客戶端組件，它將會話信息提供給其子組件。

### 步驟 6: 在客戶端組件中使用會話信息

在任何客戶端組件中，您可以使用 `useSession` hook 來訪問會話數據。

**客戶端組件範例:**

```typescript
// components/SomeClientComponent.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const SomeClientComponent = () => {
   const { data: session, status } = useSession();

   if (status === "loading") {
      return &lt;div>Loading...&lt;/div>;
   }

   if (session) {
      return (
         &lt;div>
            &lt;p>Welcome, {session.user?.name}!&lt;/p>
            &lt;button onClick={() => signOut()}>Sign out&lt;/button>
         &lt;/div>
      );
   }

   return (
      &lt;div>
         &lt;p>You are not signed in.&lt;/p>
         &lt;button onClick={() => signIn()}>Sign in&lt;/button>
      &lt;/div>
   );
};

export default SomeClientComponent;
```

**說明:**

-  `useSession()` 返回一個包含 `data` (會話對象) 和 `status` (會話狀態：`"loading"`, `"authenticated"`, `"unauthenticated"`) 的對象。
-  `signIn()` 和 `signOut()` 函數用於觸發登入和登出流程。

### 步驟 7: 建立登入/註冊頁面 (可選，但推薦)

您可以創建自定義的登入和註冊頁面，而不是使用 NextAuth.js 提供的默認頁面。

**`app/(auth)/sign-in/page.tsx` 範例 (使用自定義表單):**

```typescript
// app/(auth)/sign-in/page.tsx
"use client";

import AuthForm from "@/components/forms/AuthForm"; // 假設您有一個 AuthForm 組件
import { SignInSchema } from "@/lib/validations"; // 假設您有驗證 schema
import { signIn } from "next-auth/react"; // 引入 signIn 函數

const SignInPage = () => {
   const handleSubmit = async (data: any) => {
      // 這裡可以處理您的自定義登入邏輯，例如使用 credentials provider
      // 或者直接調用 NextAuth.js 的 signIn 函數進行 OAuth 登入
      const result = await signIn("github", { redirect: false, callbackUrl: "/" }); // 以 GitHub 為例
      if (result?.error) {
         console.error(result.error);
         // 處理錯誤
      } else {
         // 登入成功
      }
      return { success: true, data };
   };

   return (
      &lt;AuthForm
         formType="SIGN_IN"
         schema={SignInSchema}
         defaultValues={{ email: "", password: "" }}
         onSubmit={handleSubmit}
      />
   );
};

export default SignInPage;
```

**說明:**

-  您可以根據需要自定義 `AuthForm` 組件和驗證邏輯。
-  `signIn()` 函數可以接受提供者名稱（例如 `"github"`）和選項對象。

## 3. 認證後登入訊息的傳遞

認證後，登入訊息（即會話信息）主要通過以下方式在專案中傳遞：

1. **伺服器端獲取**: 在 Next.js 的伺服器組件（例如 `app/layout.tsx` 或任何 `async` 伺服器組件）中，可以使用 `auth()` 函數直接獲取當前請求的會話信息。這對於需要根據用戶登入狀態渲染不同內容的伺服器組件非常有用。
2. **客戶端 `SessionProvider`**: 在 `app/layout.tsx` 中，`SessionProvider` 組件包裹了整個應用程式。它接收從伺服器端獲取的 `session` 對象，並將其提供給所有嵌套的客戶端組件。
3. **客戶端 `useSession` Hook**: 任何客戶端組件都可以使用 `next-auth/react` 提供的 `useSession` hook 來訂閱會話信息。當會話狀態改變時（例如用戶登入或登出），`useSession` 會自動更新組件。

這種機制確保了無論是在伺服器端還是客戶端，應用程式都能夠一致地訪問和響應用戶的認證狀態。

## 4. 使用到的工具

-  **Next.js**: 應用程式框架。
-  **NextAuth.js**: 用於處理認證的庫。
-  **GitHub OAuth App / Google OAuth Client**: 認證提供者。
-  **環境變數 (.env.local)**: 用於安全地存儲敏感配置信息。