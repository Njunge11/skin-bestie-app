"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSurvey, useSubmitSurvey } from "./hooks/use-survey";
import type { SurveyResponse, SurveyQuestion } from "./feedback.types";

interface ShareFeedbackProps {
  userProfileId: string;
}

export function ShareFeedback({ userProfileId }: ShareFeedbackProps) {
  const { data: survey, isLoading, error } = useSurvey();
  const submitMutation = useSubmitSurvey();

  // State for survey responses
  const [responses, setResponses] = useState<Record<string, SurveyResponse>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active survey is the single survey returned from API
  const activeSurvey = survey;

  // Reset form when survey changes
  useEffect(() => {
    setResponses({});
    setIsSubmitted(false);
  }, [activeSurvey?.id]);

  // Handle yes/no question response
  const handleYesNoChange = (questionId: string, value: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        yesNoAnswer: value,
      },
    }));
  };

  // Handle freehand question response
  const handleFreehandChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        freehandAnswer: value,
      },
    }));
  };

  // Validate form
  const isFormValid = () => {
    if (!activeSurvey) return false;

    // Check all required questions have answers
    const requiredQuestions = activeSurvey.questions.filter(
      (q: SurveyQuestion) => q.isRequired === true,
    );

    return requiredQuestions.every((question: SurveyQuestion) => {
      const response = responses[question.id];
      if (!response) return false;

      if (question.questionType === "yes_no") {
        return response.yesNoAnswer !== undefined;
      } else {
        return (
          response.freehandAnswer !== undefined &&
          response.freehandAnswer.trim() !== ""
        );
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!activeSurvey || !isFormValid()) {
      toast.error("Please answer all required questions");
      return;
    }

    // Convert responses object to array
    const responsesArray = Object.values(responses);

    submitMutation.mutate(
      {
        surveyId: activeSurvey.id,
        submission: {
          userId: userProfileId,
          responses: responsesArray,
        },
      },
      {
        onSuccess: () => {
          toast.success("Thank you for your feedback!");
          setIsSubmitted(true);
          setResponses({});
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to submit feedback. Please try again.",
          );
        },
      },
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Share Feedback</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Share Feedback</h2>
        <div className="rounded-lg p-6 bg-red-50">
          <p className="text-red-600">
            Failed to load survey. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // No survey available
  if (!activeSurvey) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Share Feedback</h2>
        <div className="rounded-lg p-6 bg-gray-100">
          <p className="text-gray-600">No survey available at the moment.</p>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Share Feedback</h2>
        <div className="rounded-lg p-8 bg-green-50 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Thank You for Your Feedback!
          </h3>
          <p className="text-gray-600 mb-4">
            Your responses help us improve your skincare experience.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-gray-300"
          >
            Submit Another Response
          </Button>
        </div>
      </div>
    );
  }

  // Sort questions by order
  const sortedQuestions = [...activeSurvey.questions].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {activeSurvey.title}
        </h2>
        {activeSurvey.description && (
          <p className="text-gray-600 mt-1">{activeSurvey.description}</p>
        )}
      </div>

      {/* Survey Questions */}
      <div className="space-y-4">
        {sortedQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            response={responses[question.id]}
            onYesNoChange={(value) => handleYesNoChange(question.id, value)}
            onFreehandChange={(value) =>
              handleFreehandChange(question.id, value)
            }
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || submitMutation.isPending}
          className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  );
}

// Question Card Component
interface QuestionCardProps {
  question: SurveyQuestion;
  response?: SurveyResponse;
  onYesNoChange: (value: boolean) => void;
  onFreehandChange: (value: string) => void;
}

function QuestionCard({
  question,
  response,
  onYesNoChange,
  onFreehandChange,
}: QuestionCardProps) {
  return (
    <div className="rounded-lg p-6 bg-gray-100">
      <p className="font-semibold text-gray-900 mb-3">
        {question.questionText}
        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
      </p>

      {question.helperText && (
        <p className="text-sm text-gray-600 mb-3">{question.helperText}</p>
      )}

      {question.questionType === "yes_no" ? (
        <RadioGroup
          value={
            response?.yesNoAnswer === true
              ? "yes"
              : response?.yesNoAnswer === false
                ? "no"
                : undefined
          }
          onValueChange={(value) => onYesNoChange(value === "yes")}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id={`${question.id}-yes`}
                className="bg-white border-2 border-gray-400"
              />
              <Label
                htmlFor={`${question.id}-yes`}
                className="text-base font-medium cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id={`${question.id}-no`}
                className="bg-white border-2 border-gray-400"
              />
              <Label
                htmlFor={`${question.id}-no`}
                className="text-base font-medium cursor-pointer"
              >
                No
              </Label>
            </div>
          </div>
        </RadioGroup>
      ) : (
        <Textarea
          placeholder={question.helperText || "Type your answer here..."}
          value={response?.freehandAnswer || ""}
          onChange={(e) => onFreehandChange(e.target.value)}
          className="min-h-[100px] bg-gray-50"
        />
      )}
    </div>
  );
}
