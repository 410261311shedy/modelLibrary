import React from 'react'

const BackgroundBlobs = () => {
  // 將尺寸鎖定為固定值 (773px 約為 48.3rem)
  const blobSize = "w-[48.3rem] h-[48.3rem]"; // 773px

  // 圓形 B 的左側偏移量: 445.76px 約為 27.86rem
  const blobBLeft = "left-[27.86rem]";
  return (
    // 這是絕對定位圓形的父容器，確保它覆蓋整個相對定位的父元素
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* 圓形 A (左側中央 - 藍色) */}
        <div className={[// 圓形/橢圓形: 設置寬高並使用 full 圓角
          "w-[48.3rem] h-[48.3rem]", // 稍大一些
          "rounded-full",
          // 顏色: 藍色 (Blue) 和透明度
          "bg-[#80A4D7]  opacity-50",
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
          "bg-[#A42E4C] opacity-30", 
          
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