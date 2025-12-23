import React from 'react'
import { card,itemsQueryForALL } from '@/app/globalUse'
import { filter } from 'framer-motion/client';

const MegaMenu = () => {
const [selectedCategory,setSelectedCategory] = React.useState("ALL");

const filteredCard = card.filter((item)=>item.category === selectedCategory)

return (
    // 這裡設計延伸區塊的樣式
    <div className="w-full max-w-5xl mx-auto mt-1 p-6 rounded-b-2xl bg-white dark:bg-black borde shadow-2xl z-40">
    <div className="grid grid-cols-5 w-full gap-4">
        {itemsQueryForALL.map((cat, index) => (
        <div key={index} className="flex flex-col">
            <div className="flex flex-col items-center justify-center p-4 gap-2 bg-white/5 border-b border-r border-white/5 rounded-t-lg">
            <span className="text-xl"><cat.icon size={20}/></span>
            <span className="text-xs font-medium text-white">{cat.label}</span>
            </div>
            <ul className="flex flex-col p-4 gap-3 border-r border-b border-l border-white/5 rounded-b-lg last:border-r">
            {filteredCard.map((item, i) => (
                <li key={i} className="text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors text-center">
                {item.title}
                </li>
            ))}
            </ul>
        </div>
        ))}
    </div>
    </div>
);
}

export default MegaMenu