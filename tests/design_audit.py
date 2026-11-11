# Design-Prüfung: geht alle Ansichten auf vier Bildschirmgrößen durch (320, 390, 768, 1280 px) und meldet
#  Überlauf über den Rand, abgeschnittenen Text, schwachen Kontrast, zu kleine Schrift und zu kleine Tippflächen.
#  Bildschirmfotos landen in tests/shots/audit/. Sterne (Deko) und das orange „Dax“ im Logo werden bewusst gemeldet und sind in Ordnung.
#  Aufruf: python3 tests/design_audit.py
import asyncio,pathlib,json,sys
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent; OUT=ROOT/'tests'/'shots'/'audit'; M=(ROOT/'web').as_uri()+'/mathe/index.html'; HUB=(ROOT/'web').as_uri()+'/index.html'
ANSWER=open(ROOT/'tests/sync_test.py').read().split('ANSWER = """')[1].split('"""')[0]
CHECK=r"""(()=>{
 const out=[]; const vw=document.documentElement.clientWidth;
 if(document.documentElement.scrollWidth>vw+1) out.push('SEITE breiter als Bildschirm: '+document.documentElement.scrollWidth+' > '+vw);
 const lum=c=>{const m=c.match(/[\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return [.2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2]),m[3]===undefined?1:m[3]]};
 const bgOf=e=>{while(e){const cs=getComputedStyle(e);const b=cs.backgroundColor;if(b&&!/rgba\(0, 0, 0, 0\)|transparent/.test(b)){const l=lum(b);if(l[1]>.9)return b}; if(cs.backgroundImage!=='none')return null; e=e.parentElement}return 'rgb(251,246,238)'};
 const seen=new Set();
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('svg')||e.closest('.pview.aus')) continue; const r=e.getBoundingClientRect(); if(!r.width||!r.height) continue; const cs=getComputedStyle(e); if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<.05) continue;
  const name=(e.className&&typeof e.className==='string'?e.tagName.toLowerCase()+'.'+e.className.split(' ')[0]:e.tagName.toLowerCase());
  if(r.right>vw+1||r.left<-1){ if(!e.closest('.confetti')&&!seen.has('o'+name)){seen.add('o'+name);out.push('RAGT RAUS: '+name+' '+Math.round(r.left)+'..'+Math.round(r.right))}}
  const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim()).map(n=>n.nodeValue.trim()).join(' ');
  if(own){
   if(e.scrollWidth>e.clientWidth+2&&cs.overflow!=='visible'&&!seen.has('c'+name)){seen.add('c'+name);out.push('TEXT ABGESCHNITTEN: '+name+' "'+own.slice(0,30)+'"')}
   const bg=bgOf(e); if(bg){const a=lum(cs.color),b=lum(bg);const L1=Math.max(a[0],b[0]),L2=Math.min(a[0],b[0]);const cr=(L1+.05)/(L2+.05);const fs=parseFloat(cs.fontSize);const big=fs>=24||(fs>=18.5&&+cs.fontWeight>=700);
    if(cr<(big?3:4.5)&&!e.closest('[disabled]')&&!seen.has('k'+name+cs.color)){seen.add('k'+name+cs.color);out.push('KONTRAST '+cr.toFixed(1)+': '+name+' "'+own.slice(0,28)+'" '+cs.color+' auf '+bg+' ('+Math.round(fs)+'px)')}}
   if(parseFloat(cs.fontSize)<12&&!seen.has('f'+name)){seen.add('f'+name);out.push('SCHRIFT KLEIN '+cs.fontSize+': '+name+' "'+own.slice(0,25)+'"')}
  }
  if((e.tagName==='BUTTON'||e.tagName==='A'||e.tagName==='SUMMARY')&&(r.width<36||r.height<36)&&!seen.has('t'+name)){seen.add('t'+name);out.push('TIPPFLÄCHE KLEIN '+Math.round(r.width)+'x'+Math.round(r.height)+': '+name+' "'+(e.textContent||'').trim().slice(0,20)+'"')}
 }
 return out})()"""
async def run(b,w,h,tag,rep):
    ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=1); pg=await ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    async def chk(n,full=True):
        await pg.screenshot(path=str(OUT/f'{tag}_{n}.png'),full_page=full)
        for x in await pg.evaluate(CHECK): rep.setdefault(x,[]).append(f'{tag}/{n}')
    await pg.goto(HUB); await pg.wait_for_timeout(500); await chk('00_hub_neu')
    await pg.goto(M); await pg.wait_for_timeout(500); await chk('01_willkommen')
    await pg.fill('#nameI','Maximilian-Leon'); await pg.click('#nameF button'); await pg.wait_for_timeout(500); await chk('02_avatar',False)
    await pg.click('.ldx-ov button:has-text("Fertig")'); await pg.wait_for_timeout(300); await chk('03_start')
    for topic,nm in [('k5-vorrang','a'),('k5-text','b'),('k5-schriftlich','c'),('k5-symmetrie','d'),('k5-netze','e'),('k5-gemischt','f'),('k5-fermi','g'),('k5-ueberschlag','i')]:
        if not await pg.query_selector(f'[data-topic="{topic}"]'): continue
        await pg.click(f'[data-topic="{topic}"]'); await pg.wait_for_timeout(300)
        tb=await pg.query_selector('button:has-text("Tipp")')
        if tb: await tb.click()
        await chk('04_aufgabe_'+nm)
        ins=await pg.query_selector_all('.answer input')
        if ins:
            for el in ins: await el.fill('1')
            await pg.click('#checkB'); await pg.wait_for_timeout(200)
            ins=await pg.query_selector_all('.answer input:not([disabled]):not([readonly])')
            for el in ins: await el.fill('2')
            if await pg.query_selector('#checkB'): await pg.click('#checkB')
        else: await pg.click('[data-choice]')
        await pg.wait_for_timeout(300); await chk('05_falsch_'+nm)
        ex=await pg.query_selector('.fb [data-explain], [data-explain]')
        if ex and nm=='a': await ex.click(); await pg.wait_for_timeout(2500); await chk('06_erklaerung',False); await pg.click('[data-exclose]')
        await pg.goto(M); await pg.wait_for_timeout(300)
    await pg.click('[data-topic="k5-runden"]')
    for k in range(8):
        a=await pg.evaluate(ANSWER)
        if 'choice' in a: await pg.click(f'[data-choice="{a["choice"]}"]')
        else:
            ins=await pg.query_selector_all('.answer input')
            for el,v in zip(ins,[v for v in a['vals'] if v is not None]): await el.fill(v)
            await pg.click('#checkB')
        if k==0: await pg.wait_for_timeout(200); await chk('08_richtig')
        if k==7: await pg.evaluate("(()=>{const r=window.__mathelix.round().results; [1,1,0.5,1,0,1,0.5,0].forEach((v,i)=>r[i]=v)})()")
        await pg.click('#nextB')
    await pg.wait_for_timeout(2600); await chk('09_lob')
    await pg.click('[data-go="home"]'); await pg.wait_for_timeout(200); await chk('10_start_danach')
    await pg.click('[data-explain="pythagoras"]'); await pg.wait_for_timeout(3200); await chk('11_entdecken',False); await pg.click('[data-exclose]')
    await pg.click('[data-go="parents"]'); await pg.wait_for_timeout(300); await chk('12_eltern')
    await pg.click('[data-ptab=konto]'); await pg.wait_for_timeout(300); await chk('13_konto')
    await pg.click('[data-reset=ask]'); await pg.wait_for_timeout(200); await chk('14_reset')
    await pg.goto(M+'?t=mathe-2026-11-24'); await pg.wait_for_timeout(500); await chk('15_training')
    await pg.goto(HUB); await pg.wait_for_timeout(500); await chk('16_hub')
    for e in errs: rep.setdefault('JS-FEHLER: '+e,[]).append(tag)
    await ctx.close()
import traceback
async def main():
    OUT.mkdir(parents=True,exist_ok=True); rep={}
    async with async_playwright() as p:
        import os
        b=await p.chromium.launch(args=['--no-sandbox'], **({'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}))
        for w,h,t in [(320,568,'s'),(390,780,'h'),(768,1024,'t'),(1280,800,'p')]:
            try: await run(b,w,h,t,rep)
            except Exception as e:
                traceback.print_exc(limit=3)
                rep.setdefault('ABBRUCH '+t+': '+str(e)[:200],[]).append(t)
        await b.close()
    for k,v in sorted(rep.items()): print(k,'|',','.join(sorted(set(x.split('/')[0] for x in v))),'|',(v[0].split('/')+[''])[1], f'(+{len(v)-1})' if len(v)>1 else '')
asyncio.run(main())
