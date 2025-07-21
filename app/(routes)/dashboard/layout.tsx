import { getUser } from "@/app/auth/getUser";
import DashboardClient from "./dashboard-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <DashboardClient user={user}>
      {children}
    </DashboardClient>
  );
}
