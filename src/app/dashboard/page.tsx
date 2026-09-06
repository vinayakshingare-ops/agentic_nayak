"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  HeartPulse,
  Flame,
  Activity,
  Droplets,
  Utensils,
  Scale,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Moon,
  Smile,
  Meh,
  Frown,
  Check,
  RefreshCw,
  Award,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Modal } from "@/components/ui/Modal";
import { DailyLog, HealthMetrics, HealthProfile, MealPlan, MoodType } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [completedMealIds, setCompletedMealIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Modals
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [newSteps, setNewSteps] = useState("");
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [workoutMins, setWorkoutMins] = useState("30");
  const [workoutName, setWorkoutName] = useState("Full Body Workout");

  // Check-in state
  const [checkInMood, setCheckInMood] = useState<MoodType>("great");
  const [checkInEnergy, setCheckInEnergy] = useState(8);
  const [checkInNotes, setCheckInNotes] = useState("");
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const [profileRes, dietRes, logsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/diet"),
        fetch("/api/logs"),
      ]);

      const profileData = await profileRes.json();
      const dietData = await dietRes.json();
      const logsData = await logsRes.json();

      setProfile(profileData.profile);
      setMetrics(profileData.metrics);
      setMealPlan(dietData.mealPlan);

      const todayStr = new Date().toISOString().split("T")[0];
      const today =
        logsData.logs?.find((l: DailyLog) => l.date === todayStr) ||
        logsData.logs?.[0] ||
        null;

      setTodayLog(today);
      setCompletedMealIds(today?.completedMealIds || dietData.completedMealIds || []);

      if (today?.mood) setCheckInMood(today.mood);
      if (today?.energyLevel) setCheckInEnergy(today.energyLevel);
      if (today?.notes) setCheckInNotes(today.notes);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick action: Add water
  const handleAddWater = async (mlToAdd: number) => {
    const currentWater = todayLog?.waterMl || 0;
    const newTotal = currentWater + mlToAdd;

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waterMl: newTotal }),
      });
      const data = await res.json();
      if (data.log) {
        setTodayLog(data.log);
        if (newTotal >= (metrics?.waterMl || 2500) && currentWater < (metrics?.waterMl || 2500)) {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick action: Save weight
  const handleSaveWeight = async () => {
    if (!newWeight) return;
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightKg: Number(newWeight) }),
      });
      const data = await res.json();
      if (data.log) {
        setTodayLog(data.log);
        setWeightModalOpen(false);
        setNewWeight("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick action: Save steps
  const handleSaveSteps = async () => {
    if (!newSteps) return;
    const currentSteps = todayLog?.steps || 0;
    const updatedSteps = currentSteps + Number(newSteps);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: updatedSteps }),
      });
      const data = await res.json();
      if (data.log) {
        setTodayLog(data.log);
        setStepsModalOpen(false);
        setNewSteps("");
        if (updatedSteps >= (metrics?.targetSteps || 10000)) {
          confetti({ particleCount: 75, spread: 70 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick action: Save workout
  const handleSaveWorkout = async () => {
    const currentEx = todayLog?.exerciseMinutes || 0;
    const updatedEx = currentEx + Number(workoutMins);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseMinutes: updatedEx,
          exerciseName: workoutName,
        }),
      });
      const data = await res.json();
      if (data.log) {
        setTodayLog(data.log);
        setWorkoutModalOpen(false);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle meal complete
  const handleToggleMeal = async (mealId: string) => {
    const isCompleted = completedMealIds.includes(mealId);
    const newCompleted = !isCompleted;

    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_eaten",
          mealId,
          completed: newCompleted,
        }),
      });
      const data = await res.json();
      if (data.completedMealIds) {
        setCompletedMealIds(data.completedMealIds);
        if (newCompleted) {
          confetti({ particleCount: 40, spread: 45 });
        }
        // Refetch logs to get updated wellness score
        const logsRes = await fetch("/api/logs");
        const logsData = await logsRes.json();
        const todayStr = new Date().toISOString().split("T")[0];
        const today = logsData.logs?.find((l: DailyLog) => l.date === todayStr) || logsData.logs?.[0];
        if (today) setTodayLog(today);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Daily Check-in
  const handleSaveCheckIn = async () => {
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: checkInMood,
          energyLevel: checkInEnergy,
          notes: checkInNotes,
          checkInCompleted: true,
        }),
      });
      const data = await res.json();
      if (data.log) {
        setTodayLog(data.log);
        setCheckInSaved(true);
        setTimeout(() => setCheckInSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile || !metrics) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <HeartPulse className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Calibrating your health dashboard...
          </p>
        </div>
      </div>
    );
  }

  const todayDayPlan = mealPlan?.days[0];
  const todayMeals = todayDayPlan?.meals || [];
  // Pick the next uncompleted meal or the last one
  const nextMeal = todayMeals.find((m) => !completedMealIds.includes(m.id)) || todayMeals[0];

  const currentWaterMl = todayLog?.waterMl || 0;
  const currentGlasses = Math.round(currentWaterMl / 250);
  const targetGlasses = metrics.waterGlasses || 10;
  const waterPercent = Math.min(100, Math.round((currentWaterMl / metrics.waterMl) * 100));

  const currentSteps = todayLog?.steps || 0;
  const stepsPercent = Math.min(100, Math.round((currentSteps / metrics.targetSteps) * 100));

  const currentEx = todayLog?.exerciseMinutes || 0;
  const exPercent = Math.min(100, Math.round((currentEx / metrics.targetExerciseMinutes) * 100));

  const completedMealsCount = todayMeals.filter((m) => completedMealIds.includes(m.id)).length;
  const caloriesConsumed = todayMeals
    .filter((m) => completedMealIds.includes(m.id))
    .reduce((sum, m) => sum + m.calories, 0);
  const caloriesPercent = Math.min(
    100,
    Math.round((caloriesConsumed / metrics.targetCalories) * 100)
  );

  const proteinConsumed = todayMeals
    .filter((m) => completedMealIds.includes(m.id))
    .reduce((sum, m) => sum + m.protein, 0);
  const proteinPercent = Math.min(
    100,
    Math.round((proteinConsumed / metrics.proteinG) * 100)
  );

  const currentWellnessScore = todayLog?.wellnessScore || 82;

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header userName="Rahul Sharma" streakDays={5} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Greeting & Daily Wellness Score Banner */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Daily Overview
                </span>
                <span className="text-xs text-slate-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good morning, Rahul
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
                You have logged {completedMealsCount} of {todayMeals.length} planned meals and hit{" "}
                {waterPercent}% of your hydration target. Keep this smooth momentum going!
              </p>
            </div>

            {/* Daily Wellness Score Ring */}
            <div className="flex items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <ProgressRing
                radius={48}
                stroke={8}
                progress={currentWellnessScore}
                color="#059669"
                trackColor="#e2e8f0"
              >
                <span className="text-xl font-extrabold text-slate-900">
                  {currentWellnessScore}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">/ 100</span>
              </ProgressRing>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Wellness Index
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {currentWellnessScore >= 85
                    ? "Optimal Vitality"
                    : currentWellnessScore >= 75
                    ? "Strong Momentum"
                    : "Building Consistency"}
                </h4>
                <p className="text-[11px] text-slate-500 max-w-[180px]">
                  Calculated from nutrition, hydration, steps & sleep.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 whitespace-nowrap mr-1">
            Quick Actions:
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddWater(250)}
            className="whitespace-nowrap"
          >
            <Droplets className="w-3.5 h-3.5 mr-1 text-sky-500" />
            +1 Glass (250ml)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddWater(500)}
            className="whitespace-nowrap"
          >
            <Droplets className="w-3.5 h-3.5 mr-1 text-sky-600" />
            +500ml Bottle
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStepsModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Activity className="w-3.5 h-3.5 mr-1 text-amber-500" />
            + Log Steps
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setWorkoutModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" />
            + Log Workout
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setWeightModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Scale className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Update Weight
          </Button>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Calories */}
          <MetricCard
            title="Daily Calories"
            value={caloriesConsumed.toLocaleString()}
            unit={`/ ${metrics.targetCalories.toLocaleString()} kcal`}
            targetText={`${Math.max(0, metrics.targetCalories - caloriesConsumed)} kcal remaining`}
            icon={<Utensils className="w-5 h-5" />}
            iconBgColor="bg-emerald-50 text-emerald-600"
            progressPercent={caloriesPercent}
            progressBarColor="bg-emerald-500"
            subtitle={`${caloriesPercent}% of target`}
          />

          {/* Daily Protein */}
          <MetricCard
            title="Protein Intake"
            value={proteinConsumed}
            unit={`/ ${metrics.proteinG} g`}
            targetText={`${Math.max(0, metrics.proteinG - proteinConsumed)}g to goal`}
            icon={<Utensils className="w-5 h-5" />}
            iconBgColor="bg-teal-50 text-teal-600"
            progressPercent={proteinPercent}
            progressBarColor="bg-teal-500"
            subtitle={`${proteinPercent}% of target`}
          />

          {/* Hydration */}
          <MetricCard
            title="Hydration"
            value={currentGlasses}
            unit={`/ ${targetGlasses} glasses`}
            targetText={`${currentWaterMl} / ${metrics.waterMl} ml`}
            icon={<Droplets className="w-5 h-5" />}
            iconBgColor="bg-sky-50 text-sky-600"
            progressPercent={waterPercent}
            progressBarColor="bg-sky-500"
            subtitle={`${waterPercent}% completed`}
          />

          {/* Steps & Activity */}
          <MetricCard
            title="Daily Steps"
            value={currentSteps.toLocaleString()}
            unit={`/ ${(metrics.targetSteps || 10000).toLocaleString()}`}
            targetText={`${Math.max(0, (metrics.targetSteps || 10000) - currentSteps).toLocaleString()} steps left`}
            icon={<Activity className="w-5 h-5" />}
            iconBgColor="bg-amber-50 text-amber-600"
            progressPercent={stepsPercent}
            progressBarColor="bg-amber-500"
            subtitle={`${currentEx} min workout logged`}
          />
        </div>

        {/* Body Screening & Goals Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Body & BMI */}
          <Card className="p-6 md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Body & Screening
            </span>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">
                  {todayLog?.weightKg || profile.weightKg}
                </span>
                <span className="text-xs font-semibold text-slate-500 ml-1">kg</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Target:</span>
                <span className="text-sm font-bold text-emerald-700 ml-1">
                  {profile.targetWeightKg || 74} kg
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-700">BMI: {metrics.bmi}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {metrics.bmiCategoryLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                Estimated BMR: <span className="font-semibold text-slate-700">{metrics.bmr} kcal</span> •
                TDEE: <span className="font-semibold text-slate-700">{metrics.tdee} kcal</span>
              </p>
            </div>
          </Card>

          {/* Next Planned Meal Card */}
          <Card className="p-6 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Next Up on Today&apos;s Plan
                  </span>
                </div>
                <Link
                  href="/diet"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  View Full 7-Day Plan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {nextMeal ? (
                <div className="p-4 rounded-2xl bg-warm-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-lg shadow-sm">
                      🥗
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        {nextMeal.mealType.replace("_", " ")}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {nextMeal.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                        <span>{nextMeal.calories} kcal</span>
                        <span>•</span>
                        <span>{nextMeal.protein}g protein</span>
                        <span>•</span>
                        <span>{nextMeal.portionSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className={
                        completedMealIds.includes(nextMeal.id)
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }
                      onClick={() => handleToggleMeal(nextMeal.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {completedMealIds.includes(nextMeal.id) ? "Completed" : "Mark as Eaten"}
                    </Button>

                    <Link href="/diet">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Swap
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">All meals logged for today! Great job!</p>
              )}
            </div>

            {/* Smart Adaptive Recommendation Banner */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-900">
                  Adaptive Wellness Recommendation
                </h5>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Your afternoon water intake dips between 2 PM and 5 PM. Keep your 500ml water
                  bottle on your desk to hit 8+ glasses effortlessly without evening bloat.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Check-in & Habit Log Widget */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Daily Reflection
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                How is your body feeling today?
              </h3>
            </div>
            {checkInSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full animate-fade-in">
                ✓ Check-in Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Mood selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Mood</label>
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
                    onClick={() => setCheckInMood(m.id as MoodType)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      checkInMood === m.id
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl block">{m.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 block mt-1">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">Energy Level</label>
                <span className="text-xs font-bold text-emerald-700">
                  {checkInEnergy} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={checkInEnergy}
                onChange={(e) => setCheckInEnergy(Number(e.target.value))}
                className="w-full accent-emerald-600 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>1 (Low)</span>
                <span>5 (Moderate)</span>
                <span>10 (Vibrant)</span>
              </div>
            </div>

            {/* Notes & Save */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Daily Notes / Symptoms
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="e.g. Great focus, slight soreness in legs..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button size="sm" onClick={handleSaveCheckIn} className="bg-emerald-600 hover:bg-emerald-700">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* MODAL: Log Weight */}
      <Modal
        isOpen={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        title="Log Today's Weight"
        subtitle="Record your morning weigh-in before breakfast for standard consistency."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g. 82.2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveWeight}>
              Save Weight
            </Button>
            <Button variant="outline" onClick={() => setWeightModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Log Steps */}
      <Modal
        isOpen={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
        title="Add Daily Steps"
        subtitle="Add steps from your smartwatch, pedometer, or phone."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Steps to Add
            </label>
            <input
              type="number"
              value={newSteps}
              onChange={(e) => setNewSteps(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveSteps}>
              Add Steps
            </Button>
            <Button variant="outline" onClick={() => setStepsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Log Workout */}
      <Modal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        title="Log Exercise Activity"
        subtitle="Record workout minutes and exercise style."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Workout Routine / Activity
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={workoutMins}
              onChange={(e) => setWorkoutMins(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveWorkout}>
              Save Exercise
            </Button>
            <Button variant="outline" onClick={() => setWorkoutModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <MobileNav />
      <Footer />
    </div>
  );
}
