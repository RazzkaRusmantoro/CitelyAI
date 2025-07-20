import { getUser } from "@/app/auth/getUser";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const user = await getUser();

  return (
    <main className="h-screen w-full">
      <DashboardClient user={user} />
    </main>
  );
}
