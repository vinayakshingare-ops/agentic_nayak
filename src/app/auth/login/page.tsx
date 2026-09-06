"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@vitalis.health");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/demo", { method: "POST" });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Vitalis<span className="text-emerald-600">.</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to view your daily health score, meals, and progress.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 shadow-card border-slate-200/80">
          {/* 1-Click Demo Login Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Want to test immediately?
              </span>
              <p className="text-[11px] text-amber-700">Preloaded with 14-day history</p>
            </div>
            <Button
              size="sm"
              onClick={handleDemoClick}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
            >
              1-Click Demo
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
              isLoading={isLoading}
            >
              Sign In to Vitalis
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-emerald-600 hover:text-emerald-700"
              >
                Create Health Plan
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          Encrypted & private health storage
        </p>
      </div>
    </div>
  );
}
