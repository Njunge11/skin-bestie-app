"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCoachWhatsAppUrl } from "../actions/whatsapp-actions";
import { toast } from "sonner";

interface HeaderProps {
  userName: string;
  userEmail: string;
}

export function Header({ userName, userEmail }: HeaderProps) {
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleWhatsAppClick = async () => {
    setIsLoadingWhatsApp(true);

    try {
      const result = await getCoachWhatsAppUrl();

      if (result.success) {
        window.open(result.url, "_blank");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to open WhatsApp. Please try again.");
    } finally {
      setIsLoadingWhatsApp(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        disabled={isLoadingWhatsApp}
        variant="outline"
        className="border-skinbestie-primary text-skinbestie-primary hover:bg-skinbestie-primary hover:text-white mr-2"
      >
        {isLoadingWhatsApp ? "Opening..." : "Message Coach Benji"}
      </Button>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-skinbestie-primary">
          <AvatarFallback className="bg-skinbestie-primary text-white font-semibold">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
