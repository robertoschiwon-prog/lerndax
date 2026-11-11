import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FAST = open(HERE/'ex.py').read().split('FAST = """')[1].split('"""')[0]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2); await ctx.add_init_script(FAST)
        pg = await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        for t in ['gauss','triangle']:
            await pg.click(f'[data-explain="{t}"]')
            for _ in range(300):
                if 'Nochmal' in await pg.inner_text('#exPlay'): break
                await pg.wait_for_timeout(200)
            await pg.screenshot(path=f'{SHOTS}/f_{t}.png'); await pg.click('[data-exclose]')
        print('errors', errs); await b.close()
asyncio.run(main())
