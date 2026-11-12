# Knobel-Stufe: erscheint ab zwei Sternen, 5 Aufgaben, zählt nicht für die Sterne, wird gezählt (S.knobel).
#  Aufruf: python3 tests/knobel.py [Runden, Standard 6]
import asyncio, pathlib, sys, json, os
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
URL = (ROOT/'web').as_uri()+'/mathe/index.html'
N = int(sys.argv[1]) if len(sys.argv) > 1 else 6
ANSWER = """() => { const t = window.__mathelix.round().cur.task; const fmt = window.Mathelix.util.fmt;
  if (t.choices) return { choice: t.correct };
  return { vals: t.fields.map(f => 'fixed' in f ? null : f.type === 'factors' ? f.answer.join('·') : fmt(f.answer).replace(/\\s/g, '')) }; }"""
async def solve(pg, richtig=True):
    a = await pg.evaluate(ANSWER)
    if 'choice' in a:
        n = await pg.evaluate("() => window.__mathelix.round().cur.task.choices.length")
        idx = a['choice'] if richtig else (a['choice'] + 1) % n
        await pg.evaluate(f"() => document.querySelector('[data-choice=\"{idx}\"]').click()")
        if not richtig and n > 3: await pg.evaluate(f"() => document.querySelector('[data-choice=\"{(a['choice'] + 2) % n}\"]').click()")
    else:
        for k in range(1 if richtig else 2):
            for i, v in enumerate(a['vals']):
                if v is not None: await pg.fill(f'#f{i}', v if richtig else '99999')
            await pg.click('#checkB'); await pg.wait_for_timeout(40)
    await pg.wait_for_selector('#nextB'); await pg.click('#nextB'); await pg.wait_for_timeout(40)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], **CHROME)
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL)
        ids = await pg.evaluate("() => window.Mathelix.knobelThemen()")
        alle = await pg.evaluate("() => window.Mathelix.grades[5].lbs.flatMap(l => l.topics).length")
        # ohne Sterne: kein Knobel-Balken
        await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1'); localStorage.setItem('mathelix.v1', JSON.stringify({name:'Max', grade:5, stats:{}, days:[], total:0, seen:{}}))")
        await pg.goto(URL); ohne = await pg.query_selector('[data-knobel]')
        # zwei Sterne in allen Knobel-Themen
        stats = {i: {'n': 8, 'hist': [1, 1, 1, 1, 1, 1, 0.5, 0], 'last': '2026-11-01'} for i in ids}
        await pg.evaluate("s => localStorage.setItem('mathelix.v1', JSON.stringify({name:'Max', grade:5, stats:s, days:[], total:0, seen:{}}))", stats)
        await pg.goto(URL); bar = await pg.query_selector('.jump.kn')
        probleme = []; gesehen = set()
        if ohne: probleme.append('Knobel-Balken ohne Sterne sichtbar')
        if not bar: probleme.append('Knobel-Balken fehlt')
        for r in range(N):
            await pg.goto(URL); await pg.click('.jump.kn')
            for i in range(5):
                tag = await pg.inner_text('.tag'); tid = await pg.evaluate("() => window.__mathelix.round().cur.topic.id"); gesehen.add(tid)
                if 'Knobeln' not in tag: probleme.append('Tag ohne Knobeln: ' + tag)
                if await pg.query_selector('[data-when="pre"]'): probleme.append('Erklär-Knopf in Knobel-Aufgabe')
                await solve(pg, richtig=(r % 3 != 2 or i % 2 == 0))
            txt = await pg.inner_text('.res')
            if 'zählen nicht für die Sterne' not in txt: probleme.append('Ergebnis ohne Hinweis: ' + txt[:80])
        st = await pg.evaluate("() => JSON.parse(localStorage.getItem('mathelix.v1'))")
        if json.dumps(st['stats'], sort_keys=True) != json.dumps(stats, sort_keys=True): probleme.append('Sterne-Statistik wurde durch Knobeln verändert')
        kn = st.get('knobel', {}); versucht = sum(v['n'] for v in kn.values())
        if versucht != N * 5: probleme.append(f'Knobel-Zähler {versucht} statt {N * 5}')
        # nach einer guten Themen-Runde: Knopf „Jetzt knobeln“
        await pg.goto(URL); await pg.click(f'[data-topic="{ids[0]}"]')
        for i in range(8): await solve(pg)
        knopf = await pg.query_selector('.res [data-knobel]')
        if not knopf: probleme.append('Knopf „Jetzt knobeln“ fehlt nach guter Runde')
        else:
            await knopf.click(); t2 = await pg.evaluate("() => window.__mathelix.round().cur.topic.id")
            if t2 != ids[0]: probleme.append('Knobel-Runde zum falschen Thema')
        await pg.goto(URL); zeichen = await pg.query_selector_all('.knz')
        print('knobel-themen', len(ids), 'von', alle, '| runden', N, '| themen gesehen', len(gesehen), '| geknackt-zeichen', len(zeichen), '| probleme', probleme, '| errors', errs)
        await b.close()
asyncio.run(main())
