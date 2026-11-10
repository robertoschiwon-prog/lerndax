-- Einmalige Umstellung Mathelix → LernDax (10.11.2026)
-- Entfernt die drei leeren Tabellen aus der ersten Mathelix-Version.
-- Ersetzt durch die lerndax_-Tabellen aus schema.sql.
drop table if exists public.mathelix_progress;
drop table if exists public.mathelix_family_settings;
drop table if exists public.mathelix_profiles;
