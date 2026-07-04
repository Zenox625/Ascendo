import { getSubcategories, getTrackers, getEntriesForDate } from "@/lib/data";
import { dailyPercent, avgOrZero } from "@/lib/tracking";
import { todayISO } from "@/lib/dates";
import DateNav from "@/components/DateNav";
import SubcategoryGridClient from "@/components/SubcategoryGridClient";

export const dynamic = "force-dynamic";

export default async function DailyPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const date = params.date || todayISO();

  const [subcats, trackers, entries] = await Promise.all([getSubcategories(), getTrackers(), getEntriesForDate(date)]);

  const cards = subcats.map((sc) => {
    const own = trackers.filter((t) => t.subcategory_id === sc.id);
    const percents = own.map((t) => dailyPercent(t.daily_goal, entries[t.id] ?? 0));
    return { id: sc.id, name: sc.name, icon: sc.icon, color: sc.color, percent: avgOrZero(percents), trackerCount: own.length };
  });

  return (
    <div>
      <div className="mb-16">
        <DateNav date={date} />
      </div>
      <SubcategoryGridClient title="Daily goals" cards={cards} basePath="/daily" dateQuery={date} />
    </div>
  );
}
