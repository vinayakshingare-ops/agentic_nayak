import fs from "fs";
import path from "path";
import {
  Achievement,
  AIMessage,
  AppSettings,
  DailyLog,
  ExerciseRoutine,
  GroceryItem,
  HealthMetrics,
  HealthProfile,
  MealPlan,
  User,
  UserAchievement,
} from "@/types";
import { generateHealthMetrics } from "./health-calculations";
import { generatePersonalizedMealPlan } from "./diet-engine";
import { generateGroceryListFromMealPlan } from "./grocery-generator";

export interface DatabaseSchema {
  users: User[];
  profiles: Record<string, HealthProfile>;
  metrics: Record<string, HealthMetrics>;
  dailyLogs: Record<string, DailyLog[]>; // userId -> array of logs (latest first)
  mealPlans: Record<string, MealPlan>; // userId -> active plan
  groceryLists: Record<string, GroceryItem[]>;
  userAchievements: Record<string, UserAchievement[]>;
  chatMessages: Record<string, AIMessage[]>;
  settings: Record<string, AppSettings>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "vitalis-store.json");

// In-memory cache
let cachedDb: DatabaseSchema | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  unitSystem: "metric",
  theme: "light",
  notifications: {
    mealReminders: true,
    waterReminders: true,
    workoutReminders: true,
    sleepReminders: true,
    weeklyDigest: true,
    emailNotifications: false,
  },
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "streak-3",
    title: "Habit Igniter",
    description: "Logged your health metrics 3 days in a row.",
    icon: "🔥",
    category: "streak",
    threshold: 3,
  },
  {
    id: "streak-7",
    title: "Consistency Champion",
    description: "Maintained a 7-day daily tracking streak.",
    icon: "⚡",
    category: "streak",
    threshold: 7,
  },
  {
    id: "hydration-master",
    title: "Hydration Hero",
    description: "Hit your daily water target 5 days this week.",
    icon: "💧",
    category: "hydration",
    threshold: 5,
  },
  {
    id: "steps-10k",
    title: "10K Steps Club",
    description: "Walked 10,000+ steps in a single day.",
    icon: "🚶",
    category: "steps",
    threshold: 10000,
  },
  {
    id: "diet-streak",
    title: "Mindful Eater",
    description: "Completed 85%+ of planned healthy meals for 7 days.",
    icon: "🥗",
    category: "diet",
    threshold: 7,
  },
  {
    id: "first-week",
    title: "First Week Complete",
    description: "Successfully finished your first 7-day personalized wellness cycle.",
    icon: "🏆",
    category: "tracking",
    threshold: 7,
  },
];

import { EXERCISE_LIBRARY } from "./exercise-data";

/**
 * Generate initial realistic seed data for Rahul Sharma (demo user)
 */
function createDemoSeed(): DatabaseSchema {
  const demoUserId = "demo-user-rahul";

  const demoUser: User = {
    id: demoUserId,
    name: "Rahul Sharma",
    email: "demo@vitalis.health",
    passwordHash: "demo123", // In a real production DB, hashed via bcrypt
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoProfile: HealthProfile = {
    userId: demoUserId,
    age: 28,
    gender: "male",
    heightCm: 175,
    weightKg: 82.4,
    targetWeightKg: 74.0,
    activityLevel: "moderately_active",
    exerciseFrequencyDays: 4,
    dailyStepsEstimate: 8500,
    goal: "lose_weight",
    dietaryPreference: "vegetarian",
    allergies: ["peanuts"],
    foodsToAvoid: ["mushrooms"],
    preferredCuisine: "indian",
    mealsPerDay: 4,
    breakfastTime: "08:30",
    lunchTime: "13:30",
    dinnerTime: "20:00",
    dailyBudget: "moderate",
    cookingPreference: "quick",
    availableEquipment: ["stove", "microwave", "air_fryer", "blender"],
    updatedAt: new Date().toISOString(),
  };

  const demoMetrics = generateHealthMetrics(demoProfile);
  demoMetrics.userId = demoUserId;

  // Generate 7-day personalized meal plan
  const demoMealPlan = generatePersonalizedMealPlan(
    demoProfile,
    demoMetrics.targetCalories,
    demoMetrics.proteinG,
    7
  );
  demoMealPlan.userId = demoUserId;

  // Mark today's breakfast, mid-morning, and lunch completed in Day 1
  if (demoMealPlan.days[0]) {
    demoMealPlan.days[0].meals[0].isCompleted = true;
    demoMealPlan.days[0].meals[1].isCompleted = true;
    demoMealPlan.days[0].meals[2].isCompleted = true;
  }

  // Generate grocery list from meal plan
  const demoGroceries = generateGroceryListFromMealPlan(demoMealPlan, demoUserId);
  // Pre-check 10 items to simulate purchased items
  demoGroceries.forEach((item, idx) => {
    if (idx % 2 === 0 && idx < 16) {
      item.isPurchased = true;
    }
  });

  // Generate 14 days of realistic logs
  const demoLogs: DailyLog[] = [];
  const baseWeight = 84.2;

  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split("T")[0];

    // Gradual weight loss curve with minor natural fluctuations
    const weightTrend = baseWeight - (14 - i) * 0.13 + (Math.sin(i) * 0.15);
    const roundedWeight = Math.round(weightTrend * 10) / 10;

    const steps = i === 0 ? 7420 : 7000 + Math.round(Math.abs(Math.sin(i * 1.5)) * 4200);
    const waterMl = i === 0 ? 2000 : 2250 + Math.round(Math.abs(Math.cos(i)) * 1000);
    const exerciseMins = i === 0 ? 25 : i % 2 === 0 ? 35 : 20;
    const sleepHours = 7.0 + Math.round(Math.sin(i) * 1.2 * 10) / 10;
    const wellnessScore = i === 0 ? 84 : 76 + Math.round(Math.abs(Math.sin(i * 2)) * 18);

    demoLogs.push({
      id: `log-${demoUserId}-${dateStr}`,
      userId: demoUserId,
      date: dateStr,
      weightKg: roundedWeight,
      waterMl,
      steps,
      exerciseMinutes: exerciseMins,
      exerciseName: i % 2 === 0 ? "Full Body Strength & Core" : "Brisk Outdoor Walk",
      sleepHours: Math.max(5.5, Math.min(8.5, sleepHours)),
      mood: i % 3 === 0 ? "great" : "good",
      energyLevel: 8,
      notes:
        i === 0
          ? "Great energy today! Enjoyed the spiced oats breakfast and stayed hydrated during afternoon meetings."
          : undefined,
      completedMealIds:
        i === 0
          ? [demoMealPlan.days[0]?.meals[0]?.id, demoMealPlan.days[0]?.meals[1]?.id, demoMealPlan.days[0]?.meals[2]?.id].filter(Boolean) as string[]
          : ["meal-1", "meal-2", "meal-3", "meal-4"],
      wellnessScore,
      checkInCompleted: true,
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    });
  }

  // Pre-configured achievements
  const demoAchievements: UserAchievement[] = DEFAULT_ACHIEVEMENTS.map((a, idx) => ({
    achievementId: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    threshold: a.threshold,
    currentValue: idx < 4 ? a.threshold : Math.round(a.threshold * 0.7),
    isUnlocked: idx < 4,
    unlockedAt: idx < 4 ? new Date(Date.now() - (4 - idx) * 86400000).toISOString() : undefined,
  }));

  // Initial chat message history
  const demoChat: AIMessage[] = [
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Hello Rahul! 👋 I'm your Vitalis Health Assistant. I've personalized your nutrition plan for **moderate weight loss** with **vegetarian, peanut-free meals** at **2,100 kcal/day**.\n\nHow can I support your health today? You can ask me for meal swaps, pre-workout fuel ideas, or tips to boost afternoon hydration!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      suggestions: [
        "What should I eat for dinner?",
        "Give me a high-protein vegetarian meal",
        "Suggest a quick breakfast swap",
      ],
    },
  ];

  return {
    users: [demoUser],
    profiles: { [demoUserId]: demoProfile },
    metrics: { [demoUserId]: demoMetrics },
    dailyLogs: { [demoUserId]: demoLogs },
    mealPlans: { [demoUserId]: demoMealPlan },
    groceryLists: { [demoUserId]: demoGroceries },
    userAchievements: { [demoUserId]: demoAchievements },
    chatMessages: { [demoUserId]: demoChat },
    settings: { [demoUserId]: DEFAULT_SETTINGS },
  };
}

/**
 * Load database from disk or initialize with rich seed
 */
export function getDb(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      cachedDb = JSON.parse(data);
      if (cachedDb && cachedDb.users && cachedDb.users.length > 0) {
        return cachedDb;
      }
    } catch (e) {
      console.warn("Could not read db file, re-initializing:", e);
    }
  }

  cachedDb = createDemoSeed();
  saveDb(cachedDb);
  return cachedDb;
}

/**
 * Atomically save database to disk
 */
export function saveDb(db: DatabaseSchema): void {
  ensureDataDir();
  cachedDb = db;
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// =================== DATA ACCESS REPOSITORY API ===================

export const dbRepository = {
  // --- USERS & AUTH ---
  findUserByEmail(email: string): User | undefined {
    const db = getDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id: string): User | undefined {
    const db = getDb();
    return db.users.find((u) => u.id === id);
  },

  createUser(user: User): User {
    const db = getDb();
    db.users.push(user);
    saveDb(db);
    return user;
  },

  // --- HEALTH PROFILES ---
  getProfile(userId: string): HealthProfile | undefined {
    const db = getDb();
    return db.profiles[userId];
  },

  saveProfile(profile: HealthProfile): HealthProfile {
    const db = getDb();
    db.profiles[profile.userId] = profile;

    // Recalculate metrics automatically
    const metrics = generateHealthMetrics(profile);
    metrics.userId = profile.userId;
    db.metrics[profile.userId] = metrics;

    saveDb(db);
    return profile;
  },

  // --- METRICS ---
  getMetrics(userId: string): HealthMetrics | undefined {
    const db = getDb();
    return db.metrics[userId];
  },

  saveMetrics(metrics: HealthMetrics): HealthMetrics {
    const db = getDb();
    db.metrics[metrics.userId] = metrics;
    saveDb(db);
    return metrics;
  },

  // --- DAILY LOGS ---
  getLogs(userId: string): DailyLog[] {
    const db = getDb();
    return db.dailyLogs[userId] || [];
  },

  getLogForDate(userId: string, date: string): DailyLog | undefined {
    const logs = this.getLogs(userId);
    return logs.find((l) => l.date === date);
  },

  saveDailyLog(log: DailyLog): DailyLog {
    const db = getDb();
    if (!db.dailyLogs[log.userId]) {
      db.dailyLogs[log.userId] = [];
    }

    const existingIdx = db.dailyLogs[log.userId].findIndex((l) => l.date === log.date);
    if (existingIdx >= 0) {
      db.dailyLogs[log.userId][existingIdx] = {
        ...db.dailyLogs[log.userId][existingIdx],
        ...log,
        updatedAt: new Date().toISOString(),
      };
    } else {
      db.dailyLogs[log.userId].unshift(log); // Insert at start
    }

    // Sort by date descending
    db.dailyLogs[log.userId].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    saveDb(db);
    return log;
  },

  // --- MEAL PLANS ---
  getMealPlan(userId: string): MealPlan | undefined {
    const db = getDb();
    return db.mealPlans[userId];
  },

  saveMealPlan(plan: MealPlan): MealPlan {
    const db = getDb();
    db.mealPlans[plan.userId] = plan;
    saveDb(db);
    return plan;
  },

  // --- GROCERIES ---
  getGroceries(userId: string): GroceryItem[] {
    const db = getDb();
    return db.groceryLists[userId] || [];
  },

  saveGroceries(userId: string, items: GroceryItem[]): GroceryItem[] {
    const db = getDb();
    db.groceryLists[userId] = items;
    saveDb(db);
    return items;
  },

  toggleGroceryItem(userId: string, itemId: string): GroceryItem[] {
    const db = getDb();
    const items = db.groceryLists[userId] || [];
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.isPurchased = !item.isPurchased;
      saveDb(db);
    }
    return items;
  },

  addGroceryItem(
    userId: string,
    item: Omit<GroceryItem, "id" | "userId" | "createdAt" | "isCustom"> & { isCustom?: boolean }
  ): GroceryItem {
    const db = getDb();
    if (!db.groceryLists[userId]) db.groceryLists[userId] = [];

    const newItem: GroceryItem = {
      id: `custom-${Date.now()}`,
      userId,
      ...item,
      isCustom: item.isCustom ?? true,
      createdAt: new Date().toISOString(),
    };

    db.groceryLists[userId].unshift(newItem);
    saveDb(db);
    return newItem;
  },

  deleteGroceryItem(userId: string, itemId: string): void {
    const db = getDb();
    if (db.groceryLists[userId]) {
      db.groceryLists[userId] = db.groceryLists[userId].filter((i) => i.id !== itemId);
      saveDb(db);
    }
  },

  // --- ACHIEVEMENTS ---
  getAchievements(userId: string): UserAchievement[] {
    const db = getDb();
    return db.userAchievements[userId] || [];
  },

  // --- CHAT MESSAGES ---
  getChatMessages(userId: string): AIMessage[] {
    const db = getDb();
    return db.chatMessages[userId] || [];
  },

  addChatMessage(userId: string, message: AIMessage): AIMessage[] {
    const db = getDb();
    if (!db.chatMessages[userId]) db.chatMessages[userId] = [];
    db.chatMessages[userId].push(message);
    saveDb(db);
    return db.chatMessages[userId];
  },

  clearChat(userId: string): void {
    const db = getDb();
    db.chatMessages[userId] = [];
    saveDb(db);
  },

  // --- SETTINGS ---
  getSettings(userId: string): AppSettings {
    const db = getDb();
    return db.settings[userId] || DEFAULT_SETTINGS;
  },

  saveSettings(userId: string, settings: AppSettings): AppSettings {
    const db = getDb();
    db.settings[userId] = settings;
    saveDb(db);
    return settings;
  },
};
