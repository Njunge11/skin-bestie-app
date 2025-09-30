// Test setup file
import { beforeAll, afterAll, beforeEach } from "vitest";
import { setupTestDatabase, cleanupTestDatabase, clearTestData } from "./db";

// Mock the database to use PGlite for tests
import "./mocks/db";

// Setup in-memory test database before all tests
beforeAll(async () => {
  await setupTestDatabase();
});

// Cleanup test database after all tests
afterAll(async () => {
  await cleanupTestDatabase();
});

// Clear all test data before each test for isolation
beforeEach(async () => {
  await clearTestData();
});
