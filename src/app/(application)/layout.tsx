import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ApplicationLayoutClient from "./layout-client";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <ApplicationLayoutClient>{children}</ApplicationLayoutClient>;
}
