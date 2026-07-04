-- Ascent system, core (v1: scoring + tiers, no resets/streaks/badges yet).
-- Run this in the Supabase SQL Editor. Safe to run on the existing database —
-- it only adds columns/tables, nothing existing is touched.

alter table subcategories add column if not exists ascent_category text;
alter table trackers add column if not exists ascent_points numeric not null default 10;

-- One row per (tracker, day) that already earned points — the presence of a
-- row is what prevents awarding the same day's completion twice.
create table if not exists ascent_log (
  id text primary key,
  tracker_id text not null references trackers(id) on delete cascade,
  entry_date date not null,
  category text not null,
  points numeric not null,
  created_at timestamptz not null default now(),
  unique (tracker_id, entry_date)
);

alter table ascent_log enable row level security;
