// lib/account.ts
import { z } from "zod";
import type { SubscriptionStatus } from "@/db";

export const AccountCreateSchema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  phoneNumber: z.string().min(5).max(32),
  email: z.string().email().max(255),

  // Comes from your form as "YYYY-MM-DD"
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  skinType: z.array(z.string()),
  concerns: z.array(z.string()),

  hasAllergy: z.boolean(),
  allergy: z.string().optional().nullable(),

  subscription: z.custom<SubscriptionStatus>().default("not_yet"),
  initialBooking: z.boolean().default(false),
});

export type AccountCreate = z.infer<typeof AccountCreateSchema>;

// Pure helpers
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const normalizePhone = (phone: string) => phone.trim();
export const parseDateOnlyToDate = (yyyyMmDd: string) =>
  // midnight UTC; adjust if you prefer local
  new Date(`${yyyyMmDd}T00:00:00Z`);
