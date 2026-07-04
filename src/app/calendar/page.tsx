import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTrackers, getEntriesForRange, getEventsForRange, getEventsForDate } from "@/lib/data";
import { dailyPercent, avgOrZero } from "@/lib/tracking";
import { currentMonthKey, shiftMonthKey, monthRange, monthLabel, firstWeekdayOffset, todayISO, WEEKDAYS_SHORT } from "@/lib/dates";
import DayPanel from "@/components/DayPanel";

export const dynamic = "force-dynamic";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string; date?: string }> }) {
  const sp = await searchParams;
  const monthKey = sp.month || currentMonthKey();
  const selectedDate = sp.date || todayISO();
  const { start, end, year, month, daysInMonth } = monthRange(monthKey);

  const [trackers, entries, events, dayEvents] = await Promise.all([
    getTrackers(),
    getEntriesForRange(start, end),
    getEventsForRange(start, end),
    getEventsForDate(selectedDate),
  ]);

  const entriesByDate: Record<string, Record<string, number>> = {};
  for (const e of entries) {
    (entriesByDate[e.entry_date] ??= {})[e.tracker_id] = e.value;
  }
  const eventDatesWithEvents = new Set(events.map((e) => e.event_date));

  const startOffset = firstWeekdayOffset(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isoFor = (d: number) => `${monthKey}-${String(d).padStart(2, "0")}`;
  const today = todayISO();
  const prevMonth = shiftMonthKey(monthKey, -1);
  const nextMonth = shiftMonthKey(monthKey, 1);

  return (
    <div>
      <div className="row-between mb-16">
        <h2 className="h2">Calendar</h2>
        <div className="row-gap">
          <Link href={`/calendar?month=${prevMonth}&date=${selectedDate}`} className="btn-icon">
            <ChevronLeft size={15} />
          </Link>
          <div className="month-label">{monthLabel(monthKey)}</div>
          <Link href={`/calendar?month=${nextMonth}&date=${selectedDate}`} className="btn-icon">
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      <div className="cal-grid cal-head">
        {WEEKDAYS_SHORT.map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>
      <div className="cal-grid mb-16">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="cal-cell cal-empty" />;
          const dateStr = isoFor(d);
          const dayEntries = entriesByDate[dateStr];
          const hasAnyEntry = !!dayEntries && Object.keys(dayEntries).length > 0;
          const pct = hasAnyEntry ? avgOrZero(trackers.map((t) => dailyPercent(t.daily_goal, dayEntries[t.id] ?? 0))) : null;
          const hasEvents = eventDatesWithEvents.has(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          return (
            <Link
              key={i}
              href={`/calendar?month=${monthKey}&date=${dateStr}`}
              className={`cal-cell cal-day ${isToday ? "cal-today" : ""} ${isSelected ? "cal-selected" : ""}`}
            >
              {hasEvents && <span className="cal-event-mark" />}
              <span className="cal-daynum">{d}</span>
              {pct !== null && <span className="cal-dot" style={{ opacity: 0.3 + (pct / 100) * 0.7 }} />}
            </Link>
          );
        })}
      </div>

      <DayPanel date={selectedDate} events={dayEvents} />
    </div>
  );
}
