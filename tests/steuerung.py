"""Spielhalle: Steuerpult wie beim Gameboy (seit v116) – Steuerkreuz, A, B, Start/Pause, Halten wiederholt, Größe auf dem Handy."""
import pathlib, os, asyncio
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
WEB = (ROOT / 'web').as_uri()
fehler = []
def check(ok, was):
    print(('OK   ' if ok else 'FAIL ') + was)
    if not ok: fehler.append(was)

async def mitte(pg, sel, fx=0.5, fy=0.5):
    r = await (await pg.query_selector(sel)).bounding_box()
    return r['x'] + r['width'] * fx, r['y'] + r['height'] * fy

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 760}, device_scale_factor=2); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(WEB + '/belohnung/index.html')
        await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1'); LernDaxBelohnung.verdienen(200); LernDaxBelohnung.rundeFertig(); LernDaxBelohnung.zeitKaufen()")
        await pg.goto(WEB + '/belohnung/index.html#spiel-stapeln'); await pg.wait_for_timeout(500)
        Z = "window.__belohnung.spiel._zustand()"
        check(len(await pg.query_selector_all('.kreuz i[data-r]')) == 4 and await pg.query_selector('.knopf.a') and await pg.query_selector('.knopf.b') and await pg.query_selector('#startK'), 'Pult: Steuerkreuz, A, B, Start')
        hilfe = await pg.inner_text('.hilfe')
        check('A: drehen' in hilfe and '◀▶: schieben' in hilfe and 'Start: Pause' in hilfe, f'Kurzanleitung aus der Belegung ({hilfe!r})')
        # Halten wiederholt: links gedrückt halten schiebt mehrere Felder
        z0 = await pg.evaluate(Z)
        x, y = await mitte(pg, '#kreuz', 0.15, 0.5); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(450)
        z1 = await pg.evaluate(Z)
        check(z0['x'] - z1['x'] >= 3 or z1['x'] == 0, f'Halten wiederholt (x {z0["x"]} → {z1["x"]})')
        check(await pg.query_selector('.kreuz i.k-l.an') is not None, 'Gedrückter Arm leuchtet')
        # Daumen rollen: ohne Loslassen nach rechts
        x2, y2 = await mitte(pg, '#kreuz', 0.88, 0.5); await pg.mouse.move(x2, y2, steps=4); await pg.wait_for_timeout(450)
        z2 = await pg.evaluate(Z); await pg.mouse.up()
        check(z2['x'] > z1['x'], f'Daumen rollen wechselt die Richtung (x {z1["x"]} → {z2["x"]})')
        check(await pg.query_selector('.kreuz i.an') is None, 'Loslassen: kein Arm mehr gedrückt')
        # A dreht, B dreht zurück
        f0 = (await pg.evaluate(Z))['f']
        x, y = await mitte(pg, '.knopf.a'); await pg.mouse.click(x, y); fa = (await pg.evaluate(Z))['f']
        x, y = await mitte(pg, '.knopf.b'); await pg.mouse.click(x, y); fb = (await pg.evaluate(Z))['f']
        check(fb == f0, 'A dreht, B dreht zurück' + ('' if fa != f0 else ' (Würfel-Form, Drehung unsichtbar)'))
        # Start = Pause: nichts fällt, Zeit steht
        x, y = await mitte(pg, '#startK'); await pg.mouse.click(x, y); await pg.wait_for_timeout(100)
        za = await pg.evaluate(Z); g0 = await pg.evaluate("LernDaxBelohnung.gespieltHeute()"); await pg.wait_for_timeout(2300)
        zb = await pg.evaluate(Z); g1 = await pg.evaluate("LernDaxBelohnung.gespieltHeute()")
        check('Pause' in await pg.inner_text('#buehne') and za == zb and g0 == g1, 'Start: Pause hält Spiel und Spielzeit an')
        await pg.screenshot(path=f'{SHOTS}/gb_pause.png')
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(100)
        check('Pause' not in await pg.inner_text('#buehne'), 'Enter macht weiter')
        # Pfeil oben hat keine Aufgabe mehr (kein Fallenlassen, v119), ▲ ist blass
        vor = await pg.evaluate(Z)
        await pg.keyboard.press('ArrowUp'); await pg.wait_for_timeout(50)
        nach = await pg.evaluate(Z)
        check(nach['y'] == vor['y'] and nach['n'] == vor['n'], '▲ lässt den Block nicht mehr fallen')
        check(await pg.query_selector('.kreuz i[data-r="hoch"].aus') is not None, '▲ ist blass (ohne Aufgabe)')
        check("'fallen'" not in open(ROOT / 'web/belohnung/spiele.js').read(), 'Kein Fallenlassen mehr im Blöcke-Spiel')
        # ▼ bis der Stein liegt: der angekündigte Stein kommt als nächster
        vor = await pg.evaluate(Z)
        for _ in range(30):
            await pg.keyboard.press('ArrowDown'); await pg.wait_for_timeout(15)
            if (await pg.evaluate(Z))['naechster'] != vor['naechster'] or (await pg.evaluate(Z))['y'] < vor['y']: break
        check((await pg.evaluate(Z))['n'] == vor['naechster'], 'Vorschau: der angekündigte Stein kommt als nächster')
        check('globalAlpha' not in open(ROOT / 'web/belohnung/spiele.js').read(), 'Kein durchscheinender Zielschatten')
        await pg.screenshot(path=f'{SHOTS}/gb_stapeln_390.png')
        # Andere Spiele: richtige Belegung, Tasten ohne Funktion sind blass
        for sp, aktiv in [('sprung', ['hoch', 'a']), ('schlange', ['hoch', 'runter', 'links', 'rechts']), ('zahlen', ['hoch', 'runter', 'links', 'rechts'])]:
            await pg.goto(WEB + f'/belohnung/index.html#spiel-{sp}'); await pg.wait_for_timeout(400)
            an = await pg.evaluate("[...document.querySelectorAll('.kreuz i[data-r]:not(.aus)')].map(i=>i.dataset.r).concat([...document.querySelectorAll('.knopf:not(.aus)')].map(k=>k.dataset.k))")
            check(sorted(an) == sorted(aktiv), f'{sp}: Belegung {an}')
            for k in ['ArrowRight', 'ArrowUp', ' ']: await pg.keyboard.press(k); await pg.wait_for_timeout(80)
            x, y = await mitte(pg, '.knopf.a'); await pg.mouse.click(x, y)
            await pg.wait_for_timeout(500); await pg.screenshot(path=f'{SHOTS}/gb_{sp}_390.png')
        # Spiel vorbei → A startet neu (Schlange gegen die Wand)
        await pg.goto(WEB + '/belohnung/index.html#spiel-schlange'); await pg.wait_for_timeout(2600)
        check(await pg.query_selector('[data-nochmal]') is not None, 'Schlange an der Wand: Spiel vorbei')
        await pg.keyboard.press('x'); await pg.wait_for_timeout(150)
        check(await pg.query_selector('[data-nochmal]') is None, 'A (Taste X) startet neu')
        # Alles passt auf den Bildschirm, ohne zu scrollen
        for w, h in [(320, 568), (360, 640), (390, 760), (412, 840), (768, 1000)]:
            await pg.set_viewport_size({'width': w, 'height': h})
            for sp in ('sprung', 'schlange', 'stapeln', 'zahlen'):
                await pg.goto(WEB + f'/belohnung/index.html#spiel-{sp}'); await pg.wait_for_timeout(250)
                m = await pg.evaluate("({unten: document.querySelector('.gb').getBoundingClientRect().bottom, sw: document.documentElement.scrollWidth, bw: document.getElementById('buehne').offsetWidth})")
                check(m['sw'] <= w and m['unten'] <= h + 1 and m['bw'] >= 140, f'{w}×{h} {sp}: passt (Konsole bis {round(m["unten"])}, Bild {m["bw"]} px breit)')
                if sp == 'stapeln' and w in (320, 768): await pg.screenshot(path=f'{SHOTS}/gb_stapeln_{w}.png')
        check(not errs, f'keine JS-Fehler {errs[:3]}')
        await b.close()
    print('\nFEHLER:' if fehler else '\nALLES OK', fehler or '')

asyncio.run(main())
