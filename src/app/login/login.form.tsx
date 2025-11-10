"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { anton } from "@/app/fonts";
import { signIn } from "next-auth/react";
import {
  checkUserByEmailAction,
  createVerificationCodeAction,
} from "./actions";

interface ProfileStatusResponse {
  user: {
    id: string;
    email: string;
    emailVerified: string | null;
    name: string | null;
    image: string | null;
  } | null;
  profile: {
    id: string;
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    onboardingComplete: boolean;
  } | null;
}

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnboardingLink, setShowOnboardingLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    console.log("👤 [Login Form] Submitting email:", email);

    setLoading(true);
    setError(null);

    try {
      // Step 1: Check if user exists and get profile status
      console.log("👤 [Login Form] Checking if user exists...");
      const response = await checkUserByEmailAction(email);
      console.log("👤 [Login Form] User check response:", {
        hasUser: !!response.user,
        onboardingComplete: response.profile?.onboardingComplete,
      });

      // Step 2: Handle different scenarios
      if (!response.user) {
        console.log("⚠️  [Login Form] User not found");
        setError(
          "We couldn't find an account with this email. Please check for typos and try again.",
        );
        setShowOnboardingLink(true);
        setLoading(false);
        return;
      }

      if (!response.profile?.onboardingComplete) {
        // User exists but onboarding incomplete
        console.log(
          "⚠️  [Login Form] Onboarding not complete, showing blocked screen",
        );
        onProfileBlocked(email, response);
        return;
      }

      // Step 3: Profile is complete - send verification code
      console.log("📧 [Login Form] Sending verification code...");
      await createVerificationCodeAction(email);
      console.log("✅ [Login Form] Verification code sent");

      // Optionally send magic link if enabled
      if (process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === "true") {
        await signIn("resend", {
          email,
          redirect: false,
          callbackUrl: "/",
        });
      }

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
            {showOnboardingLink && (
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="mt-2 w-full text-left text-sm text-[#030303] font-semibold underline hover:text-[#222118] transition-colors"
              >
                New to SkinBestie? Get started here
              </button>
            )}
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
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const magicLinkEnabled = process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === "true";

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || loading) return;

    console.log("🔐 [Code Input] Signing in with code:", code, "for:", email);

    setLoading(true);
    setError(null);

    try {
      // Sign in with NextAuth - this will verify the code via VerificationCodeProvider
      console.log("🔐 [Code Input] Calling signIn...");
      const response = await signIn("verification-code", {
        email,
        code,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("📊 [Code Input] signIn response:", response);

      // Check if signin was successful - in NextAuth v5 beta, we need to check for absence of error
      // because ok can be true even when there's an error
      if (response && !response.error) {
        console.log("✅ [Code Input] signIn successful, redirecting...");
        router.push("/dashboard");
        return;
      }

      // Sign in failed - show error
      console.error("❌ [Code Input] signIn failed:", response);
      setError("Invalid verification code. Please try again.");
      setLoading(false);
    } catch (err) {
      console.error("❌ [Code Input] Exception during signIn:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setResendSuccess(false);
    setCode(""); // Clear the code input

    try {
      await createVerificationCodeAction(email);

      // Optionally resend magic link if enabled
      if (process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === "true") {
        await signIn("resend", {
          email,
          redirect: false,
          callbackUrl: "/",
        });
      }

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
          {magicLinkEnabled
            ? `We've sent a sign-in link and 6-digit code to `
            : `We've sent a 6-digit code to `}
          <strong>{email}</strong>
        </p>
        <p className="text-sm text-[#3F4548]">
          {magicLinkEnabled
            ? "Click the link or enter your code below to continue"
            : "Enter your code below to continue"}
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
              // Clear error when user starts typing
              if (error) setError(null);
            }}
            maxLength={6}
            placeholder="123456"
            style={{
              border: error ? "1.5px solid #DC2626" : "0.5px solid #828282",
            }}
            className="w-full px-4 py-3 rounded bg-white text-[#272B2D] text-center text-2xl tracking-widest placeholder:text-[#878481] focus:outline-none focus:ring-2 focus:ring-[#030303] focus:border-transparent"
            disabled={loading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "code-error" : undefined}
          />
          {error && (
            <p
              id="code-error"
              className="mt-2 text-sm text-red-600 text-center"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        {resendSuccess && (
          <p className="text-sm text-[#3F4548] text-center">
            Code sent! Check your email.
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
        <h2 className="text-2xl font-semibold text-[#272B2D]">Almost there!</h2>
        <p className="text-base text-[#3F4548] max-w-md">
          Your account <strong>{email}</strong> needs to complete onboarding
          before you can sign in.
        </p>
        <p className="text-sm text-[#3F4548] max-w-md">
          Please use the same email and phone number when completing your
          profile.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => router.push("/onboarding")}
        className="w-full bg-skinbestie-landing-blue text-white py-3 px-6 rounded font-semibold hover:bg-skinbestie-landing-blue/90 transition-colors"
      >
        Continue to onboarding
      </button>
    </div>
  );
}
