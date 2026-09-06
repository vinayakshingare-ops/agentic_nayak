"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  HeartPulse,
  Save,
  CheckCircle2,
  Scale,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BmiGauge } from "@/components/ui/BmiGauge";
import {
  ActivityLevel,
  CuisinePreference,
  DietaryPreference,
  Gender,
  HealthGoal,
  HealthMetrics,
  HealthProfile,
} from "@/types";
import { calculateBmi } from "@/lib/health-calculations";

export default function ProfilePage() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Editable form fields
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(82.4);
  const [targetWeightKg, setTargetWeightKg] = useState(74);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderately_active");
  const [goal, setGoal] = useState<HealthGoal>("lose_weight");
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("vegetarian");
  const [allergiesText, setAllergiesText] = useState("peanuts");
  const [avoidText, setAvoidText] = useState("mushrooms");
  const [cuisine, setCuisine] = useState<CuisinePreference>("indian");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setAge(data.profile.age);
          setGender(data.profile.gender);
          setHeightCm(data.profile.heightCm);
          setWeightKg(data.profile.weightKg);
          setTargetWeightKg(data.profile.targetWeightKg || 74);
          setActivityLevel(data.profile.activityLevel);
          setGoal(data.profile.goal);
          setDietaryPreference(data.profile.dietaryPreference);
          setAllergiesText((data.profile.allergies || []).join(", "));
          setAvoidText((data.profile.foodsToAvoid || []).join(", "));
          setCuisine(data.profile.preferredCuisine || "balanced");
        }
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveToast(false);

    try {
      const parsedAllergies = allergiesText
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const parsedAvoid = avoidText
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        targetWeightKg: Number(targetWeightKg),
        activityLevel,
        goal,
        dietaryPreference,
        allergies: parsedAllergies,
        foodsToAvoid: parsedAvoid,
        preferredCuisine: cuisine,
        regeneratePlan: true, // triggers meal recalculation
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.profile && data.metrics) {
        setProfile(data.profile);
        setMetrics(data.metrics);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !profile || !metrics) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-600">Loading health profile...</p>
      </div>
    );
  }

  const liveBmi = calculateBmi(weightKg, heightCm);

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Profile & Physiology
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Manage Health Profile
            </h1>
            <p className="text-xs text-slate-500">
              Updating your metrics triggers an instant recalculation of BMR, TDEE, macros, and diet plans.
            </p>
          </div>

          {saveToast && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile & targets recalculated!</span>
            </div>
          )}
        </div>

        {/* Current Metrics Card */}
        <Card className="p-6 bg-white border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Active Calculations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">BMI</span>
              <div className="text-lg font-bold text-slate-900">{metrics.bmi}</div>
              <span className="text-[11px] text-amber-700 font-semibold">
                {metrics.bmiCategoryLabel}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">BMR (Mifflin)</span>
              <div className="text-lg font-bold text-slate-900">{metrics.bmr} kcal</div>
              <span className="text-[11px] text-slate-500">Base metabolism</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">TDEE</span>
              <div className="text-lg font-bold text-slate-900">{metrics.tdee} kcal</div>
              <span className="text-[11px] text-slate-500">Maintenance energy</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Target Calories</span>
              <div className="text-lg font-bold text-emerald-900">{metrics.targetCalories} kcal</div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {metrics.proteinG}g protein
              </span>
            </div>
          </div>

          <BmiGauge
            bmi={liveBmi.bmi}
            category={liveBmi.category}
            categoryLabel={liveBmi.categoryLabel}
            minHealthyWeight={liveBmi.healthyWeightRangeKg.min}
            maxHealthyWeight={liveBmi.healthyWeightRangeKg.max}
          />
        </Card>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Body & Biometrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 pt-4 pb-3 border-b border-slate-100">
              Goals & Lifestyle
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as HealthGoal)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="lose_weight">Lose Weight (Sustainable deficit)</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                  <option value="build_muscle">Build Muscle (Hypertrophy surplus)</option>
                  <option value="improve_fitness">Improve Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="sedentary">Sedentary (Desk work)</option>
                  <option value="lightly_active">Lightly Active (1-3 days)</option>
                  <option value="moderately_active">Moderately Active (3-5 days)</option>
                  <option value="very_active">Very Active (6-7 days)</option>
                  <option value="extremely_active">Extremely Active (Athletic/heavy physical)</option>
                </select>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 pt-4 pb-3 border-b border-slate-100">
              Dietary Rules & Exclusions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dietary Category
                </label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="halal">Halal</option>
                  <option value="jain">Jain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Cuisine
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value as CuisinePreference)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="balanced">Balanced / Global Fusion</option>
                  <option value="indian">Indian</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="asian">Asian</option>
                  <option value="continental">Continental</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. peanuts, dairy, gluten"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foods to Avoid (comma separated)
                </label>
                <input
                  type="text"
                  value={avoidText}
                  onChange={(e) => setAvoidText(e.target.value)}
                  placeholder="e.g. mushrooms, bell peppers"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                isLoading={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Update Profile & Recalculate Plan
              </Button>
            </div>
          </Card>
        </form>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
