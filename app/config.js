/* Mathelix – Einstellungen
 * Nach dem Anlegen des Supabase-Projekts hier eintragen:
 *   supabaseUrl: Project URL           (Supabase → Project Settings → API / Data API)
 *   supabaseKey: Publishable key bzw. anon public key (ist für den Browser gedacht, nicht geheim)
 * Leer gelassen läuft Mathelix ohne Synchronisation (Lernstand nur auf dem Gerät).
 */
window.MATHELIX_CONFIG = window.MATHELIX_CONFIG || {
  supabaseUrl: 'https://bpwdmdcnvdolpsxdvblq.supabase.co',
  supabaseKey: 'sb_publishable_pwD5jJ67kgeS3p6pnI-pJQ_SCTAjrtH',
  tablePrefix: 'mathelix_', // Tabellen im gemeinsamen Projekt (Familienkalender)
  allowSignup: false,       // Registrierung ist im Familienkalender abgeschaltet: Anmeldung mit bestehendem Konto
  accountName: 'Familienkalender-Konto',
};
