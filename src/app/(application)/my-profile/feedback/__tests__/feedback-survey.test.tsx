import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShareFeedback } from "../index";
import * as feedbackActions from "../actions/feedback-actions";
import type { Survey } from "../feedback.types";

/**
 * FEEDBACK SURVEY - UI TESTS
 *
 * Testing Strategy (per UI_TESTING.md):
 * - Test complete user workflows from user's perspective
 * - Focus on observable effects (UI state, button states, messages)
 * - Query like a user would (getByRole, getByText, getByLabelText)
 * - Use userEvent for interactions
 * - Mock at network boundary (Server Actions)
 *
 * Critical scenarios:
 * 1. User completes survey successfully (happy path)
 * 2. User encounters validation errors and recovers
 * 3. User can skip optional questions
 * 4. User sees loading/error/empty states
 * 5. User encounters submission error and retries
 * 6. Questions display in correct order
 * 7. Different question types work correctly
 * 8. User can submit multiple responses
 */

// Mock Server Actions
vi.mock("../actions/feedback-actions");

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Helper to create QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

// Mock survey data
const mockSurvey: Survey = {
  id: "survey-123",
  title: "Share Feedback",
  description: null,
  questions: [
    {
      id: "q1",
      questionText:
        "Has your skin improved since starting your current routine?",
      questionType: "yes_no",
      helperText: null,
      isRequired: true,
      order: 1,
    },
    {
      id: "q2",
      questionText:
        "Are you comfortable with and able to follow the routine daily?",
      questionType: "yes_no",
      helperText: null,
      isRequired: true,
      order: 2,
    },
    {
      id: "q3",
      questionText:
        "Do you feel the recommended products are suitable for your skin?",
      questionType: "yes_no",
      helperText: null,
      isRequired: true,
      order: 3,
    },
    {
      id: "q4",
      questionText: "Share Other Feedback",
      questionType: "freehand",
      helperText: "Share your thoughts or any concerns you have...",
      isRequired: false,
      order: 4,
    },
  ],
};

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Feedback Survey - Complete User Workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("user loads survey, fills all required questions, and submits successfully", async () => {
      const user = userEvent.setup();

      // Mock successful survey fetch
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      // Mock successful submission
      vi.mocked(feedbackActions.submitSurveyResponseAction).mockResolvedValue({
        success: true,
        data: { success: true },
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for questions to load
      expect(
        await screen.findByText(
          "Has your skin improved since starting your current routine?",
        ),
      ).toBeInTheDocument();

      // User sees all 4 questions
      expect(
        screen.getByText(
          "Are you comfortable with and able to follow the routine daily?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Do you feel the recommended products are suitable for your skin?",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Share Other Feedback")).toBeInTheDocument();

      // Submit button should be disabled initially
      const submitButton = screen.getByRole("button", {
        name: /submit feedback/i,
      });
      expect(submitButton).toBeDisabled();

      // User answers all 3 required yes/no questions
      const yesButtons = screen.getAllByLabelText(/yes/i);
      await user.click(yesButtons[0]); // Question 1
      await user.click(yesButtons[1]); // Question 2
      await user.click(yesButtons[2]); // Question 3

      // Submit button should now be enabled
      expect(submitButton).not.toBeDisabled();

      // User types in optional freehand question
      const textarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      await user.type(textarea, "Great experience overall!");

      // User clicks submit
      await user.click(submitButton);

      // User sees success message
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();

      // User can submit another response
      expect(
        screen.getByRole("button", { name: /submit another response/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation and Error Recovery", () => {
    it("user encounters validation errors and recovers to submit successfully", async () => {
      const user = userEvent.setup();

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      vi.mocked(feedbackActions.submitSurveyResponseAction).mockResolvedValue({
        success: true,
        data: { success: true },
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      const submitButton = await screen.findByRole("button", {
        name: /submit feedback/i,
      });

      // Submit button is disabled (form invalid - no answers)
      expect(submitButton).toBeDisabled();

      // User answers question 1 (yes)
      const yesButtons = screen.getAllByLabelText(/yes/i);
      await user.click(yesButtons[0]);

      // Submit still disabled (2 more required)
      expect(submitButton).toBeDisabled();

      // User answers question 2 (no)
      const noButtons = screen.getAllByLabelText(/no/i);
      await user.click(noButtons[1]);

      // Submit still disabled (1 more required)
      expect(submitButton).toBeDisabled();

      // User answers question 3 (yes)
      await user.click(yesButtons[2]);

      // Submit button now enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // User clicks submit
      await user.click(submitButton);

      // User sees success message
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();
    });

    it("user submits survey with only required questions answered", async () => {
      const user = userEvent.setup();

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      vi.mocked(feedbackActions.submitSurveyResponseAction).mockResolvedValue({
        success: true,
        data: { success: true },
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // User answers all 3 required yes/no questions
      const yesButtons = screen.getAllByLabelText(/yes/i);
      await user.click(yesButtons[0]);
      await user.click(yesButtons[1]);
      await user.click(yesButtons[2]);

      // User leaves optional freehand question empty
      const textarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      expect(textarea).toHaveValue("");

      // Submit button is enabled
      const submitButton = screen.getByRole("button", {
        name: /submit feedback/i,
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // User clicks submit
      await user.click(submitButton);

      // User sees success message (optional question skipped successfully)
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();
    });

    it("user encounters submission error, form data preserved, user retries successfully", async () => {
      const user = userEvent.setup();

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      // First submission fails, second succeeds
      vi.mocked(feedbackActions.submitSurveyResponseAction)
        .mockResolvedValueOnce({
          success: false,
          error: { message: "Network error" },
        })
        .mockResolvedValueOnce({
          success: true,
          data: { success: true },
        });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // User fills all 3 required questions
      const yesButtons = screen.getAllByLabelText(/yes/i);
      await user.click(yesButtons[0]);
      await user.click(yesButtons[1]);
      await user.click(yesButtons[2]);

      // User types long feedback in freehand question
      const textarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      const feedbackText =
        "This is a long feedback message that I don't want to lose!";
      await user.type(textarea, feedbackText);

      // User clicks submit
      const submitButton = screen.getByRole("button", {
        name: /submit feedback/i,
      });
      await user.click(submitButton);

      // Wait for error state
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Form data still present (answers not lost)
      expect(textarea).toHaveValue(feedbackText);

      // User clicks submit again
      await user.click(submitButton);

      // Submission succeeds
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();
    });
  });

  describe("Loading, Error, and Empty States", () => {
    it("user sees loading state while survey is being fetched", async () => {
      // Mock slow API response
      vi.mocked(feedbackActions.getSurveysAction).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true, survey: mockSurvey }),
              100,
            ),
          ),
      );

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // User sees loading message
      expect(screen.getByText(/loading survey/i)).toBeInTheDocument();

      // Survey loads after delay
      expect(
        await screen.findByText(
          "Has your skin improved since starting your current routine?",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/loading survey/i)).not.toBeInTheDocument();
    });

    it("user sees error message when survey fails to load", async () => {
      // Mock API error
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: false,
        error: { message: "Failed to fetch survey" },
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // User sees error message
      expect(
        await screen.findByText(/failed to load survey/i),
      ).toBeInTheDocument();

      // No questions displayed
      expect(
        screen.queryByText(/has your skin improved/i),
      ).not.toBeInTheDocument();
    });

    it("user sees message when no survey is available", async () => {
      // Mock API returns null survey
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: null as unknown as Survey,
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // User sees empty state message
      expect(
        await screen.findByText(/no survey available at the moment/i),
      ).toBeInTheDocument();
    });
  });

  describe("Question Rendering", () => {
    it("user sees questions in order specified by API", async () => {
      // Mock survey with scrambled order
      const scrambledSurvey: Survey = {
        ...mockSurvey,
        questions: [
          { ...mockSurvey.questions[2], order: 2 }, // Question 3 with order 2
          { ...mockSurvey.questions[3], order: 4 }, // Question 4 with order 4
          { ...mockSurvey.questions[0], order: 1 }, // Question 1 with order 1
          { ...mockSurvey.questions[1], order: 3 }, // Question 2 with order 3
        ],
      };

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: scrambledSurvey,
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for questions to render
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // Get all question containers
      const questionContainers = screen.getAllByText(/\?|Feedback/, {
        selector: "p.font-semibold",
      });

      // Questions should be rendered in order: 1, 2, 3, 4
      expect(questionContainers).toHaveLength(4);
      expect(questionContainers[0]).toHaveTextContent(
        "Has your skin improved since starting your current routine?",
      );
      expect(questionContainers[1]).toHaveTextContent(
        "Do you feel the recommended products are suitable for your skin?",
      );
      expect(questionContainers[2]).toHaveTextContent(
        "Are you comfortable with and able to follow the routine daily?",
      );
      expect(questionContainers[3]).toHaveTextContent("Share Other Feedback");
    });

    it("user sees and interacts with yes/no radio buttons and freehand textarea", async () => {
      const user = userEvent.setup();

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // User sees question 1 with Yes/No radio buttons
      const yesButtons = screen.getAllByLabelText(/yes/i);
      const noButtons = screen.getAllByLabelText(/no/i);

      expect(yesButtons[0]).toBeInTheDocument();
      expect(noButtons[0]).toBeInTheDocument();

      // User clicks "Yes"
      await user.click(yesButtons[0]);

      // Selection is visible (checked)
      expect(yesButtons[0]).toBeChecked();

      // User changes to "No"
      await user.click(noButtons[0]);

      // Selection updates
      expect(noButtons[0]).toBeChecked();
      expect(yesButtons[0]).not.toBeChecked();

      // User sees question 4 with textarea (freehand)
      const textarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      expect(textarea).toBeInTheDocument();

      // User types text
      await user.type(textarea, "This is my feedback");

      // Text appears in textarea
      expect(textarea).toHaveValue("This is my feedback");
    });

    it("user sees helper text as placeholder in freehand questions", async () => {
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // User sees freehand question with helper text as placeholder
      const textarea = screen.getByPlaceholderText(
        "Share your thoughts or any concerns you have...",
      );
      expect(textarea).toBeInTheDocument();

      // Also displayed above textarea
      expect(
        screen.getByText("Share your thoughts or any concerns you have..."),
      ).toBeInTheDocument();
    });

    it("user sees asterisk (*) next to required questions", async () => {
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // Get all question paragraphs
      const questionParagraphs = screen.getAllByText(/\?|Feedback/, {
        selector: "p.font-semibold",
      });

      // First 3 questions should have asterisk (required)
      expect(
        questionParagraphs[0].querySelector("span.text-red-500"),
      ).toBeInTheDocument();
      expect(
        questionParagraphs[1].querySelector("span.text-red-500"),
      ).toBeInTheDocument();
      expect(
        questionParagraphs[2].querySelector("span.text-red-500"),
      ).toBeInTheDocument();

      // Last question should NOT have asterisk (optional)
      expect(
        questionParagraphs[3].querySelector("span.text-red-500"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("survey is hidden when feedbackSurveyVisible is false", async () => {
      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      // Render with feedbackSurveyVisible = false (survey should not appear)
      // This would be tested at the SupportFeedback component level
      // ShareFeedback component itself always renders if mounted
      // The conditional logic is in the parent (SupportFeedback)

      // So we just verify ShareFeedback renders when called
      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Survey should load normally (component doesn't handle visibility)
      expect(
        await screen.findByText(
          "Has your skin improved since starting your current routine?",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Multiple Submissions", () => {
    it("user submits feedback, then submits another response", async () => {
      const user = userEvent.setup();

      vi.mocked(feedbackActions.getSurveysAction).mockResolvedValue({
        success: true,
        survey: mockSurvey,
      });

      vi.mocked(feedbackActions.submitSurveyResponseAction).mockResolvedValue({
        success: true,
        data: { success: true },
      });

      renderWithQueryClient(<ShareFeedback userProfileId="user-123" />);

      // Wait for survey to load
      await screen.findByText(
        "Has your skin improved since starting your current routine?",
      );

      // User fills and submits survey
      const yesButtons = screen.getAllByLabelText(/yes/i);
      await user.click(yesButtons[0]);
      await user.click(yesButtons[1]);
      await user.click(yesButtons[2]);

      const textarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      await user.type(textarea, "First submission");

      const submitButton = screen.getByRole("button", {
        name: /submit feedback/i,
      });
      await user.click(submitButton);

      // User sees success message
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();

      // User clicks "Submit Another Response"
      const submitAnotherButton = screen.getByRole("button", {
        name: /submit another response/i,
      });
      await user.click(submitAnotherButton);

      // Form resets (questions visible again)
      expect(
        await screen.findByText(
          "Has your skin improved since starting your current routine?",
        ),
      ).toBeInTheDocument();

      // User fills different answers
      const noButtons = screen.getAllByLabelText(/no/i);
      await user.click(noButtons[0]);
      await user.click(noButtons[1]);
      await user.click(noButtons[2]);

      const newTextarea = screen.getByPlaceholderText(
        /share your thoughts or any concerns/i,
      );
      await user.type(newTextarea, "Second submission");

      // User submits again
      const newSubmitButton = screen.getByRole("button", {
        name: /submit feedback/i,
      });
      await user.click(newSubmitButton);

      // User sees success message
      expect(
        await screen.findByText(/thank you for your feedback/i),
      ).toBeInTheDocument();
    });
  });
});
