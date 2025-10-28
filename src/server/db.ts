// SERVER-ONLY DB CLIENT — no schema here, no migrations here.

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // uncomment if your host requires SSL
});

export const db = drizzle(pool);

// Optional: prevent accidental client import
export const __server_only__ = true;
