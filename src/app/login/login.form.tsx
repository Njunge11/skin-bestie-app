"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { anton } from "@/app/fonts";
import { signIn } from "next-auth/react";
import {
  checkProfileStatus,
  sendVerificationEmail,
  verifyCode,
  type ProfileStatusResponse,
} from "@/lib/mock-auth-api";

interface LoginFormProps {
  emailSent: boolean;
  email: string;
  onEmailSent: (email: string) => void;
  onBackToLogin: () => void;
  formHeading: string;
  formSubheading: string;
}

type FormStep = "email" | "code" | "blocked";

export default function LoginForm({
  formHeading,
  formSubheading,
}: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("email");
  const [email, setEmail] = useState("");
  const [profileStatus, setProfileStatus] =
    useState<ProfileStatusResponse | null>(null);

  const handleBack = () => {
    if (step === "code" || step === "blocked") {
      // Go back to email input
      setStep("email");
      setEmail("");
      setProfileStatus(null);
    } else {
      // Go to homepage
      router.push("/");
    }
  };

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("code");
  };

  const handleProfileBlocked = (
    submittedEmail: string,
    status: ProfileStatusResponse,
  ) => {
    setEmail(submittedEmail);
    setProfileStatus(status);
    setStep("blocked");
  };

  return (
    <div className="flex flex-col pt-5 pb-5 px-4 md:px-[30px] bg-skinbestie-landing-white">
      {/* Top bar */}
      <div className="flex justify-start items-baseline">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-[#222118]" />
          <span
            className={`${anton.className} text-2xl font-normal leading-none tracking-tight uppercase text-[#222118]`}
          >
            Back
          </span>
        </button>
      </div>

      {/* Card */}
      <div className="mt-8 mx-auto w-full max-w-[440px] bg-skinbestie-landing-gray p-6 rounded-lg">
        {step === "email" && (
          <EmailForm
            onEmailSubmitted={handleEmailSubmitted}
            onProfileBlocked={handleProfileBlocked}
            formHeading={formHeading}
            formSubheading={formSubheading}
          />
        )}
        {step === "code" && <CodeInputScreen email={email} />}
        {step === "blocked" && (
          <OnboardingBlockedScreen
            email={email}
            profileStatus={profileStatus!}
          />
        )}
      </div>
    </div>
  );
}

function EmailForm({
  onEmailSubmitted,
  onProfileBlocked,
  formHeading,
  formSubheading,
}: {
  onEmailSubmitted: (email: string) => void;
  onProfileBlocked: (email: string, status: ProfileStatusResponse) => void;
  formHeading: string;
  formSubheading: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Check profile status
      const profileStatus = await checkProfileStatus(email);

      // Step 2: Handle different scenarios
      if (!profileStatus.exists) {
        setError("No account found with this email. Please sign up first.");
        setLoading(false);
        return;
      }

      if (!profileStatus.isCompleted) {
        // User exists but onboarding incomplete
        onProfileBlocked(email, profileStatus);
        return;
      }

      // Step 3: Profile is complete - send verification email
      await sendVerificationEmail(email);

      // Also trigger NextAuth magic link (for both options)
      await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      // Move to code input screen
      onEmailSubmitted(email);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1
        className={`${anton.className} text-center text-[2rem] uppercase text-[#222118]`}
      >
        {formHeading}
      </h1>
      <p className="text-center text-lg font-medium text-[#3F4548] pt-2">
        {formSubheading}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-md"
            role="alert"
          >
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#272B2D] mb-2"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{ border: "0.5px solid #828282" }}
            className="w-full px-4 py-3 rounded bg-white text-[#272B2D] placeholder:text-[#878481] focus:outline-none focus:ring-2 focus:ring-[#030303] focus:border-transparent"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-skinbestie-landing-blue text-white py-3 px-6 rounded font-semibold hover:bg-skinbestie-landing-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </>
  );
}

function CodeInputScreen({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Verify the code via mock API
      const result = await verifyCode(email, code);

      if (!result.success) {
        setError(result.error || "Invalid code");
        setLoading(false);
        return;
      }

      // Code is valid - sign in with NextAuth credentials provider
      const signInResult = await signIn("verification-code", {
        email,
        code,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await sendVerificationEmail(email);

      // Also resend magic link
      await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleRequestNewCode = async () => {
    setCode("");
    setError(null);
    await handleResend();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[21rem] space-y-6">
      {/* Success Icon */}
      <div className="relative">
        <CheckCircle2
          className="w-16 h-16 text-green-600"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-[#272B2D]">
          Check your email
        </h2>
        <p className="text-base text-[#3F4548] max-w-md">
          We sent a sign-in link and verification code to{" "}
          <strong>{email}</strong>
        </p>
        <p className="text-sm text-[#3F4548]">
          Click the link in your email or enter the code below:
        </p>
      </div>

      {/* Code Input Form */}
      <form onSubmit={handleVerifyCode} className="w-full space-y-4">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-[#272B2D] mb-2 text-center"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(value);
            }}
            maxLength={6}
            placeholder="123456"
            style={{ border: "0.5px solid #828282" }}
            className="w-full px-4 py-3 rounded bg-white text-[#272B2D] text-center text-2xl tracking-widest placeholder:text-[#878481] focus:outline-none focus:ring-2 focus:ring-[#030303] focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-md"
            role="alert"
          >
            <p className="text-sm text-red-800 text-center">{error}</p>
            {error.toLowerCase().includes("expired") && (
              <button
                type="button"
                onClick={handleRequestNewCode}
                className="mt-2 w-full text-sm text-[#030303] font-semibold underline hover:text-[#222118] transition-colors"
              >
                Request new code
              </button>
            )}
          </div>
        )}

        {resendSuccess && (
          <p className="text-sm text-green-600 text-center">
            New code sent successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-skinbestie-landing-blue text-white py-3 px-6 rounded font-semibold hover:bg-skinbestie-landing-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      {/* Resend Link */}
      <div className="text-center">
        <span className="text-sm text-[#3F4548]">Didn&apos;t receive it? </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-[#030303] font-semibold underline hover:text-[#222118] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? "Resending..." : "Resend email"}
        </button>
      </div>
    </div>
  );
}

function OnboardingBlockedScreen({
  email,
  profileStatus,
}: {
  email: string;
  profileStatus: ProfileStatusResponse;
}) {
  const router = useRouter();

  const missingSteps = [
    "PERSONAL",
    "SKIN_TYPE",
    "SKIN_CONCERNS",
    "ALLERGIES",
    "SUBSCRIPTION",
    "BOOKING",
  ].filter((step) => !profileStatus.completedSteps?.includes(step));

  const stepNames: Record<string, string> = {
    PERSONAL: "Personal Details",
    SKIN_TYPE: "Skin Type",
    SKIN_CONCERNS: "Skin Concerns",
    ALLERGIES: "Allergies",
    SUBSCRIPTION: "Subscription",
    BOOKING: "Booking",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[21rem] space-y-6">
      {/* Warning Icon */}
      <div className="relative">
        <AlertCircle
          className="w-16 h-16 text-amber-600"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-[#272B2D]">
          Complete Your Profile
        </h2>
        <p className="text-base text-[#3F4548]">
          Your email: <strong>{email}</strong>
        </p>
        <p className="text-base text-[#3F4548] max-w-md">
          Please complete your onboarding to access your account.
        </p>
      </div>

      {/* Missing Steps */}
      {missingSteps.length > 0 && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-sm font-medium text-amber-900 mb-2">
            Missing steps:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            {missingSteps.map((step) => (
              <li key={step}>• {stepNames[step]}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => router.push("/onboarding")}
        className="w-full bg-skinbestie-landing-blue text-white py-3 px-6 rounded font-semibold hover:bg-skinbestie-landing-blue/90 transition-colors"
      >
        Complete Onboarding
      </button>
    </div>
  );
}
