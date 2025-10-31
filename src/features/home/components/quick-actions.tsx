import Link from "next/link";
import {
  MessageCircle,
  Calendar,
  Book,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
}

const actions: QuickAction[] = [
  {
    icon: MessageCircle,
    label: "Message coach",
    href: "/messages",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Calendar,
    label: "Book session",
    href: "/booking",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Book,
    label: "Skin journal",
    href: "/journal",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: ShoppingBag,
    label: "Products",
    href: "/products",
    color: "bg-pink-50 text-pink-600",
  },
];

export function QuickActions() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Quick actions
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`p-3 rounded-xl ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-600 text-center">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
