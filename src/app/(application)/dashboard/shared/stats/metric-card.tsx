"use client";

import { LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  encouragement?: string;
  icon: LucideIcon;
  iconColor: "red" | "purple" | "cyan" | "pink" | "yellow" | "blue" | "green";
  iconBgColor: string;
  showProgressBar?: boolean;
  progressPercentage?: number;
  progressBarColor?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  encouragement,
  icon: Icon,
  iconColor,
  iconBgColor,
  showProgressBar = false,
  progressPercentage = 0,
  progressBarColor = "bg-gray-500",
}: MetricCardProps) {
  const iconColorClass = {
    red: "text-red-500",
    purple: "text-purple-500",
    cyan: "text-cyan-500",
    pink: "text-skinbestie-landing-pink",
    yellow: "text-skinbestie-landing-yellow",
    blue: "text-skinbestie-landing-blue",
    green: "text-skinbestie-landing-green",
  }[iconColor];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColorClass}`} />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-sm font-semibold text-muted-foreground">
            {subtitle}
          </p>
        )}
        {showProgressBar && (
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </CardContent>
      {encouragement && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">{encouragement}</p>
        </CardFooter>
      )}
    </Card>
  );
}
