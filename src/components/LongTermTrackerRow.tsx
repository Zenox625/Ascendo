"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTracker } from "@/lib/actions";
import { longTermPercent, round1 } from "@/lib/tracking";
import type { Tracker } from "@/types/tracking";

export default function LongTermTrackerRow({ tracker, total, color }: { tracker: Tracker; total: number; color: string }) {
  const [, startTransition] = useTransition();
  const pct = longTermPercent(tracker.long_term_goal, total);

  return (
    <div className="tracker-row">
      <div className="tracker-main">
        <div className="tracker-thumb tracker-thumb-lg">
          {tracker.image ? (
            <img src={tracker.image} alt="" />
          ) : (
            <div className="thumb-fallback" style={{ background: color + "22", color }}>
              {tracker.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="tracker-info">
          <div className="tracker-name">{tracker.name}</div>
          <div className="bar-track bar-track-lg">
            <div className="bar-fill" style={{ width: `${pct ?? 0}%`, background: color }} />
          </div>
          <div className="tracker-meta">
            {round1(total)}
            {tracker.long_term_goal ? ` of ${tracker.long_term_goal}` : ""}
            {tracker.unit ? ` ${tracker.unit}` : ""}
          </div>
        </div>
      </div>
      <div className="tracker-side">
        <div className="pct-num" style={{ color }}>
          {pct === null ? "—" : `${pct}%`}
        </div>
      </div>
      <button className="row-delete" onClick={() => startTransition(() => deleteTracker(tracker.id, tracker.subcategory_id))}>
        <Trash2 size={13} />
      </button>
    </div>
  );
}
