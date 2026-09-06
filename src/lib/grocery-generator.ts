import { GroceryCategory, GroceryItem, MealPlan } from "@/types";

export function generateGroceryListFromMealPlan(
  mealPlan: MealPlan,
  userId: string
): GroceryItem[] {
  const itemMap = new Map<string, { amount: string; category: GroceryCategory }>();

  // Aggregate ingredients from all days and meals
  for (const day of mealPlan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.ingredients) {
        const key = ing.name.toLowerCase().trim();
        if (!itemMap.has(key)) {
          itemMap.set(key, { amount: ing.amount, category: ing.category });
        }
      }
    }
  }

  const items: GroceryItem[] = [];
  let index = 1;

  itemMap.forEach((val, key) => {
    // Format name with proper capitalization
    const capitalizedName = key
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    items.push({
      id: `groc-${Date.now()}-${index++}`,
      userId,
      name: capitalizedName,
      amount: val.amount,
      category: val.category,
      isPurchased: false,
      isCustom: false,
      createdAt: new Date().toISOString(),
    });
  });

  // Sort by category then name
  const categoryPriority: Record<GroceryCategory, number> = {
    vegetables: 1,
    fruits: 2,
    grains: 3,
    protein: 4,
    dairy: 5,
    pantry: 6,
    other: 7,
  };

  return items.sort((a, b) => {
    const pA = categoryPriority[a.category] || 99;
    const pB = categoryPriority[b.category] || 99;
    if (pA !== pB) return pA - pB;
    return a.name.localeCompare(b.name);
  });
}
