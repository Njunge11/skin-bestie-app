"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatYouGetModal } from "../components/what-you-get-modal";
import { getCoachWhatsAppUrl } from "../../actions/whatsapp-actions";
import { toast } from "sonner";

interface WhatHappensNextCardProps {
  description: string;
  coachName: string;
}

export function WhatHappensNextCard({
  description,
  coachName,
}: WhatHappensNextCardProps) {
  const [showWhatYouGetModal, setShowWhatYouGetModal] = useState(false);
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false);

  const handleMessageCoach = async () => {
    setIsLoadingWhatsApp(true);

    try {
      const result = await getCoachWhatsAppUrl();

      if (result.success) {
        // Use window.location.href for better iOS PWA compatibility
        window.location.href = result.url;
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to open WhatsApp. Please try again.");
    } finally {
      setIsLoadingWhatsApp(false);
    }
  };

  return (
    <>
      <Card className="bg-skinbestie-primary-light border-none">
        <CardHeader>
          <CardTitle className="text-xl">What Happens Next?</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={handleMessageCoach}
            disabled={isLoadingWhatsApp}
            className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isLoadingWhatsApp ? "Opening..." : `Message Coach ${coachName}`}
          </Button>
          <Button
            onClick={() => setShowWhatYouGetModal(true)}
            variant="outline"
            className="w-full border-skinbestie-primary text-skinbestie-primary mt-2"
          >
            What You Get With Skin Bestie
          </Button>
        </CardContent>
      </Card>

      <WhatYouGetModal
        open={showWhatYouGetModal}
        onOpenChange={setShowWhatYouGetModal}
      />
    </>
  );
}
