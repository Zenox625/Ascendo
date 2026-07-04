"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { EmptyState } from "@/components/atoms";
import { IconPick } from "@/components/icons";
import TrackerForm from "@/components/TrackerForm";
import DailyTrackerRow from "@/components/DailyTrackerRow";
import LongTermTrackerRow from "@/components/LongTermTrackerRow";
import { setSubcategoryAscentCategory } from "@/lib/actions";
import { ASCENT_CATEGORIES } from "@/lib/ascent";
import type { Subcategory, Tracker } from "@/types/tracking";

export default function SubcategoryDetailClient({
  mode,
  subcat,
  trackers,
  valuesByTracker,
  date,
  backHref,
}: {
  mode: "daily" | "longterm";
  subcat: Subcategory;
  trackers: Tracker[];
  valuesByTracker: Record<string, number>;
  date?: string;
  backHref: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();
  const [trackerList, setTrackerList] = useState(trackers);

  const handleCreated = (tracker: Tracker) => setTrackerList((prev) => [...prev, tracker]);

  return (
    <div>
      <Link href={backHref} className="btn btn-ghost mb-16">
        <ChevronLeft size={14} /> Back
      </Link>
      <div className="cover-band" style={{ background: subcat.color }}>
        <div className="cover-band-icon">
          <IconPick name={subcat.icon} size={19} color={subcat.color} />
        </div>
      </div>
      <div className="row-between cover-title">
        <h2 className="h2">{subcat.name}</h2>
        <select
          className="input ascent-category-select"
          value={subcat.ascent_category ?? ""}
          onChange={(e) => startTransition(() => setSubcategoryAscentCategory(subcat.id, e.target.value))}
        >
          <option value="" disabled>
            Ascent category…
          </option>
          {ASCENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="tracker-list mb-16">
        {trackerList.map((tr) =>
          mode === "daily" ? (
            <DailyTrackerRow key={tr.id} tracker={tr} value={valuesByTracker[tr.id] ?? 0} color={subcat.color} date={date!} />
          ) : (
            <LongTermTrackerRow key={tr.id} tracker={tr} total={valuesByTracker[tr.id] ?? 0} color={subcat.color} />
          )
        )}
        {trackerList.length === 0 && !showForm && (
          <EmptyState
            title={mode === "daily" ? "Nothing to track here yet" : "Nothing here yet"}
            sub={mode === "daily" ? "Add a tracker to fill in today's progress." : "Trackers you add will show their overall progress here."}
          />
        )}
      </div>

      {showForm ? (
        <TrackerForm subcategoryId={subcat.id} ascentCategory={subcat.ascent_category} onCreated={handleCreated} onDone={() => setShowForm(false)} />
      ) : (
        <button className="btn btn-accent" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Add tracker
        </button>
      )}
    </div>
  );
}
