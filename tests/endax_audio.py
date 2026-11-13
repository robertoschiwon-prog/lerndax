"""EnDax: Aufnahmen für alle festen englischen Sätze erzeugen und in Sammeldateien packen.

  web/englisch/audio/us/   amerikanisch, Kokoro „af_bella“ („Frau B“ der Hörprobe), Voreinstellung
  web/englisch/audio/gb/   britisch, Kokoro „bm_fable“ („Mann 2“ der Hörprobe)
In jedem Ordner:  index.json  { clips: { name: [paket, start, laenge] } }
                  <thema>.bin alle MP3 eines Themas hintereinander (ein Text, der in mehreren Themen vorkommt, liegt beim ersten)
Die App (web/plattform/fach.js) lädt das Paket eines Themas und schneidet die Aufnahme heraus.

Kokoro v1.0 ist eine freie Sprachausgabe (Apache-2.0), Tempo 0.9. Beide Stimmen hat der Auftraggeber nach Hörprobe
ausgewählt (12./13.11.2026). Die Stimme des Geräts (Browser) wurde abgelehnt.

Aufruf:  python3 tests/endax_audio.py [Ordner mit den Modell-Dateien] [--alle] [--mp3 us=<Ordner> gb=<Ordner>]
  Vorhandene Aufnahmen werden aus den Sammeldateien übernommen, nur fehlende werden neu erzeugt (dafür braucht es den
  Modell-Ordner). Ohne Modell-Ordner wird nur geprüft und neu gepackt. --alle erzeugt alles neu.
  --mp3 übernimmt einzelne MP3-Dateien <name>.mp3 aus einem Ordner (so wurde bei der Umstellung in v59 gepackt).
Einmalig einrichten (liegt absichtlich nicht im Repository, zusammen ca. 350 MB):
  pip install kokoro-onnx soundfile        und ffmpeg
  kokoro-v1.0.onnx und voices-v1.0.bin von github.com/thewh1teagle/kokoro-onnx (Releases, model-files-v1.0)
Die Liste der Sätze kommt aus EnDax.audioThemen() in web/englisch/themen/klasse5.js."""
import pathlib, subprocess, sys, json, re, tempfile, os
ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / 'web' / 'englisch' / 'audio'
SPEED = 0.9
STIMMEN = [('us', 'af_bella', 'en-us'), ('gb', 'bm_fable', 'en-gb')]   # Ordner, Stimme, Sprache
JS = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.EnDax.audioThemen()))"

def slug(t):   # gleiche Regel wie U.slug in web/englisch/themen/klasse5.js
    return re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', re.sub(r"[’']", '-', t.lower())))

def themen():
    return json.loads(subprocess.run(['node', '-e', JS, str(ROOT / 'web/englisch/themen/klasse5.js')], capture_output=True, text=True, check=True).stdout)

def lies_pakete(ordner):
    """vorhandene Aufnahmen aus den Sammeldateien: name → bytes"""
    idx = ordner / 'index.json'
    if not idx.exists(): return {}
    clips = json.loads(idx.read_text(encoding='utf-8'))['clips']; bins = {}; alt = {}
    for name, (paket, start, laenge) in clips.items():
        if paket not in bins: bins[paket] = (ordner / (paket + '.bin')).read_bytes()
        alt[name] = bins[paket][start:start + laenge]
    return alt

def main():
    args = sys.argv[1:]; alle = '--alle' in args
    mp3 = dict(a.split('=', 1) for a in args if re.match(r'^(us|gb)=', a))
    modell = next((pathlib.Path(a) for a in args if not a.startswith('--') and '=' not in a), None)
    plan = themen(); kokoro = None
    for ordner, VOICE, LANG in STIMMEN:
        OUT = AUDIO / ordner; OUT.mkdir(parents=True, exist_ok=True)
        alt = {} if alle else lies_pakete(OUT)
        if ordner in mp3:
            for f in pathlib.Path(mp3[ordner]).glob('*.mp3'): alt.setdefault(f.stem, f.read_bytes())
        clips = {}; neu = 0; gesamt = 0
        for paket, texte in plan.items():
            daten = b''
            for t in texte:
                name = slug(t)
                if name in clips: continue
                b = alt.get(name)
                if b is None:
                    if modell is None: sys.exit(f'Aufnahme fehlt ({ordner}): „{t}“. Bitte mit dem Modell-Ordner aufrufen.')
                    if kokoro is None:
                        import numpy as np, soundfile as sf
                        from kokoro_onnx import Kokoro
                        kokoro = Kokoro(str(modell / 'kokoro-v1.0.onnx'), str(modell / 'voices-v1.0.bin'))
                    s, sr = kokoro.create(t.replace('’', "'"), voice=VOICE, speed=SPEED, lang=LANG)
                    s = np.asarray(s, dtype=np.float32).flatten(); s = s / (float(np.max(np.abs(s))) or 1.0) * 0.89
                    pause = np.zeros(int(sr * 0.12), dtype=np.float32)
                    with tempfile.TemporaryDirectory() as d:
                        wav = os.path.join(d, 'a.wav'); out = os.path.join(d, 'a.mp3'); sf.write(wav, np.concatenate([pause, s, pause]), sr)
                        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '48k', out], check=True)
                        b = open(out, 'rb').read()
                    neu += 1
                clips[name] = [paket, len(daten), len(b)]; daten += b
            ziel = OUT / (paket + '.bin')
            if not ziel.exists() or ziel.read_bytes() != daten: ziel.write_bytes(daten)
            gesamt += len(daten)
        (OUT / 'index.json').write_text(json.dumps({'v': 1, 'stimme': VOICE, 'clips': clips}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        for f in OUT.glob('*.bin'):
            if f.stem not in plan: f.unlink(); print('entfernt:', f.name)
        print(f'{ordner} ({VOICE}): {len(clips)} Aufnahmen in {len(plan)} Paketen, {neu} neu erzeugt, {gesamt // 1024} KB')
if __name__ == '__main__': main()
