import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Navbar } from "@/components/dashboard/navbar";
import BackgroundWrapper from "@/components/dashboard/background-wrapper";

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
      <Navbar/>
      <BackgroundWrapper>
        <div className="pt-16 p-6">{children}</div>
      </BackgroundWrapper>
    </DashboardLayout>
  );
}
