"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Switch
      isSelected={isDark}
      onValueChange={(selected) => setTheme(selected ? "dark" : "light")}
      color="secondary"
      size="lg"
      classNames={{
      wrapper: [
          // background
          "bg-[var(--colors-layout-foreground-100,#27272A)]",
          "rounded-full",
        ].join(" "),
        thumb: [
          "rounded-full",
          "bg-[var(--colors-base-default-300,#52525B)]",
          "shadow-[0px_0px_2px_0px_#000000B2,inset_0px_-4px_4px_0px_#00000040,inset_0px_4px_2px_0px_#FFFFFF33]",
        ].join(" "),
      }}
      thumbIcon={({ isSelected }) =>
        isSelected ? (
          <Image src="/icons/Sun 2.svg" width={16} height={16} alt="sun logo" className="invert"/>
        ) : (
          <Image src="/icons/Moon Stars.svg" width={16} height={16} alt="moon logo" className="invert"/>
        )
      }
    >
    </Switch>
  );
}