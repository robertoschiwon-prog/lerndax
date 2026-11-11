import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
HUB=(ROOT/'web').as_uri()+'/index.html'
MATHE=(ROOT/'web').as_uri()+'/mathe/index.html'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(HUB); await pg.wait_for_timeout(900)
        print('picker auto-open:', await pg.query_selector('.ldx-sheet') is not None)
        await pg.screenshot(path=f'{SHOTS}/av1_first.png')
        await pg.click('.ldx-fig[data-fig="drache"]'); await pg.click('.ldx-col[data-col="nacht"]'); await pg.wait_for_timeout(150)
        await pg.screenshot(path=f'{SHOTS}/av2_choice.png')
        await pg.click('.ldx-done'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{SHOTS}/av3_hub.png')
        await pg.reload(); await pg.wait_for_timeout(700)
        print('picker again after reload:', await pg.query_selector('.ldx-sheet') is not None)
        await pg.goto(MATHE); await pg.wait_for_timeout(500)
        await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{SHOTS}/av4_mathe.png')
        print('errors', errs); await b.close()
asyncio.run(main())
