import { Card } from "@/components/ui/card";
import { type DashboardResponse } from "../../dashboard/schemas";

interface ProfileHeaderProps {
  dashboard: DashboardResponse;
}

export function ProfileHeader({ dashboard }: ProfileHeaderProps) {
  const { user } = dashboard;

  // Get display name - nickname is standalone, firstName gets lastName
  const displayName = user.nickname || `${user.firstName} ${user.lastName}`;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-8 bg-skinbestie-primary-light">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <span className="text-lg font-bold text-white">{initials}</span>
          </div>
        </div>

        {/* Name, Email, Phone */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
          <p className="text-lg text-gray-600 mt-1">
            {user.email} • {user.phoneNumber || "Not provided"}
          </p>
        </div>
      </div>
    </Card>
  );
}
