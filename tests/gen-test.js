global.window = {};
require(process.argv[2]);
const M = window.Mathelix;
let errs = 0, total = 0;
for (const lb of M.grades[5].lbs) for (const t of lb.topics) {
  const seen = new Set();
  for (let i = 0; i < 3000; i++) {
    total++;
    let task;
    try { task = t.gen(); } catch (e) { console.log('THROW', t.id, e.message); errs++; break; }
    const s = JSON.stringify(task) + (task.figure||'') + task.prompt + task.solution + (task.pre||'');
    if (/NaN|undefined|Infinity/.test(s)) { console.log('BAD', t.id, s.slice(0,300)); errs++; break; }
    if (task.choices) { if (!(task.correct >= 0 && task.correct < task.choices.length)) { console.log('CHOICE', t.id); errs++; } }
    else for (const f of task.fields) if (!('fixed' in f)) {
      if (f.type === 'factors') continue;
      if (!Number.isFinite(f.answer)) { console.log('ANS', t.id, f); errs++; }
      if (f.answer < 0) { console.log('NEG', t.id, task.prompt); errs++; }
    }
    // default check sanity: custom check must accept true answer
    if (task.check) { const vals = task.fields.map(f => 'fixed' in f ? f.fixed : f.answer); if (!task.check(vals).ok) { console.log('CHECK', t.id, task.prompt); errs++; } }
    seen.add(task.prompt);
  }
  console.log(t.id.padEnd(16), 'varianten:', seen.size);
}
console.log('total', total, 'errors', errs);
