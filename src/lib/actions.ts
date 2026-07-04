"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

function uid(): string {
  return randomBytes(6).toString("hex");
}

// --- Subcategories ---

export async function addSubcategory(name: string, icon: string, color: string) {
  const { error } = await supabaseAdmin()
    .from("subcategories")
    .insert({ id: uid(), name, icon, color, sort_order: Date.now() });
  if (error) throw error;
  revalidatePath("/daily");
  revalidatePath("/longterm");
}

export async function deleteSubcategory(id: string) {
  const { error } = await supabaseAdmin().from("subcategories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/daily");
  revalidatePath("/longterm");
}

// --- Trackers ---

export async function addTracker(
  subcategoryId: string,
  name: string,
  unit: string,
  dailyGoal: number,
  longTermGoal: number | null,
  image: string | null,
  ascentPoints: number
) {
  const { error } = await supabaseAdmin().from("trackers").insert({
    id: uid(),
    subcategory_id: subcategoryId,
    name,
    unit,
    daily_goal: dailyGoal,
    long_term_goal: longTermGoal,
    image,
    ascent_points: ascentPoints,
  });
  if (error) throw error;
  revalidatePath(`/daily/${subcategoryId}`);
  revalidatePath(`/longterm/${subcategoryId}`);
}

export async function deleteTracker(id: string, subcategoryId: string) {
  const { error } = await supabaseAdmin().from("trackers").delete().eq("id", id);
  if (error) throw error;
  revalidatePath(`/daily/${subcategoryId}`);
  revalidatePath(`/longterm/${subcategoryId}`);
}

// --- Ascent scoring ---

async function maybeAwardAscent(trackerId: string, date: string, newValue: number) {
  const { data: tracker, error: trackerError } = await supabaseAdmin()
    .from("trackers")
    .select("daily_goal, ascent_points, subcategory_id")
    .eq("id", trackerId)
    .maybeSingle();
  if (trackerError) throw trackerError;
  if (!tracker || newValue < tracker.daily_goal) return; // goal not reached yet

  const { data: subcat, error: subcatError } = await supabaseAdmin()
    .from("subcategories")
    .select("ascent_category")
    .eq("id", tracker.subcategory_id)
    .maybeSingle();
  if (subcatError) throw subcatError;
  if (!subcat?.ascent_category) return; // category not assigned yet, nothing to credit

  const { data: existingLog, error: logReadError } = await supabaseAdmin()
    .from("ascent_log")
    .select("id")
    .eq("tracker_id", trackerId)
    .eq("entry_date", date)
    .maybeSingle();
  if (logReadError) throw logReadError;
  if (existingLog) return; // already credited today

  const { error: insertError } = await supabaseAdmin().from("ascent_log").insert({
    id: uid(),
    tracker_id: trackerId,
    entry_date: date,
    category: subcat.ascent_category,
    points: tracker.ascent_points,
  });
  if (insertError) throw insertError;
  revalidatePath("/profil");
}

// --- Entries ---

export async function addAmount(trackerId: string, date: string, amount: number, subcategoryId: string) {
  const { data: existing, error: readError } = await supabaseAdmin()
    .from("tracker_entries")
    .select("value")
    .eq("tracker_id", trackerId)
    .eq("entry_date", date)
    .maybeSingle();
  if (readError) throw readError;

  const next = Math.max(0, (existing ? Number(existing.value) : 0) + amount);
  const { error } = existing
    ? await supabaseAdmin().from("tracker_entries").update({ value: next }).eq("tracker_id", trackerId).eq("entry_date", date)
    : await supabaseAdmin().from("tracker_entries").insert({ tracker_id: trackerId, entry_date: date, value: next });
  if (error) throw error;
  await maybeAwardAscent(trackerId, date, next);
  revalidatePath(`/daily/${subcategoryId}`);
  revalidatePath("/daily");
}

export async function setAmount(trackerId: string, date: string, value: number, subcategoryId: string) {
  const clamped = Math.max(0, value);
  const { data: existing, error: readError } = await supabaseAdmin()
    .from("tracker_entries")
    .select("value")
    .eq("tracker_id", trackerId)
    .eq("entry_date", date)
    .maybeSingle();
  if (readError) throw readError;

  const { error } = existing
    ? await supabaseAdmin().from("tracker_entries").update({ value: clamped }).eq("tracker_id", trackerId).eq("entry_date", date)
    : await supabaseAdmin().from("tracker_entries").insert({ tracker_id: trackerId, entry_date: date, value: clamped });
  if (error) throw error;
  await maybeAwardAscent(trackerId, date, clamped);
  revalidatePath(`/daily/${subcategoryId}`);
  revalidatePath("/daily");
}

export async function setSubcategoryAscentCategory(subcategoryId: string, category: string) {
  const { error } = await supabaseAdmin().from("subcategories").update({ ascent_category: category }).eq("id", subcategoryId);
  if (error) throw error;
  revalidatePath(`/daily/${subcategoryId}`);
  revalidatePath(`/longterm/${subcategoryId}`);
}

// --- Notes ---

export async function addNote(): Promise<string> {
  const id = uid();
  const { error } = await supabaseAdmin().from("notes").insert({ id, title: "Untitled", content: "" });
  if (error) throw error;
  revalidatePath("/notes");
  return id;
}

export async function updateNote(id: string, patch: { title?: string; content?: string }) {
  const { error } = await supabaseAdmin()
    .from("notes")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
}

export async function deleteNote(id: string) {
  const { error } = await supabaseAdmin().from("notes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/notes");
}

// --- Events ---

export async function addEvent(date: string, title: string, time: string) {
  const { error } = await supabaseAdmin()
    .from("events")
    .insert({ id: uid(), event_date: date, title, event_time: time || null });
  if (error) throw error;
  revalidatePath("/calendar");
}

export async function deleteEvent(id: string) {
  const { error } = await supabaseAdmin().from("events").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/calendar");
}
