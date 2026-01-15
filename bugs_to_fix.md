# Onboarding Bugs to Fix

Last updated: 2026-01-15

## Critical - Users Cannot Complete Onboarding

### BUG-001: Silent booking failure in Step 6

- **File**: `src/app/onboarding/step6.tsx` lines 212-214
- **Description**: If `updateUserProfile` fails after Calendly booking, the error is only logged to console. User sees booking completed in Calendly but the login button never appears. Profile never gets marked `isCompleted: true` in the database.
- **User Impact**: User completes entire onboarding flow, books appointment, but cannot log in afterward. They appear to have incomplete onboarding in the system.

**Solution**:
1. Add error state and show retry UI when update fails:
```tsx
const [bookingError, setBookingError] = useState<string | null>(null);

// In the catch block:
catch (error) {
  console.error("Failed to save booking completion:", error);
  setBookingError("We couldn't save your booking. Please click retry.");
}

// In the UI, show retry button when error exists:
{bookingError && (
  <div className="text-red-600 mb-4">
    <p>{bookingError}</p>
    <button onClick={retryBookingUpdate}>Retry</button>
  </div>
)}
```

2. Implement a `retryBookingUpdate` function that re-attempts the `updateUserProfile` call with the same data.

3. Still show `setBookingCompleted(true)` even on error, but with the retry UI, so user isn't stuck staring at the calendar.

---

### BUG-002: Silent payment failure in Step 5

- **File**: `src/app/onboarding/step5.tsx` lines 610-620, 655-665
- **Description**: After successful Stripe payment confirmation, if `updateUserProfile` fails, the payment is taken but `isSubscribed` stays false. The code only invalidates queries and returns silently without showing the success notice.
- **User Impact**: User's card is charged but profile isn't marked as subscribed. They're stuck in payment step and cannot proceed to booking.

**Solution**:
1. Treat the Stripe webhook as the source of truth for payment status (see [Stripe best practices](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/)). The webhook should update `isSubscribed`, not the client.

2. If client-side update fails, show error with retry option:
```tsx
const [updateError, setUpdateError] = useState<string | null>(null);

try {
  await updateUserProfile(userProfileId, { isSubscribed: true, ... });
} catch (error) {
  setUpdateError("Payment successful but we couldn't update your profile. Click retry or contact support.");
  // Don't return - let user see they paid successfully
}
```

3. Add a manual "Refresh Status" button that re-fetches profile to check if webhook updated it:
```tsx
const refreshStatus = () => {
  queryClient.invalidateQueries({ queryKey: ["userProfile", userProfileId] });
};
```

---

### BUG-003: Race condition prevents booking update

- **File**: `src/app/onboarding/step6.tsx` line 176
- **Description**: The booking completion handler checks `if (!userProfileId || !currentProfile) return`. If the TanStack Query for `currentProfile` hasn't resolved when `calendly.event_scheduled` fires, the early return prevents the profile update.
- **User Impact**: User completes booking but profile is not updated. Depends on timing - fast bookers more likely to hit this.

**Solution**:
1. Use a ref to track the latest profile data instead of depending on query state:
```tsx
const currentProfileRef = useRef(currentProfile);
useEffect(() => {
  currentProfileRef.current = currentProfile;
}, [currentProfile]);

// In message handler:
if (evt === "calendly.event_scheduled") {
  const profile = currentProfileRef.current;
  if (!userProfileId) return;

  // If profile not loaded yet, fetch it directly
  const profileData = profile || await getUserProfile(userProfileId);
  // ... proceed with update
}
```

2. Alternatively, don't depend on `currentProfile` for the update - just send all completed steps:
```tsx
await updateUserProfile(userProfileId, {
  hasCompletedBooking: true,
  completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE", "BOOKING"],
  isCompleted: true,
  completedAt: new Date().toISOString(),
});
```
This removes the need for `currentProfile` since we know all steps are complete at Step 6.

---

## High - Users Get Stuck

### BUG-004: Stale query cache prevents retry

- **File**: `src/app/onboarding/step5.tsx` line 106
- **Description**: The checkout session query uses `staleTime: Infinity`, meaning it will never refetch. If there's an error creating the session and user clicks "Try Again", the query won't retry because it's still considered fresh in cache.
- **User Impact**: User cannot recover from payment flow errors by retrying. Must refresh page.

**Solution**:
1. Remove `staleTime: Infinity` or use a reasonable value like 5 minutes:
```tsx
const { data, error, refetch } = useQuery({
  queryKey: ["checkoutSession", userProfileId],
  queryFn: fetchCheckoutSession,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

2. For the retry button, explicitly call `refetch()` which bypasses stale checks:
```tsx
<button onClick={() => refetch()}>Try Again</button>
```

See [TanStack Query retry docs](https://tanstack.com/query/v4/docs/framework/react/guides/query-retries) for configuration options.

---

### BUG-005: Missing profile ID with no recovery path

- **File**: `src/app/onboarding/step2.tsx` lines 85-87, `step3.tsx` lines 167-169, `step4.tsx` lines 85-87
- **Description**: If Step 1 fails silently or profile creation errors, Step 2+ shows "Profile ID is missing. Please start from Step 1". But if Step 1 already errored, clicking back won't help.
- **User Impact**: User is stuck in a broken state with no clear path forward.

**Solution**:
1. Add a "Start Over" button that resets the entire form and navigates to Step 1:
```tsx
if (!userProfileId) {
  return (
    <div className="text-center">
      <p className="text-red-600 mb-4">
        Something went wrong. Your profile wasn't created properly.
      </p>
      <button
        onClick={() => {
          reset(); // Reset form
          setStepIndex(0); // Go to step 1
        }}
        className="btn-primary"
      >
        Start Over
      </button>
    </div>
  );
}
```

2. In Step 1, ensure errors are always shown to user (never fail silently):
```tsx
try {
  const result = await createUserProfile(input);
  if (!result.success) {
    setServerError(result.error || "Failed to create profile. Please try again.");
    return; // Don't proceed
  }
  setValue("userProfileId", result.data.id);
  next();
} catch (error) {
  setServerError("Network error. Please check your connection and try again.");
}
```

---

### BUG-006: Subscription polling has no clear timeout

- **File**: `src/app/onboarding/step5.tsx` lines 259-286
- **Description**: The subscription status polling uses `retry: 5` with exponential backoff but there's no clear timeout messaging. If the Stripe webhook hasn't updated the database yet, polling continues without feedback.
- **User Impact**: User stuck in "Verifying subscription" state for extended period with no indication of what's happening.

**Solution**:
1. Add a maximum polling duration with clear messaging:
```tsx
const [pollingStartTime] = useState(Date.now());
const MAX_POLLING_MS = 30000; // 30 seconds

const { data: profile, isLoading } = useQuery({
  queryKey: ["subscriptionStatus", userProfileId],
  queryFn: () => getUserProfile(userProfileId),
  refetchInterval: (data) => {
    if (data?.isSubscribed) return false; // Stop polling
    if (Date.now() - pollingStartTime > MAX_POLLING_MS) return false; // Timeout
    return 3000; // Poll every 3 seconds
  },
});

const isTimedOut = Date.now() - pollingStartTime > MAX_POLLING_MS && !profile?.isSubscribed;
```

2. Show timeout UI with manual refresh:
```tsx
{isTimedOut && (
  <div>
    <p>Verification is taking longer than expected.</p>
    <p>Your payment was successful. If this persists, please contact support.</p>
    <button onClick={() => refetch()}>Check Again</button>
    <button onClick={() => next()}>Continue Anyway</button>
  </div>
)}
```

---

## Medium - Data Inconsistency

### BUG-007: Hardcoded GB country code breaks international users

- **File**: `src/app/onboarding/onboarding.utils.ts` line 166
- **Description**: When mapping profile data after payment return, the phone number country is hardcoded to `"GB"`. If user created account with different country (e.g., "KE"), form loads with wrong country code.
- **User Impact**: User returns from payment, form has wrong country code for their phone number, potentially causing validation errors on navigation.

**Solution**:
1. Use `libphonenumber-js` to detect country from E.164 phone number (see [libphonenumber-js docs](https://www.npmjs.com/package/libphonenumber-js)):
```tsx
import { parsePhoneNumber } from 'libphonenumber-js';

function mapProfileToFormValues(profile: UserProfile): OnboardingSchema {
  let mobileLocal = "";
  let mobileCountryISO = "KE"; // Default fallback

  if (profile.phoneNumber) {
    try {
      const parsed = parsePhoneNumber(profile.phoneNumber);
      if (parsed) {
        mobileCountryISO = parsed.country || "KE";
        mobileLocal = parsed.nationalNumber;
      }
    } catch {
      // Fallback: strip + and use as-is
      mobileLocal = profile.phoneNumber.replace(/^\+/, '');
    }
  }

  return {
    // ...
    mobileLocal,
    mobileCountryISO,
    // ...
  };
}
```

2. Alternatively, store `countryISO` in the user profile on the backend so it can be retrieved directly.

---

### BUG-008: Identity change doesn't clear profile ID

- **File**: `src/app/onboarding/onboarding.client.tsx` lines 83-98
- **Description**: When user changes email/phone (identity fields), the form resets downstream data but `userProfileId` from URL params may persist. New account data could get written to the old profile.
- **User Impact**: User's new account data gets mixed with old account data if they change identity mid-flow after payment return.

**Solution**:
1. Clear URL params when identity changes:
```tsx
useEffect(() => {
  if (identityChanged) {
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('profile_id');
    url.searchParams.delete('payment_success');
    url.searchParams.delete('session_id');
    window.history.replaceState({}, '', url.toString());

    // Clear form profile ID
    setValue("userProfileId", "");

    // Reset to step 1
    setStepIndex(0);
  }
}, [identityChanged]);
```

2. Add confirmation dialog when user tries to change identity after returning from payment:
```tsx
if (hasPaymentParams && (emailChanged || phoneChanged)) {
  const confirmed = window.confirm(
    "Changing your email or phone will start a new account. Your previous progress will be lost. Continue?"
  );
  if (!confirmed) {
    // Revert the change
    setValue("email", previousEmail);
    return;
  }
}
```

---

### BUG-009: Stale profile cache across steps

- **File**: `src/app/onboarding/step2.tsx` lines 65-73, `step3.tsx` lines 93-101, `step4.tsx` lines 37-45
- **Description**: Each step independently fetches the current profile via `useQuery` with the same query key. Going back to Step 1 and changing data leaves steps 2-4 with stale cached profile. `mergeCompletedSteps` uses wrong base data.
- **User Impact**: Completed steps might not merge correctly. Progress could be lost or overwritten.

**Solution**:
1. Invalidate profile cache after any profile update:
```tsx
// In each step's handleContinue:
await updateUserProfile(userProfileId, { ... });
queryClient.invalidateQueries({ queryKey: ["userProfile", userProfileId] });
```

2. Use shorter `staleTime` for profile queries:
```tsx
const { data: currentProfile } = useQuery({
  queryKey: ["userProfile", userProfileId],
  queryFn: () => getUserProfile(userProfileId),
  staleTime: 10000, // 10 seconds - balance between freshness and API calls
  enabled: !!userProfileId,
});
```

3. For step navigation, refetch on mount:
```tsx
const { data: currentProfile, refetch } = useQuery({ ... });

useEffect(() => {
  if (userProfileId) {
    refetch(); // Always get fresh data when step mounts
  }
}, [userProfileId, refetch]);
```

---

### BUG-010: Unvalidated Stripe metadata

- **File**: `src/app/onboarding/step5.tsx` lines 82-87
- **Description**: Metadata passed to Stripe checkout session (userProfileId, names) isn't validated against what was actually saved to backend. If there's a desync, Stripe webhook will have incorrect metadata.
- **User Impact**: Webhook processing might link payment to wrong user or create data inconsistencies.

**Solution**:
1. Fetch fresh profile data before creating checkout session:
```tsx
const createCheckoutSession = async () => {
  // Get fresh profile data from server
  const profileResult = await getUserProfile(userProfileId);
  if (!profileResult.success) {
    throw new Error("Could not verify profile");
  }
  const profile = profileResult.data;

  // Use server data for metadata, not form data
  const response = await fetch("/api/checkout/session", {
    method: "POST",
    body: JSON.stringify({
      metadata: {
        userProfileId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email, // Server's record
      }
    }),
  });
};
```

2. In the API route, validate that the profile exists before creating session:
```tsx
// In /api/checkout/session/route.ts
const profile = await apiClient.get(`/user-profiles/${metadata.userProfileId}`);
if (!profile) {
  return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
}
```

---

## Low - Poor Error Messaging / Edge Cases

### BUG-011: Generic error messages don't help users

- **File**: `src/app/onboarding/actions.ts` lines 138-143, 169-175
- **Description**: `updateUserProfile` and `getUserProfile` catch errors but return generic "Failed to..." messages. Network errors aren't distinguished from API validation errors or 404s.
- **User Impact**: Users see generic error messages without actionable information about what went wrong or how to fix it.

**Solution**:
1. Create typed error responses:
```tsx
type ApiError = {
  type: 'network' | 'validation' | 'not_found' | 'server' | 'unknown';
  message: string;
  details?: Record<string, string>;
};

function parseApiError(error: unknown, response?: Response): ApiError {
  if (!navigator.onLine) {
    return { type: 'network', message: 'No internet connection. Please check your network.' };
  }

  if (response?.status === 404) {
    return { type: 'not_found', message: 'Profile not found. Please start over.' };
  }

  if (response?.status === 400) {
    return { type: 'validation', message: 'Invalid data. Please check your inputs.' };
  }

  if (response?.status && response.status >= 500) {
    return { type: 'server', message: 'Server error. Please try again in a few minutes.' };
  }

  return { type: 'unknown', message: 'Something went wrong. Please try again.' };
}
```

2. Return structured errors from actions:
```tsx
export async function updateUserProfile(id: string, updates: ProfileUpdates) {
  try {
    const response = await fetch(`${API_BASE_URL}/user-profiles/${id}`, { ... });
    if (!response.ok) {
      return { success: false, error: parseApiError(null, response) };
    }
    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
```

---

### BUG-012: No validation on completed steps merge

- **File**: `src/app/onboarding/onboarding.utils.ts` lines 32-45
- **Description**: `mergeCompletedSteps` accepts any array and merges it without validation. Unknown step names are silently included. Corrupted step data from API persists.
- **User Impact**: Corrupted step data could cause logic errors in `getIncompleteStepIndex`, sending users to wrong steps.

**Solution**:
1. Validate step names before merging:
```tsx
const VALID_STEPS = new Set([
  "PERSONAL",
  "SKIN_TYPE",
  "SKIN_CONCERNS",
  "ALLERGIES",
  "SUBSCRIBE",
  "BOOKING",
]);

export function mergeCompletedSteps(
  currentSteps: string[] | null | undefined,
  newSteps: string[],
): string[] {
  const existing = (currentSteps || []).filter(s => VALID_STEPS.has(s));
  const validated = newSteps.filter(s => VALID_STEPS.has(s));
  const merged = Array.from(new Set([...existing, ...validated]));

  return merged.sort((a, b) => {
    const indexA = STEP_ORDER.indexOf(a);
    const indexB = STEP_ORDER.indexOf(b);
    return indexA - indexB;
  });
}
```

2. Log warnings for invalid steps (helps debugging):
```tsx
const invalidExisting = (currentSteps || []).filter(s => !VALID_STEPS.has(s));
const invalidNew = newSteps.filter(s => !VALID_STEPS.has(s));
if (invalidExisting.length || invalidNew.length) {
  console.warn("Invalid step names filtered:", { invalidExisting, invalidNew });
}
```

---

### BUG-013: Type mismatch in schema

- **File**: `src/app/onboarding/onboarding.types.ts` lines 49-50
- **Description**: The `OnboardingSchema` type defines `allergies: string[]` and `allergyOther: string`, but the actual Zod schema uses `hasAllergy: enum` and `allergy: string`.
- **User Impact**: TypeScript checking is incorrect; potential runtime failures if wrong types are used.

**Solution**:
1. Remove the manual type definition and infer from Zod schema:
```tsx
// In onboarding.schema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  // ... all fields
  hasAllergy: z.enum(["Yes", "No"]).optional(),
  allergy: z.string().optional(),
});

// Export inferred type
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
```

2. Delete the duplicate type definition in `onboarding.types.ts` or re-export from schema:
```tsx
// In onboarding.types.ts
export type { OnboardingSchema } from "./onboarding.schema";
```

---

### BUG-014: Duplicate profile creation possible

- **File**: `src/app/onboarding/step1.tsx` lines 93-107
- **Description**: After `setIsCreating(true)`, if network is slow and React Strict Mode unmounts/remounts, `isCreating` could reset to false, allowing duplicate form submissions.
- **User Impact**: Duplicate profile creation attempts or orphaned profiles in database.

**Solution**:
1. Use a ref to track submission state (persists across re-renders):
```tsx
const isSubmittingRef = useRef(false);

const handleContinue = async () => {
  if (isSubmittingRef.current) return; // Prevent duplicate
  isSubmittingRef.current = true;
  setIsCreating(true); // For UI

  try {
    const result = await createUserProfile(input);
    // ... handle result
  } finally {
    isSubmittingRef.current = false;
    setIsCreating(false);
  }
};
```

2. Add idempotency on the backend - use email+phone as unique constraint and return existing profile if duplicate:
```tsx
// Backend pseudo-code
const existing = await db.userProfile.findUnique({
  where: { email_phone: { email, phoneNumber } }
});
if (existing) {
  return existing; // Return existing instead of creating duplicate
}
```

See [React docs on cleanup](https://react.dev/reference/react/useEffect) for handling async operations safely.

---

## External Dependency Risks

### BUG-015: Calendly postMessage dependency

- **File**: `src/app/onboarding/step6.tsx` lines 156-219
- **Description**: The entire booking completion flow relies on Calendly sending a `postMessage` event. If Calendly has partial outage (widget works but events don't fire), or user closes browser before event fires, the profile update never happens.
- **User Impact**: User successfully books in Calendly but app never knows about it. No fallback mechanism (e.g., webhook) exists.
- **Note**: Calendly had a 1.5 hour outage on January 12, 2026. This risk is real.

**Solution**:
1. **Add Calendly webhook as primary source of truth** (see [Calendly webhook docs](https://developer.calendly.com/receive-data-from-scheduled-events-in-real-time-with-webhook-subscriptions)):

```tsx
// Create API route: /api/webhooks/calendly/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Verify webhook signature
  const signature = req.headers.get("calendly-webhook-signature");
  const body = await req.text();
  const hash = crypto
    .createHmac("sha256", process.env.CALENDLY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.event === "invitee.created") {
    const email = payload.payload.invitee.email;

    // Find user by email and update
    const profile = await findProfileByEmail(email);
    if (profile) {
      await updateUserProfile(profile.id, {
        hasCompletedBooking: true,
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE", "BOOKING"],
        isCompleted: true,
        completedAt: new Date().toISOString(),
        calendlyEventUri: payload.payload.event.uri,
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

2. **Register webhook subscription** with Calendly API:
```bash
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/webhooks/calendly",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": "https://api.calendly.com/organizations/YOUR_ORG",
    "scope": "organization"
  }'
```

3. **Keep postMessage as optimistic UI update** - show success immediately, but webhook is the reliable backend update.

4. **Add reconciliation job** (optional) - periodically check Calendly API for bookings that weren't recorded.

---

## Priority Order for Fixes

1. **BUG-001, BUG-002, BUG-003** - Silent failures that leave users unable to complete onboarding
2. **BUG-015** - Add Calendly webhook as fallback for booking confirmation
3. **BUG-004, BUG-005, BUG-006** - Users getting stuck with no recovery
4. **BUG-007, BUG-008, BUG-009** - Data consistency issues
5. **BUG-011** - Better error messages for debugging
6. **Remaining bugs** - Edge cases and type cleanup

---

## References

- [TanStack Query Retry Documentation](https://tanstack.com/query/v4/docs/framework/react/guides/query-retries)
- [TanStack Query Important Defaults](https://tanstack.com/query/v3/docs/framework/react/guides/important-defaults)
- [Calendly Webhook Documentation](https://developer.calendly.com/receive-data-from-scheduled-events-in-real-time-with-webhook-subscriptions)
- [Stripe + Next.js Best Practices](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/)
- [Stripe Webhooks Guide](https://www.magicbell.com/blog/stripe-webhooks-guide)
- [React useEffect Documentation](https://react.dev/reference/react/useEffect)
- [Fixing Race Conditions in React](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
- [libphonenumber-js Documentation](https://www.npmjs.com/package/libphonenumber-js)
