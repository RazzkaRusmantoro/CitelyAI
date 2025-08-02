"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconX,
  IconMenu2,
  IconSparkles,
  IconFilePencil,
  IconBook2,
  IconFileText,
  IconListCheck
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@/app/auth/getUser";
import { usePathname } from "next/navigation";

interface Props {
  user: User;
}

export function AppSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // get current route

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fullName =
    user?.user_metadata?.full_name ||
    `${user?.user_metadata?.f_name ?? ""} ${user?.user_metadata?.l_name ?? ""}`.trim() ||
    "Guest";

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard/home",
      icon: IconBrandTabler,
    },
    {
      label: "AI Citation Assistant",
      href: "/dashboard/ai-citation",
      icon: IconFilePencil,
    },
    {
      label: "Academic Source Finder",
      href: "/dashboard/academic-source-finder",
      icon: IconBook2,
    },
    {
      label: "Paper Summarizer",
      href: "/dashboard/paper-summarizer",
      icon: IconFileText,
    },
    {
      label: "Bibliography Manager",
      href: "/dashboard/bibliography-manager",
      icon: IconListCheck,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: IconUserBolt,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: IconSettings,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: IconArrowLeft,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && !open && (
  <button
    onClick={() => setOpen(true)}
    className="fixed z-50 p-2 m-2 rounded-md md:hidden"
  >
    <IconMenu2 size={24} />
  </button>
)}

      <div
        className={cn(
          "fixed left-0 top-0 h-full z-50",
          "transition-all duration-300 ease-in-out",
          isMobile
            ? open
              ? "w-full shadow-xl bg-white" 
              : "-translate-x-full"
            : open
            ? "w-64 shadow-xl"
            : "w-20"
        )}
        onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setOpen(false) : undefined}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between scrollbar-none gap-10 h-full">
            <div className="flex flex-1 flex-col scrollbar-none overflow-y-auto px-2">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <SidebarLink
                      key={idx}
                      link={{
                        ...link,
                        icon: (
                          <Icon
                            className={cn(
                              "h-6 w-6 shrink-0",
                              isActive
                                ? "text-orange-500"
                                : "text-neutral-700 dark:text-neutral-200"
                            )}
                          />
                        ),
                      }}
                    />
                  );
                })}
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
    href="/"
    className="z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
  </a>
);
