// Simple API client for coach app backend

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
const API_KEY = process.env.API_KEY || "";

export type ApiError = Error & {
  status: number;
};

async function request(endpoint: string, method: string, body?: unknown) {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
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
  get: (endpoint: string) => request(endpoint, "GET"),
  post: (endpoint: string, body?: unknown) => request(endpoint, "POST", body),
  patch: (endpoint: string, body?: unknown) => request(endpoint, "PATCH", body),
  put: (endpoint: string, body?: unknown) => request(endpoint, "PUT", body),
  delete: (endpoint: string) => request(endpoint, "DELETE"),
};
