import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FAST = open(HERE/'ex.py').read().split('FAST = """')[1].split('"""')[0]
async def finish(pg):
    for _ in range(200):
        if 'Nochmal' in await pg.inner_text('#exPlay'): return
        await pg.wait_for_timeout(200)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
        await ctx.add_init_script(FAST)
        pg = await ctx.new_page()
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        await pg.click('[data-explain="k5-prim"]'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{SHOTS}/p1_mid.png')
        await finish(pg); await pg.screenshot(path=f'{SHOTS}/p2_12.png')
        await pg.click('.exchip:has-text("Andere Zahl")')
        # force a prime: loop until prime shown
        await finish(pg); await pg.screenshot(path=f'{SHOTS}/p3_other.png')
        await pg.click('.exchip:has-text("Faktorbaum")'); await finish(pg); await pg.screenshot(path=f'{SHOTS}/p4_tree.png')
        await pg.click('[data-exclose]')
        await pg.click('[data-topic="k5-prim"]')
        got = set()
        for k in range(8):
            ex = await pg.evaluate("()=>window.__mathelix.round().cur.task.ex")
            kind = ex['mode']
            if kind not in got:
                await pg.click('[data-when="pre"]'); await finish(pg)
                await pg.screenshot(path=f'{SHOTS}/p5_{kind}_pre.png'); await pg.click('[data-exclose]')
            # falsch beantworten
            if kind=='prime':
                # Ja/Nein (2 Auswahlen) oder „Welche Zahl ist eine Primzahl?“ (4 Auswahlen): falsch antworten, bis die Lösung kommt
                c = await pg.evaluate("()=>window.__mathelix.round().cur.task.correct")
                for _ in range(2):
                    if await pg.query_selector('[data-when="post"]'): break
                    for bt in await pg.query_selector_all('[data-choice]:not([disabled])'):
                        if await bt.get_attribute('data-choice') != str(c): await bt.click(); break
                    await pg.wait_for_timeout(100)
            else:
                for _ in range(2):
                    await pg.fill('.answer input','2*2'); await pg.click('#checkB'); await pg.wait_for_timeout(100)
            if kind not in got:
                await pg.click('[data-when="post"]'); await finish(pg)
                await pg.screenshot(path=f'{SHOTS}/p6_{kind}_post_{ex["n"]}.png'); await pg.click('[data-exclose]')
                got.add(kind)
            await pg.click('#nextB')
            if len(got)==2: break
        print('got', got, 'errors', errs)
        await b.close()
asyncio.run(main())
