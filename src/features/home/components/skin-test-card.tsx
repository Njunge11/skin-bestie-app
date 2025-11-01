import Link from "next/link";
import { Camera } from "lucide-react";

export function SkinTestCard() {
  return (
    <div className="bg-[#FFF8DC] p-4 rounded-xl mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-[#D4AF37] bg-opacity-20 p-2 rounded-lg">
          <Camera className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Complete your skin test
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Take a photo of your skin for analysis
          </p>
          <Link
            href="/skin-test"
            className="text-sm text-[#D4AF37] font-medium hover:underline"
          >
            Start test →
          </Link>
        </div>
      </div>
    </div>
  );
}
