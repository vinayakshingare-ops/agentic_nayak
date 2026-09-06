import {
  AIMessage,
  DailyLog,
  HealthMetrics,
  HealthProfile,
  MealPlan,
} from "@/types";

export interface AIResponsePayload {
  reply: string;
  suggestions: string[];
}

export async function processAIChatMessage(
  userPrompt: string,
  profile: HealthProfile,
  metrics: HealthMetrics,
  currentMealPlan?: MealPlan,
  todayLog?: DailyLog
): Promise<AIResponsePayload> {
  const query = userPrompt.toLowerCase().trim();

  // 1. SAFETY & MEDICAL GUARDRAIL FILTER
  const medicalTriggers = [
    "chest pain",
    "heart attack",
    "stroke",
    "prescribe",
    "medication",
    "dosage",
    "diagnose",
    "cancer",
    "pregnancy diet",
    "eating disorder",
    "anorexia",
    "bulimia",
    "severe headache",
    "fainting",
  ];

  for (const trigger of medicalTriggers) {
    if (query.includes(trigger)) {
      return {
        reply:
          "⚠️ **Important Health Notice**\n\n" +
          "I am your AI Wellness & Nutrition Companion, but I cannot diagnose medical conditions, provide medical treatment, or prescribe medications. If you or someone you know is experiencing acute symptoms, pain, or high-risk medical concerns, please consult a licensed physician, registered dietitian, or contact emergency health services immediately.",
        suggestions: [
          "Suggest a balanced high-protein snack",
          "What can I eat for dinner tonight?",
          "How can I hit my water target?",
        ],
      };
    }
  }

  // Allergy reminder
  const allergyWarning =
    profile.allergies.length > 0
      ? `*(Noted allergies: ${profile.allergies.join(", ")} — strictly avoided)*`
      : "";

  // 2. CONTEXTUAL INTELLIGENCE RESPONSES

  // Query: High-protein snack or meal
  if (query.includes("high-protein") || query.includes("protein")) {
    if (profile.dietaryPreference === "vegetarian" || profile.dietaryPreference === "vegan") {
      return {
        reply:
          `Here are high-protein choices tailored to your **${profile.dietaryPreference}** preference ${allergyWarning}:\n\n` +
          `1. **Roasted Spiced Edamame & Makhana**: ~14g protein, low glycemic load, rich in fiber.\n` +
          `2. **Tempeh or Spiced Tofu Cubes with Chia Dressing**: ~20g plant protein.\n` +
          `3. **Lupini Beans or Sprouted Moong Salad with Lemon & Mint**: ~15g clean plant protein.\n` +
          `4. **Pea & Brown Rice Protein Shake with Almond Milk**: ~25g complete amino acid profile.\n\n` +
          `*Daily Target reminder: Your target is **${metrics.proteinG}g** protein/day to support your ${profile.goal.replace("_", " ")} goal.*`,
        suggestions: [
          "Give me a quick 10-minute breakfast",
          "What should I eat before a workout?",
          "How to stay full on fewer calories",
        ],
      };
    } else {
      return {
        reply:
          `Here are prime high-protein options tailored to your profile ${allergyWarning}:\n\n` +
          `1. **Herb-Grilled Chicken Breast or Turkey Bites**: ~32g protein per 100g.\n` +
          `2. **Hard-Boiled Free-Range Eggs with Avocado Slices**: ~14g protein + healthy fats.\n` +
          `3. **Smoked Salmon on Cucumber Rounds with Greek Yogurt Dip**: ~22g protein.\n` +
          `4. **0% Fat Greek Yogurt Parfait with Hemp Seeds**: ~24g protein.\n\n` +
          `*Daily Target reminder: Your target is **${metrics.proteinG}g** protein/day.*`,
        suggestions: [
          "Suggest a healthy dinner",
          "Swap today's lunch",
          "What can I eat before a workout?",
        ],
      };
    }
  }

  // Query: Dinner recommendation
  if (query.includes("dinner") || query.includes("what should i eat for dinner")) {
    const todayDinner = currentMealPlan?.days[0]?.meals.find(
      (m) => m.mealType === "dinner"
    );

    const plannedInfo = todayDinner
      ? `According to your current plan, today's dinner is **${todayDinner.name}** (~${todayDinner.calories} kcal, ${todayDinner.protein}g protein).`
      : `Aim for around **${Math.round(metrics.targetCalories * 0.3)} kcal** with **${Math.round(metrics.proteinG * 0.35)}g** protein.`;

    return {
      reply:
        `${plannedInfo}\n\n` +
        `**Optimal Dinner Guidelines for your ${profile.goal.replace("_", " ")} goal:**\n` +
        `• Keep complex carbs moderate so sleep is not disrupted by sluggish digestion.\n` +
        `• Fill half your plate with non-starchy cruciferous greens or fiber-rich vegetables.\n` +
        `• Finish eating at least 2 hours before your target sleep time (~${profile.dinnerTime || "8:00 PM"}).\n\n` +
        `Would you like me to suggest an alternative dinner swap?`,
      suggestions: [
        "Swap today's dinner meal",
        "Give me a light vegetarian dinner",
        "What can I drink before bed?",
      ],
    };
  }

  // Query: Ate too much at lunch / compensatory advice
  if (
    query.includes("ate too much") ||
    query.includes("overate") ||
    query.includes("binged") ||
    query.includes("cheated")
  ) {
    return {
      reply:
        `First, take a deep breath — **do not stress or try to starve yourself tonight.** 💚\n\n` +
        `A single meal does not undo weeks of healthy habits. Here is the constructive, gentle protocol:\n\n` +
        `1. **Go for a gentle 15-20 minute walk**: This aids gastric motility and blunts glucose spikes.\n` +
        `2. **Hydrate steadily**: Drink 2 large glasses of warm water or peppermint tea.\n` +
        `3. **Do NOT skip dinner entirely**: Skipping often causes intense late-night cravings. Instead, opt for a light broth, steamed greens, or a bowl of yellow lentil soup.\n` +
        `4. **Reset tomorrow with kindness**: Your weekly average is what drives health and body composition.`,
      suggestions: [
        "Suggest a very light dinner",
        "How much water should I drink today?",
        "Log a 20-minute walk",
      ],
    };
  }

  // Query: Pre-workout food
  if (query.includes("workout") || query.includes("exercise") || query.includes("pre-workout")) {
    return {
      reply:
        `**Pre & Post Workout Nutrition Guidelines:**\n\n` +
        `• **45-60 min before workout**: Quick-digesting carbohydrates with minimal fat to avoid gastrointestinal distress. Examples: 1 medium banana with 1 tsp nut butter, or 2 medjool dates, or half a bowl of oatmeal.\n` +
        `• **Hydration**: Drink 350-500ml of water 30 minutes before starting.\n` +
        `• **Post-workout (within 1-2 hours)**: Combine 20-30g protein with complex carbs to replenish glycogen and support muscular repair (e.g., grilled protein with sweet potato or a protein shake with fruit).`,
      suggestions: [
        "View today's exercise suggestion",
        "What should I eat after training?",
        "How many calories do I burn in 30 min?",
      ],
    };
  }

  // Query: Quick breakfast / lack of time
  if (query.includes("breakfast") || query.includes("quick") || query.includes("morning")) {
    return {
      reply:
        `Here are 3 rapid, 5-minute breakfast ideas matching your **${profile.dietaryPreference}** diet ${allergyWarning}:\n\n` +
        `1. **Overnight Oats with Chia & Berries**: Prep in 2 minutes the night before. Wake up and eat immediately (~350 kcal, 15g protein).\n` +
        `2. **Power Green Smoothie**: Blend almond milk, baby spinach, banana, and 1 scoop protein powder (~290 kcal, 24g protein).\n` +
        `3. **Warm Sourdough with Nut Butter & Hemp Seeds**: Quick toasted crunch with sustained steady energy (~320 kcal, 12g protein).`,
      suggestions: [
        "Add ingredients to grocery list",
        "What is my target calorie intake?",
        "Show today's lunch",
      ],
    };
  }

  // Query: Budget / Cheaper meals
  if (query.includes("budget") || query.includes("cheap") || query.includes("cost")) {
    return {
      reply:
        `**Smart Budget-Friendly Nutrition Strategy:**\n\n` +
        `• **Lentils, Chickpeas & Dry Beans**: The most cost-effective protein sources on earth ($0.30/serving), loaded with prebiotic fiber.\n` +
        `• **Buy Seasonal & Frozen**: Frozen berries and frozen broccoli retain all vitamins at roughly 40% lower cost than off-season fresh produce.\n` +
        `• **Eggs & Whole Grains (Oats/Brown Rice)**: High satiety index per dollar spent.\n` +
        `• **Batch Cooking**: Cook large portions of dals, grains, and roasted veggies on Sunday to save money and avoid impulsive delivery orders.`,
      suggestions: [
        "Generate my grocery list",
        "High-protein vegetarian meal",
        "Explain today's diet plan",
      ],
    };
  }

  // Default intelligent response with user stats
  return {
    reply:
      `Hello ${profile.userId ? "" : "there"}! I'm your Vitalis Health Assistant.\n\n` +
      `Here is your live health snapshot:\n` +
      `• **BMI**: ${metrics.bmi} (${metrics.bmiCategoryLabel})\n` +
      `• **Target Calories**: ${metrics.targetCalories.toLocaleString()} kcal/day\n` +
      `• **Protein Target**: ${metrics.proteinG}g | **Water**: ${metrics.waterGlasses} glasses (${metrics.waterMl} ml)\n` +
      `• **Goal**: ${profile.goal.replace("_", " ")} | **Diet**: ${profile.dietaryPreference.replace("_", " ")}\n\n` +
      `How can I assist your health and nutrition today? Ask me for recipe swaps, snack recommendations, grocery tips, or workout fuel!`,
    suggestions: [
      "What should I eat for dinner?",
      "Give me a high-protein vegetarian meal",
      "Suggest a healthy afternoon snack",
      "I ate too much at lunch, what should I do?",
    ],
  };
}
