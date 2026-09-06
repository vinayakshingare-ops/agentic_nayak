import { AdaptiveRecommendation, DailyLog, HealthMetrics, HealthProfile } from "@/types";

export function generateAdaptiveRecommendations(
  logs: DailyLog[],
  metrics: HealthMetrics,
  profile: HealthProfile
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  if (logs.length === 0) {
    return [
      {
        id: "rec-welcome",
        type: "positive",
        title: "Welcome to Your Wellness Journey",
        description:
          "Start by logging your morning water and reviewing today's balanced meal schedule. Small daily habits create lasting vitality.",
        actionLabel: "View Today's Plan",
        actionUrl: "/diet",
      },
    ];
  }

  // Analyze recent 7 days
  const recentLogs = logs.slice(0, 7);
  const avgWater =
    recentLogs.reduce((sum, l) => sum + (l.waterMl || 0), 0) / recentLogs.length;
  const avgSteps =
    recentLogs.reduce((sum, l) => sum + (l.steps || 0), 0) / recentLogs.length;
  const avgSleep =
    recentLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / recentLogs.length;

  // Hydration Insight
  if (avgWater < (metrics.waterMl || 2500) * 0.75) {
    const glassesShort = Math.round(((metrics.waterMl || 2500) - avgWater) / 250);
    recommendations.push({
      id: "rec-hydration",
      type: "gentle_nudge",
      title: "Boost Afternoon Hydration",
      description: `You're averaging about ${Math.round(avgWater / 250)} glasses/day against your target of ${metrics.waterGlasses} glasses. Try placing a water bottle at your desk and sipping 1 full glass before each meal.`,
      actionLabel: "Log Water Now",
      actionUrl: "/tracking",
    });
  } else {
    recommendations.push({
      id: "rec-hydration-success",
      type: "positive",
      title: "Hydration Champion",
      description: `Outstanding work! You are consistently hitting your daily water target (${Math.round(avgWater)} ml avg), optimizing digestion and cognitive focus.`,
    });
  }

  // Activity Insight
  if (avgSteps < (metrics.targetSteps || 8000) * 0.8) {
    recommendations.push({
      id: "rec-steps",
      type: "improvement",
      title: "Movement Micro-Breaks",
      description:
        "Adding two 10-minute walking breaks—one post-lunch and one evening stroll—adds approximately 2,200 steps with zero fatigue.",
      actionLabel: "Log Steps",
      actionUrl: "/tracking",
    });
  } else {
    recommendations.push({
      id: "rec-steps-high",
      type: "positive",
      title: "Consistent Daily Movement",
      description: `You're averaging ${Math.round(avgSteps).toLocaleString()} daily steps! That consistent baseline caloric burn supports your ${profile.goal.replace("_", " ")} goal.`,
    });
  }

  // Sleep Insight
  if (avgSleep < 6.5) {
    recommendations.push({
      id: "rec-sleep",
      type: "gentle_nudge",
      title: "Restorative Sleep Buffer",
      description:
        "Your recent sleep average is 6.2 hours. Aiming for 7+ hours dramatically improves cortisol levels, leptin (satiety hormone), and energy for workouts.",
    });
  }

  // Progress pacing safety note
  recommendations.push({
    id: "rec-safety-pacing",
    type: "safety_notice",
    title: "Gentle Reminder: Sustainable Pacing",
    description:
      "Health transformations are non-linear. Weight fluctuations of 0.5 - 1.5 kg due to water retention, sodium, and glycogen are completely normal.",
  });

  return recommendations;
}
