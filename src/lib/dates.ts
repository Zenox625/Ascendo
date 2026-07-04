export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function shiftDateISO(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthRange(monthKey: string): { start: string; end: string; year: number; month: number; daysInMonth: number } {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const start = `${monthKey}-01`;
  const end = `${monthKey}-${String(daysInMonth).padStart(2, "0")}`;
  return { start, end, year, month, daysInMonth };
}

export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDayNav(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}

export const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function firstWeekdayOffset(year: number, month: number): number {
  const first = new Date(year, month - 1, 1);
  return (first.getDay() + 6) % 7;
}
