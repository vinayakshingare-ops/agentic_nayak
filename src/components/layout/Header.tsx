"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Utensils,
  LineChart,
  Dumbbell,
  ShoppingCart,
  Bot,
  Flame,
  User as UserIcon,
  LogOut,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  userName?: string;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Rahul Sharma",
  streakDays = 5,
}) => {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  // If on landing or auth, show a simpler marketing header
  const isMarketing =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding");

  if (isMarketing) {
    return (
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Vitalis<span className="text-emerald-600">.</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Personal Health Companion
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Create My Plan
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: HeartPulse },
    { href: "/diet", label: "Diet Plan", icon: Utensils },
    { href: "/progress", label: "Progress", icon: LineChart },
    { href: "/tracking", label: "Tracking", icon: Sliders },
    { href: "/exercise", label: "Workouts", icon: Dumbbell },
    { href: "/grocery", label: "Grocery", icon: ShoppingCart },
    { href: "/assistant", label: "AI Assistant", icon: Bot, isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Vitalis<span className="text-emerald-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : link.isSpecial
                      ? "text-emerald-600 hover:bg-emerald-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {link.isSpecial && (
                    <Sparkles className="w-3 h-3 text-amber-500 ml-0.5 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side status & Profile */}
        <div className="flex items-center gap-3">
          {/* Consistency Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold"
            title={`${streakDays} days active streak`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                {userName.charAt(0)}
              </div>
              <span className="hidden lg:inline-block text-xs font-semibold text-slate-700">
                {userName.split(" ")[0]}
              </span>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{userName}</p>
                  <p className="text-[11px] text-slate-500">demo@vitalis.health</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Health Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  App Settings
                </Link>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
