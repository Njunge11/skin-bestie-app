"use server";

import { api } from "@/lib/api-client";

/**
 * Server Action: Check if user exists and get onboarding status
 */
export async function checkUserByEmailAction(email: string) {
  console.log("🔍 [Server Action] Checking user:", email);

  // 404 is a valid response (user not found)
  const response = await api.get(
    `/api/consumer-app/auth/user-by-email?email=${encodeURIComponent(email)}`,
    { allow404: true },
  );

  console.log("✅ [Server Action] User check result:", {
    exists: !!response.user,
    onboardingComplete: response.profile?.onboardingComplete,
  });

  return response;
}

/**
 * Server Action: Create verification code for passwordless login
 */
export async function createVerificationCodeAction(email: string) {
  console.log("📧 [Server Action] Creating verification code for:", email);

  try {
    const response = await api.post(
      "/api/consumer-app/auth/create-verification-code",
      {
        identifier: email,
      },
    );

    console.log("✅ [Server Action] Verification code created:", {
      codeLength: response.code?.length,
      expires: response.expires,
    });

    return response;
  } catch (error) {
    console.error("❌ [Server Action] Code creation failed:", error);
    throw error;
  }
}
