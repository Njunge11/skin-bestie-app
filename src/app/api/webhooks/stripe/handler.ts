import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  updateUserProfile,
  type UserProfileUpdateInput,
} from "@/app/onboarding/actions";

// Result type from actions
type Result<T> = { success: true; data: T } | { success: false; error: string };

export type StripeWebhookDeps = {
  stripe: Stripe;
  updateUserProfile: (
    id: string,
    updates: UserProfileUpdateInput,
  ) => Promise<Result<unknown>>;
  webhookSecret: string;
};

export function makeStripeWebhookHandler(deps: StripeWebhookDeps) {
  return async function handler(request: Request): Promise<Response> {
    console.log("[Stripe Webhook] Received request");

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("[Stripe Webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const body = await request.text();

    let event: Stripe.Event;

    try {
      event = deps.stripe.webhooks.constructEvent(
        body,
        signature,
        deps.webhookSecret,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[Stripe Webhook] Signature verification failed:", message);
      return NextResponse.json(
        { error: `Webhook Error: ${message}` },
        { status: 400 },
      );
    }

    console.log("[Stripe Webhook] Event type:", event.type);

    // Handle specific event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userProfileId = session.metadata?.userProfileId;

      console.log("[Stripe Webhook] Session metadata:", session.metadata);

      if (!userProfileId) {
        console.error(
          "[Stripe Webhook] Missing userProfileId in session metadata",
        );
        return NextResponse.json(
          { error: "Missing userProfileId in session metadata" },
          { status: 400 },
        );
      }

      console.log("[Stripe Webhook] Updating profile:", userProfileId);

      const result = await deps.updateUserProfile(userProfileId, {
        isSubscribed: true,
      });

      if (!result.success) {
        console.error("[Stripe Webhook] Failed to update profile:", result);
        return NextResponse.json(
          { error: "Failed to update user profile" },
          { status: 500 },
        );
      }

      console.log("[Stripe Webhook] Profile updated successfully");
    }

    return NextResponse.json({ received: true }, { status: 200 });
  };
}

// Default dependencies for production
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const defaultDeps: StripeWebhookDeps = {
  stripe,
  updateUserProfile,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

export const stripeWebhookHandler = makeStripeWebhookHandler(defaultDeps);
