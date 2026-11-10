# Erklärungen passend zur Aufgabe: für Vorrangregeln, Potenzen, Division und Teilbarkeit je Aufgabenart
# „▶ Erklärung“ (vorher: ähnliches Beispiel) und „▶ Lösung als Animation“ (nachher: genau die Aufgabe) öffnen
# und bis zum Ende abspielen. Bildschirmfotos in tests/shots/x_*.png.
import asyncio, json, pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
URL = (ROOT / 'web').as_uri() + '/mathe/index.html'
from playwright.async_api import async_playwright
FAST="""const _now = performance.now.bind(performance); const s0=_now(); performance.now = () => s0 + (_now()-s0)*8;
const _st = window.setTimeout; window.setTimeout = (f,ms,...a)=>_st(f,(ms||0)/8,...a);
const _raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = cb => _raf(()=>cb(performance.now()));
localStorage.setItem('lerndax.avatar.asked','1');localStorage.setItem('mathelix.v1',JSON.stringify({name:'Bruno',grade:5,stats:{},days:[],total:0,seen:{}}))"""
FILL = """() => { const R = window.__mathelix.round(); const t = R.cur.task;
  if (t.choices) return {choice: t.correct, n: t.choices.length};
  const fmt = window.Mathelix.util.fmt;
  return {vals: t.fields.map(f => 'fixed' in f ? null : Array.isArray(f.answer) ? f.answer.join('*') : fmt(f.answer).replace(/\\u202F/g,''))}; }"""
WANT = {'k5-vorrang':['tree'], 'k5-potenz':['pow','zehn','quad'], 'k5-division':['div'], 'k5-teilbar':['teil','teiler']}
async def wait_end(pg):
    for _ in range(200):
        if 'Nochmal' in await pg.inner_text('#exPlay'): return True
        await pg.wait_for_timeout(100)
    return False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=1.5)
        await ctx.add_init_script(FAST)
        pg = await ctx.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(500)
        shots=[]
        for topic, modes in WANT.items():
            await pg.click('[data-go="home"]') if await pg.query_selector('.ptop') else None
            await pg.click(f'[data-topic="{topic}"]')
            todo=list(modes)
            for _ in range(60):
                if not todo: break
                if not await pg.query_selector('#checkB, [data-choice]'):
                    await pg.click('[data-again]') if await pg.query_selector('[data-again]') else None
                    await pg.wait_for_timeout(100)
                ex = await pg.evaluate("()=>{const R=window.__mathelix.round(); return R&&R.cur? R.cur.task.ex||null : null}")
                a = await pg.evaluate(FILL)
                key = ex['mode'] if ex else None
                if key in todo:
                    todo.remove(key)
                    await pg.click('[data-when="pre"]'); await pg.wait_for_timeout(200)
                    ok1 = await wait_end(pg)
                    f=f'{SHOTS}/x_{topic}_{key}_pre.png'; await pg.locator('.exsheet').screenshot(path=f); shots.append(f)
                    sub1 = await pg.inner_text('.exsub')
                    await pg.click('[data-exclose]'); await pg.wait_for_timeout(100)
                    # falsch antworten
                    if 'choice' in a:
                        wrong=[i for i in range(a['n']) if i!=a['choice']]
                        await pg.click(f'[data-choice="{wrong[0]}"]'); await pg.wait_for_timeout(100)
                        if not await pg.query_selector('#nextB'): await pg.click(f'[data-choice="{wrong[1]}"]')
                    else:
                        for _k in range(2):
                            if await pg.query_selector('#nextB'): break
                            for el in await pg.query_selector_all('.answer input'): await el.fill('99999')
                            await pg.click('#checkB'); await pg.wait_for_timeout(100)
                    await pg.click('[data-when="post"]'); await pg.wait_for_timeout(200)
                    ok2 = await wait_end(pg)
                    f=f'{SHOTS}/x_{topic}_{key}_post.png'; await pg.locator('.exsheet').screenshot(path=f); shots.append(f)
                    sub2 = await pg.inner_text('.exsub'); cap = await pg.inner_text('.excap')
                    if not (ok1 and ok2 and sub1 and sub2): errs.append('nicht fertig: ' + topic + ' ' + key)
                    print(topic, key, json.dumps(ex, ensure_ascii=False), '| pre ok', ok1, '| post ok', ok2, '|', sub1[:40], '|', sub2[:40], '|', cap[:90].replace('\n',' '))
                    await pg.click('[data-exclose]'); await pg.wait_for_timeout(100)
                    await pg.click('#nextB')
                else:
                    if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
                    else:
                        ins = await pg.query_selector_all('.answer input')
                        for el,v in zip(ins,[v for v in a['vals'] if v is not None]): await el.fill(v)
                        await pg.click('#checkB')
                    await pg.click('#nextB')
            if todo: print('NICHT GEFUNDEN', topic, todo); errs.append('fehlt: ' + topic)
            await pg.goto(URL); await pg.wait_for_timeout(300)
        print('errors', errs)
        await b.close()
asyncio.run(main())
