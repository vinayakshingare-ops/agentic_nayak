import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";
import { generateHealthMetrics } from "@/lib/health-calculations";
import { generatePersonalizedMealPlan } from "@/lib/diet-engine";
import { generateGroceryListFromMealPlan } from "@/lib/grocery-generator";

export async function GET() {
  const userId = await getCurrentUserId();
  const user = dbRepository.findUserById(userId);
  const profile = dbRepository.getProfile(userId);
  const metrics = dbRepository.getMetrics(userId);

  return NextResponse.json({ user, profile, metrics });
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const data = await req.json();

    const currentProfile = dbRepository.getProfile(userId) || ({} as any);
    const updatedProfile = {
      ...currentProfile,
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };

    dbRepository.saveProfile(updatedProfile);

    // Calculate new metrics
    const newMetrics = generateHealthMetrics(updatedProfile);
    newMetrics.userId = userId;
    dbRepository.saveMetrics(newMetrics);

    // If regenerating diet or this is new onboarding:
    if (data.regeneratePlan || !dbRepository.getMealPlan(userId)) {
      const newPlan = generatePersonalizedMealPlan(
        updatedProfile,
        newMetrics.targetCalories,
        newMetrics.proteinG,
        data.durationDays || 7
      );
      newPlan.userId = userId;
      dbRepository.saveMealPlan(newPlan);

      // Generate new groceries
      const groceries = generateGroceryListFromMealPlan(newPlan, userId);
      dbRepository.saveGroceries(userId, groceries);
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      metrics: newMetrics,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}

export const PUT = POST;
