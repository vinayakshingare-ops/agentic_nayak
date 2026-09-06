export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type HealthGoal =
  | "lose_weight"
  | "maintain_weight"
  | "gain_weight"
  | "build_muscle"
  | "improve_fitness";

export type DietaryPreference =
  | "vegetarian"
  | "non_vegetarian"
  | "vegan"
  | "eggetarian"
  | "halal"
  | "jain";

export type CuisinePreference =
  | "indian"
  | "mediterranean"
  | "continental"
  | "asian"
  | "mexican"
  | "american"
  | "balanced";

export type CookingPreference = "quick" | "meal_prep" | "elaborate";

export type CookingEquipment =
  | "stove"
  | "microwave"
  | "oven"
  | "air_fryer"
  | "blender"
  | "instant_pot";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfile {
  userId: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  activityLevel: ActivityLevel;
  exerciseFrequencyDays: number;
  dailyStepsEstimate: number;
  goal: HealthGoal;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  foodsToAvoid: string[];
  preferredCuisine: CuisinePreference;
  mealsPerDay: number;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  dailyBudget: "budget" | "moderate" | "premium";
  cookingPreference: CookingPreference;
  availableEquipment: CookingEquipment[];
  updatedAt: string;
}

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export interface HealthMetrics {
  userId: string;
  bmi: number;
  bmiCategory: BmiCategory;
  bmiCategoryLabel: string;
  bmr: number; // Basal Metabolic Rate via Mifflin-St Jeor
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
  waterGlasses: number;
  targetSteps: number;
  targetExerciseMinutes: number;
  targetSleepHours: number;
  dailyWellnessScore: number;
  updatedAt: string;
}

export type MoodType = "great" | "good" | "okay" | "difficult";

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  waterMl: number;
  steps: number;
  exerciseMinutes: number;
  exerciseName?: string;
  sleepHours: number;
  mood?: MoodType;
  energyLevel?: number; // 1-10
  notes?: string;
  completedMealIds: string[];
  wellnessScore: number;
  checkInCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MealType =
  | "breakfast"
  | "mid_morning"
  | "lunch"
  | "evening_snack"
  | "dinner"
  | "bedtime";

export type GroceryCategory =
  | "vegetables"
  | "fruits"
  | "grains"
  | "protein"
  | "dairy"
  | "pantry"
  | "other";

export interface Ingredient {
  name: string;
  amount: string;
  category: GroceryCategory;
}

export interface MealAlternative {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  ingredients: Ingredient[];
}

export interface Meal {
  id: string;
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionSize: string;
  prepNotes: string;
  ingredients: Ingredient[];
  alternatives: MealAlternative[];
  isCompleted?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  dayLabel: string; // "Day 1 - Monday"
  date?: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyHydrationMl: number;
  exerciseSuggestion: string;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  durationDays: number; // 7, 14, 30
  startDate: string;
  days: DayPlan[];
  createdAt: string;
}

export interface GroceryItem {
  id: string;
  userId: string;
  name: string;
  amount: string;
  category: GroceryCategory;
  isPurchased: boolean;
  isCustom: boolean;
  createdAt: string;
}

export interface ExerciseItem {
  name: string;
  sets?: number;
  reps?: string;
  durationMinutes?: number;
  restSeconds?: number;
  targetMuscles: string;
  coachingTips: string;
  alternativeForInjury?: string;
}

export interface ExerciseRoutine {
  id: string;
  title: string;
  category: "strength" | "cardio" | "hiit" | "mobility" | "recovery";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  caloriesBurnedEstimate: number;
  exercises: ExerciseItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "tracking" | "hydration" | "diet" | "steps" | "streak";
  threshold: number;
}

export interface UserAchievement {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  currentValue: number;
  threshold: number;
  isUnlocked: boolean;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface NotificationSettings {
  mealReminders: boolean;
  waterReminders: boolean;
  workoutReminders: boolean;
  sleepReminders: boolean;
  weeklyDigest: boolean;
  emailNotifications: boolean;
}

export interface AppSettings {
  unitSystem: "metric" | "imperial";
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
}

export interface AdaptiveRecommendation {
  id: string;
  type: "positive" | "gentle_nudge" | "improvement" | "safety_notice";
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface WeeklyInsights {
  startDate: string;
  endDate: string;
  weightChangeKg: number;
  avgStepsPerDay: number;
  avgWaterMlPerDay: number;
  dietAdherencePercent: number;
  exerciseSessionsCompleted: number;
  bestDay: string;
  celebrationNote: string;
  focusAreaNote: string;
}
