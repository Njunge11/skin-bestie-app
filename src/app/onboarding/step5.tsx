"use client";

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MButton } from "./components/button";
import { PaymentSkeleton } from "./components/payment.skeleton";
import { Lock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { getUserProfile, updateUserProfile } from "./actions";
import {
  mergeCompletedSteps,
  populateFormFromProfile,
} from "./onboarding.utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// Payment type configuration
const PAYMENT_TYPE = process.env.NEXT_PUBLIC_PAYMENT_TYPE || "IN_APP";

// Keep your appearance rules
export const appearance = {
  rules: {
    ".Input": {
      borderRadius: "0.25rem",
      border: "0.5px solid #828282",
      backgroundColor: "#FFFFFF",
      paddingTop: "0.875rem",
      paddingBottom: "0.875rem",
      paddingLeft: "1.3125rem",
      paddingRight: "1.3125rem",
    },
  },
} as const;

type IntentType = "payment" | "setup";

// One place to control the vertical space (skeleton + Stripe share it)
const HEIGHT_CLS = "";

export default function Step5({
  onShowingSuccess,
}: {
  onNext?: () => void;
  onShowingSuccess?: (showing: boolean) => void;
}) {
  const { getValues } = useFormContext<OnboardingSchema>();
  const { next } = useWizard();

  // Get profile data using TanStack Query
  const userProfileId = getValues("userProfileId");
  const { data: currentProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", userProfileId],
    queryFn: async () => {
      if (!userProfileId) return null;
      const result = await getUserProfile(userProfileId);
      return result.success ? result.data : null;
    },
    enabled: !!userProfileId,
  });

  // Fetch checkout session using TanStack Query (replaces useEffect)
  const { data: checkoutSession, error: checkoutError } = useQuery({
    queryKey: ["checkoutSession", currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return null;

      const r = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: currentProfile.email,
          metadata: {
            userProfileId: currentProfile.id,
            firstName: currentProfile.firstName,
            lastName: currentProfile.lastName,
          },
        }),
      });

      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed to start subscription");
      if (!d?.client_secret || !d?.intent_type) {
        throw new Error("Malformed session response");
      }

      return {
        clientSecret: d.client_secret,
        intentType: d.intent_type as IntentType,
        planUnitAmount: d.plan_unit_amount,
        planCurrency: d.plan_currency,
      };
    },
    enabled: !!currentProfile && !currentProfile.isSubscribed,
    retry: false,
    staleTime: Infinity, // Session should only be created once
  });

  // Calculate button text from checkout session
  const buttonText =
    checkoutSession?.planUnitAmount && checkoutSession?.planCurrency
      ? `Subscribe ${new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: String(checkoutSession.planCurrency).toUpperCase(),
        }).format(checkoutSession.planUnitAmount / 100)}`
      : "Subscribe";

  // Notify parent when showing success screen (stable callback with useEffect)
  const isShowingSuccess = !!currentProfile?.isSubscribed;
  useEffect(() => {
    onShowingSuccess?.(isShowingSuccess);
  }, [isShowingSuccess, onShowingSuccess]);

  // If already subscribed, show success screen
  if (currentProfile?.isSubscribed) {
    return (
      <div className="relative p-3">
        <SuccessScreen onNext={() => next()} />
      </div>
    );
  }

  // REDIRECT mode: show simplified UI
  if (PAYMENT_TYPE === "REDIRECT") {
    return (
      <RedirectPaymentUI
        currentProfile={currentProfile ?? null}
        isProfileLoading={isProfileLoading}
        onShowingSuccess={onShowingSuccess}
      />
    );
  }

  // IN_APP mode: existing flow
  return (
    <div className="relative p-3">
      {/* Server error message */}
      {checkoutError && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-800">
            {checkoutError instanceof Error
              ? checkoutError.message
              : "Something went wrong"}
          </p>
        </div>
      )}

      {!checkoutSession ? (
        <div className={`relative w-full ${HEIGHT_CLS}`}>
          <PaymentSkeleton />
        </div>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: checkoutSession.clientSecret, appearance }}
        >
          <Form
            intentType={checkoutSession.intentType}
            buttonText={buttonText}
            userProfileId={userProfileId}
            currentProfile={currentProfile || null}
          />
        </Elements>
      )}
    </div>
  );
}

// Success screen component
function SuccessScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[21rem] space-y-6">
      {/* Success Icon */}
      <div className="relative">
        <CheckCircle2
          className="w-16 h-16 text-green-600"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-[#272B2D]">
          You&apos;re all set!
        </h2>
        <p className="text-base text-[#3F4548] max-w-md">
          Your subscription is active. Finish by booking your first session.
        </p>
      </div>

      {/* CTA Button */}
      <MButton onClick={onNext} showIcon={false}>
        Book first session
      </MButton>
    </div>
  );
}

// REDIRECT mode: simplified UI before redirecting to Stripe Checkout
function RedirectPaymentUI({
  currentProfile,
  isProfileLoading,
  onShowingSuccess,
}: {
  currentProfile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    skinType?: string[] | null;
    concerns?: string[] | null;
    hasAllergies?: boolean | null;
    allergyDetails?: string | null;
    isSubscribed?: boolean | null;
  } | null;
  isProfileLoading: boolean;
  onShowingSuccess?: (showing: boolean) => void;
}) {
  const { setValue } = useFormContext<OnboardingSchema>();
  const { next } = useWizard();
  const searchParams = useSearchParams();
  const paymentCanceled = searchParams.get("payment_canceled") === "true";
  const paymentSuccess = searchParams.get("payment_success") === "true";
  const profileIdFromUrl = searchParams.get("profile_id");

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formPopulatedRef = useRef(false);

  // Poll for subscription status after successful payment
  // Uses TanStack Query's built-in retry with exponential backoff
  const {
    data: subscriptionStatus,
    isPending: isPolling,
    isError: pollingFailed,
  } = useQuery({
    queryKey: ["subscription-status", profileIdFromUrl],
    queryFn: async () => {
      if (!profileIdFromUrl) {
        throw new Error("No profile ID");
      }

      const result = await getUserProfile(profileIdFromUrl);

      if (!result.success) {
        throw new Error("Failed to fetch profile");
      }

      // Throw error if not yet subscribed - triggers retry with exponential backoff
      if (!result.data.isSubscribed) {
        throw new Error("Subscription not yet active");
      }

      return result.data;
    },
    enabled: paymentSuccess && !!profileIdFromUrl,
    retry: 3,
  });

  // Derive loading state: show loader while profile is being fetched after payment return
  const isLoadingProfile = paymentCanceled && isProfileLoading;

  // Derive canceled state: show canceled UI when payment was canceled and profile is loaded
  const showCanceled =
    paymentCanceled && !isProfileLoading && currentProfile !== null;

  // Derive success state: subscription confirmed via polling
  const showSuccess = paymentSuccess && subscriptionStatus?.isSubscribed;

  // Derive polling error state: retries exhausted without subscription confirmation
  const showPollingError = paymentSuccess && pollingFailed;

  // Notify parent when showing success screen
  useEffect(() => {
    onShowingSuccess?.(!!showSuccess);
  }, [showSuccess, onShowingSuccess]);

  // Populate form once when profile loads after payment return (canceled flow)
  // This is a valid useEffect: syncing with external system (React Hook Form)
  useEffect(() => {
    if (paymentCanceled && currentProfile && !formPopulatedRef.current) {
      populateFormFromProfile(
        {
          id: currentProfile.id,
          skinType: currentProfile.skinType,
          concerns: currentProfile.concerns,
          hasAllergies: currentProfile.hasAllergies,
          allergyDetails: currentProfile.allergyDetails,
        },
        setValue,
      );
      formPopulatedRef.current = true;
    }
  }, [paymentCanceled, currentProfile, setValue]);

  const handleSubscribe = async () => {
    if (!currentProfile) return;

    setIsRedirecting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: currentProfile.email,
          metadata: {
            userProfileId: currentProfile.id,
            firstName: currentProfile.firstName,
            lastName: currentProfile.lastName,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      if (data.mode !== "redirect" || !data.url) {
        throw new Error("Invalid checkout response");
      }

      // Redirect to Stripe Checkout
      // Using replace() to prevent back-button loop
      window.location.replace(data.url);
    } catch (err) {
      setIsRedirecting(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  // Show success screen when subscription is confirmed
  if (showSuccess) {
    return (
      <div className="relative p-3">
        <SuccessScreen onNext={() => next()} />
      </div>
    );
  }

  // Show polling/verifying state after successful payment
  if (paymentSuccess && isPolling) {
    return (
      <div className="relative p-3 flex flex-col items-center justify-center min-h-[12rem] space-y-4">
        <Loader2
          className="w-8 h-8 text-skinbestie-landing-pink animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-[#3F4548]">Verifying your subscription...</p>
      </div>
    );
  }

  // Show error state when polling fails (retries exhausted)
  if (showPollingError) {
    return (
      <div className="relative p-3 space-y-4">
        <div className="p-3 bg-red-50 rounded-md" role="alert">
          <p className="text-sm text-red-800">
            Unable to confirm your subscription.
          </p>
        </div>

        <MButton
          type="button"
          onClick={handleSubscribe}
          disabled={isRedirecting || !currentProfile}
          showIcon={false}
        >
          {isRedirecting ? "Redirecting..." : "Try Again"}
        </MButton>

        <div className="flex items-center gap-2 text-xs text-[#3F4548]">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Your payment is secured by Stripe</span>
        </div>
      </div>
    );
  }

  // Show loading state while fetching profile after payment return (canceled flow)
  if (isLoadingProfile) {
    return (
      <div className="relative p-3 flex flex-col items-center justify-center min-h-[12rem] space-y-4">
        <Loader2
          className="w-8 h-8 text-skinbestie-landing-pink animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-[#3F4548]">Retrieving Payment Status...</p>
      </div>
    );
  }

  // Show canceled state after loading completes
  if (showCanceled) {
    return (
      <div className="relative p-3 space-y-4">
        <div className="p-3 bg-amber-50 rounded-md" role="status">
          <p className="text-sm text-amber-800">
            Your payment was canceled. No charges were made.
          </p>
        </div>

        <MButton
          type="button"
          onClick={handleSubscribe}
          disabled={isRedirecting || !currentProfile}
          showIcon={false}
        >
          {isRedirecting ? "Redirecting..." : "Try Again"}
        </MButton>

        <div className="flex items-center gap-2 text-xs text-[#3F4548]">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Your payment is secured by Stripe</span>
        </div>
      </div>
    );
  }

  // Normal state - show subscribe UI
  return (
    <div className="relative p-3 space-y-4">
      <p className="text-sm text-[#3F4548]">
        You&apos;ll be securely redirected to Stripe to complete your payment.
      </p>

      {error && (
        <div className="p-3 bg-red-50 rounded-md" role="alert">
          <p className="text-sm text-red-800">{error}. Please try again.</p>
        </div>
      )}

      <MButton
        type="button"
        onClick={handleSubscribe}
        disabled={isRedirecting || !currentProfile}
        showIcon={false}
      >
        {isRedirecting ? "Redirecting..." : "Subscribe"}
      </MButton>

      <div className="flex items-center gap-2 text-xs text-[#3F4548]">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Your payment is secured by Stripe</span>
      </div>
    </div>
  );
}

function Form({
  intentType,
  buttonText,
  userProfileId,
  currentProfile,
}: {
  intentType: IntentType;
  buttonText: string;
  userProfileId?: string;
  currentProfile: {
    stripeCustomerId?: string;
    completedSteps?: string[];
  } | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Stripe element readiness
  const [peReady, setPeReady] = useState(false);

  const onPEReady = () => {
    setPeReady(true);
  };

  const canSubmit =
    !!stripe && !!elements && peReady && !loading && termsAccepted;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setNotice(null);

    try {
      if (intentType === "payment") {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
        });
        if (error) throw new Error(error.message || "Payment failed");

        if (paymentIntent?.status === "succeeded") {
          // Update profile after successful payment
          if (userProfileId) {
            const completedSteps = mergeCompletedSteps(
              currentProfile?.completedSteps,
              [
                "PERSONAL",
                "SKIN_TYPE",
                "SKIN_CONCERNS",
                "ALLERGIES",
                "SUBSCRIBE",
              ],
            );

            const result = await updateUserProfile(userProfileId, {
              isSubscribed: true,
              completedSteps,
            });

            if (result.success) {
              // Invalidate and refetch the profile
              await queryClient.invalidateQueries({
                queryKey: ["userProfile", userProfileId],
              });
            }
          }

          // Success - component will remount and show success screen
          return;
        }

        setNotice({
          kind: "success",
          text: `Payment status: ${paymentIntent?.status ?? "processing"}`,
        });
      } else {
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          redirect: "if_required",
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
        });
        if (error) throw new Error(error.message || "Setup failed");

        if (setupIntent?.status === "succeeded") {
          // Update profile after successful setup
          if (userProfileId) {
            const completedSteps = mergeCompletedSteps(
              currentProfile?.completedSteps,
              [
                "PERSONAL",
                "SKIN_TYPE",
                "SKIN_CONCERNS",
                "ALLERGIES",
                "SUBSCRIBE",
              ],
            );

            const result = await updateUserProfile(userProfileId, {
              isSubscribed: true,
              completedSteps,
            });

            if (result.success) {
              // Invalidate and refetch the profile
              await queryClient.invalidateQueries({
                queryKey: ["userProfile", userProfileId],
              });
            }
          }

          // Success - component will remount and show success screen
          return;
        }

        setNotice({
          kind: "success",
          text: `Setup status: ${setupIntent?.status ?? "processing"}`,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setNotice({
        kind: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Show skeleton while loading, payment element when ready */}
      <div className={`relative w-full ${HEIGHT_CLS}`}>
        {!peReady && <PaymentSkeleton />}
        <div style={{ display: peReady ? "block" : "none" }}>
          <PaymentElement
            id="payment-element"
            options={{
              layout: "tabs",
              terms: {
                card: "never",
              },
            }}
            onReady={onPEReady}
          />
        </div>
      </div>

      {notice && (
        <div
          className={
            notice.kind === "error"
              ? "p-3 bg-red-50 border border-red-200 rounded-md"
              : "p-3 bg-green-50 border border-green-200 rounded-md"
          }
          role={notice.kind === "error" ? "alert" : "status"}
        >
          <p
            className={
              notice.kind === "error"
                ? "text-sm text-red-800"
                : "text-sm text-green-800"
            }
          >
            {notice.text}
          </p>
        </div>
      )}

      {/* ✅ Render button + secure copy ONLY after the element is actually ready */}
      {peReady && (
        <>
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-white border-[0.5px] border-[#828282] rounded">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#030303] text-[#030303] focus:ring-[#030303] focus:ring-offset-0 cursor-pointer"
              aria-required="true"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-[#3F4548] cursor-pointer"
            >
              By clicking &quot;Subscribe&quot;, you agree to a monthly
              auto-renewing plan with one coaching call per month plus access to
              our resources, no roll-over of unused calls, and that you can
              cancel any time with effect from the end of your current month
              (see{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030303] transition-opacity"
              >
                Client Terms & Conditions
              </a>
              ).
            </label>
          </div>

          <MButton type="submit" disabled={!canSubmit} showIcon={false}>
            {loading ? "Processing..." : buttonText}
          </MButton>

          <div className="mt-1 flex items-center gap-2 text-xs text-[#3F4548]">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Payments are securely processed by Stripe. We don&apos;t store
              your card details.
            </span>
          </div>
        </>
      )}
    </form>
  );
}
