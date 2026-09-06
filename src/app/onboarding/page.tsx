"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Scale,
  Activity,
  Target,
  Utensils,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BmiGauge } from "@/components/ui/BmiGauge";
import { calculateBmi, calculateBmr, calculateTdee, calculateTargetCalories } from "@/lib/health-calculations";
import { ActivityLevel, CuisinePreference, DietaryPreference, Gender, HealthGoal } from "@/types";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("Alex Morgan");
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<Gender>("prefer_not_to_say");

  const [weightKg, setWeightKg] = useState(
    Number(searchParams.get("weight")) || 78
  );
  const [heightCm, setHeightCm] = useState(
    Number(searchParams.get("height")) || 174
  );
  const [targetWeightKg, setTargetWeightKg] = useState(72);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderately_active");
  const [exerciseFrequencyDays, setExerciseFrequencyDays] = useState(4);
  const [dailyStepsEstimate, setDailyStepsEstimate] = useState(8000);

  const [goal, setGoal] = useState<HealthGoal>("lose_weight");

  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("vegetarian");
  const [allergies, setAllergies] = useState<string[]>(["peanuts"]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [foodsToAvoid, setFoodsToAvoid] = useState<string[]>([]);
  const [customAvoid, setCustomAvoid] = useState("");

  const [preferredCuisine, setPreferredCuisine] = useState<CuisinePreference>("balanced");
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [breakfastTime, setBreakfastTime] = useState("08:30");
  const [lunchTime, setLunchTime] = useState("13:30");
  const [dinnerTime, setDinnerTime] = useState("20:00");
  const [dailyBudget, setDailyBudget] = useState<"budget" | "moderate" | "premium">("moderate");
  const [cookingPreference, setCookingPreference] = useState<"quick" | "meal_prep" | "elaborate">("quick");
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([
    "stove",
    "microwave",
  ]);

  // Live calculations
  const bmiAnalysis = calculateBmi(weightKg, heightCm);
  const bmr = calculateBmr(weightKg, heightCm, age, gender);
  const tdee = calculateTdee(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal, gender);

  const commonAllergies = [
    { id: "peanuts", label: "Peanuts" },
    { id: "nuts", label: "Tree Nuts" },
    { id: "dairy", label: "Dairy / Lactose" },
    { id: "gluten", label: "Gluten / Wheat" },
    { id: "soy", label: "Soy" },
    { id: "eggs", label: "Eggs" },
    { id: "fish", label: "Fish" },
    { id: "shellfish", label: "Shellfish" },
  ];

  const toggleAllergy = (id: string) => {
    if (allergies.includes(id)) {
      setAllergies(allergies.filter((a) => a !== id));
    } else {
      setAllergies([...allergies, id]);
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim().toLowerCase())) {
      setAllergies([...allergies, customAllergy.trim().toLowerCase()]);
      setCustomAllergy("");
    }
  };

  const addCustomAvoid = () => {
    if (customAvoid.trim() && !foodsToAvoid.includes(customAvoid.trim().toLowerCase())) {
      setFoodsToAvoid([...foodsToAvoid, customAvoid.trim().toLowerCase()]);
      setCustomAvoid("");
    }
  };

  const toggleEquipment = (eq: string) => {
    if (availableEquipment.includes(eq)) {
      setAvailableEquipment(availableEquipment.filter((e) => e !== eq));
    } else {
      setAvailableEquipment([...availableEquipment, eq]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        age,
        gender,
        weightKg,
        heightCm,
        targetWeightKg,
        activityLevel,
        exerciseFrequencyDays,
        dailyStepsEstimate,
        goal,
        dietaryPreference,
        allergies,
        foodsToAvoid,
        preferredCuisine,
        mealsPerDay,
        breakfastTime,
        lunchTime,
        dinnerTime,
        dailyBudget,
        cookingPreference,
        availableEquipment,
        regeneratePlan: true,
        durationDays: 7,
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save health profile");
      }

      router.push("/dashboard");
    } catch (err: any) {
      alert("Error creating plan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: "Personal" },
    { num: 2, label: "Body" },
    { num: 3, label: "Lifestyle" },
    { num: 4, label: "Goal" },
    { num: 5, label: "Food & Allergies" },
    { num: 6, label: "Preferences" },
  ];

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Vitalis<span className="text-emerald-600">.</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Personal Health Profile
          </h1>
          <p className="text-xs text-slate-500">
            Takes under 2 minutes. We build your personalized nutrition and daily routine around these metrics.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {stepsList.map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                      : step > s.num
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Form Card */}
        <Card className="p-6 sm:p-10 shadow-card border-slate-200/80">
          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 01 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Let&apos;s start with the basics
                </h2>
                <p className="text-xs text-slate-500">
                  Used to personalize your energy baseline and greeting.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      min="14"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender (optional)
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BODY */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 02 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Body measurements & BMI
                </h2>
                <p className="text-xs text-slate-500">
                  We use scientific height/weight ratios to calculate your BMR and healthy reference ranges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Weight (kg)</label>
                    <span className="text-xs font-bold text-emerald-700">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Height (cm)</label>
                    <span className="text-xs font-bold text-emerald-700">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    step="1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Weight (kg) <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="180"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 70"
                />
              </div>

              {/* Live BMI Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Live BMI Screening Preview
                </span>
                <BmiGauge
                  bmi={bmiAnalysis.bmi}
                  category={bmiAnalysis.category}
                  categoryLabel={bmiAnalysis.categoryLabel}
                  minHealthyWeight={bmiAnalysis.healthyWeightRangeKg.min}
                  maxHealthyWeight={bmiAnalysis.healthyWeightRangeKg.max}
                />
              </div>
            </div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 03 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Activity & daily movement
                </h2>
                <p className="text-xs text-slate-500">
                  Determines your Total Daily Energy Expenditure (TDEE).
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "sedentary",
                    label: "Sedentary",
                    desc: "Desk job, little to no structured exercise",
                  },
                  {
                    id: "lightly_active",
                    label: "Lightly Active",
                    desc: "Light exercise or brisk walks 1-3 days/week",
                  },
                  {
                    id: "moderately_active",
                    label: "Moderately Active",
                    desc: "Moderate workouts or sports 3-5 days/week",
                  },
                  {
                    id: "very_active",
                    label: "Very Active",
                    desc: "Hard training 6-7 days/week",
                  },
                  {
                    id: "extremely_active",
                    label: "Extremely Active",
                    desc: "Physical job plus hard athletic training daily",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActivityLevel(item.id as ActivityLevel)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      activityLevel === item.id
                        ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    {activityLevel === item.id && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Daily Steps
                  </label>
                  <select
                    value={dailyStepsEstimate}
                    onChange={(e) => setDailyStepsEstimate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value={4000}>Around 4,000 steps</option>
                    <option value={6000}>Around 6,000 steps</option>
                    <option value={8000}>Around 8,000 steps (Standard)</option>
                    <option value={10000}>10,000+ steps (High activity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exercise Days / Week
                  </label>
                  <select
                    value={exerciseFrequencyDays}
                    onChange={(e) => setExerciseFrequencyDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value={1}>1-2 days</option>
                    <option value={3}>3-4 days</option>
                    <option value={5}>5-6 days</option>
                    <option value={7}>Daily</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GOAL */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 04 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Primary health & body goal
                </h2>
                <p className="text-xs text-slate-500">
                  Calorie targets are adjusted with safe, non-extreme caloric deficits/surpluses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "lose_weight",
                    label: "Lose Weight",
                    desc: "Sustainable fat loss (~0.4kg/wk) with lean muscle preservation",
                    icon: "🔥",
                  },
                  {
                    id: "maintain_weight",
                    label: "Maintain Weight",
                    desc: "Steady energy, balanced metabolic health and vitality",
                    icon: "⚖️",
                  },
                  {
                    id: "build_muscle",
                    label: "Build Muscle",
                    desc: "High protein intake with moderate hyper-nourishment",
                    icon: "💪",
                  },
                  {
                    id: "gain_weight",
                    label: "Gain Weight",
                    desc: "Healthy nutrient-dense caloric surplus",
                    icon: "📈",
                  },
                  {
                    id: "improve_fitness",
                    label: "Improve Fitness & Stamina",
                    desc: "Cardio endurance, mobility, and clean fueling",
                    icon: "⚡",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setGoal(item.id as HealthGoal)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      goal === item.id
                        ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      {goal === item.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Energy Calculation Preview */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
                    Estimated Daily Calorie Target
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {targetCalories.toLocaleString()}{" "}
                    <span className="text-xs font-medium text-slate-500">kcal/day</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    BMR: {bmr} kcal • Maintenance TDEE: {tdee} kcal
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Scientifically Balanced
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FOOD & ALLERGIES */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 05 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Dietary preference & safety exclusions
                </h2>
                <p className="text-xs text-slate-500">
                  We never generate meals containing your allergens or restricted foods.
                </p>
              </div>

              {/* Diet Preference Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dietary Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "vegetarian", label: "Vegetarian 🥦" },
                    { id: "non_vegetarian", label: "Non-Vegetarian 🍗" },
                    { id: "vegan", label: "Vegan 🌱" },
                    { id: "eggetarian", label: "Eggetarian 🍳" },
                    { id: "halal", label: "Halal 🥩" },
                    { id: "jain", label: "Jain 🥗" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setDietaryPreference(p.id as DietaryPreference)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                        dietaryPreference === p.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies Multi-select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Allergies (Strict Exclusions)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select all that apply. Ingredients matching these will be excluded 100% of the time.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {commonAllergies.map((a) => {
                    const isSelected = allergies.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAllergy(a.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                          isSelected
                            ? "bg-rose-50 text-rose-700 border-rose-300 font-bold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? "✕ " : "+ "}
                        {a.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    placeholder="Add custom allergy..."
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAllergy();
                      }
                    }}
                  />
                  <Button size="sm" variant="outline" type="button" onClick={addCustomAllergy}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Foods to Avoid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Disliked Foods or Exclusions
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAvoid}
                    onChange={(e) => setCustomAvoid(e.target.value)}
                    placeholder="e.g. mushrooms, bell peppers, cilantro"
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAvoid();
                      }
                    }}
                  />
                  <Button size="sm" variant="outline" type="button" onClick={addCustomAvoid}>
                    Exclude
                  </Button>
                </div>
                {foodsToAvoid.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {foodsToAvoid.map((f, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        ✕ {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: PREFERENCES */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Step 06 / 06
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Cuisine, timing & equipment
                </h2>
                <p className="text-xs text-slate-500">
                  Ensures your meal plan fits smoothly into your real everyday lifestyle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Cuisine
                  </label>
                  <select
                    value={preferredCuisine}
                    onChange={(e) => setPreferredCuisine(e.target.value as CuisinePreference)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="balanced">Balanced / Global fusion</option>
                    <option value="indian">Indian (Dals, Rice, Roti, Curries)</option>
                    <option value="mediterranean">Mediterranean (Olive oil, Quinoa, Greens)</option>
                    <option value="asian">Asian (Stir-fry, Jasmine rice, Tofu)</option>
                    <option value="continental">Continental / European</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meals Per Day
                  </label>
                  <select
                    value={mealsPerDay}
                    onChange={(e) => setMealsPerDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value={3}>3 meals (Breakfast, Lunch, Dinner)</option>
                    <option value={4}>4 meals (Standard with snack)</option>
                    <option value={5}>5 meals (Frequent smaller meals)</option>
                    <option value={6}>6 meals (Full athletic schedule)</option>
                  </select>
                </div>
              </div>

              {/* Cooking Equipment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Available Kitchen Equipment
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "stove", label: "Stove / Burner" },
                    { id: "microwave", label: "Microwave" },
                    { id: "air_fryer", label: "Air Fryer" },
                    { id: "blender", label: "Blender / Shaker" },
                    { id: "oven", label: "Oven" },
                  ].map((eq) => {
                    const active = availableEquipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => toggleEquipment(eq.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                          active
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {active ? "✓ " : ""}
                        {eq.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plan Summary Card */}
              <div className="p-4 rounded-2xl bg-warm-100/70 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Ready to Generate Your Personalized Companion
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We will compile your 7-day schedule with exact calorie portions, balanced macros,
                  automatic grocery list, and adaptive daily tracking.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setStep(step + 1)}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                onClick={handleFinish}
                isLoading={isSubmitting}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create My Personalized Plan
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-warm-50 flex items-center justify-center">
          <p className="text-sm font-semibold text-slate-600">Loading plan wizard...</p>
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  );
}
