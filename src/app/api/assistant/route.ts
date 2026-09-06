import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";
import { processAIChatMessage } from "@/lib/ai-assistant-service";
import { AIMessage } from "@/types";

export async function GET() {
  const userId = await getCurrentUserId();
  const messages = dbRepository.getChatMessages(userId);
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const profile = dbRepository.getProfile(userId) || ({} as any);
    const metrics = dbRepository.getMetrics(userId) || ({} as any);
    const mealPlan = dbRepository.getMealPlan(userId);
    const todayDate = new Date().toISOString().split("T")[0];
    const todayLog = dbRepository.getLogForDate(userId, todayDate);

    // Save user message
    const userMsg: AIMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: prompt.trim(),
      timestamp: new Date().toISOString(),
    };
    dbRepository.addChatMessage(userId, userMsg);

    // Process AI response
    const { reply, suggestions } = await processAIChatMessage(
      prompt,
      profile,
      metrics,
      mealPlan,
      todayLog
    );

    const assistantMsg: AIMessage = {
      id: `msg-ai-${Date.now()}`,
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString(),
      suggestions,
    };
    const updatedHistory = dbRepository.addChatMessage(userId, assistantMsg);

    return NextResponse.json({
      success: true,
      message: assistantMsg,
      history: updatedHistory,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service error" }, { status: 500 });
  }
}
