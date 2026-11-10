import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        await pg.click('[data-explain="pi"]'); await pg.wait_for_timeout(3000)
        print('btn while playing:', await pg.inner_text('#exPlay'))
        await pg.click('#exPlay')
        v1 = await pg.evaluate("()=>document.querySelector('.exov') && window.__mathelix && 0")
        cap1 = await pg.inner_text('.excap')
        await pg.screenshot(path=f'{SHOTS}/pause1.png')
        await pg.wait_for_timeout(2500)
        cap2 = await pg.inner_text('.excap')
        print('paused btn:', await pg.inner_text('#exPlay'), '| caption unchanged:', cap1==cap2)
        await pg.click('.exstage')   # weiter per Antippen
        print('after tap:', await pg.inner_text('#exPlay'))
        await pg.click('.exstage')   # wieder Pause per Antippen
        print('after 2nd tap:', await pg.inner_text('#exPlay'))
        await pg.click('#exSpeed'); print('speed:', await pg.inner_text('#exSpeed'))
        await pg.click('#exRestart'); await pg.wait_for_timeout(300)
        print('after restart:', await pg.inner_text('#exPlay'))
        await pg.screenshot(path=f'{SHOTS}/pause2.png')
        await pg.click('[data-exclose]')
        await pg.click('[data-explain="k5-runden"]'); await pg.wait_for_timeout(500)
        print('slow remembered:', await pg.inner_text('#exSpeed'))
        print('errors', errs)
        await b.close()
asyncio.run(main())
