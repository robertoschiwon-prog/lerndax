import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
HUB=(ROOT/'web').as_uri()+'/index.html'
MATHE=(ROOT/'web').as_uri()+'/mathe/index.html'
ANSWER = open(HERE/'sync_test.py').read().split('ANSWER = """')[1].split('"""')[0]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto(HUB); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{SHOTS}/h1_hub_new.png', full_page=True)
        await pg.goto(MATHE); await pg.fill('#nameI','Bruno'); await pg.click('#nameF button')
        await pg.click('[data-topic="k5-runden"]')
        for k in range(8):
            a=await pg.evaluate(ANSWER)
            if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
            else:
                ins=await pg.query_selector_all('.answer input')
                for el,v in zip(ins,[v for v in a['vals'] if v is not None]): await el.fill(v)
                await pg.click('#checkB')
            await pg.click('#nextB')
        await pg.click('[data-go="home"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{SHOTS}/h2_mathe.png')
        await pg.goto(HUB); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{SHOTS}/h3_hub_after.png', full_page=True)
        await pg.goto(MATHE+'#eltern'); await pg.wait_for_timeout(400)
        print('eltern view:', (await pg.inner_text('h1'))[:30])
        await pg.goto(MATHE+'#entdecken'); await pg.wait_for_timeout(400)
        print('scrollY entdecken:', await pg.evaluate('scrollY'))
        print('errors', errs); await b.close()
asyncio.run(main())
