import {
  DayPlan,
  DietaryPreference,
  GroceryCategory,
  HealthProfile,
  Ingredient,
  Meal,
  MealAlternative,
  MealPlan,
  MealType,
} from "@/types";

interface RecipeTemplate {
  name: string;
  mealType: MealType;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  portionSize: string;
  prepNotes: string;
  suitableDiets: DietaryPreference[];
  allergens: string[]; // e.g. ["dairy", "gluten", "peanuts", "eggs", "soy", "shellfish", "nuts"]
  cuisines: string[];
  ingredients: Ingredient[];
  alternatives: {
    name: string;
    description: string;
    allergens: string[];
    suitableDiets: DietaryPreference[];
    ingredients: Ingredient[];
  }[];
}

export const RECIPE_CATALOG: RecipeTemplate[] = [
  // --- BREAKFASTS ---
  {
    name: "Spiced Masala Rolled Oats & Chia Bowl",
    mealType: "breakfast",
    baseCalories: 380,
    baseProtein: 16,
    baseCarbs: 56,
    baseFat: 10,
    portionSize: "1 medium bowl (250g)",
    prepNotes:
      "Cook rolled oats in water or almond milk with turmeric, cumin, and mild green chillies. Top with roasted chia seeds and chopped cilantro.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "halal", "jain"],
    allergens: ["gluten"], // oats can contain gluten unless certified
    cuisines: ["indian", "balanced"],
    ingredients: [
      { name: "Rolled Oats", amount: "60g", category: "grains" },
      { name: "Chia Seeds", amount: "15g", category: "pantry" },
      { name: "Almond Milk", amount: "150ml", category: "dairy" },
      { name: "Mixed Spices (Turmeric, Cumin)", amount: "5g", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Gluten-Free Quinoa Upma with Roasted Almonds",
        description: "Fluffy quinoa cooked with mustard seeds, curry leaves, and ginger.",
        allergens: ["nuts"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "halal", "jain"],
        ingredients: [
          { name: "Quinoa", amount: "60g", category: "grains" },
          { name: "Almonds", amount: "15g", category: "pantry" },
          { name: "Curry Leaves & Mustard Seeds", amount: "5g", category: "pantry" },
        ],
      },
      {
        name: "Moong Dal Cheela with Mint Chutney",
        description: "Savory lentil crepes rich in plant protein, zero gluten.",
        allergens: [],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "halal", "jain"],
        ingredients: [
          { name: "Yellow Moong Dal", amount: "70g", category: "grains" },
          { name: "Fresh Mint & Coriander", amount: "30g", category: "vegetables" },
          { name: "Olive Oil", amount: "1 tsp", category: "pantry" },
        ],
      },
    ],
  },
  {
    name: "Herbed Scrambled Eggs & Avocado Sourdough",
    mealType: "breakfast",
    baseCalories: 420,
    baseProtein: 24,
    baseCarbs: 34,
    baseFat: 20,
    portionSize: "2 slices toast + 2 eggs",
    prepNotes:
      "Whisk 2 whole eggs with fresh chives, cook gently in 1 tsp butter. Serve over toasted artisan sourdough with 1/4 sliced ripe avocado.",
    suitableDiets: ["non_vegetarian", "eggetarian", "halal"],
    allergens: ["eggs", "gluten", "dairy"],
    cuisines: ["continental", "mediterranean", "american", "balanced"],
    ingredients: [
      { name: "Farm Eggs", amount: "2 whole", category: "protein" },
      { name: "Sourdough Bread", amount: "2 slices", category: "grains" },
      { name: "Ripe Avocado", amount: "50g", category: "fruits" },
      { name: "Grass-fed Butter", amount: "5g", category: "dairy" },
    ],
    alternatives: [
      {
        name: "Tofu Scramble with Spinach & Cherry Tomatoes",
        description: "Crumbled firm organic tofu seasoned with nutritional yeast, turmeric, and garlic.",
        allergens: ["soy"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal"],
        ingredients: [
          { name: "Firm Tofu", amount: "150g", category: "protein" },
          { name: "Baby Spinach", amount: "50g", category: "vegetables" },
          { name: "Cherry Tomatoes", amount: "60g", category: "vegetables" },
        ],
      },
    ],
  },
  {
    name: "Greek Yogurt Berry Crunch Parfait",
    mealType: "breakfast",
    baseCalories: 360,
    baseProtein: 26,
    baseCarbs: 42,
    baseFat: 8,
    portionSize: "1 tall glass (280g)",
    prepNotes:
      "Layer unsweetened Greek yogurt with antioxidant-rich blueberries, sliced strawberries, a sprinkle of rolled oats, and pumpkin seeds.",
    suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["dairy", "gluten"],
    cuisines: ["continental", "mediterranean", "american", "balanced"],
    ingredients: [
      { name: "Greek Yogurt (Unsweetened)", amount: "200g", category: "dairy" },
      { name: "Blueberries & Strawberries", amount: "80g", category: "fruits" },
      { name: "Pumpkin Seeds", amount: "15g", category: "pantry" },
      { name: "Raw Honey", amount: "1 tsp", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Coconut Yogurt with Chia & Berry Compote",
        description: "100% dairy-free plant probiotic yogurt layered with warm berry reduction.",
        allergens: [],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Coconut Milk Yogurt", amount: "200g", category: "dairy" },
          { name: "Mixed Berries", amount: "80g", category: "fruits" },
          { name: "Chia Seeds", amount: "15g", category: "pantry" },
        ],
      },
    ],
  },

  // --- MID MORNING SNACKS ---
  {
    name: "Roasted Spiced Chickpeas & Green Tea",
    mealType: "mid_morning",
    baseCalories: 180,
    baseProtein: 8,
    baseCarbs: 26,
    baseFat: 4,
    portionSize: "1/2 cup (60g)",
    prepNotes:
      "Crispy air-fried or oven-roasted chickpeas dusted with chaat masala and smoked paprika. Accompanied by fresh brewed antioxidant green tea.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: [],
    cuisines: ["indian", "mediterranean", "balanced"],
    ingredients: [
      { name: "Kabuli Chickpeas", amount: "60g dry weight", category: "grains" },
      { name: "Chaat Masala & Paprika", amount: "3g", category: "pantry" },
      { name: "Green Tea Bag", amount: "1 bag", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Handful of Raw Walnuts & Golden Apple Slices",
        description: "Brain-healthy omega-3 fats combined with fresh dietary fiber.",
        allergens: ["nuts"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Walnuts", amount: "20g", category: "pantry" },
          { name: "Crisp Apple", amount: "1 medium", category: "fruits" },
        ],
      },
    ],
  },
  {
    name: "Whey or Pea Protein Shake with Coconut Water",
    mealType: "mid_morning",
    baseCalories: 190,
    baseProtein: 24,
    baseCarbs: 12,
    baseFat: 3,
    portionSize: "1 shaker (300ml)",
    prepNotes:
      "Shake 1 scoop clean protein powder with chilled natural coconut water and 1/2 banana for optimal electrolyte balance.",
    suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal"],
    allergens: ["dairy"],
    cuisines: ["continental", "balanced", "american"],
    ingredients: [
      { name: "Protein Powder", amount: "30g", category: "protein" },
      { name: "Fresh Coconut Water", amount: "250ml", category: "fruits" },
      { name: "Banana", amount: "1/2 fruit", category: "fruits" },
    ],
    alternatives: [
      {
        name: "Plant Pea Protein Shake (Dairy-Free)",
        description: "Hypoallergenic vegan isolate protein blended with water and cinnamon.",
        allergens: [],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Pea Protein Isolate", amount: "30g", category: "protein" },
          { name: "Almond or Oat Milk", amount: "250ml", category: "dairy" },
        ],
      },
    ],
  },

  // --- LUNCH ---
  {
    name: "Grilled Paneer Tikka with Brown Basmati & Cucumber Raita",
    mealType: "lunch",
    baseCalories: 540,
    baseProtein: 28,
    baseCarbs: 58,
    baseFat: 20,
    portionSize: "1 plate (150g paneer + 1 cup rice)",
    prepNotes:
      "Marinate low-fat cottage cheese (paneer) in yogurt and spices. Grill with bell peppers and onions. Serve alongside nutty brown rice and cooling cucumber raita.",
    suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["dairy"],
    cuisines: ["indian", "balanced"],
    ingredients: [
      { name: "Paneer (Low-Fat Cottage Cheese)", amount: "140g", category: "dairy" },
      { name: "Brown Basmati Rice", amount: "70g uncooked", category: "grains" },
      { name: "Bell Peppers & Onions", amount: "100g", category: "vegetables" },
      { name: "Curd (Yogurt)", amount: "80g", category: "dairy" },
      { name: "Cucumber", amount: "50g", category: "vegetables" },
    ],
    alternatives: [
      {
        name: "Tofu & Edamame Brown Rice Bowl",
        description: "Marinated pan-seared organic tofu with steamed edamame and brown rice.",
        allergens: ["soy"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Extra Firm Tofu", amount: "150g", category: "protein" },
          { name: "Shelled Edamame", amount: "50g", category: "vegetables" },
          { name: "Brown Rice", amount: "70g uncooked", category: "grains" },
        ],
      },
      {
        name: "Dal Makhani (Low Cream) with Missi Roti & Kachumber Salad",
        description: "Slow-cooked black lentils in tomato reduction with chickpea flatbread.",
        allergens: ["gluten", "dairy"],
        suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal"],
        ingredients: [
          { name: "Black Urad Dal & Rajma", amount: "70g", category: "grains" },
          { name: "Besan / Wheat Flour", amount: "60g", category: "grains" },
          { name: "Cucumber & Tomatoes", amount: "100g", category: "vegetables" },
        ],
      },
    ],
  },
  {
    name: "Herb Grilled Chicken Breast with Quinoa & Roasted Veggies",
    mealType: "lunch",
    baseCalories: 520,
    baseProtein: 42,
    baseCarbs: 46,
    baseFat: 14,
    portionSize: "1 plate (180g chicken + 3/4 cup quinoa)",
    prepNotes:
      "Tender chicken breast seasoned with oregano, thyme, garlic, and extra virgin olive oil. Served with fluffy quinoa, zucchini, and roasted carrots.",
    suitableDiets: ["non_vegetarian", "halal"],
    allergens: [],
    cuisines: ["mediterranean", "continental", "american", "balanced"],
    ingredients: [
      { name: "Chicken Breast (Boneless/Skinless)", amount: "180g", category: "protein" },
      { name: "Tri-Color Quinoa", amount: "60g dry", category: "grains" },
      { name: "Zucchini & Baby Carrots", amount: "120g", category: "vegetables" },
      { name: "Extra Virgin Olive Oil", amount: "1 tbsp", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Wild Atlantic Salmon Fillet with Sweet Potato Mash",
        description: "Rich in heart-protective Omega-3 fatty acids and vitamin A.",
        allergens: ["fish"],
        suitableDiets: ["non_vegetarian", "halal"],
        ingredients: [
          { name: "Salmon Fillet", amount: "160g", category: "protein" },
          { name: "Sweet Potato", amount: "150g", category: "vegetables" },
          { name: "Steamed Asparagus", amount: "80g", category: "vegetables" },
        ],
      },
    ],
  },
  {
    name: "Mediterranean Chickpea & Lentil Buddha Bowl",
    mealType: "lunch",
    baseCalories: 490,
    baseProtein: 22,
    baseCarbs: 68,
    baseFat: 14,
    portionSize: "1 generous bowl (320g)",
    prepNotes:
      "Spiced chickpeas, French green lentils, kalamata olives, cherry tomatoes, and baby greens drizzled with tahini-lemon dressing.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["sesame"],
    cuisines: ["mediterranean", "continental", "balanced"],
    ingredients: [
      { name: "Cooked Chickpeas", amount: "120g", category: "grains" },
      { name: "Cooked Green Lentils", amount: "80g", category: "grains" },
      { name: "Cherry Tomatoes & Cucumber", amount: "100g", category: "vegetables" },
      { name: "Tahini (Sesame Paste)", amount: "15g", category: "pantry" },
      { name: "Fresh Lemon Juice", amount: "1 tbsp", category: "fruits" },
    ],
    alternatives: [
      {
        name: "Kidney Bean (Rajma) Bowl with Steamed Brown Rice",
        description: "North Indian style aromatic kidney bean curry with steamed whole grains.",
        allergens: [],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Red Kidney Beans (Rajma)", amount: "120g", category: "grains" },
          { name: "Brown Rice", amount: "70g", category: "grains" },
          { name: "Onion, Ginger & Tomato Gravy", amount: "80g", category: "vegetables" },
        ],
      },
    ],
  },

  // --- EVENING SNACK ---
  {
    name: "Roasted Makhana (Fox Nuts) & Steamed Edamame",
    mealType: "evening_snack",
    baseCalories: 160,
    baseProtein: 9,
    baseCarbs: 22,
    baseFat: 3,
    portionSize: "1 small bowl (40g makhana + 50g edamame)",
    prepNotes:
      "Lightly roast crunchy makhana with a drop of cold-pressed ghee and pink Himalayan salt. Pair with warm steamed edamame pods.",
    suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["soy", "dairy"],
    cuisines: ["indian", "asian", "balanced"],
    ingredients: [
      { name: "Phool Makhana (Fox Nuts)", amount: "35g", category: "grains" },
      { name: "Edamame Pods", amount: "50g", category: "vegetables" },
      { name: "Cold-Pressed Ghee", amount: "1/2 tsp", category: "dairy" },
    ],
    alternatives: [
      {
        name: "Hummus with Carrot & Cucumber Batons",
        description: "Silky chickpea hummus with crisp garden crudités. 100% dairy-free.",
        allergens: ["sesame"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Chickpea Hummus", amount: "50g", category: "pantry" },
          { name: "Carrot & Cucumber Sticks", amount: "120g", category: "vegetables" },
        ],
      },
    ],
  },

  // --- DINNER ---
  {
    name: "Yellow Dal Tadka with Steamed Rice & Sauteed Methi/Palak",
    mealType: "dinner",
    baseCalories: 480,
    baseProtein: 22,
    baseCarbs: 66,
    baseFat: 12,
    portionSize: "1 bowl dal + 1 cup rice + 1 cup greens",
    prepNotes:
      "Comforting toor & moong dal tempered with cumin, garlic, and tomatoes. Served with aromatic basmati rice and stir-fried garlic spinach.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal"],
    allergens: [],
    cuisines: ["indian", "balanced"],
    ingredients: [
      { name: "Toor & Moong Dal", amount: "70g dry", category: "grains" },
      { name: "Basmati Rice", amount: "65g dry", category: "grains" },
      { name: "Fresh Spinach (Palak)", amount: "150g", category: "vegetables" },
      { name: "Tomatoes & Garlic", amount: "50g", category: "vegetables" },
      { name: "Mustard Oil or Olive Oil", amount: "1 tsp", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Lentil Vegetable Soup with Sourdough Bread",
        description: "Hearty European style brown lentil potage with rosemary.",
        allergens: ["gluten"],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal"],
        ingredients: [
          { name: "Brown Lentils", amount: "70g", category: "grains" },
          { name: "Carrots, Celery & Leeks", amount: "120g", category: "vegetables" },
          { name: "Sourdough Toast", amount: "1 slice", category: "grains" },
        ],
      },
    ],
  },
  {
    name: "Pan-Seared White Fish or Salmon with Steamed Broccoli & Sweet Potato",
    mealType: "dinner",
    baseCalories: 490,
    baseProtein: 38,
    baseCarbs: 38,
    baseFat: 16,
    portionSize: "1 plate (170g fish + 1 cup broccoli)",
    prepNotes:
      "Wild white fish fillet cooked with lemon zest, garlic, and fresh dill. Accompanied by nutrient-dense steamed broccoli florets and roasted sweet potato wedges.",
    suitableDiets: ["non_vegetarian", "halal"],
    allergens: ["fish"],
    cuisines: ["mediterranean", "continental", "balanced"],
    ingredients: [
      { name: "White Fish Fillet (Cod/Sea Bass/Tilapia)", amount: "170g", category: "protein" },
      { name: "Broccoli Florets", amount: "150g", category: "vegetables" },
      { name: "Sweet Potato", amount: "120g", category: "vegetables" },
      { name: "Olive Oil & Lemon", amount: "1 tbsp", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Grilled Turkey / Chicken Skewers with Greek Salad",
        description: "Lean poultry breast with crisp bell peppers, red onion, and olive oil dressing.",
        allergens: [],
        suitableDiets: ["non_vegetarian", "halal"],
        ingredients: [
          { name: "Lean Turkey or Chicken", amount: "170g", category: "protein" },
          { name: "Salad Greens & Tomato", amount: "150g", category: "vegetables" },
          { name: "Feta or Olive Dressing", amount: "15g", category: "dairy" },
        ],
      },
    ],
  },
  {
    name: "Stir-Fried Tofu with Asian Greens & Jasmine Rice",
    mealType: "dinner",
    baseCalories: 460,
    baseProtein: 24,
    baseCarbs: 58,
    baseFat: 14,
    portionSize: "1 generous wok bowl",
    prepNotes:
      "Crisp pan-browned tofu tossed with bok choy, snap peas, bell peppers in a ginger-tamari glaze. Served over steamed fragrant jasmine rice.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["soy"],
    cuisines: ["asian", "continental", "balanced"],
    ingredients: [
      { name: "Organic Firm Tofu", amount: "160g", category: "protein" },
      { name: "Bok Choy & Snap Peas", amount: "150g", category: "vegetables" },
      { name: "Jasmine Rice", amount: "65g dry", category: "grains" },
      { name: "Sesame Oil & Tamari (Gluten-Free)", amount: "1 tbsp", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Paneer & Capsicum Bhurji with Multigrain Phulkas",
        description: "Spiced scrambled cottage cheese with soft whole wheat flatbreads.",
        allergens: ["dairy", "gluten"],
        suitableDiets: ["vegetarian", "eggetarian", "non_vegetarian", "halal"],
        ingredients: [
          { name: "Fresh Paneer", amount: "130g", category: "dairy" },
          { name: "Green Bell Pepper & Onion", amount: "100g", category: "vegetables" },
          { name: "Whole Wheat Atta", amount: "60g", category: "grains" },
        ],
      },
    ],
  },

  // --- BEDTIME / POST DINNER ---
  {
    name: "Warm Golden Turmeric Almond Milk",
    mealType: "bedtime",
    baseCalories: 110,
    baseProtein: 4,
    baseCarbs: 8,
    baseFat: 6,
    portionSize: "1 warm mug (200ml)",
    prepNotes:
      "Slowly simmer unsweetened almond milk with organic turmeric, cracked black pepper (to boost curcumin bioavailability), and a touch of cardamom.",
    suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
    allergens: ["nuts"],
    cuisines: ["indian", "balanced"],
    ingredients: [
      { name: "Unsweetened Almond Milk", amount: "200ml", category: "dairy" },
      { name: "Wild Turmeric & Cardamom Powder", amount: "3g", category: "pantry" },
      { name: "Black Pepper", amount: "1 pinch", category: "pantry" },
    ],
    alternatives: [
      {
        name: "Soothing Chamomile Lavender Herbal Tea",
        description: "Caffeine-free floral infusion for deep restorative sleep.",
        allergens: [],
        suitableDiets: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "halal", "jain"],
        ingredients: [
          { name: "Organic Chamomile Tea Bag", amount: "1 bag", category: "pantry" },
          { name: "Hot Water", amount: "250ml", category: "other" },
        ],
      },
    ],
  },
];

/**
 * Filter recipe by user dietary preference and allergens
 */
export function isRecipeSafe(
  recipe: RecipeTemplate | { suitableDiets: DietaryPreference[]; allergens: string[] },
  dietPreference: DietaryPreference,
  userAllergies: string[] = [],
  foodsToAvoid: string[] = []
): boolean {
  // Check dietary suitability
  if (!recipe.suitableDiets.includes(dietPreference)) {
    return false;
  }

  // Check allergen collision (case-insensitive)
  const normalizedAllergies = userAllergies.map((a) => a.toLowerCase().trim());
  for (const allergen of recipe.allergens) {
    if (normalizedAllergies.some((userA) => allergen.toLowerCase().includes(userA) || userA.includes(allergen.toLowerCase()))) {
      return false;
    }
  }

  // Check foods to avoid
  const normalizedAvoid = foodsToAvoid.map((f) => f.toLowerCase().trim());
  if (normalizedAvoid.length > 0 && "name" in recipe) {
    for (const food of normalizedAvoid) {
      if (food && recipe.name.toLowerCase().includes(food)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Generate a personalized Meal Plan for 7 days (or scalable to 30 days)
 */
export function generatePersonalizedMealPlan(
  profile: Partial<HealthProfile>,
  targetCalories: number,
  targetProtein: number,
  durationDays: number = 7
): MealPlan {
  const preference = profile.dietaryPreference || "vegetarian";
  const allergies = profile.allergies || [];
  const foodsToAvoid = profile.foodsToAvoid || [];
  const cuisine = profile.preferredCuisine || "balanced";

  // Filter recipes safe for user
  const safeRecipes = RECIPE_CATALOG.filter((recipe) =>
    isRecipeSafe(recipe, preference, allergies, foodsToAvoid)
  );

  // Group by meal type
  const breakfasts = safeRecipes.filter((r) => r.mealType === "breakfast");
  const midMornings = safeRecipes.filter((r) => r.mealType === "mid_morning");
  const lunches = safeRecipes.filter((r) => r.mealType === "lunch");
  const snacks = safeRecipes.filter((r) => r.mealType === "evening_snack");
  const dinners = safeRecipes.filter((r) => r.mealType === "dinner");
  const bedtimes = safeRecipes.filter((r) => r.mealType === "bedtime");

  // Fallback if catalog is narrow due to multi-allergy: use safe base items
  const getMeal = (list: RecipeTemplate[], fallbackType: MealType, dayIdx: number): RecipeTemplate => {
    if (list.length > 0) {
      return list[dayIdx % list.length];
    }
    // Return safe fallback
    return {
      name: `Wholesome Nourish Bowl (${fallbackType})`,
      mealType: fallbackType,
      baseCalories: Math.round(targetCalories / 4),
      baseProtein: Math.round(targetProtein / 4),
      baseCarbs: 45,
      baseFat: 12,
      portionSize: "1 plate",
      prepNotes: "Fresh whole food combination tailored to your dietary exclusions.",
      suitableDiets: [preference],
      allergens: [],
      cuisines: ["balanced"],
      ingredients: [
        { name: "Steamed Seasonal Greens", amount: "150g", category: "vegetables" },
        { name: "Complex Carbohydrates (Rice/Millet)", amount: "60g", category: "grains" },
        { name: "Clean Protein Source", amount: "100g", category: "protein" },
      ],
      alternatives: [],
    };
  };

  const dayNames = [
    "Day 1 — Monday",
    "Day 2 — Tuesday",
    "Day 3 — Wednesday",
    "Day 4 — Thursday",
    "Day 5 — Friday",
    "Day 6 — Saturday",
    "Day 7 — Sunday",
  ];

  const days: DayPlan[] = [];

  for (let i = 0; i < durationDays; i++) {
    const dayLabel = i < 7 ? dayNames[i] : `Day ${i + 1}`;
    
    // Pick recipes with cycling
    const bRecipe = getMeal(breakfasts, "breakfast", i);
    const mmRecipe = getMeal(midMornings, "mid_morning", i);
    const lRecipe = getMeal(lunches, "lunch", i);
    const sRecipe = getMeal(snacks, "evening_snack", i);
    const dRecipe = getMeal(dinners, "dinner", i);
    const btRecipe = getMeal(bedtimes, "bedtime", i);

    // Scale portions to match user's daily target calories
    const rawTotalCals =
      bRecipe.baseCalories +
      mmRecipe.baseCalories +
      lRecipe.baseCalories +
      sRecipe.baseCalories +
      dRecipe.baseCalories +
      btRecipe.baseCalories;

    const scaleFactor = Math.min(1.4, Math.max(0.7, targetCalories / rawTotalCals));

    const transformMeal = (r: RecipeTemplate, idSuffix: string): Meal => {
      const cals = Math.round(r.baseCalories * scaleFactor);
      const prot = Math.round(r.baseProtein * scaleFactor);
      const carbs = Math.round(r.baseCarbs * scaleFactor);
      const fat = Math.round(r.baseFat * scaleFactor);

      // Generate allergy-filtered alternatives
      const safeAlts: MealAlternative[] = (r.alternatives || [])
        .filter((alt) => isRecipeSafe(alt, preference, allergies, foodsToAvoid))
        .map((alt, altIdx) => ({
          id: `alt-${idSuffix}-${altIdx}`,
          name: alt.name,
          calories: Math.round(cals * 0.95),
          protein: Math.round(prot * 0.95),
          carbs: Math.round(carbs * 1.0),
          fat: Math.round(fat * 0.9),
          description: alt.description,
          ingredients: alt.ingredients,
        }));

      // If no alternative exists from catalog, add a dynamic healthy swap
      if (safeAlts.length === 0) {
        safeAlts.push({
          id: `alt-${idSuffix}-generic`,
          name: `Quick ${r.mealType === "breakfast" ? "Avocado & Chia Toast" : "Lentil & Steamed Veggies Plate"}`,
          calories: cals,
          protein: prot,
          carbs: carbs,
          fat: fat,
          description: "Allergy-safe balanced alternative with matched macros.",
          ingredients: [
            { name: "Seasonal Mixed Vegetables", amount: "120g", category: "vegetables" },
            { name: "Whole Grain / Seed Base", amount: "50g", category: "grains" },
          ],
        });
      }

      return {
        id: `meal-d${i + 1}-${idSuffix}`,
        mealType: r.mealType,
        name: r.name,
        calories: cals,
        protein: prot,
        carbs: carbs,
        fat: fat,
        portionSize: r.portionSize,
        prepNotes: r.prepNotes,
        ingredients: r.ingredients,
        alternatives: safeAlts,
        isCompleted: false,
      };
    };

    const meals: Meal[] = [
      transformMeal(bRecipe, "breakfast"),
      transformMeal(mmRecipe, "mid_morning"),
      transformMeal(lRecipe, "lunch"),
      transformMeal(sRecipe, "snack"),
      transformMeal(dRecipe, "dinner"),
      transformMeal(btRecipe, "bedtime"),
    ];

    const dayCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const dayProtein = meals.reduce((sum, m) => sum + m.protein, 0);

    const workoutSuggestions = [
      "30-minute moderate zone 2 brisk walk + core mobility",
      "Full-body bodyweight circuit (Squats, Push-ups, Glute bridges, Plank)",
      "45-minute strength & endurance session (Upper focus)",
      "Active recovery day: 20-min gentle yoga & hydration focus",
      "Lower body strength & 15-min incline walking",
      "High-energy outdoor walk or light jog + posture stretching",
      "Rest & reset: Mindful breathing, mobility flow & weekly prep",
    ];

    days.push({
      dayNumber: i + 1,
      dayLabel,
      dailyCalories: dayCalories,
      dailyProtein: dayProtein,
      dailyHydrationMl: 2800,
      exerciseSuggestion: workoutSuggestions[i % workoutSuggestions.length],
      meals,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    userId: profile.userId || "temp",
    title: `Personalized ${preference.replace("_", " ")} ${durationDays}-Day Plan`,
    durationDays,
    startDate: new Date().toISOString().split("T")[0],
    days,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Execute a meal swap within a meal plan
 */
export function swapMealInPlan(
  plan: MealPlan,
  dayNumber: number,
  mealId: string,
  alternativeId: string
): MealPlan {
  const updatedDays = plan.days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;

    const updatedMeals = day.meals.map((meal) => {
      if (meal.id !== mealId) return meal;

      const alt = meal.alternatives.find((a) => a.id === alternativeId);
      if (!alt) return meal;

      // Swap the meal with the alternative while preserving old meal as a swap option
      const oldAsAlternative: MealAlternative = {
        id: `prev-${meal.id}`,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        description: meal.prepNotes,
        ingredients: meal.ingredients,
      };

      const remainingAlts = meal.alternatives
        .filter((a) => a.id !== alternativeId)
        .concat(oldAsAlternative);

      return {
        ...meal,
        name: alt.name,
        calories: alt.calories,
        protein: alt.protein,
        carbs: alt.carbs,
        fat: alt.fat,
        prepNotes: alt.description,
        ingredients: alt.ingredients,
        alternatives: remainingAlts,
      };
    });

    const dailyCalories = updatedMeals.reduce((acc, m) => acc + m.calories, 0);
    const dailyProtein = updatedMeals.reduce((acc, m) => acc + m.protein, 0);

    return {
      ...day,
      meals: updatedMeals,
      dailyCalories,
      dailyProtein,
    };
  });

  return {
    ...plan,
    days: updatedDays,
  };
}
