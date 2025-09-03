import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Navbar } from "@/components/dashboard/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout>
      <Navbar title="Dashboard" />
      <div className="p-6">{children}</div>
    </DashboardLayout>
  );
}
