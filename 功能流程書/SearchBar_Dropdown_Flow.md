# SearchBar 分類下拉選單功能流程書

## 1. 功能概述
本文件描述如何在 Navbar 的 SearchBar 中實作一個互動式的分類下拉選單。該選單將透過 "ALL" 按鈕觸發，並呈現類似 Tab 分頁的切換體驗，讓使用者能快速瀏覽不同類別（Building, Product, Element, 2D Drawing, Team）下的項目。

## 2. 預期目標 (UI/UX)
- **觸發方式**：點擊 SearchBar 左側的 "ALL" 按鈕作為 Toggle 開關。
- **初始狀態**：
  - 下拉選單預設為隱藏 (Hidden)。
  - 展開後，預設選中的分類為 "Building"。
- **視覺呈現**：
  - **頂部區塊**：橫向排列的分類按鈕。
    - **選中狀態 (Active)**：高亮顯示（背景色較淺、圓角、陰影），明確區分當前類別。
    - **未選中狀態 (Inactive)**：較暗淡，滑鼠懸停時有微亮效果。
  - **底部區塊**：顯示對應分類的項目清單。
  - **整體風格**：移除原有的格線邊框 (Grid Borders)，採用更乾淨的版面設計，符合現代化 UI。

## 3. 實作流程

### 步驟一：狀態管理 (State Management)
在 `SearchBar.tsx` 中引入必要的 React State：
1.  **`selectedCategory`**: 追蹤當前選中的分類 (預設值: "Building")。
    -   用於控制上方按鈕的 Active 樣式。
    -   (選用) 若清單內容需動態切換，也用於篩選下方顯示的資料。

### 步驟二：元件結構調整 (Component Structure)
利用 HeroUI 的 `Popover` 元件進行佈局重構：

1.  **觸發器 (Trigger)**:
    -   保留現有的 "ALL" 按鈕設計。
    -   綁定 `PopoverTrigger` 以控制顯示/隱藏。

2.  **內容容器 (Content)**:
    -   使用 `PopoverContent` 作為下拉容器。
    -   設定寬度、背景色、圓角與陰影。

3.  **內部佈局 (Layout)**:
    -   **Section A (Tabs)**: 使用 Flex 或 Grid 佈局放置 5 個分類按鈕。
        -   實作點擊事件 `onClick={() => setSelectedCategory(cat.title)}`。
        -   根據 `selectedCategory` 動態套用樣式 (Conditional Styling)。
    -   **Section B (Lists)**:
        -   目前設計為同時顯示所有欄位，但視覺上對齊上方按鈕。
        -   或者根據需求，僅高亮顯示對應欄位，或保持全欄位顯示但視覺對齊。
        -   *註：根據提供的圖片，下方似乎是同時列出所有分類的清單，與上方標題對齊。我們將保持 Grid 結構讓清單與標題垂直對齊。*

### 步驟三：樣式優化 (Styling Refinement)
-   **移除邊框**: 去除原先 `border-r`, `border-b` 造成的表格感。
-   **按鈕樣式**:
    -   Active: `bg-white/10 text-white shadow-lg rounded-lg`
    -   Inactive: `text-zinc-400 hover:text-white hover:bg-white/5`
-   **清單樣式**: 調整間距 (Gap) 與文字顏色，確保閱讀舒適度。

## 4. 資料結構範例
```typescript
const categories = [
    { title: "Building", icon: "🏢", items: [...] },
    { title: "Product", icon: "📦", items: [...] },
    // ... 其他分類
];
```

## 5. 驗收標準
1.  點擊 "ALL" 可正常開關選單。
2.  選單展開時，"Building" 按鈕呈現高亮選中狀態。
3.  點擊其他分類按鈕（如 "Team"），該按鈕變為高亮，原按鈕恢復暗淡。
4.  介面無多餘格線，視覺風格與參考圖（第一張圖）一致。