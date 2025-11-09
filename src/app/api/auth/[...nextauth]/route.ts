import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Handle HEAD requests from Outlook SafeLinks
// https://next-auth.js.org/tutorials/avoid-corporate-link-checking-email-provider
export async function HEAD() {
  return new Response(null, { status: 200 });
}
