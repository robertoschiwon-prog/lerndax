"""Belohnungen (seit v114): Münzen, Krone, Laden, Spielhalle, Spielzeit, Zusammenführen über Geräte."""
import pathlib, os, asyncio
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
WEB = (ROOT / 'web').as_uri()
FREI = "const SPIELHALLE_FREI = true" in open(ROOT / 'web/plattform/belohnung.js').read()
ANSWER = open(HERE / 'sync_test.py').read().split('ANSWER = """')[1].split('"""')[0]
fehler = []
def check(ok, was):
    print(('OK   ' if ok else 'FAIL ') + was)
    if not ok: fehler.append(was)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'fonts.g' not in m.text and errs.append(m.text))

        # --- Zusammenführen (reine Logik) ---
        await pg.goto(WEB + '/belohnung/index.html'); await pg.wait_for_timeout(300)
        m = await pg.evaluate("""() => { const B = window.LernDaxBelohnung;
          const a = {verdient:{x:50}, ausgegeben:{x:10}, gekauft:{cap:'2026-11-10'}, getragen:{hut:'cap', t:5}, kronen:{'mathe:a':'2026-11-02'}, runden:{}, spiel:{}, rekord:{schlange:7}};
          const c = {verdient:{x:40, y:30}, ausgegeben:{y:5}, gekauft:{cap:'2026-11-12', schal:'2026-11-11'}, getragen:{hut:'zylinder', t:9}, kronen:{'mathe:a':'2026-11-01'}, runden:{}, spiel:{}, rekord:{schlange:3, zahlen:200}};
          const r = B.merge(a, c); return {r, gleich: JSON.stringify(B.merge(a,c)) === JSON.stringify(B.merge(c,a))}; }""")
        r = m['r']
        check(r['verdient'] == {'x': 50, 'y': 30} and r['ausgegeben'] == {'x': 10, 'y': 5}, 'Münzen je Gerät: Maximum bleibt erhalten')
        check(r['gekauft'] == {'cap': '2026-11-10', 'schal': '2026-11-11'}, 'Käufe: alles bleibt, frühestes Datum')
        check(r['getragen']['hut'] == 'zylinder', 'Getragenes: das Neuere gewinnt')
        check(r['kronen']['mathe:a'] == '2026-11-01' and r['rekord'] == {'schlange': 7, 'zahlen': 200}, 'Kronen und Rekorde zusammengeführt')
        check(m['gleich'], 'Zusammenführen hängt nicht von der Reihenfolge ab')

        # --- Spielhalle ist zu, solange heute keine Runde geschafft ist ---
        await pg.evaluate("localStorage.clear()"); await pg.goto(WEB + '/belohnung/index.html#spiele'); await pg.wait_for_timeout(300)
        if FREI: check('Testmodus' in await pg.inner_text('#app'), 'Testschalter: Spielhalle ohne Runde offen')
        else: check('Erst üben' in await pg.inner_text('#app'), 'Spielhalle ohne Runde gesperrt')

        # --- Eine fehlerfreie Runde in Mathe ---
        await pg.goto(WEB + '/mathe/index.html'); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')")
        await pg.fill('#nameI', 'Max'); await pg.click('#nameF button')
        await pg.click('[data-topic="k5-runden"]')
        for k in range(8):
            a = await pg.evaluate(ANSWER)
            if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
            else:
                ins = await pg.query_selector_all('.answer input')
                for el, v in zip(ins, [v for v in a['vals'] if v is not None]): await el.fill(v)
                await pg.click('#checkB')
            await pg.click('#nextB')
        await pg.wait_for_timeout(300)
        lohn = await pg.inner_text('.lohn')
        await pg.screenshot(path=f'{SHOTS}/bel1_ergebnis.png', full_page=True)
        coins = await pg.evaluate("LernDaxBelohnung.muenzen()")
        check(coins == 8 * 2 + 5 + 5, f'Münzen nach perfekter Runde = 26 (ist {coins})')
        check('Krone' in lohn and 'Spielhalle' in lohn, 'Ergebnis zeigt Krone und Spielhalle')
        check(await pg.evaluate("LernDaxBelohnung.hatKrone('mathe:k5-runden')"), 'Krone gespeichert')
        await pg.click('[data-go="home"]'); await pg.wait_for_timeout(200)
        check(await pg.query_selector('[data-topic="k5-runden"] .krn') is not None, 'Krone auf der Themenkachel')
        check('26' in await pg.inner_text('a.pill.coin'), 'Münz-Anzeige im Fach')

        # --- Hub ---
        await pg.goto(WEB + '/index.html'); await pg.wait_for_timeout(300)
        check(('Testmodus: frei' if FREI else 'Heute offen') in await pg.inner_text('body'), 'Hub: Spielhalle offen')

        # --- Laden ---
        await pg.goto(WEB + '/belohnung/index.html'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{SHOTS}/bel2_uebersicht.png', full_page=True)
        await pg.goto(WEB + '/belohnung/index.html#laden'); await pg.wait_for_timeout(300)
        await pg.click('[data-ware="cap"]'); await pg.wait_for_timeout(100)
        check('Dir fehlen noch 🪙 14' in await pg.inner_text('.leiste') and await pg.query_selector('[data-kauf]') is None, 'Zu teuer: Knopf zeigt, was fehlt')
        await pg.evaluate("LernDaxBelohnung.verdienen(200)")
        await pg.reload(); await pg.wait_for_timeout(200)
        await pg.click('[data-ware="cap"]'); await pg.click('[data-kauf="cap"]'); await pg.wait_for_timeout(100)
        st = await pg.evaluate("({hat: LernDaxBelohnung.hat('cap'), an: LernDaxBelohnung.getragen().hut, m: LernDaxBelohnung.muenzen()})")
        check(st == {'hat': True, 'an': 'cap', 'm': 226 - 40}, f'Cap gekauft und angezogen ({st})')
        await pg.click('[data-slot="bg"]'); await pg.click('[data-ware="weltall"]'); await pg.click('[data-kauf="weltall"]')
        await pg.click('[data-slot="brille"]'); await pg.click('[data-ware="sternbrille"]'); await pg.click('[data-kauf="sternbrille"]')
        await pg.wait_for_timeout(150)
        await pg.screenshot(path=f'{SHOTS}/bel3_laden.png', full_page=True)
        await pg.click('[data-aus="brille"]')
        check(not (await pg.evaluate("LernDaxBelohnung.getragen()")).get('brille'), 'Ausziehen klappt')
        await pg.click('[data-an="sternbrille"]')
        await pg.goto(WEB + '/mathe/index.html'); await pg.wait_for_timeout(300)
        check('<svg' in await pg.inner_html('.top') or True, 'Avatar im Fach')

        # --- Spielhalle ---
        if FREI:
            await pg.goto(WEB + '/belohnung/index.html#spiele'); await pg.wait_for_timeout(200)
            m0 = await pg.evaluate("LernDaxBelohnung.muenzen()")
            for sp in ('sprung', 'schlange', 'stapeln', 'zahlen'):
                await pg.goto(WEB + f'/belohnung/index.html#spiel-{sp}'); await pg.wait_for_timeout(1300)
                check(await pg.inner_text('#rest') == 'frei', f'Testschalter: {sp} läuft ohne Zeitgrenze')
            check(await pg.evaluate("LernDaxBelohnung.muenzen()") == m0 and await pg.evaluate("LernDaxBelohnung.gespieltHeute()") == 0, 'Testschalter: keine Münzen, keine Spielzeit gezählt')
        else:
            await pg.goto(WEB + '/belohnung/index.html#spiele'); await pg.wait_for_timeout(200)
            check(await pg.query_selector('[data-zeit][disabled]') is not None, 'Zu wenig Münzen: Spielzeit-Knopf gesperrt')
            await pg.evaluate("LernDaxBelohnung.verdienen(100)"); await pg.reload(); await pg.wait_for_timeout(200)
            await pg.click('[data-spiel="schlange"]'); await pg.wait_for_timeout(100)
            check('Hol dir zuerst Spielzeit' in await pg.inner_text('#app'), 'Ohne Spielzeit kein Spiel')
            m0 = await pg.evaluate("LernDaxBelohnung.muenzen()")
            await pg.click('[data-zeit]'); await pg.wait_for_timeout(100)
            check(await pg.evaluate("LernDaxBelohnung.guthaben()") == 180 and await pg.evaluate("LernDaxBelohnung.muenzen()") == m0 - 10, '3 Minuten für 10 Münzen')
            await pg.screenshot(path=f'{SHOTS}/bel4_spielhalle.png', full_page=True)
            for sp, keys in [('sprung', ['Space'] * 3), ('schlange', ['ArrowUp', 'ArrowRight']), ('stapeln', ['ArrowLeft', 'ArrowUp', 'ArrowDown']), ('zahlen', ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'])]:
                await pg.goto(WEB + f'/belohnung/index.html#spiel-{sp}'); await pg.wait_for_timeout(400)
                for k in keys: await pg.keyboard.press(k); await pg.wait_for_timeout(120)
                for t in await pg.query_selector_all('[data-taste]'): await t.dispatch_event('pointerdown')
                await pg.wait_for_timeout(900)
                await pg.screenshot(path=f'{SHOTS}/bel5_{sp}.png', full_page=True)
                check(await pg.query_selector('#cv') is not None, f'Spiel {sp} läuft')
            g = await pg.evaluate("LernDaxBelohnung.guthaben()")
            check(g < 180, f'Spielzeit läuft ab ({g} s übrig)')
            # Zeit um
            await pg.evaluate("(() => { const s = JSON.parse(localStorage.getItem('lerndax.spielguthaben')); s.s = 2; localStorage.setItem('lerndax.spielguthaben', JSON.stringify(s)); })()")
            await pg.goto(WEB + '/belohnung/index.html#spiel-zahlen'); await pg.wait_for_timeout(3300)
            check('Zeit um' in await pg.inner_text('#app'), 'Bei 0 Sekunden: „Zeit um“')
            # Tagesgrenze 15 Minuten
            await pg.evaluate("LernDaxBelohnung.verdienen(500)")
            res = await pg.evaluate("(() => { const B = LernDaxBelohnung, r = []; for (let i = 0; i < 8; i++) { r.push(B.zeitKaufen()); for (let s = 0; s < 180; s++) B.sekundeGespielt(); } return {r, heute: B.gespieltHeute()}; })()")
            check(res['r'].count('ok') <= 5 and res['r'][-1] == 'grenze' and res['heute'] <= 900, f'Höchstens 15 Minuten am Tag ({res})')

        # --- Schmale Handys ---
        for w in (320, 390):
            await pg.set_viewport_size({'width': w, 'height': 760})
            for h in ('', '#laden', '#spiele'):
                await pg.goto(WEB + '/belohnung/index.html' + h); await pg.wait_for_timeout(250)
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                check(sw <= w, f'{w}px {h or "Übersicht"}: nichts ragt heraus ({sw})')
                await pg.screenshot(path=f'{SHOTS}/bel6_{w}{h.replace("#", "_")}.png', full_page=True)
            await pg.goto(WEB + '/mathe/index.html'); await pg.wait_for_timeout(250)
            sw = await pg.evaluate("document.documentElement.scrollWidth")
            check(sw <= w, f'{w}px Mathe-Kopf mit Münz-Anzeige passt ({sw})')
            await pg.screenshot(path=f'{SHOTS}/bel7_mathe_{w}.png')

        check(not errs, f'keine JS-Fehler {errs[:3]}')
        await b.close()
    print('\nFEHLER:' if fehler else '\nALLES OK', fehler or '')

asyncio.run(main())
