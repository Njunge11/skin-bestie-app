import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import React from "react";
import JournalPage from "../../page";
import JournalDetailPage from "../../[id]/page";

/**
 * Renders a component with all required providers
 */
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

/**
 * Renders the main journal page
 */
export function renderJournalPage() {
  return renderWithProviders(<JournalPage />);
}

/**
 * Renders the journal detail page with specific params
 */
export function renderJournalDetailPage(params: { id: string }) {
  // Mock React.use to return the params directly
  const originalUse = React.use;
  React.use = vi.fn((promise: Promise<unknown> | unknown) => {
    // If it's our params promise, return the params directly
    if (promise && typeof (promise as Promise<unknown>).then === "function") {
      return params;
    }
    // Otherwise use original React.use if it exists
    return originalUse ? originalUse(promise as Promise<unknown>) : promise;
  }) as typeof React.use;

  const mockParams = Promise.resolve(params);
  return renderWithProviders(<JournalDetailPage params={mockParams} />);
}
