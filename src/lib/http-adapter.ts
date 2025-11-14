/**
 * Custom NextAuth Adapter for HTTP API Backend
 *
 * Since we're using JWT sessions (not database sessions), we only need
 * to implement the user-related methods. Session methods are not needed.
 */

import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { api } from "./api-client";

export function HttpAdapter(): Adapter {
  return {
    /**
     * Get user by ID
     */
    async getUser(id: string): Promise<AdapterUser | null> {
      try {
        const response = await api.get(`/api/consumer-app/auth/user/${id}`);

        if (!response.user) return null;

        return {
          id: response.user.id,
          email: response.user.email,
          emailVerified: response.user.emailVerified
            ? new Date(response.user.emailVerified)
            : null,
          name: response.user.name,
          image: response.user.image,
        };
      } catch (error) {
        console.error("HttpAdapter: getUser error", error);
        return null;
      }
    },

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      console.log("🔌 [HttpAdapter] getUserByEmail:", email);

      // 404 is a valid response (user not found)
      const response = await api.get(
        `/api/consumer-app/auth/user-by-email?email=${encodeURIComponent(email)}`,
        { allow404: true },
      );

      if (!response.user) {
        console.log("ℹ️  [HttpAdapter] User not found");
        return null;
      }

      console.log("✅ [HttpAdapter] User found:", response.user.id);

      return {
        id: response.user.id,
        email: response.user.email,
        emailVerified: response.user.emailVerified
          ? new Date(response.user.emailVerified)
          : null,
        name: response.user.name,
        image: response.user.image,
      };
    },

    /**
     * Create verification token (magic link or verification code)
     */
    async createVerificationToken({ identifier, token, expires }) {
      try {
        // The backend API handles token creation via separate endpoints
        // This is called by the Resend provider
        await api.post("/api/consumer-app/auth/create-verification-token", {
          identifier,
          token,
          expires: expires.toISOString(),
        });

        return {
          identifier,
          token,
          expires,
        };
      } catch (error) {
        console.error("HttpAdapter: createVerificationToken error", error);
        throw error;
      }
    },

    /**
     * Use/verify verification token
     */
    async useVerificationToken({ identifier, token }) {
      try {
        const response = await api.post(
          "/api/consumer-app/auth/use-verification-token",
          {
            identifier,
            token,
          },
        );

        if (!response.identifier) return null;

        return {
          identifier: response.identifier,
          token,
          expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes (backend manages actual expiry)
        };
      } catch (error) {
        console.error("HttpAdapter: useVerificationToken error", error);
        return null;
      }
    },

    /**
     * Create user - Not needed for our flow since users are created during onboarding
     * But required by Adapter interface
     */
    async createUser(_user) {
      // Users are created via onboarding flow, not via NextAuth
      // If this gets called, it means a user is trying to sign in who doesn't exist
      console.warn(
        "HttpAdapter: createUser called - this should not happen in our flow",
      );
      throw new Error("User creation should happen through onboarding flow");
    },

    /**
     * Update user - Required by adapter interface
     */
    async updateUser(user) {
      try {
        const response = await api.patch(
          `/api/consumer-app/auth/user/${user.id}`,
          {
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified?.toISOString(),
          },
        );

        return {
          id: response.user.id,
          email: response.user.email,
          emailVerified: response.user.emailVerified
            ? new Date(response.user.emailVerified)
            : null,
          name: response.user.name,
          image: response.user.image,
        };
      } catch (error) {
        console.error("HttpAdapter: updateUser error", error);
        throw error;
      }
    },

    /**
     * Delete user - Required by adapter interface but not used
     */
    async deleteUser(userId: string) {
      console.warn("HttpAdapter: deleteUser called for user", userId);
      throw new Error("User deletion not implemented");
    },

    /**
     * Account methods - Not needed since we're not using OAuth
     * But required by Adapter interface
     */
    async linkAccount() {
      throw new Error("linkAccount not implemented - OAuth not supported");
    },
    async unlinkAccount() {
      throw new Error("unlinkAccount not implemented - OAuth not supported");
    },
    async getUserByAccount() {
      return null;
    },

    /**
     * Session methods - Not needed since we use JWT sessions
     * But required by Adapter interface
     */
    async createSession() {
      throw new Error("createSession not needed - using JWT sessions");
    },
    async getSessionAndUser() {
      throw new Error("getSessionAndUser not needed - using JWT sessions");
    },
    async updateSession() {
      throw new Error("updateSession not needed - using JWT sessions");
    },
    async deleteSession() {
      throw new Error("deleteSession not needed - using JWT sessions");
    },
  };
}
