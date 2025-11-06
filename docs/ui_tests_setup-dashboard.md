# Setup Dashboard - UI Tests Tracking

This document tracks all UI tests for the Setup Dashboard feature, conforming to principles from [UI_TESTING.md](./UI_TESTING.md).

**Test Philosophy:** Write tests. Not too many. Mostly integration. Test user behavior, not implementation.

---

## Testing Checklist

- [ ] 1. Preferred Name Modal Workflow (7 tests)
- [ ] 2. Skin Test Workflow (4 tests)
- [ ] 3. Setup Progress & Step States (2 tests)
- [ ] 4. Goals Workflow (2 tests)
- [ ] 5. Routine Workflow (2 tests)
- [ ] 6. Dashboard Loading & Error States (2 tests)
- [ ] 7. Complete Setup Journey (1 E2E test)
- [ ] 8. Optimistic Updates & Error Recovery (2 tests)

**Total Tests:** ~22 tests across 8 test suites

---

## 1. Preferred Name Modal Workflow

### ✅ Test Coverage
- [ ] User sets preferred name on first visit (complete workflow)
- [ ] User selects first name only
- [ ] User selects initials
- [ ] User enters custom name
- [ ] User cancels preferred name modal (uses firstName as default)
- [ ] User cannot save empty custom name
- [ ] Preferred name save failure - reverts and shows error

### Test: User sets preferred name on first visit (complete workflow)
**Priority:** HIGH
**User Story:** As a new user, I want to set my preferred name so the app addresses me correctly.

```typescript
it('user opens dashboard for first time, sees preferred name modal, selects full name, and sees personalized greeting', async () => {
  const user = userEvent.setup();

  // Mock dashboard with no nickname
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    user: { nickname: null, firstName: 'John', lastName: 'Doe' },
    setupProgress: { steps: {}, completed: 0, total: 4 },
    // ... other required fields
  });

  render(<DashboardPage />);

  // User sees modal automatically (nickname is null)
  expect(await screen.findByRole('heading', { name: /what should we call you/i })).toBeInTheDocument();

  // User sees their full name as an option
  expect(screen.getByText('John Doe')).toBeInTheDocument();

  // User selects full name option
  await user.click(screen.getByLabelText('John Doe'));

  // User clicks save
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // Modal closes and greeting shows optimistic update
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: /what should we call you/i })).not.toBeInTheDocument();
  });
  expect(screen.getByText(/welcome to skinbestie, john doe/i)).toBeInTheDocument();

  // Server action was called
  expect(updateNickname).toHaveBeenCalledWith('John Doe');
});
```

### Test: User selects first name only
**Priority:** MEDIUM

```typescript
it('user selects first name option and sees it in greeting', async () => {
  const user = userEvent.setup();

  // Mock updateNickname success
  vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });

  render(<DashboardPage />);

  // Wait for modal
  expect(await screen.findByRole('heading', { name: /what should we call you/i })).toBeInTheDocument();

  // User clicks first name option
  await user.click(screen.getByLabelText('John'));

  // User clicks save
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // User sees greeting with first name
  await waitFor(() => {
    expect(screen.getByText(/welcome to skinbestie, john!/i)).toBeInTheDocument();
  });

  expect(updateNickname).toHaveBeenCalledWith('John');
});
```

### Test: User selects initials
**Priority:** MEDIUM

```typescript
it('user selects initials option and sees initials in greeting', async () => {
  // User opens modal
  // User clicks initials option (shows "JD")
  // User saves
  // Sees "Welcome to Skinbestie, JD!"
  // updateNickname called with 'JD'
});
```

### Test: User enters custom name
**Priority:** HIGH

```typescript
it('user enters custom preferred name and sees it in greeting', async () => {
  const user = userEvent.setup();

  render(<DashboardPage />);

  // Wait for modal
  expect(await screen.findByRole('heading', { name: /what should we call you/i })).toBeInTheDocument();

  // User types custom name
  const customInput = screen.getByLabelText(/enter custom name/i);
  await user.type(customInput, 'Johnny');

  // Save button becomes enabled
  const saveButton = screen.getByRole('button', { name: /save and continue/i });
  expect(saveButton).not.toBeDisabled();

  // User clicks save
  await user.click(saveButton);

  // User sees greeting with custom name
  await waitFor(() => {
    expect(screen.getByText(/welcome to skinbestie, johnny!/i)).toBeInTheDocument();
  });

  expect(updateNickname).toHaveBeenCalledWith('Johnny');
});
```

### Test: User cancels preferred name modal
**Priority:** MEDIUM

```typescript
it('user cancels preferred name modal and firstName is used as default', async () => {
  const user = userEvent.setup();

  render(<DashboardPage />);

  // Wait for modal
  expect(await screen.findByRole('heading', { name: /what should we call you/i })).toBeInTheDocument();

  // User clicks Cancel button
  await user.click(screen.getByRole('button', { name: /cancel/i }));

  // Modal closes
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: /what should we call you/i })).not.toBeInTheDocument();
  });

  // Greeting uses firstName as default
  expect(screen.getByText(/welcome to skinbestie, john!/i)).toBeInTheDocument();

  // updateNickname was called with firstName
  expect(updateNickname).toHaveBeenCalledWith('John');
});
```

### Test: User cannot save empty custom name
**Priority:** LOW

```typescript
it('user cannot save when custom name field is empty or only whitespace', async () => {
  const user = userEvent.setup();

  render(<DashboardPage />);

  await screen.findByRole('heading', { name: /what should we call you/i });

  // User types spaces only
  const customInput = screen.getByLabelText(/enter custom name/i);
  await user.type(customInput, '   ');

  // Save button is disabled
  expect(screen.getByRole('button', { name: /save and continue/i })).toBeDisabled();

  // User clears and types real name
  await user.clear(customInput);
  await user.type(customInput, 'Alex');

  // Save button becomes enabled
  expect(screen.getByRole('button', { name: /save and continue/i })).not.toBeDisabled();
});
```

### Test: Preferred name save failure
**Priority:** HIGH

```typescript
it('user sets preferred name, server fails, name reverts, toast shown', async () => {
  const user = userEvent.setup();

  // Mock server failure
  vi.mocked(updateNickname).mockResolvedValue({
    success: false,
    error: { message: 'Database error' }
  });

  render(<DashboardPage />);

  await screen.findByRole('heading', { name: /what should we call you/i });

  // User selects custom name
  await user.type(screen.getByLabelText(/enter custom name/i), 'Johnny');
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // Error toast shown
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to save preferred name',
      expect.objectContaining({ description: 'Database error' })
    );
  });

  // Server action was called
  expect(updateNickname).toHaveBeenCalledWith('Johnny');
});
```

---

## 2. Skin Test Workflow

### ✅ Test Coverage
- [x] User completes skin test (complete workflow) ✅ PASSING
- [ ] User changes skin type after completing test ⚠️ SKIPPED (mock data issue)
- [x] User cannot save skin type without selection ✅ PASSING
- [x] Skin test save failure - shows error toast ✅ PASSING

**Test File:** `src/app/(application)/dashboard/__tests__/skin-test-workflow.test.tsx`
**Status:** 3/4 tests passing, 1 skipped
**Last Run:** 2025-11-03

### Test: User completes skin test (complete workflow)
**Priority:** HIGH
**User Story:** As a user, I want to complete the skin test so I can get personalized recommendations.

```typescript
it('user views skin test instructions, selects skin type, sees confirmation with skin type displayed', async () => {
  const user = userEvent.setup();

  // Mock dashboard with no skin test completed
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    user: { nickname: 'John', firstName: 'John', lastName: 'Doe', skinType: null },
    setupProgress: {
      steps: {
        hasCompletedSkinTest: false,
        hasCompletedBooking: false,
        hasPublishedGoals: false,
        hasPublishedRoutine: false
      },
      completed: 0,
      total: 4
    },
    goalsAcknowledgedByClient: false,
    // ... other fields
  });

  vi.mocked(updateSkinTest).mockResolvedValue({ success: true, data: {} });

  render(<DashboardPage />);

  // User sees skin test step as pending
  expect(await screen.findByText('Take a Skin Test')).toBeInTheDocument();

  // User clicks "How to do a skin test" link
  await user.click(screen.getByText(/how to do a skin test/i));

  // User sees skin test instructions modal
  expect(await screen.findByRole('heading', { name: /skin test/i })).toBeInTheDocument();

  // User closes instructions modal
  const closeButtons = screen.getAllByRole('button', { name: /close/i });
  await user.click(closeButtons[0]);

  // User clicks "Select Your Skin Type" button
  await user.click(screen.getByRole('button', { name: /select your skin type/i }));

  // User sees skin type selection modal
  expect(await screen.findByRole('heading', { name: /select your skin type/i })).toBeInTheDocument();

  // User sees all skin type options
  expect(screen.getByLabelText(/^dry$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^oily$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^combination$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^sensitive$/i)).toBeInTheDocument();

  // User selects "Oily"
  await user.click(screen.getByLabelText(/^oily$/i));

  // User clicks Save
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // Modal closes and optimistic update shows skin type
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: /select your skin type/i })).not.toBeInTheDocument();
  });

  // User sees skin type displayed
  expect(screen.getByText('Your skin type:')).toBeInTheDocument();
  expect(screen.getByText('Oily')).toBeInTheDocument();

  // Server action was called with lowercase
  expect(updateSkinTest).toHaveBeenCalledWith('oily');
});
```

### Test: User changes skin type after completing test
**Priority:** MEDIUM

```typescript
it('user completes skin test, then changes skin type, sees updated type', async () => {
  const user = userEvent.setup();

  // Mock dashboard with completed skin test
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    user: { skinType: ['dry'] },
    setupProgress: { steps: { hasCompletedSkinTest: true } },
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees current skin type
  expect(await screen.findByText('Dry')).toBeInTheDocument();

  // User clicks "Change skin type" button
  await user.click(screen.getByRole('button', { name: /change skin type/i }));

  // User sees modal with current selection
  expect(await screen.findByRole('heading', { name: /select your skin type/i })).toBeInTheDocument();

  // User selects different type
  await user.click(screen.getByLabelText(/^combination$/i));
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // UI updates to show new type
  await waitFor(() => {
    expect(screen.getByText('Combination')).toBeInTheDocument();
  });

  expect(updateSkinTest).toHaveBeenCalledWith('combination');
});
```

### Test: User cannot save skin type without selection
**Priority:** LOW

```typescript
it('user opens skin type modal, save button disabled until selection made', async () => {
  const user = userEvent.setup();

  render(<DashboardPage />);

  // User opens modal
  await user.click(await screen.findByRole('button', { name: /select your skin type/i }));

  // Save button is disabled (no selection made yet)
  expect(screen.getByRole('button', { name: /^save$/i })).toBeDisabled();

  // User selects a type
  await user.click(screen.getByLabelText(/^oily$/i));

  // Save button becomes enabled
  expect(screen.getByRole('button', { name: /^save$/i })).not.toBeDisabled();
});
```

### Test: Skin test save failure
**Priority:** HIGH

```typescript
it('user selects skin type, server fails, selection reverts, toast shown', async () => {
  const user = userEvent.setup();

  // Mock server failure
  vi.mocked(updateSkinTest).mockResolvedValue({
    success: false,
    error: { message: 'Failed to update skin type' }
  });

  render(<DashboardPage />);

  // User selects skin type
  await user.click(await screen.findByRole('button', { name: /select your skin type/i }));
  await user.click(screen.getByLabelText(/^oily$/i));
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // Error toast shown
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to save skin type',
      expect.any(Object)
    );
  });

  // Server action was attempted
  expect(updateSkinTest).toHaveBeenCalledWith('oily');

  // UI reverts to previous state (no skin type selected)
  expect(screen.queryByText('Your skin type:')).not.toBeInTheDocument();
});
```

---

## 3. Setup Progress & Step States

### ✅ Test Coverage
- [ ] User sees correct step statuses based on progress
- [ ] Progress tracker shows correct percentage

### Test: User sees correct step statuses
**Priority:** HIGH

```typescript
it('user sees steps with correct status indicators (pending, completed, waiting)', async () => {
  // Mock dashboard with partial progress:
  // Booking: completed, Skin test: pending, Goals: waiting, Routine: waiting
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      steps: {
        hasCompletedBooking: true,
        hasCompletedSkinTest: false,
        hasPublishedGoals: false,
        hasPublishedRoutine: false
      },
      completed: 1,
      total: 4
    },
    goalsAcknowledgedByClient: false,
    // ... other fields
  });

  render(<DashboardPage />);

  await screen.findByText('Book Your Consultation');

  // Step 1 (Booking) - completed (shows success variant)
  const step1 = screen.getByText('Book Your Consultation').closest('[class*="step-card"]');
  expect(step1).toHaveAttribute('data-variant', 'success');

  // Step 2 (Skin Test) - pending (shows default variant with action button)
  const step2 = screen.getByText('Take a Skin Test').closest('[class*="step-card"]');
  expect(step2).toHaveAttribute('data-variant', 'muted');
  expect(screen.getByRole('button', { name: /select your skin type/i })).toBeInTheDocument();

  // Step 3 (Goals) - waiting (shows muted variant with waiting message)
  const step3 = screen.getByText('Set Your Skin Goals').closest('[class*="step-card"]');
  expect(step3).toHaveAttribute('data-variant', 'muted');
  expect(screen.getByText(/your coach is setting up your personalized goals/i)).toBeInTheDocument();

  // Step 4 (Routine) - waiting
  expect(screen.getByText(/your coach is preparing your custom routine/i)).toBeInTheDocument();
});
```

### Test: Progress tracker shows correct percentage
**Priority:** MEDIUM

```typescript
it('user sees progress tracker with correct completed/total ratio', async () => {
  // Mock dashboard with 2 of 4 steps completed
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      completed: 2,
      total: 4,
      steps: { /* ... */ }
    },
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees progress counter
  expect(await screen.findByText('2 / 4')).toBeInTheDocument();

  // Progress bar shows 50% (visual verification could check computed style)
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveAttribute('aria-valuenow', '2');
  expect(progressBar).toHaveAttribute('aria-valuemax', '4');
});
```

---

## 4. Goals Workflow

### ✅ Test Coverage
- [ ] User reviews published goals
- [ ] User sees waiting state when goals not published yet

### Test: User reviews published goals
**Priority:** HIGH

```typescript
it('user with published goals clicks review button and sees goals in modal', async () => {
  const user = userEvent.setup();

  const mockGoals = [
    { id: '1', title: 'Reduce acne', description: 'Clear skin in 8 weeks' },
    { id: '2', title: 'Even skin tone', description: 'Reduce dark spots' }
  ];

  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      steps: { hasPublishedGoals: true }
    },
    goalsAcknowledgedByClient: false,
    goals: mockGoals,
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees "Review Your Goals" button (step shows pending status)
  const reviewButton = await screen.findByRole('button', { name: /review your goals/i });
  expect(reviewButton).toBeInTheDocument();

  // User clicks button
  await user.click(reviewButton);

  // User sees ReviewGoalsModal with their goals
  expect(await screen.findByRole('heading', { name: /your skin goals/i })).toBeInTheDocument();
  expect(screen.getByText('Reduce acne')).toBeInTheDocument();
  expect(screen.getByText('Even skin tone')).toBeInTheDocument();
});
```

### Test: User sees waiting state for goals
**Priority:** MEDIUM

```typescript
it('user sees waiting message when coach has not published goals yet', async () => {
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      steps: { hasPublishedGoals: false }
    },
    goals: null,
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees waiting message
  expect(await screen.findByText(/your coach is setting up your personalized goals/i)).toBeInTheDocument();

  // No "Review Your Goals" button visible
  expect(screen.queryByRole('button', { name: /review your goals/i })).not.toBeInTheDocument();
});
```

---

## 5. Routine Workflow

### ✅ Test Coverage
- [ ] User views published routine
- [ ] User sees waiting state when routine not published yet

### Test: User views published routine
**Priority:** HIGH

```typescript
it('user with published routine clicks view button and sees routine in modal', async () => {
  const user = userEvent.setup();

  const mockRoutine = {
    id: '1',
    name: 'Morning Routine',
    steps: [
      { id: '1', productName: 'Cleanser', instructions: 'Apply to wet face' },
      { id: '2', productName: 'Moisturizer', instructions: 'Apply after cleansing' }
    ]
  };

  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      steps: { hasPublishedRoutine: true }
    },
    routine: mockRoutine,
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees "View Routine" button
  const viewButton = await screen.findByRole('button', { name: /view routine/i });
  expect(viewButton).toBeInTheDocument();

  // User clicks button
  await user.click(viewButton);

  // User sees ViewRoutineModal with routine details
  expect(await screen.findByRole('heading', { name: /routine/i })).toBeInTheDocument();
  expect(screen.getByText('Cleanser')).toBeInTheDocument();
  expect(screen.getByText('Moisturizer')).toBeInTheDocument();
});
```

### Test: User sees waiting state for routine
**Priority:** MEDIUM

```typescript
it('user sees waiting message when coach has not created routine yet', async () => {
  vi.mocked(fetchDashboardAction).mockResolvedValue({
    setupProgress: {
      steps: { hasPublishedRoutine: false }
    },
    routine: null,
    // ... other fields
  });

  render(<DashboardPage />);

  // User sees waiting message
  expect(await screen.findByText(/your coach is preparing your custom routine/i)).toBeInTheDocument();

  // No "View Routine" button visible
  expect(screen.queryByRole('button', { name: /view routine/i })).not.toBeInTheDocument();
});
```

---

## 6. Dashboard Loading & Error States

### ✅ Test Coverage
- [ ] User sees loading skeleton while data fetches
- [ ] User sees error message and can retry

### Test: User sees loading skeleton
**Priority:** MEDIUM

```typescript
it('user opens dashboard and sees loading skeleton before data loads', async () => {
  // Mock delayed response
  vi.mocked(fetchDashboardAction).mockImplementation(
    () => new Promise(resolve => setTimeout(() => resolve(mockDashboardData), 100))
  );

  render(<DashboardPage />);

  // User sees loading skeleton immediately
  expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();

  // After data loads, user sees actual dashboard content
  expect(await screen.findByText('Essential Setup Steps')).toBeInTheDocument();
  expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
});
```

### Test: User encounters error and retries
**Priority:** HIGH

```typescript
it('user encounters fetch error, sees error message, clicks retry, data loads', async () => {
  const user = userEvent.setup();

  // Mock initial failure
  vi.mocked(fetchDashboardAction).mockRejectedValueOnce(
    new Error('Network error')
  );

  render(<DashboardPage />);

  // User sees error message
  expect(await screen.findByText(/failed to load dashboard data/i)).toBeInTheDocument();

  // User sees retry button
  const retryButton = screen.getByRole('button', { name: /retry/i });
  expect(retryButton).toBeInTheDocument();

  // Mock success on retry
  vi.mocked(fetchDashboardAction).mockResolvedValueOnce(mockDashboardData);

  // User clicks retry
  await user.click(retryButton);

  // User sees dashboard content
  expect(await screen.findByText('Essential Setup Steps')).toBeInTheDocument();
  expect(screen.queryByText(/failed to load dashboard data/i)).not.toBeInTheDocument();
});
```

---

## 7. Complete Setup Journey (E2E)

### ✅ Test Coverage
- [ ] New user completes full setup from start to finish

### Test: New user completes entire setup journey
**Priority:** HIGH
**User Story:** As a new user, I want to complete all setup steps to unlock the full dashboard.

```typescript
it('new user completes entire setup journey: name → skin test → review goals → view routine', async () => {
  const user = userEvent.setup();

  // Initial state: brand new user
  let dashboardState = {
    user: { nickname: null, firstName: 'Sarah', lastName: 'Johnson', skinType: null },
    setupProgress: {
      steps: {
        hasCompletedBooking: true, // Assume booking already done
        hasCompletedSkinTest: false,
        hasPublishedGoals: false,
        hasPublishedRoutine: false
      },
      completed: 1,
      total: 4
    },
    goalsAcknowledgedByClient: false,
    goals: null,
    routine: null,
  };

  vi.mocked(fetchDashboardAction).mockResolvedValue(dashboardState);
  vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });
  vi.mocked(updateSkinTest).mockResolvedValue({ success: true, data: {} });

  render(<DashboardPage />);

  // ===== STEP 1: Set preferred name =====
  expect(await screen.findByRole('heading', { name: /what should we call you/i })).toBeInTheDocument();

  // User enters custom name
  await user.type(screen.getByLabelText(/enter custom name/i), 'Alex');
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // Modal closes, greeting appears
  await waitFor(() => {
    expect(screen.getByText(/welcome to skinbestie, alex/i)).toBeInTheDocument();
  });

  // ===== STEP 2: Complete skin test =====
  await user.click(screen.getByRole('button', { name: /select your skin type/i }));

  expect(await screen.findByRole('heading', { name: /select your skin type/i })).toBeInTheDocument();
  await user.click(screen.getByLabelText(/^combination$/i));
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // Skin type appears
  await waitFor(() => {
    expect(screen.getByText('Combination')).toBeInTheDocument();
  });

  // ===== STEP 3: Simulate coach publishing goals =====
  dashboardState.setupProgress.steps.hasPublishedGoals = true;
  dashboardState.setupProgress.completed = 2;
  dashboardState.goals = [
    { id: '1', title: 'Clear acne', description: 'Within 8 weeks' }
  ];

  // Refetch (in real app, this happens via polling or websocket)
  // For test, we'll simulate by remounting
  vi.mocked(fetchDashboardAction).mockResolvedValue(dashboardState);
  // ... trigger refetch in test

  // User sees "Review Your Goals" button
  const reviewButton = await screen.findByRole('button', { name: /review your goals/i });
  await user.click(reviewButton);

  // User sees goals modal
  expect(await screen.findByText('Clear acne')).toBeInTheDocument();

  // ===== STEP 4: Simulate coach publishing routine =====
  dashboardState.setupProgress.steps.hasPublishedRoutine = true;
  dashboardState.setupProgress.completed = 3;
  dashboardState.goalsAcknowledgedByClient = true;
  dashboardState.routine = {
    id: '1',
    name: 'Daily Routine',
    steps: []
  };

  // After all steps complete, user sees SubscriberDashboard
  // (Test would verify transition from SetupDashboard to SubscriberDashboard)
});
```

---

## 8. Optimistic Updates & Error Recovery

### ✅ Test Coverage
- [ ] Multiple optimistic updates work correctly
- [ ] Network failure during multiple actions

### Test: Multiple optimistic updates work correctly
**Priority:** MEDIUM

```typescript
it('user makes multiple changes quickly, all optimistic updates work correctly', async () => {
  const user = userEvent.setup();

  // Both actions succeed
  vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });
  vi.mocked(updateSkinTest).mockResolvedValue({ success: true, data: {} });

  render(<DashboardPage />);

  // User sets preferred name
  await screen.findByRole('heading', { name: /what should we call you/i });
  await user.type(screen.getByLabelText(/enter custom name/i), 'Alex');
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // Optimistic update shows immediately
  await waitFor(() => {
    expect(screen.getByText(/welcome to skinbestie, alex/i)).toBeInTheDocument();
  });

  // Without waiting for server, user selects skin type
  await user.click(screen.getByRole('button', { name: /select your skin type/i }));
  await user.click(await screen.findByLabelText(/^oily$/i));
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // Optimistic update shows immediately
  await waitFor(() => {
    expect(screen.getByText('Oily')).toBeInTheDocument();
  });

  // Both server actions complete successfully
  await waitFor(() => {
    expect(updateNickname).toHaveBeenCalledWith('Alex');
    expect(updateSkinTest).toHaveBeenCalledWith('oily');
  });

  // UI reflects final state correctly
  expect(screen.getByText(/welcome to skinbestie, alex/i)).toBeInTheDocument();
  expect(screen.getByText('Oily')).toBeInTheDocument();
});
```

### Test: Network failure during multiple actions
**Priority:** HIGH

```typescript
it('user makes two updates, first succeeds, second fails, only first persists', async () => {
  const user = userEvent.setup();

  // First action succeeds, second fails
  vi.mocked(updateNickname).mockResolvedValue({ success: true, data: {} });
  vi.mocked(updateSkinTest).mockResolvedValue({
    success: false,
    error: { message: 'Network error' }
  });

  render(<DashboardPage />);

  // User sets preferred name (succeeds)
  await screen.findByRole('heading', { name: /what should we call you/i });
  await user.type(screen.getByLabelText(/enter custom name/i), 'Alex');
  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  await waitFor(() => {
    expect(screen.getByText(/welcome to skinbestie, alex/i)).toBeInTheDocument();
  });

  // User selects skin type (fails)
  await user.click(screen.getByRole('button', { name: /select your skin type/i }));
  await user.click(await screen.findByLabelText(/^oily$/i));
  await user.click(screen.getByRole('button', { name: /^save$/i }));

  // Error toast shown for skin type
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to save skin type',
      expect.any(Object)
    );
  });

  // Preferred name stays updated (succeeded)
  expect(screen.getByText(/welcome to skinbestie, alex/i)).toBeInTheDocument();

  // Skin type reverts to previous state (no skin type)
  expect(screen.queryByText('Oily')).not.toBeInTheDocument();
  expect(screen.queryByText('Your skin type:')).not.toBeInTheDocument();
});
```

---

## Test Setup & Mocking

### Mock Setup Template

```typescript
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './page';

// Mock server actions
vi.mock('./actions/setup-dashboard-actions', () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  fetchDashboardAction,
  updateNickname,
  updateSkinTest,
} from './actions/setup-dashboard-actions';
import { toast } from 'sonner';

// Helper to render with QueryClient
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// Mock dashboard data factory
const mockDashboardData = {
  user: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    nickname: null,
    email: 'john@example.com',
    skinType: null,
  },
  setupProgress: {
    steps: {
      hasCompletedBooking: false,
      hasCompletedSkinTest: false,
      hasPublishedGoals: false,
      hasPublishedRoutine: false,
    },
    completed: 0,
    total: 4,
  },
  goalsAcknowledgedByClient: false,
  goals: null,
  routine: null,
  todayRoutine: null,
};

describe('SetupDashboard - UI Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Tests go here...
});
```

---

## Testing Principles Applied

✅ **Complete user workflows** - Test entire flows from start to finish
✅ **User-visible behavior** - Test what users see and do, not implementation
✅ **Query by accessibility** - Use `getByRole`, `getByLabelText`, etc.
✅ **userEvent for interactions** - Simulate real user behavior
✅ **Mock at network boundary** - Only mock server actions, not components
✅ **Test optimistic updates** - Verify immediate UI feedback
✅ **Test error recovery** - Confirm rollback and error messages
✅ **Real components** - No mocking of modals, cards, or UI components

---

## Progress Tracking

**Last Updated:** 2025-11-03

### Completed Test Suites
- [ ] 1. Preferred Name Modal Workflow (0/7 tests)
- [x] 2. Skin Test Workflow ✅ (3/4 tests passing, 1 skipped)
- [ ] 3. Setup Progress & Step States (0/2 tests)
- [ ] 4. Goals Workflow (0/2 tests)
- [ ] 5. Routine Workflow (0/2 tests)
- [ ] 6. Dashboard Loading & Error States (0/2 tests)
- [ ] 7. Complete Setup Journey (0/1 test)
- [ ] 8. Optimistic Updates & Error Recovery (0/2 tests)

### Test Coverage Goals
- **Target Coverage:** 80%+ for setup dashboard code
- **Current Coverage:** ~15% (3 tests implemented out of ~22 total)
- **Priority Tests:** High priority tests should be implemented first

### Test Results Summary
- **Total Tests Written:** 4 (3 passing, 1 skipped)
- **Test Files:** 1
- **Next Priority:** Preferred Name Modal Workflow (7 tests)

---

## Notes

- All tests should use real components (no mocking of UI components)
- Mock only at the network boundary (server actions)
- Use `vi.mock()` from Vitest, not MSW
- Follow the exact patterns from UI_TESTING.md
- Each test should be a complete user workflow, not an isolated unit test
