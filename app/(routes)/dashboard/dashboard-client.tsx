"use client";

import { AppSidebar } from "@/components/Sidebar";
import type { User } from "@/app/auth/getUser";
import DocumentUpload from "@/components/upload";


interface DashboardClientProps {
  user: User | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="flex h-screen">
      <AppSidebar user={user} />
      <div className = "w-10 px-5 bg-gray-175"></div>
      <div className="flex-1 bg-gray-175">
        {/* Your page content here */}
        <DocumentUpload/>

      </div>
    </div>
  );
}
