import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MarketingHome from "./(marketing)/page";

export default async function HomePage() {
  const session = await auth();

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // Show marketing page for unauthenticated users
  return <MarketingHome />;
}
