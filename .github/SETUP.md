# GitHub Actions CI/CD Setup

This document explains how to configure GitHub Actions for automated testing and deployment to Vercel.

## Workflow Overview

The CI/CD pipeline consists of three jobs:

1. **Test Job** - Runs on every push and PR
   - Checks out code
   - Installs dependencies
   - Runs all tests using PGlite (in-memory PostgreSQL)

2. **Deploy Production** - Runs only on pushes to `main` branch
   - Only runs if tests pass
   - Deploys to Vercel production

3. **Deploy Preview** - Runs only on Pull Requests
   - Only runs if tests pass
   - Creates a preview deployment on Vercel
   - Posts the preview URL as a comment on the PR

## Required GitHub Secrets

You need to add the following secret to your GitHub repository:

### `VERCEL_TOKEN`

This is your Vercel authentication token.

**How to get it:**

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the generated token
5. Go to your GitHub repository
6. Navigate to Settings → Secrets and variables → Actions
7. Click "New repository secret"
8. Name: `VERCEL_TOKEN`
9. Value: Paste the token from Vercel
10. Click "Add secret"

## Vercel Project Configuration

Make sure your Vercel project is properly configured:

1. Your project should be linked to this GitHub repository
2. The Vercel project should have all necessary environment variables set:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_WORDPRESS_API_URL`
   - `HEADLESS_SECRET`
   - Any other production environment variables

## Testing Locally

To test the workflow locally before pushing:

```bash
# Run tests (same as CI)
npm test -- --run

# Build for production
npm run build
```

## Workflow Triggers

- **Push to `main`**: Runs tests + deploys to production
- **Pull Request to `main`**: Runs tests + deploys preview + comments PR with URL

## Notes

- Tests use PGlite (in-memory PostgreSQL), so no database setup is needed in CI
- Deployment only happens if all tests pass
- The workflow uses `npm ci` for faster, more reliable installs in CI
