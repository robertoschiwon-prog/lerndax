-- LernDax – Datenbank-Schema (Supabase, Projekt „familienkalender“)
-- Im SQL Editor ausführen. Alle Tabellen beginnen mit lerndax_, die Tabellen des Kalenders
-- bleiben unberührt. Login = dasselbe Familienkonto wie im Kalender.
--
-- Aufbau: Kind-Profile gelten für alle Fächer, der Lernstand wird je Fach gespeichert.
-- Datensparsam: Kind-Profile nur mit Vor- oder Spitzname, Lernstand als JSON.
-- Jedes Konto sieht ausschließlich seine eigenen Daten (Row Level Security).

create table if not exists public.lerndax_profiles (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 30),
  grade       int  not null default 5 check (grade between 1 and 13),
  avatar      text check (avatar ~ '^[a-z]{2,20}:[a-z]{2,20}$'),   -- z. B. fuchs:blau
  created_at  timestamptz not null default now()
);
-- Für bestehende Datenbanken (Avatar kam am 10.11.2026 dazu):
alter table public.lerndax_profiles add column if not exists avatar text check (avatar ~ '^[a-z]{2,20}:[a-z]{2,20}$');

create table if not exists public.lerndax_progress (
  profile_id  uuid not null references public.lerndax_profiles(id) on delete cascade,
  subject     text not null check (subject ~ '^[a-z]{2,20}$'),   -- z. B. mathe, deutsch, englisch
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  state       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (profile_id, subject)
);

create table if not exists public.lerndax_family_settings (
  owner       uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  pin_hash    text,
  updated_at  timestamptz not null default now()
);

alter table public.lerndax_profiles        enable row level security;
alter table public.lerndax_progress        enable row level security;
alter table public.lerndax_family_settings enable row level security;

drop policy if exists "lerndax eigene Profile" on public.lerndax_profiles;
create policy "lerndax eigene Profile" on public.lerndax_profiles
  for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "lerndax eigener Lernstand" on public.lerndax_progress;
create policy "lerndax eigener Lernstand" on public.lerndax_progress
  for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and exists (select 1 from public.lerndax_profiles p where p.id = profile_id and p.owner = auth.uid()));

drop policy if exists "lerndax eigene Einstellungen" on public.lerndax_family_settings;
create policy "lerndax eigene Einstellungen" on public.lerndax_family_settings
  for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

create index if not exists lerndax_profiles_owner_idx on public.lerndax_profiles(owner);

-- Zugriffsrechte: nur angemeldete Konten; nicht angemeldete Besucher (anon) bekommen keinen Zugriff.
grant select, insert, update, delete on public.lerndax_profiles        to authenticated;
grant select, insert, update, delete on public.lerndax_progress        to authenticated;
grant select, insert, update, delete on public.lerndax_family_settings to authenticated;
revoke all on public.lerndax_profiles        from anon;
revoke all on public.lerndax_progress        from anon;
revoke all on public.lerndax_family_settings from anon;
