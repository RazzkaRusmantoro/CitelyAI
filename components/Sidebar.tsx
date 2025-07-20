"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconX,
  IconMenu2
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@/app/auth/getUser";
import { IconSparkles } from "@tabler/icons-react";

interface Props {
  user: User;
}

export function AppSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fullName =
    user?.user_metadata?.full_name ||
    `${user?.user_metadata?.f_name ?? ""} ${user?.user_metadata?.l_name ?? ""}`.trim() ||
    "Guest";

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed z-50 p-2 m-2 rounded-md md:hidden bg-gray-100 dark:bg-gray-800"
        >
          {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      )}

      <div 
        className={cn(
          "fixed left-0 top-0 h-full z-40",
          "transition-all duration-300 ease-in-out",
          "bg-gray-100 dark:bg-gray-900",
          isMobile 
            ? open 
              ? "w-64 shadow-xl" 
              : "-translate-x-full"
            : open 
              ? "w-64 shadow-xl" 
              : "w-10"
        )}
        onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setOpen(false) : undefined}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 h-full">
            <div className="flex flex-1 flex-col overflow-y-auto px-2">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div className="p-2">
              <SidebarLink
                link={{
                  label: open ? fullName : "",
                  href: "#",
                  icon: <></>,
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
    </>
  );
}

const Logo = () => (
  <a
    href="/"
    className="z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre"
    >
      Citely
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
  </a>
);