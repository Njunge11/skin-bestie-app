import { auth } from "@/auth";
import GuestPage from "./@guest/page";
import AuthPage from "./@auth/page";
import AuthLayout from "./@auth/layout";

export default async function HomePage() {
  const session = await auth();

  // Conditionally render based on authentication
  if (session) {
    return (
      <AuthLayout>
        <AuthPage />
      </AuthLayout>
    );
  }

  return <GuestPage />;
}
