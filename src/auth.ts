import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.FROM_EMAIL!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow sign-in if user already exists
      // User is created during onboarding, not during auth
      return !!user.email;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home after successful sign-in (will show @auth slot)
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      // Redirect magic link sign-ins to home (authenticated users see PWA)
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
  trustHost: true,
});
