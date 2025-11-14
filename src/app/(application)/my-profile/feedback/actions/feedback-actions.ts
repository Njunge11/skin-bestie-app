"use server";

import { api } from "@/lib/api-client";
import type {
  SurveysApiResponse,
  SubmitSurveyApiResponse,
  SurveySubmission,
} from "../feedback.types";

/**
 * Fetch available survey
 */
export async function getSurveysAction() {
  try {
    const data = (await api.get(
      "/api/consumer-app/surveys",
    )) as SurveysApiResponse;

    return {
      success: true as const,
      survey: data, // API returns single survey object directly
    };
  } catch (error) {
    console.error("getSurveysAction error:", error);
    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch survey. Please try again.",
      },
    };
  }
}

/**
 * Submit survey response
 */
export async function submitSurveyResponseAction(
  surveyId: string,
  submission: SurveySubmission,
) {
  try {
    const data = (await api.post(
      `/api/consumer-app/surveys/${surveyId}/responses`,
      submission,
    )) as SubmitSurveyApiResponse;

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error("submitSurveyResponseAction error:", error);
    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit feedback. Please try again.",
      },
    };
  }
}
