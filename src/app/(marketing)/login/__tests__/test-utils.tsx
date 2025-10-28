// Test utilities for login UI tests
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
const mockForward = vi.fn();
const mockRefresh = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    replace: mockReplace,
    prefetch: mockPrefetch,
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}));

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  // Mock session for testing (null = not authenticated)
  const mockSession = null;

  return (
    <SessionProvider session={mockSession}>
      {children}
    </SessionProvider>
  );
}

// Custom render function
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, mockPush, mockBack, mockReplace };

// Helper to clear all mocks
export function clearAllMocks() {
  mockPush.mockClear();
  mockBack.mockClear();
  mockForward.mockClear();
  mockRefresh.mockClear();
  mockReplace.mockClear();
  mockPrefetch.mockClear();
}