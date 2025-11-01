import { Calendar, Clock, MapPin, Video } from "lucide-react";

interface BookingCardProps {
  title: string;
  date: string;
  time: string;
  duration: string;
  isVirtual?: boolean;
  location?: string;
}

export function BookingCard({
  title,
  date,
  time,
  duration,
  isVirtual = true,
  location = "Virtual consultation via Zoom",
}: BookingCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <h3 className="font-semibold mb-3 text-gray-900">{title}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span>
            {time} • {duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isVirtual ? (
            <Video className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          )}
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
