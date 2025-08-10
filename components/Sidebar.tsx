"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMenu2,
  IconSparkles,
  IconFilePencil,
  IconBook2,
  IconFileText,
  IconListCheck,
  IconSunglassesFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { User } from "@/app/auth/getUser";
import { usePathname } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";

interface Props {
  user: User;
}

export function AppSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

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
    `${user?.user_metadata?.f_name ?? ""} ${
      user?.user_metadata?.l_name ?? ""
    }`.trim() ||
    "Guest";

  const categories = [
    {
      name: "MAIN",
      links: [
        {
          label: "Dashboard",
          href: "/dashboard/home",
          icon: IconBrandTabler,
        },
      ],
    },
    {
      name: "CITATION TOOLS",
      links: [
        {
          label: "AI Citation Basic",
          href: "/dashboard/ai-citation",
          icon: IconFilePencil,
        },
        {
          label: "AI Citation Pro",
          href: "/dashboard/ai-citation-pro",
          icon: IconFilePencil,
        },
        {
          label: "Academic Citer",
          href: "/dashboard/custom-link-citation",
          icon: MessageSquareQuote,
        },
        {
          label: "Bibliography Manager",
          href: "/dashboard/bibliography-manager",
          icon: IconListCheck,
        },
      ],
    },
    {
      name: "RESEARCH TOOLS",
      links: [
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
          label: "Source Credibility",
          href: "/dashboard/source-credibility-checker",
          icon: IconSunglassesFilled,
        },
      ],
    },
    {
      name: "ACCOUNT",
      links: [
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
      ],
    },
  ];

  return (
    <>
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 p-2 m-2 rounded-md md:hidden bg-white dark:bg-gray-800 shadow-md"
        >
          <IconMenu2
            size={24}
            className="text-neutral-800 dark:text-neutral-200"
          />
        </button>
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full z-50 bg-white dark:bg-gray-900",
          "transition-all duration-300 ease-in-out overflow-x-hidden",
          isMobile
            ? open
              ? "w-full shadow-xl"
              : "-translate-x-full"
            : "shadow-xl"
        )}
        onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setOpen(false) : undefined}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between scrollbar-none overflow-x-hidden h-full">
            <div className="flex flex-1 flex-col scrollbar-none overflow-y-auto overflow-x-hidden px-2">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-6 flex flex-col">
                {categories.map((category, catIdx) => (
                  <div key={catIdx} className="flex flex-col">
                    {/* Divider */}
                    <div className="border-b border-neutral-200 dark:border-neutral-700 mx-2 h-[1px] my-2" />

                    {/* Category name */}
                    <div className="h-6 px-4 flex items-center overflow-hidden">
                      <motion.span
                        className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider whitespace-nowrap"
                        animate={{
                          opacity: open ? 1 : 0,
                        }}
                        transition={{ duration: 0.15, delay: open ? 0.25 : 0 }}
                      >
                        {category.name}
                      </motion.span>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {category.links.map((link, idx) => (
                        <div key={idx} className="h-10 flex items-center">
                          <SidebarLink
                            link={{
                              ...link,
                              icon: (
                                <link.icon
                                  className={cn(
                                    "h-5 w-5 shrink-0",
                                    pathname === link.href
                                      ? "text-orange-500"
                                      : "text-neutral-700 dark:text-neutral-200"
                                  )}
                                />
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 h-12 flex items-center">
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
    className="z-20 flex items-center space-x-2 py-3 text-sm font-normal text-black dark:text-white h-12"
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
    className="z-20 flex items-center space-x-2 py-3 text-sm font-normal text-black dark:text-white h-12"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
  </a>
);