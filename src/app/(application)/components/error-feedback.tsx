import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ErrorFeedbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorFeedback({
  title = "Oops! Something went wrong",
  message = "We couldn't load your dashboard. Let's try that again.",
  actionLabel = "Try Again",
  onAction = () => window.location.reload(),
}: ErrorFeedbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <Image
        src="/error.svg"
        alt="Error"
        width={200}
        height={200}
        className="mb-6"
      />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <Button
        onClick={onAction}
        size="lg"
        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90"
      >
        {actionLabel}
      </Button>
    </div>
  );
}
