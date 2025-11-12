import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "completed" | "pending" | "waiting";

interface StepCardProps {
  stepNumber?: number;
  status: StepStatus;
  title: string;
  description: string;
  children?: React.ReactNode;
  variant?: "default" | "success" | "muted";
  className?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const variantClasses = {
  default: "border-none",
  success: "border-none bg-skinbestie-success",
  muted: "border-none bg-skinbestie-neutral",
};

const statusConfig = {
  completed: {
    badge: {
      variant: "default" as const,
      label: "COMPLETED",
      className:
        "bg-skinbestie-success-dark text-white border-skinbestie-success-dark py-1 leading-none",
    },
    avatarClass: "bg-skinbestie-success-dark",
  },
  pending: {
    badge: {
      variant: "outline" as const,
      label: "PENDING",
      className: "border-orange-400 text-orange-600 py-1 leading-none",
    },
    avatarClass: "bg-gray-200",
  },
  waiting: {
    badge: {
      variant: "outline" as const,
      label: "WAITING",
      className: "border-gray-400 text-gray-600 py-1 leading-none",
    },
    avatarClass: "bg-gray-300",
  },
};

export function StepCard({
  stepNumber,
  status,
  title,
  description,
  children,
  variant = "default",
  className,
  onRefresh,
  isRefreshing = false,
}: StepCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={cn(variantClasses[variant], "gap-2", className)}>
      <CardHeader>
        <Avatar className={config.avatarClass}>
          <AvatarFallback
            className={cn(config.avatarClass, "text-gray-700 font-semibold")}
          >
            {status === "completed" ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              stepNumber
            )}
          </AvatarFallback>
        </Avatar>
        <CardAction className="flex items-center gap-2">
          {status === "waiting" && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              aria-label="Refresh status"
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
            </button>
          )}
          <Badge
            variant={config.badge.variant}
            className={cn(config.badge.className, "w-24 justify-center")}
          >
            {config.badge.label}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm mt-2">
          {description}
        </CardDescription>
        {children}
      </CardContent>
    </Card>
  );
}
