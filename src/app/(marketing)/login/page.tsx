import { print } from "graphql";
import { wpFetch } from "@/utils/wp";
import { GetLoginPage } from "@/queries/general/login";
import { extractLoginContent } from "@/utils/extractors/login.extractor";
import LoginClient from "./login.client";

export const revalidate = 60;

export default async function LoginPage() {
  // Fetch from WordPress with ISR caching (60s revalidation)
  const data = await wpFetch(print(GetLoginPage));

  // Extract and normalize the data
  const loginContent = extractLoginContent(data);

  return <LoginClient loginContent={loginContent} />;
}
