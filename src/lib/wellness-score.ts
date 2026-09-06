import { DailyLog, HealthMetrics } from "@/types";

export interface WellnessScoreBreakdown {
  overallScore: number;
  grade: "Excellent" | "Great" | "Good" | "Fair" | "Building Momentum";
  nutritionScore: number; // 0 - 30
  hydrationScore: number; // 0 - 20
  activityScore: number; // 0 - 25
  sleepScore: number; // 0 - 15
  consistencyScore: number; // 0 - 10
  nutritionPercent: number; // 0 - 100%
  hydrationPercent: number; // 0 - 100%
  activityPercent: number; // 0 - 100%
  sleepPercent: number; // 0 - 100%
  consistencyPercent: number; // 0 - 100%
  summaryMessage: string;
}

export function calculateDailyWellnessScore(
  log: Partial<DailyLog>,
  metrics: HealthMetrics,
  totalMealsInDay: number = 6
): WellnessScoreBreakdown {
  // 1. Nutrition adherence (0 - 30 points)
  const completedMealsCount = log.completedMealIds?.length || 0;
  const mealAdherenceRatio = Math.min(1, completedMealsCount / Math.max(1, totalMealsInDay));
  const nutritionScore = Math.round(mealAdherenceRatio * 30);
  const nutritionPercent = Math.round(mealAdherenceRatio * 100);

  // 2. Hydration adherence (0 - 20 points)
  const waterTarget = metrics.waterMl || 2500;
  const waterLogged = log.waterMl || 0;
  const hydrationRatio = Math.min(1, waterLogged / waterTarget);
  const hydrationScore = Math.round(hydrationRatio * 20);
  const hydrationPercent = Math.round(hydrationRatio * 100);

  // 3. Activity adherence (0 - 25 points)
  const stepsTarget = metrics.targetSteps || 8000;
  const stepsLogged = log.steps || 0;
  const stepsRatio = Math.min(1, stepsLogged / stepsTarget);
  const exerciseLogged = log.exerciseMinutes || 0;
  const exerciseRatio = Math.min(1, exerciseLogged / (metrics.targetExerciseMinutes || 30));
  // Blended 60% steps + 40% workout
  const activityRatio = Math.min(1, stepsRatio * 0.6 + exerciseRatio * 0.4);
  const activityScore = Math.round(activityRatio * 25);
  const activityPercent = Math.round(activityRatio * 100);

  // 4. Sleep adherence (0 - 15 points)
  const sleepHours = log.sleepHours || 7;
  let sleepRatio = 0.5;
  if (sleepHours >= 7 && sleepHours <= 9) {
    sleepRatio = 1.0;
  } else if (sleepHours >= 6 || sleepHours === 10) {
    sleepRatio = 0.8;
  } else if (sleepHours >= 5) {
    sleepRatio = 0.6;
  } else {
    sleepRatio = 0.4;
  }
  const sleepScore = Math.round(sleepRatio * 15);
  const sleepPercent = Math.round(sleepRatio * 100);

  // 5. Tracking consistency (0 - 10 points)
  let consistencyScore = 4; // baseline for opening app
  if (log.checkInCompleted) consistencyScore += 3;
  if (log.mood) consistencyScore += 1.5;
  if (log.notes) consistencyScore += 1.5;
  consistencyScore = Math.min(10, Math.round(consistencyScore));
  const consistencyPercent = Math.round((consistencyScore / 10) * 100);

  const overallScore = Math.min(
    100,
    nutritionScore + hydrationScore + activityScore + sleepScore + consistencyScore
  );

  let grade: WellnessScoreBreakdown["grade"] = "Building Momentum";
  let summaryMessage = "Every positive choice adds up. Keep logging to build your health rhythm!";

  if (overallScore >= 90) {
    grade = "Excellent";
    summaryMessage = "Outstanding vitality! You are hitting key targets across nutrition, hydration, and movement.";
  } else if (overallScore >= 80) {
    grade = "Great";
    summaryMessage = "Strong wellness momentum today. You're consistently supporting your body's recovery and energy.";
  } else if (overallScore >= 70) {
    grade = "Good";
    summaryMessage = "Steady progress. A quick walk or evening water check-in will push you into the top tier!";
  } else if (overallScore >= 55) {
    grade = "Fair";
    summaryMessage = "Good start today. Focus on your evening hydration and completing your planned dinner.";
  }

  return {
    overallScore,
    grade,
    nutritionScore,
    hydrationScore,
    activityScore,
    sleepScore,
    consistencyScore,
    nutritionPercent,
    hydrationPercent,
    activityPercent,
    sleepPercent,
    consistencyPercent,
    summaryMessage,
  };
}
