# Feedback Survey Integration

## Overview

The feedback survey feature has been refactored to dynamically fetch surveys from the backend API instead of using hardcoded questions.

## API Integration

### Endpoints

**Fetch Surveys:**
```bash
GET /api/consumer-app/surveys
```

**Response:**
```json
{
  "surveys": [
    {
      "id": "survey-id",
      "title": "Monthly Feedback Survey",
      "description": "Tell us about your experience",
      "questions": [
        {
          "id": "question-1-id",
          "question": "Has your skin improved?",
          "type": "yes-no",
          "order": 1,
          "required": true
        },
        {
          "id": "question-2-id",
          "question": "Share your thoughts",
          "type": "freehand",
          "order": 2,
          "required": false
        }
      ],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Submit Survey Response:**
```bash
POST /api/consumer-app/surveys/{surveyId}/responses
Content-Type: application/json
x-api-key: your-api-key

{
  "userId": "user-profile-id",
  "responses": [
    {
      "questionId": "question-1-id",
      "yesNoAnswer": true
    },
    {
      "questionId": "question-2-id",
      "freehandAnswer": "My skin is much clearer now!"
    }
  ]
}
```

## Architecture

### File Structure

```
my-profile/
└── feedback/
    ├── actions/
    │   └── feedback-actions.ts       # Server actions
    ├── hooks/
    │   └── use-survey.ts              # React Query hooks
    ├── index.tsx                      # ShareFeedback component
    └── feedback.types.ts              # TypeScript types
```

### Components

#### 1. Server Actions (`feedback-actions.ts`)

**`getSurveysAction()`**
- Fetches all available surveys from API
- Returns `{ success: true, surveys }` or `{ success: false, error }`
- Uses `api.get()` from `/src/lib/api-client.ts`

**`submitSurveyResponseAction(surveyId, submission)`**
- Submits user's survey responses
- Returns `{ success: true, data }` or `{ success: false, error }`
- Uses `api.post()` from `/src/lib/api-client.ts`

#### 2. React Query Hooks (`use-survey.ts`)

**`useSurveys()`**
- Query hook for fetching surveys
- Returns: `{ data: surveys, isLoading, error }`
- Caches survey data with queryKey: `["surveys"]`

**`useSubmitSurvey()`**
- Mutation hook for submitting responses
- Returns: `{ mutate, isPending, isSuccess, error }`
- Invalidates surveys query on success

#### 3. ShareFeedback Component (`index.tsx`)

**Features:**
- Dynamically renders questions from API
- Supports two question types:
  - `yes-no`: Radio group (Yes/No)
  - `freehand`: Textarea for open-ended responses
- Form validation (required questions)
- Loading states
- Error handling
- Success message after submission

**Props:**
```typescript
interface ShareFeedbackProps {
  userProfileId: string;  // User's profile ID for submission
}
```

**State Management:**
```typescript
const [responses, setResponses] = useState<Record<string, SurveyResponse>>({});
const [isSubmitted, setIsSubmitted] = useState(false);
```

### Type Definitions (`feedback.types.ts`)

```typescript
interface SurveyQuestion {
  id: string;
  question: string;
  type: "yes-no" | "freehand";
  order: number;
  required?: boolean;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
}

interface SurveyResponse {
  questionId: string;
  yesNoAnswer?: boolean;
  freehandAnswer?: string;
}

interface SurveySubmission {
  userId: string;
  responses: SurveyResponse[];
}
```

## User Flow

1. **Load Survey**
   - Component mounts
   - `useSurveys()` fetches available surveys
   - Displays first/latest survey

2. **Fill Survey**
   - User answers questions
   - Responses stored in local state
   - Form validates in real-time

3. **Submit**
   - User clicks "Submit Feedback"
   - Validation checks all required questions answered
   - `useSubmitSurvey()` sends data to API
   - Success: Show thank you message
   - Error: Display error toast, keep form data

4. **Post-Submission**
   - User can submit another response
   - Form resets to empty state

## UI States

### Loading State
```
Share Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Loading survey...
```

### Error State
```
Share Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Failed to load survey.
   Please try again later.
```

### Empty State
```
Share Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
No surveys available at the moment.
```

### Active Survey
```
Monthly Feedback Survey
Tell us about your experience
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Has your skin improved? *
○ Yes  ○ No

Share your thoughts
┌─────────────────────────┐
│ Type your answer here...│
└─────────────────────────┘

                [Submit Feedback]
```

### Success State
```
Share Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ✓
Thank You for Your Feedback!
Your responses help us improve
your skincare experience.

    [Submit Another Response]
```

## Form Validation

**Rules:**
1. All questions with `required !== false` must be answered
2. Yes/No questions must have a selection
3. Freehand questions must have non-empty text
4. Submit button disabled until form is valid

**Validation Logic:**
```typescript
const isFormValid = () => {
  const requiredQuestions = survey.questions.filter(
    q => q.required !== false
  );

  return requiredQuestions.every(question => {
    const response = responses[question.id];
    if (!response) return false;

    if (question.type === "yes-no") {
      return response.yesNoAnswer !== undefined;
    } else {
      return response.freehandAnswer?.trim() !== "";
    }
  });
};
```

## Error Handling

### Survey Fetch Errors
- Display error message in UI
- No crash or blank screen
- User sees clear error state

### Submission Errors
- Toast notification with error message
- Form data preserved (user doesn't lose answers)
- User can retry submission

### Network Errors
- Handled by api-client
- Error messages shown via toast
- User-friendly error text

## Integration Points

### Parent Component (`support-feedback.tsx`)

```typescript
<ShareFeedback userProfileId={dashboard.user.userProfileId} />
```

The `SupportFeedback` component:
- Receives `dashboard` from profile page
- Extracts `userProfileId` from dashboard
- Passes it to `ShareFeedback` component

### Profile Tabs (`profile-tabs.tsx`)

```typescript
<TabsContent value="support" className="mt-6">
  <SupportFeedback dashboard={dashboard} />
</TabsContent>
```

## Testing

### Manual Testing Checklist

- [ ] Survey loads successfully
- [ ] Questions render in correct order
- [ ] Yes/No questions accept selections
- [ ] Freehand questions accept text input
- [ ] Required field validation works
- [ ] Submit button disabled when form invalid
- [ ] Submit button enabled when form valid
- [ ] Submission shows loading state
- [ ] Success message appears after submission
- [ ] Error handling works (network failures)
- [ ] "Submit Another Response" resets form

### API Testing

**Test survey fetch:**
```bash
curl http://localhost:3000/api/consumer-app/surveys \
  -H "x-api-key: your-api-key"
```

**Test submission:**
```bash
curl -X POST http://localhost:3000/api/consumer-app/surveys/SURVEY-ID/responses \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "userId": "user-profile-id",
    "responses": [
      {
        "questionId": "question-1-id",
        "yesNoAnswer": true
      },
      {
        "questionId": "question-2-id",
        "freehandAnswer": "Great experience!"
      }
    ]
  }'
```

## Migration Notes

**What Changed:**
- ✅ Removed hardcoded questions from `share-feedback.tsx`
- ✅ Created new `feedback/` module with API integration
- ✅ Added dynamic survey fetching
- ✅ Support for multiple question types
- ✅ Form validation based on API data
- ✅ Updated `SupportFeedback` to use new component

**Breaking Changes:**
- None - component interface remains the same for parent

**Backward Compatibility:**
- If API returns no surveys, shows "No surveys available" message
- If API fails, shows error state with retry option
- Graceful degradation ensures no crashes
