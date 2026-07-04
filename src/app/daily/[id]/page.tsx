import { notFound } from "next/navigation";
import { getSubcategory, getTrackers, getEntriesForDate } from "@/lib/data";
import { todayISO } from "@/lib/dates";
import DateNav from "@/components/DateNav";
import SubcategoryDetailClient from "@/components/SubcategoryDetailClient";

export const dynamic = "force-dynamic";

export default async function DailySubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const date = sp.date || todayISO();

  const subcat = await getSubcategory(id);
  if (!subcat) notFound();

  const [trackers, entries] = await Promise.all([getTrackers(id), getEntriesForDate(date)]);

  return (
    <div>
      <div className="mb-16">
        <DateNav date={date} />
      </div>
      <SubcategoryDetailClient
        mode="daily"
        subcat={subcat}
        trackers={trackers}
        valuesByTracker={entries}
        date={date}
        backHref={`/daily?date=${date}`}
      />
    </div>
  );
}
