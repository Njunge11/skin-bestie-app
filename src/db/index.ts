// db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

const pgPool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false }, // enable if your provider needs SSL
  });

export const db =
  globalForDb.db ??
  drizzle(pgPool, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pgPool;
  globalForDb.db = db;
}

export * from "./schema";
