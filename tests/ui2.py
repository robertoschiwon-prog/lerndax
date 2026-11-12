import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FILL = """() => {
  const R = window.__mathelix.round(); const t = R.cur.task;
  if (t.choices) return {choice: t.correct};
  const fmt = window.Mathelix.util.fmt;
  return {vals: t.fields.map(f => 'fixed' in f ? null : Array.isArray(f.answer) ? f.answer.join('*') : fmt(f.answer).replace(/\\u202F/g,''))};
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        bad=0; n=0
        ids = await pg.eval_on_selector_all('[data-topic]', 'els=>els.map(e=>e.dataset.topic)')
        for rnd in range(2):
          for t in ids:
            for zu in await pg.query_selector_all('[data-lbopen]'): await pg.evaluate("() => { const b = document.querySelector('[data-lbopen]'); if (b) b.click(); }")  # fertige Lernbereiche sind eingeklappt
            await pg.click(f'[data-topic="{t}"]')
            for k in range(8):
                a = await pg.evaluate(FILL)
                if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
                else:
                    inputs = await pg.query_selector_all('.answer input')
                    vals=[v for v in a['vals'] if v is not None]
                    for el,v in zip(inputs, vals): await el.fill(v)
                    await pg.click('#checkB')
                n+=1
                if not await pg.query_selector('.fb.ok'):
                    bad+=1; print('NOT OK', t, a, await pg.inner_text('.card'))
                    if not await pg.query_selector('#nextB'): break
                await pg.click('#nextB')
            if t==ids[0] and rnd==0: await pg.screenshot(path=f'{SHOTS}/r_result.png', full_page=True)
            await pg.click('[data-go="home"]')
        await pg.screenshot(path=f'{SHOTS}/r_home.png', full_page=True)
        await pg.click('[data-go="parents"]'); await pg.screenshot(path=f'{SHOTS}/r_parents.png', full_page=True)
        await pg.click('[data-go="home"]')
        for zu in await pg.query_selector_all('[data-lbopen]'): await pg.evaluate("() => { const b = document.querySelector('[data-lbopen]'); if (b) b.click(); }")
        await pg.click('[data-topic="k5-rechteck"]')
        await pg.screenshot(path=f'{SHOTS}/r_rect.png')
        print('tasks', n, 'not ok', bad, 'errors', errs)
        await b.close()
asyncio.run(main())
