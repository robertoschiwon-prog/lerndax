# Für jedes Thema: Aufgaben falsch beantworten, Lösungs-Animation abspielen, prüfen:
#  - Animation läuft fertig, keine Fehler
#  - Untertitel „Lösung zu deiner Aufgabe“
#  - das richtige Ergebnis der Aufgabe kommt in den Texten vor
#  Aufruf: python3 tests/loesung.py [Anzahl je Thema, Standard 3] [Themen mit Komma getrennt, Standard alle]
import asyncio, pathlib, sys, json, re, os
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
FAST="(() => { let t = 0; window.requestAnimationFrame = (cb) => setTimeout(() => cb(t += 250), 6); })();"
WATCH="""() => { window.__caps = []; const ov = document.querySelector('.exov');
  const grab = () => { const c = ov.querySelector('.excap').innerText.trim(); const s = ov.querySelector('.exsub').innerText.trim();
    const v = (s ? '['+s+'] ' : '') + c; if (c && v !== window.__caps[window.__caps.length-1]) window.__caps.push(v); };
  new MutationObserver(grab).observe(ov, {subtree:true, childList:true, characterData:true}); }"""
TASKINFO="""() => { const t = window.__mathelix.round().cur.task; const fmt = window.Mathelix.util.fmt;
  const plain = (h) => String(h).replace(/<sup>(\\d+)<\\/sup>/g,'^$1').replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').trim();
  let want = [];
  if (t.fields) t.fields.forEach(f => { if ('fixed' in f) return; if (Array.isArray(f.answer)) want.push(f.answer.join(' · ')); else if (typeof f.answer === 'number') want.push(fmt(f.answer)); });
  if (t.layout === 'time') want = [String(t.fields[0].answer).padStart(2,'0') + ':' + String(t.fields[1].answer).padStart(2,'0')];
  if (t.layout === 'frac') want = t.fields.map(f => String('fixed' in f ? f.fixed : f.answer));
  if (t.layout === 'coord') want = ['P(' + t.fields[0].answer + ' | ' + t.fields[1].answer + ')'];
  if (t.choices) { const c = plain(t.choices[t.correct]); want = /^[\\d\\s,]+$/.test(c) && !/Teiler/.test(t.prompt) ? [c] : []; }
  return { p: plain(t.prompt), ex: t.ex || null, want }; }"""
async def run(topics, n):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], **CHROME)
        pg = await b.new_page(viewport={'width':390,'height':844})
        await pg.add_init_script(FAST)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate("localStorage.setItem('lerndax.avatar.asked','1')"); await pg.fill('#nameI','Max'); await pg.click('#nameF button')
        res = []
        for t in topics:
            for i in range(n):
                await pg.goto(URL); await pg.click(f'[data-topic="{t}"]'); await pg.wait_for_timeout(80)
                info = await pg.evaluate(TASKINFO)
                for k in range(3):
                    if await pg.query_selector('[data-when="post"]'): break
                    if await pg.query_selector('.answer input'):
                        for inp in await pg.query_selector_all('.answer input'): await inp.fill('1')
                        await pg.click('#checkB')
                    else:
                        ch = await pg.evaluate("() => window.__mathelix.round().cur.task.correct")
                        for bt in await pg.query_selector_all('[data-choice]:not([disabled])'):
                            if await bt.get_attribute('data-choice') != str(ch): await bt.evaluate('e => e.click()'); break
                    await pg.wait_for_timeout(150)
                post = await pg.query_selector('[data-when="post"]')
                if not post: res.append({'t': t, 'p': info['p'], 'problem': 'kein Animations-Knopf'}); continue
                await post.evaluate('e => e.click()'); await pg.wait_for_selector('.exov'); await pg.evaluate(WATCH)
                done = False
                for w in range(600):
                    if 'Nochmal' in await pg.inner_text('#exPlay'): done = True; break
                    await pg.wait_for_timeout(60)
                caps = await pg.evaluate('window.__caps'); title = await pg.inner_text('.exhead h2')
                txt = ' '.join(caps).replace(' ',' ').replace('\n',' ')
                probs = []
                if not done: probs.append('läuft nicht zu Ende')
                if not any('Lösung zu deiner Aufgabe' in c for c in caps): probs.append('kein Aufgabenbezug')
                norm = lambda s: re.sub(r'\s+', ' ', s.replace(' ',' ')).strip()
                for w_ in info['want']:
                    if norm(w_) not in norm(txt): probs.append(f'Ergebnis „{w_}“ fehlt')
                res.append({'t': t, 'p': info['p'][:110], 'title': title, 'problem': '; '.join(probs), 'last': caps[-1][:200] if caps else ''})
                await pg.click('[data-exclose]')
        await b.close()
        bad = [r for r in res if r.get('problem')]
        for r in bad: print('PROBLEM', r['t'], '|', r['p'], '|', r['problem'], '|', r.get('last', '')[:120])
        print('animationen', len(res), 'probleme', len(bad), 'errors', errs)
        sys.exit(1 if bad or errs else 0)
N = int(sys.argv[1]) if len(sys.argv) > 1 else 3
async def topics():
    if len(sys.argv) > 2: return sys.argv[2].split(',')
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], **CHROME); pg = await b.new_page()
        await pg.goto(URL)
        ids = await pg.evaluate("() => window.Mathelix.grades[5].lbs.flatMap(l => l.topics).map(t => t.id)")
        await b.close(); return ids
asyncio.run(run(asyncio.run(topics()), N))
