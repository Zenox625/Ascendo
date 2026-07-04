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

export function globalAverage(totals: Record<string, number>): { points: number; pct: number } {
  const values = ASCENT_CATEGORIES.map((c) => totals[c] ?? 0);
  const points = values.reduce((a, b) => a + b, 0) / values.length;
  return { points: Math.round(points), pct: Math.round((Math.min(points, ASCENT_THRESHOLD) / ASCENT_THRESHOLD) * 100) };
}
