"""Elternübersicht auf der Startseite: zeigt beide Fächer mit Zahlen, Links führen in die Elternansicht des Fachs,
der Zurück-Knopf führt wieder zur Startseite. Aufruf: python3 tests/eltern.py"""
import pathlib, os, sys, asyncio, json
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
# kleiner Webserver, damit Links wie „deutsch/#eltern“ wie auf GitHub Pages die index.html öffnen
import threading, functools, http.server
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
SRV = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(H, directory=str(ROOT / 'web')))
threading.Thread(target=SRV.serve_forever, daemon=True).start()
HUB = f'http://127.0.0.1:{SRV.server_port}/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        cx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, service_workers='block')
        pg = await cx.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(HUB)
        # Lernstand für beide Fächer anlegen (Mathe geübt, Deutsch geübt)
        heute = await pg.evaluate("(() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })()")
        st = lambda ids: json.dumps({'name': 'Max', 'grade': 5, 'total': 8 * len(ids), 'days': [heute], 'rounds': {heute: len(ids)}, 'stats': {i: {'n': 8, 'hist': [1, 1, 1, .5, 1, 1, 1, 1], 'last': heute} for i in ids}})
        await pg.evaluate("([a, b]) => { localStorage.setItem('mathelix.v1', a); localStorage.setItem('dedax.v1', b); localStorage.setItem('lerndax.avatar.asked', '1'); }", [st(['k5-runden', 'k5-zahlen']), st(['d5-zeitformen'])])
        await pg.goto(HUB); await pg.wait_for_timeout(300)
        await pg.click('.foot a'); await pg.wait_for_timeout(200)
        h = await pg.inner_text('h1'); karten = await pg.eval_on_selector_all('.ecard[data-fach]', 'e=>e.map(x=>x.dataset.fach)')
        text = await pg.inner_text('#app')
        await pg.screenshot(path=str(SHOTS / 'eltern-start.png'), full_page=True)
        ok = h == 'Für Eltern' and karten == ['mathe', 'deutsch'] and '2 / 36' in text and '1 / 30' in text and '94 %' in text
        print('Überschrift:', h, '| Karten:', karten, '| Zahlen stimmen:', '2 / 36' in text, '1 / 30' in text, '94 %' in text)
        await pg.click('.ecard[data-fach="deutsch"] .elink'); await pg.wait_for_timeout(500)
        de = await pg.inner_text('h1'); print('Link DeDax führt zu:', de, '|', 'Zeitformen' in await pg.inner_text('#app'))
        ok = ok and de == 'Für Eltern' and '/deutsch/' in pg.url
        await pg.screenshot(path=str(SHOTS / 'eltern-deutsch.png'), full_page=True)
        await pg.goto(HUB + '#eltern'); await pg.wait_for_timeout(300)
        await pg.click('#elternZurueck'); await pg.wait_for_timeout(200)
        zur = await pg.inner_text('h1'); print('Zurück führt zu:', zur); ok = ok and zur.startswith('Hallo')
        print('errors', errs); await b.close(); sys.exit(0 if ok and not errs else 1)
asyncio.run(main())
