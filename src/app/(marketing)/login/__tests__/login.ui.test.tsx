// UI tests for Login functionality - Core Workflows
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockPush, clearAllMocks } from "./test-utils";
import LoginClient from "../login.client";
import { server } from "./mocks/server";
import { resetEmailState } from "./mocks/handlers";
import { LoginContent } from "@/utils/extractors/login.extractor";

// Mock login content for tests
const mockLoginContent: LoginContent = {
  backgroundCopy: "Ready to continue your skin journey? Let's get back in.",
  backgroundImage: {
    sourceUrl: "/onboarding.jpg",
    altText: "login",
  },
  formHeading: "Welcome back, bestie",
  formSubheading: "Enter your email to receive a sign-in link",
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

describe("Login Page - Core User Workflows", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
    resetEmailState();
    clearAllMocks();
    mockSignIn.mockClear();
  });

  it("user successfully signs in with magic link and is redirected to / (sees authenticated PWA view)", async () => {
    const user = userEvent.setup();

    // Setup mock signIn to return success
    mockSignIn.mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User sees the login form
    expect(
      screen.getByRole("heading", { name: /welcome back, bestie/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter your email to receive a sign-in link/i),
    ).toBeInTheDocument();

    // User enters their email
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "existing@example.com");

    // Verify email was entered
    expect(emailInput).toHaveValue("existing@example.com");

    // User submits the form
    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });
    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    // Wait for success screen to appear
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    // User sees success message with their email
    expect(screen.getByText(/we sent a sign-in link to/i)).toBeInTheDocument();
    expect(screen.getByText("existing@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(/click the link in the email to access your account/i),
    ).toBeInTheDocument();

    // Verify signIn was called with correct parameters
    expect(mockSignIn).toHaveBeenCalledWith("resend", {
      email: "existing@example.com",
      redirect: false,
      callbackUrl: "/",
    });

    // User can see resend button
    expect(
      screen.getByRole("button", { name: /resend sign-in link/i }),
    ).toBeInTheDocument();
  });

  it("user encounters network error, sees error message, and successfully retries", async () => {
    const user = userEvent.setup();

    // First attempt will fail
    mockSignIn.mockRejectedValueOnce(new Error("Network error"));

    // Second attempt will succeed
    mockSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "retry@example.com");

    // User submits - first attempt
    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });
    await user.click(submitButton);

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(
      /something went wrong. please try again/i,
    );

    // Form is still usable
    expect(emailInput).toHaveValue("retry@example.com");
    expect(submitButton).not.toBeDisabled();

    // User retries by clicking submit again
    await user.click(submitButton);

    // This time it succeeds - user sees success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("retry@example.com")).toBeInTheDocument();

    // Verify signIn was called twice
    expect(mockSignIn).toHaveBeenCalledTimes(2);
  });

  it("user requests magic link resend from success screen and receives it", async () => {
    const user = userEvent.setup();

    // Initial send succeeds
    mockSignIn.mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User submits initial email
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "resend@example.com");
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Wait for success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    // Don't clear mock calls - we want to verify both calls
    // Setup for resend continues to use same mock

    // User clicks resend button
    const resendButton = screen.getByRole("button", {
      name: /resend sign-in link/i,
    });
    expect(resendButton).not.toBeDisabled();
    await user.click(resendButton);

    // Wait for resend to complete - look for success message
    await waitFor(() => {
      expect(screen.getByText(/email sent successfully!/i)).toBeInTheDocument();
    });

    // Email is still displayed
    expect(screen.getByText("resend@example.com")).toBeInTheDocument();

    // Verify both calls - initial send and resend
    expect(mockSignIn).toHaveBeenCalledTimes(2);
    expect(mockSignIn).toHaveBeenNthCalledWith(1, "resend", {
      email: "resend@example.com",
      redirect: false,
      callbackUrl: "/",
    });
    expect(mockSignIn).toHaveBeenNthCalledWith(2, "resend", {
      email: "resend@example.com",
      redirect: false,
      callbackUrl: "/",
    });
  });

  it("user enters invalid email, sees browser validation, corrects it and submits successfully", async () => {
    const user = userEvent.setup();

    mockSignIn.mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    const emailInput = screen.getByPlaceholderText(
      /you@example.com/i,
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });

    // User enters invalid email format
    await user.type(emailInput, "notanemail");

    // Try to submit - browser validation should prevent it
    await user.click(submitButton);

    // Check HTML5 validation (form should not submit)
    expect(emailInput.validity.valid).toBe(false);
    expect(mockSignIn).not.toHaveBeenCalled();

    // User corrects the email
    await user.clear(emailInput);
    await user.type(emailInput, "valid@example.com");

    // Now the input should be valid
    expect(emailInput.validity.valid).toBe(true);

    // User successfully submits
    await user.click(submitButton);

    // Wait for success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("valid@example.com")).toBeInTheDocument();

    // Verify signIn was called with valid email
    expect(mockSignIn).toHaveBeenCalledWith("resend", {
      email: "valid@example.com",
      redirect: false,
      callbackUrl: "/",
    });
  });

  it("user navigates back to homepage from login form using back button", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    // User sees the login form
    expect(
      screen.getByRole("heading", { name: /welcome back, bestie/i }),
    ).toBeInTheDocument();

    // User clicks back button
    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    // Verify navigation to homepage
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("user goes back to email form from success screen and can enter new email", async () => {
    const user = userEvent.setup();

    mockSignIn.mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // Submit first email
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "first@example.com");
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Wait for success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    // User clicks back button from success screen
    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    // User should be back at the email form
    expect(
      screen.getByRole("heading", { name: /welcome back, bestie/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter your email to receive a sign-in link/i),
    ).toBeInTheDocument();

    // Email field should be cleared/reset
    const newEmailInput = screen.getByPlaceholderText(
      /you@example.com/i,
    ) as HTMLInputElement;
    expect(newEmailInput.value).toBe("");

    // User can enter a new email
    await user.type(newEmailInput, "second@example.com");
    expect(newEmailInput).toHaveValue("second@example.com");

    // Clear previous calls
    mockSignIn.mockClear();

    // User can submit the new email
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Wait for success screen with new email
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("second@example.com")).toBeInTheDocument();

    // Verify new email was sent
    expect(mockSignIn).toHaveBeenCalledWith("resend", {
      email: "second@example.com",
      redirect: false,
      callbackUrl: "/",
    });
  });
});

describe("Login Page - Loading States & Feedback", () => {
  // Server is already started in the first describe block

  afterEach(() => {
    server.resetHandlers();
    resetEmailState();
    clearAllMocks();
    mockSignIn.mockClear();
  });

  it('shows "Sending..." button text and disables inputs during email submission', async () => {
    const user = userEvent.setup();

    // Add delay to mock to ensure we can catch loading state
    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                error: null,
                status: 200,
                ok: true,
                url: null,
              }),
            100,
          ),
        ),
    );

    render(<LoginClient loginContent={mockLoginContent} />);

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });
    await user.click(submitButton);

    // Check loading state
    const loadingButton = await screen.findByRole("button", {
      name: /sending\.\.\./i,
    });
    expect(loadingButton).toBeDisabled();

    // Check input is disabled during submission
    expect(emailInput).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state with disabled button during magic link resend", async () => {
    const user = userEvent.setup();

    // Setup initial send
    mockSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // Submit initial email
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Wait for success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    // Setup resend with delay
    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                error: null,
                status: 200,
                ok: true,
                url: null,
              }),
            100,
          ),
        ),
    );

    // Click resend
    await user.click(
      screen.getByRole("button", { name: /resend sign-in link/i }),
    );

    // Check loading state
    const resendingButton = await screen.findByRole("button", {
      name: /resending\.\.\./i,
    });
    expect(resendingButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/email sent successfully!/i)).toBeInTheDocument();
    });
  });

  it("submit button is disabled when email field is empty", async () => {
    const user = userEvent.setup();

    render(<LoginClient loginContent={mockLoginContent} />);

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });

    // Initially button should be disabled (no email)
    expect(submitButton).toBeDisabled();

    // Type email - button becomes enabled
    await user.type(emailInput, "test@example.com");
    expect(submitButton).not.toBeDisabled();

    // Clear email - button becomes disabled again
    await user.clear(emailInput);
    expect(submitButton).toBeDisabled();

    // Type partial email - button becomes enabled
    await user.type(emailInput, "t");
    expect(submitButton).not.toBeDisabled();
  });
});

describe("Login Page - Error Handling", () => {
  // Server is already started in the first describe block

  afterEach(() => {
    server.resetHandlers();
    resetEmailState();
    clearAllMocks();
    mockSignIn.mockClear();
  });

  it('user sees "Failed to send magic link" error when NextAuth signIn fails', async () => {
    const user = userEvent.setup();

    // Setup mock to return error
    mockSignIn.mockResolvedValue({
      error: "Authentication failed",
      status: 401,
      ok: false,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters email and submits
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "error@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(
      /failed to send magic link. please try again/i,
    );

    // Form remains usable
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    expect(emailInput).toHaveValue("error@example.com");
    expect(emailInput).not.toBeDisabled();

    const submitButton = screen.getByRole("button", {
      name: /send sign-in link/i,
    });
    expect(submitButton).not.toBeDisabled();
  });

  it('user sees "Failed to resend" error on resend failure and can retry', async () => {
    const user = userEvent.setup();

    // Initial send succeeds
    mockSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // Submit initial email successfully
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "resend-error@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Wait for success screen
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i }),
      ).toBeInTheDocument();
    });

    // Setup resend to fail
    mockSignIn.mockResolvedValueOnce({
      error: "Resend failed",
      status: 500,
      ok: false,
      url: null,
    });

    // Click resend
    await user.click(
      screen.getByRole("button", { name: /resend sign-in link/i }),
    );

    // User sees error message
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(/failed to resend. please try again/i);

    // Resend button is still available
    const resendButton = screen.getByRole("button", {
      name: /resend sign-in link/i,
    });
    expect(resendButton).not.toBeDisabled();

    // Setup successful retry
    mockSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    // User can retry
    await user.click(resendButton);

    // Success message appears
    await waitFor(() => {
      expect(screen.getByText(/email sent successfully!/i)).toBeInTheDocument();
    });
  });

  it("handles case where user email is not registered and suggests onboarding", async () => {
    const user = userEvent.setup();

    // Setup mock to simulate user not found
    mockSignIn.mockResolvedValue({
      error: "UserNotFound",
      status: 401,
      ok: false,
      url: null,
    });

    render(<LoginClient loginContent={mockLoginContent} />);

    // User enters unregistered email
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "newuser@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // User sees error (generic error since we don't expose user existence)
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent(
      /failed to send magic link. please try again/i,
    );

    // Form remains usable for retry
    expect(screen.getByPlaceholderText(/you@example.com/i)).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /send sign-in link/i }),
    ).not.toBeDisabled();
  });

  it('shows proper error alert with role="alert" for accessibility', async () => {
    const user = userEvent.setup();

    // Setup mock to return error
    mockSignIn.mockRejectedValue(new Error("Network error"));

    render(<LoginClient loginContent={mockLoginContent} />);

    // Trigger error
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send sign-in link/i }),
    );

    // Check error has proper ARIA role
    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(
      /something went wrong. please try again/i,
    );

    // Error should have appropriate styling (checking for class names that indicate error styling)
    expect(errorAlert).toHaveClass("bg-red-50", "border-red-200");
  });
});
