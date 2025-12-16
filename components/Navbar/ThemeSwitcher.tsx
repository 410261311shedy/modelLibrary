"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";
import React from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";
  console.log("Current theme:", theme);
  return (
    <Switch
      isSelected={isLight}
      onValueChange={(selected) => setTheme(selected ? "light" : "dark")}
      color="secondary"
      size="lg"
      classNames={{
      wrapper: [
          "rounded-full",
          // background
          !isLight
          ? "bg-[var(--colors-layout-foreground-900,#18181B)]"
          :"",
          
        ].join(" "),
        thumb: [
          "rounded-full",
          "bg-[var(--colors-base-default-300,#52525B)]",
          "shadow-[0px_0px_2px_0px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33]",
        ].join(" "),
      }}
      thumbIcon={({ isSelected }) =>
        isSelected ? (
          <Image src="/icons/Sun 2.svg" width={16} height={16} alt="light" className="invert"/>
        ) : (
          <Image src="/icons/Moon Stars.svg" width={16} height={16} alt="dark" className="invert"/>
        )
      }
    >
    </Switch>
  );
}