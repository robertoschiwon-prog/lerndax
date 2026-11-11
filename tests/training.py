# Trainingsmodus für eine Klassenarbeit (mathe/?t=<id>): Startseite, Runden, Rückweg, Fit-Anzeige,
# unbekannte Trainings, allgemeine App bleibt ohne Trainings-Link.
import pathlib, os, asyncio, re
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
from playwright.async_api import async_playwright
BASE = (ROOT / 'web').as_uri() + '/mathe/index.html'
FILL = """() => {
  const R = window.__mathelix.round(); const t = R.cur.task;
  if (t.choices) return {choice: t.correct, topic: R.cur.topic.id};
  const fmt = window.Mathelix.util.fmt;
  return {topic: R.cur.topic.id, vals: t.fields.map(f => 'fixed' in f ? null : Array.isArray(f.answer) ? f.answer.join('*') : fmt(f.answer).replace(/\\u202F/g,''))};
}"""
async def play_round(pg, allowed, log):
    for k in range(8):
        a = await pg.evaluate(FILL)
        log.append(a['topic'])
        assert a['topic'] in allowed, ('Thema gehört nicht zum Training', a['topic'])
        if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
        else:
            inputs = await pg.query_selector_all('.answer input')
            for el, v in zip(inputs, [v for v in a['vals'] if v is not None]): await el.fill(v)
            await pg.click('#checkB')
        assert await pg.query_selector('.fb.ok'), ('nicht als richtig erkannt', a)
        await pg.click('#nextB')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE)
        # allgemeine App: kein Trainings-Link, keine Trainings-Knöpfe
        assert not await pg.query_selector('[data-tr]'), 'Trainings-Knöpfe in der allgemeinen App'
        await pg.goto(BASE + '?t=mathe-2026-11-24')
        await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI', 'Max'); await pg.click('#nameF button')
        tr = await pg.evaluate("window.LERNDAX_TRAININGS['mathe-2026-11-24']")
        allowed = {t for g in tr['gruppen'] for t in g['themen']}
        assert await pg.query_selector('.trhero'), 'Trainings-Startseite fehlt'
        fit0 = await pg.inner_text('.trfit b')
        # Trainingsrunde
        log = []
        await pg.click('[data-tr="all"]'); await play_round(pg, allowed, log)
        assert await pg.query_selector('.res'), 'Ergebnis fehlt'
        await pg.click('[data-again]'); await play_round(pg, allowed, log)
        await pg.click('[data-go="home"]')
        assert await pg.query_selector('.trhero'), 'Zur Übersicht führt nicht zurück ins Training'
        fit1 = await pg.inner_text('.trfit b')
        assert int(fit1.rstrip(' %')) > int(fit0.rstrip(' %')), ('Fit-Anzeige steigt nicht', fit0, fit1)
        # Gruppen-Mix (Gruppe 1) und einzelnes Thema
        g0 = set(tr['gruppen'][0]['themen'])
        await pg.click('[data-tr="g0"]'); await play_round(pg, g0, log); await pg.click('[data-go="home"]')
        await pg.click('[data-topic="k5-potenz"]'); await play_round(pg, {'k5-potenz'}, log)
        # Kopfzeile "Mathelix" (auf der Ergebnis-Seite) bleibt im Training
        await pg.click('.top [data-go="home"]')
        assert await pg.query_selector('.trhero'), 'Logo führt aus dem Training heraus'
        # Runde abbrechen (✕) führt zurück ins Training
        await pg.click('[data-topic="k5-division"]'); await pg.click('.ptop [data-go="home"]')
        assert await pg.query_selector('.trhero'), 'Abbrechen führt aus dem Training heraus'
        # Erklärung öffnen und schließen
        await pg.click('[data-explain="k5-vorrang"]'); await pg.wait_for_timeout(500)
        await pg.click('[data-exclose]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{SHOTS}/t_home.png', full_page=True)
        # unbekanntes Training
        await pg.goto(BASE + '?t=gibt-es-nicht')
        assert 'gibt es nicht' in await pg.inner_text('#app'), 'Hinweis für unbekanntes Training fehlt'
        # Fortschritt landet im allgemeinen Lernstand
        await pg.goto(BASE)
        st = await pg.evaluate("JSON.parse(localStorage.getItem('mathelix.v1')).stats")
        assert st.get('k5-potenz', {}).get('n', 0) >= 8, 'Fortschritt fehlt im allgemeinen Lernstand'
        print('runden-aufgaben', len(log), 'themen', sorted(set(log)), 'fit', fit0, '->', fit1, 'errors', errs)
        await b.close()
asyncio.run(main())
