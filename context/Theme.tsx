"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

//...props 代表所有props  { children, ...props }:是一個元件 要給屬性值
const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
