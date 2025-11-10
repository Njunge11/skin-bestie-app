// UI tests for Login with Verification Code - Core Workflows
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
  beforeEach,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockPush, clearAllMocks } from "./test-utils";
import LoginClient from "../login.client";
import { server } from "./mocks/server";
import {
  resetMockState,
  getStoredCodeForEmail,
  setCodeToExpired,
} from "./mocks/handlers";
import { LoginContent } from "@/utils/extractors/login.extractor";
import * as loginActions from "../actions";

// Mock login content for tests
const mockLoginContent: LoginContent = {
  backgroundCopy: "Ready to continue your skin journey? Let's get back in.",
  backgroundImage: {
    sourceUrl: "/onboarding.jpg",
    altText: "login",
  },
  formHeading: "Welcome back, bestie",
  formSubheading: "Sign in to your account",
};

// Mock next-auth/react signIn function
const mockSignIn = vi.fn();
vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual("next-auth/react");
  return {
    ...actual,
    signIn: (...args: unknown[]) => mockSignIn(...args),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock the login server actions
vi.mock("../actions", () => ({
  checkUserByEmailAction: vi.fn(),
  createVerificationCodeAction: vi.fn(),
}));

// Global server setup - only start/stop once for all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterAll(() => {
  server.close();
});

describe("Login - Happy Path Workflows", () => {
  beforeEach(() => {
    // Setup default successful responses matching backend API structure
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    // NextAuth signIn returns undefined error when successful
    mockSignIn.mockResolvedValue({
      error: undefined,
      ok: true,
      status: 200,
      code: undefined,
      url: "/dashboard",
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user successfully logs in with verification code and is redirected to dashboard", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User sees the login form
    expect(
      screen.getByRole("heading", { name: /welcome back, bestie/i }),
    ).toBeInTheDocument();

    // User enters their email
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "complete@example.com");

    // User submits the form
    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);

    // User sees code input screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we've sent a 6-digit code to/i),
    ).toBeInTheDocument();
    expect(screen.getByText("complete@example.com")).toBeInTheDocument();

    // Profile check was called
    expect(loginActions.checkUserByEmailAction).toHaveBeenCalledWith(
      "complete@example.com",
    );

    // Verification email was sent
    expect(loginActions.createVerificationCodeAction).toHaveBeenCalledWith(
      "complete@example.com",
    );

    // User enters verification code
    const codeInput = screen.getByLabelText(/verification code/i);
    await user.type(codeInput, "123456");

    // Verify button becomes enabled
    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    expect(verifyButton).not.toBeDisabled();

    // User clicks verify
    await user.click(verifyButton);

    // NextAuth signIn was called with verification-code provider
    // This will verify the code via VerificationCodeProvider
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("verification-code", {
        email: "complete@example.com",
        code: "123456",
        redirect: false,
        callbackUrl: "/dashboard",
      });
    });
  });
});

describe("Login - Onboarding Blocked Workflows", () => {
  beforeEach(() => {
    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user with incomplete onboarding sees blocked screen and is redirected to onboarding", async () => {
    const user = userEvent.setup();

    // Mock incomplete profile
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-incomplete",
        email: "incomplete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Incomplete User",
        image: null,
      },
      profile: {
        id: "profile-incomplete",
        userId: "user-incomplete",
        email: "incomplete@example.com",
        firstName: "Incomplete",
        lastName: null,
        phoneNumber: null,
        dateOfBirth: null,
        onboardingComplete: false,
      },
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "incomplete@example.com");

    // User submits
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // User sees onboarding blocked screen
    expect(
      await screen.findByRole("heading", { name: /almost there!/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your account.*needs to complete onboarding/i),
    ).toBeInTheDocument();
    expect(screen.getByText("incomplete@example.com")).toBeInTheDocument();

    // User clicks continue to onboarding
    const continueButton = screen.getByRole("button", {
      name: /continue to onboarding/i,
    });
    await user.click(continueButton);

    // User redirected to onboarding
    expect(mockPush).toHaveBeenCalledWith("/onboarding");
  });

  it("user with no account sees error message and onboarding link", async () => {
    const user = userEvent.setup();

    // Mock no user found (404 response)
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: null,
      profile: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "newuser@example.com");

    // User submits
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(
      /we couldn't find an account with this email/i,
    );

    // User sees onboarding link
    const onboardingLink = screen.getByRole("button", {
      name: /new to skinbestie\? get started here/i,
    });
    await user.click(onboardingLink);

    // User redirected to onboarding
    expect(mockPush).toHaveBeenCalledWith("/onboarding");
  });
});

describe("Login - Error Recovery Workflows", () => {
  beforeEach(() => {
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user enters invalid code, sees error, button returns to normal state", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Mock NextAuth signIn to return error (simulating VerificationCodeProvider returning null)
    // In NextAuth v5 beta, ok can be true even with error (bug)
    mockSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      code: "credentials",
      status: 200,
      ok: true, // Bug in NextAuth v5 beta
      url: null,
    });

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.type(codeInput, "999999");

    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    await user.click(verifyButton);

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/invalid verification code/i);

    // Button should return to normal (not disabled/loading)
    expect(verifyButton).not.toBeDisabled();
    expect(verifyButton).toHaveTextContent(/verify code/i);

    // User can try again with correct code
    mockSignIn.mockResolvedValueOnce({
      error: undefined,
      ok: true,
      status: 200,
      code: undefined,
      url: "/dashboard",
    });

    await user.clear(codeInput);
    await user.type(codeInput, "123456");
    await user.click(verifyButton);

    // Should redirect to dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("user resends code after getting invalid code error", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email and gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // User enters invalid code
    mockSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      code: "credentials",
      status: 200,
      ok: true,
      url: null,
    });

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.type(codeInput, "111111");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // User sees error
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/invalid verification code/i);

    // User decides to request a new code instead of retrying
    const resendButton = screen.getByRole("button", { name: /resend email/i });
    await user.click(resendButton);

    // Input is cleared after resend
    await waitFor(() => {
      expect(codeInput).toHaveValue("");
    });

    // User sees success message
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();

    // User enters the new correct code
    mockSignIn.mockResolvedValueOnce({
      error: undefined,
      ok: true,
      status: 200,
      code: undefined,
      url: "/dashboard",
    });

    await user.type(codeInput, "123456");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // Should redirect to dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("user encounters network error during profile check and successfully retries", async () => {
    const user = userEvent.setup();

    // First attempt fails
    vi.mocked(loginActions.checkUserByEmailAction).mockRejectedValueOnce(
      new Error("Network error"),
    );

    // Second attempt succeeds
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValueOnce({
      user: {
        id: "user-retry",
        email: "retry@example.com",
        emailVerified: new Date().toISOString(),
        name: "Retry User",
        image: null,
      },
      profile: {
        id: "profile-retry",
        userId: "user-retry",
        email: "retry@example.com",
        firstName: "Retry",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email
    await user.type(
      screen.getByLabelText(/email address/i),
      "retry@example.com",
    );

    // User submits - first attempt
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/something went wrong/i);

    // Form is still usable
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "retry@example.com",
    );
    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).not.toBeDisabled();

    // User retries
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // This time succeeds - user sees code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Verify checkProfileStatus was called twice
    expect(loginActions.checkUserByEmailAction).toHaveBeenCalledTimes(2);
  });
});

describe("Login - Resend Code Workflow", () => {
  beforeEach(() => {
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user resends verification code successfully and input is cleared", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "resend@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // User starts typing a code
    const codeInput = screen.getByLabelText(/verification code/i);
    await user.type(codeInput, "123");
    expect(codeInput).toHaveValue("123");

    // User realizes they need to resend
    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).not.toBeDisabled();

    await user.click(resendButton);

    // Code input should be cleared immediately
    await waitFor(() => {
      expect(codeInput).toHaveValue("");
    });

    // User sees success message
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();

    // Email is still displayed
    expect(screen.getByText("resend@example.com")).toBeInTheDocument();

    // Verify sendVerificationEmail was called twice (initial + resend)
    expect(loginActions.createVerificationCodeAction).toHaveBeenCalledTimes(2);
    expect(loginActions.createVerificationCodeAction).toHaveBeenCalledWith(
      "resend@example.com",
    );
  });
});

describe("Login - Navigation and Validation", () => {
  beforeEach(() => {
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user navigates back from code screen to email screen", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "first@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // User clicks back button
    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    // User should be back at the email form
    expect(
      screen.getByRole("heading", { name: /welcome back, bestie/i }),
    ).toBeInTheDocument();

    // Email field should be cleared
    expect(screen.getByLabelText(/email address/i)).toHaveValue("");

    // User can enter a new email
    await user.type(
      screen.getByLabelText(/email address/i),
      "second@example.com",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    // User sees code screen with new email
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("second@example.com")).toBeInTheDocument();
  });

  it("user navigates back to homepage from login form using back button", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User clicks back button
    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    // Verify navigation to homepage
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("verify button is disabled until 6 digits are entered", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    const codeInput = await screen.findByLabelText(/verification code/i);
    const verifyButton = screen.getByRole("button", { name: /verify code/i });

    // Button starts disabled
    expect(verifyButton).toBeDisabled();

    // Type 1-5 digits - button stays disabled
    await user.type(codeInput, "12345");
    expect(verifyButton).toBeDisabled();

    // Type 6th digit - button becomes enabled
    await user.type(codeInput, "6");
    expect(verifyButton).not.toBeDisabled();

    // Clear - button becomes disabled again
    await user.clear(codeInput);
    expect(verifyButton).toBeDisabled();
  });

  it("code input only accepts numeric characters and max 6 digits", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    const codeInput = await screen.findByLabelText(/verification code/i);

    // Try typing letters and special characters
    await user.type(codeInput, "abc!@#123xyz789");

    // Only numbers should be in the field, max 6
    expect(codeInput).toHaveValue("123789");
  });
});

describe("Login - Loading States", () => {
  beforeEach(() => {
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                code: "123456",
                expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              }),
            200,
          ),
        ),
    );

    // Mock NextAuth signIn with delay to test loading state
    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                error: undefined,
                ok: true,
                status: 200,
                code: undefined,
                url: "/dashboard",
              }),
            200,
          ),
        ),
    );
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it('shows "Checking..." button text during email submission', async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email
    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com",
    );

    // User submits
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Check loading state
    expect(
      await screen.findByRole("button", { name: /checking\.\.\./i }),
    ).toBeDisabled();

    // Wait for completion
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();
  });

  it('shows "Verifying..." button text during code verification', async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    const codeInput = await screen.findByLabelText(/verification code/i);

    // User enters code
    await user.type(codeInput, "123456");

    // User submits
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // Check loading state
    expect(
      await screen.findByRole("button", { name: /verifying\.\.\./i }),
    ).toBeDisabled();
  });

  it('shows "Resending..." during resend operation', async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // User clicks resend
    await user.click(screen.getByRole("button", { name: /resend email/i }));

    // Check loading state
    expect(
      await screen.findByRole("button", { name: /resending\.\.\./i }),
    ).toBeDisabled();

    // Wait for completion
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();
  });
});

describe("Login - Magic Link Toggle", () => {
  beforeEach(() => {
    vi.mocked(loginActions.checkUserByEmailAction).mockResolvedValue({
      user: {
        id: "user-123",
        email: "complete@example.com",
        emailVerified: new Date().toISOString(),
        name: "Test User",
        image: null,
      },
      profile: {
        id: "profile-123",
        userId: "user-123",
        email: "complete@example.com",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01T00:00:00Z",
        onboardingComplete: true,
      },
    });

    vi.mocked(loginActions.createVerificationCodeAction).mockResolvedValue({
      code: "123456",
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK;
  });

  it("shows only verification code message when magic link is disabled", async () => {
    const user = userEvent.setup();

    // Explicitly set to false (disabled)
    process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK = "false";

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Should show ONLY verification code message (no magic link mentioned)
    expect(
      screen.getByText(/we've sent a 6-digit code to/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter your code below to continue/i),
    ).toBeInTheDocument();

    // Should NOT mention magic link
    expect(screen.queryByText(/sign-in link and/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/click the link/i)).not.toBeInTheDocument();

    // Verify magic link was NOT sent (signIn for resend should not be called)
    expect(mockSignIn).not.toHaveBeenCalledWith("resend", expect.anything());
  });

  it("shows both magic link and verification code message when enabled", async () => {
    const user = userEvent.setup();

    // Enable magic link
    process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK = "true";

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Should show BOTH magic link and verification code
    expect(
      screen.getByText(/we've sent a sign-in link and 6-digit code to/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/click the link or enter your code below to continue/i),
    ).toBeInTheDocument();

    // Verify magic link WAS sent
    expect(mockSignIn).toHaveBeenCalledWith("resend", {
      email: "complete@example.com",
      redirect: false,
      callbackUrl: "/",
    });
  });

  it("sends magic link on resend when enabled", async () => {
    const user = userEvent.setup();

    // Enable magic link
    process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK = "true";

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Clear mock to check resend call
    mockSignIn.mockClear();

    // User clicks resend
    await user.click(screen.getByRole("button", { name: /resend email/i }));

    // Verify magic link was sent again
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("resend", {
        email: "complete@example.com",
        redirect: false,
        callbackUrl: "/",
      });
    });
  });

  it("does NOT send magic link on resend when disabled", async () => {
    const user = userEvent.setup();

    // Disable magic link
    process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK = "false";

    render(<LoginClient loginContent={mockLoginContent} />);

    // User gets to code screen
    await user.type(
      screen.getByLabelText(/email address/i),
      "complete@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Wait for code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // User clicks resend
    await user.click(screen.getByRole("button", { name: /resend email/i }));

    // Wait for resend to complete
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();

    // Verify magic link was NOT sent
    expect(mockSignIn).not.toHaveBeenCalled();

    // But verification email was sent
    expect(loginActions.createVerificationCodeAction).toHaveBeenCalledTimes(2);
  });
});
