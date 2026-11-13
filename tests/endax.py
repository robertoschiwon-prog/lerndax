"""EnDax (Englisch): jedes Thema in der App durchspielen (nach dem Vorbild tests/dedax.py).
Prüft: jede richtige Antwort wird angenommen (Auswahl, Wort eintippen, Satz mit Lücken, Wörter antippen),
eine falsche Antwort führt über den Tipp zur Lösung, die Lösungs-Animation läuft zu Ende und nennt die Antwort,
kein Text der Animation ragt aus dem Bild. Zusätzlich: Getippt wird mit dem geraden Apostroph (') statt (’),
zu jedem Lautsprecher-Knopf gibt es die Aufnahme in beiden Aussprachen (in den Sammeldateien), der Umschalter „Aussprache“ wirkt,
und ein Knopf wird angetippt. Aufruf: python3 tests/endax.py [Runden je Thema]"""
import pathlib, os, sys, asyncio
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
URL = (ROOT / 'web').as_uri() + '/englisch/index.html'
RUNDEN = int(sys.argv[1]) if len(sys.argv) > 1 else 12
AUDIO = ROOT / 'web' / 'englisch' / 'audio'
ORDNER = ['us', 'gb']   # amerikanisch, britisch
import json
CLIPS = {o: json.loads((AUDIO / o / 'index.json').read_text(encoding='utf-8'))['clips'] for o in ORDNER}
SAY = "() => [...document.querySelectorAll('[data-say]')].map(b => b.dataset.say)"
TASK = """() => { const t = window.__lerndax.round().cur.task;
  return { choice: t.choices ? t.correct : null, tap: t.tap ? t.tap.correct : null, ntok: t.tap ? t.tap.tokens.length : 0,
    order: t.order ? { words: t.order.words, richtig: [].concat(t.order.answer)[0] } : null,
    vals: t.fields ? t.fields.map(f => 'fixed' in f ? null : [].concat(f.answer)[0]) : null, answer: (t.answerText || ''), fields: t.fields ? t.fields.map(f => [].concat(f.answer)[0]) : [] }; }"""
FAST = "() => { const o = requestAnimationFrame; let t = performance.now(); window.requestAnimationFrame = (f) => o(() => { t += 240; f(t); }); }"
OUT = """() => { const svg = document.querySelector('.exstage svg'); if (!svg) return []; const r = svg.getBoundingClientRect(); const bad = [];
  svg.querySelectorAll('text').forEach(e => { const b = e.getBoundingClientRect(); if (b.width && e.textContent.trim() && e.getAttribute('opacity') !== '0' && (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1)) bad.push(e.textContent); }); return bad; }"""

async def answer(pg, a, wrong=False):
    if a['choice'] is not None:
        n = await pg.eval_on_selector_all('[data-choice]', 'e=>e.length')
        await pg.click(f'[data-choice="{(a["choice"] + (wrong or 0)) % n}"]:not([disabled])')
    elif a['tap'] is not None:
        for b in await pg.query_selector_all('[data-tok].sel'): await b.click()
        want = [i for i in range(a['ntok']) if i not in a['tap']][:1] if wrong else a['tap']
        for i in want: await pg.click(f'[data-tok="{i}"]')
        await pg.click('#checkB')
    elif a.get('order') is not None:
        # Wörter in Reihenfolge antippen: erst alles zurücklegen, dann der Reihe nach (falsch = verkehrt herum)
        for b in await pg.query_selector_all('#ordZiel [data-ord]'): await b.click()
        words = a['order']['words']; rest = a['order']['richtig']; folge = []; frei = list(range(len(words)))
        while rest:
            i = max((k for k in frei if rest.startswith(words[k]) and (len(rest) == len(words[k]) or rest[len(words[k])] == ' ')), key=lambda k: len(words[k]))
            folge.append(i); frei.remove(i); rest = rest[len(words[i]):].lstrip()
        for i in (folge[::-1] if wrong else folge): await pg.click(f'#ordPool [data-ord="{i}"]')
        await pg.click('#checkB')
    else:
        inputs = await pg.query_selector_all('.answer input')
        vals = [v for v in a['vals'] if v is not None]
        for el, v in zip(inputs, vals): await el.fill('xx' if wrong else str(v).replace('’', "'"))
        await pg.click('#checkB')

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])   # Sammeldateien laden ohne Server
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(FAST.join(['(', ')()']))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')")
        await pg.fill('#nameI', 'Max'); await pg.click('#nameF button')
        # Umschalter „Aussprache“: britisch wählen, danach müssen die Aufnahmen aus k5-gb kommen
        mp3 = []; pg.on('request', lambda r: mp3.append(r.url) if '/audio/' in r.url else None)
        await pg.wait_for_selector('.akzent'); await pg.click('[data-akzent="gb"]')
        gewaehlt = await pg.evaluate("() => [localStorage.getItem('lerndax.englisch.akzent'), document.querySelector('.akzent button.on').dataset.akzent]")
        print('Aussprache gewählt:', gewaehlt)
        await pg.screenshot(path=str(SHOTS / 'endax-start.png'))
        ids = await pg.eval_on_selector_all('[data-topic]', 'els=>[...new Set(els.map(e=>e.dataset.topic))]')
        bad = 0; n = 0; anim = 0; meld = []; gehoert = set(); gespielt = 0
        for t in ids:
            for rnd in range(RUNDEN):
                await pg.evaluate("() => document.querySelectorAll('[data-lbopen]').forEach(b => b.click())")   # fertige Lernbereiche sind eingeklappt
                try: await pg.click(f'.topic[data-topic="{t}"]', timeout=5000)
                except Exception: await pg.screenshot(path=str(SHOTS / 'endax-fehler.png')); print('Runde', rnd, (await pg.inner_text('body'))[:300]); raise
                for k in range(8):
                    a = await pg.evaluate(TASK)
                    falsch = rnd % 2 == 1 and k % 2 == 0   # in jeder zweiten Runde jede zweite Aufgabe erst falsch
                    if falsch:
                        await answer(pg, a, wrong=True)
                        if await pg.query_selector('.fb.mid'): await answer(pg, a, wrong=2)   # zweiter Versuch auch falsch
                        if not await pg.query_selector('.fb.no'): meld.append(f'{t}: falsche Antwort nicht als falsch erkannt: {a}')
                        btn = await pg.query_selector('.exinline')
                        if btn:
                            await btn.click(); anim += 1
                            await pg.wait_for_function("() => { const b = document.getElementById('exPlay'); return b && /Nochmal/.test(b.textContent); }", timeout=60000)
                            sub = await pg.inner_text('.exsub'); cap = await pg.inner_text('.excap')
                            if 'Lösung zu deiner Aufgabe' not in sub: meld.append(f'{t}: Untertitel fehlt')
                            for w in (a['fields'] or []):
                                if w and str(w) not in cap: meld.append(f'{t}: Antwort „{w}“ fehlt im Text der Animation: {cap}')
                            for x in await pg.evaluate(OUT): meld.append(f'{t}: Text ragt aus dem Bild: {x}')
                            for w in (a['answer'].replace(' … ', ', ').split(', ') if a['tap'] is not None else []):
                                if w and str(w) not in cap: meld.append(f'{t}: Antwort „{w}“ fehlt im Text der Animation: {cap}')
                            if rnd == 1 and k == 0: await pg.screenshot(path=str(SHOTS / f'endax-anim-{t}.png'))
                            await pg.click('[data-exclose]')
                        else: meld.append(f'{t}: keine Lösungs-Animation')
                    else:
                        if rnd == 0: await pg.screenshot(path=str(SHOTS / f'endax-{t}-{k}.png'))
                        await answer(pg, a)
                        n += 1
                        if not await pg.query_selector('.fb.ok'): bad += 1; meld.append(f'{t}: richtige Antwort nicht angenommen: {a}')
                    for name in await pg.evaluate(SAY):
                        gehoert.add(name)
                        for o in ORDNER:
                            if name not in CLIPS[o]: meld.append(f'{t}: Aufnahme fehlt: {o}/{name}')
                    sb = await pg.query_selector('.fb .say')
                    if sb and k == 1:
                        await sb.click(); await pg.wait_for_timeout(250); gespielt += 1
                        if await pg.query_selector('.say.err'): meld.append(f'{t}: Aufnahme ließ sich nicht abspielen')
                    await pg.click('#nextB')
                await pg.click('[data-go="home"]')
        # freie Erklärung
        for t in ids:
            eb = await pg.query_selector(f'[data-explain="{t}"]')
            if not eb: meld.append(f'{t}: kein Erklär-Knopf'); continue
            await eb.click()
            await pg.wait_for_function("() => { const b = document.getElementById('exPlay'); return b && /Nochmal/.test(b.textContent); }", timeout=120000)
            for x in await pg.evaluate(OUT): meld.append(f'{t}: Text ragt aus dem Bild (frei): {x}')
            await pg.screenshot(path=str(SHOTS / f'endax-frei-{t}.png'))
            await pg.click('[data-exclose]')
        # Entdecken: jede Entdeckung läuft bis zum Ende, kein Text ragt aus dem Bild
        await pg.evaluate("() => document.querySelectorAll('[data-lbopen]').forEach(b => b.click())")
        discs = await pg.eval_on_selector_all('.disc[data-explain]', 'els=>els.map(e=>e.dataset.explain)')
        for d in discs:
            await pg.click(f'.disc[data-explain="{d}"]')
            await pg.wait_for_function("() => { const b = document.getElementById('exPlay'); return b && /Nochmal/.test(b.textContent); }", timeout=180000)
            for x in await pg.evaluate(OUT): meld.append(f'Entdecken {d}: Text ragt aus dem Bild: {x}')
            await pg.wait_for_timeout(2600)   # der Begrüßungs-Dachs blendet nach echter Zeit aus
            await pg.screenshot(path=str(SHOTS / f'endax-entdecken-{d}.png'))
            await pg.click('[data-exclose]')
        print('Entdeckungen:', discs)
        await pg.click('[data-go="parents"]'); await pg.screenshot(path=str(SHOTS / 'endax-eltern.png'), full_page=True)
        if gewaehlt != ['gb', 'gb']: meld.append(f'Umschalter Aussprache: {gewaehlt}')
        if not mp3 or not all('/audio/gb/' in u for u in mp3): meld.append(f'Aufnahmen nicht aus audio/gb: {mp3[:3]}')
        print(gespielt, 'Lautsprecher angetippt,', len(mp3), 'Sammeldateien geladen, alle britisch:', bool(mp3) and all('/audio/gb/' in u for u in mp3))
        print(len(gehoert), 'verschiedene Aufnahmen kamen vor,', [len(CLIPS[o]) for o in ORDNER], 'Aufnahmen in den Sammeldateien (amerikanisch, britisch)')
        print(f'{len(ids)} Themen, {n} richtige Antworten geprüft, {bad} nicht angenommen, {anim} Lösungs-Animationen')
        for m in meld[:30]: print(' -', m)
        for e in errs[:10]: print(' ! Seitenfehler:', e)
        await b.close()
        sys.exit(1 if (bad or meld or errs) else 0)
if __name__ == '__main__': asyncio.run(main())
