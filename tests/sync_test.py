import pathlib, os
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
import asyncio, json, uuid
from playwright.async_api import async_playwright
URL=(ROOT/'web').as_uri()+'/mathe/index.html'
MOCK=open(HERE/'mock_supabase.js').read()
DB={'users':{}, 'profiles':[], 'progress':{}, 'family_settings':{}}
def handle(op, args):
    a=json.loads(args)
    if op=='signup':
        if a['email'] in DB['users']: return {'error':{'message':'User already registered'}}
        uid=str(uuid.uuid4()); DB['users'][a['email']]={'pw':a['password'],'id':uid}
        return {'session':{'user':{'id':uid,'email':a['email']}}}
    if op=='login':
        u=DB['users'].get(a['email'])
        if not u or u['pw']!=a['password']: return {'error':{'message':'Invalid login credentials'}}
        return {'session':{'user':{'id':u['id'],'email':a['email']}}}
    uid=a['uid']; q=a['q']; t=q['table']; ops=q['ops']
    if not uid: return {'error':{'message':'not authenticated'}}
    kinds=[o[0] for o in ops]
    if t=='lerndax_profiles':
        eqs={x[1]:x[2] for x in ops if x[0]=='eq'}
        if 'insert' in kinds:
            o=[x for x in ops if x[0]=='insert'][0][1]
            row={'id':str(uuid.uuid4()),'owner':uid,'name':o['name'],'grade':o.get('grade',5),'avatar':o.get('avatar')}
            DB['profiles'].append(row); return {'data':{'id':row['id'],'name':row['name'],'avatar':row['avatar']},'error':None}
        if 'update' in kinds:
            o=[x for x in ops if x[0]=='update'][0][1]
            for p in DB['profiles']:
                if p['id']==eqs.get('id') and p['owner']==uid: p.update(o)
            return {'data':None,'error':None}
        if 'id' in eqs:
            r=[p for p in DB['profiles'] if p['id']==eqs['id'] and p['owner']==uid]
            return {'data':{'avatar':r[0].get('avatar')} if r else None,'error':None}
        return {'data':[{'id':p['id'],'name':p['name'],'grade':p['grade'],'avatar':p.get('avatar')} for p in DB['profiles'] if p['owner']==uid],'error':None}
    if t=='lerndax_progress':
        if 'upsert' in kinds:
            o=[x for x in ops if x[0]=='upsert'][0][1]
            prof=[p for p in DB['profiles'] if p['id']==o['profile_id']]
            if not prof or prof[0]['owner']!=uid: return {'data':None,'error':{'message':'RLS violation'}}
            if not o.get('subject'): return {'data':None,'error':{'message':'subject missing'}}
            DB['progress'][(o['profile_id'],o['subject'])]={'owner':uid,'state':o['state']}; return {'data':None,'error':None}
        eqs={x[1]:x[2] for x in ops if x[0]=='eq'}
        r=DB['progress'].get((eqs.get('profile_id'),eqs.get('subject')))
        return {'data':{'state':r['state']} if r and r['owner']==uid else None,'error':None}
    if t=='lerndax_family_settings':
        if 'upsert' in kinds:
            o=[x for x in ops if x[0]=='upsert'][0][1]; DB['family_settings'][uid]=o['pin_hash']; return {'data':None,'error':None}
        h=DB['family_settings'].get(uid); return {'data':{'pin_hash':h} if h else None,'error':None}
    return {'error':{'message':'unknown'}}

ANSWER = """() => { const R = window.__mathelix.round(); const t = R.cur.task;
  if (t.choices) return {choice: t.correct};
  const fmt = window.Mathelix.util.fmt;
  return {vals: t.fields.map(f => 'fixed' in f ? null : Array.isArray(f.answer) ? f.answer.join('*') : fmt(f.answer).replace(/\\u202F/g,''))}; }"""
async def round_(pg, topic):
    await pg.click('[data-go="home"]') if await pg.query_selector('[data-go="home"].x') else None
    await pg.click(f'[data-topic="{topic}"]')
    for k in range(8):
        a=await pg.evaluate(ANSWER)
        if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
        else:
            ins=await pg.query_selector_all('.answer input')
            for el,v in zip(ins,[v for v in a['vals'] if v is not None]): await el.fill(v)
            await pg.click('#checkB')
        await pg.click('#nextB')
async def state(pg): return await pg.evaluate("()=>JSON.parse(localStorage.getItem('mathelix.v1'))")
async def device(b, name):
    ctx=await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
    await ctx.expose_function('__srv', lambda op,args: json.dumps(handle(op,args)))
    await ctx.add_init_script(MOCK)
    pg=await ctx.new_page(); pg.errs=[]
    pg.on('pageerror', lambda e: pg.errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and pg.errs.append(m.text))
    await pg.goto(URL); await pg.wait_for_timeout(300)
    return pg
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**CHROME, args=['--no-sandbox'])
        A=await device(b,'A')
        await A.fill('#nameI','Max'); await A.click('#nameF button')
        await round_(A,'k5-runden'); await A.click('[data-go="home"]')
        await A.click('[data-go="parents"]'); await A.wait_for_timeout(300)
        await A.screenshot(path=f'{SHOTS}/s1_login.png', full_page=True)
        await A.fill('input[name=email]','papa@example.de'); await A.fill('input[name=pw]','geheim123')
        await A.click('button[data-signup]'); await A.wait_for_timeout(600)
        await A.screenshot(path=f'{SHOTS}/s2_profiles.png', full_page=True)
        await A.click('form[data-syncform=newprofile] button'); await A.wait_for_timeout(800)
        await A.screenshot(path=f'{SHOTS}/s3_bound.png', full_page=True)
        await A.click('.pindet summary'); await A.fill('form[data-syncform=setpin] input','1234'); await A.click('form[data-syncform=setpin] button'); await A.wait_for_timeout(400)
        await A.click('[data-go="home"]'); await A.wait_for_timeout(200)
        await A.click('[data-ava]'); await A.wait_for_timeout(200)
        await A.screenshot(path=f'{SHOTS}/av_picker.png')
        await A.click('.ldx-fig[data-fig="eule"]'); await A.click('.ldx-col[data-col="lila"]'); await A.click('.ldx-done'); await A.wait_for_timeout(500)
        print('server avatar:', DB['profiles'][0].get('avatar'))
        await A.click('[data-go="parents"]'); await A.wait_for_timeout(300)
        print('A progress on server:', list(DB['progress'].values())[0]['state']['stats'].keys())
        B=await device(b,'B')
        await B.fill('#nameI','Papa'); await B.click('#nameF button')
        await B.click('[data-go="parents"]'); await B.wait_for_timeout(300)
        await B.fill('input[name=email]','papa@example.de'); await B.fill('input[name=pw]','falsch'); await B.click('form[data-syncform=login] button.pri'); await B.wait_for_timeout(300)
        print('B wrong pw msg:', await B.inner_text('.syncerr'))
        await B.fill('input[name=pw]','geheim123'); await B.click('form[data-syncform=login] button.pri'); await B.wait_for_timeout(800)
        await B.screenshot(path=f'{SHOTS}/s_dbg.png', full_page=True)
        print('B card:', (await B.inner_text('#synccard'))[:300])
        await B.fill('form[data-syncform=unlock] input','9999'); await B.click('form[data-syncform=unlock] button'); await B.wait_for_timeout(300)
        print('B wrong pin msg:', await B.inner_text('.syncerr'))
        await B.fill('form[data-syncform=unlock] input','1234'); await B.click('form[data-syncform=unlock] button'); await B.wait_for_timeout(600)
        await B.screenshot(path=f'{SHOTS}/s4_B_profiles.png', full_page=True)
        await B.click('[data-sync=bind]'); await B.wait_for_timeout(800)
        print('B avatar:', await B.evaluate("()=>localStorage.getItem('lerndax.avatar')"))
        sB=await state(B); print('B has runden:', 'k5-runden' in sB['stats'], 'name', sB['name'])
        await B.screenshot(path=f'{SHOTS}/s5_B_bound.png', full_page=True)
        await B.click('[data-go="home"]'); await round_(B,'k5-kuerzen'); await B.wait_for_timeout(3200)
        print('server has kuerzen:', 'k5-kuerzen' in list(DB['progress'].values())[0]['state']['stats'])
        await A.click('[data-sync=now]'); await A.wait_for_timeout(800)
        sA=await state(A); print('A got kuerzen:', 'k5-kuerzen' in sA['stats'], '| A total', sA['total'], 'B total', (await state(B))['total'])
        import datetime; heute=datetime.date.today().isoformat()
        print('tagesziel synced:', (sA.get('rounds') or {}).get(heute, 0) >= 1, '| B rounds', (await state(B)).get('rounds'))
        if not (sA.get('rounds') or {}).get(heute, 0) >= 1: A.errs.append('Tagesziel nicht synchronisiert')
        await A.click('[data-go="home"]'); await A.wait_for_timeout(200)
        await A.screenshot(path=f'{SHOTS}/s6_A_home.png')
        # Trainingsseite (?t=…): angemeldet wird dort genauso synchronisiert
        await B.goto(URL + '?t=mathe-2026-11-24'); await B.wait_for_timeout(600)
        await round_(B,'k5-potenz'); await B.wait_for_timeout(3200)
        print('training synced:', 'k5-potenz' in list(DB['progress'].values())[0]['state']['stats'], '| syncpill:', bool(await B.query_selector('#syncpill')))
        await B.goto(URL); await B.wait_for_timeout(600)
        # nach dem Neuladen ist der Elternbereich wieder gesperrt: PIN eingeben
        await B.click('[data-go="parents"]'); await B.wait_for_timeout(300)
        if await B.query_selector('form[data-syncform=unlock]'):
            await B.fill('form[data-syncform=unlock] input','1234'); await B.click('form[data-syncform=unlock] button'); await B.wait_for_timeout(500)
        # Reset auf B, Abgleich auf A
        await B.click('[data-go="home"]'); await B.click('[data-go="parents"]'); await B.wait_for_timeout(300)
        await B.click('[data-reset=ask]'); await B.click('[data-reset=yes]'); assert await B.query_selector('#resetWord'), 'ohne das Wort darf nichts gelöscht werden'; await B.fill('#resetWord', 'löschen'); await B.click('[data-reset=yes]'); await B.wait_for_timeout(3300)
        await A.click('[data-go="parents"]'); await A.wait_for_timeout(200); await A.click('[data-sync=now]'); await A.wait_for_timeout(800)
        print('A after reset stats:', len((await state(A))['stats']))
        print('errors A', A.errs, 'B', B.errs)
        await b.close()
asyncio.run(main())
