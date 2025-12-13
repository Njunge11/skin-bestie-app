// // app/api/checkout/session/route.ts
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// type Body = {
//   priceId: string;
//   quantity?: number;
//   customerEmail?: string;
//   metadata?: Record<string, string>;
// };

// export async function POST(req: Request) {
//   try {
//     const {
//       priceId,
//       quantity = 1,
//       customerEmail,
//       metadata = {},
//     } = (await req.json()) as Body;

//     if (!priceId) {
//       return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
//     }

//     // Ensure a Customer
//     let customerId: string;
//     if (customerEmail) {
//       const found = await stripe.customers.list({
//         email: customerEmail,
//         limit: 1,
//       });
//       customerId =
//         found.data[0]?.id ??
//         (await stripe.customers.create({ email: customerEmail })).id;
//     } else {
//       customerId = (await stripe.customers.create({})).id;
//     }

//     // Create Subscription and let it create the invoice + PI (or SI)
//     const sub = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: priceId, quantity }],
//       payment_behavior: "default_incomplete", // defer payment to client
//       payment_settings: {
//         // set allowed methods here (NOT on the PI/SI)
//         payment_method_types: ["card"],
//         save_default_payment_method: "on_subscription",
//       },
//       metadata,
//       // Expand to avoid extra fetches
//       expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
//     });

//     // If there’s money due now, Stripe created an invoice with a PaymentIntent
//     const latestInvoice = sub.latest_invoice as Stripe.Invoice | null;
//     const pi = latestInvoice?.payment_intent as Stripe.PaymentIntent | null;

//     if (pi?.client_secret) {
//       const price = await stripe.prices.retrieve(priceId);
//       return NextResponse.json({
//         intent_type: "payment",
//         client_secret: pi.client_secret, // pi_..._secret_...
//         plan_unit_amount: price.unit_amount ?? null,
//         plan_currency: price.currency ?? null,
//         subscription_id: sub.id,
//         customer_id: customerId,
//       });
//     }

//     // Otherwise Stripe created a SetupIntent (e.g., free trial / 0 due now)
//     const si = sub.pending_setup_intent as Stripe.SetupIntent | null;
//     if (si?.client_secret) {
//       const price = await stripe.prices.retrieve(priceId);
//       return NextResponse.json({
//         intent_type: "setup",
//         client_secret: si.client_secret, // seti_..._secret_...
//         plan_unit_amount: price.unit_amount ?? null,
//         plan_currency: price.currency ?? null,
//         subscription_id: sub.id,
//         customer_id: customerId,
//       });
//     }

//     return NextResponse.json(
//       { error: "No client_secret available (PI or SI)" },
//       { status: 400 }
//     );
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: e?.message ?? "Server error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/checkout/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Keep this if your account is on Basil; otherwise you can omit and use the SDK-bundled version.
  apiVersion: "2025-08-27.basil",
});

// Payment type configuration
const PAYMENT_TYPE = process.env.NEXT_PUBLIC_PAYMENT_TYPE || "IN_APP";

type Body = {
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, string>;
};

/**
 * Find existing customer by email or create a new one
 */
async function getOrCreateCustomer(email?: string): Promise<string> {
  if (email) {
    const found = await stripe.customers.list({ email, limit: 1 });
    if (found.data[0]?.id) {
      return found.data[0].id;
    }
    const created = await stripe.customers.create({ email });
    return created.id;
  }
  const created = await stripe.customers.create({});
  return created.id;
}

export async function POST(req: Request) {
  try {
    const {
      quantity = 1,
      customerEmail,
      metadata = {},
    } = (await req.json()) as Body;

    // Read price ID from environment variable
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Stripe price ID" },
        { status: 500 },
      );
    }

    // Get or create customer
    const customerId = await getOrCreateCustomer(customerEmail);

    // REDIRECT mode: Create Checkout Session
    // See: https://docs.stripe.com/billing/subscriptions/build-subscriptions?ui=checkout
    // See: https://docs.stripe.com/api/checkout/sessions/create
    if (PAYMENT_TYPE === "REDIRECT") {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const userProfileId = metadata.userProfileId || "";

      // Create Checkout Session for subscription
      // {CHECKOUT_SESSION_ID} is a template literal that Stripe replaces with the actual session ID
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity }],
        success_url: `${baseUrl}/onboarding?payment_success=true&session_id={CHECKOUT_SESSION_ID}&profile_id=${userProfileId}`,
        cancel_url: `${baseUrl}/onboarding?payment_canceled=true&profile_id=${userProfileId}`,
        metadata,
        subscription_data: {
          metadata: {
            userProfileId, // Attach to subscription for webhook access
          },
        },
      });

      // Get price info for frontend display
      const price = await stripe.prices.retrieve(priceId);

      return NextResponse.json({
        mode: "redirect",
        url: session.url,
        plan_unit_amount: price.unit_amount ?? null,
        plan_currency: price.currency ?? null,
      });
    }

    // IN_APP mode: Create Subscription with default_incomplete
    // This is the existing flow for embedded payment elements
    const sub = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      billing_mode: { type: "flexible" },
      metadata,
      expand: ["latest_invoice.confirmation_secret", "pending_setup_intent"],
    });

    // latest_invoice is either a string ID or an expanded object
    const inv =
      typeof sub.latest_invoice === "object" && sub.latest_invoice
        ? sub.latest_invoice
        : null;

    // confirmation_secret holds the client_secret for the frontend
    const confirmationSecret = inv?.confirmation_secret?.client_secret;

    if (confirmationSecret) {
      const price = await stripe.prices.retrieve(priceId);
      return NextResponse.json({
        mode: "in_app",
        intent_type: "payment",
        client_secret: confirmationSecret,
        plan_unit_amount: price.unit_amount ?? null,
        plan_currency: price.currency ?? null,
        subscription_id: sub.id,
        customer_id: customerId,
      });
    }

    // Trials / $0 first invoice => SetupIntent flow
    const si =
      sub.pending_setup_intent && typeof sub.pending_setup_intent === "object"
        ? sub.pending_setup_intent
        : null;

    if (si?.client_secret) {
      const price = await stripe.prices.retrieve(priceId);
      return NextResponse.json({
        mode: "in_app",
        intent_type: "setup",
        client_secret: si.client_secret,
        plan_unit_amount: price.unit_amount ?? null,
        plan_currency: price.currency ?? null,
        subscription_id: sub.id,
        customer_id: customerId,
      });
    }

    return NextResponse.json(
      {
        error: "No client_secret available (confirmation_secret / SetupIntent)",
      },
      { status: 400 },
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
