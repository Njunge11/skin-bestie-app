import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type DashboardResponse } from "../../dashboard/schemas";

interface ProfileHeaderProps {
  dashboard: DashboardResponse;
}

export function ProfileHeader({ dashboard }: ProfileHeaderProps) {
  const { user } = dashboard;

  // Get full name and initials
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Get skin type
  const skinType =
    user.skinType && user.skinType.length > 0
      ? user.skinType[0].charAt(0).toUpperCase() + user.skinType[0].slice(1)
      : "Not set";

  // Get skin concerns
  const skinConcerns =
    user.concerns && user.concerns.length > 0
      ? user.concerns.join(", ")
      : "Not set";

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;

  return (
    <Card className="p-8 bg-skinbestie-primary-light">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        </div>

        {/* Middle: Name, Email, Phone, Buttons */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-lg text-gray-600 mt-1">{user.email}</p>
            <p className="text-lg text-gray-600">
              {user.phoneNumber || "Not provided"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Edit Profile</Button>
            <Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white">
              Message Coach
            </Button>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="hidden md:block w-[2px] bg-skinbestie-primary/30 self-stretch mx-2"></div>

        {/* Right: Info Grid */}
        <div className="space-y-4">
          <div>
            <span className="text-gray-600">Age: </span>
            <span className="text-gray-900 font-medium">
              {age || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Skin Type: </span>
            <span className="text-gray-900 font-medium">{skinType}</span>
          </div>
          <div>
            <span className="text-gray-600">Skin Concerns: </span>
            <span className="text-gray-900 font-medium">{skinConcerns}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
