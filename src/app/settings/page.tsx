"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Bell,
  Download,
  Shield,
  Trash2,
  CheckCircle2,
  Sun,
  Moon,
  Save,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [mealReminders, setMealReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [sleepReminders, setSleepReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          setUnitSystem(data.settings.unitSystem || "metric");
          if (data.settings.notifications) {
            setMealReminders(data.settings.notifications.mealReminders ?? true);
            setWaterReminders(data.settings.notifications.waterReminders ?? true);
            setWorkoutReminders(data.settings.notifications.workoutReminders ?? true);
            setSleepReminders(data.settings.notifications.sleepReminders ?? true);
            setWeeklyDigest(data.settings.notifications.weeklyDigest ?? true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        unitSystem,
        notifications: {
          mealReminders,
          waterReminders,
          workoutReminders,
          sleepReminders,
          weeklyDigest,
        },
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.settings) {
        setSettings(data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/settings?export=true");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vitalis-health-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export data");
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Preferences & Ownership
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              App Settings
            </h1>
            <p className="text-xs text-slate-500">
              Configure measurement units, notification pacing, and export your private health data.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved!</span>
            </div>
          )}
        </div>

        {/* Unit System */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-1">Measurement System</h3>
          <p className="text-xs text-slate-500 mb-4">
            Select your preferred units for body metrics, liquids, and calorie calculations.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setUnitSystem("metric")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                unitSystem === "metric"
                  ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <h4 className="text-xs font-bold text-slate-900">Metric (Standard)</h4>
              <p className="text-[11px] text-slate-500">kg, cm, milliliters, kcal</p>
            </button>

            <button
              type="button"
              onClick={() => setUnitSystem("imperial")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                unitSystem === "imperial"
                  ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <h4 className="text-xs font-bold text-slate-900">Imperial</h4>
              <p className="text-[11px] text-slate-500">lbs, inches, fluid oz, kcal</p>
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Reminders & Notifications</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Gentle notifications designed to keep habits consistent without annoyance.
          </p>

          <div className="space-y-3">
            {[
              {
                label: "Meal & Snack Reminders",
                desc: "Remind 15 minutes before planned breakfast, lunch, and dinner.",
                checked: mealReminders,
                toggle: () => setMealReminders(!mealReminders),
              },
              {
                label: "Hydration Pacing Pings",
                desc: "Gentle nudge to drink water mid-morning and mid-afternoon.",
                checked: waterReminders,
                toggle: () => setWaterReminders(!waterReminders),
              },
              {
                label: "Daily Movement & Workout Reminder",
                desc: "Check-in to complete planned workout of the day.",
                checked: workoutReminders,
                toggle: () => setWorkoutReminders(!workoutReminders),
              },
              {
                label: "Restorative Sleep Wind-down",
                desc: "Bedtime reminder 45 minutes before target sleep hour.",
                checked: sleepReminders,
                toggle: () => setSleepReminders(!sleepReminders),
              },
              {
                label: "Sunday Weekly Wellness Digest",
                desc: "Receive your comprehensive weekly progress review and insights.",
                checked: weeklyDigest,
                toggle: () => setWeeklyDigest(!weeklyDigest),
              },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.label}</h4>
                  <p className="text-[11px] text-slate-500">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={n.checked}
                  onChange={n.toggle}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
              isLoading={isSaving}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Notification Preferences
            </Button>
          </div>
        </Card>

        {/* Data Ownership & Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Data Privacy & Portability</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            You own 100% of your personal health, weight, and diet records.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-warm-50 border border-slate-200/80">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Export Complete Health Records</h4>
              <p className="text-[11px] text-slate-500">
                Download a clean JSON archive containing your full weight history, daily logs, meal plans, and grocery lists.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportData} className="text-xs whitespace-nowrap">
              <Download className="w-3.5 h-3.5 mr-1" />
              Download JSON
            </Button>
          </div>
        </Card>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
