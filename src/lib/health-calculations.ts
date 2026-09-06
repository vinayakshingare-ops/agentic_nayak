import {
  ActivityLevel,
  BmiCategory,
  Gender,
  HealthGoal,
  HealthMetrics,
  HealthProfile,
} from "@/types";

export interface BmiAnalysis {
  bmi: number;
  category: BmiCategory;
  categoryLabel: string;
  healthyWeightRangeKg: { min: number; max: number };
  disclaimer: string;
}

/**
 * Calculate Body Mass Index (BMI) and categorization
 * Formula: weight (kg) / (height (m))^2
 */
export function calculateBmi(weightKg: number, heightCm: number): BmiAnalysis {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: "normal",
      categoryLabel: "Normal range",
      healthyWeightRangeKg: { min: 0, max: 0 },
      disclaimer: "BMI is a general screening metric, not a medical diagnosis.",
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let category: BmiCategory = "normal";
  let categoryLabel = "Normal range";

  if (bmi < 18.5) {
    category = "underweight";
    categoryLabel = "Underweight";
  } else if (bmi < 25.0) {
    category = "normal";
    categoryLabel = "Normal weight";
  } else if (bmi < 30.0) {
    category = "overweight";
    categoryLabel = "Overweight";
  } else {
    category = "obese";
    categoryLabel = "Obesity";
  }

  // Healthy weight range (BMI 18.5 - 24.9)
  const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    categoryLabel,
    healthyWeightRangeKg: {
      min: minHealthyWeight,
      max: maxHealthyWeight,
    },
    disclaimer:
      "BMI is a standard population screening indicator and does not directly measure body fat or muscle mass. It is not a medical diagnosis.",
  };
}

/**
 * Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor Equation:
 * Men: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
 * Women: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
 * Neutral/Other: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 78
 */
export function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender = "prefer_not_to_say"
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  let bmr = base - 78; // neutral average

  if (gender === "male") {
    bmr = base + 5;
  } else if (gender === "female") {
    bmr = base - 161;
  }

  return Math.max(900, Math.round(bmr));
}

/**
 * Total Daily Energy Expenditure (TDEE) based on activity multipliers
 */
export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2, // Little to no exercise, desk job
    lightly_active: 1.375, // Light exercise 1-3 days/week
    moderately_active: 1.55, // Moderate exercise 3-5 days/week
    very_active: 1.725, // Hard exercise 6-7 days/week
    extremely_active: 1.9, // Very hard daily exercise or physical job
  };

  const multiplier = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate goal-adjusted calorie target with conservative safety floors
 */
export function calculateTargetCalories(
  tdee: number,
  goal: HealthGoal,
  gender: Gender = "prefer_not_to_say"
): number {
  let target = tdee;

  switch (goal) {
    case "lose_weight":
      target = tdee - 450; // Moderate, sustainable deficit (~0.4 - 0.5 kg/week)
      break;
    case "maintain_weight":
    case "improve_fitness":
      target = tdee;
      break;
    case "gain_weight":
      target = tdee + 400; // Lean surplus
      break;
    case "build_muscle":
      target = tdee + 300; // Hypertrophy surplus
      break;
  }

  // Safety floor enforcement (avoid metabolic suppression or nutritional deficiency)
  const absoluteFloor = gender === "female" ? 1200 : 1450;
  return Math.max(absoluteFloor, Math.round(target));
}

/**
 * Calculate macronutrient distribution in grams
 */
export function calculateMacros(
  targetCalories: number,
  weightKg: number,
  goal: HealthGoal
): { proteinG: number; carbsG: number; fatG: number } {
  // Protein: higher for muscle preservation/growth
  let proteinPerKg = 1.6;
  if (goal === "build_muscle" || goal === "lose_weight") {
    proteinPerKg = 1.8;
  } else if (goal === "gain_weight") {
    proteinPerKg = 1.7;
  } else {
    proteinPerKg = 1.4;
  }

  let proteinG = Math.round(weightKg * proteinPerKg);
  // Cap protein between 60g and 220g for safety
  proteinG = Math.min(220, Math.max(55, proteinG));
  const proteinCals = proteinG * 4;

  // Fat: 28% of total calories (essential fatty acids & hormone health)
  const fatCals = targetCalories * 0.28;
  const fatG = Math.max(45, Math.round(fatCals / 9));

  // Carbohydrates: remainder of energy
  const remainingCals = Math.max(200, targetCalories - (proteinCals + fatG * 9));
  const carbsG = Math.round(remainingCals / 4);

  return { proteinG, carbsG, fatG };
}

/**
 * Calculate daily water requirement in milliliters & 250ml glass equivalents
 * General baseline: ~35ml per kg body weight + active adjustment
 */
export function calculateHydration(
  weightKg: number,
  activityLevel: ActivityLevel
): { waterMl: number; waterGlasses: number } {
  let ml = weightKg * 35;

  if (activityLevel === "very_active" || activityLevel === "extremely_active") {
    ml += 600;
  } else if (activityLevel === "moderately_active") {
    ml += 350;
  }

  // Bound between 2000ml (8 glasses) and 4000ml (16 glasses)
  const boundedMl = Math.min(4000, Math.max(2000, Math.round(ml / 100) * 100));
  const glasses = Math.round(boundedMl / 250);

  return { waterMl: boundedMl, waterGlasses: glasses };
}

/**
 * Compile complete health metrics for a user profile
 */
export function generateHealthMetrics(
  profile: Partial<HealthProfile>
): HealthMetrics {
  const weight = profile.weightKg || 70;
  const height = profile.heightCm || 170;
  const age = profile.age || 28;
  const gender = profile.gender || "prefer_not_to_say";
  const activity = profile.activityLevel || "moderately_active";
  const goal = profile.goal || "lose_weight";

  const bmiAnalysis = calculateBmi(weight, height);
  const bmr = calculateBmr(weight, height, age, gender);
  const tdee = calculateTdee(bmr, activity);
  const targetCalories = calculateTargetCalories(tdee, goal, gender);
  const { proteinG, carbsG, fatG } = calculateMacros(targetCalories, weight, goal);
  const { waterMl, waterGlasses } = calculateHydration(weight, activity);

  // Targets for steps and exercise
  let targetSteps = 8000;
  if (activity === "sedentary") targetSteps = 6000;
  else if (activity === "lightly_active") targetSteps = 8000;
  else if (activity === "moderately_active") targetSteps = 10000;
  else if (activity === "very_active" || activity === "extremely_active") targetSteps = 12000;

  const targetExerciseMinutes =
    activity === "sedentary" ? 20 : activity === "lightly_active" ? 30 : 45;

  return {
    userId: profile.userId || "temp",
    bmi: bmiAnalysis.bmi,
    bmiCategory: bmiAnalysis.category,
    bmiCategoryLabel: bmiAnalysis.categoryLabel,
    bmr,
    tdee,
    targetCalories,
    proteinG,
    carbsG,
    fatG,
    waterMl,
    waterGlasses,
    targetSteps,
    targetExerciseMinutes,
    targetSleepHours: 8,
    dailyWellnessScore: 82, // Baseline initial score
    updatedAt: new Date().toISOString(),
  };
}
