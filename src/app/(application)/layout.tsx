"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "./components/header";
import { AppSidebar } from "./components/app-sidebar";
import { useDashboard } from "./dashboard/hooks/use-dashboard";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: dashboard } = useDashboard();

  // Use dashboard data or fallback
  const userName = dashboard?.user
    ? `${dashboard.user.firstName} ${dashboard.user.lastName}`
    : "Loading...";
  const userEmail = dashboard?.user?.email || "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header userName={userName} userEmail={userEmail} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0 bg-gray-100">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
