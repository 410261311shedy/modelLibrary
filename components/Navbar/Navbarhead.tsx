'use client'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Image from "next/image";
import SearchBar from "../SearchBar/SearchBar";
import SetLanguageButton from "../SetLanguageButton";
import { useTheme } from "next-themes";
import React from "react";
import { useEffect, useState } from 'react';

const getLogoSrc = (isDark: boolean) => {
  return isDark ? "/icons/logowhite.svg" : "/icons/Logo.svg";
};

export default function Navbarhead() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null; // Avoid SSR issues
  console.log("Current Navbar theme:", theme);

  return (
    <nav className="w-full flex justify-center mt-4 px-4 ">
      <Navbar
        isBordered
        isBlurred={false}
        classNames={{
          base: "max-w-5xl w-full rounded-2xl shadow-sm bg-white dark:bg-black",
          wrapper: "px-4",
        }}
      >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link href="/">
            <Image src={getLogoSrc(isDark)} width={120}height={120}alt="GoMore Logo" className=""></Image>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <Link href="/" className={`${isDark ? "text-white" : "text-black"}`}>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/upload" className={`${isDark ? "text-white" : "text-black"}`}>
              Upload
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent justify="center">
        <SearchBar/>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <SetLanguageButton/>
        <ThemeSwitcher/>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
    </nav>
  );
}
