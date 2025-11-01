# Step Card Design Specs

Design specifications for step card components used in multi-step processes.

> **Note**: Only implement specs that apply to your specific card. Not all cards need every element.

---

## Status Definitions

**Completed** - Step has been finished
- User has completed the action OR coach has published and user has acknowledged
- Example: "Book Your Consultation" → User booked
- Visual: Green background, green badge, checkmark icon

**Pending** - User action required NOW
- Step is ready and waiting for user to take action
- Example: "Schedule Now" button, "Select Your Skin Type" button
- Visual: White background, orange badge, step number icon

**Waiting** - Cannot proceed yet
- Either coach/system is working OR prerequisites not met
- Example: "Your coach is preparing your custom routine" ⏳ OR "Complete your booking first"
- Visual: Gray background, gray badge, step number icon

### Status → Variant Mapping

| Status | Variant | Background | Use When |
|--------|---------|------------|----------|
| `completed` | `success` | Green (`bg-skinbestie-success`) | Step is done |
| `pending` | `default` | White (no background) | User needs to act |
| `waiting` | `muted` | Gray (`bg-skinbestie-neutral`) | Coach working OR blocked |

---

## Card Container

```tsx
<Card className={cn(variantClasses[variant], "gap-2", className)}>
```

**Variants:**
- `default`: `"border-none"` - White card
- `success`: `"border-none bg-skinbestie-success"` - Green background (completed)
- `muted`: `"border-none bg-skinbestie-neutral"` - Gray background (inactive)

**Properties:** `rounded-xl`, `py-6`, `gap-6`, `shadow-sm`

---

## Card Header

```tsx
<CardHeader>
  <Avatar className={config.avatarClass}>
    <AvatarFallback className={cn(config.avatarClass, "text-gray-700 font-semibold")}>
      {status === "completed" ? <Check className="w-5 h-5 text-white" /> : stepNumber}
    </AvatarFallback>
  </Avatar>
  <CardAction>
    <Badge variant={config.badge.variant} className={cn(config.badge.className, "w-24 justify-center")}>
      {config.badge.label}
    </Badge>
  </CardAction>
</CardHeader>
```

**Note:** CardTitle and CardDescription are rendered in CardContent (see Card Content section)

**Avatar (Icon Circle):**
- Size: `size-8` (32px)
- Shape: `rounded-full`
- Completed: `bg-skinbestie-success-dark` with white check icon
- Pending: `bg-gray-200` with step number
- Waiting: `bg-gray-300` with step number

**Badge:**
- Width: `w-24` (fixed for consistency)
- Alignment: `justify-center`
- Completed: `variant="default"`, `bg-skinbestie-success-dark text-white`, label: `"COMPLETED"`
- Pending: `variant="outline"`, `border-orange-400 text-orange-600`, label: `"PENDING"`
- Waiting: `variant="outline"`, `border-gray-400 text-gray-600`, label: `"WAITING"`

**Layout:** CSS Grid with `grid-cols-[1fr_auto]`, `gap-2`, `px-6`

---

## Card Content

```tsx
<CardContent>
  <CardTitle className="text-lg">{title}</CardTitle>
  <CardDescription className="text-sm mt-2">{description}</CardDescription>
  {children}
</CardContent>
```

**Title:** `text-lg`, `font-bold`, default foreground color

**Description:** `text-sm`, `text-muted-foreground`, `mt-2`

**Padding:** `px-6` horizontal

---

## Content Patterns (Children)

### Pattern 1: Simple Single Action
```tsx
<Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6">
  Action Label
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
```

### Pattern 2: Multiple Elements (Standard)
```tsx
<div className="space-y-6 mt-6">
  <p className="text-sm text-gray-600">Status message</p>
  <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
    Action Label
    <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</div>
```
**Use for:** Completed states with actions, pending states with status messages

### Pattern 3a: Waiting - Prerequisites Not Met
```tsx
<p className="text-sm text-gray-500 mt-6">
  Complete [previous step] first
</p>
```
**Use for:** Blocking messages when user needs to complete another step first

### Pattern 3b: Waiting - Coach/System Action
```tsx
<p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
  <span>⏳</span>
  <span>Your coach is preparing your custom routine</span>
</p>
```
**Use for:** Informational messages when coach/system is working on something

---

## Spacing Rules

| From | To | Class |
|------|-----|-------|
| CardHeader | CardContent | `gap-6` (on Card) |
| CardTitle | CardDescription | `mt-2` (on description) |
| CardDescription | Single action | `mt-6` (on action) |
| CardDescription | Multiple elements | `space-y-6 mt-6` (on wrapper) |
| Within content group | Next element | `space-y-6` (on wrapper) |

**Guidelines:**
- Use `mt-6` for single actions after description
- Use `space-y-6 mt-6` wrapper for multiple content elements
- Always use responsive button width: `w-full sm:w-auto`

---

## Status Configuration

```tsx
const statusConfig = {
  completed: {
    badge: {
      variant: "default" as const,
      label: "COMPLETED",
      className: "bg-skinbestie-success-dark text-white border-skinbestie-success-dark",
    },
    avatarClass: "bg-skinbestie-success-dark",
  },
  pending: {
    badge: {
      variant: "outline" as const,
      label: "PENDING",
      className: "border-orange-400 text-orange-600",
    },
    avatarClass: "bg-gray-200",
  },
  waiting: {
    badge: {
      variant: "outline" as const,
      label: "WAITING",
      className: "border-gray-400 text-gray-600",
    },
    avatarClass: "bg-gray-300",
  },
};
```

---

## Typography

| Element | Size | Color |
|---------|------|-------|
| Card Title | `text-lg` (18px) | Default foreground |
| Card Description | `text-sm` (14px) | `text-muted-foreground` |
| Status message (pending) | `text-sm` | `text-gray-600` |
| Status message (waiting - blocking) | `text-sm` | `text-gray-500` |
| Status message (waiting - informational) | `text-sm` | `text-gray-600` |
| Badge labels | `text-xs` | Status-dependent |

---

## Emoji Usage

Use emojis to add visual context to waiting states:

**Hourglass (⏳)** - Coach/system is working:
```tsx
<p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
  <span>⏳</span>
  <span>Your coach is preparing your custom routine</span>
</p>
```

**Clipboard (📋)** - Instructions or reference material:
```tsx
<button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
  <span className="text-sm">📋</span>
  <span className="text-sm underline">How to do a skin test</span>
</button>
```

**Guidelines:**
- Use `gap-2` between emoji and text
- Wrap emoji in `<span>` for consistent sizing
- Keep emoji usage purposeful and consistent

---

## Brand Colors

```css
--color-skinbestie-primary: #f8817d;      /* Coral/Pink */
--color-skinbestie-success: #e9f4f0;      /* Light green */
--color-skinbestie-success-dark: #6db399; /* Dark green */
--color-skinbestie-neutral: #f9f9fb;      /* Light gray */
```

---

## Button Standards

**Primary Action:**
```tsx
<Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto">
  Label
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
```
- Background: `bg-skinbestie-primary` or `bg-primary`
- Hover: `/90` opacity
- Icon: `w-4 h-4` with `ml-2`
- Width: `w-full sm:w-auto`

---

## Complete Example

```tsx
<StepCard
  stepNumber={1}
  status="pending"
  title="Step Title"
  description="Step description explaining what this involves."
  variant="default"
>
  <div className="space-y-6 mt-6">
    <p className="text-sm text-gray-600">Status or helper message</p>
    <Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto">
      Complete Step
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </div>
</StepCard>
```
