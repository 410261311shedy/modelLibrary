// app/providers.tsx
'use client' // 必須是 Client Component

import { UploadProvider } from '@/context/UploadContext';
import { FloatingProgress } from '@/components/FloatingProgress';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider placement='top-right'/>
            <UploadProvider>
                <div>
                    {children}
                </div>     
                <FloatingProgress />
            </UploadProvider>
        </HeroUIProvider>
    );
}//nextrheme 設置 設置dark讓內部元件知道dark是甚麼