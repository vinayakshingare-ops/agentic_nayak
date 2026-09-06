"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sliders,
  Droplets,
  Scale,
  Activity,
  Flame,
  Moon,
  Smile,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DailyLog, HealthMetrics, MoodType } from "@/types";

export default function TrackingPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields for today
  const todayStr = new Date().toISOString().split("T")[0];
  const [logDate, setLogDate] = useState(todayStr);
  const [weightKg, setWeightKg] = useState("82.4");
  const [waterMl, setWaterMl] = useState(2000);
  const [steps, setSteps] = useState(7420);
  const [exerciseMinutes, setExerciseMinutes] = useState(25);
  const [exerciseName, setExerciseName] = useState("Full Body Strength & Core");
  const [sleepHours, setSleepHours] = useState(7.5);
  const [mood, setMood] = useState<MoodType>("great");
  const [energyLevel, setEnergyLevel] = useState(8);
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      const [logsRes, profileRes] = await Promise.all([
        fetch("/api/logs"),
        fetch("/api/profile"),
      ]);
      const logsData = await logsRes.json();
      const profileData = await profileRes.json();

      setLogs(logsData.logs || []);
      setMetrics(profileData.metrics);

      const existingToday = logsData.logs?.find((l: DailyLog) => l.date === todayStr);
      if (existingToday) {
        if (existingToday.weightKg) setWeightKg(String(existingToday.weightKg));
        if (existingToday.waterMl !== undefined) setWaterMl(existingToday.waterMl);
        if (existingToday.steps !== undefined) setSteps(existingToday.steps);
        if (existingToday.exerciseMinutes !== undefined)
          setExerciseMinutes(existingToday.exerciseMinutes);
        if (existingToday.exerciseName) setExerciseName(existingToday.exerciseName);
        if (existingToday.sleepHours !== undefined) setSleepHours(existingToday.sleepHours);
        if (existingToday.mood) setMood(existingToday.mood);
        if (existingToday.energyLevel !== undefined) setEnergyLevel(existingToday.energyLevel);
        if (existingToday.notes) setNotes(existingToday.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        date: logDate,
        weightKg: Number(weightKg) || undefined,
        waterMl: Number(waterMl),
        steps: Number(steps),
        exerciseMinutes: Number(exerciseMinutes),
        exerciseName,
        sleepHours: Number(sleepHours),
        mood,
        energyLevel: Number(energyLevel),
        notes,
        checkInCompleted: true,
      };

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.log) {
        setSaveSuccess(true);
        confetti({ particleCount: 50, spread: 60 });
        // Refresh logs list
        const updated = await fetch("/api/logs").then((r) => r.json());
        if (updated.logs) setLogs(updated.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-600">Loading daily tracker...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Daily Check-In
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Track Daily Metrics
          </h1>
          <p className="text-xs text-slate-500">
            Log your body weight, water, movement, and recovery. Real habits create lasting wellness.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {/* Date selection & success indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-700">Tracking Date:</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Logged Successfully! Wellness score updated.</span>
                </div>
              )}
            </div>

            {/* Metrics Row 1: Weight & Water */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight */}
              <div className="p-4 rounded-2xl bg-warm-50 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-teal-600" />
                  <label className="text-xs font-bold text-slate-900">
                    Body Weight (kg)
                  </label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="e.g. 82.4"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Target: {metrics?.targetSteps ? "74.0 kg" : "--"} • Measure under consistent morning conditions.
                </p>
              </div>

              {/* Water */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <label className="text-xs font-bold text-slate-900">
                      Water Intake (ml)
                    </label>
                  </div>
                  <span className="text-xs font-bold text-sky-700">
                    {Math.round(waterMl / 250)} / {metrics?.waterGlasses || 10} glasses
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    step="50"
                    value={waterMl}
                    onChange={(e) => setWaterMl(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                  <span className="text-xs font-bold text-slate-500">ml</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWaterMl(waterMl + 250)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-sky-700 border border-sky-200 hover:bg-sky-100/50"
                  >
                    +250ml (1 glass)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterMl(waterMl + 500)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-sky-700 border border-sky-200 hover:bg-sky-100/50"
                  >
                    +500ml (Bottle)
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Row 2: Steps & Exercise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Steps */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <label className="text-xs font-bold text-slate-900">Daily Steps</label>
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    Target: {(metrics?.targetSteps || 8000).toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  step="100"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Exercise */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <label className="text-xs font-bold text-slate-900">
                      Exercise Duration (min)
                    </label>
                  </div>
                  <span className="text-xs font-bold text-rose-800">
                    Target: {metrics?.targetExerciseMinutes || 30} min
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="Workout title"
                    className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Metrics Row 3: Sleep & Mood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sleep */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-600" />
                    <label className="text-xs font-bold text-slate-900">
                      Sleep Duration (hours)
                    </label>
                  </div>
                  <span className="text-xs font-bold text-purple-800">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full accent-purple-600 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>4 hrs</span>
                  <span className="text-purple-700 font-bold">7 - 9 hrs (Optimal)</span>
                  <span>12 hrs</span>
                </div>
              </div>

              {/* Mood */}
              <div className="p-4 rounded-2xl bg-warm-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Daily Mood
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "great", icon: "😊", label: "Great" },
                    { id: "good", icon: "🙂", label: "Good" },
                    { id: "okay", icon: "😐", label: "Okay" },
                    { id: "difficult", icon: "😞", label: "Tired" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id as MoodType)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        mood === m.id
                          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg block">{m.icon}</span>
                      <span className="text-[10px] font-bold text-slate-700 block">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reflection & Health Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel today? Note digestion, energy, workout quality, or stressors..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                isLoading={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Daily Log
              </Button>
            </div>
          </Card>
        </form>

        {/* Historical Logs Logbook */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Recent Log History ({logs.length} entries)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Weight</th>
                  <th className="pb-3 font-semibold">Water</th>
                  <th className="pb-3 font-semibold">Steps</th>
                  <th className="pb-3 font-semibold">Workout</th>
                  <th className="pb-3 font-semibold">Sleep</th>
                  <th className="pb-3 font-semibold">Wellness Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {log.weightKg ? `${log.weightKg} kg` : "--"}
                    </td>
                    <td className="py-3 text-sky-700 font-semibold">
                      {Math.round((log.waterMl || 0) / 250)} glasses ({log.waterMl} ml)
                    </td>
                    <td className="py-3 text-amber-700 font-semibold">
                      {(log.steps || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-600">
                      {log.exerciseMinutes} min
                      {log.exerciseName && (
                        <span className="text-[10px] text-slate-400 block">{log.exerciseName}</span>
                      )}
                    </td>
                    <td className="py-3 text-purple-700 font-semibold">{log.sleepHours} hrs</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {log.wellnessScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
