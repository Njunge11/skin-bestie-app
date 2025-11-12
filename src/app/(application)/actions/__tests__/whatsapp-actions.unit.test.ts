import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCoachWhatsAppUrl } from "../whatsapp-actions";

describe("WhatsApp Actions - Unit Tests", () => {
  const originalEnv = process.env.COACH_WHATSAPP_NUMBER;

  beforeEach(() => {
    // Reset environment variable before each test
    delete process.env.COACH_WHATSAPP_NUMBER;
  });

  afterAll(() => {
    // Restore original environment variable
    if (originalEnv) {
      process.env.COACH_WHATSAPP_NUMBER = originalEnv;
    }
  });

  describe("getCoachWhatsAppUrl", () => {
    it("returns WhatsApp URL without message when no message provided", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "254712345678";

      const result = await getCoachWhatsAppUrl();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toBe("https://wa.me/254712345678");
      }
    });

    it("returns WhatsApp URL with encoded message when message provided", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "254712345678";

      const result = await getCoachWhatsAppUrl("Hi Benji, I have a question!");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toBe(
          "https://wa.me/254712345678?text=Hi%20Benji%2C%20I%20have%20a%20question!",
        );
      }
    });

    it("encodes special characters in message correctly", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "254712345678";

      const result = await getCoachWhatsAppUrl(
        "Hi! I'm interested in learning about skin care & treatments.",
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toBe(
          "https://wa.me/254712345678?text=Hi!%20I'm%20interested%20in%20learning%20about%20skin%20care%20%26%20treatments.",
        );
      }
    });

    it("handles multi-line messages with line breaks", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "254712345678";

      const result = await getCoachWhatsAppUrl(
        "Hi Benji,\n\nI have a question about my routine.\n\nThanks!",
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toContain("https://wa.me/254712345678?text=");
        expect(result.url).toContain("%0A"); // Line break encoded
      }
    });

    it("returns error when COACH_WHATSAPP_NUMBER is not configured", async () => {
      // Environment variable is already deleted in beforeEach

      const result = await getCoachWhatsAppUrl();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Contact feature unavailable");
      }
    });

    it("returns error when COACH_WHATSAPP_NUMBER is empty string", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "";

      const result = await getCoachWhatsAppUrl();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Contact feature unavailable");
      }
    });

    it("handles empty message string", async () => {
      process.env.COACH_WHATSAPP_NUMBER = "254712345678";

      const result = await getCoachWhatsAppUrl("");

      expect(result.success).toBe(true);
      if (result.success) {
        // Empty message should return URL without text parameter
        expect(result.url).toBe("https://wa.me/254712345678");
      }
    });

    it("works with international phone numbers from different countries", async () => {
      // UK number
      process.env.COACH_WHATSAPP_NUMBER = "447123456789";

      const result = await getCoachWhatsAppUrl("Test message");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toBe(
          "https://wa.me/447123456789?text=Test%20message",
        );
      }
    });

    it("preserves phone number format exactly as configured", async () => {
      // Test that we don't modify the phone number
      process.env.COACH_WHATSAPP_NUMBER = "1234567890";

      const result = await getCoachWhatsAppUrl();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toBe("https://wa.me/1234567890");
      }
    });
  });
});
