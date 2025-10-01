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
import { MButton } from "./components/button";
import { PaymentSkeleton } from "./components/payment.skeleton";
import { Lock } from "lucide-react";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { trpc } from "@/trpc/react";
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

export default function Step5({ onNext }: { onNext?: () => void }) {
  const { getValues } = useFormContext<OnboardingSchema>();
  const { next } = useWizard();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentType, setIntentType] = useState<IntentType | null>(null);
  const [buttonText, setButtonText] = useState("Subscribe");
  const [err, setErr] = useState<string | null>(null);

  const didFetchRef = useRef(false);
  const mountedRef = useRef(false);

  // Get profile data
  const userProfileId = getValues("userProfileId");
  const { data: currentProfile } = trpc.userProfile.getById.useQuery(
    { id: userProfileId || "" },
    { enabled: !!userProfileId }
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    if (!currentProfile) return; // Wait for profile data

    didFetchRef.current = true;

    (async () => {
      try {
        setErr(null);

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
        if (!d?.client_secret || !d?.intent_type)
          throw new Error("Malformed session response");
        if (!mountedRef.current) return;

        setClientSecret(d.client_secret);
        setIntentType(d.intent_type as IntentType);

        if (typeof d.plan_unit_amount === "number" && d.plan_currency) {
          const formatted = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: String(d.plan_currency).toUpperCase(),
          }).format(d.plan_unit_amount / 100);
          setButtonText(`Subscribe ${formatted}`);
        } else {
          setButtonText("Subscribe");
        }
      } catch (e: any) {
        if (!mountedRef.current) return;
        setErr(e?.message || "Something went wrong");
      }
    })();
  }, [currentProfile]);

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
      {!clientSecret || !intentType ? (
        <div className={`relative w-full ${HEIGHT_CLS}`}>
          <PaymentSkeleton />
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <Form
            intentType={intentType}
            buttonText={buttonText}
            userProfileId={userProfileId}
            currentProfile={currentProfile}
          />
        </Elements>
      )}

      {err && (
        <p
          className="absolute bottom-3 left-3 right-3 text-sm text-red-600"
          role="alert"
        >
          {err}
        </p>
      )}
    </div>
  );
}

// Success screen component
function SuccessScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[21rem] space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-[#272B2D]">
          Subscription Successful!
        </h2>
        <p className="text-base text-[#3F4548]">
          Your payment was processed successfully.
        </p>
      </div>
      <MButton onClick={onNext} showIcon={false}>
        Continue
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

  const utils = trpc.useUtils();

  // tRPC mutation to update profile after payment
  const updateProfile = trpc.userProfile.update.useMutation({
    onSuccess: () => {
      // Invalidate the profile query to trigger a refetch
      utils.userProfile.getById.invalidate({ id: userProfileId || "" });
    },
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  // Stripe element readiness & visibility
  const [peReady, setPeReady] = useState(false);
  const [peVisible, setPeVisible] = useState(false); // used only for the fade

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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

            await updateProfile.mutateAsync({
              id: userProfileId,
              data: {
                isSubscribed: true,
                completedSteps,
              },
            });
          }

          // Success - component will remount and show success screen
          return;
        }
        if (mounted.current)
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

            await updateProfile.mutateAsync({
              id: userProfileId,
              data: {
                isSubscribed: true,
                completedSteps,
              },
            });
          }

          // Success - component will remount and show success screen
          return;
        }
        if (mounted.current)
          setNotice({
            kind: "success",
            text: `Setup status: ${setupIntent?.status ?? "processing"}`,
          });
      }
    } catch (err: any) {
      if (mounted.current)
        setNotice({
          kind: "error",
          text: err?.message || "Payment failed. Please try again.",
        });
    } finally {
      if (mounted.current) setLoading(false);
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
        <p
          className={
            notice.kind === "error"
              ? "text-sm text-red-600"
              : "text-sm text-green-600"
          }
          role={notice.kind === "error" ? "alert" : "status"}
        >
          {notice.text}
        </p>
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
