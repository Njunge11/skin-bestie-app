"use server";

/**
 * WhatsApp Actions
 *
 * Server actions for generating WhatsApp contact URLs for the coach.
 * Phone number is stored server-side to keep it out of the client bundle.
 */

type SuccessResult = { success: true; url: string };
type ErrorResult = { success: false; error: string };
type Result = SuccessResult | ErrorResult;

/**
 * Get WhatsApp URL for contacting the coach
 *
 * Generates a wa.me URL that opens WhatsApp with the coach's number.
 * Optionally includes a pre-filled message.
 *
 * @param message - Optional pre-filled message text
 * @returns WhatsApp URL or error if not configured
 *
 * @example
 * // Without message
 * const result = await getCoachWhatsAppUrl();
 * // result.url = "https://wa.me/254712345678"
 *
 * @example
 * // With message
 * const result = await getCoachWhatsAppUrl("Hi Benji!");
 * // result.url = "https://wa.me/254712345678?text=Hi%20Benji!"
 */
export async function getCoachWhatsAppUrl(message?: string): Promise<Result> {
  const phoneNumber = process.env.COACH_WHATSAPP_NUMBER;

  if (!phoneNumber) {
    console.error("[WhatsApp] COACH_WHATSAPP_NUMBER not configured");
    return {
      success: false,
      error: "Contact feature unavailable",
    };
  }

  const baseUrl = `https://wa.me/${phoneNumber}`;

  // If message is provided and not empty, add it as query parameter
  if (message && message.trim().length > 0) {
    const encodedMessage = encodeURIComponent(message);
    return {
      success: true,
      url: `${baseUrl}?text=${encodedMessage}`,
    };
  }

  return {
    success: true,
    url: baseUrl,
  };
}
