// components/sidebar/StepItem.tsx

import { Check } from "lucide-react"; // 建議安裝 lucide-react 用於顯示勾選圖示

interface StepItemProps {
number: number;
title: string;
description: string;
active: boolean;
completed: boolean;
isLast?: boolean; // 是否為最後一步，決定要不要畫下方的連接線
}

const StepItem = ({ number, title, description, active, completed, isLast }: StepItemProps) => {
return (
    <div className="relative flex gap-4">
    {/* 左側：圓圈與連接線 */}
    <div className="flex flex-col items-center">
        <div
        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            active
            ? "border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            : completed
            ? "border-red-500 bg-red-500 text-white"
            : "border-white/20 bg-transparent text-white/40"
        }`}
        >
        {completed ? <Check size={20} /> : <span>{number}</span>}
        </div>
        
        {/* 連接線 */}
        {!isLast && (
        <div
            className={`h-12 w-[2px] transition-colors duration-300 ${
            completed ? "bg-red-500" : "bg-white/10"
            }`}
        />
        )}
    </div>

    {/* 右側：文字內容 */}
    <div className="flex flex-col pt-1">
        <h3
        className={`font-semibold transition-colors ${
            active || completed ? "text-white" : "text-white/40"
        }`}
        >
        {title}
        </h3>
        <p className="text-xs text-white/40">{description}</p>
    </div>
    </div>
);
};

export default StepItem;