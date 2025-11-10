// MSW handlers for mock auth API endpoints
import { http, HttpResponse } from "msw";

// Mock user database (matching our mock-auth-api.ts)
const MOCK_USERS: Record<
  string,
  {
    exists: boolean;
    isCompleted: boolean;
    completedSteps: string[];
  }
> = {
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
  "njungedev@gmail.com": {
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
  "njunge@mitalabs.dev": {
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
  "newuser@example.com": {
    exists: false,
    isCompleted: false,
    completedSteps: [],
  },
};

// Mock verification codes storage
const mockCodes = new Map<
  string,
  { code: string; expiresAt: Date; used: boolean }
>();

// Test control flags
let shouldFailProfileCheck = false;
let shouldFailVerification = false;
let shouldReturnExpiredCode = false;

export const handlers = [
  // Mock checkProfileStatus
  http.get("/api/mock-auth/profile-status", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (shouldFailProfileCheck) {
      return HttpResponse.error();
    }

    if (!email) {
      return HttpResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const user = MOCK_USERS[email] || {
      exists: false,
      isCompleted: false,
      completedSteps: [],
    };

    return HttpResponse.json(user);
  }),

  // Mock sendVerificationEmail
  http.post("/api/mock-auth/send-code", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    mockCodes.set(email, { code, expiresAt, used: false });

    return HttpResponse.json({ success: true });
  }),

  // Mock verifyCode
  http.post("/api/mock-auth/verify-code", async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email: string;
      code: string;
    };

    if (shouldFailVerification) {
      return HttpResponse.json(
        {
          success: false,
          error: "Something went wrong. Please try again.",
        },
        { status: 500 },
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const stored = mockCodes.get(email);

    if (!stored) {
      return HttpResponse.json({
        success: false,
        error: "No verification code found. Please request a new one.",
      });
    }

    // Check if expired (or force expired for testing)
    if (shouldReturnExpiredCode || new Date() > stored.expiresAt) {
      mockCodes.delete(email);
      return HttpResponse.json({
        success: false,
        error: "This code has expired. Please request a new one.",
      });
    }

    // Check if already used
    if (stored.used) {
      return HttpResponse.json({
        success: false,
        error: "This code has already been used. Please request a new one.",
      });
    }

    // Check if code matches
    if (stored.code !== code) {
      return HttpResponse.json({
        success: false,
        error: "Invalid code. Please check and try again.",
      });
    }

    // Mark as used
    stored.used = true;
    mockCodes.set(email, stored);

    return HttpResponse.json({ success: true });
  }),

  // Mock NextAuth signIn for verification-code provider
  http.post("/api/auth/signin/verification-code", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return HttpResponse.json({
      ok: true,
      status: 200,
      url: "/dashboard",
    });
  }),

  // Mock NextAuth signIn for resend provider (magic link)
  http.post("/api/auth/signin/resend", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return HttpResponse.json({
      ok: true,
      status: 200,
      url: "/verify-request",
    });
  }),

  // Mock NextAuth session
  http.get("/api/auth/session", () => {
    return HttpResponse.json({
      user: null,
      expires: null,
    });
  }),

  // Mock NextAuth CSRF
  http.get("/api/auth/csrf", () => {
    return HttpResponse.json({
      csrfToken: "test-csrf-token-12345",
    });
  }),
];

// Helper functions for tests
export function resetMockState() {
  mockCodes.clear();
  shouldFailProfileCheck = false;
  shouldFailVerification = false;
  shouldReturnExpiredCode = false;
}

export function setProfileCheckToFail() {
  shouldFailProfileCheck = true;
}

export function setVerificationToFail() {
  shouldFailVerification = true;
}

export function setCodeToExpired() {
  shouldReturnExpiredCode = true;
}

export function getStoredCodeForEmail(email: string): string | null {
  const stored = mockCodes.get(email);
  return stored ? stored.code : null;
}
