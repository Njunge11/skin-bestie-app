"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useFormContext } from "react-hook-form";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { MButton } from "./components/button";
import { PaymentSkeleton } from "./components/payment.skeleton";
import { Lock, CheckCircle2 } from "lucide-react";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { getUserProfile, updateUserProfile } from "./actions";
import { mergeCompletedSteps } from "./onboarding.utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Keep your appearance rules
export const appearance = {
  rules: {
    ".Input": {
      borderRadius: "0.25rem",
      border: "0.03125rem solid #030303",
      backgroundColor: "#FFFBE5",
      paddingTop: "0.875rem",
      paddingBottom: "0.875rem",
      paddingLeft: "1.3125rem",
      paddingRight: "1.3125rem",
    },
  },
} as const;

type IntentType = "payment" | "setup";

// One place to control the vertical space (skeleton + Stripe share it)
const HEIGHT_CLS = "min-h-[21rem] sm:min-h-[21rem] md:min-h-[21rem]";

export default function Step5({ onNext, onShowingSuccess }: { onNext?: () => void; onShowingSuccess?: (showing: boolean) => void }) {
  const { getValues } = useFormContext<OnboardingSchema>();
  const { next } = useWizard();

  // Get profile data using TanStack Query
  const userProfileId = getValues("userProfileId");
  const { data: currentProfile } = useQuery({
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
          priceId: "price_1SAsSTIbiE06ZB2bOXj4Ce1P",
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
  const buttonText = checkoutSession?.planUnitAmount && checkoutSession?.planCurrency
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

  return (
    <div className="relative p-3">
      {/* Server error message */}
      {checkoutError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-800">
            {checkoutError instanceof Error ? checkoutError.message : "Something went wrong"}
          </p>
        </div>
      )}

      {!checkoutSession ? (
        <div className={`relative w-full ${HEIGHT_CLS}`}>
          <PaymentSkeleton />
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret: checkoutSession.clientSecret, appearance }}>
          <Form
            intentType={checkoutSession.intentType}
            buttonText={buttonText}
            userProfileId={userProfileId}
            currentProfile={currentProfile}
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
          You're all set!
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

function Form({
  intentType,
  buttonText,
  userProfileId,
  currentProfile,
}: {
  intentType: IntentType;
  buttonText: string;
  userProfileId?: string;
  currentProfile: any;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { next } = useWizard();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  // Stripe element readiness & visibility
  const [peReady, setPeReady] = useState(false);
  const [peVisible, setPeVisible] = useState(false); // used only for the fade

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const onPEReady = () => {
    // Stripe iframe reported ready.
    setPeReady(true); // ✅ gate button + secure copy on THIS
    if (prefersReduced) {
      setPeVisible(true); // no animation
      return;
    }
    // Smoothly fade the iframe in (no timers)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPeVisible(true));
    });
  };

  const canSubmit = !!stripe && !!elements && peReady && !loading;

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
              ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE"]
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
              ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE"]
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
    } catch (err: any) {
      setNotice({
        kind: "error",
        text: err?.message || "Payment failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Stable height in both states */}
      <div className={`relative w-full ${HEIGHT_CLS}`} aria-busy={!peReady}>
        {/* Stripe element (fades in) */}
        <div
          data-visible={peVisible || undefined}
          className="h-full opacity-0 data-[visible]:opacity-100 transition-opacity duration-300"
          style={{ visibility: peVisible ? "visible" : "hidden" }}
        >
          <PaymentElement
            id="payment-element"
            options={{ layout: "tabs" }}
            onReady={onPEReady}
          />
        </div>

        {/* Skeleton overlay until visible */}
        {!peVisible && (
          <div className="pointer-events-none absolute inset-0">
            <PaymentSkeleton />
          </div>
        )}
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
              notice.kind === "error" ? "text-sm text-red-800" : "text-sm text-green-800"
            }
          >
            {notice.text}
          </p>
        </div>
      )}

      {/* ✅ Render button + secure copy ONLY after the element is actually ready */}
      {peReady && (
        <>
          <MButton type="submit" disabled={!canSubmit} showIcon={false}>
            {loading ? "Processing..." : buttonText}
          </MButton>

          <div className="mt-1 flex items-center gap-2 text-xs text-[#3F4548]">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Payments are securely processed by Stripe. We don’t store your
              card details.
            </span>
          </div>
        </>
      )}
    </form>
  );
}
