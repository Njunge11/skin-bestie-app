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

// Log pool errors
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

export const db = drizzle(pool, {
  logger: true, // Enable query logging
});

// Optional: prevent accidental client import
export const __server_only__ = true;
