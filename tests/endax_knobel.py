"""EnDax (Englisch): Knobel-Aufgaben in der App durchspielen.
Prüft: Knobel-Balken erst ab zwei Sternen; jede Variante jedes Themas wird als Knobel-Runde gespielt (5 Aufgaben):
richtige Antworten werden angenommen, falsche führen zur Lösung, nichts ragt über den Bildschirmrand,
Sterne-Statistik bleibt unverändert. Aufruf: python3 tests/endax_knobel.py [Runden je Variante, Standard 1]"""
import pathlib, os, sys, asyncio, json
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots' / 'endax-knobel'; SHOTS.mkdir(parents=True, exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
sys.path.insert(0, str(HERE))
from endax import TASK, answer
URL = (ROOT / 'web').as_uri() + '/englisch/index.html'
RUNDEN = int(sys.argv[1]) if len(sys.argv) > 1 else 1
LEER = "localStorage.setItem('lerndax.avatar.asked','1'); localStorage.setItem('endax.v1', JSON.stringify({name:'Max', grade:5, stats:{}, days:[], total:0, seen:{}}))"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate(LEER); await pg.goto(URL)
        meld = []
        if await pg.query_selector('[data-knobel]'): meld.append('Knobel-Balken ohne Sterne sichtbar')
        var = await pg.evaluate("() => Object.fromEntries(Object.entries(window.EnDax.knobelVarianten).map(([k, v]) => [k, v.length]))")
        alle = await pg.evaluate("() => window.EnDax.grades[5].lbs.flatMap(l => l.topics).map(t => t.id)")
        for t in alle:
            if t not in var and not t.startswith('e5-a-'): meld.append(f'{t}: keine Knobel-Aufgaben')   # Alltag (e5-a-…) bewusst ohne Knobeln
        stats = {i: {'n': 8, 'hist': [1, 1, 1, 1, 1, 1, 0.5, 0], 'last': '2026-11-01'} for i in alle}
        await pg.evaluate("s => localStorage.setItem('endax.v1', JSON.stringify({name:'Max', grade:5, stats:s, days:[], total:0, seen:{}}))", stats)
        await pg.goto(URL)
        if not await pg.query_selector('.jump.kn'): meld.append('Knobel-Balken fehlt bei zwei Sternen')
        await pg.screenshot(path=str(SHOTS / 'start.png'))
        n = 0; ok = 0
        for t, anz in var.items():
            for vi in range(anz):
                for r in range(RUNDEN):
                    await pg.goto(URL)
                    await pg.evaluate("([t, vi]) => { const top = window.EnDax.grades[5].lbs.flatMap(l => l.topics).find(x => x.id === t); top.knobel = window.EnDax.knobelVarianten[t][vi]; const b = document.createElement('button'); b.dataset.knobel = t; b.hidden = true; document.getElementById('app').appendChild(b); b.click(); }", [t, vi])
                    for k in range(5):
                        if 'Knobeln' not in await pg.inner_text('.tag'): meld.append(f'{t}#{vi}: Tag ohne Knobeln')
                        a = await pg.evaluate(TASK); n += 1
                        if k == 0 and r == 0: await pg.screenshot(path=str(SHOTS / f'{t}-{vi}.png'))
                        breit = await pg.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 1")
                        if breit: meld.append(f'{t}#{vi}: Aufgabe ragt über den Rand')
                        if k == 4:   # letzte Aufgabe erst falsch
                            await answer(pg, a, wrong=True)
                            if await pg.query_selector('.fb.mid'): await answer(pg, a, wrong=2)
                            if not await pg.query_selector('.fb.no'): meld.append(f'{t}#{vi}: falsche Antwort nicht als falsch erkannt: {a}')
                            elif k == 4 and r == 0: await pg.screenshot(path=str(SHOTS / f'{t}-{vi}-loesung.png'), full_page=True)
                            if await pg.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 1"): meld.append(f'{t}#{vi}: Lösung ragt über den Rand')
                        else:
                            await answer(pg, a)
                            if await pg.query_selector('.fb.ok'): ok += 1
                            else: meld.append(f'{t}#{vi}: richtige Antwort nicht angenommen: {a}')
                        await pg.wait_for_selector('#nextB'); await pg.click('#nextB')
                    txt = await pg.inner_text('.res')
                    if 'zählen nicht für die Sterne' not in txt: meld.append(f'{t}#{vi}: Ergebnis ohne Hinweis')
        st = await pg.evaluate("() => JSON.parse(localStorage.getItem('endax.v1'))")
        if json.dumps(st['stats'], sort_keys=True) != json.dumps(stats, sort_keys=True): meld.append('Sterne-Statistik wurde durch Knobeln verändert')
        versucht = sum(v['n'] for v in st.get('knobel', {}).values())
        if versucht != n: meld.append(f'Knobel-Zähler {versucht} statt {n}')
        print(f'{len(var)} Themen, {sum(var.values())} Varianten, {n} Knobel-Aufgaben gespielt, {ok} richtige Antworten angenommen')
        for m in sorted(set(meld))[:30]: print(' !', m)
        print('errors', errs[:5]); await b.close(); sys.exit(1 if meld or errs else 0)
if __name__ == '__main__': asyncio.run(main())
