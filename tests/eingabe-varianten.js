const fs=require('fs');
const src=fs.readFileSync(''+__dirname+'/../web/plattform/fach.js','utf8');
const i=src.indexOf('  function parseNumTeil'), j=src.indexOf('  const cleanTok');
const U={fmt:(x)=>String(x)}; const T=(new Function('U', src.slice(i,j)+'\nreturn {parseNum:(v,f)=>parseNum(numRoh(v,f||{})),alt:(v,f)=>parseNumPunkt(numRoh(v,f||{})),parseFactors,textOk,textFast,near};'))(U);
const {parseNum,alt,textOk,textFast,near}=T;
let n=0, bad=[], lax=[];
const fmtDE=(v)=>String(v).replace('.',',');
for (const F of ['mathe','deutsch','englisch','geografie','geschichte','bio','technik']) {
  const r=JSON.parse(fs.readFileSync(`/tmp/lerndax-eing/${F}.json`,'utf8'));
  for (const g of r) for (const e of g.ex) { if (e.kind!=='fields') continue;
    for (const f of e.fields) { if (f.fixed!==undefined && f.fixed!==null) continue;
      const id=`${F} ${e.topic} „${e.prompt.slice(0,50)}“`;
      if (f.type==='text') { const A=[].concat(f.answer).map(String);
        for (const a of A) { const V=[a, a+'.', '  '+a+' ', '„'+a+'“', a+'!'];
          if (f.prefix) V.push(f.prefix+' '+a); if (f.suffix) V.push(a+' '+f.suffix); if (f.prefix&&f.suffix) V.push(f.prefix+' '+a+' '+f.suffix);
          if (f.nach) V.push(a+' '+f.nach); if (f.vor) V.push('the '+a,'a '+a,'to '+a);
          if (f.ci) V.push(a.toLocaleUpperCase('de').replace(/SS/g,'ß').toLocaleUpperCase('de')===a.toLocaleUpperCase('de')?a[0].toUpperCase()+a.slice(1):a, a[0].toUpperCase()+a.slice(1));
          for (const v of V) { n++; if (!textOk(v,f)) bad.push(`${id}: „${v}“ sollte richtig sein (Antwort ${a})`); } }
        const a=A[0];
        for (const v of [a+'xx','qqq',(f.prefix||'')+' ', a.split('').reverse().join('')+'q']) { n++; if (v.trim() && (textOk(v,f)||textFast(v,f))) lax.push(`${id}: „${v}“ wird angenommen (Antwort ${A.join('/')})`); }
        if (!f.ci && /[a-zäöü]/i.test(a[0])) { const v=(a[0]===a[0].toUpperCase()?a[0].toLowerCase():a[0].toUpperCase())+a.slice(1); n++; if (textOk(v,f)) lax.push(`${id}: Groß/klein egal? „${v}“`); }
      } else if (f.type==='num') { const a=Number(f.answer); if (Number.isNaN(a)) { bad.push(id+' Antwort keine Zahl: '+f.answer); continue; }
        const V=[String(a), (f.prefix||'')+' '+fmtDE(a)+' '+(f.suffix||''), fmtDE(a), fmtDE(a)+' '+(f.suffix||'cm'), fmtDE(a)+'.', '= '+fmtDE(a), '3 + 4 = '+fmtDE(a), fmtDE(a)+' = 3 + 4', 'x = '+fmtDE(a), ' '+fmtDE(a)+' ', fmtDE(a)+' v. Chr.', 'ca. '+fmtDE(a)];
        if (Number.isInteger(a) && Math.abs(a)>=1000) V.push(String(a).replace(/\B(?=(\d{3})+(?!\d))/g,'.'), String(a).replace(/\B(?=(\d{3})+(?!\d))/g,' '));
        if (Number.isInteger(a)) V.push(a+',0');
        for (const v of V) { n++; if (!near(parseNum(v,f),a) && !near(alt(v,f),a)) bad.push(`${id}: „${v}“ → ${parseNum(v,f)} statt ${a}`); }
        for (const v of [fmtDE(a+1), '', 'abc', fmtDE(a)+'5', '3 m 50 cm']) { n++; if (near(parseNum(v,f),a)||near(alt(v,f),a)) lax.push(`${id}: „${v}“ wird als ${a} gelesen`); }
      } } } }
console.log('geprüft', n, '| richtig abgelehnt:', bad.length, '| falsch angenommen:', lax.length);
const uniq=(x)=>[...new Set(x)]; console.log(uniq(bad).slice(0,40).join('\n')); console.log('---'); console.log(uniq(lax).slice(0,40).join('\n'));
