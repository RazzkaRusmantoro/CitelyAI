import { getUser } from "@/app/auth/getUser";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const user = await getUser();

  return (
    <main className="h-screen w-full bg-neutral-900">
      <DashboardClient user={user} />
    </main>
  );
}
