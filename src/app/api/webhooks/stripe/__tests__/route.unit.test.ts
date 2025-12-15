import { describe, it, expect, beforeEach, vi } from "vitest";
import Stripe from "stripe";
import { makeStripeWebhookHandler, type StripeWebhookDeps } from "../handler";

describe("Stripe Webhook Handler - Unit Tests", () => {
  // Test UUIDs
  const userProfileId = "550e8400-e29b-41d4-a716-446655440000";
  const subscriptionId = "sub_1234567890";
  const sessionId = "cs_test_1234567890";

  let mockDeps: StripeWebhookDeps;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDeps = {
      stripe: {
        webhooks: {
          constructEvent: vi.fn(),
        },
      } as unknown as Stripe,
      updateUserProfile: vi.fn().mockResolvedValue({ success: true }),
      webhookSecret: "whsec_test_secret",
    };
  });

  // Helper to create a mock checkout.session.completed event
  function makeCheckoutSessionCompletedEvent(
    metadata: Record<string, string> = { userProfileId },
  ): Stripe.Event {
    return {
      id: "evt_test_123",
      type: "checkout.session.completed",
      data: {
        object: {
          id: sessionId,
          subscription: subscriptionId,
          metadata,
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;
  }

  describe("Signature Verification", () => {
    it("returns 400 when stripe-signature header is missing", async () => {
      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          // No stripe-signature header
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("Missing stripe-signature header");
    });

    it("returns 400 when signature verification fails", async () => {
      vi.mocked(mockDeps.stripe.webhooks.constructEvent).mockImplementation(
        () => {
          throw new Error("Signature verification failed");
        },
      );

      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "invalid_signature",
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("Webhook Error");
    });
  });

  describe("checkout.session.completed event", () => {
    it("updates user profile isSubscribed to true and returns 200", async () => {
      const event = makeCheckoutSessionCompletedEvent();
      vi.mocked(mockDeps.stripe.webhooks.constructEvent).mockReturnValue(event);

      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "valid_signature",
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(200);
      expect(mockDeps.updateUserProfile).toHaveBeenCalledWith(userProfileId, {
        isSubscribed: true,
      });
    });

    it("returns 400 when userProfileId is missing from metadata", async () => {
      const event = makeCheckoutSessionCompletedEvent({}); // Empty metadata
      vi.mocked(mockDeps.stripe.webhooks.constructEvent).mockReturnValue(event);

      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "valid_signature",
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("Missing userProfileId in session metadata");
    });
  });

  describe("Unhandled events", () => {
    it("returns 200 OK for unhandled event types", async () => {
      const event: Stripe.Event = {
        id: "evt_test_456",
        type: "invoice.paid",
        data: {
          object: {} as Stripe.Invoice,
        },
      } as Stripe.Event;
      vi.mocked(mockDeps.stripe.webhooks.constructEvent).mockReturnValue(event);

      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "valid_signature",
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(200);
      expect(mockDeps.updateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("returns 500 when profile update fails", async () => {
      const event = makeCheckoutSessionCompletedEvent();
      vi.mocked(mockDeps.stripe.webhooks.constructEvent).mockReturnValue(event);
      vi.mocked(mockDeps.updateUserProfile).mockResolvedValue({
        success: false,
        error: "Database error",
      });

      const handler = makeStripeWebhookHandler(mockDeps);

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "valid_signature",
        },
      });

      const response = await handler(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("Failed to update user profile");
    });
  });
});
