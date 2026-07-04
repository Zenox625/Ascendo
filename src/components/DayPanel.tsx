"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Clock, Plus, Trash2 } from "lucide-react";
import { addEvent, deleteEvent } from "@/lib/actions";
import { formatDayNav } from "@/lib/dates";
import type { EventRow } from "@/types/tracking";

export default function DayPanel({ date, events }: { date: string; events: EventRow[] }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [, startTransition] = useTransition();

  const submit = () => {
    if (!title.trim()) return;
    const t = title.trim();
    setTitle("");
    setTime("");
    startTransition(() => {
      addEvent(date, t, time);
    });
  };

  return (
    <div className="card day-panel">
      <div className="row-between mb-10">
        <div className="day-panel-title">{formatDayNav(date)}</div>
        <Link href={`/daily?date=${date}`} className="link-btn">
          Open daily tracking
        </Link>
      </div>
      <div className="event-list mb-10">
        {events.map((ev) => (
          <div key={ev.id} className="event-row">
            {ev.event_time && (
              <span className="event-time">
                <Clock size={11} /> {ev.event_time}
              </span>
            )}
            <span className="event-title">{ev.title}</span>
            <button className="row-delete" onClick={() => startTransition(() => deleteEvent(ev.id))}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {events.length === 0 && <div className="empty-sub">No events for this day</div>}
      </div>
      <div className="event-add-row">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add an event or reminder…"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <input className="input event-time-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button className="btn-icon" onClick={submit}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
