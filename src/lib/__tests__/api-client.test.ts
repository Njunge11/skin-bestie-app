// src/lib/__tests__/api-client.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  apiRequest,
  api,
  HTTP_STATUS,
  isApiError,
  type ApiClientDeps,
} from "../api-client";

describe("API Client - Unit Tests", () => {
  let deps: ApiClientDeps;
  let capturedUrl: string;
  let capturedInit: RequestInit | undefined;

  beforeEach(() => {
    capturedUrl = "";
    capturedInit = undefined;

    deps = {
      fetch: async (url: string, init?: RequestInit) => {
        capturedUrl = url;
        capturedInit = init;
        return new Response(JSON.stringify({ id: "123", name: "Test" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
      config: {
        baseUrl: "https://api.example.com",
        apiKey: "test-key-123",
      },
    };
  });

  describe("apiRequest", () => {
    it("get_withValidEndpoint_returnsData", async () => {
      const result = await apiRequest<{ id: string; name: string }>(
        "/api/users/123",
        { method: "GET" },
        deps
      );

      expect(result).toEqual({ id: "123", name: "Test" });
    });

    it("get_withValidEndpoint_sendsCorrectHeaders", async () => {
      await apiRequest("/api/users/123", { method: "GET" }, deps);

      expect(capturedInit?.headers).toMatchObject({
        "Content-Type": "application/json",
        "x-api-key": "test-key-123",
      });
    });

    it("get_withValidEndpoint_buildsCorrectUrl", async () => {
      await apiRequest("/api/users/123", { method: "GET" }, deps);

      expect(capturedUrl).toBe("https://api.example.com/api/users/123");
    });

    it("post_withBody_sendsJsonBody", async () => {
      const body = { name: "New User", email: "test@example.com" };

      await apiRequest("/api/users", { method: "POST", body }, deps);

      expect(capturedInit?.body).toBe(JSON.stringify(body));
    });

    it("get_withParams_appendsQueryString", async () => {
      await apiRequest(
        "/api/search",
        {
          method: "GET",
          params: { q: "test query", limit: 10, active: true },
        },
        deps
      );

      expect(capturedUrl).toBe(
        "https://api.example.com/api/search?q=test+query&limit=10&active=true"
      );
    });

    it("get_with404Response_throwsErrorWithStatus404", async () => {
      deps.fetch = async () =>
        new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });

      try {
        await apiRequest("/api/users/999", { method: "GET" }, deps);
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("User not found");
        expect(error.status).toBe(404);
      }
    });

    it("post_with409Response_throwsErrorWithStatus409", async () => {
      deps.fetch = async () =>
        new Response(JSON.stringify({ error: "Email already exists" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });

      try {
        await apiRequest(
          "/api/users",
          { method: "POST", body: { email: "test@example.com" } },
          deps
        );
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("Email already exists");
        expect(error.status).toBe(409);
      }
    });

    it("post_with400Response_throwsErrorWithStatus400", async () => {
      deps.fetch = async () =>
        new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });

      try {
        await apiRequest(
          "/api/users",
          { method: "POST", body: { email: "invalid" } },
          deps
        );
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("Invalid data");
        expect(error.status).toBe(400);
      }
    });

    it("get_with401Response_throwsErrorWithStatus401", async () => {
      deps.fetch = async () =>
        new Response(JSON.stringify({ error: "Invalid API key" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });

      try {
        await apiRequest("/api/users", { method: "GET" }, deps);
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("Invalid API key");
        expect(error.status).toBe(401);
      }
    });

    it("get_withNetworkFailure_throwsNetworkError", async () => {
      deps.fetch = async () => {
        throw new Error("Network connection failed");
      };

      try {
        await apiRequest("/api/users", { method: "GET" }, deps);
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("Network error: Network connection failed");
        expect(error.status).toBe(0);
      }
    });

    it("get_withNonJsonResponse_throwsErrorWithTextMessage", async () => {
      deps.fetch = async () =>
        new Response("Internal Server Error", {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });

      try {
        await apiRequest("/api/users", { method: "GET" }, deps);
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toBe("Internal Server Error");
        expect(error.status).toBe(500);
      }
    });
  });

  describe("api convenience methods", () => {
    it("get_callsApiRequestWithGetMethod", async () => {
      const result = await api.get<{ id: string }>("/api/users/123", deps);

      expect(capturedInit?.method).toBe("GET");
      expect(result).toEqual({ id: "123", name: "Test" });
    });

    it("post_callsApiRequestWithPostMethodAndBody", async () => {
      let localCapturedInit: RequestInit | undefined;

      deps.fetch = async (url: string, init?: RequestInit) => {
        localCapturedInit = init;
        return new Response(JSON.stringify({ id: "456" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      };

      const body = { name: "Test" };
      await api.post("/api/users", body, deps);

      expect(localCapturedInit?.method).toBe("POST");
      expect(localCapturedInit?.body).toBe(JSON.stringify(body));
    });

    it("patch_callsApiRequestWithPatchMethod", async () => {
      let localCapturedInit: RequestInit | undefined;

      deps.fetch = async (url: string, init?: RequestInit) => {
        localCapturedInit = init;
        return new Response(JSON.stringify({ updated: true }), { status: 200 });
      };

      await api.patch("/api/users/123", { name: "Updated" }, deps);

      expect(localCapturedInit?.method).toBe("PATCH");
    });

    it("put_callsApiRequestWithPutMethod", async () => {
      let localCapturedInit: RequestInit | undefined;

      deps.fetch = async (url: string, init?: RequestInit) => {
        localCapturedInit = init;
        return new Response(JSON.stringify({ replaced: true }), { status: 200 });
      };

      await api.put("/api/users/123", { name: "Replaced" }, deps);

      expect(localCapturedInit?.method).toBe("PUT");
    });

    it("delete_callsApiRequestWithDeleteMethod", async () => {
      let localCapturedInit: RequestInit | undefined;

      deps.fetch = async (url: string, init?: RequestInit) => {
        localCapturedInit = init;
        return new Response(null, { status: 204 });
      };

      await api.delete("/api/users/123", deps);

      expect(localCapturedInit?.method).toBe("DELETE");
    });
  });

  describe("HTTP_STATUS", () => {
    it("exports_correctStatusCodes", () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.SERVER_ERROR).toBe(500);
    });
  });

  describe("isApiError", () => {
    it("withErrorObjectHavingStatus_returnsTrue", () => {
      const error = { message: "Error", status: 404 };
      expect(isApiError(error)).toBe(true);
    });

    it("withRegularError_returnsFalse", () => {
      const error = new Error("Regular error");
      expect(isApiError(error)).toBe(false);
    });

    it("withNull_returnsFalse", () => {
      expect(isApiError(null)).toBe(false);
    });

    it("withUndefined_returnsFalse", () => {
      expect(isApiError(undefined)).toBe(false);
    });
  });
});
