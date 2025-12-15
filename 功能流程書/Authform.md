好的，我已經讀取了 [`components/forms/AuthForm.tsx`](components/forms/AuthForm.tsx) 和 [`lib/validations.ts`](lib/validations.ts) 文件。現在我將根據您的要求，提供一份詳細的 `AuthForm` 組件規格書。

---

## AuthForm 組件規格書

### 1. 功能概述

`AuthForm` 是一個通用的認證表單組件，旨在處理用戶的登入 (Sign In) 和註冊 (Sign Up) 操作。它根據傳入的配置動態生成表單字段、應用驗證規則，並處理表單提交。其核心功能包括：

*   **動態表單生成**：根據預設值自動渲染所需的輸入字段。
*   **實時輸入驗證**：在用戶輸入時提供即時的驗證反饋。
*   **表單提交處理**：在表單驗證通過後，執行自定義的提交邏輯。
*   **狀態反饋**：在提交過程中顯示加載狀態，並禁用提交按鈕。
*   **模式切換**：提供登入和註冊模式之間的切換連結。

### 2. 組件屬性 (Props)

`AuthForm` 組件接受以下屬性來配置其行為和外觀：

*   **`schema`**:
    *   **功能**：定義表單數據的結構和每個字段的驗證規則。
    *   **要求**：必須是一個包含字段定義和驗證規則的物件。
    *   **範例**：對於登入，它可能包含 `email` 和 `password` 字段的規則；對於註冊，可能還會包含 `username` 和 `name` 等字段的規則。

*   **`defaultValues`**:
    *   **功能**：提供表單字段的初始值，並決定哪些字段會被渲染。
    *   **要求**：必須是一個物件，其鍵與 `schema` 中定義的字段名一致，值為對應字段的預設內容。

*   **`onSubmit`**:
    *   **功能**：當表單成功驗證並提交時，將觸發此函數。
    *   **要求**：必須是一個異步函數，接受一個包含表單數據的物件作為參數，並返回一個表示操作成功與否的物件（例如 `{ success: true }`）。

*   **`formType`**:
    *   **功能**：指定表單的類型，決定顯示的標題和切換連結。
    *   **要求**：只能是 `"SIGN_IN"`（登入）或 `"SIGN_UP"`（註冊）中的一個。

### 3. UI 元素與交互

`AuthForm` 組件的 UI 包含以下主要元素：

#### 3.1 表單輸入欄位 (動態生成)

*   **功能**：根據 `defaultValues` 屬性中提供的字段，動態渲染相應的輸入框。
*   **外觀與交互**：
    *   每個輸入框上方都有一個清晰的標籤，指示該字段的用途。例如，如果字段名是 `email`，標籤會顯示為「Email Address」；如果是 `password`，標籤會顯示為「Password」；其他字段名則會首字母大寫顯示。
    *   輸入框具有統一的視覺樣式，邊框清晰，背景色與應用程式主題協調。
    *   當用戶在輸入框中鍵入內容時，如果內容不符合預設的驗證規則，輸入框下方會顯示一條紅色的錯誤提示訊息，指導用戶修正輸入。
    *   對於密碼輸入框，其輸入類型會被設定為「password」，以隱藏用戶輸入的字符，保護隱私。
    *   所有輸入框都要求用戶必須填寫。

#### 3.2 提交按鈕

*   **功能**：觸發表單的驗證和提交流程。
*   **外觀與交互**：
    *   按鈕上顯示的文本會根據 `formType` 屬性動態變化，例如「Sign In」或「Sign Up」。
    *   當表單正在提交時，按鈕會顯示加載狀態文本（例如「Signing In...」或「Signing Up...」），並且按鈕會被禁用，防止用戶重複提交。
    *   按鈕具有顯眼的漸變背景色和白色文本，確保其在頁面上的可見性。

#### 3.3 切換登入/註冊連結

*   **功能**：提供一個便捷的方式，讓用戶在登入和註冊頁面之間進行導航。
*   **外觀與交互**：
    *   在表單下方，會顯示一段提示文本，例如「Don't have an account?」或「Already have an account?」。
    *   提示文本後方跟隨一個可點擊的連結，其文本為「Sign up」或「Sign in」，並具有顯眼的漸變文本顏色。
    *   點擊此連結會將用戶導航到對應的登入或註冊頁面。

### 4. 驗證機制

`AuthForm` 的驗證邏輯由 `schema` 屬性提供，該屬性使用 `zod` 庫定義了詳細的驗證規則。以下是 `SignInSchema` 和 `SignUpSchema` 中定義的具體要求：

#### 4.1 SignIn 表單的驗證要求 (`SignInSchema`)

*   **Email 地址**：
    *   **要求**：必須是一個有效的電子郵件格式。
    *   **錯誤訊息**：如果格式無效，提示「Please provide a valid email address.」
    *   **要求**：必須填寫。
    *   **錯誤訊息**：如果為空，提示「Email is required.」
*   **密碼**：
    *   **要求**：長度必須至少為 6 個字符。
    *   **錯誤訊息**：如果長度不足，提示「password must be at least 6 characters.」
    *   **要求**：長度不能超過 100 個字符。
    *   **錯誤訊息**：如果長度過長，提示「password cannot exceed 100 characters.」

#### 4.2 SignUp 表單的驗證要求 (`SignUpSchema`)

*   **用戶名 (Username)**：
    *   **要求**：長度必須至少為 3 個字符。
    *   **錯誤訊息**：如果長度不足，提示「Username must be at least 3 characters long.」
    *   **要求**：長度不能超過 30 個字符。
    *   **錯誤訊息**：如果長度過長，提示「Username cannot exceed 30 characters.」
    *   **要求**：只能包含字母、數字和底線。
    *   **錯誤訊息**：如果包含其他字符，提示「Username can only contain letters, numbers, and underscores.」
*   **姓名 (Name)**：
    *   **要求**：必須填寫。
    *   **錯誤訊息**：如果為空，提示「Name is required.」
    *   **要求**：長度不能超過 50 個字符。
    *   **錯誤訊息**：如果長度過長，提示「Name cannot exceed 50 characters.」
    *   **要求**：只能包含字母和空格。
    *   **錯誤訊息**：如果包含其他字符，提示「Name can only contain letters and spaces.」
*   **Email 地址**：
    *   **要求**：必須是一個有效的電子郵件格式。
    *   **錯誤訊息**：如果格式無效，提示「Please provide a valid email address.」
    *   **要求**：必須填寫。
    *   **錯誤訊息**：如果為空，提示「Email is required.」
*   **密碼**：
    *   **要求**：長度必須至少為 6 個字符。
    *   **錯誤訊息**：如果長度不足，提示「Password must be at least 6 characters long.」
    *   **要求**：長度不能超過 100 個字符。
    *   **錯誤訊息**：如果長度過長，提示「Password cannot exceed 100 characters.」
    *   **要求**：必須包含至少一個大寫字母。
    *   **錯誤訊息**：如果缺少，提示「Password must contain at least one uppercase letter.」
    *   **要求**：必須包含至少一個小寫字母。
    *   **錯誤訊息**：如果缺少，提示「Password must contain at least one lowercase letter.」
    *   **要求**：必須包含至少一個數字。
    *   **錯誤訊息**：如果缺少，提示「Password must contain at least one number.」
    *   **要求**：必須包含至少一個特殊字符（非字母、數字）。
    *   **錯誤訊息**：如果缺少，提示「Password must contain at least one special character.」

### 5. 達成方式 (內部實現)

`AuthForm` 組件的實現依賴於以下技術和模式：

*   **React Hook Form**: 用於管理表單狀態、處理輸入和驗證。它提供了 `useForm` hook 來初始化表單，並通過 `control` 屬性將表單字段與其狀態綁定。
*   **Zod**: 作為表單驗證庫，與 React Hook Form 結合使用，通過 `standardSchemaResolver` 實現基於 schema 的驗證。
*   **動態字段渲染**: 通過遍歷 `defaultValues` 物件的鍵來動態生成 `FormField`，確保表單的靈活性和可擴展性。
*   **條件渲染**: 根據 `formType` 屬性，條件性地渲染不同的提交按鈕文本和切換連結。
*   **狀態管理**: 利用 React Hook Form 的 `formState.isSubmitting` 來管理提交按鈕的禁用狀態和文本顯示。

---

我已經根據您的要求，詳細解釋了 `SignInPage` 和 `SignUpPage` 中使用的 `AuthForm` 組件，包括其功能、達成方式、UI 元素與交互的自然語言描述，以及詳細的驗證要求。

請問我可以執行此任務並將此解釋作為最終結果提交嗎？我要在補述一下 我接下來會將這個文字檔案丟給hero ui 的ai 他們的表單功能中可以編寫validation，重點在於如何詳細描述讓另一個ai可以理解並且重新以她有的功能來覆克出一樣的表單

<!-- =========================================== -->
下面是一個依照你提供的 Form 範例與 HeroUI 表單/驗證文件實作的 AuthForm，不使用 Zod，而是用 HeroUI 的：

Form + validationBehavior="aria" + validationErrors 做錯誤顯示與 server‑like errors。[Form; Forms validation]
Input 的 isInvalid + errorMessage 做即時驗證。[Input]
表單欄位是根據 defaultValues 的 key 動態產生，驗證邏輯則依 formType（SIGN_IN / SIGN_UP）和欄位名稱套用符合你規格書的條件。

這個版本滿足你規格書的重點：

依 defaultValues 的 key 動態產生欄位。
依 formType 套用 Sign In / Sign Up 的不同驗證規則。
使用 HeroUI 的 Form + Input 即時顯示錯誤，並支援 validationErrors（若你未來要把 server 驗證錯誤從外面餵進來）。[Form; Input validation]
送出時按鈕顯示 loading 文案並 disabled。
下方顯示切換 Sign In / Sign Up 的文字與連結（實際路由交給外層）。
如果你接下來有具體的路由（例如 Next.js 的 /sign-in / /sign-up）或想把切換連結改成 HeroUI 的 Link，可以再把 handleSwitchClick 換成 onSwitch prop 或直接在外層包路由。