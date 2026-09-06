"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  Activity,
  Droplets,
  Utensils,
  Award,
  Sparkles,
  Calendar,
  Flame,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { calculateWeeklyInsights } from "@/lib/weekly-insights";
import { DailyLog, HealthMetrics, HealthProfile, WeeklyInsights } from "@/types";

export default function ProgressPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "all">("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [logsRes, profileRes] = await Promise.all([
          fetch("/api/logs"),
          fetch("/api/profile"),
        ]);
        const logsData = await logsRes.json();
        const profileData = await profileRes.json();

        setLogs(logsData.logs || []);
        setMetrics(profileData.metrics);
        setProfile(profileData.profile);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !profile || !metrics) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-600">Gathering health trend analytics...</p>
      </div>
    );
  }

  const weeklyInsights: WeeklyInsights = calculateWeeklyInsights(logs);

  // Filter logs for charts based on timeframe
  const sliceCount = timeframe === "7d" ? 7 : timeframe === "30d" ? 14 : timeframe === "90d" ? 14 : 14;
  const chartData = [...logs]
    .slice(0, sliceCount)
    .reverse()
    .map((l) => {
      const dayLabel = new Date(l.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        date: dayLabel,
        weight: l.weightKg,
        targetWeight: profile.targetWeightKg || 74,
        steps: l.steps || 0,
        targetSteps: metrics.targetSteps || 8000,
        waterMl: l.waterMl || 0,
        waterTarget: metrics.waterMl || 2500,
        exerciseMinutes: l.exerciseMinutes || 0,
        wellnessScore: l.wellnessScore || 80,
      };
    });

  const latestWeight = logs[0]?.weightKg || profile.weightKg;
  const startWeight = logs[logs.length - 1]?.weightKg || profile.weightKg;
  const totalWeightDelta = Math.round((latestWeight - startWeight) * 10) / 10;

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Title & Timeframe filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Long-Term Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Your Health & Habit Progress
            </h1>
            <p className="text-xs text-slate-500">
              Consistent tracking creates visible transformations over time.
            </p>
          </div>

          {/* Timeframe pill tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
            {(["7d", "30d", "90d", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === t
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : t === "90d" ? "90 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Insights Summary Banner ("Your Week in Review") */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
              Your Week in Review
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {weeklyInsights.celebrationNote}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <span className="text-xs text-emerald-100 font-medium">Weight Change</span>
              <div className="text-xl font-bold mt-0.5">
                {weeklyInsights.weightChangeKg > 0
                  ? `+${weeklyInsights.weightChangeKg} kg`
                  : `${weeklyInsights.weightChangeKg} kg`}
              </div>
            </div>

            <div>
              <span className="text-xs text-emerald-100 font-medium">Average Steps</span>
              <div className="text-xl font-bold mt-0.5">
                {weeklyInsights.avgStepsPerDay.toLocaleString()} / day
              </div>
            </div>

            <div>
              <span className="text-xs text-emerald-100 font-medium">Hydration Avg</span>
              <div className="text-xl font-bold mt-0.5">
                {Math.round(weeklyInsights.avgWaterMlPerDay / 250)} glasses / day
              </div>
            </div>

            <div>
              <span className="text-xs text-emerald-100 font-medium">Best Day</span>
              <div className="text-xl font-bold mt-0.5">{weeklyInsights.bestDay}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-100">
            <span className="font-bold text-white">Supportive Insight:</span>
            <span>{weeklyInsights.focusAreaNote}</span>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Progress Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Body Weight Trend
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Weight Progress (kg)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Goal:</span>{" "}
                <span className="text-xs font-bold text-emerald-700">
                  {profile.targetWeightKg || 74} kg
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine
                    y={profile.targetWeightKg || 74}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: "Target", fill: "#10b981", fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#059669" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-600 mt-2 text-center">
              Net change: <span className="font-bold text-emerald-700">{totalWeightDelta} kg</span> over this period. Healthy non-extreme pacing.
            </p>
          </Card>

          {/* Daily Steps & Activity Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Daily Movement
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Steps vs Daily Target
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Target: {(metrics.targetSteps || 8000).toLocaleString()}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine
                    y={metrics.targetSteps || 8000}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                  />
                  <Bar
                    dataKey="steps"
                    name="Steps Walked"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 text-center">
              Daily steps boost insulin sensitivity and elevate baseline energy expenditure.
            </p>
          </Card>

          {/* Hydration Bar Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Hydration Consistency
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Water Logged (ml)
                </h3>
              </div>
              <span className="text-xs font-bold text-sky-700">
                Target: {metrics.waterMl} ml
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine
                    y={metrics.waterMl || 2500}
                    stroke="#0284c7"
                    strokeDasharray="4 4"
                  />
                  <Bar
                    dataKey="waterMl"
                    name="Water (ml)"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 text-center">
              Hydration supports enzymatic digestion, cellular waste clearance, and appetite regulation.
            </p>
          </Card>

          {/* Daily Wellness Score Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Holistic Vitality
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Daily Wellness Score Trend
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-700">Out of 100</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wellnessScore"
                    name="Wellness Score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 text-center">
              Wellness Score is an app-generated lifestyle adherence index, not a medical measurement.
            </p>
          </Card>
        </div>

        {/* Streaks & Achievements Section */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Habit Milestones
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Streaks & Consistency Badges
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>5-Day Active Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Habit Igniter", icon: "🔥", desc: "3-day streak", unlocked: true },
              { title: "Consistency Champ", icon: "⚡", desc: "7-day streak", unlocked: true },
              { title: "Hydration Hero", icon: "💧", desc: "5x water target", unlocked: true },
              { title: "10K Steps Club", icon: "🚶", desc: "10k steps logged", unlocked: true },
              { title: "Mindful Eater", icon: "🥗", desc: "85% meal adherence", unlocked: true },
              { title: "30-Day Master", icon: "🏆", desc: "30-day streak", unlocked: false },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  badge.unlocked
                    ? "bg-amber-50/50 border-amber-200 shadow-sm"
                    : "bg-slate-50/60 border-slate-200 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{badge.desc}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                    badge.unlocked
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {badge.unlocked ? "Unlocked" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
