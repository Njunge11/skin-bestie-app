# Dashboard Feature Testing Guide - Part 1

## Core Testing Philosophy

**"The more your tests resemble the way your software is used, the more confidence they can give you."**

**"Write tests. Not too many. Mostly integration."**

---

## Dashboard Feature Overview

The dashboard is the central hub where users:
- Complete their onboarding setup (4 steps)
- Set preferred name
- Take skin test and select skin type
- Review goals set by coach
- View their custom skincare routine
- Track progress through setup

---

## Tests to Write

### 1. Complete Setup Workflow - New User (Primary Flow) ✅

**What to test:**
- User loads dashboard and sees loading state
- User sees greeting with firstName (no nickname yet)
- Preferred name modal opens automatically
- User enters preferred name → sees it in greeting (optimistic UI)
- User clicks "How to do a skin test" → sees instructions modal → closes it
- User selects skin type → sees it displayed immediately
- User can change skin type
- User sees goals are in "waiting" state initially
- Goals are published by coach (mock API update) → user sees "Review Your Goals" button
- User reviews goals and acknowledges them → step marked complete
- User sees routine in "waiting" state initially
- Routine is published by coach (mock API update) → user sees "View Routine" button
- User views routine details → closes modal
- All 4 steps marked complete → progress shows "4 of 4 complete"
- User sees "Setup Complete! 🎉" subscriber dashboard

**Why this test:**
- Covers the entire happy path user journey
- Tests all major features working together
- Validates optimistic UI updates
- Ensures progress tracking works correctly

---

### 2. Partial Setup - Returning User ✅

**What to test:**
- User with 2 of 4 steps complete loads dashboard
- Progress tracker shows "2 of 4 complete"
- Skin test already done → shows current skin type
- User changes skin type → sees updated type (optimistic UI)
- Goals waiting for coach
- Goals get published → user reviews and acknowledges
- Progress updates to "3 of 4 complete"
- Routine gets published → user views it
- Progress updates to "4 of 4 complete"
- User sees subscriber dashboard

**Why this test:**
- Tests resuming partial setup
- Validates state persistence
- Tests editing existing data (changing skin type)

---

### 3. Error Recovery - API Failures ✅

**What to test:**
- User saves preferred name → API fails → toast error appears
- User retries → API succeeds → greeting updates
- User selects skin type → API fails → toast error appears
- Modal stays open (user can retry)
- User retries → API succeeds → skin type displays
- Dashboard data loads successfully after recovery

**Why this test:**
- Tests complete error recovery workflow (not just error states)
- Ensures users can recover from failures
- Validates error messages are helpful
- Tests that UI state remains consistent during errors

---

### 4. Error Recovery - Dashboard Load Failure ✅

**What to test:**
- User navigates to dashboard → API fails to load
- User sees error message with retry button
- User clicks retry → API succeeds
- Dashboard loads with setup steps visible
- User can interact normally

**Why this test:**
- Tests initial load failure recovery
- Validates retry mechanism works
- Ensures user isn't stuck on error

---

### 5. Preferred Name Modal Flow ✅

**What to test:**
- Modal opens automatically when nickname is null
- User sees full name displayed
- User cannot dismiss modal by clicking outside or pressing Escape
- User tries empty name → validation prevents submission
- User types valid preferred name → saves successfully
- Modal closes → greeting updates with preferred name
- User clicks "Use my first name instead" → modal closes → greeting shows firstName

**Why this test:**
- Tests required modal flow (can't be dismissed)
- Validates input validation
- Tests both save paths (custom name vs first name)

---

### 6. Skin Test Complete Flow ✅

**What to test:**
- User sees "Select Your Skin Type" button (pending state)
- User clicks "How to do a skin test" → sees instructions modal → closes it
- User clicks "Select Your Skin Type" → modal opens
- User sees all 5 skin type options (Normal, Dry, Oily, Combination, Sensitive)
- User selects "Sensitive" → saves
- Modal closes → skin type displayed (optimistic UI)
- Step card shows completed status
- User clicks "Change skin type" → modal opens with current selection
- User selects "Oily" → saves
- Skin type updates → no longer shows "Sensitive"

**Why this test:**
- Tests complete feature workflow
- Validates all skin type options are available
- Tests editing functionality
- Ensures optimistic UI works

---

### 7. Goals Review Flow ✅

**What to test:**
- Goals in waiting state → user sees message "Your coach is setting up your personalized goals"
- Goals get published (mock API update)
- User sees "Review Your Goals" button
- User clicks button → modal opens
- User sees all goals from coach
- User marks a goal as complete (checkbox interaction)
- User adds new custom goal → types description → saves
- New goal appears in list
- User acknowledges goals → clicks "Looks good"
- Modal closes → goals step shows completed

**Why this test:**
- Tests waiting state → active state transition
- Validates goal interaction (mark complete, add new)
- Tests modal workflow

---

### 8. Routine View Flow ✅

**What to test:**
- Routine in waiting state → user sees message "Your coach is preparing your custom routine"
- Routine gets published (mock API update)
- User sees "View Routine" button → clicks it
- Modal opens with routine name
- Morning routine tab is active by default
- User sees all morning steps with product names, instructions, order
- User switches to evening routine tab
- User sees all evening steps
- User sees frequency info (Daily, Specific days)
- User sees days for specific_days frequency (e.g., "Monday, Wednesday, Friday")
- User closes modal

**Why this test:**
- Tests waiting state → active state transition
- Validates tab switching
- Ensures all routine data displays correctly
- Tests modal interaction

---

### 9. Setup Progress Tracking ✅

**What to test:**
- Progress starts at "0 of 4 complete"
- User completes booking → progress shows "1 of 4 complete"
- User completes skin test → progress shows "2 of 4 complete"
- User reviews goals → progress shows "3 of 4 complete"
- Routine published and viewed → progress shows "4 of 4 complete"
- User sees subscriber dashboard (setup complete state)

**Why this test:**
- Validates progress tracking accuracy
- Tests all state transitions
- Ensures completion triggers subscriber view

---

### 10. Optimistic UI Updates ✅

**What to test:**
- User saves preferred name → greeting updates IMMEDIATELY (before API completes)
- No loading spinner visible
- API eventually confirms → no UI flicker or change
- User selects skin type → skin type displays IMMEDIATELY (before API completes)
- No loading spinner visible
- API eventually confirms → no UI flicker
- If API fails after optimistic update → UI reverts gracefully with error message

**Why this test:**
- Tests optimistic UI behavior
- Ensures immediate feedback
- Validates no loading states during optimistic updates
- Tests revert on failure

---

## What to Test - Dashboard Specifics

✅ **User interactions:**
- Opening/closing modals
- Clicking buttons (Select Skin Type, Review Goals, View Routine)
- Typing in inputs (preferred name)
- Selecting radio buttons (skin type)
- Toggling checkboxes (goal completion)
- Switching tabs (morning/evening routine)
- Clicking retry on errors

✅ **Observable user outcomes:**
- Greeting text changes when name saved
- Progress tracker updates (0/4 → 1/4 → 2/4 → 3/4 → 4/4)
- Step cards change status (pending → completed)
- Skin type displays after selection
- Goals appear after coach publishes
- Routine appears after coach publishes
- Toast notifications on errors
- Subscriber dashboard appears when setup complete

✅ **State transitions:**
- Loading → Loaded
- Waiting (coach) → Available (user action)
- Pending (step) → Completed (step)
- Error → Retry → Success

✅ **Complete workflows:**
- Full setup journey (new user)
- Partial setup completion (returning user)
- Error → Recovery → Success

---

## What NOT to Test - Dashboard Specifics

❌ **Implementation details:**
- `useState` values inside components
- `useOptimistic` hook internals
- `useQuery` cache behavior
- Helper functions (`getGreeting`, `getSkinType`, `checkSetupComplete`)
- Component props being passed down
- Event handler functions (`handleSaveSkinType`, `handleSavePreferredName`)

❌ **Things covered by TypeScript:**
- Type errors in schemas
- Type mismatches in props

❌ **Things covered by validation elsewhere:**
- Zod schema validation logic
- API client error handling internals
- React Query retry logic

❌ **Testing every permutation:**
- Don't test each skin type individually (Normal, Dry, Oily, etc.) as separate tests
- Don't test each goal individually
- Don't test each routine step individually
- Don't test every possible error scenario separately

**Why?** These permutations don't test different user behavior - they test data variations. One test covering the workflow is sufficient.

---

## Mock Strategy

### ✅ DO Mock

**Server Actions (use vi.mock):**
- `fetchDashboardAction` (dashboard data)
- `updateNickname` (update nickname)
- `updateSkinTest` (update skin type)
- Goal update actions
- Routine fetching actions

**Mock at the server action boundary:**
```typescript
// ✅ Good - Mock server actions directly
vi.mock('../actions/setup-dashboard-actions', () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
}));

// Then in your test:
vi.mocked(fetchDashboardAction).mockResolvedValue(mockDashboardData);
```

### ❌ DON'T Mock

**Internal components:**
```typescript
// ❌ Bad - Don't mock internal components
vi.mock('./SetupDashboard');
vi.mock('./PreferredNameModal');
vi.mock('./SkinTestModal');
```

**Custom hooks:**
```typescript
// ❌ Bad - Don't mock hooks
vi.mock('./hooks/use-dashboard');
```

**State management:**
```typescript
// ❌ Bad - Don't mock React Query
vi.mock('@tanstack/react-query');
```

**Why?** When you mock internal components/hooks, you lose confidence that they work together correctly. Server actions are the network boundary in Next.js App Router.

---

## Query Strategy (React Testing Library)

### ✅ DO Use

**1. `getByRole` (BEST):**
```typescript
// Buttons
screen.getByRole('button', { name: /select your skin type/i })
screen.getByRole('button', { name: /review your goals/i })

// Dialogs/Modals
screen.getByRole('dialog')

// Radio buttons
screen.getByRole('radio', { name: /sensitive/i })

// Checkboxes
screen.getByRole('checkbox', { name: /goal completed/i })

// Tabs
screen.getByRole('tab', { name: /morning/i })
```

**2. `getByLabelText` (form inputs):**
```typescript
screen.getByLabelText(/preferred name/i)
screen.getByLabelText(/new goal/i)
```

**3. `getByText` (non-interactive content):**
```typescript
screen.getByText(/welcome to skinbestie/i)
screen.getByText(/2 of 4 complete/i)
screen.getByText(/your coach is setting up your personalized goals/i)
```

### ❌ DON'T Use

```typescript
// ❌ Bad
container.querySelector('.modal')
container.getElementsByClassName('button')
screen.getByTestId('skin-type-modal')
```

**Why?** These don't reflect how users interact with your app.

---

## User Interactions

### ✅ DO Use `userEvent`

```typescript
const user = userEvent.setup();

// Clicking
await user.click(button);

// Typing
await user.type(input, 'Njungching');

// Clearing input
await user.clear(input);

// Keyboard
await user.keyboard('{Escape}');
await user.tab();
```

### ❌ DON'T Use `fireEvent`

```typescript
// ❌ Bad
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
```

**Why?** `userEvent` simulates the full sequence of events a real user triggers.

---

## Waiting for Changes

### ✅ DO Use `find*` queries

```typescript
// ✅ Good - built-in waiting
expect(await screen.findByText(/setup complete!/i)).toBeInTheDocument();
```

### ⚠️ Use `waitFor` only when necessary

```typescript
// ✅ Good - single assertion
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled();
});

// ❌ Bad - multiple assertions
await waitFor(() => {
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
});
```

---

## Test Structure

### ✅ DO Write Complete Workflows

```typescript
it('user completes entire setup journey from new account to subscriber dashboard', async () => {
  // Complete user journey from start to finish
  // Multiple steps, state changes, interactions
});
```

### ❌ DON'T Write Isolated Unit Tests

```typescript
// ❌ Bad - Testing implementation
it('sets loading state to true', () => {});

it('calls handleSubmit function', () => {});

it('renders PreferredNameModal with correct props', () => {});
```

**Why?** Users don't care about internal state or props - they care about outcomes.

---

## Common Mistakes to Avoid

1. ❌ Using `fireEvent` instead of `userEvent`
2. ❌ Mocking internal components (`SetupDashboard`, `ProgressTracker`)
3. ❌ Testing state values (`useState`, `useOptimistic`)
4. ❌ Testing that components render (if they don't render, the test fails anyway)
5. ❌ Not using `screen` for queries
6. ❌ Using `container.querySelector()`
7. ❌ Wrapping things in `act()` manually (React Testing Library handles this)
8. ❌ Testing every data permutation (all skin types, all goals, all routine steps)
9. ❌ Writing separate tests for every validation rule
10. ❌ Testing loading states in isolation (test the full flow instead)

---

## Dashboard-Specific Best Practices

### ✅ DO

- Test complete setup workflows (new user, returning user)
- Test optimistic UI updates (immediate feedback)
- Test error recovery workflows (fail → retry → succeed)
- Test state transitions (waiting → available, pending → completed)
- Test modal interactions (open → interact → close)
- Test progress tracking through all states
- Mock server actions with vi.mock()
- Use real components and hooks
- Query by accessible attributes (role, label)

### ❌ DON'T

- Test each setup step in isolation
- Mock React Query or internal hooks
- Test implementation details (state, handlers, props)
- Test every skin type option separately
- Test every goal individually
- Test CSS classes or styling
- Test that components receive correct props
- Test Zod schema validation separately

---

## Example: Complete Setup Flow Test Structure

```typescript
// Mock server actions
vi.mock('../actions/setup-dashboard-actions', () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
}));

describe('Dashboard - Complete Setup Flow', () => {
  it('user completes entire setup journey from new account to subscriber dashboard', async () => {
    const user = userEvent.setup();

    // Setup mock responses
    vi.mocked(fetchDashboardAction).mockResolvedValue(mockDashboardData);
    vi.mocked(updateNickname).mockResolvedValue({ success: true });
    vi.mocked(updateSkinTest).mockResolvedValue({ success: true });

    // Render with providers
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    // Assert initial state
    expect(await screen.findByText(/welcome to skinbestie/i)).toBeInTheDocument();

    // User action: Save preferred name
    await user.type(screen.getByLabelText(/preferred name/i), 'Njungching');
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assert outcome
    expect(screen.getByText(/welcome to skinbestie, njungching!/i)).toBeInTheDocument();

    // User action: Select skin type
    await user.click(screen.getByRole('button', { name: /select your skin type/i }));
    await user.click(screen.getByRole('radio', { name: /sensitive/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assert outcome
    expect(await screen.findByText(/your skin type:/i)).toBeInTheDocument();
    expect(screen.getByText(/sensitive/i)).toBeInTheDocument();

    // Continue through remaining steps...

    // Final assertion
    expect(await screen.findByText(/setup complete!/i)).toBeInTheDocument();
  });
});
```

**Pattern:** Action → Outcome → Action → Outcome (user perspective)

---

## Key Takeaways

1. **Test user workflows, not implementation details**
2. **One long test > Many short tests** (for workflows)
3. **Mock at server action boundary** (use vi.mock for server actions)
4. **Query like a user would** (role > label > text)
5. **Use `userEvent` for interactions**
6. **Test error recovery, not just error states**
7. **Test optimistic UI behavior**
8. **Focus on observable outcomes**

---

## Quick Decision Tree for Dashboard Tests

**Should I test this?**

```
Is it a complete user workflow?
  YES → Write the test ✅
  NO  ↓

Is it a user interaction with observable outcome?
  YES → Include in workflow test ✅
  NO  ↓

Is it an implementation detail (state, props, handlers)?
  YES → Don't test ❌
```

**Should I mock this?**

```
Is it a server action?
  YES → Mock with vi.mock() ✅
  NO  ↓

Is it an internal component/hook?
  YES → Use the real thing (don't mock) ✅
```
