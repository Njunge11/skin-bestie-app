// db/schema.ts
import {
  pgTable,
  serial,
  text,
  boolean,
  date,
  varchar,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const subscriptionEnum = pgEnum("subscription_status", [
  "cancelled",
  "not_yet",
  "active",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 120 }).notNull(),
    lastName: varchar("last_name", { length: 120 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
    skinType: text("skin_type")
      .array()
      .$type<string[]>()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    concerns: text("concerns")
      .array()
      .$type<string[]>()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    hasAllergy: boolean("has_allergy").notNull().default(false),
    allergy: text("allergy"),
    subscription: subscriptionEnum("subscription").notNull().default("not_yet"),
    initialBooking: boolean("initial_booking").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailUnique: { columns: [table.email], unique: true },
    phoneUnique: { columns: [table.phoneNumber], unique: true },
  })
);

// Helpful TS types
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type SubscriptionStatus = (typeof subscriptionEnum.enumValues)[number];
