import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { HttpAdapter } from "@/lib/http-adapter";
import { VerificationCodeProvider } from "@/lib/auth-providers";
import authConfig from "./auth.config";

// Full Auth.js instance with HTTP adapter (for server-side use)
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: HttpAdapter(),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    // Verification code provider (6-digit code)
    VerificationCodeProvider,
    // Magic link provider (optional, controlled by NEXT_PUBLIC_ENABLE_MAGIC_LINK)
    ...(process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === "true"
      ? [
          Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: process.env.FROM_EMAIL!,
          }),
        ]
      : []),
  ],
});
