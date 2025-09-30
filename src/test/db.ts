// Test database utility using PGlite
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/db/schema";

let testDb: ReturnType<typeof drizzle<typeof schema>> | null = null;
let pglite: PGlite | null = null;

export async function setupTestDatabase() {
  // Create a new in-memory PGlite instance
  pglite = new PGlite();

  // Create Drizzle instance with PGlite
  testDb = drizzle(pglite, { schema });

  // Push schema to in-memory database (no migrations needed for tests)
  const { sql } = await import("drizzle-orm");
  const { userProfiles } = schema;

  // Create the user_profiles table
  await pglite.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name varchar(120) NOT NULL,
      last_name varchar(120) NOT NULL,
      email varchar(255) NOT NULL,
      phone_number varchar(32) NOT NULL,
      date_of_birth date NOT NULL,
      skin_type text[],
      concerns text[],
      has_allergies boolean,
      allergy_details text,
      is_subscribed boolean,
      has_completed_booking boolean,
      completed_steps text[] NOT NULL DEFAULT ARRAY[]::text[],
      is_completed boolean NOT NULL DEFAULT false,
      completed_at timestamp with time zone,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);
    CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_phone_idx ON user_profiles(phone_number);
  `);

  return testDb;
}

export function getTestDatabase() {
  if (!testDb) {
    throw new Error("Test database not initialized. Call setupTestDatabase() first.");
  }
  return testDb;
}

export async function cleanupTestDatabase() {
  if (pglite) {
    await pglite.close();
    pglite = null;
    testDb = null;
  }
}

export async function clearTestData() {
  if (pglite) {
    await pglite.exec("TRUNCATE TABLE user_profiles CASCADE;");
  }
}
