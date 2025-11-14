# Deployment Server Action Error - Investigation & Solutions

## Problem Description

**Error Message:**
```
Oops! Something went wrong
Server Action "0014c2c7ecbe4a184b8f7f4a177fe70afafa4105d1" was not found on the server
```

**When it occurs:**
- During deployments when users have the app open in their browser
- User tries to interact with the app (submit form, update data, etc.)
- The app appears to "go down temporarily"

## Root Cause

### How Next.js Server Actions Work

1. Next.js encrypts Server Actions with unique IDs during build
2. Client code references these encrypted action IDs
3. Server decrypts and executes the corresponding action

### Why Errors Occur During Deployment

```
Timeline:
1. User loads app (v1) → Browser has Server Action IDs from v1
2. You deploy new version (v2) → Server now has different Action IDs
3. User interacts with old page → Browser sends v1 action ID
4. Server can't find v1 action → Error!
```

## Current Status (as of January 2025)

**Vercel Skew Protection is enabled** but this is still a known issue in Next.js 15.5.3:

- GitHub Issue #75541 (Jan 31, 2025): "Client cannot recover from version skew"
- Next.js team acknowledges the client-side recovery needs improvement
- Skew Protection helps but doesn't completely eliminate the problem

## Solutions Implemented

### 1. Error Boundary (Primary Solution) ✅

**File:** `/src/components/server-action-error-boundary.tsx`

**What it does:**
- Catches Server Action errors before they crash the app
- Shows user-friendly dialog: "Update Available - Please refresh to continue"
- Prompts user to refresh instead of showing cryptic error

**Implementation:**
```typescript
// Wrapped in both layouts:
// - /src/app/(application)/layout.tsx
// - /src/app/(marketing)/layout.tsx

<ServerActionErrorBoundary>
  {/* app content */}
</ServerActionErrorBoundary>
```

**User Experience:**
- ❌ Before: Cryptic error, app appears broken
- ✅ After: Clean dialog asking user to refresh

## Additional Mitigation Strategies

### 2. Deployment Best Practices

**Timing:**
- Deploy during low-traffic periods
- Avoid deployments during peak usage hours

**Communication:**
- Consider adding a deployment banner/notification
- Use status page to communicate scheduled deployments

### 3. Monitor Error Rates

Track Server Action errors in your logging/monitoring:

```typescript
// In error boundary, you could add:
componentDidCatch(error: Error) {
  // Log to monitoring service
  if (error.message?.includes('Server Action')) {
    analytics.track('server_action_version_skew', {
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 4. Progressive Enhancement (Future Consideration)

For critical user flows, consider:
- Optimistic UI updates
- Retry logic with exponential backoff
- Graceful degradation to API routes (non-Server Actions)

## Alternative Solutions Considered

### Set Static Encryption Key
```bash
# Add to environment variables
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-random-32-character-string
```

**Why we didn't use this:**
- Loses security benefits of rotating keys
- Not recommended by Next.js team
- Skew Protection is the official solution

### Client-Side Polling for New Versions
- Could poll for new deployment and auto-refresh
- Adds complexity and network overhead
- Error boundary is simpler and more reliable

## Testing the Fix

### Manual Testing

1. **Start app locally:**
   ```bash
   npm run dev
   ```

2. **Open app in browser**

3. **While app is open, make a change and restart dev server**

4. **Try to interact with a Server Action (e.g., update profile, submit form)**

5. **You should see the "Update Available" dialog instead of an error**

### Monitoring in Production

After deploying, monitor:
- Error logs for "Failed to find Server Action"
- User reports of app "going down"
- Success rate of Server Action calls

**Expected improvement:**
- Users see friendly dialog instead of errors
- No "app down" perception - just "please refresh"
- Clearer communication about what happened

## References

- [Next.js Docs: Failed to find Server Action](https://nextjs.org/docs/messages/failed-to-find-server-action)
- [Vercel Skew Protection Docs](https://vercel.com/docs/skew-protection)
- [GitHub Issue #75541](https://github.com/vercel/next.js/issues/75541) - Client recovery from version skew
- [GitHub Discussion #75175](https://github.com/vercel/next.js/discussions/75175) - How to deal with error

## Next Steps

1. ✅ Deploy error boundary implementation
2. Monitor error rates after deployment
3. Consider adding deployment notifications (optional)
4. Track Next.js updates for improved client recovery

## Notes

- This is a limitation of current Server Actions architecture
- Next.js team is aware and working on improvements
- Error boundary is the best current mitigation
- Issue affects all Next.js 15 apps using Server Actions
