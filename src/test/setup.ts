// Test setup file
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { setupTestDatabase, cleanupTestDatabase, clearTestData } from "./db";
import { server } from "@/app/(marketing)/onboarding/__tests__/mocks/server";

// Mock the database to use PGlite for tests
import "./mocks/db";

// Set environment variables for tests
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3001';
process.env.NEXT_PUBLIC_API_KEY = 'test-api-key-123';

// Setup MSW server before all tests
beforeAll(async () => {
  await setupTestDatabase();
  server.listen({ onUnhandledRequest: 'warn' });
});

// Cleanup after all tests
afterAll(async () => {
  await cleanupTestDatabase();
  server.close();
});

// Clear all test data before each test for isolation
beforeEach(async () => {
  await clearTestData();
});

// Reset MSW handlers after each test
afterEach(() => {
  server.resetHandlers();
});
