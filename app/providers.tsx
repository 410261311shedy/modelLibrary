// app/providers.tsx
'use client' // 必須是 Client Component

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
    <NextThemesProvider attribute="class" defaultTheme='dark'>
        <HeroUIProvider>
            <BackgroundBlobs/>
            {children}
        </HeroUIProvider>
    </NextThemesProvider>
    );
}