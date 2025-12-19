import React from 'react'
import { Input,Dropdown,DropdownTrigger,DropdownMenu,DropdownItem,Button,Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { useTheme } from 'next-themes';
import { Search,ChevronDown } from 'lucide-react';

const SearchBar = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const categories = [
    { title: "Building", icon: "🏢", items: ["List item", "List item", "List item"] },
    { title: "Product", icon: "📦", items: ["List item", "List item", "List item"] },
    { title: "Element", icon: "🧊", items: ["List item", "List item", "List item"] },
    { title: "2D Drawing", icon: "📄", items: ["List item", "List item", "List item"] },
    { title: "Team", icon: "👥", items: ["List item", "List item", "List item"] },
    ];

    return (
        <>
            <Input
                classNames={{
                    base: "w-full sm:max-w-[433px] h-10",
                    mainWrapper: "h-full",
                    input: `text-small  ${isDark ? "text-red-500" : "text-black"}`,
                    inputWrapper:
                    "font-abeezee h-full font-normal pr-1 pl-0 text-default-500 bg-default-400/20 dark:bg-[var(--colors-layout-foreground-900,#27272A)] rounded-full shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_0px_#00000099,0px_3px_1.8px_0px_#FFFFFF29,0px_-2px_1.9px_0px_#00000040,0px_0px_4px_0px_#FBFBFB3D]",
                }}
                placeholder="Search 3D models"
                size="sm"
                
                startContent={
                    <Popover placement="bottom-start" offset={10}>
                        <PopoverTrigger>
                            {/* 這對應到你 Search Bar 左側的 All 按鈕 */}
                            <button className='hover-lift flex ml-[3px] pl-[17px] py-[7px] items-center rounded-l-full bg-[#D4D4D8] dark:bg-[#3F3F46] shadow-[0px_0px_2px_0px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33] w-[90px]'><p className='font-inter text-[12px]'>ALL</p><ChevronDown size={20}/></button>
                        </PopoverTrigger>
                        
                        {/* 這裡是彈出的內容面板 */}
                        <PopoverContent className="w-[800px] p-0 bg-[#18181B] border border-white/10 shadow-2xl overflow-hidden">
                            <div className="grid grid-cols-5 w-full">
                            {categories.map((cat, index) => (
                                <div key={index} className="flex flex-col">
                                {/* 分類標題按鈕區 */}
                                <div className="flex flex-col items-center justify-center p-4 gap-2 bg-white/5 border-b border-r border-white/5">
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="text-xs font-medium text-white">{cat.title}</span>
                                </div>
                                
                                {/* 下方清單項目 */}
                                <ul className="flex flex-col p-4 gap-3 border-r border-white/5 last:border-r-0">
                                    {cat.items.map((item, i) => (
                                    <li key={i} className="text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                        {item}
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                }
                endContent={
                    <button
                        type="button"
                        className="hover-lift hover:cursor-pointer rounded-full p-2 bg-[#D4D4D8] dark:bg-[#52525B] shadow-[0px_0px_2px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33]"
                        >
                        <Search
                            size={16} // 固定圖示大小，不會受外層邊框影響
                            className="text-zinc-300 invert dark:invert-0"
                        />
                    </button>
                }
                //input type = search
                type="search"
            />
        </>
    )
}

export default SearchBar;