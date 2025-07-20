"use client";

import { AppSidebar } from "@/components/Sidebar";
import type { User } from "@/app/auth/getUser";

interface DashboardClientProps {
  user: User | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="flex h-screen">
      <AppSidebar user={user} />
      <div className="flex-1 p-4">
        {/* Your page content here */}
        <h1>Main Content Area</h1>
      </div>
    </div>
  );
}