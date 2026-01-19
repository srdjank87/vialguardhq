import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar
        clinicName={session.user.clinicName}
        userName={session.user.name}
      />
      <main className="flex-1 lg:pl-0 pl-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
