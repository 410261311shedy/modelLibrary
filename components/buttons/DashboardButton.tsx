import React from 'react'
import { DashboardButtons } from '@/app/globalUse'

interface SidebarDashboardButtonsProps {
    currentSelect: string;
    onSelect:(value:string)=>void;
}

const DashboardButton = ({currentSelect,onSelect}:SidebarDashboardButtonsProps) => {
  const button = DashboardButtons;
  return (
    <>
      {
        button.map((btn)=>{
          const isSelected = currentSelect === btn.label;
          return(
            <div 
              key={btn.id} 
              onClick={()=>onSelect(btn.label)}
              className={`cursor-pointer flex w-full rounded-lg px-[12px] py-[12px]  gap-[16px] items-center
              ${isSelected ? "bg-[#FFFFFF33] backdrop-blur-[54.7px] text-[#FFFFFF]":"text-[#A1A1AA]"}`}>
              <btn.icon
                size={25}
                className=''/>
              <button className='' >{btn.label}</button>
            </div>
          );
        })
      }
    </>
  )
}

export default DashboardButton