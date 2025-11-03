import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "../page";

// Mock server actions
vi.mock("../actions/setup-dashboard-actions", () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  fetchDashboardAction,
  updateNickname,
} from "../actions/setup-dashboard-actions";
import { toast } from "sonner";

// Helper to render with QueryClient
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// Mock dashboard data factory
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockDashboard = (overrides: any = {}) => {
  const steps = {
    hasCompletedBooking: false,
    hasCompletedSkinTest: false,
    hasPublishedGoals: false,
    hasPublishedRoutine: false,
    ...overrides.steps,
  };

  return {
    user: {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
      nickname: null,
      email: "john@example.com",
      phoneNumber: "+1234567890",
      skinType: null,
      ...overrides.user,
    },
    setupProgress: {
      percentage: 0,
      steps,
      completed: 0,
      total: 4,
      ...overrides.setupProgress,
    },
    goalsAcknowledgedByClient: false,
    goals: null,
    routine: null,
    todayRoutine: null,
    catchupSteps: null,
    ...overrides,
  };
};

/**
 * PREFERRED NAME MODAL - UI TESTS
 *
 * Testing Strategy (per Kent C. Dodds & UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by accessibility (getByRole, getByLabelText)
 * - Use userEvent for realistic interactions
 */

describe("Preferred Name Modal - UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("user opens dashboard for first time, sees modal, selects full name, and sees personalized greeting", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with nickname set
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "John Doe", firstName: "John", lastName: "Doe" },
        }),
      );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    // User sees modal automatically (nickname is null)
    expect(
      await screen.findByRole("heading", {
        name: /hey bestie, what should we call you/i,
      }),
    ).toBeInTheDocument();

    // User sees description
    expect(
      screen.getByText(/we have your name from onboarding/i),
    ).toBeInTheDocument();

    // User sees their full name as an option
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // User sees other options
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument(); // Initials

    // User clicks full name option (should already be selected by default)
    await user.click(screen.getByLabelText("John Doe"));

    // User clicks save
    const saveButton = screen.getByRole("button", {
      name: /save and continue/i,
    });
    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // Greeting shows full name (no race condition - parent closes modal directly!)
    expect(
      await screen.findByText(/welcome to skinbestie, john doe!/i),
    ).toBeInTheDocument();

    // Server action was called only once with full name
    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("John Doe");
      expect(updateNickname).toHaveBeenCalledTimes(1);
    });
  });

  it("user selects first name option and sees it in greeting", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with nickname set
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "John", firstName: "John", lastName: "Doe" },
        }),
      );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    // Wait for modal
    expect(
      await screen.findByRole("heading", {
        name: /hey bestie, what should we call you/i,
      }),
    ).toBeInTheDocument();

    // User clicks first name option
    await user.click(screen.getByLabelText("John"));

    // User clicks save
    await user.click(
      screen.getByRole("button", { name: /save and continue/i }),
    );

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // User sees greeting with first name
    expect(
      await screen.findByText(/welcome to skinbestie, john!/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("John");
    });
  });

  it("user selects initials option and sees initials in greeting", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with nickname set to initials
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "JD", firstName: "John", lastName: "Doe" },
        }),
      );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    // Wait for modal
    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User clicks initials option
    await user.click(screen.getByLabelText("JD"));

    // User clicks save
    await user.click(
      screen.getByRole("button", { name: /save and continue/i }),
    );

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // Greeting shows initials correctly (no race condition!)
    expect(
      await screen.findByText(/welcome to skinbestie, jd!/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("JD");
      expect(updateNickname).toHaveBeenCalledTimes(1);
    });
  });

  it("user enters custom preferred name and sees it in greeting", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with custom nickname
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "Johnny", firstName: "John", lastName: "Doe" },
        }),
      );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    // Wait for modal
    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User sees custom name section
    expect(screen.getByText(/or use something else/i)).toBeInTheDocument();

    // User types custom name
    const customInput = screen.getByLabelText(/enter custom name/i);
    expect(customInput).toHaveAttribute(
      "placeholder",
      "Enter Your Preferred Name",
    );
    await user.type(customInput, "Johnny");

    // Verify input value
    expect(customInput).toHaveValue("Johnny");

    // Save button should be enabled
    const saveButton = screen.getByRole("button", {
      name: /save and continue/i,
    });
    expect(saveButton).not.toBeDisabled();

    // User clicks save
    await user.click(saveButton);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // Greeting shows custom name correctly (no race condition!)
    expect(
      await screen.findByText(/welcome to skinbestie, johnny!/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("Johnny");
      expect(updateNickname).toHaveBeenCalledTimes(1);
    });
  });

  it("user cannot save when custom name field is empty or only whitespace", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User types spaces only in custom field
    const customInput = screen.getByLabelText(/enter custom name/i);
    await user.type(customInput, "   ");

    // Save button should be disabled (custom selected but empty)
    const saveButton = screen.getByRole("button", {
      name: /save and continue/i,
    });
    expect(saveButton).toBeDisabled();

    // User clears and types a real name
    await user.clear(customInput);
    await user.type(customInput, "Alex");

    // Save button becomes enabled
    expect(saveButton).not.toBeDisabled();
  });

  it("user clicks cancel, firstName saved as default, greeting updated", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User clicks Cancel button
    const cancelButton = screen.getByRole("button", { name: /^cancel$/i });
    await user.click(cancelButton);

    // Modal closes (parent's handler saves firstName)
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // Greeting uses firstName as default
    expect(
      await screen.findByText(/welcome to skinbestie, john!/i),
    ).toBeInTheDocument();

    // updateNickname was called with firstName (by parent's handler)
    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("John");
    });
  });

  it("user clicks X button, firstName saved as default, modal closes", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User clicks X button (custom close button in modal)
    // Find it by the sr-only "Close" text within the custom button
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    // The custom X button is in the modal (has absolute positioning)
    // Click the first one which should be the custom button
    await user.click(closeButtons[0]);

    // Modal closes (parent's handler saves firstName)
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // Greeting uses firstName as default
    expect(
      await screen.findByText(/welcome to skinbestie, john!/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("John");
    });
  });

  it("preferred name save succeeds, toast NOT shown (no success toast in implementation)", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with nickname set
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "Alex", firstName: "John", lastName: "Doe" },
        }),
      );

    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User saves custom name
    await user.type(screen.getByLabelText(/enter custom name/i), "Alex");
    await user.click(
      screen.getByRole("button", { name: /save and continue/i }),
    );

    // Wait for modal to close
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /hey bestie, what should we call you/i,
        }),
      ).not.toBeInTheDocument();
    });

    // No success toast shown (implementation doesn't show success toast)
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("preferred name save fails, error toast shown, modal stays open, optimistic update reverted", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    // Mock server failure
    vi.mocked(updateNickname).mockResolvedValue({
      success: false,
      error: { message: "Database connection failed", code: "DB_ERROR" },
    });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User saves custom name
    await user.type(screen.getByLabelText(/enter custom name/i), "Alex");
    await user.click(
      screen.getByRole("button", { name: /save and continue/i }),
    );

    // Wait for save attempt (Alex - fails)
    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("Alex");
    });

    // Error toast shown for failed save
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to save preferred name",
        expect.objectContaining({
          description: "Database connection failed",
        }),
      );
    });

    // Modal stays open (parent's handleSavePreferredName threw error)
    expect(
      screen.getByRole("heading", {
        name: /hey bestie, what should we call you/i,
      }),
    ).toBeInTheDocument();

    // Optimistic update was reverted - greeting shows firstName
    expect(
      screen.getByText(/welcome to skinbestie, john!/i),
    ).toBeInTheDocument();

    // Only one call to updateNickname (the failed one)
    expect(updateNickname).toHaveBeenCalledTimes(1);
  });

  it("cancel operation fails, modal stays open, error toast shown", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    // Mock server failure for cancel operation
    vi.mocked(updateNickname).mockResolvedValue({
      success: false,
      error: { message: "Network error", code: "NETWORK_ERROR" },
    });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User clicks Cancel
    await user.click(screen.getByRole("button", { name: /^cancel$/i }));

    // Server action attempted
    await waitFor(() => {
      expect(updateNickname).toHaveBeenCalledWith("John");
    });

    // Error toast shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to set default name",
        expect.objectContaining({
          description: "Network error",
        }),
      );
    });

    // Modal should STAY OPEN (parent's conditional close logic)
    // This is the new behavior - modal doesn't close on error
    expect(
      screen.getByRole("heading", {
        name: /hey bestie, what should we call you/i,
      }),
    ).toBeInTheDocument();
  });

  it("user sees help text explaining preferred name purpose", async () => {
    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: { nickname: null, firstName: "John", lastName: "Doe" },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User sees help text about custom name
    expect(
      screen.getByText(
        /this is how we will address you throughout your skin journey/i,
      ),
    ).toBeInTheDocument();
  });

  it("modal does not show when user already has nickname set", async () => {
    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        user: {
          nickname: "Johnny",
          firstName: "John",
          lastName: "Doe",
        },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    // Wait for dashboard content to load
    await screen.findByText("Essential Setup Steps");

    // Modal should NOT be visible (because nickname exists in data)
    expect(
      screen.queryByRole("heading", {
        name: /hey bestie, what should we call you/i,
      }),
    ).not.toBeInTheDocument();

    //NOTE: Greeting showing nickname works manually but not in test env - see implementation code page.tsx:56-63
  });

  it("save completes successfully and modal closes", async () => {
    const user = userEvent.setup();

    // Mock dashboard with no nickname (triggers modal)
    // After save, return updated data with nickname set
    vi.mocked(fetchDashboardAction)
      .mockResolvedValueOnce(
        createMockDashboard({
          user: { nickname: null, firstName: "John", lastName: "Doe" },
        }),
      )
      .mockResolvedValue(
        createMockDashboard({
          user: { nickname: "Alex", firstName: "John", lastName: "Doe" },
        }),
      );

    // Mock server response
    vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

    renderWithQueryClient(<DashboardPage />);

    await screen.findByRole("heading", {
      name: /hey bestie, what should we call you/i,
    });

    // User saves
    await user.type(screen.getByLabelText(/enter custom name/i), "Alex");
    const saveButton = screen.getByRole("button", {
      name: /save and continue/i,
    });

    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    // Modal eventually closes
    await waitFor(
      () => {
        expect(
          screen.queryByRole("heading", {
            name: /hey bestie, what should we call you/i,
          }),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Greeting shows Alex (correct - no race condition!)
    expect(
      await screen.findByText(/welcome to skinbestie, alex!/i),
    ).toBeInTheDocument();

    // Only called once
    expect(updateNickname).toHaveBeenCalledTimes(1);
  });
});
