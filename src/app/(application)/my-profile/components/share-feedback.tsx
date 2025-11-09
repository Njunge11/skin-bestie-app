"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackQuestion {
  id: string;
  question: string;
  type: "yes-no";
}

const feedbackQuestions: FeedbackQuestion[] = [
  {
    id: "skin-improved",
    question: "Has your skin improved since starting your current routine?",
    type: "yes-no",
  },
  {
    id: "comfortable-routine",
    question: "Are you comfortable with and able to follow the routine daily?",
    type: "yes-no",
  },
  {
    id: "products-suitable",
    question:
      "Do you feel the recommended products are suitable for your skin?",
    type: "yes-no",
  },
];

export function ShareFeedback() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherFeedback, setOtherFeedback] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Share Feedback</h2>

      {/* Feedback Questions */}
      <div className="space-y-4">
        {feedbackQuestions.map((question) => (
          <div key={question.id} className="rounded-lg p-6 bg-gray-100">
            <p className="font-semibold text-gray-900 mb-3">
              {question.question}
            </p>
            <RadioGroup
              value={answers[question.id]}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            >
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`}>No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* Share Other Feedback */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2">Share Other Feedback</h3>
        <Textarea
          placeholder="Share your thoughts or any concerns you have..."
          value={otherFeedback}
          onChange={(e) => setOtherFeedback(e.target.value)}
          className="min-h-[120px] bg-gray-50"
        />
        <div className="flex justify-end mt-4">
          <Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white">
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
