/* GeoDax – Klasse 5, Bereiche 6 bis 9: Stadt und Dorf, Ballungsgebiete, Mittelgebirgsland, Exkursion; dazu die Themenliste
 * (Lehrplan LB 4–6 und Wahlbereiche; TERRA Geographie 5 Sachsen, S. 118–175). Texte selbst geschrieben, Fakten nachgeschlagen.
 */
(function () {
  const D = window.GeoDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;

  // =====================================================
  // Bereich 6: Leben in der Stadt, Leben im Dorf
  // =====================================================
  const GB = ['wohnen', 'arbeiten', 'sich versorgen', 'sich bilden', 'sich erholen', 'am Verkehr teilnehmen', 'in Gemeinschaft leben'];
  G.stadt = baue('geo5-stadt', {
    h: 'Menschen haben Grundbedürfnisse: wohnen, arbeiten, sich versorgen, sich bilden, sich erholen, am Verkehr teilnehmen, in Gemeinschaft leben. Eine Stadt bietet für alle etwas.',
    F: [
      { f: 'Was bietet eine <b>Stadt</b> mehr als ein Dorf?', a: 'viele Arbeitsplätze, Geschäfte, Schulen, Krankenhäuser und Kultur', x: ['mehr Wald und Felder', 'mehr Ruhe', 'mehr Bauernhöfe'], w: 'Darum fahren auch viele Menschen aus dem Umland in die Stadt.' },
      { f: 'Was sind <b>Grundbedürfnisse</b>?', a: 'Dinge, die alle Menschen zum Leben brauchen, zum Beispiel wohnen, arbeiten, sich versorgen', x: ['Wünsche wie ein neues Handy', 'nur Essen und Trinken', 'Hobbys'], w: 'Man unterscheidet sieben Grundbedürfnisse.' },
      { f: 'Was ist eine <b>Fußgängerzone</b>?', a: 'eine Straße in der Innenstadt nur für Fußgänger, mit vielen Geschäften', x: ['ein Gehweg an der Autobahn', 'ein Wanderweg im Wald', 'ein Spielplatz'], w: 'Ohne Autos kann man in Ruhe bummeln.' },
      { f: 'Was gehört zum Grundbedürfnis <b>sich bilden</b>?', a: 'Schule, Bibliothek, Volkshochschule', x: ['Supermarkt', 'Fußballplatz', 'Straßenbahn'], w: 'Bildung = etwas lernen.' },
    ],
    S: { kats: GB, f: (b) => `<b>${b}</b>: Welches Grundbedürfnis wird hier erfüllt?`, h: 'Frage dich: Wozu geht man dorthin?',
      items: [['Wohnhaus', 0], ['Fabrik', 1], ['Büro', 1], ['Supermarkt', 2], ['Bäckerei', 2], ['Schule', 3], ['Bibliothek', 3], ['Park', 4], ['Schwimmbad', 4], ['Bahnhof', 5], ['Straßenbahn', 5], ['Sportverein', 6], ['Jugendclub', 6]] },
  }, { sortieren: 40 });

  G.dorf = baue('geo5-dorf', {
    h: 'Früher arbeiteten fast alle im Dorf in der Landwirtschaft. Heute pendeln viele zur Arbeit in die Stadt. Neue Wohngebiete entstehen, Läden und Schulen schließen manchmal.',
    F: [
      { f: 'Wie hat sich das <b>Dorf</b> in den letzten hundert Jahren verändert?', a: 'Früher lebten fast alle von der Landwirtschaft, heute arbeiten viele in der Stadt.', x: ['Es hat sich nichts verändert.', 'Heute arbeiten mehr Menschen auf dem Feld als früher.', 'Alle Dörfer wurden zu Großstädten.'], w: 'Maschinen erledigen die Feldarbeit, dafür braucht man weniger Menschen.' },
      { f: 'Warum ziehen Familien aus der Stadt ins <b>Umland</b>?', a: 'Dort gibt es mehr Platz, Gärten und oft günstigere Grundstücke.', x: ['Weil es dort mehr Kinos gibt.', 'Weil es dort mehr Arbeitsplätze gibt.', 'Weil es dort keine Schulen gibt.'], w: 'Am Dorfrand entstehen dann neue Einfamilienhäuser.' },
      { f: 'Was ist ein Problem in vielen kleinen Dörfern?', a: 'Läden, Ärzte und Busverbindungen fehlen.', x: ['Zu viel Verkehr.', 'Zu viele Hochhäuser.', 'Zu viele Kinos.'], w: 'Darum braucht man im Dorf oft ein Auto.' },
      { f: 'Was findet man im Dorf <b>häufiger</b> als in der Stadt?', a: 'Bauernhöfe, Gärten und Felder ringsum', x: ['Hochhäuser', 'U-Bahnen', 'große Kaufhäuser'], w: 'Das Dorf ist eine ländliche Siedlung.' },
    ],
    S: { kats: ['Dorf früher', 'Dorf heute'], f: (b) => `<b>${b}</b>: Passt das eher zum Dorf früher oder heute?`, h: 'Früher: Landwirtschaft mit vielen Menschen. Heute: Pendler, Neubaugebiete, Maschinen.',
      items: [['fast alle arbeiten auf dem Feld', 0], ['Ernte mit der Sense', 0], ['Pferde ziehen den Pflug', 0], ['Pendler fahren in die Stadt', 1], ['Neubaugebiet am Dorfrand', 1], ['Mähdrescher', 1], ['schnelles Internet', 1]] },
  });

  G.umland = baue('geo5-umland', {
    h: 'Pendler wohnen an einem Ort und arbeiten an einem anderen. Einpendler kommen in die Stadt, Auspendler fahren hinaus. Stadt und Umland brauchen einander.',
    F: [
      { f: 'Was ist ein <b>Pendler</b>?', a: 'jemand, der an einem Ort wohnt und an einem anderen arbeitet oder lernt', x: ['jemand, der umzieht', 'ein Busfahrer', 'jemand, der nie das Haus verlässt'], w: 'Pendler fahren jeden Tag hin und zurück.' },
      { f: 'Lena wohnt in Radebeul und arbeitet in Dresden. Für Dresden ist sie eine …', a: 'Einpendlerin', x: ['Auspendlerin', 'Touristin', 'Einwohnerin von Dresden'], w: 'Sie pendelt in die Stadt hinein.' },
      { f: 'Tom wohnt in Dresden und arbeitet in Pirna. Für Dresden ist er ein …', a: 'Auspendler', x: ['Einpendler', 'Tourist', 'Grenzgänger'], w: 'Er pendelt aus der Stadt hinaus.' },
      { f: 'Was bietet das <b>Umland</b> der Stadt?', a: 'Wohnraum, Erholung im Grünen und Lebensmittel', x: ['vor allem Hochhäuser und Theater', 'nur Autobahnen', 'nichts'], w: 'Die Stadt bietet dafür Arbeitsplätze, Geschäfte, Krankenhäuser und Kultur.' },
      { f: 'Was entsteht morgens, wenn viele Pendler gleichzeitig fahren?', a: 'Berufsverkehr mit Staus und vollen Zügen', x: ['leere Straßen', 'ein Feiertag', 'Ebbe'], w: 'Busse und Bahnen entlasten die Straßen.' },
    ],
    S: { kats: ['Stadt bietet dem Umland', 'Umland bietet der Stadt'], f: (b) => `<b>${b}</b>: Wer bietet hier wem etwas?`, h: 'Was gibt es eher in der Stadt, was eher auf dem Land?',
      items: [['Arbeitsplätze', 0], ['Krankenhaus', 0], ['Theater und Kino', 0], ['Gymnasium und Universität', 0], ['Wohnungen im Grünen', 1], ['Obst und Gemüse vom Hof', 1], ['Wandern und Baden', 1], ['Trinkwasser aus der Talsperre', 1]] },
  });

  // =====================================================
  // Bereich 7: Wo viele Menschen leben und arbeiten
  // =====================================================
  G.sektoren = baue('geo5-sektoren', {
    h: 'Drei Wirtschaftsbereiche: Landwirtschaft und Bergbau (Rohstoffe gewinnen), Industrie (Dinge herstellen), Dienstleistung (für andere arbeiten). Heute arbeiten die meisten Menschen in Dienstleistungen.',
    F: [
      { f: 'In welchem Wirtschaftsbereich arbeiten heute in Deutschland die <b>meisten</b> Menschen?', a: 'Dienstleistung', x: ['Landwirtschaft', 'Bergbau', 'Industrie'], w: 'Etwa drei von vier Erwerbstätigen arbeiten in Handel, Verkehr, Gesundheit, Bildung oder Verwaltung.' },
      { f: 'Was gehört zur <b>Industrie</b>?', a: 'Fabriken, die Waren herstellen, zum Beispiel Autos', x: ['Ärzte und Lehrer', 'Bauernhöfe', 'Bergwerke'], w: 'Industrie verarbeitet Rohstoffe zu Waren.' },
      { f: 'Was ist eine <b>Dienstleistung</b>?', a: 'Arbeit für andere Menschen, ohne dass ein Gegenstand hergestellt wird', x: ['ein Auto bauen', 'Kohle fördern', 'Weizen anbauen'], w: 'Beispiele: Friseur, Verkäuferin, Busfahrer, Lehrerin.' },
    ],
    S: { kats: ['Landwirtschaft und Bergbau', 'Industrie', 'Dienstleistung'], f: (b) => `<b>${b}</b>: Zu welchem Wirtschaftsbereich gehört dieser Beruf?`, h: 'Rohstoffe gewinnen, Dinge herstellen oder für andere arbeiten?',
      items: [['Landwirtin', 0], ['Bergmann', 0], ['Förster', 0], ['Fischer', 0], ['Autobauer in der Fabrik', 1], ['Arbeiterin in der Chipfabrik', 1], ['Stahlkocher', 1], ['Bäcker', 1], ['Lehrerin', 2], ['Ärztin', 2], ['Busfahrer', 2], ['Verkäuferin', 2], ['Friseur', 2]] },
    extra: { diagramm: () => U.diagramm('diagramm') },
  }, { sortieren: 40, passtNicht: 14, diagramm: 8 });

  G.ballungsgebiet = baue('geo5-ballungsgebiet', {
    h: 'In einem Ballungsgebiet liegen viele Städte dicht beieinander und wachsen zusammen. Viele Menschen, Arbeitsplätze, Straßen und Bahnen.',
    F: [
      { f: 'Was ist ein <b>Ballungsgebiet</b>?', a: 'ein Gebiet, in dem viele Städte dicht beieinander liegen und sehr viele Menschen leben und arbeiten', x: ['ein Gebiet mit vielen Bällen', 'eine einzelne kleine Stadt', 'ein Naturschutzgebiet'], w: 'Man nennt es auch Verdichtungsraum.' },
      { f: 'Welches ist das <b>größte</b> Ballungsgebiet Deutschlands?', a: 'das Ruhrgebiet', x: ['die Lüneburger Heide', 'das Erzgebirge', 'die Insel Rügen'], w: 'Im Ruhrgebiet leben über 5 Millionen Menschen in 53 Städten und Gemeinden.' },
      { f: 'Welches Ballungsgebiet liegt in <b>Sachsen</b>?', a: 'der Raum Leipzig–Halle (und der Raum Dresden)', x: ['das Ruhrgebiet', 'das Rhein-Main-Gebiet', 'der Raum München'], w: 'Leipzig und Halle (Sachsen-Anhalt) bilden zusammen ein Ballungsgebiet.' },
      { f: 'Was ist typisch für ein Ballungsgebiet?', a: 'dichte Bebauung, viel Verkehr, viele Arbeitsplätze', x: ['viele Bauernhöfe und Wälder', 'kaum Straßen', 'sehr wenige Menschen'], w: 'Die Städte gehen ineinander über.' },
    ],
    extra: {
      ballung: () => U.ortTippen('ballung', { art: 'deutschland', ortArt: 'gebiet', orte: { Ruhrgebiet: [7.2, 51.5], 'Rhein-Main': [8.7, 50.05], 'Raum München': [11.6, 48.15], 'Raum Berlin': [13.4, 52.5], 'Raum Leipzig–Halle': [12.2, 51.4], 'Raum Hamburg': [10.0, 53.55], 'Raum Stuttgart': [9.2, 48.8] }, frage: (b) => `Wo liegt das Ballungsgebiet <b>${b}</b>?` }),
    },
  }, { ballung: 30 });

  G.ruhrgebiet = baue('geo5-ruhrgebiet', {
    h: 'Steinkohle machte das Ruhrgebiet groß: Zechen, Kokereien, Stahlwerke. Als die Kohle zu teuer wurde, schlossen die Zechen. Neue Arbeit entstand in Dienstleistung, Forschung, Kultur: Strukturwandel.',
    F: [
      { f: 'Welcher Rohstoff machte das Ruhrgebiet groß?', a: 'Steinkohle', x: ['Braunkohle', 'Erdöl', 'Gold'], w: 'Mit der Kohle wurde Eisen zu Stahl geschmolzen.' },
      { f: 'Was ist eine <b>Zeche</b>?', a: 'ein Bergwerk, in dem Steinkohle unter Tage abgebaut wurde', x: ['eine Rechnung im Restaurant', 'ein Tagebau für Braunkohle', 'ein Stahlwerk'], w: 'Die Zeche Zollverein in Essen ist heute Weltkulturerbe.' },
      { f: 'Was bedeutet <b>Strukturwandel</b>?', a: 'Alte Wirtschaftszweige verschwinden, neue entstehen.', x: ['Man baut neue Zechen.', 'Die Städte werden umbenannt.', 'Das Wetter ändert sich.'], w: 'Im Ruhrgebiet: weg von Kohle und Stahl, hin zu Dienstleistungen, Hochschulen und Kultur.' },
      { f: 'Warum schlossen die Zechen im Ruhrgebiet?', a: 'Kohle aus dem Ausland war billiger, Öl und Gas wurden wichtiger.', x: ['Die Kohle war plötzlich verboten.', 'Die Bergleute wollten nicht mehr.', 'Ein Erdbeben zerstörte sie.'], w: 'Die letzte Steinkohlenzeche in Deutschland schloss 2018.' },
      { f: 'Zwischen welchen Flüssen liegt das Ruhrgebiet vor allem?', a: 'zwischen Ruhr im Süden und Lippe im Norden, im Westen der Rhein', x: ['zwischen Elbe und Oder', 'zwischen Donau und Inn', 'zwischen Main und Neckar'], w: 'Der Fluss Ruhr gab dem Gebiet den Namen.' },
    ],
    O: [{ t: 'Die Geschichte des Ruhrgebiets: Ordne.', items: ['Kohle wird entdeckt und abgebaut', 'Stahlwerke entstehen, Städte wachsen schnell', 'Kohle wird zu teuer, Zechen schließen', 'neue Arbeit in Dienstleistung, Forschung und Kultur'], w: 'Das ist der Strukturwandel.' }],
    S: { kats: ['früher (Kohle und Stahl)', 'heute (nach dem Strukturwandel)'], f: (b) => `<b>${b}</b>: früher oder heute?`, h: 'Früher: schwere Industrie. Heute: Dienstleistung, Kultur, Freizeit.',
      items: [['Zeche mit Förderturm', 0], ['Hochofen', 0], ['rauchende Schornsteine', 0], ['Universität', 1], ['Einkaufszentrum', 1], ['Museum im alten Industriegebäude', 1], ['Radweg auf alter Bahntrasse', 1]] },
    E: { f: 'Was zeigt das Foto?', arten: [['zeche', 'eine Zeche (heute Museum)', 'Förderturm und Werksgebäude erinnern an den Kohlebergbau.'], ['muenchen', 'München mit den Alpen', 'Die Landeshauptstadt Bayerns.'], ['shanghai', 'Shanghai', 'Hochhäuser einer Riesenstadt in China.']] },
  });

  G.diagramme = baue('geo5-diagramme', {
    h: 'Erst den Titel lesen: Was wird gezeigt? Dann die Achsen: Welche Einheit? Dann die Werte ablesen und vergleichen.',
    F: [
      { f: 'Was liest du bei einem Diagramm <b>zuerst</b>?', a: 'den Titel: Was zeigt das Diagramm?', x: ['den größten Wert', 'die Farbe der Säulen', 'die letzte Zahl'], w: 'Danach liest man die Achsen und die Einheit.' },
      { f: 'Welches Diagramm zeigt gut, wie sich etwas <b>über die Jahre</b> verändert?', a: 'ein Liniendiagramm', x: ['ein Kreisdiagramm', 'eine Tabelle ohne Zahlen', 'eine Landkarte'], w: 'Die Linie steigt oder fällt mit den Jahren.' },
      { f: 'Welches Diagramm zeigt gut <b>Anteile an einem Ganzen</b> (zum Beispiel Prozent)?', a: 'ein Kreisdiagramm', x: ['ein Liniendiagramm', 'ein Stadtplan', 'ein Kalender'], w: 'Der ganze Kreis sind 100 %.' },
    ],
    extra: { lesen: () => U.diagramm('lesen') },
  }, { lesen: 70, frage: 20 });

  G.muenchen = baue('geo5-muenchen', {
    h: 'Standortfaktoren sind Gründe, warum sich Firmen an einem Ort ansiedeln: gute Verkehrswege, Fachkräfte, Hochschulen, Flughafen, attraktive Umgebung.',
    F: [
      { f: 'Was sind <b>Standortfaktoren</b>?', a: 'Gründe, warum sich eine Firma an einem bestimmten Ort ansiedelt', x: ['Wegweiser an der Straße', 'die Zahl der Bäume in einer Stadt', 'Hausnummern'], w: 'Zum Beispiel gute Verkehrsanbindung, Fachkräfte oder Rohstoffe.' },
      { f: 'Warum siedeln sich in <b>München</b> viele moderne Firmen an?', a: 'Es gibt Hochschulen, Fachkräfte, einen großen Flughafen und eine schöne Umgebung.', x: ['Weil dort Steinkohle liegt.', 'Weil es dort keine Menschen gibt.', 'Weil es am Meer liegt.'], w: 'Rohstoffe wie Kohle hat München nicht. Wichtiger sind heute Wissen und gute Verbindungen.' },
      { f: 'Wie viele Menschen leben ungefähr in München?', a: 'rund 1,6 Millionen', x: ['rund 160 000', 'rund 16 Millionen', 'rund 600 000'], w: 'München ist die drittgrößte Stadt Deutschlands nach Berlin und Hamburg.' },
      { f: 'Welcher Standortfaktor war für das <b>Ruhrgebiet</b> früher am wichtigsten?', a: 'die Steinkohle im Boden', x: ['der Flughafen', 'die Alpen in der Nähe', 'die vielen Universitäten'], w: 'Heute zählen Wissen, Verkehr und Lebensqualität mehr als Rohstoffe.' },
      { f: 'Was bedeutet „<b>weicher</b>“ Standortfaktor?', a: 'etwas, das das Leben angenehm macht, zum Beispiel Freizeit, Kultur und Natur', x: ['ein weicher Boden', 'billiger Strom', 'eine Autobahn'], w: 'Harte Faktoren sind zum Beispiel Verkehrswege, Flächen und Kosten.' },
    ],
    S: { kats: ['harter Standortfaktor', 'weicher Standortfaktor'], f: (b) => `<b>${b}</b>: harter oder weicher Standortfaktor?`, h: 'Hart = messbar, kostet Geld. Weich = macht das Leben schön.',
      items: [['Autobahnanschluss', 0], ['Flughafen', 0], ['günstige Grundstücke', 0], ['Fachkräfte', 0], ['Berge und Seen in der Nähe', 1], ['Theater und Museen', 1], ['gutes Image der Stadt', 1], ['viele Freizeitangebote', 1]] },
  });

  // =====================================================
  // Bereich 8: Im Mittelgebirgsland
  // =====================================================
  const MG = { Harz: [10.6, 51.75], 'Schwäbische Alb': [9.4, 48.45], 'Thüringer Becken': [11.0, 51.1], 'Oberrheinische Tiefebene': [8.15, 49.0], Erzgebirge: [12.9, 50.6], Schwarzwald: [8.15, 48.2], 'Thüringer Wald': [10.8, 50.65], Elbsandsteingebirge: [14.15, 50.9] };
  G.mittelgebirge = baue('geo5-mittelgebirge', {
    h: 'Zum Mittelgebirgsland gehören Gebirge (Harz, Erzgebirge, Schwarzwald, Schwäbische Alb), aber auch Becken (Thüringer Becken) und Tiefebenen (Oberrheinische Tiefebene).',
    F: [
      { f: 'Was ist die <b>Oberrheinische Tiefebene</b>?', a: 'eine breite, flache Ebene am Rhein zwischen Schwarzwald und Vogesen', x: ['ein Hochgebirge', 'eine Insel im Rhein', 'ein Tagebau'], w: 'Dort ist es warm, es wachsen Wein, Obst und Gemüse.' },
      { f: 'Was ist ein <b>Becken</b> wie das Thüringer Becken?', a: 'ein tiefer liegendes Gebiet, ringsum von höherem Land umgeben', x: ['eine Badewanne', 'ein Gebirge mit Gletschern', 'ein Meer'], w: 'Im Thüringer Becken gibt es fruchtbare Böden und Ackerbau.' },
      { f: 'Welches Mittelgebirge liegt an der Grenze zwischen Sachsen und Tschechien?', a: 'das Erzgebirge', x: ['der Harz', 'die Schwäbische Alb', 'der Schwarzwald'], w: 'Es heißt so, weil dort jahrhundertelang Erze wie Silber abgebaut wurden.' },
      { f: 'Wie heißt die Landschaft, deren Hänge wie Treppenstufen aussehen (zum Beispiel die Schwäbische Alb)?', a: 'Schichtstufenland', x: ['Marsch', 'Bodden', 'Urstromtal'], w: 'Harte Gesteinsschichten bilden steile Stufen, weiche Schichten flache Hänge.' },
      { f: 'Wovon lebten die Menschen im <b>Erzgebirge</b> früher vor allem?', a: 'vom Bergbau auf Silber, Zinn und andere Erze', x: ['vom Fischfang', 'vom Weinbau', 'vom Containerhafen'], w: 'Später kamen Holzspielzeug und Schnitzkunst dazu.' },
    ],
    extra: {
      mgTippen: () => U.ortTippen('mgTippen', { art: 'deutschland', ortArt: 'gebiet', orte: MG, frage: (m) => `Wo liegt <b>${m === 'Harz' || m === 'Schwarzwald' || m === 'Thüringer Wald' || m === 'Erzgebirge' || m === 'Elbsandsteingebirge' ? 'das Gebirge ' : ''}${m}</b>?`, opts: { fluesse: ['Rhein', 'Elbe', 'Donau', 'Main'] } }),
      mgNennen: () => U.ortNennen('mgNennen', { art: 'deutschland', ortArt: 'gebiet', orte: MG, frage: () => 'Welche Landschaft ist <b>blau</b> eingekreist?', opts: { fluesse: ['Rhein', 'Elbe', 'Donau', 'Main'] } }),
    },
    E: { f: 'Was zeigt das Foto?', arten: [['mittelgebirge', 'ein Mittelgebirge', 'Rundliche Berge, fast ganz bewaldet.'], ['alpen', 'ein Hochgebirge', 'Spitze Felsgipfel mit Schnee.'], ['boerde', 'ein Tiefland mit Feldern', 'Flach und weit, Ackerbau.']] },
  }, { mgTippen: 26, mgNennen: 22, frage: 24, erkennen: 12 });

  G.steigungsregen = baue('geo5-steigungsregen', {
    h: 'Feuchte Luft vom Meer muss am Gebirge aufsteigen. Dabei kühlt sie ab, es bilden sich Wolken, es regnet: Steigungsregen. Talsperren speichern das Wasser.',
    F: [
      { f: 'Warum regnet es im <b>Gebirge</b> mehr als im Flachland?', a: 'Die Luft muss am Gebirge aufsteigen, kühlt ab, und es bilden sich Wolken.', x: ['Weil die Berge den Regen anziehen wie ein Magnet.', 'Weil dort mehr Menschen wohnen.', 'Weil es dort wärmer ist.'], w: 'Diesen Regen nennt man Steigungsregen.' },
      { f: 'Was passiert mit Luft, wenn sie <b>aufsteigt</b>?', a: 'Sie kühlt ab.', x: ['Sie wird wärmer.', 'Sie wird schwerer.', 'Nichts.'], w: 'Kalte Luft kann weniger Wasserdampf halten. Es bilden sich Tröpfchen, also Wolken.' },
      { f: 'Wozu dient eine <b>Talsperre</b>?', a: 'Sie staut einen Fluss, speichert Wasser für Trinkwasser und schützt vor Hochwasser.', x: ['Sie sperrt das Tal für Autos.', 'Sie fängt Fische.', 'Sie erzeugt Wolken.'], w: 'Rund 40 % des Trinkwassers in Sachsen kommt aus Talsperren.' },
      { f: 'Welche ist die größte <b>Trinkwassertalsperre</b> in Sachsen?', a: 'die Talsperre Eibenstock', x: ['die Talsperre Malter', 'der Cospudener See', 'der Bodensee'], w: 'Sie staut die Zwickauer Mulde im Erzgebirge und versorgt den Raum Chemnitz–Zwickau.' },
      { f: 'Auf welcher Seite eines Gebirges regnet es <b>weniger</b>?', a: 'auf der Seite, die vom Wind abgewandt ist (Lee)', x: ['auf der Seite, auf die der Wind trifft (Luv)', 'auf beiden gleich viel', 'auf dem Gipfel gar nicht'], w: 'Die Luft hat ihr Wasser schon auf der anderen Seite abgeregnet.' },
      { f: 'Warum kann im Mittelgebirge plötzlich <b>Hochwasser</b> entstehen?', a: 'Bei starkem Regen fließt das Wasser in den engen, steilen Tälern schnell zusammen.', x: ['Weil dort Ebbe und Flut sind.', 'Weil der Schnee im Sommer friert.', 'Weil die Talsperren zu leer sind.'], w: 'Darum halten Talsperren einen Teil ihres Raums für Hochwasser frei.' },
    ],
    O: [{ t: 'Wie entsteht Steigungsregen? Ordne.', items: ['Wind bringt feuchte Luft vom Meer', 'die Luft trifft auf das Gebirge und steigt auf', 'die Luft kühlt ab', 'Wolken bilden sich', 'es regnet auf der Seite zum Wind'], w: 'Darum ist das Erzgebirge regenreich.', s1: 'Steigungsregen' }],
    E: { f: 'Was zeigt das Foto?', arten: [['talsperre', 'eine Talsperre', 'Eine hohe Staumauer staut einen Fluss zu einem See.'], ['tagebausee', 'einen See in einem alten Tagebau', 'Ein Bergbaurestloch, das geflutet wurde.']] },
    extra: { steigungAnim: () => ({ prompt: 'Auf welcher Seite des Gebirges regnet es <b>mehr</b>? (Der Wind kommt von links.)', figure: D.steigungBild(), choices: ['links (dem Wind zugewandt)', 'rechts (dem Wind abgewandt)', 'auf beiden gleich viel'], correct: 0, hint: 'Wo muss die Luft aufsteigen?', solution: '<b>Links</b>: Dort steigt die Luft auf, kühlt ab und regnet ab.', ex: { mode: 'steigung', art: 'steigungAnim', merk: '<b>Luv</b> (dem Wind zugewandt): Steigungsregen. <b>Lee</b>: trockener.' } }) },
  }, { steigungAnim: 16 });

  const TAL = { Klamm: 'sehr eng, senkrechte Felswände, unten nur der Bach', Kerbtal: 'V-förmig, steile Hänge, unten der Fluss', Sohlental: 'breiter, flacher Talboden (Sohle) mit steilen Hängen', Muldental: 'breit und flach, sanfte Hänge' };
  G.taeler = baue('geo5-taeler', {
    h: 'Fließendes Wasser trägt ab (Erosion) und lagert ab. Talformen: Klamm (eng, senkrecht), Kerbtal (V-Form), Sohlental (flacher Boden), Muldental (breit, sanft).',
    F: [
      { f: 'Was bedeutet <b>Erosion</b>?', a: 'Abtragung von Gestein und Boden durch Wasser, Wind oder Eis', x: ['Ablagerung von Sand am Strand', 'ein Erdbeben', 'das Pflanzen von Bäumen'], w: 'Ein Fluss gräbt sich so immer tiefer ein.' },
      { f: 'Welche Talform ist <b>V-förmig</b>?', a: 'das Kerbtal', x: ['die Klamm', 'das Sohlental', 'das Muldental'], w: 'Der Fluss schneidet sich ein, die Hänge rutschen nach.' },
      { f: 'Welche Talform hat fast <b>senkrechte</b> Wände und ist sehr eng?', a: 'die Klamm', x: ['das Muldental', 'das Kerbtal', 'das Sohlental'], w: 'Klammen entstehen in sehr hartem Gestein, zum Beispiel die Partnachklamm bei Garmisch.' },
      { f: 'Welche Talform hat einen breiten, <b>flachen Boden</b> zwischen steilen Hängen?', a: 'das Sohlental', x: ['die Klamm', 'das Kerbtal', 'das Muldental'], w: 'Der flache Boden heißt Talsohle, dort lagert der Fluss Sand und Kies ab.' },
      { f: 'Wo <b>lagert</b> ein Fluss Sand und Kies ab?', a: 'wo er langsamer fließt, zum Beispiel in breiten Tälern und an der Mündung', x: ['wo er am schnellsten fließt', 'nur im Gebirge', 'nirgends'], w: 'Schnelles Wasser trägt ab, langsames Wasser lagert ab.' },
      { f: 'Wie verändern sich Steine, die ein Fluss lange mitnimmt?', a: 'Sie werden rund und kleiner.', x: ['Sie werden eckiger.', 'Sie werden größer.', 'Sie lösen sich sofort auf.'], w: 'Steine stoßen aneinander und schleifen sich ab.' },
    ],
    S: { kats: Object.keys(TAL), f: (b) => `<b>${b}</b>: Welche Talform?`, h: 'Klamm = eng; Kerbtal = V; Sohlental = flacher Boden; Muldental = breit und sanft.',
      items: [['senkrechte Felswände', 0], ['so eng, dass kaum Licht hineinfällt', 0], ['V-Form', 1], ['Fluss füllt den Talboden ganz aus', 1], ['flache Talsohle mit Wiesen', 2], ['Hänge steil, Boden flach', 2], ['sanfte, flache Hänge', 3], ['breite Mulde', 3]] },
    E: { f: 'Welche Talform zeigt das Foto?', arten: [['klamm', 'Klamm', TAL.Klamm + '.'], ['kerbtal', 'Kerbtal', TAL.Kerbtal + '.'], ['sohlental', 'Sohlental', TAL.Sohlental + '.']] },
    extra: { talQuer: () => { const n = Object.keys(TAL), k = R(0, 3), ch = shuffle(n.slice()); return { prompt: 'Der Querschnitt zeigt ein Tal. Welche <b>Talform</b> ist das?', figure: D.talBild(k), choices: ch, correct: ch.indexOf(n[k]), hint: 'Schau auf die Hänge und den Talboden.', solution: `<b>${n[k]}</b>: ${TAL[n[k]]}.`, ex: { mode: 'tal', art: 'talQuer', k, merk: `<b>${n[k]}</b>: ${TAL[n[k]]}.` } }; } },
  }, { talQuer: 26, erkennen: 16 });

  const GEST = { Granit: 'hart, körnig mit hellen und dunklen Körnern; aus Magma tief in der Erde erstarrt; in der Lausitz', Gneis: 'gestreift, Körner in Lagen; durch Druck und Hitze umgewandelt; im Erzgebirge', Basalt: 'dunkelgrau bis schwarz, feinkörnig, oft in Säulen; aus Lava erstarrt; Burgberg Stolpen', Sandstein: 'aus Sandkörnern zusammengekittet, oft gelblich, weich; im Meer abgelagert; Elbsandsteingebirge' };
  G.gesteine = baue('geo5-gesteine', {
    h: 'Granit: körnig, aus Magma tief in der Erde. Basalt: dunkel, aus Lava. Sandstein: aus Sand im Meer abgelagert. Gneis: gestreift, durch Druck und Hitze umgewandelt.',
    F: [
      { f: 'Aus welchem Gestein ist das <b>Elbsandsteingebirge</b>?', a: 'aus Sandstein', x: ['aus Granit', 'aus Basalt', 'aus Kreide'], w: 'Der Sand lagerte sich vor rund 100 Millionen Jahren in einem Meer ab.' },
      { f: 'Welches Gestein entsteht, wenn <b>Lava</b> an der Erdoberfläche erstarrt?', a: 'Basalt', x: ['Sandstein', 'Granit', 'Gneis'], w: 'Basalt ist dunkel und oft in Säulen zerbrochen, zum Beispiel am Burgberg Stolpen.' },
      { f: 'Welches Gestein entsteht, wenn <b>Magma tief in der Erde</b> langsam erstarrt?', a: 'Granit', x: ['Basalt', 'Sandstein', 'Kalkstein'], w: 'Weil es langsam abkühlt, wachsen große Kristalle: Granit ist körnig.' },
      { f: 'Welches Gestein sieht <b>gestreift</b> aus, weil Druck und Hitze es verändert haben?', a: 'Gneis', x: ['Granit', 'Basalt', 'Sandstein'], w: 'Gneis ist im Erzgebirge weit verbreitet.' },
      { f: 'Aus welchem Gestein wurde die <b>Frauenkirche</b> in Dresden gebaut?', a: 'aus Sandstein', x: ['aus Basalt', 'aus Granit', 'aus Marmor'], w: 'Elbsandstein wird seit Jahrhunderten als Baustein genutzt.' },
      { f: 'Welches Gestein ist am <b>leichtesten</b> abzutragen (zu verwittern)?', a: 'Sandstein', x: ['Granit', 'Basalt', 'Gneis'], w: 'Darum haben Wasser und Wetter im Elbsandsteingebirge so bizarre Felsen geformt.' },
    ],
    S: { kats: Object.keys(GEST), f: (b) => `<b>${b}</b>: Welches Gestein?`, h: 'Granit = körnig. Gneis = gestreift. Basalt = dunkel, Lava. Sandstein = Sandkörner.',
      items: [['körnig mit hellen und dunklen Körnern', 0], ['aus Magma tief in der Erde', 0], ['Lausitz', 0], ['gestreift, in Lagen', 1], ['umgewandelt durch Druck und Hitze', 1], ['dunkel, oft in Säulen', 2], ['aus Lava erstarrt', 2], ['Burgberg Stolpen', 2], ['aus Sandkörnern', 3], ['im Meer abgelagert', 3], ['Elbsandsteingebirge', 3]] },
    E: { f: 'Welches Gestein ist das?', arten: [['granit', 'Granit', GEST.Granit + '.'], ['gneis', 'Gneis', GEST.Gneis + '.'], ['basalt', 'Basalt', GEST.Basalt + '.'], ['sandstein', 'Sandstein', GEST.Sandstein + '.']] },
  }, { erkennen: 26, sortieren: 22 });

  G.elbsandstein = baue('geo5-elbsandstein', {
    h: 'Vor rund 100 Millionen Jahren lagerte sich Sand im Meer ab und wurde zu Sandstein. Das Gestein bekam Risse (Klüfte). Die Elbe und Bäche schnitten Täler hinein, Wasser, Frost und Pflanzen formten Felsen und Tafelberge.',
    F: [
      { f: 'Wo entstand der Sand des Elbsandsteingebirges?', a: 'am Grund eines Meeres', x: ['in einer Wüste', 'in einem Vulkan', 'in einem Gletscher'], w: 'Versteinerte Muscheln im Sandstein beweisen das.' },
      { f: 'Wie heißen die flachen, steilwandigen Berge wie der Lilienstein?', a: 'Tafelberge', x: ['Vulkane', 'Kuppen', 'Dünen'], w: 'Ihre Oberfläche ist flach wie ein Tisch.' },
      { f: 'Seit wann ist ein Teil der Sächsischen Schweiz <b>Nationalpark</b>?', a: 'seit 1990', x: ['seit 1900', 'seit 2020', 'seit 1713'], w: 'Auf tschechischer Seite gibt es seit 2000 den Nationalpark Böhmische Schweiz.' },
      { f: 'Was sind <b>Klüfte</b> im Sandstein?', a: 'Risse und Spalten im Gestein', x: ['Höhlen von Tieren', 'Wanderwege', 'Wasserfälle'], w: 'Entlang der Klüfte dringt Wasser ein und trägt das Gestein ab.' },
      { f: 'Welcher Fluss hat das Tal mitten durch das Elbsandsteingebirge geschnitten?', a: 'die Elbe', x: ['die Mulde', 'die Spree', 'die Neiße'], w: 'Der Name sagt es schon.' },
      { f: 'Wie heißt die berühmte Felsformation mit Brücke über dem Elbtal bei Rathen?', a: 'die Bastei', x: ['die Zugspitze', 'das Rote Kliff', 'der Brocken'], w: 'Die Basteibrücke ist eines der bekanntesten Ausflugsziele Sachsens.' },
    ],
    O: [{ t: 'Wie entstand das Elbsandsteingebirge? Ordne.', items: ['Flüsse bringen Sand in ein Meer', 'der Sand wird zu Sandstein gepresst', 'das Meer zieht sich zurück', 'das Gestein bekommt Risse (Klüfte)', 'Elbe und Bäche schneiden tiefe Täler hinein', 'Tafelberge und Felsnadeln bleiben stehen'], n: 5, w: 'Ablagerung im Meer, dann Abtragung durch Wasser: So entstand die Felslandschaft.' }],
    E: { f: 'Was zeigt das Foto?', arten: [['bastei', 'die Bastei im Elbsandsteingebirge', 'Sandsteinfelsen über dem Elbtal.'], ['sandstein', 'Sandstein aus der Nähe', 'Man sieht die einzelnen Sandkörner.'], ['alpen', 'die Alpen', 'Hochgebirge mit Schnee.']] },
  });

  G.wald = baue('geo5-wald', {
    h: 'Der Wald schützt (Boden, Wasser, Klima), nützt (Holz) und erholt (Freizeit). Nachhaltig heißt: nur so viel Holz schlagen, wie nachwächst. Das schrieb Hans Carl von Carlowitz 1713 in Freiberg.',
    F: [
      { f: 'Was bedeutet <b>nachhaltige</b> Forstwirtschaft?', a: 'Man schlägt nur so viel Holz, wie wieder nachwächst.', x: ['Man holzt alles auf einmal ab.', 'Man pflanzt nur eine Baumart.', 'Man fällt nie einen Baum.'], w: 'So bleibt der Wald für die nächsten Generationen erhalten.' },
      { f: 'Wer hat den Gedanken der <b>Nachhaltigkeit</b> 1713 als Erster aufgeschrieben?', a: 'Hans Carl von Carlowitz aus Freiberg', x: ['Alexander von Humboldt', 'Martin Luther', 'Albert Einstein'], w: 'Der Bergbau im Erzgebirge brauchte so viel Holz, dass der Wald knapp wurde.' },
      { f: 'Wie viel von Deutschland ist mit <b>Wald</b> bedeckt?', a: 'etwa ein Drittel', x: ['etwa ein Zehntel', 'etwa die Hälfte', 'fast alles'], w: '11,5 Millionen Hektar, rund 32 % (Bundeswaldinventur 2022).' },
      { f: 'Wie schützt der Wald vor <b>Hochwasser</b>?', a: 'Der Waldboden saugt Regen auf wie ein Schwamm und gibt ihn langsam ab.', x: ['Die Bäume trinken den ganzen Regen.', 'Der Wald baut Deiche.', 'Gar nicht.'], w: 'Auf kahlen Hängen fließt das Wasser dagegen schnell ab.' },
      { f: 'Was macht ein <b>Förster</b>?', a: 'Er pflegt den Wald, plant das Fällen und Pflanzen und achtet auf Schädlinge.', x: ['Er baut Möbel.', 'Er fängt Fische.', 'Er repariert Autos.'], w: 'Förster sorgen dafür, dass der Wald gesund und nachhaltig genutzt wird.' },
      { f: 'Warum pflanzt man heute mehr <b>Mischwald</b> statt reiner Fichtenwälder?', a: 'Mischwald übersteht Stürme, Trockenheit und Borkenkäfer besser.', x: ['Weil Fichten verboten sind.', 'Weil Mischwald schneller wächst.', 'Weil er weniger Holz liefert.'], w: 'Viele Fichtenwälder sind nach trockenen Jahren abgestorben.' },
    ],
    S: { kats: ['Nutzfunktion', 'Schutzfunktion', 'Erholungsfunktion'], f: (b) => `<b>${b}</b>: Welche Aufgabe des Waldes?`, h: 'Nutzen = Holz und Geld. Schützen = Boden, Wasser, Luft. Erholen = Freizeit.',
      items: [['Holz für Möbel', 0], ['Papier', 0], ['Brennholz', 0], ['hält den Boden am Hang fest', 1], ['filtert die Luft', 1], ['speichert Regenwasser', 1], ['Wandern', 2], ['Pilze sammeln', 2], ['Spielplatz im Wald', 2]] },
    O: [{ t: 'Vom Baum zum Schulheft: Ordne.', items: ['Förster markiert reife Bäume', 'Forstarbeiter fällen die Bäume', 'das Holz kommt ins Papierwerk', 'es wird zu Papier verarbeitet', 'Hefte liegen im Laden'], w: 'Altpapier wiederzuverwenden spart Holz.' }],
    E: { f: 'Was zeigt das Foto?', arten: [['wald', 'einen Mischwald', 'Laub- und Nadelbäume wachsen gemischt.'], ['fichtenwald', 'einen reinen Fichtenwald', 'Nur eine Baumart, dicht in Reihen.']] },
  });

  // =====================================================
  // Bereich 9: Exkursion im Heimatraum
  // =====================================================
  G.exkursion = baue('geo5-exkursion', {
    h: 'Eine Exkursion ist ein Lerngang vor Ort. Sie hat eine Leitfrage, wird vorbereitet, durchgeführt und ausgewertet.',
    F: [
      { f: 'Was ist eine <b>Exkursion</b>?', a: 'ein Lerngang, bei dem man vor Ort etwas untersucht', x: ['ein Ausflug ohne Ziel', 'eine Klassenarbeit', 'ein Film über Geografie'], w: 'Man beobachtet, misst, zählt, befragt und kartiert.' },
      { f: 'Womit beginnt eine gute Exkursion?', a: 'mit einer Leitfrage', x: ['mit dem Mittagessen', 'mit dem Vortrag am Ende', 'mit dem Aufräumen'], w: 'Zum Beispiel: „Wie werden die Gebäude in unserer Hauptstraße genutzt?“' },
      { f: 'Was gehört zur <b>Auswertung</b> einer Exkursion?', a: 'Ergebnisse ordnen, eine Karte oder ein Plakat erstellen, die Leitfrage beantworten', x: ['die Ausrüstung einpacken', 'den Weg planen', 'die Leitfrage ausdenken'], w: 'Zum Schluss stellt man die Ergebnisse der Klasse vor.' },
      { f: 'Was nimmt man zu einer Exkursion mit?', a: 'Karte, Notizblock, Stift, Kamera oder Handy, passende Kleidung', x: ['nur das Pausenbrot', 'den Fernseher', 'gar nichts'], w: 'Je nach Aufgabe auch Maßband, Stoppuhr oder Becherlupe.' },
    ],
    O: [{ t: 'Ordne die Schritte einer Exkursion.', items: ['eine Leitfrage formulieren', 'Weg, Aufgaben und Material planen', 'vor Ort beobachten, messen, befragen', 'die Ergebnisse auswerten', 'die Ergebnisse vorstellen'], w: 'Vorbereitung, Durchführung, Auswertung, Präsentation.' }],
  });

  G.kartieren = baue('geo5-kartieren', {
    h: 'Beim Kartieren trägt man vor Ort in eine Karte ein, wie Gebäude genutzt werden. Jede Nutzung bekommt eine Farbe, die in der Legende steht.',
    F: [
      { f: 'Was bedeutet <b>kartieren</b>?', a: 'vor Ort beobachten und das Ergebnis mit Farben oder Zeichen in eine Karte eintragen', x: ['eine Karte kaufen', 'eine Karte zerschneiden', 'Spielkarten mischen'], w: 'So entsteht eine eigene thematische Karte.' },
      { f: 'Welches Stockwerk kartiert man meist bei der <b>Gebäudenutzung</b> in der Innenstadt?', a: 'das Erdgeschoss', x: ['den Keller', 'das Dach', 'das oberste Stockwerk'], w: 'Im Erdgeschoss sind meist Läden und Gaststätten, darüber oft Büros oder Wohnungen.' },
      { f: 'Was gehört unbedingt zu einer Kartierung?', a: 'eine Legende, die die Farben erklärt', x: ['ein Foto vom Lehrer', 'eine Einwohnerzahl', 'eine Wettervorhersage'], w: 'Ohne Legende versteht niemand die Farben.' },
    ],
    S: { kats: ['Einzelhandel', 'Gastronomie', 'Dienstleistung', 'Wohnen'], f: (b) => `<b>${b}</b>: Wie kartierst du dieses Erdgeschoss?`, h: 'Einzelhandel = Waren kaufen. Gastronomie = essen und trinken. Dienstleistung = Service.',
      items: [['Schuhgeschäft', 0], ['Buchhandlung', 0], ['Bäckerei mit Verkauf', 0], ['Restaurant', 1], ['Eiscafé', 1], ['Imbiss', 1], ['Friseur', 2], ['Bank', 2], ['Arztpraxis', 2], ['Wohnung', 3]] },
  }, { sortieren: 50 });

  G.bach = baue('geo5-bach', {
    h: 'Fließgeschwindigkeit = Strecke : Zeit. Ein schwimmender Gegenstand (zum Beispiel ein Korken) zeigt, wie schnell der Bach fließt. Steine im Bach werden mit der Zeit rund.',
    F: [
      { f: 'Wie misst man einfach die <b>Fließgeschwindigkeit</b> eines Bachs?', a: 'Man lässt einen Korken eine abgemessene Strecke treiben und stoppt die Zeit.', x: ['Man misst die Wassertemperatur.', 'Man zählt die Fische.', 'Man wiegt einen Eimer Wasser.'], w: 'Geschwindigkeit = Strecke : Zeit.' },
      { f: 'Wo fließt ein Bach meist am <b>schnellsten</b>?', a: 'in der Mitte, wo er am tiefsten ist', x: ['direkt am Ufer', 'am Grund unter Steinen', 'überall gleich'], w: 'Am Ufer und am Grund wird das Wasser gebremst.' },
      { f: 'Woran erkennt man, dass ein Stein <b>lange</b> im Bach transportiert wurde?', a: 'Er ist rund und glatt.', x: ['Er ist scharfkantig.', 'Er ist besonders groß.', 'Er ist farbig.'], w: 'Man spricht vom Rundungsgrad: kantig, kantengerundet, gerundet.' },
      { f: 'An welcher Stelle eines Bachs lagert sich <b>Sand</b> ab?', a: 'am Innenufer einer Kurve, wo das Wasser langsamer fließt', x: ['am Außenufer, wo das Wasser schnell fließt', 'mitten im schnellsten Wasser', 'nirgends'], w: 'Am Außenufer trägt der Bach ab (Prallhang), am Innenufer lagert er ab (Gleithang).' },
    ],
    O: [{ t: 'Steine im Bach: Ordne von <b>kurz</b> transportiert bis <b>lange</b> transportiert.', items: ['kantig', 'kantengerundet', 'gerundet'], w: 'Je länger der Transport, desto runder der Stein.' }],
    extra: { geschw: () => { const s = pick([5, 10, 20]), t = pick([5, 10, 20, 25, 40]), v = Math.round(s / t * 100) / 100; return { prompt: `Ein Korken treibt <b>${s} m</b> weit in <b>${t} Sekunden</b>. Wie schnell fließt der Bach?`, fields: [{ answer: v, suffix: 'm pro Sekunde', label: 'Geschwindigkeit' }], hint: 'Strecke geteilt durch Zeit.', solution: `${s} m : ${t} s = <b>${String(v).replace('.', ',')} m pro Sekunde</b>.`, ex: { mode: 'karte', nach: false, art: 'geschw', q: `${s} m in ${t} s?`, opts: [`${String(v).replace('.', ',')} m pro Sekunde`], ok: 0, svg: '', merk: `<b>${String(v).replace('.', ',')} m/s</b>: Strecke : Zeit = ${s} : ${t}.` } }; } },
  }, { geschw: 28 });

  // =====================================================
  // Themenliste Klasse 5 (Reihenfolge und Bereiche = Kapitel im Buch)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'geo5-fach', nr: 1, title: 'Geografie – dein neues Fach', topics: [
        { id: 'geo5-landschaft', buch: 'S. 6–7', title: 'Naturlandschaft und Kulturlandschaft', icon: '🏞', gen: G.landschaft },
      ] },
      { id: 'geo5-erde', nr: 2, title: 'Unser Planet Erde', topics: [
        { id: 'geo5-weltall', buch: 'S. 10–11', title: 'Die Erde im Sonnensystem', icon: '🪐', gen: G.weltall },
        { id: 'geo5-tagnacht', buch: 'S. 12–13', title: 'Tag und Nacht', icon: '🌗', gen: G.tagNacht },
        { id: 'geo5-jahreszeiten', buch: 'S. 12–13', title: 'Jahr und Jahreszeiten', icon: '🍂', gen: G.jahreszeiten },
        { id: 'geo5-abbildungen', buch: 'S. 14–15', title: 'Globus, Weltkarte, Weltraumbild', icon: '🌍', gen: G.abbildungen },
        { id: 'geo5-kontinente', buch: 'S. 16–17', title: 'Kontinente und Ozeane', icon: '🗺', gen: G.kontinente },
        { id: 'geo5-windrose', buch: 'S. 16–17', title: 'Himmelsrichtungen und Windrose', icon: '🧭', gen: G.windrose },
        { id: 'geo5-gradnetz', buch: 'S. 16–17', title: 'Das Gradnetz', icon: '🌐', gen: G.gradnetz },
        { id: 'geo5-atlas', buch: 'S. 18–21', title: 'Mit dem Atlas arbeiten', icon: '📕', gen: G.atlas },
        { id: 'geo5-luftbild', buch: 'S. 22–23', title: 'Vom Luftbild zur Karte', icon: '🛩', gen: G.luftbild },
        { id: 'geo5-massstab', buch: 'S. 24–25', title: 'Maßstab und Entfernungen', icon: '📏', gen: G.massstab },
        { id: 'geo5-bilder', buch: 'S. 28–29', title: 'Bilder und Texte auswerten', icon: '🖼', gen: G.bilderTexte },
        { id: 'geo5-regenwald', buch: 'S. 30–31', title: 'Leben im Tropischen Regenwald', icon: '🌴', gen: G.regenwald },
        { id: 'geo5-wueste', buch: 'S. 32–33', title: 'Leben am Rand der Wüste', icon: '🐪', gen: G.wueste },
        { id: 'geo5-polar', buch: 'S. 34–35', title: 'Leben in den Polargebieten', icon: '🧊', gen: G.polar },
        { id: 'geo5-shanghai', buch: 'S. 36–37', title: 'Leben in der Riesenstadt Shanghai', icon: '🏙', gen: G.shanghai },
      ] },
      { id: 'geo5-deutschland', nr: 3, title: 'Deutschland im Überblick', topics: [
        { id: 'geo5-de-lage', buch: 'S. 52–53', title: 'Lage und Größe Deutschlands', icon: '📍', gen: G.deLage },
        { id: 'geo5-nachbarn', buch: 'S. 52–53', title: 'Die neun Nachbarstaaten', icon: '🤝', gen: G.nachbarn },
        { id: 'geo5-laender', buch: 'S. 52–53', title: 'Bundesländer und Hauptstädte', icon: '🏛', gen: G.laender },
        { id: 'geo5-bevoelkerung', buch: 'S. 52–53', title: 'Bevölkerung und Dichte', icon: '👥', gen: G.bevoelkerung },
        { id: 'geo5-grosslandschaften', buch: 'S. 46–49', title: 'Die Großlandschaften', icon: '⛰', gen: G.grosslandschaften },
        { id: 'geo5-gebirge', buch: 'S. 50–51', title: 'Mittelgebirge und Hochgebirge', icon: '🏔', gen: G.gebirge },
        { id: 'geo5-berlin', buch: 'S. 54–55', title: 'Berlin, die Bundeshauptstadt', icon: '🐻', gen: G.berlin },
        { id: 'geo5-sachsen', buch: 'S. 56–59', title: 'Sachsen und Dresden', icon: '🏰', gen: G.sachsen },
      ] },
      { id: 'geo5-kueste', nr: 4, title: 'An Nordseeküste und Ostseeküste', topics: [
        { id: 'geo5-nord-ostsee', buch: 'S. 64–65', title: 'Nordsee und Ostsee', icon: '🌊', gen: G.nordOstsee },
        { id: 'geo5-kuestenformen', buch: 'S. 64–69', title: 'Küstenformen', icon: '🪨', gen: G.kuestenformen },
        { id: 'geo5-gezeiten', buch: 'S. 70–71', title: 'Ebbe und Flut', icon: '🌙', gen: G.gezeiten },
        { id: 'geo5-watt', buch: 'S. 78–79', title: 'Nationalpark Wattenmeer', icon: '🦭', gen: G.watt },
        { id: 'geo5-kuestenschutz', buch: 'S. 80–83', title: 'Sturmflut und Küstenschutz', icon: '🛡', gen: G.kuestenschutz },
        { id: 'geo5-hafen', buch: 'S. 72–75', title: 'Wirtschaftsraum Küste, Hafen Hamburg', icon: '🚢', gen: G.hafen },
        { id: 'geo5-ruegen', buch: 'S. 84–85', title: 'Urlaubsinsel Rügen', icon: '🏖', gen: G.ruegen },
      ] },
      { id: 'geo5-tiefland', nr: 5, title: 'Im Tiefland', topics: [
        { id: 'geo5-tiefland', buch: 'S. 94–95', title: 'Landschaften im Tiefland', icon: '🌾', gen: G.tiefland },
        { id: 'geo5-kanaele', buch: 'S. 96–97', title: 'Flüsse, Kanäle, Schleusen', icon: '⛴', gen: G.kanaele },
        { id: 'geo5-landwirtschaft', buch: 'S. 98–103', title: 'Landwirtschaft im Tiefland', icon: '🚜', gen: G.landwirtschaft },
        { id: 'geo5-kohle-entstehung', buch: 'S. 106–107', title: 'Wie aus Pflanzen Braunkohle wird', icon: '🌿', gen: G.braunkohleEntstehung },
        { id: 'geo5-braunkohle', buch: 'S. 104–105, 108–109', title: 'Braunkohle in Sachsen', icon: '⛏', gen: G.braunkohle },
        { id: 'geo5-rekultivierung', buch: 'S. 110–111', title: 'Vom Tagebau zum See', icon: '🏊', gen: G.rekultivierung },
      ] },
      { id: 'geo5-stadtdorf', nr: 6, title: 'Leben in der Stadt, Leben im Dorf', topics: [
        { id: 'geo5-stadt', buch: 'S. 120–121', title: 'Was eine Stadt bietet', icon: '🏢', gen: G.stadt },
        { id: 'geo5-dorf', buch: 'S. 122–125', title: 'Das Dorf früher und heute', icon: '🏡', gen: G.dorf },
        { id: 'geo5-umland', buch: 'S. 126–127', title: 'Stadt und Umland, Pendler', icon: '🚆', gen: G.umland },
      ] },
      { id: 'geo5-ballung', nr: 7, title: 'Wo viele Menschen leben und arbeiten', topics: [
        { id: 'geo5-sektoren', buch: 'S. 144–145', title: 'Die drei Wirtschaftsbereiche', icon: '🏭', gen: G.sektoren },
        { id: 'geo5-ballungsgebiet', buch: 'S. 132–133', title: 'Ballungsgebiete in Deutschland', icon: '🌆', gen: G.ballungsgebiet },
        { id: 'geo5-ruhrgebiet', buch: 'S. 132–135', title: 'Das Ruhrgebiet im Wandel', icon: '⚒', gen: G.ruhrgebiet },
        { id: 'geo5-diagramme', buch: 'S. 136–137', title: 'Tabellen und Diagramme lesen', icon: '📊', gen: G.diagramme },
        { id: 'geo5-muenchen', buch: 'S. 138–141', title: 'München und seine Standortfaktoren', icon: '🧪', gen: G.muenchen },
      ] },
      { id: 'geo5-mittelgebirgsland', nr: 8, title: 'Im Mittelgebirgsland', topics: [
        { id: 'geo5-mittelgebirge', buch: 'S. 148–149', title: 'Landschaften im Mittelgebirgsland', icon: '🌲', gen: G.mittelgebirge },
        { id: 'geo5-steigungsregen', buch: 'S. 150–151', title: 'Steigungsregen und Talsperren', icon: '🌧', gen: G.steigungsregen },
        { id: 'geo5-taeler', buch: 'S. 152–153', title: 'Flüsse formen Täler', icon: '〰', gen: G.taeler },
        { id: 'geo5-gesteine', buch: 'S. 154–155', title: 'Gesteine entdecken', icon: '🪨', gen: G.gesteine },
        { id: 'geo5-elbsandstein', buch: 'S. 156–157', title: 'Im Elbsandsteingebirge', icon: '🧗', gen: G.elbsandstein },
        { id: 'geo5-wald', buch: 'S. 158–161', title: 'Wald und Holz', icon: '🌳', gen: G.wald },
      ] },
      { id: 'geo5-exk', nr: 9, title: 'Exkursion im Heimatraum', topics: [
        { id: 'geo5-exkursion', buch: 'S. 168–169', title: 'Eine Exkursion planen', icon: '🎒', gen: G.exkursion },
        { id: 'geo5-kartieren', buch: 'S. 170–171', title: 'Gebäudenutzung kartieren', icon: '🖍', gen: G.kartieren },
        { id: 'geo5-bach', buch: 'S. 172–173', title: 'Einen Bach untersuchen', icon: '💧', gen: G.bach },
      ] },
    ],
  };
})();
