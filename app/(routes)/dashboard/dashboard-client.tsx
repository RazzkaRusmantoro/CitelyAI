"use client";

import { AppSidebar } from "@/components/Sidebar";
import type { User } from "@/app/auth/getUser";

interface DashboardClientProps {
  user: User | null;
  children?: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  return (
    <div className="flex h-screen">
      <AppSidebar user={user} />
      <div className="w-10 px-5 bg-gray-175"></div>
      <div className="flex-1 bg-gray-175">
        {children} {/* render page content here */}
      </div>
    </div>
  );
}
