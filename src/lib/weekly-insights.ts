import { DailyLog, WeeklyInsights } from "@/types";

export function calculateWeeklyInsights(logs: DailyLog[]): WeeklyInsights {
  if (logs.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    return {
      startDate: today,
      endDate: today,
      weightChangeKg: 0,
      avgStepsPerDay: 0,
      avgWaterMlPerDay: 0,
      dietAdherencePercent: 0,
      exerciseSessionsCompleted: 0,
      bestDay: "Today",
      celebrationNote: "Start logging your daily meals and hydration to see your first weekly review!",
      focusAreaNote: "Log your first day to unlock personalized insights.",
    };
  }

  // Take the last 7 logged days
  const recent = logs.slice(0, 7);
  const oldestLog = recent[recent.length - 1];
  const newestLog = recent[0];

  const weightChange =
    newestLog.weightKg && oldestLog.weightKg
      ? Math.round((newestLog.weightKg - oldestLog.weightKg) * 10) / 10
      : 0;

  const totalSteps = recent.reduce((sum, l) => sum + (l.steps || 0), 0);
  const avgSteps = Math.round(totalSteps / recent.length);

  const totalWater = recent.reduce((sum, l) => sum + (l.waterMl || 0), 0);
  const avgWater = Math.round(totalWater / recent.length);

  const totalMealsCompleted = recent.reduce(
    (sum, l) => sum + (l.completedMealIds?.length || 0),
    0
  );
  // Assume 6 target meals per day
  const totalPossibleMeals = recent.length * 6;
  const dietAdherence = Math.min(
    100,
    Math.round((totalMealsCompleted / totalPossibleMeals) * 100)
  );

  const exerciseCount = recent.filter((l) => (l.exerciseMinutes || 0) >= 20).length;

  // Find best day based on wellness score
  let bestLog = recent[0];
  for (const l of recent) {
    if ((l.wellnessScore || 0) > (bestLog.wellnessScore || 0)) {
      bestLog = l;
    }
  }

  const bestDayName = new Date(bestLog.date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  let celebrationNote = `You completed ${dietAdherence}% of your planned meals and stayed consistent!`;
  if (avgSteps >= 8000) {
    celebrationNote = `Incredible movement! You averaged ${avgSteps.toLocaleString()} steps/day and completed ${exerciseCount} workout sessions.`;
  }

  let focusAreaNote =
    "Focus on maintaining evening hydration and prioritizing a 7-8 hour sleep schedule.";
  if (avgWater < 2200) {
    focusAreaNote =
      "Your water intake dipped in the late afternoon. Keep a filled tumbler nearby to hit 8+ glasses easily.";
  }

  return {
    startDate: oldestLog.date,
    endDate: newestLog.date,
    weightChangeKg: weightChange,
    avgStepsPerDay: avgSteps,
    avgWaterMlPerDay: avgWater,
    dietAdherencePercent: dietAdherence,
    exerciseSessionsCompleted: exerciseCount,
    bestDay: bestDayName || "Thursday",
    celebrationNote,
    focusAreaNote,
  };
}
