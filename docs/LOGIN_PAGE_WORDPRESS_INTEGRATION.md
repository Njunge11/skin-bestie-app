# Login Page WordPress Integration Guide

This document explains how to integrate WordPress CMS content with the login page using GraphQL and ACF fields.

## Overview

The login page fetches content from WordPress ACF fields to populate:
- Background marketing copy and image (left side)
- Form heading and subheading (right side)

This follows the same pattern as the landing page and onboarding flow.

## Architecture

```
WordPress CMS (ACF Fields)
    ↓
GraphQL Query
    ↓
Server Component (page.tsx) - Fetches data with ISR caching
    ↓
Data Extractor - Normalizes WordPress data
    ↓
Client Components - Render UI with CMS content
```

## WordPress ACF Structure

The login page uses the "Login" ACF Field Group attached to the `/login` page:

```graphql
login {
  backgroundCopy       # Text for marketing section
  backgroundImage {    # Background image for marketing section
    node {
      altText
      sourceUrl
    }
  }
  formHeading         # Main form heading
  formSubheading      # Form subheading/instructions
}
```

## Implementation Steps

### 1. Create GraphQL Query

File: `src/queries/general/login.ts`

```typescript
import { gql } from "graphql-tag";

export const GetLoginPage = gql(/* GraphQL */ `
  query GetLoginPage {
    page(id: "/login", idType: URI) {
      login {
        backgroundCopy
        backgroundImage {
          node {
            altText
            sourceUrl
          }
        }
        formHeading
        formSubheading
      }
    }
  }
`);
```

### 2. Create Data Extractor

File: `src/utils/extractors/login.extractor.ts`

```typescript
export interface LoginContent {
  backgroundCopy: string;
  backgroundImage: {
    sourceUrl: string;
    altText: string;
  };
  formHeading: string;
  formSubheading: string;
}

export function extractLoginContent(data: any): LoginContent {
  const login = data?.page?.login;

  return {
    backgroundCopy: login?.backgroundCopy || "Welcome back to Skin Bestie",
    backgroundImage: {
      sourceUrl: login?.backgroundImage?.node?.sourceUrl || "/onboarding.jpg",
      altText: login?.backgroundImage?.node?.altText || "login",
    },
    formHeading: login?.formHeading || "Welcome back, bestie",
    formSubheading:
      login?.formSubheading || "Enter your email to receive a sign-in link",
  };
}
```

### 3. Fetch Data in Server Component

File: `src/app/(marketing)/login/page.tsx`

```typescript
import { wpFetch } from "@/utils/wp";
import { GetLoginPage } from "@/queries/general/login";
import { extractLoginContent } from "@/utils/extractors/login.extractor";
import LoginClient from "./login.client";

export default async function LoginPage() {
  // Fetch from WordPress with ISR caching (60s revalidation)
  const data = await wpFetch(GetLoginPage);

  // Extract and normalize the data
  const loginContent = extractLoginContent(data);

  return <LoginClient loginContent={loginContent} />;
}
```

### 4. Update Client Component

File: `src/app/(marketing)/login/login.client.tsx`

```typescript
"use client";

import { useState } from "react";
import LoginMarketing from "./login.marketing";
import LoginForm from "./login.form";
import { LoginContent } from "@/utils/extractors/login.extractor";

interface LoginClientProps {
  loginContent: LoginContent;
}

export default function LoginClient({ loginContent }: LoginClientProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setEmailSent(true);
  };

  const handleBackToLogin = () => {
    setEmailSent(false);
    setEmail("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
      <LoginMarketing
        backgroundCopy={loginContent.backgroundCopy}
        backgroundImage={loginContent.backgroundImage}
      />
      <LoginForm
        emailSent={emailSent}
        email={email}
        onEmailSent={handleEmailSent}
        onBackToLogin={handleBackToLogin}
        formHeading={loginContent.formHeading}
        formSubheading={loginContent.formSubheading}
      />
    </div>
  );
}
```

### 5. Update Marketing Component

File: `src/app/(marketing)/login/login.marketing.tsx`

```typescript
"use client";

import { anton } from "@/app/fonts";

interface LoginMarketingProps {
  backgroundCopy: string;
  backgroundImage: {
    sourceUrl: string;
    altText: string;
  };
}

export default function LoginMarketing({
  backgroundCopy,
  backgroundImage,
}: LoginMarketingProps) {
  return (
    <div
      className="hidden md:flex flex-col bg-cover bg-center pt-[19] p-[8.625rem]"
      style={{ backgroundImage: `url('${backgroundImage.sourceUrl}')` }}
      aria-label={backgroundImage.altText}
    >
      <h1
        className={`w-full max-w-[532px] ${anton.className} text-[#FFF7D4] text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
      >
        {backgroundCopy}
      </h1>
    </div>
  );
}
```

### 6. Update Form Component

File: `src/app/(marketing)/login/login.form.tsx`

Update the interface and EmailForm component:

```typescript
interface LoginFormProps {
  emailSent: boolean;
  email: string;
  onEmailSent: (email: string) => void;
  onBackToLogin: () => void;
  formHeading: string;
  formSubheading: string;
}

// Pass props to EmailForm
function EmailForm({
  onEmailSent,
  formHeading,
  formSubheading
}: {
  onEmailSent: (email: string) => void;
  formHeading: string;
  formSubheading: string;
}) {
  // ... existing state and handlers

  return (
    <>
      <h1 className={`${anton.className} text-center text-[2rem] uppercase text-[#222118]`}>
        {formHeading}
      </h1>
      <p className="text-center text-lg font-medium text-[#3F4548] pt-2">
        {formSubheading}
      </p>
      {/* ... rest of form */}
    </>
  );
}
```

## Benefits

1. **Content Management**: Marketing team can update login page content via WordPress
2. **ISR Caching**: Content cached for 60s for performance (configurable)
3. **Type Safety**: TypeScript types auto-generated from WordPress schema
4. **Consistency**: Follows existing architecture patterns in the codebase
5. **Cache Revalidation**: WordPress webhook automatically invalidates cache on content updates

## Cache Management

- Default cache: 60 seconds (ISR)
- Manual revalidation: WordPress calls `/api/revalidate?secret=HEADLESS_SECRET&path=/login`
- Cache tags: Can be added for more granular control

## Testing

To test the integration:

1. Update content in WordPress ACF fields for `/login` page
2. Verify changes appear after 60s or trigger revalidation
3. Check fallback values work if WordPress is unavailable
4. Test with empty/null values from WordPress

## GraphQL Codegen

Types are auto-generated when running:
```bash
npm run dev    # Runs codegen before starting dev server
npm run build  # Runs codegen before building
npm run codegen # Run codegen manually
```

The `Login` type is available at `src/gql/graphql.ts` and includes all ACF fields.
