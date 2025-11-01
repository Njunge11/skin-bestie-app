// src/lib/__tests__/api-client.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { api, type ApiError } from "../api-client";

describe("API Client - Unit Tests", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Stub global fetch
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("api.get", () => {
    it("sends GET request with correct headers and returns data", async () => {
      // Given: Mock fetch to return successful response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "123", name: "Test User" }),
      });

      // When: Call api.get
      const result = await api.get("/api/users/123");

      // Then: Returns parsed data
      expect(result).toEqual({ id: "123", name: "Test User" });

      // Then: Called with correct URL and headers
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/123"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
        }),
      );
    });

    it("throws ApiError with status 404 when resource not found", async () => {
      // Given: Mock 404 response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "User not found" }),
      });

      // When/Then: Throws ApiError with correct status and message
      try {
        await api.get("/api/users/999");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("User not found");
        expect((error as ApiError).status).toBe(404);
      }
    });

    it("throws ApiError with status 401 when unauthorized", async () => {
      // Given: Mock 401 response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid API key" }),
      });

      // When/Then: Throws ApiError with correct status and message
      try {
        await api.get("/api/users/123");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Invalid API key");
        expect((error as ApiError).status).toBe(401);
      }
    });

    it("extracts error message from error.message when error is object", async () => {
      // Given: Mock response with nested error object
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: "Validation failed",
            details: "Email is required",
          },
        }),
      });

      // When/Then: Extracts error.message
      try {
        await api.get("/api/users");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Validation failed");
        expect((error as ApiError).status).toBe(400);
      }
    });

    it("extracts error message from data.message when error field is missing", async () => {
      // Given: Mock response with message field
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal server error" }),
      });

      // When/Then: Extracts data.message
      try {
        await api.get("/api/users");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Internal server error");
        expect((error as ApiError).status).toBe(500);
      }
    });

    it("uses generic error message when no error details provided", async () => {
      // Given: Mock response with no error details
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      // When/Then: Uses generic message with status code
      try {
        await api.get("/api/users");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Request failed (500)");
        expect((error as ApiError).status).toBe(500);
      }
    });

    it("throws Network error when fetch fails", async () => {
      // Given: Mock fetch to throw network error
      fetchMock.mockRejectedValue(new Error("Failed to fetch"));

      // When/Then: Throws generic Network error
      try {
        await api.get("/api/users/123");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect((error as Error).message).toBe("Network error");
      }
    });
  });

  describe("api.post", () => {
    it("sends POST request with body and returns data", async () => {
      // Given: Mock successful post response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ id: "456", email: "new@example.com" }),
      });

      const body = { email: "new@example.com", name: "New User" };

      // When: Call api.post
      const result = await api.post("/api/users", body);

      // Then: Returns created data
      expect(result).toEqual({ id: "456", email: "new@example.com" });

      // Then: Called with correct method and body
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/users"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
          body: JSON.stringify(body),
        }),
      );
    });

    it("sends POST request without body when body is undefined", async () => {
      // Given: Mock successful response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      // When: Call api.post without body
      await api.post("/api/action");

      // Then: Called without body field
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/action"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
        }),
      );

      // Verify body field is not present
      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs).not.toHaveProperty("body");
    });

    it("throws ApiError with status 409 on conflict", async () => {
      // Given: Mock 409 conflict response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: "Email already exists" }),
      });

      // When/Then: Throws ApiError with correct status
      try {
        await api.post("/api/users", { email: "exists@example.com" });
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Email already exists");
        expect((error as ApiError).status).toBe(409);
      }
    });

    it("throws ApiError with status 400 on validation error", async () => {
      // Given: Mock 400 validation error
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid email format" }),
      });

      // When/Then: Throws ApiError
      try {
        await api.post("/api/users", { email: "invalid" });
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Invalid email format");
        expect((error as ApiError).status).toBe(400);
      }
    });
  });

  describe("api.patch", () => {
    it("sends PATCH request with body and returns updated data", async () => {
      // Given: Mock successful patch response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "123", name: "Updated Name" }),
      });

      const updates = { name: "Updated Name" };

      // When: Call api.patch
      const result = await api.patch("/api/users/123", updates);

      // Then: Returns updated data
      expect(result).toEqual({ id: "123", name: "Updated Name" });

      // Then: Called with correct method and body
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/123"),
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
          body: JSON.stringify(updates),
        }),
      );
    });

    it("throws ApiError with status 404 when resource not found", async () => {
      // Given: Mock 404 response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "User not found" }),
      });

      // When/Then: Throws ApiError
      try {
        await api.patch("/api/users/999", { name: "New Name" });
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("User not found");
        expect((error as ApiError).status).toBe(404);
      }
    });
  });

  describe("api.put", () => {
    it("sends PUT request with body and returns replaced data", async () => {
      // Given: Mock successful put response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: "123",
          name: "Replaced",
          email: "replaced@example.com",
        }),
      });

      const replacement = { name: "Replaced", email: "replaced@example.com" };

      // When: Call api.put
      const result = await api.put("/api/users/123", replacement);

      // Then: Returns replaced data
      expect(result).toEqual({
        id: "123",
        name: "Replaced",
        email: "replaced@example.com",
      });

      // Then: Called with correct method and body
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/123"),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
          body: JSON.stringify(replacement),
        }),
      );
    });
  });

  describe("api.delete", () => {
    it("sends DELETE request and returns success response", async () => {
      // Given: Mock successful delete response (backend returns 200 with JSON)
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      // When: Call api.delete
      const result = await api.delete("/api/users/123");

      // Then: Returns success response
      expect(result).toEqual({ success: true });

      // Then: Called with correct method
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/123"),
        expect.objectContaining({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": expect.any(String),
          },
        }),
      );

      // Verify no body field is present
      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs).not.toHaveProperty("body");
    });

    it("throws ApiError with status 404 when resource not found", async () => {
      // Given: Mock 404 response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "User not found" }),
      });

      // When/Then: Throws ApiError
      try {
        await api.delete("/api/users/999");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("User not found");
        expect((error as ApiError).status).toBe(404);
      }
    });
  });

  describe("Error message extraction", () => {
    it("extracts string error from data.error", async () => {
      // Given: Error is a string
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Simple error message" }),
      });

      // When/Then: Uses error string directly
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Simple error message");
      }
    });

    it("extracts nested error message from data.error.message", async () => {
      // Given: Error is an object with message
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: "Nested error message",
            code: "VALIDATION_ERROR",
          },
        }),
      });

      // When/Then: Extracts error.message
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Nested error message");
      }
    });

    it("extracts message from data.message when error is missing", async () => {
      // Given: No error field, but message exists
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "Fallback message" }),
      });

      // When/Then: Uses data.message
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Fallback message");
      }
    });

    it("uses generic message with status code when no error details", async () => {
      // Given: Empty error response
      fetchMock.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      });

      // When/Then: Uses generic message
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown ApiError");
      } catch (error) {
        expect((error as ApiError).message).toBe("Request failed (503)");
        expect((error as ApiError).status).toBe(503);
      }
    });
  });

  describe("Network error handling", () => {
    it("throws Network error when fetch throws non-ApiError", async () => {
      // Given: Fetch throws generic error
      fetchMock.mockRejectedValue(new Error("Connection refused"));

      // When/Then: Converts to generic Network error
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect((error as Error).message).toBe("Network error");
        expect(
          "status" in (error as object)
            ? (error as { status: unknown }).status
            : undefined,
        ).toBeUndefined();
      }
    });

    it("re-throws ApiError when fetch throws ApiError", async () => {
      // Given: Fetch throws error with status (already an ApiError)
      const apiError = new Error("API Error") as ApiError;
      apiError.status = 500;
      fetchMock.mockRejectedValue(apiError);

      // When/Then: Re-throws the ApiError as-is
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect((error as ApiError).message).toBe("API Error");
        expect((error as ApiError).status).toBe(500);
      }
    });

    it("throws Network error when JSON parsing fails", async () => {
      // Given: Response.json() throws parsing error
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      // When/Then: Converts to Network error
      try {
        await api.get("/api/test");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect((error as Error).message).toBe("Network error");
      }
    });
  });

  describe("Request URL building", () => {
    it("builds correct URL from BASE_URL and endpoint", async () => {
      // Given: Mock successful response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      // When: Call api.get
      await api.get("/api/users/123");

      // Then: URL includes both base and endpoint
      const calledUrl = fetchMock.mock.calls[0][0];
      expect(calledUrl).toContain("/api/users/123");
    });

    it("handles endpoint without leading slash", async () => {
      // Given: Mock successful response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      // When: Call with endpoint without leading slash
      await api.get("api/users");

      // Then: Still builds correct URL
      const calledUrl = fetchMock.mock.calls[0][0];
      expect(calledUrl).toContain("api/users");
    });
  });

  describe("HTTP status codes", () => {
    it("handles 400 Bad Request", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Bad request" }),
      });

      try {
        await api.post("/api/test", {});
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as ApiError).status).toBe(400);
      }
    });

    it("handles 401 Unauthorized", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      try {
        await api.get("/api/test");
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as ApiError).status).toBe(401);
      }
    });

    it("handles 404 Not Found", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "Not found" }),
      });

      try {
        await api.get("/api/test");
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as ApiError).status).toBe(404);
      }
    });

    it("handles 409 Conflict", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: "Conflict" }),
      });

      try {
        await api.post("/api/test", {});
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as ApiError).status).toBe(409);
      }
    });

    it("handles 500 Internal Server Error", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      try {
        await api.get("/api/test");
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as ApiError).status).toBe(500);
      }
    });

    it("handles 200 OK success", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const result = await api.get("/api/test");
      expect(result).toEqual({ success: true });
    });

    it("handles 201 Created success", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ id: "new-id" }),
      });

      const result = await api.post("/api/test", {});
      expect(result).toEqual({ id: "new-id" });
    });
  });
});
