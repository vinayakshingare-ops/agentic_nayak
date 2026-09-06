"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Utensils,
  PlusCircle,
  LineChart,
  Bot,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const isMarketing =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding");

  if (isMarketing) return null;

  const items = [
    { href: "/dashboard", label: "Today", icon: HeartPulse },
    { href: "/diet", label: "Diet", icon: Utensils },
    { href: "/tracking", label: "Track", icon: PlusCircle, isMain: true },
    { href: "/progress", label: "Progress", icon: LineChart },
    { href: "/assistant", label: "AI Coach", icon: Bot },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 mt-1">
                  Log
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive
                  ? "text-emerald-600 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
