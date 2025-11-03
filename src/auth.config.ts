import type { NextAuthConfig } from "next-auth";

// Base configuration without database adapter (safe for Edge runtime)
// This is used in middleware which runs in Edge runtime
// Note: No providers here because middleware only verifies sessions, not sign-in
export default {
  providers: [],
  callbacks: {
    async signIn({ user }) {
      // Only allow sign-in if user already exists
      return !!user.email;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
  trustHost: true,
} satisfies NextAuthConfig;
