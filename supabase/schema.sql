-- Mathelix – Datenbank-Schema für Supabase
-- Einmal im SQL Editor ausführen (Supabase → SQL Editor → New query → einfügen → Run).
--
-- Läuft im bestehenden Projekt „Familienkalender“ mit: Alle Tabellen beginnen mit mathelix_,
-- bestehende Tabellen werden nicht angefasst. Das Elternkonto ist dasselbe Supabase-Login.
--
-- Datensparsam: Elternkonto (E-Mail), Kind-Profile nur mit Vor- oder Spitzname,
-- Lernstand als JSON. Jede Familie sieht ausschließlich ihre eigenen Daten (Row Level Security).

create table if not exists public.mathelix_profiles (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 30),
  grade       int  not null default 5 check (grade between 1 and 13),
  created_at  timestamptz not null default now()
);

create table if not exists public.mathelix_progress (
  profile_id  uuid primary key references public.mathelix_profiles(id) on delete cascade,
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  state       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.mathelix_family_settings (
  owner       uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  pin_hash    text,
  updated_at  timestamptz not null default now()
);

alter table public.mathelix_profiles        enable row level security;
alter table public.mathelix_progress        enable row level security;
alter table public.mathelix_family_settings enable row level security;

drop policy if exists "mathelix eigene Profile" on public.mathelix_profiles;
create policy "mathelix eigene Profile" on public.mathelix_profiles
  for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "mathelix eigener Lernstand" on public.mathelix_progress;
create policy "mathelix eigener Lernstand" on public.mathelix_progress
  for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and exists (select 1 from public.mathelix_profiles p where p.id = profile_id and p.owner = auth.uid()));

drop policy if exists "mathelix eigene Einstellungen" on public.mathelix_family_settings;
create policy "mathelix eigene Einstellungen" on public.mathelix_family_settings
  for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

create index if not exists mathelix_profiles_owner_idx on public.mathelix_profiles(owner);

-- Zugriffsrechte: nur angemeldete Konten (die Zeilenregeln oben begrenzen auf die eigenen Daten).
-- Nicht angemeldete Besucher (anon) bekommen bewusst keinen Zugriff.
grant select, insert, update, delete on public.mathelix_profiles        to authenticated;
grant select, insert, update, delete on public.mathelix_progress        to authenticated;
grant select, insert, update, delete on public.mathelix_family_settings to authenticated;
