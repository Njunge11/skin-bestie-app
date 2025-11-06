# UI Structure Guide

**Last Updated**: November 2025

This document outlines our approach to organizing UI code in Next.js applications for maximum maintainability and developer experience.

---

## Core Philosophy

**"Collocate code by feature, not by type"**

Traditional approaches organize by technical type (components/, actions/, types/). We organize by **feature domain** instead. Related code lives together, making it easier to understand, modify, and test complete features.

---

## The Feature-Based Structure

### Traditional (❌ Don't Do This)

```
src/app/
├── components/
│   ├── goal-item.tsx
│   ├── goals-section.tsx
│   ├── routine-tabs.tsx
│   └── metric-card.tsx
├── actions/
│   ├── goal-actions.ts
│   ├── routine-actions.ts
│   └── stats-actions.ts
├── types/
│   ├── goal.types.ts
│   ├── routine.types.ts
│   └── stats.types.ts
└── helpers/
    ├── goal.helpers.ts
    └── routine.helpers.ts
```

**Problems:**
- Hard to find all related code for a feature
- Changes to one feature touch many directories
- Unclear what depends on what
- Difficult for new developers to navigate

### Feature-Based (✅ Do This)

```
src/app/(application)/dashboard/
├── shared/                    # Collocated features
│   ├── goals/                 # Everything goals-related
│   │   ├── index.ts           # Barrel export
│   │   ├── goal-actions.ts    # Server actions
│   │   ├── goal.types.ts      # TypeScript types
│   │   ├── goal.helpers.ts    # Helper functions
│   │   ├── goal-item.tsx      # UI component
│   │   └── goals-section.tsx  # UI component
│   ├── routine/               # Everything routine-related
│   │   ├── index.ts
│   │   ├── routine-step-actions.ts
│   │   ├── routine-item-card.tsx
│   │   └── routine-tabs.tsx
│   └── stats/                 # Everything stats-related
│       ├── index.ts
│       ├── stats-actions.ts
│       ├── metric-card.tsx
│       └── weekly-summary.tsx
├── components/                # Page-level shared only
└── hooks/                     # Shared hooks only
```

**Benefits:**
- All goal-related code in one place
- Easy to find everything for a feature
- Clear boundaries between features
- New developers can understand features quickly
- Changes are localized to feature directories

---

## Directory Structure Template

Use this template for any complex page or feature in your Next.js application:

```
src/app/(route-group)/feature-name/
├── __tests__/                 # Feature tests
│   ├── feature-workflow-1.test.tsx
│   └── feature-workflow-2.test.tsx
│
├── components/                # Page-level components ONLY
│   ├── page-header.tsx        # Used only by this page
│   ├── page-footer.tsx
│   └── index.ts               # Barrel export
│
├── hooks/                     # Page-level hooks ONLY
│   ├── use-feature-data.ts
│   └── index.ts
│
├── schemas/                   # Validation schemas
│   ├── feature.schema.ts
│   └── index.ts
│
├── shared/                    # 🌟 Feature domains (the magic!)
│   ├── domain-1/              # e.g., "goals", "products", "users"
│   │   ├── index.ts           # Barrel export
│   │   ├── domain-1-actions.ts        # Server actions
│   │   ├── domain-1.types.ts          # Types
│   │   ├── domain-1.helpers.ts        # Utilities
│   │   ├── domain-1-item.tsx          # Components
│   │   └── domain-1-section.tsx       # Components
│   │
│   ├── domain-2/              # e.g., "comments", "reviews"
│   │   ├── index.ts
│   │   ├── domain-2-actions.ts
│   │   └── domain-2-list.tsx
│   │
│   └── domain-3/              # e.g., "analytics", "reports"
│       ├── index.ts
│       ├── domain-3-actions.ts
│       └── domain-3-chart.tsx
│
├── view-1/                    # Different views/modes
│   ├── index.ts
│   ├── view-1.tsx             # Main component
│   ├── view-1-actions.ts      # View-specific actions
│   └── view-1-modal.tsx       # View-specific components
│
├── view-2/
│   ├── index.ts
│   ├── view-2.tsx
│   └── view-2-card.tsx
│
└── page.tsx                   # Main page component
```

---

## When to Use `shared/`

### ✅ Use `shared/` for:

**1. Feature Domains** - Logical groups of related functionality:
```
shared/
├── goals/          # Goal management
├── routine/        # Daily routine
├── products/       # Product catalog
├── reviews/        # User reviews
└── analytics/      # Analytics & stats
```

**2. When code is reused across multiple views/pages:**
```
shared/
├── comments/       # Used in posts AND profiles
├── notifications/  # Used in header AND settings
└── payments/       # Used in checkout AND billing
```

**3. When a feature has multiple concerns:**
```
shared/goals/
├── goal-actions.ts      # Server actions
├── goal.types.ts        # Type definitions
├── goal.helpers.ts      # Business logic
├── goal-item.tsx        # UI component
└── goals-section.tsx    # Container component
```

### ❌ Don't use `shared/` for:

**1. Page-specific components** → Use `components/`:
```
components/
├── page-header.tsx      # Only used by this page
├── page-skeleton.tsx    # Loading state for this page
└── page-footer.tsx      # Footer for this page
```

**2. Page-specific hooks** → Use `hooks/`:
```
hooks/
├── use-page-data.ts     # Fetches data for this page
└── use-page-state.ts    # Manages page-level state
```

**3. Single files with no related concerns** → Keep at top level or in appropriate folder

---

## Barrel Exports (index.ts)

Every `shared/` subdirectory and major feature should have an `index.ts` barrel export.

### Example: `shared/goals/index.ts`

```typescript
// Components
export { GoalItem } from "./goal-item";
export { GoalsSection } from "./goals-section";
export { ReviewGoalsModal } from "./review-goals-modal";

// Server Actions
export {
  createGoalAction,
  updateGoalAction,
  toggleGoalAction,
  deleteGoalAction,
  reorderGoalsAction,
  acknowledgeGoalsAction,
} from "./goal-actions";

// Types
export type { Goal, GoalFormData } from "./goal.types";

// Helpers
export { normalizeGoals } from "./goal.helpers";
```

### Benefits:

```typescript
// ✅ Clean imports
import { GoalsSection, createGoalAction, type Goal } from "../shared/goals";

// ❌ Messy imports (without barrel exports)
import { GoalsSection } from "../shared/goals/goals-section";
import { createGoalAction } from "../shared/goals/goal-actions";
import type { Goal } from "../shared/goals/goal.types";
```

---

## File Naming Conventions

### Components
- Use `kebab-case.tsx`
- Descriptive, feature-prefixed names
- Examples: `goal-item.tsx`, `routine-tabs.tsx`, `metric-card.tsx`

### Actions (Server Actions)
- Use `feature-actions.ts` pattern
- Examples: `goal-actions.ts`, `routine-step-actions.ts`, `stats-actions.ts`

### Types
- Use `feature.types.ts` pattern
- Examples: `goal.types.ts`, `routine.types.ts`, `user.types.ts`

### Helpers
- Use `feature.helpers.ts` pattern
- Examples: `goal.helpers.ts`, `date.helpers.ts`, `validation.helpers.ts`

### Schemas (Zod/Validation)
- Use `feature.schema.ts` pattern
- Examples: `goal.schema.ts`, `user.schema.ts`, `payment.schema.ts`

---

## Import Organization

### Import Order (within a file)

```typescript
// 1. External libraries
import { useState } from "react";
import { toast } from "sonner";

// 2. UI components (absolute imports)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 3. Relative imports - Features (from shared/)
import { GoalsSection, createGoalAction } from "../shared/goals";
import { RoutineTabs } from "../shared/routine";

// 4. Relative imports - Local
import { PageHeader } from "../components/page-header";
import { usePageData } from "../hooks/use-page-data";
import type { DashboardResponse } from "../schemas";
```

### Import Paths

**Prefer relative imports for feature code:**
```typescript
// ✅ Good - relative imports within feature
import { createGoalAction } from "../shared/goals";
import { RoutineTabs } from "../shared/routine";

// ❌ Avoid - absolute imports for features (harder to move/refactor)
import { createGoalAction } from "@/app/(application)/dashboard/shared/goals";
```

**Use absolute imports for shared UI components:**
```typescript
// ✅ Good - absolute imports for shared UI
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
```

---

## Testing Structure

Tests should mirror your feature structure:

```
__tests__/
├── domain-1-workflow.test.tsx     # Tests for domain-1 features
├── domain-2-workflow.test.tsx     # Tests for domain-2 features
└── view-1-workflow.test.tsx       # Tests for view-1 pages
```

### Test Naming Convention:
- `feature-workflow.test.tsx` for user workflow tests
- `feature-integration.test.tsx` for integration tests
- Match the feature/domain name

---

## Migration Guide

### Moving from Traditional to Feature-Based Structure

**Step 1: Identify Feature Domains**

Look at your components and group them by domain:
```
Current:                    Domains:
- goal-item.tsx        →   goals/
- goal-form.tsx        →   goals/
- goal-list.tsx        →   goals/
- product-card.tsx     →   products/
- product-grid.tsx     →   products/
- review-item.tsx      →   reviews/
```

**Step 2: Create `shared/` Directory Structure**

```bash
mkdir -p shared/goals
mkdir -p shared/products
mkdir -p shared/reviews
```

**Step 3: Move Files by Feature**

```bash
# Move all goal-related files
mv components/goal-*.tsx shared/goals/
mv actions/goal-actions.ts shared/goals/
mv types/goal.types.ts shared/goals/
mv helpers/goal.helpers.ts shared/goals/
```

**Step 4: Create Barrel Exports**

Create `shared/goals/index.ts`:
```typescript
export { GoalItem } from "./goal-item";
export { GoalForm } from "./goal-form";
export { createGoalAction } from "./goal-actions";
export type { Goal } from "./goal.types";
```

**Step 5: Update All Imports**

```typescript
// Before
import { GoalItem } from "@/components/goal-item";
import { createGoalAction } from "@/actions/goal-actions";
import type { Goal } from "@/types/goal.types";

// After
import { GoalItem, createGoalAction, type Goal } from "../shared/goals";
```

**Step 6: Run Tests**

```bash
npm test
```

**Step 7: Clean Up Empty Directories**

```bash
# Remove old empty directories
rm -rf actions/
rm -rf types/
```

---

## Real-World Example: Dashboard Feature

### Before Refactoring:

```
dashboard/
├── components/
│   ├── subscriber-dashboard/
│   │   ├── goal-item.tsx
│   │   ├── goals-section.tsx
│   │   ├── routine-tabs.tsx
│   │   ├── routine-item-card.tsx
│   │   ├── metric-card.tsx
│   │   └── weekly-summary.tsx
│   └── setup-dashboard/
│       └── ...
├── actions/
│   ├── goal-actions.ts
│   ├── routine-step-actions.ts
│   └── stats-actions.ts
└── features/
    └── goals/
        ├── types/
        └── helpers/
```

**Problems:**
- Goal code scattered across 4 directories
- Hard to find all routine-related code
- Unclear dependencies between features

### After Refactoring:

```
dashboard/
├── shared/                    # ✨ All features collocated
│   ├── goals/
│   │   ├── index.ts
│   │   ├── goal-actions.ts
│   │   ├── goal.types.ts
│   │   ├── goal.helpers.ts
│   │   ├── goal-item.tsx
│   │   ├── goals-section.tsx
│   │   └── review-goals-modal.tsx
│   ├── routine/
│   │   ├── index.ts
│   │   ├── routine-step-actions.ts
│   │   ├── routine-item-card.tsx
│   │   └── routine-tabs.tsx
│   └── stats/
│       ├── index.ts
│       ├── stats-actions.ts
│       ├── metric-card.tsx
│       └── weekly-summary.tsx
├── setup-dashboard/           # Setup flow
│   └── ...
├── subscriber-dashboard/      # Active user view
│   └── ...
└── components/                # Page-level only
    └── ...
```

**Benefits:**
- All goal code in one place (`shared/goals/`)
- Easy to find and modify features
- Clear feature boundaries
- Simple, clean imports

---

## Decision Tree: Where Should This Code Go?

```
Is it reused across multiple views/pages?
  YES → Is it a feature domain (goals, products, etc.)?
    YES → shared/feature-name/
    NO  → Is it a UI component?
      YES → components/
      NO  → Is it a hook?
        YES → hooks/
        NO  → schemas/ or top-level

  NO  → Is it specific to one view?
    YES → view-name/
    NO  → Is it page-level shared?
      YES → components/ or hooks/
      NO  → Top-level
```

---

## Best Practices

### 1. Keep Features Independent

```typescript
// ✅ Good - Goals feature doesn't import from Routine
shared/goals/
  ├── goal-actions.ts        // No imports from ../routine

// ❌ Bad - Circular dependencies
shared/goals/
  ├── goal-actions.ts        // imports from ../routine
shared/routine/
  ├── routine-actions.ts     // imports from ../goals
```

### 2. Use Barrel Exports Consistently

```typescript
// ✅ Good - Import from feature root
import { GoalsSection, createGoalAction } from "../shared/goals";

// ❌ Bad - Deep imports bypass barrel
import { GoalsSection } from "../shared/goals/goals-section";
import { createGoalAction } from "../shared/goals/goal-actions";
```

### 3. Colocate Tests with Features

```typescript
// ✅ Good - Tests near the code they test
__tests__/
  ├── goals-workflow.test.tsx      // Tests goals feature
  ├── routine-workflow.test.tsx    // Tests routine feature
  └── stats-workflow.test.tsx      // Tests stats feature

// ❌ Bad - All tests in one file
__tests__/
  └── dashboard.test.tsx            // 5000 lines testing everything
```

### 4. Prefix Feature Files Consistently

```typescript
// ✅ Good - Clear feature prefix
shared/goals/
  ├── goal-actions.ts
  ├── goal.types.ts
  ├── goal.helpers.ts
  └── goal-item.tsx

// ❌ Bad - Inconsistent naming
shared/goals/
  ├── actions.ts          // Unclear what feature
  ├── types.ts            // Could be anything
  └── item.tsx            // Item for what?
```

### 5. Keep `components/` Minimal

```typescript
// ✅ Good - Only page-level shared components
components/
  ├── page-header.tsx
  ├── dashboard-skeleton.tsx
  └── progress-tracker.tsx

// ❌ Bad - Feature components in components/
components/
  ├── goal-item.tsx          // Should be in shared/goals/
  ├── routine-card.tsx       // Should be in shared/routine/
  └── metric-display.tsx     // Should be in shared/stats/
```

---

## Common Patterns

### Pattern 1: Feature with Actions + UI

```
shared/feature-name/
├── index.ts                    # Barrel export
├── feature-name-actions.ts     # Server actions (CRUD)
├── feature-name.types.ts       # Type definitions
├── feature-name-item.tsx       # Individual item component
└── feature-name-section.tsx    # List/container component
```

**Example:**
```
shared/products/
├── index.ts
├── product-actions.ts          # createProduct, updateProduct, etc.
├── product.types.ts            # Product, ProductFormData types
├── product-card.tsx            # Display single product
└── product-grid.tsx            # Display product list
```

### Pattern 2: Feature with Helpers + Types

```
shared/feature-name/
├── index.ts
├── feature-name.types.ts       # Complex types
├── feature-name.helpers.ts     # Business logic
└── feature-name-validator.ts   # Validation logic
```

**Example:**
```
shared/payments/
├── index.ts
├── payment.types.ts            # PaymentMethod, Transaction types
├── payment.helpers.ts          # calculateTotal, formatCurrency
└── payment-validator.ts        # validateCard, validateAmount
```

### Pattern 3: View-Specific Components

```
view-name/
├── index.ts                    # Barrel export
├── view-name.tsx               # Main view component
├── view-name-actions.ts        # View-specific actions
├── view-name-modal.tsx         # View-specific modal
└── view-name-card.tsx          # View-specific component
```

**Example:**
```
setup-dashboard/
├── index.ts
├── setup-dashboard.tsx         # Main setup view
├── setup-dashboard-actions.ts  # Setup-specific actions
├── skin-test-modal.tsx         # Setup-specific modal
└── step-card.tsx               # Setup-specific card
```

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Deep Nesting

```
// Bad - Too many levels
shared/
  └── goals/
      └── components/
          └── items/
              └── goal-item.tsx

// Good - Flat structure
shared/
  └── goals/
      ├── goal-item.tsx
      └── goals-section.tsx
```

### ❌ Anti-Pattern 2: Generic Names

```
// Bad - Unclear what feature this belongs to
shared/
  └── management/
      ├── item.tsx
      ├── list.tsx
      └── actions.ts

// Good - Clear feature names
shared/
  └── goals/
      ├── goal-item.tsx
      ├── goals-section.tsx
      └── goal-actions.ts
```

### ❌ Anti-Pattern 3: Mixing Concerns

```
// Bad - Mixing unrelated features
shared/
  └── dashboard-stuff/
      ├── goal-item.tsx
      ├── routine-card.tsx
      └── metric-display.tsx

// Good - Separate by feature
shared/
  ├── goals/
  │   └── goal-item.tsx
  ├── routine/
  │   └── routine-card.tsx
  └── stats/
      └── metric-display.tsx
```

### ❌ Anti-Pattern 4: Over-Abstraction

```
// Bad - Unnecessary abstraction layers
shared/
  └── goals/
      └── core/
          └── base/
              └── abstract/
                  └── goal-item.tsx

// Good - Simple structure
shared/
  └── goals/
      └── goal-item.tsx
```

---

## FAQ

### Q: When should I create a new feature in `shared/`?

**A:** Create a new feature when:
1. You have 3+ related files (actions, types, components)
2. The feature is reused across multiple pages/views
3. The feature represents a distinct domain concept (goals, products, users, etc.)

### Q: Can features in `shared/` import from each other?

**A:** Generally avoid it. Features should be independent. If Feature A needs Feature B, consider:
1. Are they actually the same feature? Merge them.
2. Is there shared logic? Extract to a separate utility/helper.
3. Is it truly a dependency? Document it clearly.

### Q: What's the difference between `components/` and `shared/`?

**A:**
- `components/` = Page-level UI components (header, skeleton, etc.)
- `shared/` = Feature domains with actions + types + components

### Q: Should I always use barrel exports?

**A:** Yes, for `shared/` features. It makes imports cleaner and easier to refactor.

### Q: How do I handle shared utilities used by multiple features?

**A:** Create a `lib/` or `utils/` directory at the root level:
```
src/
├── app/
└── lib/
    ├── date.helpers.ts
    ├── format.helpers.ts
    └── validation.helpers.ts
```

### Q: What if my feature has sub-features?

**A:** Keep it flat. Add prefixes instead:
```
// Avoid nested features
shared/
  └── goals/
      └── recurring/

// Use prefixes instead
shared/goals/
  ├── goal-item.tsx
  ├── recurring-goal-item.tsx
  ├── goal-actions.ts
  └── recurring-goal-actions.ts
```

---

## Key Takeaways

1. **Organize by feature domain, not technical type**
2. **Use `shared/` for reusable feature modules**
3. **Keep page-specific code in view folders**
4. **Create barrel exports for clean imports**
5. **Keep features independent**
6. **Colocate related code (actions + types + components)**
7. **Use consistent naming conventions**
8. **Avoid deep nesting and over-abstraction**

---

## Additional Resources

- [Testing Guide](./UI_TESTING.md) - How to test this structure
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Kent C. Dodds: Colocation](https://kentcdodds.com/blog/colocation)

---

**Remember**: This structure should make your life easier, not harder. If a pattern doesn't work for your use case, adapt it. The goal is **clarity and maintainability**, not rigid rules.
