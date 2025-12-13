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
import { ThemeToggle } from "./Theme";
import Image from "next/image";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const SearchIcon = ({size = 24, strokeWidth = 1.5, width, height, ...props}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function Navbarhead() {
  return (
    <div className="w-full flex justify-center mt-4 px-4 ">
      <Navbar 
        isBordered
        isBlurred={false}
        classNames={{
          base: "max-w-5xl w-full rounded-2xl shadow-sm",
          wrapper: "px-4",
        }}
      >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Image src="/icons/Logo.png" width={200}height={200}alt="GoMore Logo"></Image>
          
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <Link href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link aria-current="page" color="secondary" href="/up">
              Upload
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent justify="center">
        <Input
          classNames={{
            base: "w-full sm:max-w-[16rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-full",
          }}
          placeholder="Type to search..."
          size="sm"
          endContent={<SearchIcon size={18}/>}
          type="search"
        />
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        
        <ThemeToggle/>
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
    </div>
  );
}
