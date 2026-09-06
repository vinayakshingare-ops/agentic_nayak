"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Utensils,
  LineChart,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Activity,
  Droplets,
  Scale,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { BmiGauge } from "@/components/ui/BmiGauge";
import { calculateBmi } from "@/lib/health-calculations";

export default function LandingPage() {
  const router = useRouter();
  const [bmiModalOpen, setBmiModalOpen] = useState(false);
  const [quickWeight, setQuickWeight] = useState("75");
  const [quickHeight, setQuickHeight] = useState("175");
  const [demoLoading, setDemoLoading] = useState(false);

  const quickAnalysis = calculateBmi(Number(quickWeight), Number(quickHeight));

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await fetch("/api/auth/demo", { method: "POST" });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background ambient gradient rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next-Gen Personal Health & Nutrition Companion</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Your Personal Health Plan,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Built Around You.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            No generic diets or rigid rules. Vitalis combines your body metrics, daily movement,
            goals, food preferences, and real-time habits into an adaptive wellness companion.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-4 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                Create My Health Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setBmiModalOpen(true)}
              className="w-full sm:w-auto text-base px-6 py-4"
            >
              <Scale className="w-4 h-4 mr-2 text-slate-500" />
              Quick BMI Check
            </Button>

            <Button
              variant="soft"
              size="lg"
              onClick={handleDemoLogin}
              isLoading={demoLoading}
              className="w-full sm:w-auto text-base px-6 py-4 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            >
              <Zap className="w-4 h-4 mr-2 text-amber-600 fill-amber-500" />
              Explore Live Demo
            </Button>
          </div>

          <p className="text-xs text-slate-600 mt-4 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero ads • Evidence-informed Mifflin-St Jeor calculations • 100% private
          </p>

          {/* Interactive Hero Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl bg-slate-900/5 p-2 sm:p-4 ring-1 ring-slate-900/10 shadow-2xl">
              <div className="rounded-2xl bg-white p-6 sm:p-8 text-left border border-slate-100 shadow-soft">
                {/* Mockup Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                        Live Preview • Today&apos;s Rhythm
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      Good morning, Rahul
                    </h3>
                    <p className="text-xs text-slate-500">
                      You are 84% through today&apos;s wellness targets. Consistent habits unlocked!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>5-Day Streak</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      Score: 84/100
                    </div>
                  </div>
                </div>

                {/* Mockup Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Daily Calories</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      1,950 <span className="text-xs font-normal text-slate-500">/ 2,100 kcal</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[92%] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Protein Target</span>
                      <Utensils className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      118 <span className="text-xs font-normal text-slate-500">/ 130 g</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-teal-500 h-full w-[90%] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Hydration</span>
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      8 <span className="text-xs font-normal text-slate-500">/ 10 glasses</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-sky-500 h-full w-[80%] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Daily Steps</span>
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      7,420 <span className="text-xs font-normal text-slate-500">/ 10k</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[74%] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Next Meal Highlight */}
                <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      🍲
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700">
                        Next Up • Dinner (8:00 PM)
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        Yellow Dal Tadka with Steamed Rice & Garlic Methi
                      </h4>
                      <p className="text-xs text-slate-500">
                        480 kcal • 22g protein • Vegetarian & Peanut-Free
                      </p>
                    </div>
                  </div>

                  <Link href="/diet">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Full Day
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              The Vitalis Approach
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How Vitalis Transforms Your Habits
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              From day one data to long-term sustainable vitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us About Yourself",
                desc: "Enter your age, height, weight, activity, goals, dietary choices, and any allergies or exclusions.",
              },
              {
                step: "02",
                title: "Get Your Plan",
                desc: "Receive scientific Mifflin-St Jeor calorie targets, safe macro splits, and a personalized 7-day meal plan.",
              },
              {
                step: "03",
                title: "Track Your Daily Rhythm",
                desc: "Check off meals, log water with 1 tap, track steps and workouts, and rate your mood and energy.",
              },
              {
                step: "04",
                title: "Improve Consistently",
                desc: "Gain weekly insight reports, adaptive suggestions, and friendly AI guidance whenever plans shift.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-start p-6 rounded-2xl bg-warm-50 border border-slate-200/80">
                <span className="text-3xl font-extrabold text-emerald-600 mb-3">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Complete Health Companion
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Everything Needed for Lifelong Wellness
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Designed as a holistic companion rather than an isolated calorie counter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Personalized 7 & 30-Day Diet
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delicious recipes scaled to your exact calorie and protein targets. Complete with
                instant meal swaps, preparation instructions, and strict allergen filtration.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                BMI & Health Metrics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent Mifflin-St Jeor BMR and TDEE calculations. Clear visual BMI indicators,
                healthy reference weights, and educational safety guidance.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Daily Progress & Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track weight trends over 7, 30, and 90 days. Monitor hydration, steps, workout
                consistency, and daily wellness scores on responsive charts.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Smart Adaptive Suggestions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vitalis analyzes your habits over time. If hydration is low or breakfast is rushed,
                it offers supportive, non-judgmental habit modifications.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                AI Health & Nutrition Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions about pre-workout meals, dining out, budget recipes, or high-protein
                snacks. Built with robust safety guardrails and profile awareness.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Smart Grocery List
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-compiled shopping list organized into vegetables, fruits, grains, proteins, and
                pantry staples. Check off items while shopping with zero food waste.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick BMI Check Modal */}
      <Modal
        isOpen={bmiModalOpen}
        onClose={() => setBmiModalOpen(false)}
        title="Interactive BMI & Body Screening"
        subtitle="Estimate your Body Mass Index using standard metric measures."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                min="30"
                max="250"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={quickHeight}
                onChange={(e) => setQuickHeight(e.target.value)}
                min="100"
                max="240"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <BmiGauge
              bmi={quickAnalysis.bmi}
              category={quickAnalysis.category}
              categoryLabel={quickAnalysis.categoryLabel}
              minHealthyWeight={quickAnalysis.healthyWeightRangeKg.min}
              maxHealthyWeight={quickAnalysis.healthyWeightRangeKg.max}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setBmiModalOpen(false);
                router.push(`/onboarding?weight=${quickWeight}&height=${quickHeight}`);
              }}
            >
              Build Full Plan with this BMI
            </Button>
            <Button variant="outline" onClick={() => setBmiModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
