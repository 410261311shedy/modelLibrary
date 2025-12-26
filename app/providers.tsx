// app/providers.tsx
'use client' // 必須是 Client Component

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import React from 'react';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider placement='top-right'/>
            <BackgroundBlobs/>
            {children}
        </HeroUIProvider>
    );
}//nextrheme 設置 設置dark讓內部元件知道dark是甚麼