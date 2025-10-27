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

type Body = {
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, string>;
};

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
      return NextResponse.json({ error: "Server configuration error: Missing Stripe price ID" }, { status: 500 });
    }

    // Ensure a Customer
    let customerId: string;
    if (customerEmail) {
      const found = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      customerId =
        found.data[0]?.id ??
        (await stripe.customers.create({ email: customerEmail })).id;
    } else {
      customerId = (await stripe.customers.create({})).id;
    }

    // Create Subscription per docs: default_incomplete + expand confirmation_secret
    const sub = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        // (Optionally) limit methods here if you want:
        payment_method_types: ["card"],
      },
      // Recommended for improved behavior on Basil:
      billing_mode: { type: "flexible" },
      metadata,
      expand: [
        "latest_invoice.confirmation_secret",
        "pending_setup_intent", // for $0 due now / trials
      ],
    });

    // latest_invoice is either a string ID or an expanded object.
    const inv =
      typeof sub.latest_invoice === "object" && sub.latest_invoice
        ? sub.latest_invoice
        : null;

    // New path: confirmation_secret holds the client_secret you pass to the frontend
    const confirmationSecret = inv?.confirmation_secret?.client_secret;

    if (confirmationSecret) {
      const price = await stripe.prices.retrieve(priceId);
      return NextResponse.json({
        intent_type: "payment", // you'll confirm a PaymentIntent on the client
        client_secret: confirmationSecret,
        plan_unit_amount: price.unit_amount ?? null,
        plan_currency: price.currency ?? null,
        subscription_id: sub.id,
        customer_id: customerId,
      });
    }

    // Trials / $0 first invoice => SetupIntent flow remains the same
    const si =
      sub.pending_setup_intent && typeof sub.pending_setup_intent === "object"
        ? sub.pending_setup_intent
        : null;

    if (si?.client_secret) {
      const price = await stripe.prices.retrieve(priceId);
      return NextResponse.json({
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
      { status: 400 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
