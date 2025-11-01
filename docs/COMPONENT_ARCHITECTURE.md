# Component Architecture Guide

This document defines our pragmatic component architecture using **shadcn/ui as our foundation** to ensure consistency, reusability, and maintainability across the codebase.

## Philosophy

**We don't reinvent the wheel.** shadcn/ui already provides excellent building blocks (Button, Card, Badge, etc.). Our job is to compose them into feature-specific components, not create abstraction layers.

## Component Structure

We organize components into two simple levels:
1. **shadcn/ui components** - Our foundation (`components/ui/`)
2. **Colocated components** - Components live next to the routes that use them (`app/[route]/components/`)

## Hierarchy Levels

### 1. shadcn/ui Components (Foundation)

**What they are**: Pre-built, accessible, customizable UI primitives from shadcn/ui.

**Examples**:
```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
```

**Use them directly** - Don't wrap or abstract unless you have a very good reason.

---

### 2. Colocated Components

**What they are**: Components that live next to the routes/pages that use them.

**Characteristics**:
- Colocated with routes (e.g., `app/@auth/components/`, `app/@auth/profile/components/`)
- Compose shadcn components directly
- Contain route-specific logic and styling
- Easy to find and maintain
- Named descriptively after what they do

**Examples**:
```tsx
// app/@auth/components/progress-tracker.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressTracker({ completed, total }) {
  return (
    <Card>
      <CardContent>
        <Progress value={(completed / total) * 100} />
      </CardContent>
    </Card>
  );
}

// app/@auth/components/booking-step-card.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BookingStepCard({ completionInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Consultation</CardTitle>
        <Badge>Completed</Badge>
      </CardHeader>
    </Card>
  );
}
```

---

## Best Practices

### 1. Use shadcn Directly

**Don't**:
```tsx
// ❌ Unnecessary wrapper
export function MyButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}
```

**Do**:
```tsx
// ✅ Use shadcn directly
import { Button } from "@/components/ui/button";
<Button variant="default">Click me</Button>
```

### 2. Compose for Features

**Don't**:
```tsx
// ❌ Generic abstraction layers
<GenericCard type="step" status="completed" />
```

**Do**:
```tsx
// ✅ Feature-specific component
<BookingStepCard completionInfo="..." />
```

### 3. Composition Over Props

**Prefer children/composition**:
```tsx
// ✅ Good - Flexible
<StepCard
  header={<StepCardHeader step={1} status="completed" />}
  title="Book Consultation"
>
  <p>Description here</p>
  <Button>Action</Button>
</StepCard>

// ❌ Avoid - Rigid
<StepCard
  step={1}
  status="completed"
  title="Book Consultation"
  description="Description here"
  actionText="Action"
  onAction={handleAction}
/>
```

### 4. Single Responsibility

Each component should do **one thing well**:

```tsx
// ❌ Bad - Too many props
<StepCard
  showBadge={true}
  showAvatar={true}
  showActions={true}
  actionType="button"
  buttonText="..."
/>

// ✅ Good - Clear purpose
<BookingStepCard completionInfo="Completed on Sept 15" />
```

### 5. Extract Shared Patterns Pragmatically

**Don't abstract prematurely**. When you see duplication across 2-3 components, extract the common parts:

```tsx
// Step 1: You have BookingStepCard and SkinTestStepCard
// Step 2: Notice they share card structure
// Step 3: Extract StepCard as a base
// Step 4: Use it in both

export function StepCard({ status, title, children }) {
  return (
    <Card>
      <CardHeader>
        <Avatar>...</Avatar>
        <Badge>{status}</Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {children}
    </Card>
  );
}
```

---

## File Organization

### Recommended Structure (Colocated)

```
src/
├── components/
│   └── ui/              # shadcn/ui components (installed via CLI)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       └── progress.tsx
└── app/
    ├── (marketing)/
    │   ├── login/
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       └── login-form.tsx
    │   └── onboarding/
    │       ├── page.tsx
    │       └── components/
    └── @auth/
        ├── page.tsx
        ├── components/           # Components for auth home page
        │   ├── progress-tracker.tsx
        │   ├── step-card.tsx
        │   ├── booking-step-card.tsx
        │   └── index.ts
        └── profile/
            ├── page.tsx
            └── components/       # Components for profile page
                ├── avatar-upload.tsx
                └── index.ts
```

### Import Convention

```tsx
// Import shadcn components directly
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import colocated components (relative imports)
import { ProgressTracker, BookingStepCard } from "./components";

// Or from parent route
import { LoginForm } from "../login/components";
```

---

## Checklist for New Components

When creating components:

- [ ] Am I using shadcn components directly, or unnecessarily wrapping them?
- [ ] Is this feature-specific or truly reusable?
- [ ] Is it in the right folder (feature-based, not abstraction-based)?
- [ ] Does it have a clear, descriptive name?
- [ ] Am I composing shadcn components, not rebuilding them?
- [ ] Have I avoided premature abstraction?

---

## Real Example from Dashboard

### Before (Monolithic):
```tsx
// ❌ 265 lines, everything inline
const BookingCard = ({ completionInfo }) => {
  return (
    <Card className="mb-4 border-2 border-green-200">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="w-10 h-10 rounded-full bg-green-500">
            <Check />
          </div>
          <Badge>COMPLETED</Badge>
        </div>
        <h3>Book Your Coach Consultation</h3>
        <p>Have a personalized 30-minute session...</p>
      </CardContent>
    </Card>
  );
};
```

### After (Clean Composition):
```tsx
// ✅ 57 lines in main page, reusable components

// components/dashboard/booking-step-card.tsx
import { StepCard } from "./step-card";

export function BookingStepCard({ completionInfo }) {
  return (
    <StepCard
      status="completed"
      title="Book Your Coach Consultation"
      description="Have a personalized 30-minute session..."
      variant="success"
    >
      <p>{completionInfo}</p>
    </StepCard>
  );
}

// Uses shadcn Card, CardHeader, Avatar, Badge directly
// No unnecessary abstraction layers
```

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Driven Development](https://www.componentdriven.org/)
- [Thinking in React](https://react.dev/learn/thinking-in-react)

---

## TL;DR

1. **Use shadcn components directly** - They're your building blocks
2. **Colocate components** - Put them next to the routes that use them
3. **Compose, don't abstract** - Build route-specific components
4. **Extract patterns pragmatically** - Only when you see real duplication across routes
5. **Keep it simple** - Don't over-engineer

### Why Colocation?

✅ **Easy to find** - Components live next to the pages that use them
✅ **Easy to delete** - Remove a route, remove its components
✅ **Clear ownership** - Know exactly where a component is used
✅ **Better imports** - Use relative imports `./components` instead of long paths
✅ **Scales well** - Each route manages its own components

Update this document as patterns emerge!
