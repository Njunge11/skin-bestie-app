"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ErrorPage } from "@/components/error-page";

const errorMessages: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "Configuration Error",
    message:
      "There is a problem with the server configuration. Please try again later or contact support.",
  },
  AccessDenied: {
    title: "Access Denied",
    message:
      "You do not have permission to sign in. Please contact support if you believe this is an error.",
  },
  Verification: {
    title: "Sign-In Link Invalid",
    message:
      "This link is no longer valid. Please request a new sign-in link to continue.",
  },
  Default: {
    title: "Authentication Error",
    message:
      "Something went wrong during authentication. Please try again or contact support.",
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Debug logging
  console.log("Error param:", error);
  console.log("Error keys available:", Object.keys(errorMessages));
  console.log(
    "Matched error:",
    error && errorMessages[error] ? error : "Default",
  );

  const errorInfo = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <ErrorPage
      title={errorInfo.title}
      message={errorInfo.message}
      primaryAction={{
        label: error === "Verification" ? "Request New Link" : "Try Again",
        href: "/login",
      }}
      secondaryAction={{
        label: "Go to Home",
        href: "/",
      }}
      showErrorCode={error || undefined}
    />
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <ErrorPage
          title="Loading..."
          message="Please wait while we load the error details."
        />
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
