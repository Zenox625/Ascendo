export const round1 = (n: number): number => Math.round(n * 10) / 10;

export function dailyPercent(dailyGoal: number, value: number): number {
  return dailyGoal ? Math.min(100, Math.round((value / dailyGoal) * 100)) : 0;
}

export function longTermPercent(longTermGoal: number | null | undefined, total: number): number | null {
  return longTermGoal ? Math.min(100, Math.round((total / longTermGoal) * 100)) : null;
}

export function avgOrZero(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
