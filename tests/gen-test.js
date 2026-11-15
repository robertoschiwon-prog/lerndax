// Schnelltest ohne Browser für die MaDax-Generatoren.
//   node tests/gen-test.js                 → lädt alle Generator-Dateien aus web/mathe/index.html (in dieser Reihenfolge)
//   node tests/gen-test.js <Datei> …       → nur diese Dateien (z. B. web/mathe/generatoren/klasse5.js)
// Jeder Generator (und jede Knobel-Aufgabe) wird 3000-mal aufgerufen: keine Fehler, kein NaN/undefined, gültige Antworten.
const fs = require('fs'), path = require('path');
global.window = {};
let dateien = process.argv.slice(2);
if (!dateien.length) {
  const html = fs.readFileSync(path.join(__dirname, '../web/mathe/index.html'), 'utf8');
  dateien = [...html.matchAll(/src="(generatoren\/[^"]+)"/g)].map((m) => path.join(__dirname, '../web/mathe', m[1]));
}
for (const d of dateien) require(path.resolve(d));
const M = window.Mathelix;
let errs = 0, total = 0;
function pruefe(t, art, f) {
  const seen = new Set();
  for (let i = 0; i < 3000; i++) {
    total++;
    let task;
    try { task = f(); } catch (e) { console.log('THROW', art, t.id, e.message); errs++; break; }
    const s = JSON.stringify(task) + (task.figure || '') + task.prompt + task.solution + (task.pre || '');
    if (/NaN|undefined|Infinity|\[object/.test(s)) { console.log('BAD', art, t.id, s.slice(0, 300)); errs++; break; }
    if (task.choices) { if (!(task.correct >= 0 && task.correct < task.choices.length) || new Set(task.choices).size !== task.choices.length) { console.log('CHOICE', art, t.id, task.prompt, task.choices); errs++; break; } }
    else for (const fl of task.fields) if (!('fixed' in fl)) {
      if (fl.type === 'factors') continue;
      if (!Number.isFinite(fl.answer)) { console.log('ANS', art, t.id, fl); errs++; }
      if (fl.answer < 0) { console.log('NEG', art, t.id, task.prompt); errs++; }
    }
    if (task.check) { const vals = task.fields.map((fl) => ('fixed' in fl ? fl.fixed : fl.answer)); if (!task.check(vals).ok) { console.log('CHECK', art, t.id, task.prompt); errs++; break; } }
    seen.add(task.prompt);
  }
  return seen.size;
}
for (const lb of M.grades[5].lbs) {
  console.log(`— ${lb.nr} ${lb.title} (${lb.buch || ''})`);
  for (const t of lb.topics) {
    const n = pruefe(t, 'gen', t.gen), k = t.knobel ? pruefe(t, 'knobel', t.knobel) : 0;
    console.log('  ' + t.id.padEnd(20), (t.buch || '–').padEnd(20), 'Varianten:', n, t.knobel ? `Knobel: ${k}` : 'kein Knobel');
  }
}
console.log('Themen', M.grades[5].lbs.reduce((n, l) => n + l.topics.length, 0), 'Aufgaben', total, 'Fehler', errs);
process.exit(errs ? 1 : 0);
