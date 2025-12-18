'use client';
import React from 'react'
import {Card, CardBody} from "@heroui/react";
import Image from 'next/image';

const ProjectCard = () => {
  return (
    <Card className="flex-col py-4 bg-[#FFFFF4] dark:bg-[#3F3F46] w-[300px] h-[260px] border-none shadow-[0px_5px_5px_rgba(0,0,0,0.6)]">
      <CardBody 
        className="px-4 py-0 relative items-center">
          
        {/* Image縮放的裁剪框 */}
        <div className='relative w-full h-[230px] overflow-hidden rounded-[20px] group bg-[#FFFFF4] dark:bg-[#18181B]'>  
          
          <Image
            className="object-cover w-full h-full transition-transform duration-300 scale-110 hover:scale-140"
            src="/projecttest.png"
            alt="Project Image"
            width={230}
            height={230}
          />
          {/* 內凹陰影覆蓋層 */}
          <div className="absolute inset-0 rounded-[20px] pointer-events-none z-10 
                      shadow-[inset_0px_5px_5px_rgba(0,0,0,0.6),inset_0px_-1px_10px_rgba(255,255,245,0.4)]">
          </div>
          {/* 右上角的懸浮小圖示 */}
          <div className="bg-[#FFFFF4] dark:bg-[#3F3F46] absolute top-3 right-5 p-2 rounded-full backdrop-blur-md z-20 border border-white/10">
            <Image
              src="/icons/is3DIcon.svg"
              alt="3D Icon"
              width={16}
              height={16}
            />
          </div>
        </div>
      </CardBody>
      <div className=" mt-2 px-5 flex items-center justify-between text-sm min-w-0">
        <p className='flex items-center gap-1 min-w-0'>
          <Image
            className='shrink-0 invert dark:invert-0'
            src="/icons/buildingIcon.svg"
            alt="Building Icon"
            width={16}
            height={16}
          />
          <span className='truncate text-black dark:text-[#E4E4E7] font-medium'>Model Nameaaaaaaaaaaaaaaaaaaaa</span>
        </p>
        {/* shrink 0 for 當文字過長也不可以擠壓到按鈕 */}
        <div className='flex gap-2 shrink-0'>
          <button className='flex items-center bg-[#FFFFF4] dark:bg-[#52525B] rounded-lg px-3 py-1.5 shadow-[inset_0px_2px_1px_rgba(255,255,245,0.2),inset_0px_-2px_8px_rgba(0,0,0,0.4)]
          hover:bg-[#60606a] hover:translate-y-[-1px] transition-all active:translate-y-[1px] active:shadow-sm'>
            <Image
              className='invert dark:invert-0'
              src="/icons/Downloadicons.svg"
              alt="Download Icon"
              width={16}
              height={16}
            />
            <p className='ml-1 font-medium text-black dark:text-[#E4E4E7] font-medium'>Download</p>
          </button>
          <button className='bg-[#FFFFF4] dark:bg-[#52525B] rounded-lg px-2 py-1 shadow-[inset_0px_2px_1px_rgba(255,255,245,0.2),inset_0px_-2px_8px_rgba(0,0,0,0.4)]
          hover:bg-[#60606a] hover:translate-y-[-1px] transition-all active:translate-y-[1px] active:shadow-sm'>
            <Image 
              className='invert dark:invert-0'
              src="/icons/ArchiveIcon.svg"
              alt="Archive Icon"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>
    </Card>

  )
}

export default ProjectCard