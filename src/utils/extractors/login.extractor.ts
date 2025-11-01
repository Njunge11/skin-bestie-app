export interface LoginContent {
  backgroundCopy: string;
  backgroundImage: {
    sourceUrl: string;
    altText: string;
  };
  formHeading: string;
  formSubheading: string;
}

/**
 * Extracts login page content from WordPress GraphQL response
 * Provides fallback values for all fields
 */
export function extractLoginContent(data: unknown): LoginContent {
  const login = (
    data as {
      page?: {
        login?: {
          backgroundCopy?: string;
          backgroundImage?: { node?: { sourceUrl?: string; altText?: string } };
          formHeading?: string;
          formSubheading?: string;
        };
      };
    }
  )?.page?.login;

  return {
    backgroundCopy:
      login?.backgroundCopy ||
      "Ready to continue your skin journey? Let's get back in.",
    backgroundImage: {
      sourceUrl: login?.backgroundImage?.node?.sourceUrl || "/onboarding.jpg",
      altText: login?.backgroundImage?.node?.altText || "login",
    },
    formHeading: login?.formHeading || "Welcome back, bestie",
    formSubheading:
      login?.formSubheading || "Enter your email to receive a sign-in link",
  };
}
