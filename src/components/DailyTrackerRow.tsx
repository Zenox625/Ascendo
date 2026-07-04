"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addAmount, setAmount, deleteTracker } from "@/lib/actions";
import { dailyPercent, round1 } from "@/lib/tracking";
import type { Tracker } from "@/types/tracking";

export default function DailyTrackerRow({ tracker, value, color, date }: { tracker: Tracker; value: number; color: string; date: string }) {
  const [amt, setAmt] = useState("");
  const [pending, startTransition] = useTransition();
  const pct = dailyPercent(tracker.daily_goal, value);

  const submit = () => {
    const n = Number(amt);
    if (!n) return;
    setAmt("");
    startTransition(() => {
      addAmount(tracker.id, date, n, tracker.subcategory_id);
    });
  };

  return (
    <div className="tracker-row">
      <div className="tracker-main">
        <div className="tracker-thumb">
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
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
          </div>
          <div className="tracker-meta">
            {round1(value)} of {tracker.daily_goal}
            {tracker.unit ? ` ${tracker.unit}` : ""}
          </div>
        </div>
      </div>
      <div className="tracker-side">
        <div className="pct-num" style={{ color }}>
          {pct}%
        </div>
        <div className="add-row">
          <input
            className="input-sm"
            type="number"
            placeholder="+"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="btn-icon" onClick={submit} disabled={pending}>
            <Plus size={13} />
          </button>
        </div>
        {pct < 100 && (
          <button
            className="link-btn"
            onClick={() => startTransition(() => setAmount(tracker.id, date, tracker.daily_goal, tracker.subcategory_id))}
          >
            Complete
          </button>
        )}
      </div>
      <button
        className="row-delete"
        onClick={() => startTransition(() => deleteTracker(tracker.id, tracker.subcategory_id))}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
