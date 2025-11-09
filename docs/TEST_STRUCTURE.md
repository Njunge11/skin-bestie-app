# Test Structure Guidelines

This document outlines the standard structure for organizing UI tests in this project.

---

## Core Principles

1. **Tests live alongside features** - Tests are in a `__tests__` directory within the feature folder
2. **Helpers are reusable** - Shared utilities, mocks, and factories reduce duplication
3. **One test file per workflow** - Each test file focuses on a specific user workflow (e.g., create, edit, delete)
4. **Mock at the network boundary** - Only mock server actions, not React components or hooks

---

## Directory Structure

```
src/app/(application)/[feature-name]/
├── __tests__/
│   ├── [workflow-name].test.tsx           # Main test file (e.g., create-journal-entry.test.tsx)
│   ├── helpers/
│   │   ├── render-helpers.tsx             # Custom render functions with providers
│   │   ├── mock-factories.tsx             # Mock data factory functions
│   │   └── test-utils.tsx                 # Shared test utilities
│   └── mocks/
│       └── [feature]-actions.mock.ts      # Mocked server actions
├── actions/
│   └── [feature]-actions.ts               # Server actions (to be mocked)
├── hooks/
│   └── use-[feature].ts                   # Custom hooks
├── components/
│   └── [component].tsx                    # Feature components
├── stores/
│   └── use-[store].ts                     # Zustand stores
└── page.tsx                                # Route page
```

---

## File Purposes

### **1. Test File** (`__tests__/[workflow-name].test.tsx`)

Main test file containing all test cases for a specific workflow.

**Structure:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFeaturePage } from './helpers/render-helpers';
import { createMockData } from './helpers/mock-factories';
import { setupActionMocks } from './mocks/feature-actions.mock';

// Mock server actions at module level
vi.mock('../actions/feature-actions', () => ({
  createAction: mockCreateAction,
  updateAction: mockUpdateAction,
  fetchAction: mockFetchAction,
}));

describe('Feature Name - UI Tests', () => {
  beforeEach(() => {
    setupActionMocks();
  });

  describe('Workflow Category 1', () => {
    it('complete user workflow test 1', async () => {
      // Test implementation
    });

    it('complete user workflow test 2', async () => {
      // Test implementation
    });
  });

  describe('Workflow Category 2', () => {
    it('complete user workflow test 3', async () => {
      // Test implementation
    });
  });
});
```

**Naming Convention:**
- Test files: `[workflow-name].test.tsx` (e.g., `create-journal-entry.test.tsx`)
- Use kebab-case for file names
- Describe blocks: Group related workflows together
- Test names: Start with "user" and describe the complete workflow

---

### **2. Render Helpers** (`__tests__/helpers/render-helpers.tsx`)

Custom render functions that wrap components with required providers.

**Purpose:**
- Provide consistent test setup
- Wrap with QueryClientProvider, Router context, etc.
- Reduce boilerplate in test files

**Example:**
```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

export function renderJournalPage(options = {}) {
  const JournalPage = require('../page').default;
  return renderWithProviders(<JournalPage />, options);
}

export function renderJournalDetailPage(params: { id: string }, options = {}) {
  const JournalDetailPage = require('../[id]/page').default;

  // Mock the params prop
  const mockParams = Promise.resolve(params);

  return renderWithProviders(
    <JournalDetailPage params={mockParams} />,
    options
  );
}
```

---

### **3. Mock Factories** (`__tests__/helpers/mock-factories.tsx`)

Factory functions to create mock data with sensible defaults.

**Purpose:**
- Generate consistent mock data
- Allow easy customization via overrides
- Reduce test setup code

**Example:**
```typescript
import type { Journal } from '../actions/journal-actions';

export const createMockJournal = (
  overrides?: Partial<Journal>
): Journal => ({
  id: crypto.randomUUID(),
  title: "Untitled Journal Entry",
  content: "",
  createdBy: {
    id: "user-1",
    name: "Test User",
  },
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  tags: [],
  ...overrides,
});

export const createMockJournalList = (count: number): Journal[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockJournal({
      id: `journal-${i}`,
      title: `Journal Entry ${i}`,
      createdAt: new Date(Date.now() - i * 1000).toISOString(),
    })
  );
};

export const createMockLexicalContent = (text: string): string => {
  return JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
};
```

**Guidelines:**
- Use `crypto.randomUUID()` for unique IDs
- Provide sensible defaults
- Allow full override via spread operator
- Export typed factory functions

---

### **4. Test Utils** (`__tests__/helpers/test-utils.tsx`)

Shared utility functions for common test operations.

**Purpose:**
- Encapsulate repetitive test logic
- Provide semantic helpers
- Improve test readability

**Example:**
```typescript
import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

// Waiting utilities
export async function waitForJournalToAppear(title: string) {
  return await screen.findByText(new RegExp(title, 'i'));
}

export async function waitForToast(message: string) {
  return await screen.findByText(new RegExp(message, 'i'));
}

// Element getters
export function getAddEntryButton() {
  return screen.getByRole('button', { name: /add new journal entry/i });
}

export function getTitleInput() {
  return screen.getByRole('textbox', { name: /title/i });
}

// User actions
export async function createJournalEntry(user: UserEvent) {
  const button = getAddEntryButton();
  await user.click(button);
  await waitFor(() => {
    expect(screen.getByText(/untitled journal entry/i)).toBeInTheDocument();
  });
}

export async function typeTitle(user: UserEvent, title: string) {
  const titleInput = getTitleInput();
  await user.clear(titleInput);
  await user.type(titleInput, title);
}
```

**Guidelines:**
- Prefix async functions with "waitFor" or action verb
- Use semantic names (e.g., `createJournalEntry` not `clickButton`)
- Keep utilities feature-specific (avoid generic "clickButton" helpers)

---

### **5. Mock Server Actions** (`__tests__/mocks/[feature]-actions.mock.ts`)

Centralized mocking for server actions.

**Purpose:**
- Single source of truth for mock behavior
- Easy to configure different scenarios
- Clean test setup

**Example:**
```typescript
import { vi } from 'vitest';
import { createMockJournal } from '../helpers/mock-factories';
import type { Result } from '../../actions/journal-actions';

// Export mocked functions
export const mockCreateJournalAction = vi.fn();
export const mockUpdateJournalAction = vi.fn();
export const mockFetchJournalsAction = vi.fn();
export const mockFetchJournalAction = vi.fn();
export const mockDeleteJournalAction = vi.fn();

// Setup function for default behavior
export function setupJournalActionMocks() {
  vi.clearAllMocks();

  // Default: successful creation
  mockCreateJournalAction.mockResolvedValue({
    success: true,
    data: createMockJournal(),
  });

  // Default: empty list
  mockFetchJournalsAction.mockResolvedValue({
    success: true,
    data: [],
  });

  // Default: successful fetch
  mockFetchJournalAction.mockResolvedValue({
    success: true,
    data: createMockJournal(),
  });

  // Default: successful update
  mockUpdateJournalAction.mockResolvedValue({
    success: true,
    data: createMockJournal(),
  });

  // Default: successful delete
  mockDeleteJournalAction.mockResolvedValue({
    success: true,
    data: undefined,
  });
}

// Scenario helpers for common test cases
export function mockCreateFailure(errorMessage = 'Failed to create journal') {
  mockCreateJournalAction.mockResolvedValue({
    success: false,
    error: { message: errorMessage, code: 'CREATE_FAILED' },
  });
}

export function mockFetchWithEntries(count: number) {
  const entries = Array.from({ length: count }, (_, i) =>
    createMockJournal({ id: `journal-${i}`, title: `Entry ${i}` })
  );

  mockFetchJournalsAction.mockResolvedValue({
    success: true,
    data: entries,
  });
}
```

**Guidelines:**
- Export individual mock functions
- Provide a `setup` function for default behavior
- Create scenario helpers for common test cases
- Always call `vi.clearAllMocks()` in setup

---

## Test Organization

### **Describe Blocks**

Organize tests into logical groups:

```typescript
describe('Feature Name - UI Tests', () => {
  describe('Basic Workflows', () => {
    // Happy path tests
  });

  describe('Content Editing', () => {
    // Editing-related tests
  });

  describe('Error Handling', () => {
    // Error and recovery tests
  });

  describe('Edge Cases', () => {
    // Edge cases and special scenarios
  });
});
```

### **Test Naming**

Follow this pattern:
```typescript
it('user [action], [expected result]', async () => {
  // Test implementation
});
```

**Examples:**
- ✅ `it('user creates journal entry, entry appears in sidebar', async () => {})`
- ✅ `it('user edits title, sidebar updates with new title', async () => {})`
- ❌ `it('should create entry', async () => {})` - Not user-centric
- ❌ `it('createJournalAction is called', async () => {})` - Testing implementation

---

## Example: Complete Test File

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderJournalPage } from './helpers/render-helpers';
import { createMockJournal } from './helpers/mock-factories';
import {
  setupJournalActionMocks,
  mockCreateJournalAction,
  mockCreateFailure,
} from './mocks/journal-actions.mock';
import { getAddEntryButton, waitForJournalToAppear } from './helpers/test-utils';

// Mock server actions
vi.mock('../actions/journal-actions', () => ({
  createJournalAction: mockCreateJournalAction,
  updateJournalAction: vi.fn(),
  fetchJournalsAction: vi.fn(),
}));

describe('Journal Entry Creation - UI Tests', () => {
  beforeEach(() => {
    setupJournalActionMocks();
  });

  describe('Basic Creation Flows', () => {
    it('user creates new journal entry from main page, entry appears in sidebar', async () => {
      const user = userEvent.setup();

      // Render page
      renderJournalPage();

      // User clicks "Add new journal entry"
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Entry appears in sidebar
      expect(await waitForJournalToAppear('Untitled Journal Entry')).toBeInTheDocument();

      // Server action was called
      expect(mockCreateJournalAction).toHaveBeenCalledWith({
        title: 'Untitled Journal Entry',
        content: '',
        tags: [],
      });
    });
  });

  describe('Error Handling', () => {
    it('user clicks add entry, creation fails, error shown, retry succeeds', async () => {
      const user = userEvent.setup();

      // Setup failure then success
      mockCreateFailure('Network error');

      renderJournalPage();

      // First attempt fails
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Error toast appears
      expect(await screen.findByText(/network error/i)).toBeInTheDocument();

      // No entry in sidebar
      expect(screen.queryByText('Untitled Journal Entry')).not.toBeInTheDocument();

      // Setup success for retry
      setupJournalActionMocks();

      // Retry
      await user.click(addButton);

      // Entry appears
      expect(await waitForJournalToAppear('Untitled Journal Entry')).toBeInTheDocument();
    });
  });
});
```

---

## Best Practices

### ✅ DO

- **Use render helpers** - Always use custom render functions with providers
- **Use factories** - Generate mock data with factories, not inline objects
- **Group related tests** - Use describe blocks to organize workflows
- **Test complete workflows** - Each test should be a full user journey
- **Mock at boundaries** - Only mock server actions, not React internals
- **Use semantic helpers** - Create helpers like `createJournalEntry()` not `clickButton()`
- **Clean up** - Call `vi.clearAllMocks()` in `beforeEach`

### ❌ DON'T

- **Don't mock components** - Use real React components
- **Don't test implementation** - Test user-visible behavior only
- **Don't create generic helpers** - Keep helpers feature-specific
- **Don't skip cleanup** - Always reset mocks between tests
- **Don't inline complex data** - Use factories for mock data
- **Don't test isolated units** - Focus on complete user workflows

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test create-journal-entry

# Run tests in watch mode
npm test:watch

# Run with coverage
npm test:coverage
```

---

## Resources

- [UI Testing Guidelines](./UI_TESTING.md) - Kent C. Dodds principles
- [React Testing Library](https://testing-library.com/react)
- [Vitest](https://vitest.dev/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

---

## Summary

This structure provides:
- **Consistency** - All features follow the same pattern
- **Reusability** - Helpers reduce duplication
- **Maintainability** - Changes in one place affect all tests
- **Readability** - Tests are easy to understand
- **Scalability** - Easy to add new test files and workflows
