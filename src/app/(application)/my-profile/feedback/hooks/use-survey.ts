"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSurveysAction,
  submitSurveyResponseAction,
} from "../actions/feedback-actions";
import type { SurveySubmission } from "../feedback.types";

/**
 * Hook to fetch available survey
 */
export function useSurvey() {
  return useQuery({
    queryKey: ["survey"],
    queryFn: async () => {
      const result = await getSurveysAction();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.survey;
    },
  });
}

/**
 * Hook to submit survey response
 */
export function useSubmitSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      surveyId,
      submission,
    }: {
      surveyId: string;
      submission: SurveySubmission;
    }) => {
      const result = await submitSurveyResponseAction(surveyId, submission);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate survey query to refetch if needed
      queryClient.invalidateQueries({ queryKey: ["survey"] });
    },
  });
}
