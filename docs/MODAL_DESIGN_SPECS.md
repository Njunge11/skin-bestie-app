# Modal Design Specifications

> Only implement specs that apply to your modal.

---

## Container

```tsx
<DialogContent className="max-w-md">
<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
```

- Default: `max-w-md`
- Content-heavy: `max-w-lg max-h-[90vh] overflow-y-auto`

---

## Close Button

```tsx
<button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</button>
```

---

## Top Icon

```tsx
<div className="flex justify-center">
  <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
    <Icon className="h-6 w-6 text-white" />
  </div>
</div>
```

- Circle: `w-12 h-12 rounded-full`
- Icon: `h-6 w-6 text-white`

---

## Header

```tsx
<DialogHeader className="text-center">
  <DialogTitle className="text-xl font-bold text-center">Title</DialogTitle>
  <DialogDescription className="text-base text-gray-600 text-center">Description</DialogDescription>
</DialogHeader>
```

---

## Section Headings

```tsx
<h3 className="text-lg font-semibold">Section Title</h3>
```

---

## Content Cards

```tsx
<div className="space-y-3">
  <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
    {/* icon circle + content */}
  </div>
</div>
```

- Layout: `flex items-center gap-4 p-4 rounded-lg`
- Background: `bg-white border-gray-200` or `bg-skinbestie-success border-skinbestie-success`
- Spacing: Wrap with `space-y-3`

---

## Icon Circles (in content)

**All circles: `w-8 h-8`**

### Numbered Circles
```tsx
<div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-primary flex items-center justify-center text-white font-semibold">
  {number}
</div>
```

### Checkmark Circles
```tsx
<div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-success-dark flex items-center justify-center">
  <svg className="w-5 h-5 text-white">
    <path d="M5 13l4 4L19 7" />
  </svg>
</div>
```

---

## Buttons

```tsx
<div className="mt-6">
  <Button className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white">
    Label
  </Button>
</div>
```

- Wrapper: `mt-6`
- Button: `w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white`

---

## Spacing

| From | To | Class |
|------|-----|-------|
| Icon | Header | Default |
| Header | First Content | `mt-4` |
| Content | Button | `mt-6` |
| Between items | Next item | `space-y-3` or `space-y-4` |

---

## Typography

| Element | Classes |
|---------|---------|
| Dialog Title | `text-xl font-bold text-center` |
| Dialog Description | `text-base text-gray-600 text-center` |
| Section Heading | `text-lg font-semibold` |
| Body/Content Text | `text-sm text-gray-700` |
| Bold Text | `font-bold text-sm text-gray-700` |

---

## Brand Colors

```css
--color-skinbestie-primary: #f8817d;
--color-skinbestie-success: #e9f4f0;
--color-skinbestie-success-dark: #6db399;
--color-skinbestie-neutral: #f9f9fb;
```
