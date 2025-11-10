// /app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
import type { NextRequest } from "next/server";

const { GET: nextauthGET, POST } = handlers;

// Scanners use HEAD; never redeem on HEAD
export async function HEAD(_req: NextRequest) {
  return new Response(null, { status: 200 });
}

// Treat Safe Links (no user gesture) as a probe and ignore it
function isSafeLinksProbe(req: NextRequest) {
  const ref = (req.headers.get("referer") || "").toLowerCase();
  const fromSafeLinks =
    ref.includes("safelinks.protection.outlook.com") ||
    ref.includes("safelinks.protection.office.com");

  // Real human clicks: Sec-Fetch-User=?1 and Sec-Fetch-Mode=navigate
  const hasUserGesture = req.headers.get("sec-fetch-user") === "?1";
  const isNavigate =
    (req.headers.get("sec-fetch-mode") || "").toLowerCase() === "navigate";

  return fromSafeLinks && !(hasUserGesture && isNavigate);
}

export async function GET(req: NextRequest) {
  if (isSafeLinksProbe(req)) {
    // Ignore probe: do not reach Auth.js, do not delete the token
    return new Response(null, { status: 204 });
  }
  return nextauthGET(req);
}

export { POST };
