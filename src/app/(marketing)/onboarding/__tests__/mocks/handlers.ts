// MSW handlers for external API
import { http, HttpResponse } from "msw";

// Mock user profile data
const mockUserProfile = {
  id: "test-profile-123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "+254712345678",
  dateOfBirth: "1990-01-01T00:00:00.000Z",
  skinType: null,
  concerns: null,
  hasAllergies: null,
  allergyDetails: null,
  isSubscribed: false,
  hasCompletedBooking: false,
  completedSteps: [] as string[],
  isCompleted: false,
  completedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// In-memory store for test data
let profileStore: typeof mockUserProfile = { ...mockUserProfile };

export const handlers = [
  // POST /api/user-profiles - Create profile
  http.post("http://localhost:3001/api/user-profiles", async ({ request }) => {
    const body = (await request.json()) as {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      dateOfBirth: string;
    };

    // Simulate duplicate email check
    if (body.email === "duplicate@example.com") {
      return HttpResponse.json(
        {
          error:
            "This email is already registered. Please log in or use a different email.",
        },
        { status: 409 },
      );
    }

    // Simulate duplicate phone check
    if (body.phoneNumber === "+254700000000") {
      return HttpResponse.json(
        {
          error:
            "This phone number is already registered. Please log in or use a different phone number.",
        },
        { status: 409 },
      );
    }

    // Add delay to simulate network request (so tests can catch loading state)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Create new profile
    profileStore = {
      id: `profile-${Date.now()}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      dateOfBirth: body.dateOfBirth,
      skinType: null,
      concerns: null,
      hasAllergies: null,
      allergyDetails: null,
      isSubscribed: false,
      hasCompletedBooking: false,
      completedSteps: ["PERSONAL"] as string[],
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(profileStore, { status: 201 });
  }),

  // GET /api/user-profiles/:id - Get profile by ID
  http.get("http://localhost:3001/api/user-profiles/:id", ({ params }) => {
    const { id } = params;

    if (id === "not-found") {
      return HttpResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return HttpResponse.json(profileStore);
  }),

  // PATCH /api/user-profiles/:id - Update profile
  http.patch(
    "http://localhost:3001/api/user-profiles/:id",
    async ({ request, params }) => {
      const { id } = params;
      const body = (await request.json()) as Partial<typeof mockUserProfile>;

      if (id === "not-found") {
        return HttpResponse.json(
          { error: "Profile not found" },
          { status: 404 },
        );
      }

      // Add delay to simulate network request (so tests can catch loading state)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update profile store
      profileStore = {
        ...profileStore,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json(profileStore);
    },
  ),

  // GET /api/user-profiles/check - Check if user exists
  http.get("http://localhost:3001/api/user-profiles/check", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const phoneNumber = url.searchParams.get("phoneNumber");

    if (email === "duplicate@example.com") {
      return HttpResponse.json({ exists: true, field: "email" });
    }

    if (phoneNumber === "+254700000000") {
      return HttpResponse.json({ exists: true, field: "phoneNumber" });
    }

    return HttpResponse.json({ exists: false });
  }),
];

// Helper to reset profile store
export function resetProfileStore() {
  profileStore = { ...mockUserProfile };
}
