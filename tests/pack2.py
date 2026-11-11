import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FAST = open(HERE/'ex.py').read().split('FAST = """')[1].split('"""')[0]
async def finish(pg, n=400):
    for _ in range(n):
        if 'Nochmal' in await pg.inner_text('#exPlay'): return True
        await pg.wait_for_timeout(150)
    return False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2); await ctx.add_init_script(FAST)
        pg = await ctx.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        await pg.screenshot(path=f'{SHOTS}/q_home.png', full_page=True)
        # Gedankenlesen mit 23 = 10111
        await pg.click('[data-explain="mindread"]')
        secret = 23
        for k in range(5):
            await pg.wait_for_selector('.exchips.asking', timeout=60000)
            if k==0: await pg.screenshot(path=f'{SHOTS}/q_mind_card.png')
            await pg.click('.exchip-big >> nth=%d' % (0 if secret & (1<<k) else 1))
            await pg.wait_for_timeout(150)
        await finish(pg)
        cap = await pg.inner_text('.excap'); print('MIND:', cap.replace('\n',' | ')[:160])
        await pg.screenshot(path=f'{SHOTS}/q_mind_end.png'); await pg.click('[data-exclose]')
        for t in ['galton','pascal','tree']:
            await pg.click(f'[data-explain="{t}"]'); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f'{SHOTS}/q_{t}_mid.png')
            ok = await finish(pg); print(t, 'finished', ok)
            await pg.screenshot(path=f'{SHOTS}/q_{t}_end.png')
            if t=='pascal':
                await pg.click('.exchip:has-text("64 Reihen")'); await finish(pg)
                await pg.screenshot(path=f'{SHOTS}/q_pascal64.png')
            await pg.click('[data-exclose]')
        print('errors', errs); await b.close()
asyncio.run(main())
