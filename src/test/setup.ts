// Test setup file
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "@/app/(marketing)/onboarding/__tests__/mocks/server";

// Mock next/font/google since it's not available in test environment
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
    style: { fontFamily: 'Inter' },
  }),
  Anton: () => ({
    className: 'anton',
    style: { fontFamily: 'Anton' },
  }),
}));

// Set environment variables for tests
process.env.API_BASE_URL = 'http://localhost:3001';
process.env.API_KEY = 'test-api-key-123';

// Setup MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});

// Reset MSW handlers after each test
afterEach(() => {
  server.resetHandlers();
});
