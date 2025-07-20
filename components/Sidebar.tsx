"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@/app/auth/getUser";

interface Props {
  user: User;
}

export function AppSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);

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
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
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
              label: fullName,
              href: "#",
              icon: <></>,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => (
  <a
    href="/"
    className="z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      Citely
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
  </a>
);