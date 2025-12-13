"use client";
import { Moon,Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Switch
      isSelected={isDark}
      onValueChange={(selected) => setTheme(selected ? "dark" : "light")}
      color="secondary"
      size="lg"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <Sun className={className} />
        ) : (
          <Moon className={className} />
        )
      }
    >
    </Switch>
  );
}