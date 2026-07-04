import { getSubcategories, getTrackers, getTotalsByTracker } from "@/lib/data";
import { longTermPercent, avgOrZero } from "@/lib/tracking";
import SubcategoryGridClient from "@/components/SubcategoryGridClient";

export const dynamic = "force-dynamic";

export default async function LongTermPage() {
  const [subcats, trackers, totals] = await Promise.all([getSubcategories(), getTrackers(), getTotalsByTracker()]);

  const cards = subcats.map((sc) => {
    const own = trackers.filter((t) => t.subcategory_id === sc.id);
    const withGoal = own.filter((t) => t.long_term_goal);
    const percents = withGoal.map((t) => longTermPercent(t.long_term_goal, totals[t.id] ?? 0) ?? 0);
    return { id: sc.id, name: sc.name, icon: sc.icon, color: sc.color, percent: avgOrZero(percents), trackerCount: own.length };
  });

  return <SubcategoryGridClient title="Long-term goals" cards={cards} basePath="/longterm" />;
}
