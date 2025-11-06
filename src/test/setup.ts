// Test setup file
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "@/app/onboarding/__tests__/mocks/server";
import { resetProfileStore } from "@/app/onboarding/__tests__/mocks/handlers";

// Import dashboard handlers if they exist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dashboardHandlers: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetDashboardStore: any = null;
// Dashboard handlers are optional - tests can mock server actions directly with vi.mock()

// Mock next/font/google since it's not available in test environment
vi.mock("next/font/google", () => ({
  Inter: () => ({
    className: "inter",
    style: { fontFamily: "Inter" },
  }),
  Anton: () => ({
    className: "anton",
    style: { fontFamily: "Anton" },
  }),
}));

// Mock next/font/local for custom fonts
vi.mock("next/font/local", () => ({
  default: () => ({
    className: "neue-haas-display",
    style: { fontFamily: "Neue Haas Display" },
  }),
}));

// Mock React's useOptimistic (React 19 feature)
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useOptimistic: <State, Action = State>(
      initialValue: State,
      reducer?: (state: State, action: Action) => State,
    ): [State, (action: Action) => void] => {
      const [value, setValue] = actual.useState<State>(initialValue);

      // Create a dispatch function that applies the reducer
      const dispatch = (action: Action) => {
        if (reducer) {
          setValue((currentValue: State) => reducer(currentValue, action));
        } else {
          // When no reducer is provided, Action should be State
          setValue(action as unknown as State);
        }
      };

      return [value, dispatch];
    },
  };
});

// Mock next-auth for all tests
vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
    },
  }),
}));

// Set environment variables for tests
process.env.API_BASE_URL = "http://localhost:3001";
process.env.API_KEY = "test-api-key-123";

// Setup MSW server before all tests
beforeAll(() => {
  // Add dashboard handlers if available
  if (dashboardHandlers) {
    server.use(...dashboardHandlers);
  }
  server.listen({ onUnhandledRequest: "warn" });
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});

// Reset MSW handlers and profile store after each test
afterEach(() => {
  // Reset handlers but keep the dashboard handlers
  if (dashboardHandlers) {
    server.resetHandlers(...dashboardHandlers);
  } else {
    server.resetHandlers();
  }
  resetProfileStore();
  if (resetDashboardStore) {
    resetDashboardStore();
  }
});
