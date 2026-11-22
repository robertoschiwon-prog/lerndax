import asyncio, pathlib, sys, json
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent; pathlib.Path('/tmp/lerndax-eing').mkdir(exist_ok=True)
PICK="""() => { const A = window.LERNDAX_FACH.app; const out = [];
  const plain = (h) => String(h==null?'':h).replace(/<sup>(\\d+)<\\/sup>/g,'^$1').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\\s+/g,' ').trim();
  const gens = [];
  for (const g in A.grades) for (const lb of A.grades[g].lbs) for (const t of lb.topics) { gens.push([t.id, t.gen, 'ueben']); if (t.knobel) gens.push([t.id, t.knobel, 'knobel']); }
  const K = A.knobel || A.knobeln || {}; for (const id in K) { const k = K[id]; if (typeof k === 'function') gens.push([id, k, 'knobel']); else if (k && typeof k.gen === 'function') gens.push([id, k.gen, 'knobel']); else if (Array.isArray(k)) k.forEach((f) => typeof f === 'function' && gens.push([id, f, 'knobel'])); }
  for (const [id, gen, wo] of gens) { const seen = {};
    for (let i = 0; i < 400; i++) { let a; try { a = gen(); } catch (e) { continue; } if (!a) continue;
      const kind = a.fields ? 'fields' : a.choices ? 'choices' : a.order ? 'order' : a.tap ? 'tap' : 'other';
      const sk = wo + kind + '|' + plain(a.prompt).replace(/[\\d.,]+/g,'#').slice(0, 40) + '|' + (a.fields ? a.fields.map(f => ('fixed' in f ? 'F' : (f.type||'num')) + (f.ci?'i':'')).join('') : '') + (a.check ? 'C' : '');
      const m = seen[sk] = seen[sk] || { n: 0, ex: [] }; m.n++; if (m.ex.length >= 3) continue;
      const o = { topic: id, wo, kind, prompt: plain(a.prompt).slice(0, 220), layout: a.layout || '', sol: plain(a.solution).slice(0, 200), answerText: plain(a.answerText || '') };
      if (a.fields) o.fields = a.fields.map(f => ({ fixed: 'fixed' in f ? String(f.fixed) : undefined, type: f.type || 'num', answer: f.answer, ci: !!f.ci, prefix: plain(f.prefix||''), suffix: plain(f.suffix||''), ph: f.placeholder || '', vor: f.vor, nach: f.nach, tol: f.tol }));
      if (a.check) o.check = a.check.toString().slice(0, 600);
      if (a.order) o.order = { words: a.order.words, answer: a.order.answer };
      if (a.choices) { o.choices = a.choices.map(plain); o.correct = a.correct; }
      if (a.tap) o.tap = { tokens: a.tap.tokens, correct: a.tap.correct, gaps: !!a.tap.gaps };
      m.ex.push(o); }
    for (const sk in seen) out.push({ sk, n: seen[sk].n, ex: seen[sk].ex }); }
  return { out, keys: Object.keys(A).join(',') }; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], executable_path='/usr/bin/google-chrome')
        for FACH in ['mathe','deutsch','englisch','geografie','geschichte','bio','technik']:
            pg = await b.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto((ROOT/'web').as_uri()+f'/{FACH}/index.html'); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')")
            if await pg.query_selector('#nameI'): await pg.fill('#nameI','Max'); await pg.click('#nameF button')
            await pg.wait_for_timeout(300)
            r = await pg.evaluate(PICK)
            json.dump(r['out'], open(f'/tmp/lerndax-eing/{FACH}.json','w'), ensure_ascii=False)
            kinds={}
            for g in r['out']:
                e=g['ex'][0]; k=e['kind']+('+check' if e.get('check') else '')+(':'+','.join(sorted(set(f['type']+('i' if f['ci'] else '') for f in e['fields'] if f['fixed'] is None))) if e.get('fields') else '')
                kinds[k]=kinds.get(k,0)+1
            print(FACH, len(r['out']), kinds, errs[:2], r['keys'][:300] if FACH=='mathe' else '')
            await pg.close()
        await b.close()
asyncio.run(main())
