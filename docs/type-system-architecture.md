# Type System Architecture

A comprehensive guide to organizing TypeScript types and Zod schemas in this Next.js application.

## Philosophy

### Core Principles

1. **Runtime Safety First**: TypeScript types disappear at runtime. External API responses require runtime validation.
2. **Single Source of Truth**: Define Zod schemas once, infer TypeScript types from them.
3. **Collocation**: Types should live close to the code that uses them.
4. **Shared vs. Local**: Shared entities live globally, feature-specific schemas live with features.

### Why Zod?

- **Runtime Validation**: Catches API contract changes immediately at runtime
- **Type Inference**: No duplicate type definitions - types are inferred from schemas
- **Self-Documenting**: Schemas serve as living documentation of data contracts
- **Error Handling**: `safeParse` provides structured, actionable error information
- **Safety**: Protects against malformed data from external sources (APIs, user input, etc.)

---

## Directory Structure

### Overview

```
src/
├── lib/
│   └── schemas/                      # GLOBAL shared schemas
│       ├── user.schema.ts           # User entity (used across app)
│       ├── goal.schema.ts           # Goal entity (used in multiple features)
│       ├── common.schema.ts         # Common patterns (pagination, errors)
│       └── index.ts                 # Re-exports
└── app/
    └── (application)/
        └── [feature]/               # e.g., dashboard, journal, profile
            ├── actions/
            ├── components/
            ├── hooks/
            ├── schemas/              # FEATURE-SPECIFIC schemas
            │   ├── [feature].schema.ts
            │   └── index.ts
            └── types/                # FEATURE-SPECIFIC non-API types (optional)
                └── index.ts
```

### Decision Matrix: Where Should Types Go?

| Type Category | Location | Example |
|--------------|----------|---------|
| **Shared Entity** (used in 2+ features) | `src/lib/schemas/` | User, Goal, Routine |
| **Feature-Specific API Response** | `src/app/(application)/[feature]/schemas/` | DashboardResponse, JournalEntry |
| **Component Props** | Same file as component or `[feature]/types/` | SetupDashboardProps |
| **UI-Only Types** | `[feature]/types/` | ModalState, FormData |
| **Common Patterns** | `src/lib/schemas/common.schema.ts` | Pagination, ApiError |

---

## Implementation Patterns

### 1. Global Shared Schema

**File**: `src/lib/schemas/user.schema.ts`

```typescript
import { z } from "zod";

/**
 * User entity schema
 * Used across: Dashboard, Profile, Journal, Goals
 */
export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  dateOfBirth: z.string().datetime(),
  nickname: z.string().nullable(),
  skinType: z.array(z.string()).nullable(),
  concerns: z.array(z.string()).nullable(),
  hasAllergies: z.boolean(),
  allergyDetails: z.string().nullable(),
  isSubscribed: z.boolean(),
  occupation: z.string().nullable(),
  bio: z.string().nullable(),
  timezone: z.string(),
});

// Export inferred type
export type User = z.infer<typeof userSchema>;
```

**File**: `src/lib/schemas/index.ts`

```typescript
// Re-export all global schemas
export * from "./user.schema";
export * from "./goal.schema";
export * from "./common.schema";
```

---

### 2. Feature-Specific Schema (Composition)

**File**: `src/app/(application)/dashboard/schemas/dashboard.schema.ts`

```typescript
import { z } from "zod";
import { userSchema, goalSchema } from "@/lib/schemas"; // Import shared

/**
 * Dashboard-specific setup progress schema
 * Only used in dashboard feature
 */
export const setupProgressSchema = z.object({
  percentage: z.number(),
  completed: z.number(),
  total: z.number(),
  steps: z.object({
    hasCompletedSkinTest: z.boolean(),
    hasPublishedGoals: z.boolean(),
    hasPublishedRoutine: z.boolean(),
    hasCompletedBooking: z.boolean(),
  }),
});

/**
 * Dashboard API response schema
 * Composes global schemas (user, goal) with local schemas (setupProgress)
 */
export const dashboardResponseSchema = z.object({
  user: userSchema,                    // Global schema
  goals: z.array(goalSchema),          // Global schema
  setupProgress: setupProgressSchema,  // Local schema
  goalsAcknowledgedByClient: z.boolean(),
  todayRoutine: z.unknown().nullable(), // Define when structure is known
  catchupSteps: z.unknown().nullable(),
  routine: z.unknown().nullable(),
});

// Export inferred types
export type SetupProgress = z.infer<typeof setupProgressSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
```

**File**: `src/app/(application)/dashboard/schemas/index.ts`

```typescript
// Re-export dashboard schemas
export * from "./dashboard.schema";
```

---

### 3. Using Schemas in Server Actions

**File**: `src/app/(application)/dashboard/actions/setup-dashboard-actions.ts`

```typescript
import { dashboardResponseSchema, type DashboardResponse } from "../schemas";

export async function fetchDashboardAction(): Promise<DashboardResponse> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dashboard`, {
      headers: {
        "x-api-key": process.env.API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Runtime validation at API boundary
    const result = dashboardResponseSchema.safeParse(data);

    if (!result.success) {
      console.error("Dashboard API validation failed:", result.error.errors);
      throw new Error("Invalid dashboard data received from API");
    }

    // ✅ Fully type-safe data
    return result.data;
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    throw error;
  }
}
```

---

### 4. Component-Specific Types

**File**: `src/app/(application)/dashboard/components/setup-dashboard.tsx`

```typescript
import { type DashboardResponse } from "../schemas";

// Component-specific type (not from API)
interface SetupDashboardProps {
  dashboard: DashboardResponse;
  setOptimisticNickname: (nickname: string) => void;
  optimisticSkinTest: { completed: boolean; skinType: string | null };
  setOptimisticSkinTest: (update: {
    completed: boolean;
    skinType: string | null;
  }) => void;
}

export function SetupDashboard({ dashboard, ... }: SetupDashboardProps) {
  // Component implementation
}
```

---

## Best Practices

### ✅ DO

1. **Validate at API boundaries** - Always use `safeParse` when receiving external data
2. **Use type inference** - Avoid declaring separate interfaces; use `z.infer<typeof schema>`
3. **Prefer safeParse over parse** - Get structured errors without try/catch
4. **Make nullable fields explicit** - Use `.nullable()` or `.optional()` appropriately
5. **Compose schemas** - Reuse global schemas in feature-specific schemas
6. **Document schemas** - Add JSDoc comments explaining what each schema represents
7. **Version unknown structures** - Use `z.unknown()` for fields with undefined structure, add TODO to define later

### ❌ DON'T

1. **Don't use `any`** - Eliminates type safety; use `z.unknown()` instead
2. **Don't duplicate schemas** - Extract shared schemas to global location
3. **Don't validate trusted data** - If validated at boundary, trust it downstream
4. **Don't use `parse` in production** - Prefer `safeParse` for better error handling
5. **Don't forget runtime validation** - TypeScript types don't exist at runtime
6. **Don't over-validate** - Validate once at the API boundary, not everywhere

---

## Error Handling Pattern

```typescript
export async function fetchData(): Promise<DataResponse> {
  const response = await fetch(url);
  const data = await response.json();

  const result = dataSchema.safeParse(data);

  if (!result.success) {
    // Log detailed errors for debugging
    console.error("Validation failed:", {
      errors: result.error.errors,
      receivedData: data,
    });

    // Throw user-friendly error
    throw new Error("Received invalid data from API");
  }

  return result.data;
}
```

---

## Migration Guide

### Converting Existing Types to Zod

**Before** (TypeScript only):
```typescript
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export async function fetchUser(): Promise<User> {
  const response = await fetch(url);
  return response.json() as User; // ❌ No runtime validation
}
```

**After** (Zod):
```typescript
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

export async function fetchUser(): Promise<User> {
  const response = await fetch(url);
  const data = await response.json();

  const result = userSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid user data");
  }

  return result.data; // ✅ Runtime validated
}
```

---

## Common Patterns

### Pagination Response

**File**: `src/lib/schemas/common.schema.ts`

```typescript
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    pagination: paginationSchema,
  });
}

export type Pagination = z.infer<typeof paginationSchema>;
```

**Usage**:
```typescript
import { createPaginatedSchema } from "@/lib/schemas/common.schema";
import { goalSchema } from "@/lib/schemas";

const paginatedGoalsSchema = createPaginatedSchema(goalSchema);
type PaginatedGoalsResponse = z.infer<typeof paginatedGoalsSchema>;
```

### API Error Response

**File**: `src/lib/schemas/common.schema.ts`

```typescript
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
```

---

## Performance Considerations

### When to Validate

✅ **Always validate:**
- External API responses
- User input from forms
- Data from third-party services
- Environment variables
- Configuration files

❌ **Don't validate:**
- Data already validated at the boundary
- Internal function parameters (use TypeScript types)
- Static/hardcoded data

### Optimization Tips

1. **Validate once at boundaries** - Don't re-validate data that's already been validated
2. **Use lazy validation** - For large datasets, consider validating on-demand
3. **Cache schemas** - Define schemas at module level, not inside functions
4. **Profile performance** - In high-throughput scenarios, measure validation overhead

---

## Testing with Zod Schemas

```typescript
import { describe, it, expect } from "vitest";
import { userSchema } from "@/lib/schemas";

describe("userSchema", () => {
  it("should validate correct user data", () => {
    const validUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      // ... other required fields
    };

    const result = userSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidUser = {
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
    };

    const result = userSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});
```

---

## Summary

**Key Takeaways:**

1. **Use Zod for runtime validation** at all API boundaries
2. **Collocate feature-specific schemas** with feature code
3. **Share common entities** in `src/lib/schemas/`
4. **Compose schemas** - reuse global schemas in feature schemas
5. **Always use `safeParse`** for better error handling
6. **Infer types** - never duplicate type definitions
7. **Document with JSDoc** - explain what each schema represents

This architecture provides:
- ✅ Runtime safety
- ✅ Type inference (DRY)
- ✅ Better error handling
- ✅ Self-documenting code
- ✅ Scalable organization
- ✅ Feature isolation

---

## Resources

- [Zod Documentation](https://zod.dev/)
- [Zod Best Practices 2025](https://javascript.plainenglish.io/9-best-practices-for-using-zod-in-2025-31ee7418062e)
- [Building Robust API Clients with TypeScript and Zod](https://leapcell.io/blog/building-robust-api-clients-with-typescript-and-zod)
- [Type-Safe APIs with TypeScript & Zod](https://medium.com/@2nick2patel2/type-safe-apis-with-typescript-5-zod-trpc-1db8d89fe1e9)
