import { stripeWebhookHandler } from "./handler";

export async function POST(request: Request) {
  return stripeWebhookHandler(request);
}
