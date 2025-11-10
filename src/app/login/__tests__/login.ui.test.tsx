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
import * as mockAuthApi from "@/lib/mock-auth-api";

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

// Mock the auth API module
vi.mock("@/lib/mock-auth-api", () => ({
  checkProfileStatus: vi.fn(),
  sendVerificationEmail: vi.fn(),
  verifyCode: vi.fn(),
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
    // Setup default successful responses
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
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
    });

    vi.mocked(mockAuthApi.sendVerificationEmail).mockResolvedValue();
    vi.mocked(mockAuthApi.verifyCode).mockResolvedValue({ success: true });
    mockSignIn.mockResolvedValue({ error: null, ok: true, status: 200 });
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
    expect(screen.getByText(/we've sent a 6-digit code to/i)).toBeInTheDocument();
    expect(screen.getByText("complete@example.com")).toBeInTheDocument();

    // Profile check was called
    expect(mockAuthApi.checkProfileStatus).toHaveBeenCalledWith(
      "complete@example.com",
    );

    // Verification email was sent
    expect(mockAuthApi.sendVerificationEmail).toHaveBeenCalledWith(
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

    // Verification was called
    await waitFor(() => {
      expect(mockAuthApi.verifyCode).toHaveBeenCalledWith(
        "complete@example.com",
        "123456",
      );
    });

    // NextAuth signIn was called with verification-code provider
    expect(mockSignIn).toHaveBeenCalledWith("verification-code", {
      email: "complete@example.com",
      code: "123456",
      redirect: true,
      callbackUrl: "/dashboard",
    });
  });
});

describe("Login - Onboarding Blocked Workflows", () => {
  beforeEach(() => {
    vi.mocked(mockAuthApi.sendVerificationEmail).mockResolvedValue();
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
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
      exists: true,
      isCompleted: false,
      completedSteps: ["PERSONAL", "SKIN_TYPE"],
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

    // Mock no profile
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
      exists: false,
      isCompleted: false,
      completedSteps: [],
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
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
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
    });

    vi.mocked(mockAuthApi.sendVerificationEmail).mockResolvedValue();
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user encounters invalid code, expired code, and recovers to login successfully", async () => {
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

    // User enters WRONG code
    vi.mocked(mockAuthApi.verifyCode).mockResolvedValueOnce({
      success: false,
      error: "Invalid code. Please check and try again.",
    });

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.type(codeInput, "999999");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // User sees "Invalid code" error
    let errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/invalid code/i);

    // User clears and tries expired code
    await user.clear(codeInput);

    vi.mocked(mockAuthApi.verifyCode).mockResolvedValueOnce({
      success: false,
      error: "This code has expired. Please request a new one.",
    });

    await user.type(codeInput, "111111");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // User sees "expired" error with "Get a new code" button
    errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/expired/i);

    const getNewCodeButton = screen.getByRole("button", {
      name: /get a new code/i,
    });
    expect(getNewCodeButton).toBeInTheDocument();

    // User clicks "Get a new code"
    await user.click(getNewCodeButton);

    // User sees success message
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();

    // Input is cleared
    expect(codeInput).toHaveValue("");

    // User enters correct code
    vi.mocked(mockAuthApi.verifyCode).mockResolvedValueOnce({ success: true });

    await user.type(codeInput, "123456");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    // Success - NextAuth signIn called
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("verification-code", {
        email: "complete@example.com",
        code: "123456",
        redirect: true,
        callbackUrl: "/dashboard",
      });
    });
  });

  it("user encounters network error during profile check and successfully retries", async () => {
    const user = userEvent.setup();

    // First attempt fails
    vi.mocked(mockAuthApi.checkProfileStatus).mockRejectedValueOnce(
      new Error("Network error"),
    );

    // Second attempt succeeds
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValueOnce({
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
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();

    // User retries
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // This time succeeds - user sees code screen
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    // Verify checkProfileStatus was called twice
    expect(mockAuthApi.checkProfileStatus).toHaveBeenCalledTimes(2);
  });
});

describe("Login - Resend Code Workflow", () => {
  beforeEach(() => {
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
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
    });

    vi.mocked(mockAuthApi.sendVerificationEmail).mockResolvedValue();
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockState();
    clearAllMocks();
    vi.clearAllMocks();
  });

  it("user resends verification code successfully", async () => {
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

    // User clicks "Resend email"
    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).not.toBeDisabled();

    await user.click(resendButton);

    // User sees success message
    expect(
      await screen.findByText(/code sent! check your email/i),
    ).toBeInTheDocument();

    // Email is still displayed
    expect(screen.getByText("resend@example.com")).toBeInTheDocument();

    // Verify sendVerificationEmail was called twice (initial + resend)
    expect(mockAuthApi.sendVerificationEmail).toHaveBeenCalledTimes(2);
    expect(mockAuthApi.sendVerificationEmail).toHaveBeenCalledWith(
      "resend@example.com",
    );
  });
});

describe("Login - Navigation and Validation", () => {
  beforeEach(() => {
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
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
    });

    vi.mocked(mockAuthApi.sendVerificationEmail).mockResolvedValue();
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
    vi.mocked(mockAuthApi.checkProfileStatus).mockResolvedValue({
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
    });

    vi.mocked(mockAuthApi.sendVerificationEmail).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200)),
    );

    vi.mocked(mockAuthApi.verifyCode).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 200),
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
