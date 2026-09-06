"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Clock,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EXERCISE_LIBRARY } from "@/lib/exercise-data";
import { ExerciseRoutine } from "@/types";

export default function ExercisePage() {
  const [routines] = useState<ExerciseRoutine[]>(EXERCISE_LIBRARY);
  const [selectedRoutine, setSelectedRoutine] = useState<ExerciseRoutine>(EXERCISE_LIBRARY[0]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);

  const toggleExercise = (name: string) => {
    if (completedExercises.includes(name)) {
      setCompletedExercises(completedExercises.filter((n) => n !== name));
    } else {
      setCompletedExercises([...completedExercises, name]);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Movement & Strength Routines
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Personalized Exercise Plans
          </h1>
          <p className="text-xs text-slate-500">
            Effective routines tailored to preserve lean muscle, boost metabolic burn, and improve posture.
          </p>
        </div>

        {/* Routine Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routines.map((r) => {
            const isSelected = r.id === selectedRoutine.id;
            return (
              <Card
                key={r.id}
                hoverEffect
                onClick={() => setSelectedRoutine(r)}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {r.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{r.estimatedMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{r.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                    <Flame className="w-3.5 h-3.5" />
                    ~{r.caloriesBurnedEstimate} kcal
                  </span>
                  <span>•</span>
                  <span>{r.exercises.length} movements</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Active Routine Workout Detail */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Active Workout Schedule
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedRoutine.title}
              </h2>
              <p className="text-xs text-slate-500">
                Estimated duration: {selectedRoutine.estimatedMinutes} minutes • Burn: ~{selectedRoutine.caloriesBurnedEstimate} kcal
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full">
                {completedExercises.length} of {selectedRoutine.exercises.length} completed
              </span>
            </div>
          </div>

          {/* Exercise Items List */}
          <div className="divide-y divide-slate-100 mt-4">
            {selectedRoutine.exercises.map((item, idx) => {
              const isDone = completedExercises.includes(item.name);
              return (
                <div
                  key={idx}
                  className={`py-4 transition-colors ${
                    isDone ? "opacity-60 bg-slate-50/50 rounded-xl px-2" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleExercise(item.name)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 transition-all ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 hover:border-emerald-500 bg-white"
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? "line-through text-slate-500" : "text-slate-900"
                            }`}
                          >
                            {item.name}
                          </h4>
                          {item.restSeconds && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              Rest {item.restSeconds}s
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mt-1">
                          {item.sets && <span>{item.sets} Sets</span>}
                          {item.sets && item.reps && <span>•</span>}
                          {item.reps && <span>{item.reps}</span>}
                          {item.durationMinutes && <span>{item.durationMinutes} min</span>}
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          <span className="font-semibold text-slate-700">Form tip:</span> {item.coachingTips}
                        </p>

                        {item.alternativeForInjury && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1.5 inline-block">
                            <span className="font-bold">Joint/Injury Alternative:</span> {item.alternativeForInjury}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.targetMuscles}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              General fitness guide. Stop immediately if you experience sharp joint pain.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCompletedExercises([])}
              className="text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Checklist
            </Button>
          </div>
        </Card>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
