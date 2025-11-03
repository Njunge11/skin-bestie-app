import { print } from "graphql";
import { redirect } from "next/navigation";
import { wpFetch } from "@/utils/wp";
import { GetLoginPage } from "@/queries/general/login";
import { extractLoginContent } from "@/utils/extractors/login.extractor";
import { auth } from "@/auth";
import LoginClient from "./login.client";

export const revalidate = 60;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  // Check if user is already authenticated
  const session = await auth();

  // If logged in, redirect to dashboard or callbackUrl
  if (session?.user) {
    const params = await searchParams;
    const destination = params.callbackUrl || "/dashboard";
    redirect(destination);
  }

  // Fetch from WordPress with ISR caching (60s revalidation)
  const data = await wpFetch(print(GetLoginPage));

  // Extract and normalize the data
  const loginContent = extractLoginContent(data);

  return <LoginClient loginContent={loginContent} />;
}
