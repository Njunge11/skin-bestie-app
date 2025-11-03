# Setup Dashboard - Complete Structure Analysis

**Date:** 2025-11-03
**Purpose:** Comprehensive documentation of Setup Dashboard structure, components, labels, and user flows for accurate UI testing

---

## 📋 Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [Data Flow & State Management](#data-flow--state-management)
3. [UI Elements & Labels](#ui-elements--labels)
4. [Modals & Interactions](#modals--interactions)
5. [Step States & Logic](#step-states--logic)
6. [Server Actions](#server-actions)
7. [User Workflows](#user-workflows)

---

## Component Hierarchy

```
DashboardPage (page.tsx)
├── Header (conditional - only when !isSetupComplete)
│   ├── h1: "Welcome to Skinbestie, {nickname}!" or "Welcome to Skinbestie!"
│   └── p: "Let's set up your personalized skin transformation journey"
│
├── ErrorFeedback (when error)
│   └── Retry button
│
├── DashboardSkeleton (when isLoading)
│
├── SubscriberDashboard (when isSetupComplete)
│   └── [Full dashboard for completed users]
│
└── SetupDashboard (when !isSetupComplete)
    ├── ProgressTracker
    │   ├── h2: "Setup Progress"
    │   ├── span: "{completed} of {total} Completed"
    │   └── Progress bar
    │
    └── Card: "Essential Setup Steps"
        ├── Step 1: Book Your Consultation
        │   ├── Avatar: "1" or ✓
        │   ├── Badge: "COMPLETED" | "PENDING"
        │   ├── Title: "Book Your Consultation"
        │   ├── Description: "A calm, friendly 50-minute video chat..."
        │   └── Button: "Schedule Now" (if not completed)
        │
        ├── Step 2: Take a Skin Test
        │   ├── Avatar: "2" or ✓
        │   ├── Badge: "COMPLETED" | "PENDING"
        │   ├── Title: "Take a Skin Test"
        │   ├── Description: "Complete our 3-step skin type assessment..."
        │   └── Content (varies by completion state):
        │       ├── button: "📋 How to do a skin test" (always)
        │       └── EITHER:
        │           ├── Button: "Select Your Skin Type" (not completed)
        │           OR
        │           ├── div: "Your skin type: {skinType}"
        │           └── Button: "Change skin type" (completed)
        │
        ├── Step 3: Set Your Skin Goals
        │   ├── Avatar: "3" or ✓
        │   ├── Badge: "COMPLETED" | "PENDING" | "WAITING"
        │   ├── Title: "Set Your Skin Goals"
        │   ├── Description: "Create SMART goals..."
        │   └── Content (varies by state):
        │       ├── Button: "Review Your Goals" (if published)
        │       OR
        │       └── p: "⏳ Your coach is setting up your personalized goals" (waiting)
        │
        ├── Step 4: Get Your Custom Routine
        │   ├── Avatar: "4" or ✓
        │   ├── Badge: "COMPLETED" | "WAITING"
        │   ├── Title: "Get Your Custom Routine"
        │   ├── Description: "Receive your personalized morning and evening..."
        │   └── Content (varies by state):
        │       ├── Button: "View Routine" (if published)
        │       OR
        │       └── p: "⏳ Your coach is preparing your custom routine" (waiting)
        │
        └── WhatHappensNextCard
            ├── Description: "Your coach is reviewing your progress..."
            └── coachName: "Coach"

    ├── PreferredNameModal (shows on mount if nickname === null)
    ├── SkinTestModal
    ├── SelectSkinTypeModal
    ├── ReviewGoalsModal
    └── ViewRoutineModal
```

---

## Data Flow & State Management

### 1. **Data Fetching**
```typescript
// Hook: useDashboard()
useQuery({
  queryKey: ["dashboard"],
  queryFn: () => fetchDashboardAction(),
  staleTime: 30 * 1000,        // 30 seconds
  gcTime: 5 * 60 * 1000,        // 5 minutes
  refetchOnWindowFocus: true,   // Refetch on tab return
  refetchOnReconnect: true,     // Refetch on reconnect
})
```

### 2. **Optimistic State**
```typescript
// Nickname
const [optimisticNickname, setOptimisticNickname] = useOptimistic(
  dashboard?.user?.nickname || dashboard?.user?.firstName || ""
);

// Skin Test
const initialSkinTest = {
  completed: dashboard?.setupProgress?.steps?.hasCompletedSkinTest || false,
  skinType: dashboard?.user ? getSkinType(dashboard.user) : null,
};
const [optimisticSkinTest, setOptimisticSkinTest] = useOptimistic(initialSkinTest);
```

### 3. **State Transformations**
```typescript
// getSkinType(): Takes user.skinType array, returns capitalized string
// Input: ["dry"] → Output: "Dry"

// getGreeting(): Creates personalized greeting
// Input: "John" → Output: "Welcome to Skinbestie, John!"

// checkSetupComplete(): Determines if all steps done
// Returns true only if ALL of:
// - hasCompletedSkinTest
// - hasPublishedGoals
// - hasPublishedRoutine
// - hasCompletedBooking
// - goalsAcknowledgedByClient === true
```

---

## UI Elements & Labels

### Main Page Header
- **Heading:** `"Welcome to Skinbestie, {nickname}!"` or `"Welcome to Skinbestie!"`
- **Subheading:** `"Let's set up your personalized skin transformation journey"`

### Progress Tracker
- **Title:** `"Setup Progress"`
- **Counter:** `"{completed} of {total} Completed"`
- **Progress Bar:** Visual indicator (0-100%)

### Card Title
- **Text:** `"Essential Setup Steps"`

### Step 1: Book Your Consultation
- **Title:** `"Book Your Consultation"`
- **Description:** `"A calm, friendly 50-minute video chat where we get to know you: lifestyle, skin history, current routine, and goals. Together we'll map a simple, personalised routine that fits your life."`
- **Button (not completed):** `"Schedule Now"` with ArrowRight icon
- **Badge:** `"COMPLETED"` (green) or `"PENDING"` (orange)

### Step 2: Take a Skin Test
- **Title:** `"Take a Skin Test"`
- **Description:** `"Complete our 3-step skin type assessment to identify your unique skin needs & characteristics."`
- **Link (always visible):** `"📋 How to do a skin test"` (underlined, orange)

#### When NOT completed:
- **Button:** `"Select Your Skin Type"` with ArrowRight icon
- **Badge:** `"PENDING"` (orange)

#### When completed:
- **Label:** `"Your skin type:"` (text-sm text-gray-600)
- **Value:** `"{SkinType}"` (text-lg font-semibold, capitalized - e.g., "Dry", "Oily", "Combination", "Sensitive")
- **Button:** `"Change skin type"`
- **Badge:** `"COMPLETED"` (green)

### Step 3: Set Your Skin Goals
- **Title:** `"Set Your Skin Goals"`
- **Description:** `"Create SMART goals based on your consultation to guide your skincare journey."`

#### When goals published:
- **Button:** `"Review Your Goals"` with ArrowRight icon
- **Badge:** `"PENDING"` (orange) if not acknowledged, `"COMPLETED"` (green) if acknowledged

#### When waiting:
- **Message:** `"⏳ Your coach is setting up your personalized goals"`
- **Badge:** `"WAITING"` (gray)

### Step 4: Get Your Custom Routine
- **Title:** `"Get Your Custom Routine"`
- **Description:** `"Receive your personalized morning and evening skincare routine with product recommendations."`

#### When routine published:
- **Button:** `"View Routine"` with ArrowRight icon
- **Badge:** `"COMPLETED"` (green)

#### When waiting:
- **Message:** `"⏳ Your coach is preparing your custom routine"`
- **Badge:** `"WAITING"` (gray)

### What Happens Next Card
- **Description:** `"Your coach is reviewing your progress and will be in touch soon. Keep up the great work!"`
- **Coach Name:** `"Coach"`

---

## Modals & Interactions

### 1. PreferredNameModal

**Opens automatically when:** `dashboard.user.nickname === null`

**Structure:**
- **Icon:** 👋 (waving hand emoji, large)
- **Title:** `"Hey Bestie, What should we call you?"`
- **Description:** `"We have your name from onboarding, but feel free to let us know how you prefer to be addressed"`

**Options (Radio Group):**
1. **Full Name** - Label: `"{firstName} {lastName}"` (e.g., "John Doe")
2. **First Name** - Label: `"{firstName}"` (e.g., "John")
3. **Initials** - Label: `"{initials}"` (e.g., "JD")

**Custom Name Section:**
- **Divider:** `"Or Use Something Else"`
- **Label:** `"Enter Custom Name"`
- **Input Placeholder:** `"Enter Your Preferred Name"`
- **Help Text:** `"This is how we will address you throughout your skin journey"`

**Actions:**
- **Cancel Button:** `"Cancel"` - Sets firstName as default
- **Save Button:** `"Save and Continue"` - Disabled if custom field is empty
- **Close (X):** Calls handleCancel

**Behavior:**
- Selecting radio option enables Save button
- Typing in custom field automatically selects "custom" option
- Cancel → calls `updateNickname(firstName)` → closes modal
- Save → calls `updateNickname(selectedName)` → closes modal

---

### 2. SkinTestModal

**Opens when:** User clicks "📋 How to do a skin test" link

**Structure:**
- **Icon:** Droplet (in circle, primary color)
- **Title:** `"Select Your Skin Type"` ⚠️ Note: Title is about selection, but this is the INSTRUCTIONS modal
- **Description:** `"Choose the skin type that best describes your skin"`

**Content:**
- **Section 1:** `"Steps"` (h3)
  - Step 1: "Wash your face with lukewarm water (or if you have any makeup, use a very gentle cleanser to get any makeup off"
  - Step 2: "Get your face cloth and pat face dry."
  - Step 3: "Do nothing and see how your skin responds after 30 minutes to 1hour."

- **Section 2:** `"Results & What They Mean"` (h3)
  - "If you feel tight or stripped, you have **DRY SKIN**"
  - "If you feel refreshed or some shininess, **OILY SKIN**"
  - "If you feel some shininess on t-zone and tight on cheeks, **COMBINATION SKIN**"
  - "If you feel some mild redness or symptoms of sensitivity might be heightened **SENSITIVE SKIN.**"

**Actions:**
- **Close Button (bottom):** `"Close"`
- **Close (X top right):** `"Close"` (sr-only text)

---

### 3. SelectSkinTypeModal

**Opens when:** User clicks "Select Your Skin Type" or "Change skin type" button

**Structure:**
- **Icon:** Droplet (in circle, primary color)
- **Title:** `"Select Your Skin Type"`
- **Description:** `"Choose the skin type that best describes your skin"`

**Skin Type Options (Radio Group, 2x2 grid):**
1. **Dry** - value: `"dry"`
2. **Oily** - value: `"oily"`
3. **Combination** - value: `"combination"`
4. **Sensitive** - value: `"sensitive"`

**Actions:**
- **Save Button:** `"Save"` - Disabled until selection made
- **Close (X):** Closes modal without saving

**Behavior:**
- If `currentSkinType` prop provided, that option is pre-selected
- Save button calls `onSave(skinType)` with lowercase value (e.g., "oily")
- Component capitalizes for display, server action receives lowercase

---

### 4. ReviewGoalsModal

**Opens when:** User clicks "Review Your Goals" button (when goals published)

**Structure:**
- **Icon:** Target (in circle, primary color)
- **Title:** `"Your Skin Goals"`
- **Description:** `"Track your progress and manage your personalized skincare goals. Drag to reorder by priority."`

**Content:**
- **GoalsSection component** - Displays all goals, allows:
  - Add new goal
  - Edit goal
  - Toggle goal completion
  - Delete goal
  - Reorder goals (drag and drop)

**Actions:**
- **Save Button:** `"Save"` - Calls `acknowledgeGoalsAction(true)`, invalidates dashboard query, closes modal
- **Close (X):** Closes modal without acknowledging

**Behavior:**
- Uses optimistic UI for all goal operations (add, update, toggle, delete, reorder)
- Server actions called in background
- On success, invalidates dashboard query to refetch
- On error, shows toast and refetches to revert optimistic update

---

### 5. ViewRoutineModal

**Opens when:** User clicks "View Routine" button (when routine published)

**Structure:**
- **Icon:** Sparkles (in circle, primary color)
- **Title:** `"Your Custom Routine"`
- **Description:** `"Your personalized skincare routine tailored to your needs"`

**Content:**

#### If routine exists:
- **Morning Routine** (if items exist)
  - **Heading:** `"☀️ Morning Routine"` (h3)
  - **Items:** RoutineItemCard components (sorted by order)
    - Product name
    - Instructions/description
    - Routine step category
    - Product URL (if available)

- **Evening Routine** (if items exist)
  - **Heading:** `"🌙 Evening Routine"` (h3)
  - **Items:** RoutineItemCard components (sorted by order)

#### If no routine:
- **Message:** `"Your custom routine is being prepared. Check back soon!"`

**Actions:**
- **Close Button:** `"Close"`
- **Close (X):** Closes modal

---

## Step States & Logic

### Step Status Types
```typescript
type StepStatus = "completed" | "pending" | "waiting"
```

### Step Variants (Visual Styling)
```typescript
type StepVariant = "default" | "success" | "muted"
```

### Step 1: Booking

```typescript
function getBookingState(hasCompletedBooking: boolean) {
  if (hasCompletedBooking) {
    return { status: "completed", variant: "success" };
  }
  return { status: "pending", variant: "default" };
}
```

**UI Mapping:**
- `completed` → Green badge "COMPLETED", checkmark avatar, no button
- `pending` → Orange badge "PENDING", "1" avatar, "Schedule Now" button

---

### Step 2: Skin Test

```typescript
function getSkinTestState(skinTestCompleted: boolean) {
  if (skinTestCompleted) {
    return { status: "completed", variant: "success" };
  }
  return { status: "pending", variant: "muted" };
}
```

**UI Mapping:**
- `completed` → Green badge "COMPLETED", checkmark avatar, shows skin type + "Change skin type" button
- `pending` → Orange badge "PENDING", "2" avatar, "Select Your Skin Type" button

**Important:** Status based on `optimisticSkinTest.completed`, not direct API value

---

### Step 3: Goals

```typescript
function getGoalsState(hasPublishedGoals: boolean, goalsAcknowledged: boolean) {
  if (hasPublishedGoals && goalsAcknowledged) {
    return { status: "completed", variant: "success" };
  }
  if (hasPublishedGoals && !goalsAcknowledged) {
    return { status: "pending", variant: "default" };
  }
  return { status: "waiting", variant: "muted" };
}
```

**UI Mapping:**
- `completed` (published + acknowledged) → Green badge "COMPLETED", checkmark avatar, "Review Your Goals" button
- `pending` (published but not acknowledged) → Orange badge "PENDING", "3" avatar, "Review Your Goals" button
- `waiting` (not published yet) → Gray badge "WAITING", "3" avatar, "⏳ Your coach is setting up..." message

---

### Step 4: Routine

```typescript
function getRoutineState(hasPublishedRoutine: boolean) {
  if (hasPublishedRoutine) {
    return { status: "completed", variant: "success" };
  }
  return { status: "waiting", variant: "muted" };
}
```

**UI Mapping:**
- `completed` → Green badge "COMPLETED", checkmark avatar, "View Routine" button
- `waiting` → Gray badge "WAITING", "4" avatar, "⏳ Your coach is preparing..." message

---

## Server Actions

### 1. fetchDashboardAction()
- **File:** `actions/setup-dashboard-actions.ts`
- **Purpose:** Fetches complete dashboard data
- **Returns:** `DashboardResponse` (validated with Zod schema)
- **Called by:** `useDashboard()` hook

---

### 2. updateNickname(nickname: string)
- **File:** `actions/setup-dashboard-actions.ts`
- **Purpose:** Updates user's preferred nickname
- **Parameters:** `nickname` (string)
- **Returns:** `{ success: boolean, data?: any, error?: { message: string, code?: string } }`
- **Behavior:**
  - Optimistic update: Immediately updates `optimisticNickname`
  - On success: Invalidates dashboard query, closes modal
  - On error: Shows toast error, does NOT revert optimistic update (known issue)

---

### 3. updateSkinTest(skinType: string)
- **File:** `actions/setup-dashboard-actions.ts`
- **Purpose:** Updates user's skin type and marks skin test as completed
- **Parameters:** `skinType` (lowercase: "dry", "oily", "combination", "sensitive")
- **Request Body:** `{ userId, skinType: [skinType], hasCompletedSkinTest: true }`
- **Returns:** `{ success: boolean, data?: any, error?: { message: string, code?: string } }`
- **Behavior:**
  - Optimistic update: Immediately updates `optimisticSkinTest` with capitalized skinType
  - On success: Invalidates dashboard query, closes modal
  - On error: Shows toast error, does NOT revert optimistic update (known issue)

**Note:** Component capitalizes for display, but server receives lowercase

---

### 4. acknowledgeGoalsAction(acknowledged: boolean)
- **File:** `goal-actions.ts`
- **Purpose:** Marks that user has reviewed their goals
- **Parameters:** `acknowledged` (boolean)
- **Returns:** `{ success: boolean, data?: any, error?: { message: string, code?: string } }`
- **Behavior:**
  - Called when user clicks "Save" in ReviewGoalsModal
  - Updates `goalsAcknowledgedByClient` field
  - Changes Step 3 status from "pending" to "completed"

---

### 5. Goal Actions (createGoalAction, updateGoalAction, toggleGoalAction, deleteGoalAction, reorderGoalsAction)
- **File:** `goal-actions.ts`
- **Purpose:** CRUD operations for goals within ReviewGoalsModal
- **All use optimistic updates** with `useOptimistic` hook
- **On success:** Invalidate dashboard query
- **On error:** Show toast, invalidate to revert

---

## User Workflows

### Workflow 1: First-Time User Setup (Complete Journey)

```
1. User logs in → Dashboard loads
   ↓
2. User sees PreferredNameModal (nickname === null)
   ↓
3. User selects/enters preferred name → Clicks "Save and Continue"
   ↓
4. Modal closes → Greeting updates to "Welcome to Skinbestie, {name}!"
   ↓
5. User sees Setup Dashboard with 4 steps
   - Step 1: "PENDING" (assuming booking not done)
   - Step 2: "PENDING"
   - Step 3: "WAITING"
   - Step 4: "WAITING"
   ↓
6. [User books consultation externally - updates via backend]
   ↓
7. User clicks "📋 How to do a skin test" → SkinTestModal opens
   ↓
8. User reads instructions → Clicks "Close"
   ↓
9. User clicks "Select Your Skin Type" → SelectSkinTypeModal opens
   ↓
10. User selects skin type (e.g., "Oily") → Clicks "Save"
    ↓
11. Modal closes → Step 2 updates:
    - Status: "COMPLETED" (green badge, checkmark)
    - Shows "Your skin type: Oily"
    - Shows "Change skin type" button
    ↓
12. [Coach publishes goals via backend]
    ↓
13. Dashboard refetches → Step 3 changes:
    - From "WAITING" → "PENDING"
    - Shows "Review Your Goals" button
    ↓
14. User clicks "Review Your Goals" → ReviewGoalsModal opens
    ↓
15. User reviews goals, can add/edit/reorder → Clicks "Save"
    ↓
16. Modal closes → Step 3 updates:
    - Status: "COMPLETED" (green badge, checkmark)
    - goalsAcknowledgedByClient = true
    ↓
17. [Coach publishes routine via backend]
    ↓
18. Dashboard refetches → Step 4 changes:
    - From "WAITING" → "COMPLETED"
    - Shows "View Routine" button
    ↓
19. User clicks "View Routine" → ViewRoutineModal opens
    ↓
20. User views morning/evening routine → Clicks "Close"
    ↓
21. ALL STEPS COMPLETED → Dashboard switches to SubscriberDashboard view
```

---

### Workflow 2: Changing Skin Type

```
1. User is on Setup Dashboard with completed skin test
   - Shows "Your skin type: Dry"
   - Shows "Change skin type" button
   ↓
2. User clicks "Change skin type" → SelectSkinTypeModal opens
   ↓
3. Modal shows with "Dry" pre-selected
   ↓
4. User selects different type (e.g., "Combination") → Clicks "Save"
   ↓
5. Modal closes → Optimistic update shows immediately:
   - "Your skin type: Combination"
   ↓
6. Server action completes:
   - Success → Dashboard refetches, confirms "Combination"
   - Error → Toast shown, optimistic update persists (known issue)
```

---

### Workflow 3: Error States

#### Preferred Name Save Failure
```
1. User enters custom name "Alex" → Clicks "Save and Continue"
   ↓
2. Optimistic update: Greeting shows "Welcome to Skinbestie, Alex!"
   ↓
3. Server action fails
   ↓
4. Toast error: "Failed to save preferred name: {error.message}"
   ↓
5. Optimistic update persists (greeting still shows "Alex")
   ↓
6. Dashboard query NOT invalidated, so no refetch
```

#### Skin Type Save Failure
```
1. User selects "Oily" → Clicks "Save"
   ↓
2. Modal closes, optimistic update: "Your skin type: Oily"
   ↓
3. Server action fails
   ↓
4. Toast error: "Failed to save skin type: {error.message}"
   ↓
5. Optimistic update persists (still shows "Oily")
   ↓
6. Dashboard query NOT invalidated, so no refetch
```

**Known Issue:** Optimistic updates don't revert on error. This is because `useOptimistic` in the mock (`src/test/setup.ts`) doesn't auto-revert, and the component doesn't manually revert on failure.

---

### Workflow 4: Dashboard Loading States

```
1. User navigates to /dashboard
   ↓
2. isLoading === true → Shows DashboardSkeleton
   ↓
3. Data fetches successfully → Shows content:
   - If setup incomplete → ProgressTracker + SetupDashboard
   - If setup complete → SubscriberDashboard
   ↓
4. Error occurs → Shows ErrorFeedback with "Retry" button
   ↓
5. User clicks "Retry" → refetch() called → Back to step 2
```

---

## Data Schema (for Testing)

### Complete DashboardResponse Type
```typescript
{
  user: {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string | null;
    email: string;
    phoneNumber: string;
    skinType: string[] | null;  // e.g., ["dry"] or null
  };
  setupProgress: {
    percentage: number;
    completed: number;  // 0-4
    total: number;      // Always 4
    steps: {
      hasCompletedSkinTest: boolean;
      hasPublishedGoals: boolean;
      hasPublishedRoutine: boolean;
      hasCompletedBooking: boolean;
    };
  };
  todayRoutine: Array<TodayRoutineStep> | null;
  catchupSteps: Array<TodayRoutineStep> | null;
  routine: {
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    productPurchaseInstructions: string | null;
    morning: Array<RoutineTemplateStep>;
    evening: Array<RoutineTemplateStep>;
  } | null;
  goals: Array<Goal> | null;
  goalsAcknowledgedByClient: boolean;
}
```

### Minimal Mock for Testing
```typescript
const mockDashboard = {
  user: {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    nickname: null,  // or "John" for returning user
    email: "john@example.com",
    phoneNumber: "+1234567890",
    skinType: null,  // or ["dry"] for completed skin test
  },
  setupProgress: {
    percentage: 0,
    completed: 0,
    total: 4,
    steps: {
      hasCompletedSkinTest: false,
      hasPublishedGoals: false,
      hasPublishedRoutine: false,
      hasCompletedBooking: false,
    },
  },
  todayRoutine: null,
  catchupSteps: null,
  routine: null,
  goals: null,
  goalsAcknowledgedByClient: false,
};
```

---

## Testing Implications

### 1. **Preferred Name Tests Must Account For:**
- Modal auto-opens when `nickname === null`
- Modal does NOT open when `nickname` has a value
- Full name = `firstName + " " + lastName`
- Initials = First letter of each word in full name
- Cancel button calls `updateNickname(firstName)`
- Empty/whitespace custom name disables Save button

### 2. **Skin Test Tests Must Account For:**
- SkinTestModal title is "Select Your Skin Type" (confusing but accurate)
- Skin type stored as lowercase array: `["dry"]`
- Display capitalized: `"Dry"`
- Server action receives lowercase: `"dry"`
- Component uses `optimisticSkinTest` state, not direct API data
- When `optimisticSkinTest.completed === true`:
  - Shows "Your skin type: {skinType}"
  - Shows "Change skin type" button
- When `optimisticSkinTest.completed === false`:
  - Shows "Select Your Skin Type" button

### 3. **Goals Tests Must Account For:**
- Step 3 has THREE states: waiting, pending, completed
- `waiting` → Goals not published yet
- `pending` → Goals published but not acknowledged
- `completed` → Goals published AND acknowledged
- ReviewGoalsModal opens for both `pending` and `completed`
- Clicking "Save" in modal calls `acknowledgeGoalsAction(true)`

### 4. **Routine Tests Must Account For:**
- Step 4 has TWO states: waiting, completed
- No "pending" state (routine is either published or not)
- ViewRoutineModal shows morning/evening routine separately
- Routine items sorted by `order` field

### 5. **Error Handling Tests Must Account For:**
- Optimistic updates DO NOT revert on error (known issue)
- Toast errors shown for failures
- Dashboard query NOT invalidated on error (so no auto-revert)

---

## Component File Paths

```
Main Components:
- src/app/(application)/dashboard/page.tsx
- src/app/(application)/dashboard/setup-dashboard.tsx
- src/app/(application)/dashboard/subscriber-dashboard.tsx

Step Components:
- src/app/(application)/dashboard/components/progress-tracker.tsx
- src/app/(application)/dashboard/components/step-card.tsx
- src/app/(application)/dashboard/components/what-happens-next-card.tsx

Modals:
- src/app/(application)/dashboard/components/preferred-name-modal.tsx
- src/app/(application)/dashboard/components/skin-test-modal.tsx
- src/app/(application)/dashboard/components/select-skin-type-modal.tsx
- src/app/(application)/dashboard/components/view-routine-modal.tsx
- src/features/goals/components/review-goals-modal.tsx

Skeletons:
- src/app/(application)/dashboard/components/dashboard-skeleton.tsx
- src/app/(application)/dashboard/components/progress-tracker-skeleton.tsx
- src/app/(application)/dashboard/components/step-card-skeleton.tsx

Actions:
- src/app/(application)/dashboard/actions/setup-dashboard-actions.ts
- src/app/(application)/dashboard/goal-actions.ts

Hooks:
- src/app/(application)/dashboard/hooks/use-dashboard.ts

Schemas:
- src/app/(application)/dashboard/schemas/dashboard.schema.ts
- src/lib/schemas/index.ts (user, goal schemas)

Shared Components:
- src/app/(application)/components/error-feedback.tsx
```

---

## Notes for Test Writers

1. **Always use `getByRole` first** - Most elements have accessible roles
2. **Skin type casing is important** - Mock as lowercase array, display as capitalized string
3. **Modal titles can be misleading** - SkinTestModal title says "Select Your Skin Type" but it's the instructions modal
4. **Step dependencies matter** - Goals and Routine depend on coach actions (backend updates)
5. **Optimistic updates persist on error** - This is current behavior, not ideal
6. **Query invalidation is key** - Most successful actions invalidate `["dashboard"]` query
7. **Modal close behavior** - Some close on X, some on overlay click, some on button click only
8. **Badge text is uppercase** - "COMPLETED", "PENDING", "WAITING"
9. **Avatar content changes** - Number when pending/waiting, Checkmark when completed
10. **Greeting updates immediately** - Thanks to optimistic state

---

## End of Document

This analysis provides complete documentation of the Setup Dashboard structure for accurate UI test implementation. All labels, buttons, states, and workflows are documented as they appear in the actual code.
