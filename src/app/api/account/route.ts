// app/api/account/route.ts
import { NextResponse } from "next/server";
import { db, accounts } from "@/db";
import {
  AccountCreateSchema,
  normalizeEmail,
  normalizePhone,
  parseDateOnlyToDate,
} from "@/lib/account";

const badRequest = (body: unknown) => NextResponse.json(body, { status: 400 });
const conflict = (body: unknown) => NextResponse.json(body, { status: 409 });
const created = (body: unknown) => NextResponse.json(body, { status: 201 });

function toPublicAccount(row: typeof accounts.$inferSelect) {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phoneNumber: row.phoneNumber,
    subscription: row.subscription,
    initialBooking: row.initialBooking,
    createdAt: row.createdAt,
  };
}

export async function POST(req: Request) {
  // 1) validate input
  const json = await req.json();
  const parsedRes = AccountCreateSchema.safeParse(json);
  if (!parsedRes.success) {
    return badRequest({
      error: "Invalid input data",
      details: parsedRes.error,
    });
  }
  const parsed = parsedRes.data;

  // 2) normalize
  const email = normalizeEmail(parsed.email);
  const phone = normalizePhone(parsed.phoneNumber);

  // 3) uniqueness (one query covers both email/phone)
  const existing = await db.query.accounts.findFirst({
    columns: {
      id: true,
      email: true,
      phoneNumber: true,
      subscription: true, // ← add
      initialBooking: true, // ← add
    },
    where: (acct, { or, eq }) =>
      or(eq(acct.email, email), eq(acct.phoneNumber, phone)),
  });
  if (existing) {
    const field =
      existing.email === email
        ? "Email"
        : existing.phoneNumber === phone
          ? "Phone number"
          : "Account";
    return conflict({
      error: `${field} is already registered`,
      existing: {
        subscription: existing.subscription,
        initialBooking: existing.initialBooking,
      },
    });
  }

  // 4) insert (typed to prevent TS drift)
  const values: typeof accounts.$inferInsert = {
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    phoneNumber: phone,
    email,
    dateOfBirth: parseDateOnlyToDate(parsed.dateOfBirth), // schema expects Date

    skinType: parsed.skinType,
    concerns: parsed.concerns,

    hasAllergy: parsed.hasAllergy,
    allergy: parsed.hasAllergy ? (parsed.allergy ?? "").trim() || null : null,

    subscription: parsed.subscription ?? "not_yet",
    initialBooking: parsed.initialBooking ?? false,
    // createdAt/updatedAt are DB defaults
  };

  const [row] = await db.insert(accounts).values(values).returning();

  // 5) respond
  return created({ account: toPublicAccount(row) });
}
