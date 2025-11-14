/**
 * Survey and Feedback Type Definitions
 */

export interface SurveyQuestion {
  id: string;
  questionText: string;
  questionType: "yes_no" | "freehand";
  helperText: string | null;
  isRequired: boolean;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  questionId: string;
  yesNoAnswer?: boolean;
  freehandAnswer?: string;
}

export interface SurveySubmission {
  userId: string;
  responses: SurveyResponse[];
}

// API Response types - API returns single survey object directly
export type SurveysApiResponse = Survey;

export interface SubmitSurveyApiResponse {
  success: boolean;
  message?: string;
}
