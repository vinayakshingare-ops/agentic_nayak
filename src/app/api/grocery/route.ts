import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { dbRepository } from "@/lib/db";
import { generateGroceryListFromMealPlan } from "@/lib/grocery-generator";

export async function GET() {
  const userId = await getCurrentUserId();
  const items = dbRepository.getGroceries(userId);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const data = await req.json();

    if (data.action === "toggle") {
      const items = dbRepository.toggleGroceryItem(userId, data.itemId);
      return NextResponse.json({ success: true, items });
    }

    if (data.action === "add") {
      const item = dbRepository.addGroceryItem(userId, {
        name: data.name,
        amount: data.amount || "1 unit",
        category: data.category || "other",
        isPurchased: false,
      });
      return NextResponse.json({ success: true, item });
    }

    if (data.action === "clear_purchased") {
      const current = dbRepository.getGroceries(userId);
      const remaining = current.filter((i) => !i.isPurchased);
      dbRepository.saveGroceries(userId, remaining);
      return NextResponse.json({ success: true, items: remaining });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to modify groceries" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("id");

  if (itemId) {
    dbRepository.deleteGroceryItem(userId, itemId);
  }

  const items = dbRepository.getGroceries(userId);
  return NextResponse.json({ success: true, items });
}

export async function PUT() {
  // Regenerate list from meal plan
  const userId = await getCurrentUserId();
  const mealPlan = dbRepository.getMealPlan(userId);

  if (!mealPlan) {
    return NextResponse.json({ error: "No active meal plan found" }, { status: 404 });
  }

  const items = generateGroceryListFromMealPlan(mealPlan, userId);
  dbRepository.saveGroceries(userId, items);

  return NextResponse.json({ success: true, items });
}
