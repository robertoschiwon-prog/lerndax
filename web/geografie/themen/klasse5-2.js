/* GeoDax – Klasse 5, Bereiche 3 bis 5: Deutschland im Überblick, An Nordsee- und Ostseeküste, Im Tiefland
 * (Lehrplan LB 2–4; TERRA Geographie 5 Sachsen, S. 44–117). Texte selbst geschrieben, Fakten nachgeschlagen (faecher/geo/fakten.md).
 */
(function () {
  const D = window.GeoDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;
  const LAND = Object.keys(D.LAENDER);
  const GROSS = ['Rhein', 'Elbe', 'Donau', 'Weser', 'Oder', 'Main', 'Ems', 'Saale', 'Spree', 'Neckar', 'Isar', 'Inn', 'Mulde', 'Neiße'];

  // =====================================================
  // Bereich 3: Deutschland im Überblick
  // =====================================================
  G.deLage = baue('geo5-de-lage', {
    h: 'Deutschland liegt in der Mitte Europas: im Norden Nord- und Ostsee, im Süden die Alpen. Rund 83,5 Millionen Menschen leben hier.',
    F: [
      { f: 'Wo in Europa liegt Deutschland?', a: 'in der Mitte Europas', x: ['ganz im Norden Europas', 'ganz im Süden am Mittelmeer', 'im äußersten Westen am Atlantik'], w: 'Darum hat Deutschland so viele Nachbarländer wie kein anderes Land der EU.' },
      { f: 'An welche Meere grenzt Deutschland?', a: 'an Nordsee und Ostsee', x: ['an Mittelmeer und Atlantik', 'nur an die Nordsee', 'an gar kein Meer'], w: 'Die Nordsee liegt im Nordwesten, die Ostsee im Nordosten.' },
      { f: 'Welches Hochgebirge liegt im <b>Süden</b> Deutschlands?', a: 'die Alpen', x: ['der Harz', 'das Erzgebirge', 'der Schwarzwald'], w: 'In den Alpen liegt die Zugspitze, Deutschlands höchster Berg (2962 m).' },
      { f: 'Wie viele Menschen leben ungefähr in Deutschland?', a: 'rund 83,5 Millionen', x: ['rund 8 Millionen', 'rund 830 Millionen', 'rund 35 Millionen'], w: 'Stand Ende 2025 (Statistisches Bundesamt).' },
      { f: 'Wie weit ist Deutschland von Norden nach Süden ungefähr (Luftlinie)?', a: 'rund 880 km (876 km)', x: ['rund 88 km', 'rund 3000 km', 'rund 300 km'], w: 'Von West nach Ost sind es rund 640 km.' },
      { f: 'Wie groß ist Deutschland ungefähr?', a: 'rund 358 000 km²', x: ['rund 18 000 km²', 'rund 3,5 Millionen km²', 'rund 35 000 km²'], w: 'Sachsen ist mit rund 18 450 km² etwa ein Zwanzigstel davon.' },
      { f: 'Wie heißt die <b>Hauptstadt</b> Deutschlands?', a: 'Berlin', x: ['Bonn', 'Dresden', 'Frankfurt am Main'], w: 'Berlin ist zugleich ein Bundesland.' },
      { f: 'Welcher Ort liegt am weitesten im <b>Osten</b> Deutschlands?', a: 'Neißeaue bei Görlitz (Sachsen)', x: ['List auf Sylt', 'Oberstdorf', 'Selfkant bei Aachen'], w: 'Ganz im Norden liegt List auf Sylt, im Süden Oberstdorf, im Westen Selfkant.' },
    ],
    T: [{ f: 'Deutschland liegt in der Mitte von ___.', a: 'Europa', w: 'Mitteleuropa.' }],
    extra: {
      masse: () => {
        const paare = [['Leipzig', 'Dresden'], ['Dresden', 'Görlitz'], ['Berlin', 'Dresden'], ['Hamburg', 'München'], ['Köln', 'Berlin'], ['Kiel', 'Hannover']], [a, b] = pick(paare);
        const A = D.DE_STAEDTE[a], B = D.DE_STAEDTE[b], km = Math.round(Math.hypot((B[0] - A[0]) * 111.32 * Math.cos((A[1] + B[1]) / 2 * Math.PI / 180), (B[1] - A[1]) * 111.2) / 10) * 10;
        const ok = `etwa ${km} km`, fal = [km * 2, Math.round(km / 2 / 10) * 10, km + 300].map((x) => `etwa ${x} km`), ch = shuffle([ok, ...fal]);
        const fig = window.GeoKarte.deutschland({ orte: [[a, ...A], [b, ...B]], massstab: true });
        return { prompt: `Schätze mit der Maßstabsleiste: Wie weit ist es (Luftlinie) von <b>${a}</b> nach <b>${b}</b>?`, figure: fig, choices: ch, correct: ch.indexOf(ok), hint: 'Die Leiste unten links ist 100 km lang. Wie oft passt sie zwischen die beiden Orte?',
          solution: `Luftlinie <b>${ok}</b>.`, ex: { mode: 'karte', nach: false, art: 'masse', q: `${a} – ${b}?`, opts: [ok], ok: 0, svg: D.karte('deutschland', { orte: [[a, ...A], [b, ...B]], massstab: true }), merk: `<b>${ok}</b>: Strecke mit der Maßstabsleiste vergleichen.` } };
      },
    },
  }, { masse: 22 });

  G.nachbarn = baue('geo5-nachbarn', {
    h: 'Deutschland hat neun Nachbarn: Dänemark (N), Polen und Tschechien (O), Österreich und Schweiz (S), Frankreich, Luxemburg, Belgien und Niederlande (W).',
    F: [
      { f: 'Wie viele <b>Nachbarstaaten</b> hat Deutschland?', a: '9', x: ['5', '7', '12'], w: 'So viele hat kein anderes Land der EU.' },
      { f: 'Welches Nachbarland liegt im <b>Norden</b>?', a: 'Dänemark', x: ['Schweden', 'Norwegen', 'Polen'], w: 'Die Grenze zu Dänemark ist die kürzeste, nur rund 67 km.' },
      { f: 'Welche zwei Nachbarländer grenzen an <b>Sachsen</b>?', a: 'Polen und Tschechien', x: ['Österreich und Schweiz', 'Polen und Dänemark', 'Tschechien und Österreich'], w: 'Polen im Osten, Tschechien im Süden.' },
      { f: 'Zu welchem Nachbarland ist die Grenze am <b>längsten</b>?', a: 'Österreich', x: ['Frankreich', 'Polen', 'Dänemark'], w: 'Rund 816 km, knapp vor Tschechien (rund 811 km).' },
      { f: 'Welches Land ist <b>kein</b> Nachbar Deutschlands?', a: 'Italien', x: ['Luxemburg', 'Belgien', 'Tschechien'], w: 'Nach Italien muss man durch Österreich oder die Schweiz.' },
      { f: 'Welcher Fluss bildet ein Stück der Grenze zu <b>Polen</b>?', a: 'die Oder und die Neiße', x: ['der Rhein', 'die Donau', 'die Weser'], w: 'Die Oder-Neiße-Grenze reicht bis nach Sachsen.' },
      { f: 'Welcher Fluss bildet ein Stück der Grenze zu <b>Frankreich</b>?', a: 'der Rhein', x: ['die Elbe', 'die Oder', 'die Spree'], w: 'Am Oberrhein zwischen Basel und Karlsruhe.' },
    ],
    S: { kats: ['Norden', 'Osten', 'Süden', 'Westen'], f: (b) => `In welcher Himmelsrichtung liegt <b>${b}</b> von Deutschland aus?`, h: 'Denk an die Karte: Dänemark oben, Polen rechts, Alpenländer unten, Frankreich und Benelux links.',
      items: [['Dänemark', 0], ['Polen', 1], ['Tschechien', 1], ['Österreich', 2], ['Schweiz', 2], ['Frankreich', 3], ['Luxemburg', 3], ['Belgien', 3], ['Niederlande', 3]] },
    extra: {
      nbTippen: () => U.flaecheTippen('nbTippen', { art: 'europa', namen: D.NACHBARN, frage: (n) => `Wo liegt <b>${n}</b>?`, merk: (n) => `${n} liegt ${D.NACHBAR_LAGE[n]} von Deutschland.`, h: 'Deutschland ist die große Fläche in der Mitte.', opts: { namen: ['Deutschland'] } }),
      nbNennen: () => U.flaecheNennen('nbNennen', { art: 'europa', namen: D.NACHBARN, frage: () => 'Welcher Nachbarstaat ist <b>gelb</b>?', merk: (n) => `${n} liegt ${D.NACHBAR_LAGE[n]} von Deutschland.`, opts: { namen: ['Deutschland'] } }),
    },
  }, { nbTippen: 26, nbNennen: 24, frage: 22, sortieren: 14 });

  const hauptstadtFrage = () => {
    const l = pick(LAND), h = D.LAENDER[l][0], ch = shuffle([h, ...shuffle(LAND.filter((x) => x !== l).map((x) => D.LAENDER[x][0])).slice(0, 3)]);
    return { prompt: `Wie heißt die Landeshauptstadt von <b>${l}</b>?`, choices: ch, correct: ch.indexOf(h), hint: 'Die Landeshauptstadt ist der Sitz der Landesregierung.',
      solution: `${l}: <b>${h}</b>${D.STADTSTAATEN.includes(l) ? ' (Stadtstaat: Stadt und Land zugleich)' : ''}.`,
      ex: { mode: 'karte', nach: false, art: 'hauptstadt', q: `Hauptstadt von ${l}?`, opts: [h], ok: 0, svg: D.karte('deutschland', { hell: l, orte: [[h, D.LAENDER[l][1], D.LAENDER[l][2], { art: 'hauptstadt', lage: D.LAENDER[l][1] > 12.5 ? [-5, 3, 'end'] : [5, 3, 'start'] }]] }), merk: `<b>${h}</b>: Landeshauptstadt von ${l}.` } };
  };
  G.laender = baue('geo5-laender', {
    h: 'Deutschland hat 16 Bundesländer. Drei davon sind Stadtstaaten: Berlin, Hamburg und Bremen. Unsere Landeshauptstadt ist Dresden.',
    F: [
      { f: 'Wie viele <b>Bundesländer</b> hat Deutschland?', a: '16', x: ['12', '20', '9'], w: 'Seit 1990 sind es 16.' },
      { f: 'Welche drei Bundesländer sind <b>Stadtstaaten</b>?', a: 'Berlin, Hamburg und Bremen', x: ['Berlin, München und Köln', 'Hamburg, Kiel und Lübeck', 'Dresden, Leipzig und Chemnitz'], w: 'Bei ihnen ist die Stadt zugleich ein ganzes Bundesland.' },
      { f: 'Welches ist das <b>größte</b> Bundesland?', a: 'Bayern', x: ['Niedersachsen', 'Sachsen', 'Nordrhein-Westfalen'], w: 'Bayern ist fast ein Fünftel von Deutschland.' },
      { f: 'Welches ist das <b>kleinste</b> Bundesland?', a: 'Bremen', x: ['Saarland', 'Berlin', 'Hamburg'], w: 'Bremen hat nur 420 km².' },
      { f: 'Welches Bundesland liegt ganz <b>im Norden</b> und grenzt an Dänemark?', a: 'Schleswig-Holstein', x: ['Mecklenburg-Vorpommern', 'Niedersachsen', 'Hamburg'], w: 'Schleswig-Holstein liegt zwischen Nordsee und Ostsee.' },
      { f: 'Welches Bundesland ist ringsum von <b>Brandenburg</b> umgeben?', a: 'Berlin', x: ['Sachsen', 'Hamburg', 'Bremen'], w: 'Die Landeshauptstadt von Brandenburg ist Potsdam, gleich neben Berlin.' },
      { f: 'Wie heißt die Landeshauptstadt von <b>Sachsen</b>?', a: 'Dresden', x: ['Leipzig', 'Chemnitz', 'Görlitz'], w: 'Leipzig ist die größte Stadt Sachsens, aber Dresden ist Landeshauptstadt.' },
    ],
    T: [{ f: 'Die Landeshauptstadt von Thüringen heißt ___.', a: 'Erfurt', w: 'Erfurt liegt in der Mitte Thüringens.' }, { f: 'Die Landeshauptstadt von Sachsen-Anhalt heißt ___.', a: 'Magdeburg', w: 'Magdeburg liegt an der Elbe.' }],
    extra: {
      landTippen: () => U.flaecheTippen('landTippen', { art: 'deutschland', namen: LAND, frage: (l) => `Wo liegt <b>${l}</b>?`, merk: (l) => `Landeshauptstadt: ${D.LAENDER[l][0]}.`, h: 'Sachsen liegt im Osten an Polen und Tschechien.' }),
      landNennen: () => U.flaecheNennen('landNennen', { art: 'deutschland', namen: LAND, frage: () => 'Welches Bundesland ist <b>gelb</b>?', merk: (l) => `Landeshauptstadt: ${D.LAENDER[l][0]}.` }),
      hauptstadt: hauptstadtFrage,
    },
  }, { landTippen: 26, landNennen: 26, hauptstadt: 26, frage: 18 });

  G.bevoelkerung = baue('geo5-bevoelkerung', {
    h: 'Die Bevölkerungsdichte sagt, wie viele Menschen auf einem Quadratkilometer wohnen: Einwohner geteilt durch Fläche.',
    F: [
      { f: 'Was gibt die <b>Bevölkerungsdichte</b> an?', a: 'wie viele Menschen durchschnittlich auf 1 km² wohnen', x: ['wie viele Menschen in einem Haus wohnen', 'wie dick die Menschen sind', 'wie viele Kinder es gibt'], w: 'Man rechnet: Einwohner : Fläche in km².' },
      { f: 'Wie viele Menschen wohnen in Deutschland durchschnittlich auf 1 km²?', a: 'rund 233', x: ['rund 23', 'rund 2330', 'rund 2'], w: '83,5 Mio. Einwohner : 358 000 km² ≈ 233.' },
      { f: 'Wo wohnen besonders <b>viele</b> Menschen dicht beieinander?', a: 'in Großstädten und Ballungsgebieten wie dem Ruhrgebiet', x: ['in den Alpen', 'in der Lüneburger Heide', 'auf den Halligen'], w: 'In Berlin wohnen über 4000 Menschen auf einem km².' },
      { f: 'Welches Bundesland ist <b>dünn</b> besiedelt?', a: 'Mecklenburg-Vorpommern', x: ['Berlin', 'Nordrhein-Westfalen', 'Hamburg'], w: 'Dort gibt es viele Felder, Wälder und Seen, aber wenige große Städte.' },
      { f: 'Sachsen hat rund 4 Mio. Einwohner auf rund 18 450 km². Wie dicht ist es ungefähr besiedelt?', a: 'rund 220 Einwohner je km²', x: ['rund 22 Einwohner je km²', 'rund 2200 Einwohner je km²', 'rund 4 Einwohner je km²'], w: '4 000 000 : 18 450 ≈ 218.' },
    ],
    S: { kats: ['dicht besiedelt', 'dünn besiedelt'], f: (b) => `<b>${b}</b>: dicht oder dünn besiedelt?`, h: 'Großstädte sind dicht besiedelt, Gebirge und Heide eher dünn.',
      items: [['Berlin', 0], ['Ruhrgebiet', 0], ['Leipzig', 0], ['Hamburg', 0], ['Lüneburger Heide', 1], ['Alpen', 1], ['Mecklenburgische Seenplatte', 1], ['Uckermark (Brandenburg)', 1]] },
  });

  const GL = { 'Norddeutsches Tiefland': 'unter 200 m, flach oder leicht wellig', Mittelgebirgsland: 'etwa 200 bis 1500 m, rundliche Berge und Wälder', Alpenvorland: 'hügelig, etwa 500 bis 1000 m, viele Seen', Alpen: 'Hochgebirge über 1500 m, spitze Gipfel, Gletscher' };
  G.grosslandschaften = baue('geo5-grosslandschaften', {
    h: 'Von Nord nach Süd: Norddeutsches Tiefland, Mittelgebirgsland, Alpenvorland, Alpen. Je weiter südlich, desto höher.',
    F: [
      { f: 'Welche Großlandschaft liegt ganz im <b>Norden</b> Deutschlands?', a: 'das Norddeutsche Tiefland', x: ['das Mittelgebirgsland', 'das Alpenvorland', 'die Alpen'], w: 'Es ist flach und liegt meist unter 200 m.' },
      { f: 'Welche Großlandschaft liegt zwischen Mittelgebirgsland und Alpen?', a: 'das Alpenvorland', x: ['das Norddeutsche Tiefland', 'die Küste', 'das Erzgebirge'], w: 'Das Alpenvorland ist hügelig, es gibt viele Seen.' },
      { f: 'Zu welcher Großlandschaft gehört der größte Teil von <b>Sachsen</b>?', a: 'zum Mittelgebirgsland (mit dem Erzgebirge), im Norden zum Tiefland', x: ['zu den Alpen', 'zum Alpenvorland', 'zur Küste'], w: 'Die Leipziger Tieflandsbucht gehört zum Tiefland, das Erzgebirge zum Mittelgebirgsland.' },
      { f: 'Wie hoch liegt das Norddeutsche Tiefland meist?', a: 'unter 200 m', x: ['über 2000 m', 'zwischen 1000 und 1500 m', 'unter dem Meeresspiegel'], w: 'Hinter den Deichen liegen manche Stellen sogar etwas unter dem Meeresspiegel.' },
      { f: 'Wo liegt der höchste Berg Deutschlands, die <b>Zugspitze</b>?', a: 'in den Alpen', x: ['im Harz', 'im Erzgebirge', 'im Schwarzwald'], w: 'Die Zugspitze ist 2962 m hoch.' },
    ],
    O: [{ t: 'Ordne die Großlandschaften von <b>Norden nach Süden</b>.', items: ['Norddeutsches Tiefland', 'Mittelgebirgsland', 'Alpenvorland', 'Alpen'], w: 'Von der Küste zu den Alpen wird es immer höher.' }],
    S: { kats: Object.keys(GL), f: (b) => `<b>${b}</b>: zu welcher Großlandschaft?`, h: 'Denk an die Lage von Nord nach Süd.',
      items: [['Lüneburger Heide', 0], ['Leipziger Tieflandsbucht', 0], ['Magdeburger Börde', 0], ['Harz', 1], ['Erzgebirge', 1], ['Schwarzwald', 1], ['Thüringer Wald', 1], ['Bodensee', 2], ['Chiemsee', 2], ['Zugspitze', 3], ['Watzmann', 3]] },
    E: { f: 'Welche Großlandschaft zeigt das Foto?', arten: [['tiefland', 'Norddeutsches Tiefland', 'Flach, weiter Blick, Felder und Wiesen.'], ['mittelgebirge', 'Mittelgebirgsland', 'Rundliche, bewaldete Berge.'], ['alpen', 'Alpen', 'Steile, spitze Felsgipfel, oft mit Schnee.'], ['alpenvorland', 'Alpenvorland', 'Hügel und Seen, dahinter die Alpen.']] },
  });

  G.gebirge = baue('geo5-gebirge', {
    h: 'Mittelgebirge: bis etwa 1500 m, rundliche Kuppen, fast ganz bewaldet. Hochgebirge: über 1500 m, steile Felsen, spitze Gipfel, Schnee und Gletscher.',
    F: [
      { f: 'Wie sehen die Gipfel im <b>Mittelgebirge</b> meist aus?', a: 'rund und bewaldet', x: ['spitz und felsig mit Gletschern', 'flach wie ein Tisch und ohne Pflanzen', 'wie Vulkane mit Lava'], w: 'Die Mittelgebirge sind sehr alt und wurden lange abgetragen.' },
      { f: 'Woran erkennt man ein <b>Hochgebirge</b>?', a: 'steile Felswände, spitze Gipfel, Schnee und Gletscher', x: ['rundliche Hügel mit Wald', 'flache Felder', 'Dünen'], w: 'Oberhalb der Baumgrenze wachsen keine Bäume mehr.' },
      { f: 'Wie hoch ist die <b>Zugspitze</b>?', a: '2962 m', x: ['1215 m', '1493 m', '8848 m'], w: 'Sie ist der höchste Berg Deutschlands.' },
      { f: 'Welcher Berg ist der höchste in <b>Sachsen</b>?', a: 'der Fichtelberg (1215 m)', x: ['der Brocken (1141 m)', 'die Zugspitze (2962 m)', 'der Feldberg (1493 m)'], w: 'Der Fichtelberg liegt im Erzgebirge bei Oberwiesenthal.' },
      { f: 'Welcher Berg ist der höchste Mittelgebirgsberg Deutschlands?', a: 'der Feldberg im Schwarzwald (1493 m)', x: ['der Brocken im Harz', 'der Fichtelberg im Erzgebirge', 'die Zugspitze'], w: 'Die Zugspitze gehört zum Hochgebirge (Alpen).' },
      { f: 'In welchem Gebirge liegt der <b>Brocken</b>?', a: 'im Harz', x: ['im Erzgebirge', 'in den Alpen', 'im Thüringer Wald'], w: 'Der Brocken ist 1141 m hoch.' },
      { f: 'Was ist die <b>Baumgrenze</b>?', a: 'die Höhe, oberhalb der im Gebirge keine Bäume mehr wachsen', x: ['eine Grenze zwischen zwei Ländern im Wald', 'der Rand eines Parks', 'eine Hecke um ein Feld'], w: 'In den Alpen liegt sie bei etwa 1800 bis 2000 m.' },
    ],
    O: [{ t: 'Ordne die Berge nach der Höhe: der höchste zuerst.', items: ['Zugspitze', 'Feldberg', 'Fichtelberg', 'Brocken'], w: 'Zugspitze 2962 m, Feldberg 1493 m, Fichtelberg 1215 m, Brocken 1141 m.' }],
    S: { kats: ['Mittelgebirge', 'Hochgebirge'], f: (b) => `<b>${b}</b>: Mittelgebirge oder Hochgebirge?`, h: 'Hochgebirge = Alpen. Fast alle anderen deutschen Gebirge sind Mittelgebirge.',
      items: [['Harz', 0], ['Erzgebirge', 0], ['Schwarzwald', 0], ['Thüringer Wald', 0], ['Alpen', 1], ['Gletscher', 1], ['spitze Felsgipfel', 1], ['rundliche Kuppen mit Wald', 0], ['Elbsandsteingebirge', 0]] },
    extra: {
      berg: () => U.ortTippen('berg', { art: 'deutschland', ortArt: 'berg', orte: { Zugspitze: [10.98, 47.42], Feldberg: [8.0, 47.87], Brocken: [10.62, 51.8], Fichtelberg: [12.95, 50.43] }, frage: (b) => `Wo liegt der <b>${b}</b>?`, merk: (b) => ({ Zugspitze: '2962 m, Alpen', Feldberg: '1493 m, Schwarzwald', Brocken: '1141 m, Harz', Fichtelberg: '1215 m, Erzgebirge' })[b] }),
    },
  }, { berg: 22 });

  G.berlin = baue('geo5-berlin', {
    h: 'Berlin ist Hauptstadt und Regierungssitz: Dort arbeiten Bundestag, Bundesregierung und Bundespräsident. Berlin ist zugleich ein Bundesland.',
    F: [
      { f: 'Was macht Berlin zur <b>Hauptstadt</b>?', a: 'Dort sitzen Bundestag, Bundesregierung und Bundespräsident.', x: ['Berlin ist die älteste Stadt Deutschlands.', 'Berlin liegt genau in der Mitte Deutschlands.', 'Berlin hat den größten Hafen.'], w: 'Auch viele Botschaften anderer Länder sind in Berlin.' },
      { f: 'In welchem Gebäude tagt der <b>Bundestag</b>?', a: 'im Reichstagsgebäude', x: ['im Schloss Bellevue', 'im Brandenburger Tor', 'im Fernsehturm'], w: 'Auf dem Dach ist eine gläserne Kuppel, die man besuchen kann.' },
      { f: 'Wie viele Menschen leben in Berlin ungefähr?', a: 'rund 3,7 Millionen', x: ['rund 370 000', 'rund 37 Millionen', 'rund 1 Million'], w: 'Berlin ist die größte Stadt Deutschlands (Ende 2025).' },
      { f: 'Welcher Fluss fließt durch <b>Berlin</b>?', a: 'die Spree', x: ['die Elbe', 'der Rhein', 'die Donau'], w: 'Die Spree mündet in Berlin-Spandau in die Havel.' },
      { f: 'Wo wohnt der <b>Bundespräsident</b> als Amtssitz?', a: 'im Schloss Bellevue in Berlin', x: ['im Reichstagsgebäude', 'in Dresden', 'in Bonn'], w: 'Der Bundespräsident ist das Staatsoberhaupt.' },
    ],
    S: { kats: ['Hauptstadtaufgabe', 'gibt es in jeder Großstadt'], f: (b) => `<b>${b}</b>: Hauptstadtaufgabe oder in jeder Großstadt?`, h: 'Hauptstadtaufgaben betreffen ganz Deutschland.',
      items: [['Bundestag', 0], ['Bundesregierung', 0], ['Botschaften anderer Länder', 0], ['Bundespräsident', 0], ['Schwimmhalle', 1], ['Krankenhaus', 1], ['Bahnhof', 1], ['Zoo', 1]] },
    E: { f: 'Was zeigt das Foto?', arten: [['reichstag', 'das Reichstagsgebäude in Berlin', 'Hier tagt der Bundestag. Auf dem Dach die gläserne Kuppel.'], ['frauenkirche', 'die Frauenkirche in Dresden', 'Wahrzeichen der Landeshauptstadt Dresden.'], ['containerhafen', 'den Hamburger Hafen', 'Containerschiffe und Kräne an der Elbe.']] },
  });

  const SN_FL = ['Elbe', 'Mulde', 'Spree', 'Neiße', 'Weiße Elster', 'Schwarze Elster'];
  G.sachsen = baue('geo5-sachsen', {
    h: 'Sachsen grenzt an Polen und Tschechien sowie an Bayern, Thüringen, Sachsen-Anhalt und Brandenburg. Der wichtigste Fluss ist die Elbe.',
    F: [
      { f: 'Welche ist die <b>größte</b> Stadt Sachsens?', a: 'Leipzig', x: ['Dresden', 'Chemnitz', 'Zwickau'], w: 'Leipzig hat rund 620 000 Einwohner, Dresden rund 560 000, Chemnitz rund 250 000.' },
      { f: 'Welcher Fluss fließt durch <b>Dresden</b>?', a: 'die Elbe', x: ['die Spree', 'die Mulde', 'die Neiße'], w: 'Die Elbe kommt aus Tschechien und fließt bis zur Nordsee bei Hamburg.' },
      { f: 'Welches Gebirge bildet die Grenze zwischen Sachsen und Tschechien?', a: 'das Erzgebirge', x: ['der Harz', 'die Alpen', 'der Schwarzwald'], w: 'Der Name kommt vom Bergbau auf Silber und andere Erze.' },
      { f: 'Wie viele Menschen leben ungefähr in Sachsen?', a: 'rund 4 Millionen', x: ['rund 40 Millionen', 'rund 400 000', 'rund 14 Millionen'], w: 'Rund ein Drittel davon lebt in den Großstädten Leipzig, Dresden und Chemnitz.' },
      { f: 'Welcher Fluss bildet die Grenze zwischen Sachsen und <b>Polen</b>?', a: 'die Neiße', x: ['die Elbe', 'die Mulde', 'die Spree'], w: 'An der Neiße liegt Görlitz, die östlichste Stadt Deutschlands.' },
      { f: 'Welches Bundesland grenzt im <b>Süden</b> (Südwesten) an Sachsen?', a: 'Bayern', x: ['Brandenburg', 'Sachsen-Anhalt', 'Hessen'], w: 'Im Norden liegt Brandenburg, im Westen Sachsen-Anhalt und Thüringen.' },
    ],
    S: { kats: ['Bundesland', 'Nachbarstaat'], f: (b) => `Sachsens Nachbar <b>${b}</b>: Bundesland oder anderer Staat?`, h: 'Zwei Nachbarn sind eigene Staaten.',
      items: [['Polen', 1], ['Tschechien', 1], ['Bayern', 0], ['Thüringen', 0], ['Sachsen-Anhalt', 0], ['Brandenburg', 0]] },
    extra: {
      stadt: () => U.ortTippen('stadt', { art: 'sachsen', orte: D.SN_ORTE, namen: ['Dresden', 'Leipzig', 'Chemnitz', 'Zwickau', 'Görlitz', 'Plauen', 'Bautzen', 'Freiberg'], frage: (s) => `Wo liegt <b>${s}</b>?`, opts: { namen: ['Sachsen'] } }),
      stadtNennen: () => U.ortNennen('stadtNennen', { art: 'sachsen', orte: D.SN_ORTE, namen: ['Dresden', 'Leipzig', 'Chemnitz', 'Zwickau', 'Görlitz', 'Plauen'], frage: () => 'Welche Stadt ist <b>blau</b> markiert?', opts: { namen: ['Sachsen'], fluesse: SN_FL } }),
      fluss: () => U.flussNennen('fluss', { art: 'sachsen', namen: ['Elbe', 'Mulde', 'Spree', 'Neiße', 'Weiße Elster'], fluesse: SN_FL, opts: { orte: [['Dresden', ...D.SN_ORTE.Dresden], ['Leipzig', ...D.SN_ORTE.Leipzig], ['Chemnitz', ...D.SN_ORTE.Chemnitz]] } }),
      nachbar: () => U.flaecheNennen('nachbar', { art: 'sachsen', namen: ['Polen', 'Tschechien', 'Bayern', 'Thüringen', 'Sachsen-Anhalt', 'Brandenburg'], frage: () => 'Welcher Nachbar Sachsens ist <b>gelb</b>?' }),
    },
  }, { stadt: 22, stadtNennen: 18, fluss: 18, nachbar: 18, frage: 20, sortieren: 8 });

  // =====================================================
  // Bereich 4: An Nordseeküste und Ostseeküste
  // =====================================================
  const INSELN = { Sylt: [8.3, 54.88], Fehmarn: [11.15, 54.45], Rügen: [13.4, 54.42], Usedom: [14.0, 53.95], Borkum: [6.73, 53.6], Helgoland: [7.89, 54.18], Föhr: [8.53, 54.72], Norderney: [7.2, 53.71], Hiddensee: [13.1, 54.55], Poel: [11.44, 54.0] };
  const INSEL_MEER = { Sylt: 'Nordsee', Borkum: 'Nordsee', Helgoland: 'Nordsee', Föhr: 'Nordsee', Norderney: 'Nordsee', Fehmarn: 'Ostsee', Rügen: 'Ostsee', Usedom: 'Ostsee', Hiddensee: 'Ostsee', Poel: 'Ostsee' };
  const KUESTE_AUS = { breite: 300 };
  G.nordOstsee = baue('geo5-nord-ostsee', {
    h: 'Die Nordsee ist ein Randmeer des Atlantiks mit starken Gezeiten. Die Ostsee ist ein Binnenmeer, fast ganz von Land umgeben, mit kaum Ebbe und Flut und weniger Salz.',
    F: [
      { f: 'In welchem Meer gibt es <b>deutliche Ebbe und Flut</b>?', a: 'in der Nordsee', x: ['in der Ostsee', 'in beiden gleich stark', 'in keinem von beiden'], w: 'An der Nordseeküste steigt und fällt das Wasser um 2,5 bis 4 m, an der Ostsee nur um etwa 20 cm.' },
      { f: 'Warum ist die Ostsee ein <b>Binnenmeer</b>?', a: 'Sie ist fast ganz von Land umgeben und nur durch schmale Meerengen mit der Nordsee verbunden.', x: ['Sie liegt mitten in Deutschland.', 'Sie hat kein Salz.', 'Sie ist ein großer See.'], w: 'Die Nordsee ist dagegen weit zum Atlantik geöffnet: ein Randmeer.' },
      { f: 'Welche ist die <b>größte</b> deutsche Insel?', a: 'Rügen', x: ['Sylt', 'Usedom', 'Fehmarn'], w: 'Rügen in der Ostsee hat rund 926 km².' },
      { f: 'Welche ist die größte deutsche <b>Nordsee</b>insel?', a: 'Sylt', x: ['Rügen', 'Helgoland', 'Fehmarn'], w: 'Sylt hat rund 99 km².' },
      { f: 'Welche Ostseeinsel teilt sich Deutschland mit <b>Polen</b>?', a: 'Usedom', x: ['Rügen', 'Fehmarn', 'Sylt'], w: 'Der kleinere Ostteil von Usedom gehört zu Polen.' },
      { f: 'Welches Meer ist <b>salziger</b>?', a: 'die Nordsee', x: ['die Ostsee', 'beide gleich', 'keines, beide sind Süßwasser'], w: 'In die Ostsee fließen viele Flüsse und es gibt wenig Austausch mit dem Atlantik.' },
      { f: 'Was ist eine <b>Halbinsel</b>?', a: 'Land, das fast ganz von Wasser umgeben ist, aber an einer Seite mit dem Festland verbunden ist', x: ['eine halb versunkene Insel', 'eine Insel in einem Fluss', 'die Hälfte einer Insel'], w: 'Ein Beispiel ist Fischland-Darß-Zingst an der Ostsee.' },
    ],
    S: { kats: ['Nordsee', 'Ostsee'], f: (b) => `<b>${b}</b>: Nordsee oder Ostsee?`, h: 'Die Nordsee liegt links (westlich) von Schleswig-Holstein, die Ostsee rechts (östlich).',
      items: [['Sylt', 0], ['Borkum', 0], ['Helgoland', 0], ['Norderney', 0], ['Wattenmeer', 0], ['Rügen', 1], ['Usedom', 1], ['Fehmarn', 1], ['Hiddensee', 1], ['Kieler Förde', 1]] },
    extra: {
      insel: () => U.ortTippen('insel', { art: 'deutschland', ortArt: 'insel', orte: INSELN, namen: ['Sylt', 'Fehmarn', 'Rügen', 'Usedom', 'Borkum', 'Helgoland'], frage: (i) => `Wo liegt die Insel <b>${i}</b>?`, merk: (i) => `Insel in der ${INSEL_MEER[i]}.`, opts: KUESTE_AUS }),
    },
  }, { insel: 26, sortieren: 18 });

  G.kuestenformen = baue('geo5-kuestenformen', {
    h: 'Steilküste: Das Meer nagt am hohen Ufer, es entsteht ein Kliff. Flachküste: flacher Sandstrand. An der Ostsee: Förden (lange Buchten, von Eis geformt) und Bodden (flache Buchten, fast vom Meer abgetrennt).',
    F: [
      { f: 'Was ist ein <b>Kliff</b>?', a: 'eine steile Wand an der Küste, die das Meer abträgt', x: ['eine flache Sandbank', 'ein Deich aus Beton', 'eine Insel im Fluss'], w: 'Bei Sturm schlagen die Wellen gegen den Fuß des Kliffs, oben bricht Material ab.' },
      { f: 'Wie entsteht eine <b>Steilküste</b>?', a: 'Wellen tragen am Fuß des Ufers Material ab, darüber bricht es ab.', x: ['Menschen bauen sie aus Beton.', 'Der Wind schüttet Sand auf.', 'Ein Vulkan bricht aus.'], w: 'Abgebrochenes Material wird an anderer Stelle wieder abgelagert.' },
      { f: 'Was ist eine <b>Förde</b>?', a: 'eine lange, schmale Meeresbucht, die ein Gletscher in der Eiszeit ausgeschürft hat', x: ['eine flache Bucht hinter Inseln', 'ein Fluss an der Küste', 'eine Sandbank im Watt'], w: 'Beispiel: Kieler Förde, Flensburger Förde.' },
      { f: 'Was ist ein <b>Bodden</b>?', a: 'eine flache Bucht, die durch Inseln und Landzungen fast vom Meer abgetrennt ist', x: ['eine steile Felswand', 'ein Hafen für Containerschiffe', 'eine lange Bucht aus der Eiszeit'], w: 'Bodden gibt es zum Beispiel an Rügen und am Darß.' },
      { f: 'Welche Steilküste aus <b>Kreide</b> ist auf Rügen berühmt?', a: 'die Kreidefelsen an der Küste im Nationalpark Jasmund', x: ['das Rote Kliff', 'die Bastei', 'die Zugspitze'], w: 'Das Rote Kliff liegt auf Sylt.' },
      { f: 'Wo liegt das <b>Rote Kliff</b>?', a: 'auf Sylt', x: ['auf Rügen', 'auf Usedom', 'in Dresden'], w: 'Es ist eine Steilküste aus rötlichem Sand.' },
    ],
    S: { kats: ['Steilküste', 'Flachküste'], f: (b) => `<b>${b}</b>: Steilküste oder Flachküste?`, h: 'Steil = hohe Wand, Flach = Strand flach ins Wasser.',
      items: [['Kliff', 0], ['Kreidefelsen', 0], ['Abbruchkante', 0], ['breiter Sandstrand', 1], ['Wattenmeer', 1], ['Dünen', 1], ['herabgestürzte Felsblöcke', 0]] },
    O: [{ t: 'Wie weicht eine Steilküste zurück? Ordne.', items: ['Sturmwellen schlagen gegen den Fuß des Ufers', 'unten entsteht eine Hohlkehle', 'das Ufer darüber bricht ab', 'die Wellen tragen das Material weg'], w: 'So wandert die Steilküste langsam landeinwärts.' }],
    E: { f: 'Welche Küstenform zeigt das Foto?', arten: [['kliff', 'Steilküste (Kliff)', 'Hohe, steile Wand, an der das Meer nagt.'], ['kreide', 'Steilküste aus Kreide', 'Weiße Kreidefelsen wie auf Rügen.'], ['flachkueste', 'Flachküste', 'Flacher Sandstrand, das Wasser wird langsam tiefer.'], ['foerde', 'Förde', 'Lange, schmale Meeresbucht.'], ['bodden', 'Bodden', 'Flache Bucht, von Land fast umschlossen.']] },
  }, { erkennen: 26 });

  G.gezeiten = baue('geo5-gezeiten', {
    h: 'Ebbe: Das Wasser fällt. Flut: Das Wasser steigt. Von Hochwasser zu Hochwasser vergehen etwa 12 Stunden und 25 Minuten. Ursache ist vor allem der Mond.',
    F: [
      { f: 'Was ist <b>Ebbe</b>?', a: 'die Zeit, in der das Wasser fällt', x: ['die Zeit, in der das Wasser steigt', 'eine Sturmflut', 'ein Fisch im Watt'], w: 'Bei Ebbe fällt das Watt trocken.' },
      { f: 'Was ist <b>Flut</b>?', a: 'die Zeit, in der das Wasser steigt', x: ['die Zeit, in der das Wasser fällt', 'jedes Hochwasser im Fluss', 'eine Welle bei Sturm'], w: 'Ebbe und Flut zusammen heißen Gezeiten oder Tiden.' },
      { f: 'Wie oft am Tag gibt es an der Nordsee <b>Hochwasser</b>?', a: 'etwa zweimal', x: ['einmal', 'viermal', 'nur einmal im Monat'], w: 'Von Hochwasser zu Hochwasser vergehen etwa 12 Stunden und 25 Minuten.' },
      { f: 'Was ist der <b>Tidenhub</b>?', a: 'der Unterschied zwischen Hochwasser und Niedrigwasser', x: ['die Dauer der Flut', 'die Höhe einer Welle', 'die Tiefe der Nordsee'], w: 'An der deutschen Nordseeküste sind es meist 2,5 bis 4 m.' },
      { f: 'Wer verursacht vor allem Ebbe und Flut?', a: 'der Mond mit seiner Anziehungskraft', x: ['der Wind', 'die Flüsse', 'die Schiffe'], w: 'Auch die Sonne wirkt mit. Stehen Sonne und Mond in einer Linie, ist der Tidenhub besonders groß (Springflut).' },
      { f: 'Warum gibt es an der <b>Ostsee</b> kaum Ebbe und Flut?', a: 'Sie ist fast abgeschlossen. Durch die engen Meerengen kann kaum Wasser hinein und hinaus.', x: ['Weil dort kein Mond scheint.', 'Weil sie zugefroren ist.', 'Weil sie zu tief ist.'], w: 'Der Tidenhub an der Ostsee ist nur etwa 20 cm.' },
    ],
    extra: { uhr: () => gezeitenUhr() },
  }, { uhr: 30 });
  function gezeitenUhr() {
    const h = R(0, 11), m = pick([0, 15, 30, 45]), hoch = R(0, 1) === 0;
    const plus = (std, min) => { let t = h * 60 + m + std * 60 + min; t = ((t % 1440) + 1440) % 1440; return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')} Uhr`; };
    const ok = plus(6, 12), ch = shuffle([ok, plus(12, 25), plus(3, 0), plus(24, 0)]);
    return { prompt: `An der Nordsee ist um <b>${h}:${String(m).padStart(2, '0')} Uhr ${hoch ? 'Hochwasser' : 'Niedrigwasser'}</b>. Wann ist ungefähr das nächste <b>${hoch ? 'Niedrigwasser' : 'Hochwasser'}</b>?`, choices: ch, correct: ch.indexOf(ok), hint: 'Zwischen Hoch- und Niedrigwasser liegen etwa 6 Stunden und 12 Minuten.',
      solution: `Etwa 6 Stunden 12 Minuten später: <b>${ok}</b>.`, ex: { mode: 'gezeiten', art: 'uhr', start: h * 60 + m, hoch, merk: `<b>${ok}</b>: Hoch- und Niedrigwasser wechseln alle gut 6 Stunden.` } };
  }

  G.watt = baue('geo5-watt', {
    h: 'Das Wattenmeer an der Nordsee fällt bei Ebbe trocken. Es ist Nationalpark (seit 1985/86) und seit 2009 UNESCO-Weltnaturerbe. Dort leben Wattwürmer, Muscheln, Krebse, Seehunde und Millionen Zugvögel.',
    F: [
      { f: 'Was ist das <b>Watt</b>?', a: 'Meeresboden an der Nordseeküste, der bei Ebbe trocken fällt', x: ['ein Strand an der Ostsee', 'eine Sandwüste', 'ein Deich'], w: 'Zweimal am Tag wird es überflutet und fällt wieder trocken.' },
      { f: 'Seit wann ist das Wattenmeer <b>UNESCO-Weltnaturerbe</b>?', a: 'seit 2009', x: ['seit 1950', 'seit 2020', 'es ist keins'], w: 'Damit ist es so bedeutend wie der Grand Canyon oder das Great Barrier Reef.' },
      { f: 'Warum darf man im Nationalpark nicht überall hin?', a: 'In den Ruhezonen sollen Tiere ungestört brüten, rasten und ihre Jungen aufziehen.', x: ['Weil dort Gold vergraben ist.', 'Weil das Watt zu teuer ist.', 'Weil dort Schiffe fahren.'], w: 'Der Nationalpark hat Schutzzonen mit verschiedenen Regeln.' },
      { f: 'Warum soll man nie <b>allein</b> und ohne Führung weit ins Watt laufen?', a: 'Die Flut kommt schnell, Priele füllen sich und man kann den Rückweg verlieren.', x: ['Weil dort Haie leben.', 'Weil der Boden heiß ist.', 'Weil es verboten ist zu laufen.'], w: 'Wattführer kennen Wege und Gezeiten.' },
      { f: 'Welches Tier hinterlässt die typischen <b>Sandhäufchen</b> im Watt?', a: 'der Wattwurm', x: ['der Seehund', 'die Möwe', 'der Hering'], w: 'Er frisst Sand und scheidet ihn als Kringel wieder aus.' },
      { f: 'Was ist ein <b>Priel</b>?', a: 'eine Rinne im Watt, in der auch bei Ebbe Wasser fließt', x: ['eine Muschel', 'ein Leuchtturm', 'ein Deich'], w: 'Bei Flut läuft das Wasser zuerst durch die Priele zurück.' },
    ],
    S: { kats: ['hilft dem Wattenmeer', 'schadet dem Wattenmeer'], f: (b) => `<b>${b}</b>: Hilft das dem Wattenmeer oder schadet es?`, h: 'Denk an die Tiere: Brauchen sie Ruhe und sauberes Wasser?',
      items: [['auf den markierten Wegen bleiben', 0], ['Müll wieder mitnehmen', 0], ['Wattwanderung mit Führung', 0], ['Seehunde streicheln wollen', 1], ['Öl und Müll ins Meer', 1], ['in der Ruhezone Vögel aufscheuchen', 1], ['Ruhezonen einrichten', 0]] },
    E: { f: 'Was zeigt das Foto?', arten: [['watt', 'das Wattenmeer bei Ebbe', 'Nasser Meeresboden, Priele, bei Flut ist alles überspült.'], ['seehund', 'einen Seehund', 'Seehunde ruhen auf Sandbänken im Wattenmeer.'], ['wattwurm', 'Spuren des Wattwurms', 'Die Sandkringel sind sein Kot.']] },
  });

  G.kuestenschutz = baue('geo5-kuestenschutz', {
    h: 'Bei Sturmflut drückt der Sturm das Wasser zusätzlich gegen die Küste. Schutz: Deiche, Buhnen, Lahnungen, Sandvorspülungen und Dünen.',
    F: [
      { f: 'Was ist eine <b>Sturmflut</b>?', a: 'Flut, bei der ein starker Sturm das Wasser zusätzlich gegen die Küste drückt', x: ['eine Flut im Sommer', 'eine besonders schwache Flut', 'Regen an der Küste'], w: 'Das Wasser steigt dann viel höher als sonst.' },
      { f: 'Wozu dient ein <b>Deich</b>?', a: 'Er schützt das tief liegende Land hinter ihm vor dem Meer.', x: ['Er ist ein Hafen für Schiffe.', 'Er hält Fische fest.', 'Er produziert Strom.'], w: 'Deiche sind breite Dämme aus Sand und Klei, mit Gras bewachsen. Schafe halten das Gras kurz.' },
      { f: 'Was ist eine <b>Buhne</b>?', a: 'ein Damm aus Holzpfählen oder Steinen, der vom Strand ins Meer ragt', x: ['ein Haus auf Stelzen', 'ein Schiff', 'eine Düne'], w: 'Buhnen bremsen die Strömung, damit weniger Sand weggespült wird.' },
      { f: 'Warum spült man auf <b>Sylt</b> jedes Jahr Sand an die Strände?', a: 'Weil das Meer jedes Jahr Sand wegträgt und die Insel sonst schrumpft.', x: ['Damit der Strand schöner aussieht.', 'Damit dort Häuser gebaut werden.', 'Weil Sand billig ist.'], w: 'Diese Sandvorspülung ersetzt den Sand, den Sturmfluten mitnehmen.' },
      { f: 'Warum haben neue Deiche eine <b>flache</b> Seite zum Meer?', a: 'Die Wellen laufen sanft aus und verlieren ihre Kraft.', x: ['Damit man besser rodeln kann.', 'Weil das billiger ist.', 'Damit Schiffe anlegen können.'], w: 'Steile Wände würden von den Wellen schneller zerstört.' },
      { f: 'Was sind <b>Lahnungen</b>?', a: 'Zäune aus Pfählen und Reisig im Watt, in denen sich Schlick ablagert, sodass neues Land wächst', x: ['Leuchttürme', 'Wellenbrecher aus Beton im Hafen', 'Fischernetze'], w: 'So entsteht vor dem Deich ein schützendes Vorland.' },
    ],
    S: { kats: ['Schutz vor dem Meer', 'kein Küstenschutz'], f: (b) => `<b>${b}</b>: Gehört das zum Küstenschutz?`, h: 'Was hält Wasser ab oder bremst die Wellen?',
      items: [['Deich', 0], ['Buhne', 0], ['Lahnung', 0], ['Sandvorspülung', 0], ['Strandkorb', 1], ['Leuchtturm', 1], ['Containerkran', 1], ['Düne mit Strandhafer', 0]] },
    E: { f: 'Was zeigt das Foto?', arten: [['deich', 'einen Deich', 'Breiter, grasbewachsener Damm, oft mit Schafen.'], ['buhne', 'Buhnen', 'Reihen von Pfählen, die ins Meer ragen.'], ['duene', 'eine Düne mit Strandhafer', 'Strandhafer hält den Sand mit seinen Wurzeln fest.']] },
  });

  G.hafen = baue('geo5-hafen', {
    h: 'Hamburg hat den größten Seehafen Deutschlands (das „Tor zur Welt“). Container machen den Umschlag schnell: Sie passen auf Schiff, Bahn und Lkw.',
    F: [
      { f: 'Welche Stadt hat den <b>größten Seehafen</b> Deutschlands?', a: 'Hamburg', x: ['Rostock', 'Kiel', 'Bremen'], w: '2025 wurden dort rund 100 Millionen Tonnen Güter umgeschlagen.' },
      { f: 'An welchem Fluss liegt der Hamburger Hafen?', a: 'an der Elbe', x: ['am Rhein', 'an der Weser', 'an der Oder'], w: 'Die großen Schiffe fahren von der Nordsee rund 100 km die Elbe hinauf.' },
      { f: 'Warum nutzt man im Hafen <b>Container</b>?', a: 'Sie haben genormte Größen und passen auf Schiff, Bahn und Lkw. Das Umladen geht schnell.', x: ['Weil sie besonders schön sind.', 'Weil man darin wohnen kann.', 'Weil sie schwimmen können.'], w: 'Ein Standardcontainer (TEU) ist etwa 6 m lang.' },
      { f: 'Wovon leben viele Menschen an der Küste?', a: 'von Häfen, Fischerei und Tourismus', x: ['vom Braunkohletagebau', 'vom Wintersport', 'vom Weinbau'], w: 'Diese drei sind die wichtigsten Wirtschaftszweige an der Küste.' },
      { f: 'Welcher große Ostseehafen liegt in Mecklenburg-Vorpommern?', a: 'Rostock', x: ['Hamburg', 'Bremerhaven', 'Emden'], w: 'Von Rostock fahren Fähren nach Skandinavien.' },
    ],
    S: { kats: ['Hafen', 'Fischerei', 'Tourismus'], f: (b) => `<b>${b}</b>: Zu welchem Wirtschaftszweig gehört das?`, h: 'Hafen = Waren umschlagen. Fischerei = Fische fangen. Tourismus = Urlaub.',
      items: [['Containerkran', 0], ['Containerschiff', 0], ['Krabbenkutter', 1], ['Fischauktion', 1], ['Strandkorbvermietung', 2], ['Ferienwohnung', 2], ['Kurkonzert', 2], ['Lagerhalle', 0], ['Fischfabrik', 1]] },
  });

  G.ruegen = baue('geo5-ruegen', {
    h: 'Rügen ist Deutschlands größte Insel und ein beliebtes Urlaubsziel. Tourismus bringt Arbeit, kann aber Natur, Verkehr und Wohnungen belasten.',
    F: [
      { f: 'Warum fahren so viele Menschen auf <b>Rügen</b> in den Urlaub?', a: 'wegen Badestränden, Kreidefelsen, Seebädern und Natur', x: ['wegen der hohen Berge', 'wegen der Skigebiete', 'wegen der Großstädte'], w: 'Die Seebäder an der Ostküste und der Nationalpark Jasmund sind besonders bekannt.' },
      { f: 'Welches Problem kann <b>viel Tourismus</b> bringen?', a: 'Staus, Müll, zertretene Dünen und teure Wohnungen für Einheimische', x: ['zu wenig Arbeit im Sommer', 'zu viel Ruhe', 'zu wenig Besucher'], w: 'Darum sucht man einen „sanften Tourismus“, der die Natur schont.' },
      { f: 'Was gehört zu <b>sanftem Tourismus</b>?', a: 'mit Bahn und Rad anreisen, auf Wegen bleiben, regionale Produkte kaufen', x: ['neue Hotels in die Dünen bauen', 'mit dem Auto bis an den Strand fahren', 'Müll liegen lassen'], w: 'Sanfter Tourismus nutzt die Natur, ohne sie zu zerstören.' },
      { f: 'In welchem Bundesland liegt Rügen?', a: 'Mecklenburg-Vorpommern', x: ['Schleswig-Holstein', 'Niedersachsen', 'Brandenburg'], w: 'Über eine Brücke und den Rügendamm ist Rügen mit Stralsund verbunden.' },
    ],
    S: { kats: ['Vorteil des Tourismus', 'Nachteil des Tourismus'], f: (b) => `<b>${b}</b>: Vorteil oder Nachteil?`, h: 'Für wen ist es gut, für wen schlecht?',
      items: [['Arbeitsplätze in Hotels', 0], ['Einnahmen für die Gemeinden', 0], ['neue Restaurants und Läden', 0], ['Staus im Sommer', 1], ['zertretene Dünen', 1], ['mehr Müll', 1], ['teure Wohnungen', 1]] },
  });

  // =====================================================
  // Bereich 5: Im Tiefland
  // =====================================================
  const TL_ORTE = { 'Lüneburger Heide': [10.0, 53.15], Altmark: [11.4, 52.7], Oderbruch: [14.3, 52.65], 'Leipziger Tieflandsbucht': [12.4, 51.35], 'Magdeburger Börde': [11.25, 52.05] };
  G.tiefland = baue('geo5-tiefland', {
    h: 'Das Norddeutsche Tiefland ist flach. Die Eiszeit hat es geformt: Geest (sandig), Heide, Urstromtäler. An den Küsten liegt die fruchtbare Marsch, am Rand der Mittelgebirge die Börde mit Löss.',
    F: [
      { f: 'Was formte vor allem das Norddeutsche Tiefland?', a: 'die Gletscher der Eiszeit und ihr Schmelzwasser', x: ['Vulkane', 'das Meer allein', 'Menschen mit Baggern'], w: 'Das Eis brachte Sand, Kies und große Steine (Findlinge) aus Skandinavien mit.' },
      { f: 'Was ist die <b>Marsch</b>?', a: 'flaches, fruchtbares Land an der Küste, aus Schlick vom Meer entstanden', x: ['ein sandiger Hügel', 'ein Gebirge', 'ein Wald'], w: 'Die Marsch liegt hinter den Deichen und wird oft als Weide genutzt.' },
      { f: 'Was ist die <b>Geest</b>?', a: 'etwas höheres, sandiges Land aus der Eiszeit, eher wenig fruchtbar', x: ['fruchtbares Schlickland', 'ein Fluss', 'eine Insel'], w: 'Auf der Geest gibt es viel Wald, Heide und Weiden.' },
      { f: 'Warum ist die <b>Börde</b> so fruchtbar?', a: 'Dort liegt Löss, ein feiner, nährstoffreicher Staub, den der Wind abgelagert hat.', x: ['Weil es dort nie regnet.', 'Weil dort viel Sand liegt.', 'Weil dort früher ein Meer war.'], w: 'In der Magdeburger Börde wachsen Weizen und Zuckerrüben besonders gut.' },
      { f: 'Wofür ist die <b>Lüneburger Heide</b> bekannt?', a: 'für lila blühende Heide und Schafe (Heidschnucken)', x: ['für Weinberge', 'für Hochhäuser', 'für Braunkohletagebaue'], w: 'Die Heide entstand, weil die Menschen früher den Wald abholzten. Sie ist also eine Kulturlandschaft.' },
      { f: 'Was ist ein <b>Urstromtal</b>?', a: 'ein breites Tal, in dem in der Eiszeit das Schmelzwasser abfloss', x: ['ein Tal im Hochgebirge', 'ein Tal unter dem Meer', 'ein besonders tiefer See'], w: 'Heute fließen dort oft Flüsse wie Elbe oder Spree.' },
    ],
    S: { kats: ['Marsch', 'Geest', 'Börde'], f: (b) => `<b>${b}</b>: Marsch, Geest oder Börde?`, h: 'Marsch = Schlick an der Küste. Geest = Sand aus der Eiszeit. Börde = Löss am Gebirgsrand.',
      items: [['Schlick vom Meer', 0], ['hinter dem Deich', 0], ['Weiden mit Kühen an der Küste', 0], ['sandiger Boden', 1], ['Heide und Kiefern', 1], ['etwas höher als die Marsch', 1], ['Löss', 2], ['Weizen und Zuckerrüben', 2], ['am Rand der Mittelgebirge', 2]] },
    extra: {
      landschaft: () => U.ortTippen('landschaft', { art: 'deutschland', ortArt: 'gebiet', orte: TL_ORTE, frage: (l) => `Wo liegt die Landschaft <b>${l}</b>?`, opts: { fluesse: ['Elbe', 'Oder', 'Weser'] } }),
    },
    E: { f: 'Welche Landschaft zeigt das Foto?', arten: [['heide', 'Heide', 'Lila blühendes Heidekraut, dazwischen Wacholder.'], ['boerde', 'Börde mit Ackerbau', 'Weite, fruchtbare Felder.'], ['marsch', 'Marsch hinter dem Deich', 'Flaches Grünland mit Gräben, oft mit Kühen.']] },
  }, { landschaft: 24 });

  G.kanaele = baue('geo5-kanaele', {
    h: 'Kanäle sind künstliche Wasserstraßen. Schleusen heben und senken Schiffe. Am Wasserstraßenkreuz Magdeburg führt eine 918 m lange Kanalbrücke den Mittellandkanal über die Elbe.',
    F: [
      { f: 'Was ist ein <b>Kanal</b>?', a: 'eine künstlich gebaute Wasserstraße', x: ['ein natürlicher Fluss', 'ein Graben auf dem Acker', 'eine Meeresbucht'], w: 'Kanäle verbinden Flüsse, damit Schiffe Waren transportieren können.' },
      { f: 'Wozu braucht man eine <b>Schleuse</b>?', a: 'um Schiffe zwischen zwei verschieden hohen Wasserspiegeln zu heben oder zu senken', x: ['um Schiffe zu waschen', 'um Fische zu fangen', 'um Brücken hochzuklappen'], w: 'Das Schiff fährt in die Kammer, Tore schließen, das Wasser steigt oder fällt.' },
      { f: 'Was ist am <b>Wasserstraßenkreuz Magdeburg</b> besonders?', a: 'Eine 918 m lange Kanalbrücke führt Schiffe über die Elbe.', x: ['Schiffe fahren durch einen Tunnel unter der Elbe.', 'Dort mündet die Elbe ins Meer.', 'Dort gibt es keine Schiffe.'], w: 'Es ist die längste Kanalbrücke Europas, seit 2003 in Betrieb.' },
      { f: 'Welche Flüsse verbindet der <b>Mittellandkanal</b> unter anderem?', a: 'Ems, Weser und Elbe', x: ['Donau und Inn', 'Rhein und Main', 'Spree und Neiße'], w: 'Er ist die längste künstliche Wasserstraße Deutschlands.' },
      { f: 'Welche Güter fahren oft auf Binnenschiffen?', a: 'schwere Massengüter wie Kies, Kohle, Getreide und Container', x: ['frische Blumen', 'Briefe', 'Menschen zur Arbeit'], w: 'Ein Binnenschiff ersetzt viele Lkw.' },
      { f: 'Was ist ein <b>Schiffshebewerk</b>?', a: 'eine Anlage, die Schiffe in einem Wassertrog nach oben oder unten fährt', x: ['ein Kran für Container', 'ein Leuchtturm', 'eine Werft'], w: 'Es arbeitet wie ein Fahrstuhl für Schiffe.' },
    ],
    O: [{ t: 'Ein Schiff fährt in der Schleuse <b>nach oben</b>. Ordne.', items: ['das untere Tor öffnet sich, das Schiff fährt hinein', 'das untere Tor schließt sich', 'Wasser strömt in die Kammer, das Schiff steigt', 'das obere Tor öffnet sich, das Schiff fährt hinaus'], w: 'Die Schleuse ist wie eine Treppenstufe aus Wasser.', s1: 'Die Schleuse: eine Wassertreppe' }],
    E: { f: 'Was zeigt das Foto?', arten: [['trogbruecke', 'die Kanalbrücke über die Elbe', 'Ein Kanal auf einer Brücke: Schiffe fahren über den Fluss.'], ['schleuse', 'eine Schleuse', 'Eine Kammer mit Toren, in der Schiffe gehoben oder gesenkt werden.'], ['containerhafen', 'einen Containerhafen', 'Kräne laden Container von großen Seeschiffen.']] },
  });

  G.landwirtschaft = baue('geo5-landwirtschaft', {
    h: 'Ackerbau: Getreide, Rüben, Kartoffeln. Viehwirtschaft: Kühe, Schweine. Grünland: Wiesen und Weiden. Welche Nutzung passt, hängt vor allem von Boden und Klima ab.',
    F: [
      { f: 'Wovon hängt es vor allem ab, was ein Bauer anbaut?', a: 'vom Boden und vom Klima', x: ['von der Farbe des Traktors', 'von der Hausnummer', 'vom Fernsehprogramm'], w: 'Auf fruchtbarem Löss baut man Weizen und Zuckerrüben an, auf feuchtem Marschland hält man Kühe.' },
      { f: 'Was wird auf den fruchtbaren Böden der <b>Börde</b> vor allem angebaut?', a: 'Weizen und Zuckerrüben', x: ['Wein und Oliven', 'Reis und Tee', 'nur Gras für Kühe'], w: 'Löss ist der beste Boden Deutschlands.' },
      { f: 'Was ist <b>Grünland</b>?', a: 'Wiesen und Weiden', x: ['Felder mit Mais', 'ein grün gestrichenes Haus', 'ein Nadelwald'], w: 'Grünland nutzt man für Kühe, Schafe und als Heu.' },
      { f: 'Was ist ein <b>Milchviehbetrieb</b>?', a: 'ein Bauernhof, der Kühe für die Milch hält', x: ['ein Laden für Milchprodukte', 'ein Getreidefeld', 'eine Fischfarm'], w: 'Melkmaschinen und Melkroboter erleichtern die Arbeit.' },
      { f: 'Was bedeutet <b>Fruchtwechsel</b>?', a: 'Auf einem Feld wechseln sich jedes Jahr verschiedene Pflanzen ab.', x: ['Man pflanzt immer dasselbe.', 'Man tauscht Obst mit dem Nachbarn.', 'Man erntet zweimal im Jahr Äpfel.'], w: 'So bleibt der Boden gesund und Schädlinge haben es schwerer.' },
      { f: 'Was ist eine <b>Sonderkultur</b>?', a: 'eine Pflanze mit besonders viel Arbeit, zum Beispiel Obst, Wein, Gemüse oder Spargel', x: ['eine besonders große Weide', 'ein Wald', 'eine Kuhrasse'], w: 'In Sachsen gibt es viel Obstanbau, zum Beispiel Äpfel bei Dresden und Meißen.' },
    ],
    O: [{ t: 'Vom Korn zum Brot: Ordne.', items: ['der Bauer sät Weizen', 'der Mähdrescher erntet die Körner', 'die Mühle mahlt die Körner zu Mehl', 'der Bäcker backt Brot', 'das Brot liegt im Laden'], w: 'Viele Menschen arbeiten zusammen, damit Brot auf dem Tisch liegt.' }],
    S: { kats: ['Ackerbau', 'Viehwirtschaft', 'Sonderkultur'], f: (b) => `<b>${b}</b>: Ackerbau, Viehwirtschaft oder Sonderkultur?`, h: 'Ackerbau = Feldfrüchte. Viehwirtschaft = Tiere. Sonderkultur = Obst, Wein, Gemüse.',
      items: [['Weizen', 0], ['Zuckerrüben', 0], ['Kartoffeln', 0], ['Mais', 0], ['Milchkühe', 1], ['Schweine', 1], ['Hühner', 1], ['Äpfel', 2], ['Wein', 2], ['Spargel', 2]] },
  });

  G.braunkohleEntstehung = baue('geo5-kohle-entstehung', {
    h: 'Vor vielen Millionen Jahren wuchsen hier Sumpfwälder. Abgestorbene Pflanzen versanken im Wasser, wurden zu Torf und unter dem Druck von Sand und Ton über Jahrmillionen zu Braunkohle.',
    F: [
      { f: 'Woraus ist <b>Braunkohle</b> entstanden?', a: 'aus Pflanzen von Sumpfwäldern', x: ['aus Sand', 'aus Tieren im Meer', 'aus Vulkanasche'], w: 'Manchmal findet man in der Kohle noch Holzreste.' },
      { f: 'Was ist der erste Schritt von der Pflanze zur Kohle?', a: 'Abgestorbene Pflanzen sinken ins sumpfige Wasser und werden zu Torf.', x: ['Die Pflanzen verbrennen.', 'Ein Bagger presst sie zusammen.', 'Die Pflanzen trocknen in der Sonne.'], w: 'Unter Wasser fehlt Sauerstoff, darum verrotten sie nicht ganz.' },
      { f: 'Wie lange hat es gedauert, bis die Braunkohle entstand?', a: 'viele Millionen Jahre', x: ['ein paar Jahre', 'etwa 100 Jahre', 'eine Woche'], w: 'Darum ist Kohle ein Bodenschatz, der nicht nachwächst.' },
      { f: 'Was ist ein <b>Kohleflöz</b>?', a: 'eine Schicht Kohle in der Erde', x: ['ein Kohleofen', 'ein Bagger', 'ein Kohlezug'], w: 'Über dem Flöz liegen Sand und Ton, das „Deckgebirge“.' },
    ],
    O: [{ t: 'Wie entsteht Braunkohle? Ordne.', items: ['Sumpfwald wächst', 'abgestorbene Pflanzen versinken im Wasser', 'es bildet sich Torf', 'Sand und Ton decken alles zu und pressen es', 'nach Millionen Jahren ist Braunkohle entstanden'], w: 'Pflanzen → Torf → Braunkohle.' }],
    T: [{ f: 'Aus Pflanzen wird zuerst ___, dann Braunkohle.', a: 'Torf', w: 'Torf findet man heute noch in Mooren.' }],
  });

  G.braunkohle = baue('geo5-braunkohle', {
    h: 'In Sachsen wird Braunkohle im Tagebau abgebaut: in der Lausitz (Nochten, Reichwalde) und südlich von Leipzig (Vereinigtes Schleenhain). Kraftwerke machen daraus Strom. Spätestens 2038 soll Schluss sein.',
    F: [
      { f: 'Wie wird Braunkohle in Sachsen abgebaut?', a: 'im Tagebau: große Bagger graben von oben', x: ['tief unter der Erde in Stollen', 'mit Schiffen im Meer', 'gar nicht'], w: 'Weil die Kohle nicht sehr tief liegt, gräbt man ein riesiges offenes Loch.' },
      { f: 'In welchen beiden Gebieten Sachsens gibt es Braunkohle?', a: 'in der Lausitz und im Raum Leipzig', x: ['im Erzgebirge und im Vogtland', 'in der Sächsischen Schweiz', 'an der Ostsee'], w: 'Lausitzer Revier und Mitteldeutsches Revier.' },
      { f: 'Wofür wird die meiste Braunkohle verwendet?', a: 'um in Kraftwerken Strom zu erzeugen', x: ['zum Grillen', 'als Dünger', 'zum Straßenbau'], w: 'Ein großes Kraftwerk in der Lausitz ist Boxberg.' },
      { f: 'Was ist eine <b>Förderbrücke</b>?', a: 'eine riesige Maschine, die Sand und Erde über dem Tagebau auf die andere Seite bringt', x: ['eine Brücke über die Elbe', 'ein Zug für Kohle', 'ein Förderband im Supermarkt'], w: 'Förderbrücken sind über 500 m lang. Eine alte steht als Besucherbergwerk bei Lichterfeld (F60).' },
      { f: 'Bis wann soll Deutschland spätestens aus der Kohle aussteigen?', a: 'bis 2038', x: ['bis 2100', 'bis 2000', 'gar nicht'], w: 'Beim Verbrennen von Kohle entsteht viel Kohlendioxid, das das Klima erwärmt.' },
      { f: 'Was passiert mit <b>Dörfern</b>, die einem Tagebau im Weg liegen?', a: 'Sie werden umgesiedelt und abgerissen.', x: ['Sie werden umgegraben und bleiben stehen.', 'Sie schwimmen auf einem See.', 'Nichts.'], w: 'Für die Menschen bedeutet das, ihre Heimat zu verlieren.' },
    ],
    S: { kats: ['Vorteil der Braunkohle', 'Nachteil der Braunkohle'], f: (b) => `<b>${b}</b>: Vorteil oder Nachteil?`, h: 'Denk an Arbeitsplätze, Strom, Umwelt und Menschen.',
      items: [['Arbeitsplätze in der Region', 0], ['Strom auch bei Windstille', 0], ['Kohle liegt im eigenen Land', 0], ['viel Kohlendioxid', 1], ['Dörfer müssen weichen', 1], ['Grundwasser wird abgesenkt', 1], ['Landschaft wird zerstört', 1]] },
    E: { f: 'Was zeigt das Foto?', arten: [['tagebau', 'einen Braunkohletagebau', 'Riesige Grube mit Baggern und Förderbändern.'], ['foerderbruecke', 'eine Förderbrücke', 'Riesige Stahlbrücke über dem Tagebau.'], ['tagebausee', 'einen See in einem alten Tagebau', 'Nach dem Abbau wird die Grube geflutet.']] },
  });

  G.rekultivierung = baue('geo5-rekultivierung', {
    h: 'Nach dem Tagebau wird die Landschaft neu gestaltet (Rekultivierung): Seen, Wälder, Felder. So sind das Leipziger Neuseenland und das Lausitzer Seenland entstanden.',
    F: [
      { f: 'Was bedeutet <b>Rekultivierung</b>?', a: 'Nach dem Bergbau wird die Landschaft wieder nutzbar gemacht.', x: ['Man gräbt einen neuen Tagebau.', 'Man pflanzt nur Rasen.', 'Man baut eine Stadt.'], w: 'Es entstehen Seen, Wälder, Felder und Erholungsgebiete.' },
      { f: 'Was entsteht oft aus einem alten <b>Tagebauloch</b>?', a: 'ein See', x: ['ein Berg', 'ein Gletscher', 'ein Flughafen unter der Erde'], w: 'Die Grube wird mit Wasser geflutet.' },
      { f: 'Wie heißen die neuen Seen südlich von Leipzig zusammen?', a: 'Leipziger Neuseenland', x: ['Mecklenburgische Seenplatte', 'Bodensee', 'Sächsische Schweiz'], w: 'Ein bekannter See ist der Cospudener See.' },
      { f: 'Warum spricht man von „Landschaften aus zweiter Hand“?', a: 'Die Landschaft wurde vom Menschen nach dem Bergbau ganz neu angelegt.', x: ['Weil sie gebraucht gekauft wurde.', 'Weil sie zwei Besitzer hat.', 'Weil sie nur halb fertig ist.'], w: 'Es sind Kulturlandschaften, keine Naturlandschaften.' },
    ],
    O: [{ t: 'Vom Tagebau zum See: Ordne.', items: ['Braunkohle wird abgebaut', 'die Bagger ziehen weiter', 'die Böschungen werden abgeflacht und gesichert', 'das Loch wird mit Wasser geflutet', 'Menschen baden und segeln auf dem neuen See'], w: 'Bis aus einem Tagebau ein Badesee wird, vergehen viele Jahre.' }],
    S: { kats: ['während des Tagebaus', 'nach der Rekultivierung'], f: (b) => `<b>${b}</b>: Wann gibt es das?`, h: 'Erst Abbau, dann Neugestaltung.',
      items: [['Bagger und Förderbrücke', 0], ['abgesenktes Grundwasser', 0], ['Staub und Lärm', 0], ['Badestrand', 1], ['Segelboote', 1], ['junger Wald', 1], ['Radweg um den See', 1]] },
  });
})();
