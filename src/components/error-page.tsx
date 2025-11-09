import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, LucideIcon } from "lucide-react";

interface ErrorPageProps {
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  showErrorCode?: string;
  icon?: LucideIcon;
  showLogo?: boolean;
}

export function ErrorPage({
  title,
  message,
  primaryAction = { label: "Try Again", href: "/login" },
  secondaryAction = { label: "Go to Home", href: "/" },
  showErrorCode,
  icon: Icon = AlertCircle,
  showLogo = true,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-skinbestie-landing-white">
      {/* Logo */}
      {showLogo && (
        <div className="flex justify-center pt-8 pb-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Skinbestie"
              width={206}
              height={56}
              priority
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(67%) sepia(20%) saturate(1580%) hue-rotate(296deg) brightness(101%) contrast(97%)",
              }}
            />
          </Link>
        </div>
      )}

      {/* Error Card */}
      <div className="flex flex-1 items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-skinbestie-landing-gray p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <Icon className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>

            <p className="mb-6 text-gray-600">{message}</p>

            <div className="flex w-full flex-col gap-3">
              {primaryAction && (
                <Button
                  asChild
                  className="w-full bg-skinbestie-blue hover:bg-skinbestie-blue/90 text-white"
                >
                  <Link href={primaryAction.href}>{primaryAction.label}</Link>
                </Button>
              )}

              {secondaryAction && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              )}
            </div>

            {showErrorCode && (
              <p className="mt-4 text-xs text-gray-400">
                Error code: {showErrorCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
