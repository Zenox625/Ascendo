import { supabaseAdmin } from "@/lib/supabase";
import type { Subcategory, Tracker, Note, EventRow } from "@/types/tracking";

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabaseAdmin().from("subcategories").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getSubcategory(id: string): Promise<Subcategory | null> {
  const { data, error } = await supabaseAdmin().from("subcategories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getTrackers(subcategoryId?: string): Promise<Tracker[]> {
  let q = supabaseAdmin().from("trackers").select("*").order("created_at");
  if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getEntriesForDate(date: string): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin().from("tracker_entries").select("tracker_id, value").eq("entry_date", date);
  if (error) throw error;
  const map: Record<string, number> = {};
  for (const row of data ?? []) map[row.tracker_id] = Number(row.value);
  return map;
}

export async function getTotalsByTracker(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin().from("tracker_entries").select("tracker_id, value");
  if (error) throw error;
  const map: Record<string, number> = {};
  for (const row of data ?? []) map[row.tracker_id] = (map[row.tracker_id] ?? 0) + Number(row.value);
  return map;
}

export async function getEntriesForRange(start: string, end: string): Promise<{ tracker_id: string; entry_date: string; value: number }[]> {
  const { data, error } = await supabaseAdmin()
    .from("tracker_entries")
    .select("tracker_id, entry_date, value")
    .gte("entry_date", start)
    .lte("entry_date", end);
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, value: Number(r.value) }));
}

export async function getEventsForRange(start: string, end: string): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("events")
    .select("*")
    .gte("event_date", start)
    .lte("event_date", end)
    .order("event_time");
  if (error) throw error;
  return data ?? [];
}

export async function getEventsForDate(date: string): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin().from("events").select("*").eq("event_date", date).order("event_time");
  if (error) throw error;
  return data ?? [];
}

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabaseAdmin().from("notes").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabaseAdmin().from("notes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getAscentTotals(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin().from("ascent_log").select("category, points");
  if (error) throw error;
  const totals: Record<string, number> = {};
  for (const row of data ?? []) totals[row.category] = (totals[row.category] ?? 0) + Number(row.points);
  return totals;
}
