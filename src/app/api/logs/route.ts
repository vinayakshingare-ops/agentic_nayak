import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";
import { calculateDailyWellnessScore } from "@/lib/wellness-score";
import { DailyLog } from "@/types";

export async function GET() {
  const userId = await getCurrentUserId();
  const logs = dbRepository.getLogs(userId);
  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const data = await req.json();

    const todayDate = data.date || new Date().toISOString().split("T")[0];
    const existingLog = dbRepository.getLogForDate(userId, todayDate);
    const metrics = dbRepository.getMetrics(userId) || ({} as any);

    const mergedLog: DailyLog = {
      id: existingLog ? existingLog.id : `log-${userId}-${todayDate}`,
      userId,
      date: todayDate,
      weightKg: data.weightKg !== undefined ? Number(data.weightKg) : existingLog?.weightKg,
      waterMl: data.waterMl !== undefined ? Number(data.waterMl) : (existingLog?.waterMl || 0),
      steps: data.steps !== undefined ? Number(data.steps) : (existingLog?.steps || 0),
      exerciseMinutes:
        data.exerciseMinutes !== undefined
          ? Number(data.exerciseMinutes)
          : (existingLog?.exerciseMinutes || 0),
      exerciseName: data.exerciseName || existingLog?.exerciseName,
      sleepHours: data.sleepHours !== undefined ? Number(data.sleepHours) : (existingLog?.sleepHours || 7),
      mood: data.mood || existingLog?.mood,
      energyLevel: data.energyLevel !== undefined ? Number(data.energyLevel) : (existingLog?.energyLevel || 7),
      notes: data.notes !== undefined ? data.notes : existingLog?.notes,
      completedMealIds: data.completedMealIds || existingLog?.completedMealIds || [],
      wellnessScore: 0,
      checkInCompleted: data.checkInCompleted !== undefined ? Boolean(data.checkInCompleted) : true,
      createdAt: existingLog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Recalculate wellness score
    const breakdown = calculateDailyWellnessScore(mergedLog, metrics);
    mergedLog.wellnessScore = breakdown.overallScore;

    dbRepository.saveDailyLog(mergedLog);

    return NextResponse.json({
      success: true,
      log: mergedLog,
      breakdown,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save daily log" }, { status: 500 });
  }
}
