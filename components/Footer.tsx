'use client';
import React from 'react'
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'; 

const getLogoSrc = (isDark: boolean) => {
  return isDark ? "/icons/logowhite.svg" : "/icons/Logo.svg";
};
const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) return null; // Avoid SSR issues
  return (
    <div className='w-full h-[64px] flex flex-col justify-center items-center bg-white dark:bg-[#18181B] bottom-0'>      
      <Image src={getLogoSrc(isDark)} alt="GoMore Logo" width={90} height={40}/>
      <p className='font-inter mt-2 text-[5px] text-[#71717A] '>© 2025 Gomore Inc. All rights reserved</p>
    </div>
  )
}

export default Footer