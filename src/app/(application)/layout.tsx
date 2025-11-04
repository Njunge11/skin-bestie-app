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

  // Use dashboard data or fallback - nickname is standalone, firstName gets lastName
  const userName = dashboard?.user
    ? dashboard.user.nickname ||
      `${dashboard.user.firstName} ${dashboard.user.lastName}`
    : "Loading...";
  const userEmail = dashboard?.user?.email || "";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header userName={userName} userEmail={userEmail} />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 pt-6 bg-gray-100">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
