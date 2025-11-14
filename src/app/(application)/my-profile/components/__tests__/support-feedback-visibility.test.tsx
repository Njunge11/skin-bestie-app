import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupportFeedback } from "../support-feedback";
import type { DashboardResponse } from "../../../dashboard/schemas";

/**
 * SUPPORT FEEDBACK - CONDITIONAL VISIBILITY TESTS
 *
 * Testing Strategy:
 * - Test that feedback survey only appears when feedbackSurveyVisible is true
 * - Test from user's perspective (what they see/don't see)
 */

// Mock Server Actions
vi.mock("../../feedback/actions/feedback-actions");

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock whatsapp actions
vi.mock("../../../actions/whatsapp-actions", () => ({
  getCoachWhatsAppUrl: vi.fn(),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// Mock dashboard data
const createMockDashboard = (
  feedbackSurveyVisible: boolean,
): DashboardResponse => ({
  user: {
    userId: "user-123",
    userProfileId: "profile-123",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    nickname: "JD",
    skinType: ["normal"],
    concerns: ["acne"],
    hasAllergies: false,
    allergyDetails: null,
    isSubscribed: true,
    occupation: null,
    bio: null,
    timezone: "UTC",
    feedbackSurveyVisible,
    profileTags: [],
  },
  setupProgress: {
    percentage: 100,
    completed: 6,
    total: 6,
    steps: {
      hasCompletedSkinTest: true,
      hasPublishedGoals: true,
      hasPublishedRoutine: true,
      hasCompletedBooking: true,
      productsReceived: true,
      routineStartDateSet: true,
    },
  },
  todayRoutine: [],
  catchupSteps: [],
  routine: null,
  goals: [],
  goalsAcknowledgedByClient: true,
});

describe("Support Feedback - Conditional Visibility", () => {
  it("user sees feedback survey when feedbackSurveyVisible is true", async () => {
    const dashboard = createMockDashboard(true);

    // Mock successful survey fetch
    const { getSurveysAction } = await import(
      "../../feedback/actions/feedback-actions"
    );
    vi.mocked(getSurveysAction).mockResolvedValue({
      success: true,
      survey: {
        id: "survey-123",
        title: "Share Feedback",
        description: null,
        questions: [
          {
            id: "q1",
            questionText: "How is your skin?",
            questionType: "yes_no",
            helperText: null,
            isRequired: true,
            order: 1,
          },
        ],
      },
    });

    renderWithQueryClient(<SupportFeedback dashboard={dashboard} />);

    // User sees coach section
    expect(
      await screen.findByText(/your skinbestie coach/i),
    ).toBeInTheDocument();

    // User sees feedback survey loading/questions
    expect(
      await screen.findByText(/how is your skin/i, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("user does NOT see feedback survey when feedbackSurveyVisible is false", async () => {
    const dashboard = createMockDashboard(false);

    renderWithQueryClient(<SupportFeedback dashboard={dashboard} />);

    // User sees coach section
    expect(
      await screen.findByText(/your skinbestie coach/i),
    ).toBeInTheDocument();

    // User does NOT see "Share Feedback" heading (survey is hidden)
    expect(screen.queryByText(/share feedback/i)).not.toBeInTheDocument();

    // User does NOT see "Loading survey..."
    expect(screen.queryByText(/loading survey/i)).not.toBeInTheDocument();
  });
});
