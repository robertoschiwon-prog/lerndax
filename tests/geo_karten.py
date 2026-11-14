"""GeoDax: Kartendaten bauen (Werkzeug, kein Test).

Liest die freien Kartendaten von Natural Earth (gemeinfrei, https://www.naturalearthdata.com, Kopie auf GitHub
nvkelso/natural-earth-vector) und schreibt vereinfachte Umrisse als Längen/Breiten in web/geografie/karten/daten.js.
Die App rechnet daraus selbst die Karten (Weltkarte, Deutschland mit Nachbarn, Bundesländer, Sachsen).

Aufruf: python3 tests/geo_karten.py [Ordner mit den GeoJSON-Dateien]
Fehlende Dateien werden von GitHub geladen (raw.githubusercontent.com). Braucht: pip install shapely
"""
import json, os, sys, pathlib, urllib.request
from shapely.geometry import shape, box, mapping, LineString, MultiLineString, Polygon, MultiPolygon
from shapely.ops import unary_union

ROOT = pathlib.Path(__file__).resolve().parent.parent
QUELLE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/home/claude/kartendaten')
URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
ZIEL = ROOT / 'web' / 'geografie' / 'karten' / 'daten.js'

def lade(name):
    p = QUELLE / f'{name}.geojson'
    if not p.exists():
        QUELLE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(URL + p.name, p)
    return json.load(open(p))['features']

def ringe(geom, nk=2, min_flaeche=0.0):
    """Polygon(e) → Liste von Ringen [lon,lat,lon,lat,…] (nur Außenringe, kleine Inseln weg)."""
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, 'geoms', []))
    out = []
    for p in polys:
        if p.is_empty or p.area < min_flaeche: continue
        xy = []
        for x, y in p.exterior.coords: xy += [round(x, nk), round(y, nk)]
        out.append(xy)
    return out

def linien(geom, nk=2):
    ls = [geom] if isinstance(geom, LineString) else list(getattr(geom, 'geoms', []))
    out = []
    for l in ls:
        if l.is_empty or len(l.coords) < 2: continue
        xy = []
        for x, y in l.coords: xy += [round(x, nk), round(y, nk)]
        out.append(xy)
    return out

daten = {}

# ---------------------------------------------------------------- Welt: Kontinente (Russland am Ural geteilt, ~60° O)
laender = lade('ne_110m_admin_0_countries')
KONT = {'Africa': 'Afrika', 'Antarctica': 'Antarktis', 'Asia': 'Asien', 'Europe': 'Europa', 'North America': 'Nordamerika', 'Oceania': 'Australien', 'South America': 'Südamerika'}
teile = {k: [] for k in KONT.values()}
for f in laender:
    k = KONT.get(f['properties']['CONTINENT'])
    if not k: continue
    g = shape(f['geometry']).buffer(0)
    if f['properties']['ADM0_A3'] == 'RUS':
        teile['Europa'].append(g.intersection(box(-180, -90, 60, 90)))
        teile['Asien'].append(g.difference(box(-180, -90, 60, 90)))
    else:
        teile[k].append(g)
daten['welt'] = {k: ringe(unary_union(v).buffer(0.25).buffer(-0.25).simplify(0.35), 1, 0.8) for k, v in teile.items()}
# Grönland und Afrika genauer (für „Karten schummeln“)
l50 = lade('ne_50m_admin_0_countries')
gr = [shape(f['geometry']) for f in l50 if f['properties']['ADM0_A3'] == 'GRL']
daten['groenland'] = ringe(unary_union(gr).simplify(0.25), 1, 3)

# ---------------------------------------------------------------- Deutschland mit Nachbarn (Ausschnitt Mitteleuropa)
AUS = box(1.0, 44.6, 21.5, 57.6)
NAMEN = {'DEU': 'Deutschland', 'DNK': 'Dänemark', 'NLD': 'Niederlande', 'BEL': 'Belgien', 'LUX': 'Luxemburg', 'FRA': 'Frankreich', 'CHE': 'Schweiz', 'AUT': 'Österreich', 'CZE': 'Tschechien', 'POL': 'Polen',
         'ITA': 'Italien', 'SVK': 'Slowakei', 'HUN': 'Ungarn', 'SVN': 'Slowenien', 'GBR': 'Großbritannien', 'SWE': 'Schweden', 'LIE': 'Liechtenstein', 'LTU': 'Litauen', 'RUS': 'Russland', 'HRV': 'Kroatien', 'NOR': 'Norwegen', 'UKR': 'Ukraine', 'BLR': 'Belarus'}
daten['europa'] = {}
for f in l50:
    a3 = f['properties']['ADM0_A3']
    if a3 not in NAMEN: continue
    g = shape(f['geometry']).buffer(0).intersection(AUS)
    if g.is_empty: continue
    daten['europa'][NAMEN[a3]] = ringe(g.simplify(0.03), 2, 0.004)

# ---------------------------------------------------------------- Bundesländer
adm1 = lade('ne_10m_admin_1_states_provinces')
de = [f for f in adm1 if f['properties'].get('iso_a2') == 'DE']
daten['laender'] = {}
for f in de:
    n = f['properties']['name']
    daten['laender'][n] = ringe(shape(f['geometry']).buffer(0).simplify(0.012), 2, 0.0004)

# ---------------------------------------------------------------- Sachsen und Umgebung (genauer)
SAUS = box(11.2, 49.95, 15.5, 51.95)
daten['sachsen'] = {}
for f in de:
    n = f['properties']['name']
    g = shape(f['geometry']).buffer(0).intersection(SAUS)
    if not g.is_empty: daten['sachsen'][n] = ringe(g.simplify(0.004), 3, 0.0004)
l10 = lade('ne_10m_admin_0_countries')
for f in l10:
    a3 = f['properties']['ADM0_A3']
    if a3 in ('POL', 'CZE'):
        g = shape(f['geometry']).buffer(0).intersection(SAUS)
        if not g.is_empty: daten['sachsen'][NAMEN[a3]] = ringe(g.simplify(0.004), 3, 0.0004)

# ---------------------------------------------------------------- Flüsse
FLUSS = {'Rhine': 'Rhein', 'Rhein': 'Rhein', 'Elbe': 'Elbe', 'Danube': 'Donau', 'Donau': 'Donau', 'Weser': 'Weser', 'Oder': 'Oder', 'Main': 'Main', 'Ems': 'Ems', 'Inn': 'Inn',
         'Saale': 'Saale', 'Spree': 'Spree', 'Neckar': 'Neckar', 'Isar': 'Isar', 'Zwickauer Mulde': 'Mulde', 'Weisse Elster': 'Weiße Elster', 'Schwarze Elster': 'Schwarze Elster',
         'Luzicka Nisa': 'Neiße', 'Ruhr': 'Ruhr', 'Lippe': 'Lippe', 'Fulda': 'Fulda', 'Unstrut': 'Unstrut', 'Aller': 'Aller', 'Regnitz': 'Regnitz'}
DEAUS = box(5.5, 47.0, 15.5, 55.2)
fl = {}
for f in lade('ne_10m_rivers_lake_centerlines') + lade('ne_10m_rivers_europe'):
    n = FLUSS.get(f['properties'].get('name'))
    if not n or not f['geometry']: continue
    g = shape(f['geometry']).intersection(DEAUS)
    if not g.is_empty: fl.setdefault(n, []).append(g)
daten['fluesse'] = {n: linien(unary_union(v).simplify(0.01), 2) for n, v in fl.items()}

# ---------------------------------------------------------------- Seen in Deutschland (Bodensee, Müritz …)
seen = []
for f in lade('ne_10m_lakes') + lade('ne_10m_lakes_europe'):
    g = shape(f['geometry']).buffer(0)
    if g.intersects(DEAUS) and g.area > 0.004: seen += ringe(g.intersection(DEAUS).simplify(0.008), 2, 0.002)
daten['seen'] = seen

js = ('/* GeoDax – Kartendaten (erzeugt von tests/geo_karten.py, nicht von Hand ändern)\n'
      ' * Quelle: Natural Earth (gemeinfrei), https://www.naturalearthdata.com – vereinfacht.\n'
      ' * Ringe und Linien als [Länge, Breite, Länge, Breite, …] in Grad.\n */\n'
      'window.GeoDaxKartendaten = ' + json.dumps(daten, ensure_ascii=False, separators=(',', ':')) + ';\n')
ZIEL.parent.mkdir(parents=True, exist_ok=True)
ZIEL.write_text(js)
print(ZIEL, len(js) // 1024, 'KB')
for k, v in daten.items(): print(k, len(json.dumps(v)) // 1024, 'KB', list(v)[:30] if isinstance(v, dict) else len(v))
