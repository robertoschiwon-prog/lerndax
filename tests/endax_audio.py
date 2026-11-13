"""EnDax: Aufnahmen für alle festen englischen Sätze erzeugen, in zwei Aussprachen:
  web/englisch/audio/k5/<slug>.mp3      amerikanisch, Kokoro „af_bella“ („Frau B“ der Hörprobe), Voreinstellung
  web/englisch/audio/k5-gb/<slug>.mp3   britisch, Kokoro „bm_fable“ („Mann 2“ der Hörprobe)
Kokoro v1.0 ist eine freie Sprachausgabe (Apache-2.0), Tempo 0.9. Beide Stimmen hat der Auftraggeber nach Hörprobe
ausgewählt (12./13.11.2026). Die Stimme des Geräts (Browser) wurde abgelehnt.

Einmalig einrichten (liegt absichtlich nicht im Repository, zusammen ca. 350 MB):
  pip install kokoro-onnx soundfile        und ffmpeg
  kokoro-v1.0.onnx und voices-v1.0.bin von github.com/thewh1teagle/kokoro-onnx (Releases, model-files-v1.0)
Aufruf:  python3 tests/endax_audio.py <Ordner mit den beiden Modell-Dateien> [--alle]
Ohne --alle werden nur fehlende Aufnahmen erzeugt. Die Liste der Sätze kommt aus EnDax.audioTexte()."""
import pathlib, subprocess, sys, json, re, tempfile, os
ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / 'web' / 'englisch' / 'audio'
SPEED = 0.9
STIMMEN = [('k5', 'af_bella', 'en-us'), ('k5-gb', 'bm_fable', 'en-gb')]   # Ordner, Stimme, Sprache
JS = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.EnDax.audioTexte()))"

def slug(t):   # gleiche Regel wie U.slug in web/englisch/themen/klasse5.js
    return re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', re.sub(r"[’']", '-', t.lower())))

def texte():
    return json.loads(subprocess.run(['node', '-e', JS, str(ROOT / 'web/englisch/themen/klasse5.js')], capture_output=True, text=True, check=True).stdout)

def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    modell = pathlib.Path(sys.argv[1]); alle = '--alle' in sys.argv
    import numpy as np, soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(str(modell / 'kokoro-v1.0.onnx'), str(modell / 'voices-v1.0.bin'))
    liste = texte(); soll = {slug(t) + '.mp3' for t in liste}
    for ordner, VOICE, LANG in STIMMEN:
        OUT = AUDIO / ordner; OUT.mkdir(parents=True, exist_ok=True); neu = 0
        for t in liste:
            ziel = OUT / (slug(t) + '.mp3')
            if ziel.exists() and not alle: continue
            s, sr = k.create(t.replace('’', "'"), voice=VOICE, speed=SPEED, lang=LANG)
            s = np.asarray(s, dtype=np.float32).flatten(); s = s / (float(np.max(np.abs(s))) or 1.0) * 0.89
            pause = np.zeros(int(sr * 0.12), dtype=np.float32)
            with tempfile.TemporaryDirectory() as d:
                wav = os.path.join(d, 'a.wav'); sf.write(wav, np.concatenate([pause, s, pause]), sr)
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '48k', str(ziel)], check=True)
            neu += 1; print('neu:', ordner, ziel.name)
        uebrig = sorted(p.name for p in OUT.glob('*.mp3') if p.name not in soll)
        print(f'{ordner} ({VOICE}): {len(liste)} Sätze, {neu} neu erzeugt, {sum(p.stat().st_size for p in OUT.glob("*.mp3")) // 1024} KB gesamt')
        if uebrig: print('Nicht mehr gebraucht (bitte prüfen):', ordner, uebrig)
if __name__ == '__main__': main()
