"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { anton } from "@/app/fonts";
import { signIn } from "next-auth/react";

interface LoginFormProps {
  emailSent: boolean;
  email: string;
  onEmailSent: (email: string) => void;
  onBackToLogin: () => void;
  formHeading: string;
  formSubheading: string;
}

export default function LoginForm({
  emailSent,
  email,
  onEmailSent,
  onBackToLogin,
  formHeading,
  formSubheading,
}: LoginFormProps) {
  const router = useRouter();

  const handleBack = () => {
    if (emailSent) {
      onBackToLogin();
    } else {
      router.push("/");
    }
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
        {emailSent ? (
          <SuccessScreen email={email} onResend={() => onEmailSent(email)} />
        ) : (
          <EmailForm
            onEmailSent={onEmailSent}
            formHeading={formHeading}
            formSubheading={formSubheading}
          />
        )}
      </div>
    </div>
  );
}

function EmailForm({
  onEmailSent,
  formHeading,
  formSubheading,
}: {
  onEmailSent: (email: string) => void;
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
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("Failed to send magic link. Please try again.");
        setLoading(false);
      } else {
        onEmailSent(email);
      }
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
          {loading ? "Sending..." : "Send sign-in link"}
        </button>
      </form>
    </>
  );
}

function SuccessScreen({ email }: { email: string; onResend: () => void }) {
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setResendError("Failed to resend. Please try again.");
      } else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch {
      setResendError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
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
          We sent a sign-in link to <strong>{email}</strong>. Click the link in
          the email to access your account.
        </p>
      </div>

      {/* Resend and Success Messages */}
      {resendError && (
        <div
          className="w-full p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-800 text-center">{resendError}</p>
        </div>
      )}

      {resendSuccess && (
        <p className="text-sm text-[#3F4548] text-center">
          Email sent successfully!
        </p>
      )}

      {/* Resend Button */}
      <div className="text-center">
        <span className="text-sm text-[#3F4548]">Didn&apos;t receive it? </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-[#030303] font-semibold underline hover:text-[#222118] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? "Resending..." : "Resend sign-in link"}
        </button>
      </div>
    </div>
  );
}
