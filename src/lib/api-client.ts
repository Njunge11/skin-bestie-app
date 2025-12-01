// Simple API client for coach app backend

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
const API_KEY = process.env.API_KEY || "";

export type ApiError = Error & {
  status: number;
};

async function request(
  endpoint: string,
  method: string,
  body?: unknown,
  options?: { allow404?: boolean },
) {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      cache: "no-store",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    // 404 is OK for certain endpoints (e.g., checking if user exists)
    if (!response.ok && !(response.status === 404 && options?.allow404)) {
      console.error("API Error Response:", JSON.stringify(data, null, 2));

      const errorMessage =
        typeof data.error === "string"
          ? data.error
          : data.error?.message ||
            data.message ||
            `Request failed (${response.status})`;

      const error = new Error(errorMessage) as ApiError;
      error.status = response.status;
      throw error;
    }

    console.log("API Response:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      throw error;
    }
    throw new Error("Network error");
  }
}

export const api = {
  get: (endpoint: string, options?: { allow404?: boolean }) =>
    request(endpoint, "GET", undefined, options),
  post: (endpoint: string, body?: unknown, options?: { allow404?: boolean }) =>
    request(endpoint, "POST", body, options),
  patch: (endpoint: string, body?: unknown, options?: { allow404?: boolean }) =>
    request(endpoint, "PATCH", body, options),
  put: (endpoint: string, body?: unknown, options?: { allow404?: boolean }) =>
    request(endpoint, "PUT", body, options),
  delete: (
    endpoint: string,
    body?: unknown,
    options?: { allow404?: boolean },
  ) => request(endpoint, "DELETE", body, options),
};
