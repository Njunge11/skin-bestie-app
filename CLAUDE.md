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

### Database (Drizzle ORM)
```bash
npm run db:generate  # Generate migration files from schema changes
npm run db:migrate   # Apply migrations to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

Database schema is defined in `src/db/schema.ts`. After modifying the schema, run `db:generate` to create migration files, then `db:migrate` to apply them.

## Architecture

This is a Next.js 14 App Router application with:
- **Headless WordPress CMS** via WPGraphQL for marketing content
- **PostgreSQL database** with Drizzle ORM for user accounts
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
- `NEXT_PUBLIC_WORDPRESS_API_URL` - WordPress GraphQL endpoint
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
- Final submission creates account via `/api/account` POST endpoint
- Stripe payment handled in step 5 via `/api/checkout/session`

The wizard state is managed by `wizard.provider.tsx` and persisted across steps.

### Database Layer

Drizzle ORM with PostgreSQL (`src/db/`):
- **Schema**: `accounts` table with user profile data, skin type, concerns, subscription status
- **Types**: `Account`, `NewAccount`, `SubscriptionStatus` exported from schema
- **Connection**: Database URL from `DATABASE_URL` env var

Account creation flow:
1. Frontend posts to `/api/account`
2. Validates input with Zod schema
3. Checks uniqueness by email/phone
4. Inserts into database with normalized data

### Stripe Integration

Subscription payment flow:
1. Frontend posts to `/api/checkout/session` with priceId + customer email
2. Backend creates/finds Stripe customer
3. Creates subscription with `payment_behavior: "default_incomplete"`
4. Returns `client_secret` (either PaymentIntent or SetupIntent)
5. Frontend uses Stripe.js to confirm payment

Uses Stripe API version `2025-08-27.basil` with flexible billing mode.

## Directory Structure

```
src/
├── app/
│   ├── (marketing)/        # Marketing site pages
│   │   ├── page.tsx        # Landing page
│   │   ├── onboarding/     # Multi-step onboarding wizard
│   │   └── [components]    # Section components (hero, benefits, etc.)
│   ├── api/                # API routes
│   │   ├── account/        # Account creation endpoint
│   │   ├── checkout/       # Stripe checkout session
│   │   └── revalidate/     # Cache revalidation webhook
│   └── [...slug]/          # WordPress dynamic page catch-all
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Templates/          # WordPress content type templates
│   └── Globals/            # Shared components (nav, preview notice)
├── db/
│   ├── schema.ts           # Drizzle database schema
│   └── index.ts            # Database connection
├── gql/                    # Auto-generated GraphQL types (do not edit)
├── queries/                # GraphQL query definitions
├── utils/                  # Helper functions
│   ├── wp.ts              # WordPress fetch with ISR
│   ├── fetchGraphQL.ts    # WordPress fetch with draft mode
│   └── seoData.ts         # SEO metadata helpers
└── lib/                    # Utility functions and configs
```

## Environment Setup

Create `.env` file with these variables:

```bash
# Frontend base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wp-site.com
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=your-wp-site.com
HEADLESS_SECRET=your-secret-key
WP_USER=wordpress-username
WP_APP_PASS="wordpress-app-password"

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

See `.env.local.example` for reference.

## Key Files

- `codegen.ts` - GraphQL codegen config (generates types from WordPress schema)
- `drizzle.config.ts` - Drizzle ORM config
- `add-ts-nocheck.js` - Script to add `@ts-nocheck` to generated GraphQL files
- `apollo.config.js` - Apollo extension config for GraphQL autocomplete in VS Code

## Development Notes

- GraphQL types are regenerated on every `npm run dev` and `npm run build`
- Marketing pages cache for 60s by default (configurable in `wpFetch()` calls)
- Database migrations are NOT auto-applied; run `npm run db:migrate` after schema changes
- Stripe integration uses confirmation_secret flow (Basil API version)
