"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  BookOpen,
  Shield,
  LogOut,
  X,
  ImageIcon,
} from "lucide-react";
import { signOut } from "@/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Photos", href: "/dashboard/photos", icon: ImageIcon },
  { name: "My Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Privacy", href: "/dashboard/privacy", icon: Shield },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Skinbestie"
                className="h-8 w-auto"
                width={120}
                height={32}
              />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-skinbestie-primary-light text-skinbestie-primary"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
