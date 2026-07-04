import { notFound } from "next/navigation";
import { getSubcategory, getTrackers, getTotalsByTracker } from "@/lib/data";
import SubcategoryDetailClient from "@/components/SubcategoryDetailClient";

export const dynamic = "force-dynamic";

export default async function LongTermSubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subcat = await getSubcategory(id);
  if (!subcat) notFound();

  const [trackers, totals] = await Promise.all([getTrackers(id), getTotalsByTracker()]);

  return (
    <SubcategoryDetailClient mode="longterm" subcat={subcat} trackers={trackers} valuesByTracker={totals} backHref="/longterm" />
  );
}
