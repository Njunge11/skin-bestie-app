// Mock the database module to use test database
import { vi } from "vitest";
import { getTestDatabase } from "../db";

// Mock the @/db module
vi.mock("@/db", async () => {
  const actual = await vi.importActual<typeof import("@/db")>("@/db");

  return {
    ...actual,
    get db() {
      return getTestDatabase();
    },
  };
});
