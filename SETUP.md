# Mathelix einrichten: eigene Adresse + Synchronisation

Danach läuft Mathelix unter einer eigenen Adresse (z. B. `https://dein-name.github.io/mathelix/`),
lässt sich wie eine App aufs Handy legen, funktioniert offline und gleicht den Lernstand
zwischen allen Geräten ab.

Kosten: 0 €. GitHub ist kostenlos, und die Datenbank läuft im bestehenden Supabase-Projekt des Familienkalenders mit.

---

## Teil 1 – GitHub (Webadresse)

1. Auf **github.com/signup** ein kostenloses Konto anlegen.
   Der Benutzername steht später in der Adresse (`benutzername.github.io/mathelix`).
2. Oben rechts **+ → New repository**
   - Repository name: `mathelix`
   - **Public** auswählen (kostenlose Webseiten gehen nur mit öffentlichen Repositories –
     es landet nur der App-Code darin, keine Daten deines Kindes)
   - Sonst nichts ankreuzen → **Create repository**
3. Claude den **Benutzernamen** mitteilen. Claude lädt den Code hoch.

## Teil 2 – Supabase (im bestehenden Projekt „Familienkalender“)

Mathelix bekommt kein eigenes Supabase-Projekt, sondern zieht mit in das private
Familienkalender-Projekt. Alle Mathelix-Tabellen beginnen mit `mathelix_`, die Tabellen des
Kalenders werden nicht angefasst.

1. Auf **supabase.com** anmelden und das Projekt **Familienkalender** öffnen.
2. Links **SQL Editor** → **New query** → den kompletten Inhalt von
   `supabase/schema.sql` einfügen → **Run**. Es sollte „Success“ erscheinen.
   Danach gibt es unter **Table Editor** drei neue Tabellen: `mathelix_profiles`,
   `mathelix_progress`, `mathelix_family_settings`.
3. Links **Project Settings** (Zahnrad) → **API Keys** bzw. **Data API**. Zwei Werte an Claude geben:
   - **Project URL** (sieht aus wie `https://abcdefgh.supabase.co`)
   - **Publishable key** (beginnt mit `sb_publishable_…`) – oder bei älteren Projekten
     der **anon public** Key
   - ⚠️ Niemals den **secret** / **service_role** Key weitergeben oder eintragen.

   Der Publishable Key ist für den Browser gedacht und darf öffentlich sein:
   Die Regeln in der Datenbank (Row Level Security) sorgen dafür, dass jede Familie
   nur ihre eigenen Daten sieht.

**Login:** Mathelix nutzt dieselben Konten wie der Familienkalender. Hast du dort schon ein
Konto, meldest du dich in Mathelix einfach mit denselben Zugangsdaten an.

## Teil 3 – Abschluss (macht Claude, du klickst nur kurz)

- Claude trägt URL und Key in `app/config.js` ein und lädt alles zu GitHub hoch.
- Auf GitHub: **Settings → Pages → Source: GitHub Actions**.
- In Supabase: **Authentication → URL Configuration → Redirect URLs → Add URL** und die neue
  Mathelix-Adresse eintragen (z. B. `https://benutzername.github.io/mathelix/**`).
  ⚠️ Die **Site URL** dort **nicht ändern**, die gehört dem Familienkalender.

---

## So benutzt ihr es

**Einmalig auf jedem Gerät** (Handy deines Sohnes, dein Handy, Computer):

1. Adresse öffnen → unten **„Für Eltern: Fortschritt ansehen“**
2. Beim ersten Mal **„Neues Konto anlegen“** (deine E-Mail + Passwort), E-Mail bestätigen,
   danach **„Anmelden“**.
3. **Profil anlegen** (Vorname oder Spitzname deines Kindes) bzw. auf weiteren Geräten
   das vorhandene Profil antippen.
4. Empfohlen: **Eltern-PIN festlegen**. Dann kann sich dein Kind nicht selbst abmelden,
   das Profil wechseln oder den Fortschritt löschen.

**Als App aufs Handy legen**
- iPhone (Safari): Teilen-Symbol → **Zum Home-Bildschirm**
- Android (Chrome): Menü ⋮ → **App installieren** bzw. **Zum Startbildschirm hinzufügen**

**Gut zu wissen**
- Mathelix funktioniert auch ohne Internet. Der Abgleich passiert automatisch, sobald
  wieder eine Verbindung da ist.
- Kostenlose Supabase-Projekte werden nach etwa einer Woche **ohne jede Nutzung** pausiert.
  Da Kalender und Mathelix dasselbe Projekt nutzen, halten sie sich gegenseitig wach. Falls doch: im Supabase-Dashboard auf
  **Restore project** klicken.
- Neue Version veröffentlichen: In `app/sw.js` die `VERSION` erhöhen, dann holen sich
  alle Geräte die neuen Dateien.
