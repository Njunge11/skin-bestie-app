// db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

// Only initialize database connection if DATABASE_URL is available
// This prevents build-time errors when DB is not accessible
let pgPool: Pool | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

if (process.env.DATABASE_URL) {
  pgPool =
    globalForDb.pgPool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
      // ssl: { rejectUnauthorized: false }, // enable if your provider needs SSL
    });

  dbInstance =
    globalForDb.db ??
    drizzle(pgPool, {
      schema,
      logger: process.env.NODE_ENV === "development",
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.pgPool = pgPool;
    globalForDb.db = dbInstance;
  }
}

// Export a proxy that throws helpful error if DB is not initialized
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    if (!dbInstance) {
      throw new Error("Database not initialized. DATABASE_URL environment variable is missing.");
    }
    return (dbInstance as any)[prop];
  },
});

export * from "./schema";
