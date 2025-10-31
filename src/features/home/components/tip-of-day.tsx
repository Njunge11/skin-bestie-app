import { Lightbulb } from "lucide-react";

interface TipOfDayProps {
  tip?: string;
}

export function TipOfDay({
  tip = "Always apply sunscreen 15 minutes before going outside for maximum protection.",
}: TipOfDayProps) {
  return (
    <div className="bg-gradient-to-r from-[#D4AF37] to-[#C19B28] p-4 rounded-xl text-white mb-6">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1">Tip of the day</h3>
          <p className="text-sm text-white/90">{tip}</p>
        </div>
      </div>
    </div>
  );
}
