// src/lib/api-client.ts

/**
 * Generic REST API Client
 *
 * A reusable utility for making REST API calls with built-in
 * error handling, authentication, and type safety.
 *
 * Usage:
 * ```typescript
 * import { api } from '@/lib/api-client';
 *
 * const user = await api.get('/api/users/123');
 * const created = await api.post('/api/users', { name: 'John' });
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
};

export type ApiConfig = {
  baseUrl: string;
  apiKey: string;
};

export type ApiClientDeps = {
  fetch: typeof fetch;
  config: ApiConfig;
};

export type ApiError = {
  message: string;
  status: number;
  response?: any;
};

// ============================================================================
// HTTP Status Constants (plain object, no class)
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

// ============================================================================
// Error Factory (no class, just a factory function)
// ============================================================================

function createApiError(
  message: string,
  status: number,
  response?: any
): ApiError {
  const error = new Error(message) as Error & ApiError;
  error.status = status;
  error.response = response;
  return error;
}

// ============================================================================
// Default Configuration
// ============================================================================

function getDefaultConfig(): ApiConfig {
  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  if (!apiKey) {
    throw new Error('API_KEY is not configured');
  }

  return { baseUrl, apiKey };
}

function getDefaultDeps(): ApiClientDeps {
  return {
    fetch: fetch,
    config: getDefaultConfig(),
  };
}

// ============================================================================
// Core API Client
// ============================================================================

/**
 * Build URL with query parameters
 */
function buildUrl(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  const url = new URL(endpoint, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

/**
 * Generic API request function
 *
 * @param endpoint - API endpoint (e.g., '/api/user-profiles')
 * @param options - Request options (method, body, headers, params)
 * @param deps - Dependencies (fetch, config)
 * @returns Parsed JSON response
 * @throws {ApiError} When request fails
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {},
  deps?: ApiClientDeps
): Promise<T> {
  const { fetch, config } = deps || getDefaultDeps();
  const { method = 'GET', body, headers = {}, params } = options;

  const url = buildUrl(config.baseUrl, endpoint, params);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // Parse response
    let data: any;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();

      // Check if we received HTML (likely a Next.js error page)
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        data = {
          error: response.status === 404
            ? 'The requested endpoint was not found. Please contact support.'
            : 'The server returned an unexpected response. Please try again or contact support.'
        };
      } else {
        data = { error: text || response.statusText };
      }
    }

    // Handle errors
    if (!response.ok) {
      const errorMessage = data.error ||
        (response.status === 404
          ? 'The requested endpoint was not found. Please contact support.'
          : `Server error (${response.status}). Please try again.`);

      throw createApiError(
        errorMessage,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (isApiError(error)) {
      throw error;
    }

    // Network errors
    if (error instanceof Error) {
      throw createApiError(
        `Network error: ${error.message}`,
        0,
        { originalError: error }
      );
    }

    // Unknown errors
    throw createApiError('An unexpected error occurred', 0);
  }
}

// ============================================================================
// Convenience Methods
// ============================================================================

export const api = {
  /**
   * GET request
   */
  get: <T = any>(
    endpoint: string,
    deps?: ApiClientDeps
  ) =>
    apiRequest<T>(endpoint, { method: 'GET' }, deps),

  /**
   * POST request
   */
  post: <T = any>(
    endpoint: string,
    body?: any,
    deps?: ApiClientDeps
  ) =>
    apiRequest<T>(endpoint, { method: 'POST', body }, deps),

  /**
   * PATCH request
   */
  patch: <T = any>(
    endpoint: string,
    body?: any,
    deps?: ApiClientDeps
  ) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }, deps),

  /**
   * PUT request
   */
  put: <T = any>(
    endpoint: string,
    body?: any,
    deps?: ApiClientDeps
  ) =>
    apiRequest<T>(endpoint, { method: 'PUT', body }, deps),

  /**
   * DELETE request
   */
  delete: <T = any>(
    endpoint: string,
    deps?: ApiClientDeps
  ) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, deps),
};

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as any).status === 'number'
  );
}

/**
 * Extract user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
