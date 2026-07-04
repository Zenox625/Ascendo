-- Ascendo database schema.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
--
-- Security model: every table has Row Level Security enabled with NO
-- policies defined. That means the public/anon key can't read or write
-- anything, ever. Only the service_role key (used server-side only, in
-- Next.js Route Handlers / Server Components) can touch this data. The app
-- never sends any Supabase key to the browser.

create table if not exists profile (
  id int primary key default 1,
  name text not null default 'Adam',
  avatar text,
  language text not null default 'en',
  theme text not null default '#0D0E11',
  constraint profile_singleton check (id = 1)
);

create table if not exists spotify_connection (
  id int primary key default 1,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text,
  updated_at timestamptz not null default now(),
  constraint spotify_connection_singleton check (id = 1)
);

create table if not exists subcategories (
  id text primary key,
  name text not null,
  icon text not null default 'target',
  color text not null default '#5B8DEF',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists trackers (
  id text primary key,
  subcategory_id text not null references subcategories(id) on delete cascade,
  name text not null,
  unit text not null default '',
  daily_goal numeric not null default 1,
  long_term_goal numeric,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists tracker_entries (
  tracker_id text not null references trackers(id) on delete cascade,
  entry_date date not null,
  value numeric not null default 0,
  primary key (tracker_id, entry_date)
);

create table if not exists notes (
  id text primary key,
  title text not null default 'Untitled',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  event_date date not null,
  title text not null,
  event_time text,
  created_at timestamptz not null default now()
);

alter table profile enable row level security;
alter table spotify_connection enable row level security;
alter table subcategories enable row level security;
alter table trackers enable row level security;
alter table tracker_entries enable row level security;
alter table notes enable row level security;
alter table events enable row level security;

insert into profile (id, name) values (1, 'Adam')
  on conflict (id) do nothing;
