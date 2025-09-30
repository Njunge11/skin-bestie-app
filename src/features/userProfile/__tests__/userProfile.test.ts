// src/lib/__tests__/userProfile.test.ts
import { describe, it, expect } from "vitest";
import { normalizeEmail, normalizePhone, parseDateOnlyToDate } from "../userProfile.schema";

describe("normalizeEmail", () => {
  it("should convert email to lowercase", () => {
    expect(normalizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
    expect(normalizeEmail("User@Domain.COM")).toBe("user@domain.com");
  });

  it("should trim whitespace", () => {
    expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
    expect(normalizeEmail("\ttest@example.com\n")).toBe("test@example.com");
  });

  it("should trim and lowercase together", () => {
    expect(normalizeEmail("  TEST@EXAMPLE.COM  ")).toBe("test@example.com");
  });
});

describe("normalizePhone", () => {
  it("should trim whitespace", () => {
    expect(normalizePhone("  +254712345678  ")).toBe("+254712345678");
    expect(normalizePhone("\t0712345678\n")).toBe("0712345678");
  });

  it("should handle phone without whitespace", () => {
    expect(normalizePhone("+254712345678")).toBe("+254712345678");
  });
});

describe("parseDateOnlyToDate", () => {
  it("should parse YYYY-MM-DD to Date object", () => {
    const result = parseDateOnlyToDate("1995-03-15");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("1995-03-15T00:00:00.000Z");
  });

  it("should handle different dates", () => {
    const result = parseDateOnlyToDate("2000-12-31");
    expect(result.toISOString()).toBe("2000-12-31T00:00:00.000Z");
  });

  it("should handle first day of year", () => {
    const result = parseDateOnlyToDate("2025-01-01");
    expect(result.toISOString()).toBe("2025-01-01T00:00:00.000Z");
  });
});
