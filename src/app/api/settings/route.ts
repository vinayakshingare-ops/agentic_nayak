import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);

  if (searchParams.get("export") === "true") {
    // Export full JSON bundle for user privacy & ownership
    const profile = dbRepository.getProfile(userId);
    const metrics = dbRepository.getMetrics(userId);
    const logs = dbRepository.getLogs(userId);
    const mealPlan = dbRepository.getMealPlan(userId);
    const groceries = dbRepository.getGroceries(userId);
    const settings = dbRepository.getSettings(userId);

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user: dbRepository.findUserById(userId),
      profile,
      metrics,
      logs,
      mealPlan,
      groceries,
      settings,
    });
  }

  const settings = dbRepository.getSettings(userId);
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const data = await req.json();

    const current = dbRepository.getSettings(userId);
    const updated = {
      ...current,
      ...data,
      notifications: {
        ...current.notifications,
        ...(data.notifications || {}),
      },
    };

    dbRepository.saveSettings(userId, updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
