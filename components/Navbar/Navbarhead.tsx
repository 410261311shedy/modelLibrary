'use client'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import SearchBar from "../SearchBar/SearchBar";
import SetLanguageButton from "../SetLanguageButton";
import { useTheme } from "next-themes";
import React from "react";
import { useEffect, useState } from 'react';
import MegaMenu from "../MegaMenu";

const getLogoSrc = (isDark: boolean) => {
  return isDark ? "/icons/logowhite.svg" : "/icons/Logo.svg";
};

export default function Navbarhead() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  // 控制Megamenu是否顯示
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null; // Avoid SSR issues
  console.log("Current Navbar theme:", theme);

  return (
    <nav className="w-full flex justify-center mt-4 px-4 border-3 ">
      <Navbar
        isBordered
        isBlurred={false}
        classNames={{
          base: "max-w-5xl w-full rounded-2xl shadow-sm bg-white dark:bg-black border-3 border-red-500",
          wrapper: "px-4",
        }}
      >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link href="/">
            <Image src={getLogoSrc(isDark)} width={120}height={120}alt="GoMore Logo"></Image>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <Button as={Link} href="/" radius="none" disableRipple className={`hover-lift font-inter text-[16px] w-[80px] ${isDark ? "text-white bg-black" : "text-black bg-white"} ${(pathName === "/")?"border-b-2 border-b-red-600":"" }`}>Home</Button>
          </NavbarItem>
          <NavbarItem isActive>
            <Button as={Link} href="/upload" radius="none" disableRipple className={`hover-lift font-inter text-[16px] w-[80px] ${isDark ? "text-white bg-black" : "text-black bg-white"} ${(pathName === "/upload")?"border-b-2 border-b-red-600":"" }`}>Upload</Button>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent justify="center">
        {/* Search box 區塊 */}
        <SearchBar isMenuOpen={isMegaMenuOpen} onToggle={()=>setIsMegaMenuOpen(!isMegaMenuOpen)}/>
        {/* 3. 根據狀態顯示延伸區塊 (Mega Menu) */}
          {isMegaMenuOpen && (
          <div className="w-full flex justify-center absolute top-[50px]"> {/* absolute 定位確保它疊在頁面內容之上 */}
            <MegaMenu />
          </div>
          )}
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
