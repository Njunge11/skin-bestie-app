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
import { WhatYouGetModal } from "./what-you-get-modal";

interface WhatHappensNextCardProps {
  description: string;
  coachName: string;
}

export function WhatHappensNextCard({
  description,
  coachName,
}: WhatHappensNextCardProps) {
  const [showWhatYouGetModal, setShowWhatYouGetModal] = useState(false);

  return (
    <>
      <Card className="bg-skinbestie-primary-light border-none">
        <CardHeader>
          <CardTitle className="text-xl">What Happens Next?</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Coach {coachName}
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
