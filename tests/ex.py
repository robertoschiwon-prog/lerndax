import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FAST = """
const _now = performance.now.bind(performance); const s0=_now(); performance.now = () => s0 + (_now()-s0)*8;
const _st = window.setTimeout; window.setTimeout = (f,ms,...a)=>_st(f,(ms||0)/8,...a);
const _raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = cb => _raf(()=>cb(performance.now()));
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
        await ctx.add_init_script(FAST)
        pg = await ctx.new_page()
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto(URL); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        await pg.screenshot(path=f'{SHOTS}/e_home.png', full_page=True)
        ids = await pg.eval_on_selector_all('[data-explain]', 'els=>[...new Set(els.map(e=>e.dataset.explain))]')
        print(ids)
        for i,t in enumerate(ids):
            await pg.click(f'[data-explain="{t}"]')
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'{SHOTS}/e{i:02d}_{t}_a.png')
            for _ in range(80):
                txt = await pg.inner_text('#exPlay')
                if 'Nochmal' in txt: break
                await pg.wait_for_timeout(250)
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=f'{SHOTS}/e{i:02d}_{t}_b.png')
            # Interaktion
            chips = await pg.query_selector_all('.exchip')
            for c in chips[:3]:
                await c.click(); await pg.wait_for_timeout(300)
            sl = await pg.query_selector('.exslider input')
            if sl and await sl.is_visible():
                await sl.evaluate("e=>{e.value=Math.round((+e.min + +e.max)/2)+1; e.dispatchEvent(new Event('input',{bubbles:true}))}")
                await pg.wait_for_timeout(200)
                await pg.screenshot(path=f'{SHOTS}/e{i:02d}_{t}_c.png')
            await pg.click('[data-exclose]'); await pg.wait_for_timeout(150)
        # In Aufgabe
        await pg.click('[data-topic="k5-winkelpaar"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{SHOTS}/e_task.png')
        print('errors', errs)
        await b.close()
asyncio.run(main())
