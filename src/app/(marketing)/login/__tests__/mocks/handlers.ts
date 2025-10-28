// MSW handlers for NextAuth authentication endpoints
import { http, HttpResponse } from 'msw';

// Track email sending state for testing
let emailSentTo: string | null = null;
let shouldFailNextRequest = false;

export const handlers = [
  // POST /api/auth/signin/resend - Request magic link
  http.post('/api/auth/signin/resend', async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const callbackUrl = formData.get('callbackUrl') as string;

    // Simulate network error if flag is set
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      return HttpResponse.error();
    }

    // Check if email exists in the system (simulate user check)
    if (email === 'newuser@example.com') {
      // User doesn't exist - should not allow sign in
      return HttpResponse.json(
        {
          error: 'User not found',
          url: '/login?error=UserNotFound'
        },
        { status: 401 }
      );
    }

    // Simulate successful email send with delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Store the email that was sent to
    emailSentTo = email;

    // Return success response
    return HttpResponse.json({
      ok: true,
      status: 200,
      url: `/verify-request?provider=resend&type=email`
    });
  }),

  // GET /api/auth/session - Get current session
  http.get('/api/auth/session', () => {
    // Return null session for unauthenticated users
    return HttpResponse.json({
      user: null,
      expires: null
    });
  }),

  // GET /api/auth/providers - Get available providers
  http.get('/api/auth/providers', () => {
    return HttpResponse.json({
      resend: {
        id: 'resend',
        name: 'Email',
        type: 'email',
        signinUrl: '/api/auth/signin/resend',
        callbackUrl: '/api/auth/callback/resend'
      }
    });
  }),

  // GET /api/auth/csrf - Get CSRF token
  http.get('/api/auth/csrf', () => {
    return HttpResponse.json({
      csrfToken: 'test-csrf-token-12345'
    });
  }),

  // Simulate magic link callback (for testing redirect after auth)
  http.get('/api/auth/callback/resend', ({ request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (token && email) {
      // Simulate successful authentication
      return HttpResponse.redirect('/', 302);
    }

    return HttpResponse.json(
      { error: 'Invalid token' },
      { status: 400 }
    );
  }),
];

// Helper functions for tests
export function getLastEmailSent() {
  return emailSentTo;
}

export function resetEmailState() {
  emailSentTo = null;
  shouldFailNextRequest = false;
}

export function setNextRequestToFail() {
  shouldFailNextRequest = true;
}