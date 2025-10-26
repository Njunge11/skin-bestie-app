// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip if creds aren't present
  if (!process.env.WP_USER || !process.env.WP_APP_PASS) {
    return NextResponse.next();
  }

  // Only bother for GET/HEAD page requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const base = process.env.WORDPRESS_API_URL; // your current IP/base
  if (!base) return NextResponse.next();

  // Normalize path (remove trailing slash, but keep "/" for homepage)
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  // Build API URL safely
  const url =
    `${base}/wp-json/redirection/v1/redirect/` +
    `?filterBy%5Burl-match%5D=plain&filterBy%5Burl%5D=${encodeURIComponent(pathname)}`;

  // Basic auth for WP application password
  const auth = `Basic ${Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APP_PASS}`
  ).toString("base64")}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: auth,
        // GET requests should declare what they accept (not Content-Type)
        Accept: "application/json",
        // If your WP host is name-based vhosted and you're hitting a raw IP,
        // you can uncomment the Host header and set it to what the server expects:
        // Host: "your-expected-hostname.example",
      },
      // Avoid following any odd upstream redirects automatically
      redirect: "manual",
      // NOTE: Next.js does not support fetch revalidate caching in middleware (see docs)
    });

    // Fail open on upstream errors
    if (!res.ok) return NextResponse.next();

    // Only parse JSON if the response actually is JSON
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      // Upstream sometimes returns HTML (e.g., "Direct IP ..."); skip redirect logic
      return NextResponse.next();
    }

    const data = await res.json().catch(() => null);
    if (!data?.items?.length) return NextResponse.next();

    // Find an exact match for the current path
    const redirect = data.items.find((item: any) => item?.url === pathname);
    if (!redirect?.action_data?.url) return NextResponse.next();

    // Build absolute target URL against the current request origin
    const target = new URL(
      redirect.action_data.url,
      request.nextUrl.origin
    ).toString();

    // Map WP 301 → 308 (preserve method); else use 307
    const status = redirect.action_code === 301 ? 308 : 307;

    return NextResponse.redirect(target, { status });
  } catch {
    // Network/parse problems? Never break the page.
    return NextResponse.next();
  }
}

// Run only on real page routes (skip _next, API, and static assets)
// Docs: matcher must be statically analyzable constants.
export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt|xml|webp|woff2?|ttf|otf)).*)",
  ],
};
