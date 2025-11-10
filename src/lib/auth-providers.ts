/**
 * Custom NextAuth Providers
 */

import Credentials from "next-auth/providers/credentials";
import { api } from "./api-client";

/**
 * Verification Code Provider
 * Handles passwordless login with 6-digit verification codes
 */
export const VerificationCodeProvider = Credentials({
  id: "verification-code",
  name: "Verification Code",
  credentials: {
    email: { label: "Email", type: "email" },
    code: { label: "Code", type: "text" },
  },
  async authorize(credentials) {
    console.log(
      "🎫 [VerificationCodeProvider] authorize called for:",
      credentials?.email,
    );

    if (!credentials?.email || !credentials?.code) {
      console.error("❌ [VerificationCodeProvider] Missing email or code");
      throw new Error("Email and code are required");
    }

    try {
      // Verify the code with the backend API
      console.log("🔐 [VerificationCodeProvider] Verifying code...");
      const result = await api.post("/api/consumer-app/auth/verify-code", {
        identifier: credentials.email as string,
        code: credentials.code as string,
      });

      if (!result.identifier) {
        console.error("❌ [VerificationCodeProvider] Invalid code response");
        throw new Error("Invalid verification code");
      }

      console.log(
        "✅ [VerificationCodeProvider] Code verified, fetching user...",
      );

      // Get user details from backend (404 is valid response)
      const response = await api.get(
        `/api/consumer-app/auth/user-by-email?email=${encodeURIComponent(credentials.email as string)}`,
        { allow404: true },
      );

      if (!response.user) {
        console.error(
          "❌ [VerificationCodeProvider] User not found after code verification",
        );
        throw new Error("User not found");
      }

      console.log(
        "✅ [VerificationCodeProvider] User authenticated:",
        response.user.id,
      );

      // Return user object for NextAuth session
      return {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        image: response.user.image,
      };
    } catch (error) {
      console.error("❌ [VerificationCodeProvider] authorize error:", error);
      // Return null to indicate authentication failure
      return null;
    }
  },
});
