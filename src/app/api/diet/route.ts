import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";
import { generatePersonalizedMealPlan, swapMealInPlan } from "@/lib/diet-engine";
import { generateGroceryListFromMealPlan } from "@/lib/grocery-generator";
import { calculateDailyWellnessScore } from "@/lib/wellness-score";

export async function GET() {
  const userId = await getCurrentUserId();
  const mealPlan = dbRepository.getMealPlan(userId);
  const todayDate = new Date().toISOString().split("T")[0];
  const todayLog = dbRepository.getLogForDate(userId, todayDate);

  return NextResponse.json({
    mealPlan,
    completedMealIds: todayLog?.completedMealIds || [],
  });
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const { action } = body;

    const mealPlan = dbRepository.getMealPlan(userId);
    const profile = dbRepository.getProfile(userId);
    const metrics = dbRepository.getMetrics(userId);

    if (action === "mark_eaten") {
      const { mealId, completed } = body;
      const todayDate = new Date().toISOString().split("T")[0];
      const todayLog = dbRepository.getLogForDate(userId, todayDate) || {
        id: `log-${userId}-${todayDate}`,
        userId,
        date: todayDate,
        waterMl: 1500,
        steps: 6000,
        exerciseMinutes: 20,
        sleepHours: 7,
        completedMealIds: [],
        wellnessScore: 75,
        checkInCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let completedSet = new Set(todayLog.completedMealIds || []);
      if (completed) {
        completedSet.add(mealId);
      } else {
        completedSet.delete(mealId);
      }

      todayLog.completedMealIds = Array.from(completedSet);
      if (metrics) {
        const breakdown = calculateDailyWellnessScore(todayLog, metrics);
        todayLog.wellnessScore = breakdown.overallScore;
      }

      dbRepository.saveDailyLog(todayLog);
      return NextResponse.json({ success: true, completedMealIds: todayLog.completedMealIds });
    }

    if (action === "swap_meal") {
      const { dayNumber, mealId, alternativeId } = body;
      if (!mealPlan) {
        return NextResponse.json({ error: "No active meal plan found" }, { status: 404 });
      }

      const updatedPlan = swapMealInPlan(mealPlan, dayNumber, mealId, alternativeId);
      dbRepository.saveMealPlan(updatedPlan);

      return NextResponse.json({ success: true, mealPlan: updatedPlan });
    }

    if (action === "add_to_grocery") {
      const { mealId, dayNumber } = body;
      if (!mealPlan) return NextResponse.json({ error: "No meal plan" }, { status: 404 });

      const day = mealPlan.days.find((d) => d.dayNumber === dayNumber) || mealPlan.days[0];
      const meal = day?.meals.find((m) => m.id === mealId);

      if (meal) {
        const added: any[] = [];
        for (const ing of meal.ingredients) {
          const item = dbRepository.addGroceryItem(userId, {
            name: ing.name,
            amount: ing.amount,
            category: ing.category,
            isPurchased: false,
            isCustom: false,
          });
          added.push(item);
        }
        return NextResponse.json({ success: true, count: added.length, items: added });
      }

      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    if (action === "generate_plan") {
      const duration = body.durationDays || 7;
      if (!profile || !metrics) {
        return NextResponse.json({ error: "Profile missing" }, { status: 400 });
      }

      const newPlan = generatePersonalizedMealPlan(
        profile,
        metrics.targetCalories,
        metrics.proteinG,
        duration
      );
      newPlan.userId = userId;
      dbRepository.saveMealPlan(newPlan);

      return NextResponse.json({ success: true, mealPlan: newPlan });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process diet action" }, { status: 500 });
  }
}
