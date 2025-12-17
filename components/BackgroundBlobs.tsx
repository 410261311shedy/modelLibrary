
import React from 'react'
import {useTheme} from 'next-themes';
const BackgroundBlobs = () => {
  const {theme} = useTheme();
  const isDark = theme === "dark";

  return (
    // 這是絕對定位圓形的父容器，確保它覆蓋整個相對定位的父元素
    <div className="fixed h-dvh w-full pointer-events-none background-blobs-amber-50_darkblack">
        {/* 圓形 A (左側中央 - 藍色) */}
        <div className={[// 圓形/橢圓形: 設置寬高並使用 full 圓角
          "w-[48.3rem] h-[48.3rem]", // 稍大一些
          "rounded-full",
          // 顏色: 藍色 (Blue) 和透明度
          "bg-[var(--blob-color-a)] opacity-50",
          // 定位: 絕對定位到左側中央
          // top-1/2: 垂直置中
          // left-[-15rem]: 讓圓形一半露在畫面外 (根據 w-[30rem])
          // transform -translate-y-1/2: 修正 top-1/2 造成的偏移
          "absolute top-1/2 left-1/5 transform -translate-y-1/2",

          // 模糊效果: 這是關鍵，讓邊緣柔和
          "filter blur-3xl", 
          
          // Z-index: 確保圓形在內容下方
          "z-0",
          
          ].join(' ')}/>

          {/* 圓形 B (右側中央 - 紅色) */}
      <div 
        className={[
          "w-[48.3rem] h-[48.3rem]", 
          "rounded-full", 
          "bg-[var(--blob-color-b)] opacity-30",
          
          "absolute top-1/2 right-1/5 transform -translate-y-1/2", 
          
          // 模糊效果: 關鍵
          "filter blur-3xl", 
          
          // Z-index: 確保在內容下方
          "z-0",
        
        ].join(' ')}
      />
    </div>
  )
}

export default BackgroundBlobs