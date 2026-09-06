"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Utensils,
  RefreshCw,
  Check,
  Plus,
  ShoppingCart,
  Clock,
  Sparkles,
  BookOpen,
  Info,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Meal, MealPlan } from "@/types";

export default function DietPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [completedMealIds, setCompletedMealIds] = useState<string[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // Meal swap modal
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [activeMealForSwap, setActiveMealForSwap] = useState<Meal | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  // Recipe view modal
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [activeRecipeMeal, setActiveRecipeMeal] = useState<Meal | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchDiet = async () => {
    try {
      const res = await fetch("/api/diet");
      const data = await res.json();
      if (data.mealPlan) {
        setMealPlan(data.mealPlan);
      }
      if (data.completedMealIds) {
        setCompletedMealIds(data.completedMealIds);
      }
    } catch (err) {
      console.error("Failed to load diet plan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, []);

  // Mark meal eaten
  const handleToggleMeal = async (mealId: string) => {
    const isCompleted = completedMealIds.includes(mealId);
    const newStatus = !isCompleted;

    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_eaten",
          mealId,
          completed: newStatus,
        }),
      });
      const data = await res.json();
      if (data.completedMealIds) {
        setCompletedMealIds(data.completedMealIds);
        if (newStatus) {
          confetti({ particleCount: 40, spread: 50 });
          showToast("Meal marked as eaten! Daily score updated.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open swap dialog
  const handleOpenSwap = (meal: Meal) => {
    setActiveMealForSwap(meal);
    setSwapModalOpen(true);
  };

  // Perform meal swap
  const handleConfirmSwap = async (alternativeId: string) => {
    if (!activeMealForSwap) return;
    setIsSwapping(true);

    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "swap_meal",
          dayNumber: selectedDayNumber,
          mealId: activeMealForSwap.id,
          alternativeId,
        }),
      });
      const data = await res.json();
      if (data.mealPlan) {
        setMealPlan(data.mealPlan);
        setSwapModalOpen(false);
        showToast("Meal swapped successfully with matched macros!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwapping(false);
    }
  };

  // Add ingredients to grocery list
  const handleAddToGrocery = async (mealId: string) => {
    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_to_grocery",
          dayNumber: selectedDayNumber,
          mealId,
        }),
      });
      const data = await res.json();
      if (data.count) {
        showToast(`Added ${data.count} ingredients to your grocery list!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Switch to 30-day plan
  const handleExtend30Day = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_plan", durationDays: 30 }),
      });
      const data = await res.json();
      if (data.mealPlan) {
        setMealPlan(data.mealPlan);
        showToast("Expanded to 30-Day Personalized Cycle!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !mealPlan) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Loading personalized meal timeline...</p>
        </div>
      </div>
    );
  }

  const currentDay =
    mealPlan.days.find((d) => d.dayNumber === selectedDayNumber) || mealPlan.days[0];

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Title & 30-Day Extender */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Personalized Nutrition Schedule
              </span>
              <span className="text-xs text-slate-400">• {mealPlan.durationDays}-Day Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Daily Diet Timeline
            </h1>
            <p className="text-xs text-slate-500">
              Nutrient-dense meals adapted to your goals, dietary preference, and zero allergens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {mealPlan.durationDays < 30 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExtend30Day}
                className="text-xs border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Expand to 30-Day Plan
              </Button>
            ) : (
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl">
                ✓ 30-Day Architecture Active
              </span>
            )}
          </div>
        </div>

        {/* Day Selector Ribbon */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 min-w-max">
            {mealPlan.days.map((d) => {
              const isSelected = d.dayNumber === selectedDayNumber;
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-105"
                      : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <span>Day {d.dayNumber}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {d.dayLabel.split("—")[1]?.trim() || `Cycle ${d.dayNumber}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Target Banner */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 border-emerald-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Daily Calorie Target
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {currentDay.dailyCalories.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-500">kcal</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Protein Target
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {currentDay.dailyProtein}{" "}
                <span className="text-xs font-normal text-slate-500">g</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Hydration Goal
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {currentDay.dailyHydrationMl}{" "}
                <span className="text-xs font-normal text-slate-500">ml</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Workout Focus
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                {currentDay.exerciseSuggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* Meal Timeline Cards */}
        <div className="space-y-4">
          {currentDay.meals.map((meal, index) => {
            const isCompleted = completedMealIds.includes(meal.id);

            const mealTypeLabels: Record<string, { label: string; icon: string }> = {
              breakfast: { label: "Breakfast • 8:30 AM", icon: "🍳" },
              mid_morning: { label: "Mid-Morning • 11:00 AM", icon: "🍵" },
              lunch: { label: "Lunch • 1:30 PM", icon: "🥗" },
              evening_snack: { label: "Evening Snack • 5:00 PM", icon: "🥜" },
              dinner: { label: "Dinner • 8:00 PM", icon: "🍲" },
              bedtime: { label: "Bedtime • 10:00 PM", icon: "🥛" },
            };

            const info = mealTypeLabels[meal.mealType] || {
              label: meal.mealType,
              icon: "🍽️",
            };

            return (
              <Card
                key={meal.id}
                className={`p-5 transition-all duration-200 ${
                  isCompleted
                    ? "bg-slate-50/60 border-slate-200"
                    : "bg-white hover:border-emerald-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Meal Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-warm-100 text-slate-800 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                      {info.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          {info.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            ✓ Eaten
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base font-bold mt-0.5 ${
                          isCompleted ? "text-slate-500 line-through" : "text-slate-900"
                        }`}
                      >
                        {meal.name}
                      </h3>

                      {/* Macros row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
                        <span className="font-bold text-slate-800">{meal.calories} kcal</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{meal.protein}g protein</span>
                        <span>•</span>
                        <span>{meal.carbs}g carbs</span>
                        <span>•</span>
                        <span>{meal.fat}g fat</span>
                        <span>•</span>
                        <span className="text-slate-400">Portion: {meal.portionSize}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">
                        {meal.prepNotes}
                      </p>

                      {/* Ingredients list preview */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {meal.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60"
                          >
                            {ing.name} ({ing.amount})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Button
                      size="sm"
                      className={
                        isCompleted
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      }
                      onClick={() => handleToggleMeal(meal.id)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      {isCompleted ? "Eaten" : "Mark as Eaten"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleOpenSwap(meal)}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Swap Meal
                    </Button>

                    <button
                      onClick={() => handleAddToGrocery(meal.id)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 p-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      + Add to Grocery
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* SWAP MEAL MODAL */}
      <Modal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        title="Swap Meal with Balanced Alternative"
        subtitle={`Select a nutritionist-verified alternative for ${activeMealForSwap?.name || ""}.`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            All alternatives are strictly allergen-safe and match your target macronutrient split.
          </p>

          <div className="space-y-3">
            {activeMealForSwap?.alternatives?.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{alt.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{alt.description}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1">
                    <span>{alt.calories} kcal</span>
                    <span>•</span>
                    <span className="text-emerald-700">{alt.protein}g protein</span>
                    <span>•</span>
                    <span>{alt.carbs}g carbs</span>
                    <span>•</span>
                    <span>{alt.fat}g fat</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs whitespace-nowrap"
                  onClick={() => handleConfirmSwap(alt.id)}
                  isLoading={isSwapping}
                >
                  Use this Swap
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setSwapModalOpen(false)}>
              Keep Current Meal
            </Button>
          </div>
        </div>
      </Modal>

      <MobileNav />
      <Footer />
    </div>
  );
}
