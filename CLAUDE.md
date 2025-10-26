# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start dev server with GraphQL codegen + @ts-nocheck script
npm run build      # Production build with GraphQL codegen + @ts-nocheck script
npm start          # Start production server
npm run lint       # Run ESLint
```

### GraphQL Code Generation
```bash
npm run codegen    # Generate TypeScript types from WordPress GraphQL schema
```

This runs `graphql-codegen` to pull the schema from your WordPress installation and generate types in `src/gql/`. The `add-ts-nocheck.js` script adds `// @ts-nocheck` to generated files to suppress type errors.

## Architecture

This is a Next.js 14 App Router application with:
- **Headless WordPress CMS** via WPGraphQL for marketing content
- **External API backend** for user profile management
- **Stripe** for subscription payments
- **shadcn/ui + Tailwind CSS** for UI components

### WordPress Integration

WordPress serves as the headless CMS for all marketing content. The integration includes:

- **GraphQL codegen**: Types are auto-generated from the WordPress schema on every dev/build
- **ISR Caching**: Marketing pages use `wpFetch()` with 60s revalidation by default
- **Cache Revalidation**: WordPress calls `/api/revalidate` webhook to invalidate cache on content updates
- **Draft Mode**: Preview/draft content support via JWT authentication (see `fetchGraphQL.ts`)
- **ACF Flexible Content**: Marketing pages use ACF flexible content blocks for dynamic layouts

Environment variables required:
- `WORDPRESS_API_URL` - WordPress GraphQL endpoint (server-side only)
- `HEADLESS_SECRET` - Shared secret for cache revalidation
- `WP_USER` + `WP_APP_PASS` - WordPress credentials for draft/preview mode

### Marketing Page Architecture

The landing page (`src/app/(marketing)/page.tsx`) fetches all content from WordPress ACF fields and renders it as sections:
- Hero, Benefits, Journey, Testimonials, Values, Pricing, FAQs
- Each section component receives extracted/normalized data from WordPress
- Uses GSAP/Framer Motion for scroll animations (e.g., curtain wipe effects)

Data flow:
1. `getLanding()` fetches GraphQL query via `wpFetch()`
2. Extractor functions (`extractBenefits`, `extractJourney`, etc.) normalize WordPress data
3. Section components receive clean props and render UI

### Onboarding Flow

Multi-step wizard at `/onboarding`:
- Server component fetches steps from WordPress ACF
- Maps WordPress layouts to step components (personal details, skin type, concerns, allergies, subscription, booking)
- Client-side wizard uses React Hook Form + Zod validation
- Account creation and updates handled via Server Actions in `onboarding/actions.ts`
- Stripe payment handled in step 5 via `/api/checkout/session`

The wizard state is managed by `wizard.provider.tsx` and persisted across steps.

### User Profile Management

Account creation and updates are handled via Server Actions that call an external API backend:

1. Frontend calls Server Action `createUserProfile()` from `onboarding/actions.ts`
2. Server Action makes API request to external backend at `API_BASE_URL`
3. Backend validates input, checks uniqueness, and manages database
4. Returns user profile with ID to track onboarding progress

API endpoints used:
- `POST /api/user-profiles` - Create profile
- `GET /api/user-profiles/:id` - Get profile
- `PATCH /api/user-profiles/:id` - Update profile
- `GET /api/user-profiles/check` - Check if email/phone exists

### Stripe Integration

Subscription payment flow:
1. Frontend posts to `/api/checkout/session` with priceId + customer email
2. Backend creates/finds Stripe customer
3. Creates subscription with `payment_behavior: "default_incomplete"`
4. Returns `client_secret` (either PaymentIntent or SetupIntent)
5. Frontend uses Stripe.js to confirm payment

Uses Stripe API version `2025-08-27.basil` with flexible billing mode.

## CI/CD Pipeline

The project uses GitHub Actions with Vercel for continuous integration and deployment.

### Workflow Strategy

**Branch Structure:**
- `main` - Production branch
- Feature branches - Development work

**Deployment Flow:**

1. **Feature Branch PR** → Run tests + Deploy preview
   - Tests run via GitHub Actions
   - Preview deployment to Vercel with Preview environment variables
   - Preview URL automatically commented on PR
   - Uses `vercel deploy` with `--environment=preview`

2. **Merge to main** → Run tests + Deploy production
   - Tests run via GitHub Actions
   - Production deployment to Vercel with Production environment variables
   - Deploys to main domain
   - Uses `vercel deploy --prod` with `--environment=production`

### Environment Variables

Configure environment variables in Vercel Dashboard (Project Settings → Environment Variables):

**Production Environment** (main branch):
```bash
API_BASE_URL=https://api.skinbestie.com
API_KEY=your-production-api-key
WORDPRESS_API_URL=https://cms.skinbestie.com
STRIPE_SECRET_KEY=sk_live_...
# ... other production values
```

**Preview Environment** (all feature branches):
```bash
API_BASE_URL=https://staging-api.skinbestie.com
API_KEY=your-staging-api-key
WORDPRESS_API_URL=https://staging-cms.skinbestie.com
STRIPE_SECRET_KEY=sk_test_...
# ... other staging/test values
```

**Branch-Specific Variables** (optional):
You can override specific Preview variables for individual branches by selecting the branch name when adding environment variables in Vercel.

### Required GitHub Secrets

Add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` - Vercel API token (Account Settings → Tokens)
- `VERCEL_ORG_ID` - Vercel organization ID (from `.vercel/project.json`)
- `VERCEL_PROJECT_ID` - Vercel project ID (from `.vercel/project.json`)

### Workflow File

Location: `.github/workflows/ci-cd.yml`

The workflow includes three jobs:
1. **test** - Runs on all PRs and main pushes
2. **deploy-production** - Runs on main pushes (after tests pass)
3. **deploy-preview** - Runs on PRs (after tests pass, comments preview URL)

## Directory Structure

```
src/
├── app/
│   ├── (marketing)/        # Marketing site pages
│   │   ├── page.tsx        # Landing page
│   │   ├── onboarding/     # Multi-step onboarding wizard (uses Server Actions)
│   │   └── [components]    # Section components (hero, benefits, etc.)
│   ├── api/                # API routes
│   │   ├── checkout/       # Stripe checkout session
│   │   └── revalidate/     # Cache revalidation webhook
│   └── [...slug]/          # WordPress dynamic page catch-all
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Templates/          # WordPress content type templates
│   └── Globals/            # Shared components (nav, preview notice)
├── gql/                    # Auto-generated GraphQL types (do not edit)
├── lib/                    # Utility functions and configs
│   └── api-client.ts      # REST API client for external backend
├── queries/                # GraphQL query definitions
├── test/                   # Test utilities
│   ├── setup.ts           # MSW server setup
│   └── setup-rtl.ts       # React Testing Library config
└── utils/                  # Helper functions
    ├── wp.ts              # WordPress fetch with ISR
    ├── fetchGraphQL.ts    # WordPress fetch with draft mode
    └── seoData.ts         # SEO metadata helpers
```

## Environment Setup

Create `.env` file with these variables:

```bash
# Frontend base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# WordPress (server-side only)
WORDPRESS_API_URL=https://your-wp-site.com
HEADLESS_SECRET=your-secret-key
WP_USER=wordpress-username
WP_APP_PASS="wordpress-app-password"

# External API Backend (for user profiles - SERVER ONLY, not exposed to browser)
API_BASE_URL=http://localhost:3001
API_KEY=your-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

See `.env.local.example` for reference.

## Key Files

- `codegen.ts` - GraphQL codegen config (generates types from WordPress schema)
- `add-ts-nocheck.js` - Script to add `@ts-nocheck` to generated GraphQL files
- `apollo.config.js` - Apollo extension config for GraphQL autocomplete in VS Code
- `src/lib/api-client.ts` - REST API client for external backend
- `src/app/(marketing)/onboarding/actions.ts` - Server Actions for user profile management

## Development Notes

- GraphQL types are regenerated on every `npm run dev` and `npm run build`
- Marketing pages cache for 60s by default (configurable in `wpFetch()` calls)
- User profiles are managed by external API backend at `API_BASE_URL` (server-side only)
- Tests use MSW (Mock Service Worker) to mock API responses
- Stripe integration uses confirmation_secret flow (Basil API version)
- **Security Note**: Never use `NEXT_PUBLIC_` prefix for API keys, secrets, or backend URLs - only for truly public client-side values (e.g., Stripe publishable key, Google Analytics ID)
