export const ASCENT_CATEGORIES = [
  "Apprentissage",
  "Santé & Fitness",
  "Bien-être Mental",
  "Productivité",
  "Relations",
  "Finance",
  "Créativité",
] as const;

export type AscentCategory = (typeof ASCENT_CATEGORIES)[number];

const TIER_NAMES = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Champ", "Ascent"] as const;
const TIER_SIZE = 100;
const ASCENT_THRESHOLD = 600;

export type Tier = {
  name: (typeof TIER_NAMES)[number];
  min: number;
  max: number | null; // null for the top tier (Ascent), which has no upper bound yet (resets not implemented)
  progressPct: number; // progress within the current tier, 0-100
};

export function tierForPoints(points: number): Tier {
  if (points >= ASCENT_THRESHOLD) {
    return { name: "Ascent", min: ASCENT_THRESHOLD, max: null, progressPct: 100 };
  }
  const index = Math.min(Math.floor(points / TIER_SIZE), TIER_NAMES.length - 2);
  const min = index * TIER_SIZE;
  const max = min + TIER_SIZE;
  return { name: TIER_NAMES[index], min, max, progressPct: Math.round(((points - min) / TIER_SIZE) * 100) };
}

export type AscentAction = { name: string; unit: string; dailyGoal: number; points: number };

export const ASCENT_ACTIONS: Record<AscentCategory, AscentAction[]> = {
  "Apprentissage": [
    { name: "Read a book (30 min)", unit: "min", dailyGoal: 30, points: 5 },
    { name: "Read a book (1h)", unit: "min", dailyGoal: 60, points: 10 },
    { name: "Take a course (1h)", unit: "min", dailyGoal: 60, points: 15 },
    { name: "Write notes / summary", unit: "min", dailyGoal: 20, points: 20 },
  ],
  "Santé & Fitness": [
    { name: "Workout (30 min)", unit: "min", dailyGoal: 30, points: 15 },
    { name: "Workout (1h)", unit: "min", dailyGoal: 60, points: 25 },
    { name: "Sleep 8h", unit: "h", dailyGoal: 8, points: 10 },
    { name: "Stretch / yoga", unit: "min", dailyGoal: 30, points: 10 },
  ],
  "Bien-être Mental": [
    { name: "Meditate (10 min)", unit: "min", dailyGoal: 10, points: 10 },
    { name: "Meditate (30 min)", unit: "min", dailyGoal: 30, points: 25 },
    { name: "Journal", unit: "min", dailyGoal: 15, points: 10 },
    { name: "Gratitude list", unit: "items", dailyGoal: 5, points: 5 },
  ],
  "Productivité": [
    { name: "Complete daily task", unit: "task", dailyGoal: 1, points: 5 },
    { name: "Finish project milestone", unit: "task", dailyGoal: 1, points: 50 },
    { name: "Clear to-do list", unit: "list", dailyGoal: 1, points: 20 },
  ],
  "Relations": [
    { name: "Call / visit a friend", unit: "min", dailyGoal: 30, points: 15 },
    { name: "Help someone", unit: "act", dailyGoal: 1, points: 20 },
    { name: "Social outing", unit: "outing", dailyGoal: 1, points: 25 },
  ],
  "Finance": [
    { name: "Plan budget", unit: "session", dailyGoal: 1, points: 20 },
    { name: "Pay bills on time", unit: "bill", dailyGoal: 1, points: 10 },
    { name: "Log an investment", unit: "action", dailyGoal: 1, points: 50 },
  ],
  "Créativité": [
    { name: "Creative project (1h)", unit: "min", dailyGoal: 60, points: 15 },
    { name: "Finish a creative work", unit: "work", dailyGoal: 1, points: 50 },
    { name: "Share a creation", unit: "post", dailyGoal: 1, points: 10 },
  ],
};

export function globalAverage(totals: Record<string, number>): { points: number; pct: number } {
  const values = ASCENT_CATEGORIES.map((c) => totals[c] ?? 0);
  const points = values.reduce((a, b) => a + b, 0) / values.length;
  return { points: Math.round(points), pct: Math.round((Math.min(points, ASCENT_THRESHOLD) / ASCENT_THRESHOLD) * 100) };
}
