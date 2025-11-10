// TEMPORARY: Mock API for simulating backend while it's being developed
// This file should be removed once the real backend is ready

const MOCK_DELAY = 800; // Simulate network delay

// Simulate users with different onboarding states
const MOCK_USERS = {
  "complete@example.com": {
    exists: true,
    isCompleted: true,
    completedSteps: [
      "PERSONAL",
      "SKIN_TYPE",
      "SKIN_CONCERNS",
      "ALLERGIES",
      "SUBSCRIPTION",
      "BOOKING",
    ],
  },
  "incomplete@example.com": {
    exists: true,
    isCompleted: false,
    completedSteps: ["PERSONAL", "SKIN_TYPE"],
  },
  "neverstarted@example.com": {
    exists: true,
    isCompleted: false,
    completedSteps: [],
  },
  "newuser@example.com": {
    exists: false,
    isCompleted: false,
    completedSteps: [],
  },
};

// Mock verification codes (in real backend these would be in database)
const mockCodes = new Map<string, { code: string; expiresAt: Date }>();

export interface ProfileStatusResponse {
  exists: boolean;
  isCompleted: boolean;
  completedSteps?: string[];
  message?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  error?: string;
}

/**
 * Check if user profile exists and if onboarding is complete
 */
export async function checkProfileStatus(
  email: string,
): Promise<ProfileStatusResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const user = MOCK_USERS[email as keyof typeof MOCK_USERS] || {
    exists: false,
    isCompleted: false,
    completedSteps: [],
  };

  if (!user.exists) {
    return {
      exists: false,
      isCompleted: false,
      message: "No account found with this email",
    };
  }

  return {
    exists: true,
    isCompleted: user.isCompleted,
    completedSteps: user.completedSteps,
  };
}

/**
 * Send verification email (mock - just generates a code)
 */
export async function sendVerificationEmail(email: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store it with 30 minute expiration
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  mockCodes.set(email, { code, expiresAt });

  // In dev, log the code so we can test
  console.log(`🔐 Verification code for ${email}: ${code}`);
  console.log(`   Expires at: ${expiresAt.toLocaleTimeString()}`);
}

/**
 * Verify the 6-digit code
 */
export async function verifyCode(
  email: string,
  code: string,
): Promise<VerifyCodeResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const stored = mockCodes.get(email);

  if (!stored) {
    return {
      success: false,
      error: "No verification code found. Please request a new one.",
    };
  }

  // Check if expired
  if (new Date() > stored.expiresAt) {
    mockCodes.delete(email);
    return {
      success: false,
      error: "This code has expired. Please request a new one.",
    };
  }

  // Check if code matches
  if (stored.code !== code) {
    return {
      success: false,
      error: "Invalid code. Please check and try again.",
    };
  }

  // Success - remove the code so it can only be used once
  mockCodes.delete(email);
  return { success: true };
}

// Export mock users for reference in tests
export { MOCK_USERS };
