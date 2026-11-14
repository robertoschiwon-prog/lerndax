/* Schnelltest ohne Browser für Wissensfächer (GeDax, BioDax, GeoDax):
 * lädt die Skripte eines Fachs wie index.html, ruft jeden Generator und jede Knobel-Aufgabe vielfach auf und prüft:
 * kein Fehler, kein undefined/NaN im Text, genau eine richtige Auswahl, Reihenfolgen und Lücken gültig, Bilder vorhanden.
 * Aufruf: node tests/wissen_gen.js web/bio [Durchläufe je Thema]
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.resolve(process.argv[2] || 'web/bio'), N = +process.argv[3] || 300;
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((s) => !/plattform\/(fach|sync|config|avatare|trainings)\.js/.test(s));
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const el = () => ({ setAttribute() {}, appendChild() {}, style: {}, getBBox: () => ({ width: 0 }) });
const ctx = { console, Math, Date, JSON, Object, Array, String, Number, Promise, setTimeout, document: { createElementNS: el, createElement: el, querySelector: () => null, addEventListener() {}, querySelectorAll: () => [] }, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
for (const s of srcs) vm.runInContext(fs.readFileSync(path.join(dir, s), 'utf8'), ctx, { filename: s });
for (const s of inline) vm.runInContext(s, ctx);
const F = ctx.LERNDAX_FACH, D = F.app;
const themen = Object.values(D.grades).flatMap((g) => g.lbs.flatMap((l) => l.topics));
let n = 0, fehler = [];
const pruefe = (id, t, knobel) => {
  const txt = JSON.stringify([t.prompt, t.choices, t.solution, t.hint, t.fields, t.order]);
  if (/undefined|NaN|\[object/.test(txt)) fehler.push(`${id}: undefined/NaN: ${txt.slice(0, 200)}`);
  if (!t.prompt) fehler.push(`${id}: keine Frage`);
  if (t.choices) {
    if (!(t.correct >= 0 && t.correct < t.choices.length)) fehler.push(`${id}: correct ungültig ${t.correct} ${t.prompt}`);
    if (new Set(t.choices.map(String)).size !== t.choices.length) fehler.push(`${id}: doppelte Antwort: ${t.choices.join(' | ')}`);
    if (t.choices.length < 2) fehler.push(`${id}: zu wenige Antworten`);
  } else if (t.order) {
    if (t.order.words.join(' ') === t.order.answer && t.order.words.length > 1) fehler.push(`${id}: Reihenfolge schon richtig`);
  } else if (t.fields) {
    t.fields.forEach((f) => { if (f.answer === undefined || f.answer === '' || (Array.isArray(f.answer) && !f.answer.length)) fehler.push(`${id}: Feld ohne Antwort`); });
  } else fehler.push(`${id}: keine Antwortform`);
  if (t.figure !== undefined && !/^<svg/.test(t.figure)) fehler.push(`${id}: Bild fehlt`);
  if (!knobel && t.ex && t.ex.svg && !(D.bilder && D.bilder[t.ex.svg])) fehler.push(`${id}: Bild ${t.ex.svg} unbekannt`);
  if (!knobel && !t.ex) fehler.push(`${id}: keine Erklärung (ex)`);
  if (!knobel && t.ex && D.bild && !D.bild[t.ex.mode]) fehler.push(`${id}: Erklär-Art ${t.ex.mode} fehlt`);
  n++;
};
for (const th of themen) {
  for (let i = 0; i < N; i++) {
    try { pruefe(th.id, th.gen(), false); } catch (e) { fehler.push(`${th.id}: Fehler ${e.stack.split('\n').slice(0, 2).join(' ')}`); break; }
  }
  if (th.knobel) for (let i = 0; i < Math.max(30, N / 5); i++) {
    try { pruefe(th.id + ' (Knobeln)', th.knobel(), true); } catch (e) { fehler.push(`${th.id} Knobeln: Fehler ${e.message}`); break; }
  }
}
if (D.explainers) themen.forEach((t) => { if (!D.explainers[t.id]) fehler.push(`${t.id}: keine Erklärung angemeldet`); });
(F.entdecken || []).forEach((id) => { if (!D.explainers[id]) fehler.push(`Entdecken ${id} fehlt`); });
const ohneKnobel = themen.filter((t) => !t.knobel).map((t) => t.id);
console.log(`${F.name}: ${themen.length} Themen, ${n} Aufgaben geprüft, ${fehler.length} Fehler${ohneKnobel.length ? `, ohne Knobeln: ${ohneKnobel.join(', ')}` : ''}`);
[...new Set(fehler)].slice(0, 40).forEach((f) => console.log(' -', f));
process.exit(fehler.length ? 1 : 0);
