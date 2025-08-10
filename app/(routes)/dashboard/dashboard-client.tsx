"use client";

import { AppSidebar } from "@/components/Sidebar";
import type { User } from "@/app/auth/getUser";

interface DashboardClientProps {
  user: User | null;
  children?: React.ReactNode;
} 

export default function DashboardClient({ user, children }: DashboardClientProps) {
  return (
    <div className="flex h-screen relative bg-gradient-to-b from-white to-gray-50">
      <AppSidebar user={user} />
      <div className="flex-1 overflow-auto pl-20">
        {children}
      </div>
    </div>
  );
}