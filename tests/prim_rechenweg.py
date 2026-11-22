# Primfaktoren: Brunos Eingabe (ganzer Rechenweg) in der echten Oberfläche (seit v128). Erwartet: alle "richtig"-Fälle richtig, alle "falsch"-Fälle falsch.
import pathlib, os, asyncio
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
INFO = "() => { const t = window.__lerndax.round().cur.task; const f = t.fields && t.fields.find(x => x.type === 'factors'); return f ? { n: f.answer.reduce((a,b)=>a*b,1), p: f.answer } : null; }"
def formen(n, p):
    kette = f"{p[0]}·{n//p[0]}={'·'.join(map(str,p))}"
    gut = [kette + '=' + '·'.join(map(str,p)), f"{n}={kette}", f"{n} = {' · '.join(map(str,p))}", '·'.join(map(str,p)), '·'.join(map(str,p)) + f"={n}", ' * '.join(map(str,p)), 'x'.join(map(str,reversed(p)))]
    schlecht = [f"{n}", f"{n}={p[0]}·{n//p[0]}" if len(p) > 2 else f"{n}=1·{n}", '·'.join(map(str,p)) + '·2', '']
    return gut, schlecht
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(**CHROME, args=['--no-sandbox']); pg = await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto((ROOT/'web').as_uri()+'/mathe/index.html'); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        n=0; fehler=[]; plan=[]
        for runde in range(40):
            if len(plan) >= 22: break
            await pg.evaluate("localStorage.clear(); localStorage.setItem('lerndax.avatar.asked','1')"); await pg.reload(); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
            await pg.click('[data-topic="k5-prim"]')
            for k in range(8):
                info = await pg.evaluate(INFO)
                if info:
                    gut, schlecht = formen(info['n'], info['p'])
                    i = len(plan); v, soll = (gut[i % len(gut)], True) if i % 3 != 2 else (schlecht[(i//3) % len(schlecht)], False)
                    plan.append(v)
                    await (await pg.query_selector('.answer input')).fill(v); await pg.click('#checkB'); n+=1
                    ist = bool(await pg.query_selector('.fb.ok'))
                    if not await pg.query_selector('.fb'): ist = None  # leere Eingabe: keine Wertung
                    if ist is not None and ist != soll: fehler.append((info['n'], v, 'soll richtig' if soll else 'soll falsch'))
                    if v == '' : await (await pg.query_selector('.answer input')).fill('·'.join(map(str,info['p']))); await pg.click('#checkB')
                else:
                    a = await pg.evaluate("() => { const t = window.__lerndax.round().cur.task; if (t.choices) return {choice: t.correct}; const fmt = window.Mathelix.util.fmt; return {vals: t.fields.map(f => 'fixed' in f ? null : Array.isArray(f.answer) ? f.answer.join('*') : fmt(f.answer).replace(/\\u202F/g,''))}; }")
                    if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
                    else:
                        for el,v in zip(await pg.query_selector_all('.answer input'), [v for v in a['vals'] if v is not None]): await el.fill(v)
                        await pg.click('#checkB')
                if not await pg.query_selector('#nextB'): break
                await pg.click('#nextB')
        print('Primfaktor-Eingaben', n, 'Abweichungen', fehler, 'errors', errs); print(plan[:9])
        await b.close()
asyncio.run(main())
