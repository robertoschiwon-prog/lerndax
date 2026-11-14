/* GeoDax – freie Fotos von Wikimedia Commons (Fotograf und Lizenz stehen im Bild und in bildnachweis.html).
 * Jedes Foto: Name → { datei, von, liz, titel, px?, aus?, ganz? } (Felder wie LernDaxBausteine.fotoBild).
 * Ausgesucht und angesehen im eingebauten Browser. Keine Bilder aus dem Schulbuch.
 */
(function () {
  const D = window.GeoDax;
  Object.assign(D.fotos, {
    naturlandschaft: { datei: "Reschbachklause bei Finsterau im Nationalpark Bayerischer Wald.jpg", von: "Bayerwaldpfade", liz: 'CC BY-SA 4.0', px: [3000, 2000], titel: "Bergbach im Nationalpark Bayerischer Wald" },
    regenwald: { datei: "Cheow Lan Lake, Rainforest, Khao Sok, Thailand.jpg", von: "Vyacheslav Argenberg", liz: 'CC BY 4.0', px: [4032, 2688], titel: "Tropischer Regenwald in Thailand" },
    kulturlandschaft: { datei: "2025-09-20 D500-0784 Achim-Lammerts Rechtenbach-Protestantische-Pfarrkirche-Rheinebene.jpg", von: "Achim Lammerts", liz: 'CC BY-SA 4.0', px: [5568, 3712], titel: "Dorf mit Kirche, Weinbergen und Feldern" },
    luftbildSenkrecht: { datei: "Rettern Orthophoto-20250426-RM-165143.jpg", von: "Reinhold Möller", liz: 'CC BY-SA 4.0', px: [5272, 3948], titel: "Senkrechtluftbild eines Dorfes" },
    polar: { datei: "South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 02.jpg", von: "Godot13", liz: 'CC BY-SA 4.0', px: [5926, 3109], titel: "Eisberg im Südpolarmeer" },
    weltraumbild: { datei: "The Earth seen from Apollo 17.jpg", von: "NASA", liz: 'gemeinfrei', px: [3000, 3002], titel: "Die Erde, von Apollo 17 aus fotografiert" },
    weltkarteFoto: { art: 'Karte', datei: "Physical map of the world, June 2003. LOC 2003684341.jpg", von: "CIA (USA)", liz: 'gemeinfrei', px: [11741, 6525], titel: "Physische Weltkarte" },
    luftbildSchraeg: { datei: "Dresden Luftbild Stadtteil Altstadt Ostansicht 2005.jpg", von: "Henry Mühlpfordt", liz: 'CC BY-SA 3.0', px: [1120, 840], titel: "Schrägluftbild der Dresdner Altstadt" },
    globus: { datei: "Bellerby & Co Desk Globe Range.jpg", von: "Peter Bellerby", liz: 'CC BY-SA 3.0', px: [4272, 2856], titel: "Globen" },
    sahel: { datei: "Flickr - stringer bel - The road to Timbuktu, Mali (1).jpg", von: "Annabel Symington", liz: 'CC BY 2.0', px: [1722, 1146], titel: "Sahel in Mali" },
    stadtplan: { art: 'Karte', datei: "Königsberg Stadtplan 1905.svg", von: "Furfur", liz: 'CC BY-SA 4.0', px: [1923, 1536], titel: "Stadtplan" },
    shanghai: { datei: "Pudong Shanghai November 2017 panorama.jpg", von: "King of Hearts", liz: 'CC BY-SA 4.0', px: [10200, 5100], titel: "Shanghai, Stadtteil Pudong" },
    heide: { datei: "2021 Brunsberg Sproetze.jpg", von: "Ichwarsnur", liz: 'CC BY-SA 4.0', px: [8000, 5000], titel: "Lüneburger Heide" },
    alpen: { datei: "Watzmann mit Schönfeldspitze.jpg", von: "Jörg Braukmann", liz: 'CC BY-SA 4.0', px: [5924, 3000], titel: "Watzmann in den Alpen" },
    tiefland: { datei: "Haltern am See, Naturpark Hohe Mark, Weizenfeld -- 2024 -- 4442.jpg", von: "Dietmar Rabich", liz: 'CC BY-SA 4.0', px: [6720, 3780], titel: "Weizenfeld im Tiefland" },
    boerde: { datei: "Hellemmes champ betterave.jpg", von: "Velvet", liz: 'CC BY-SA 4.0', px: [4713, 2688], titel: "Zuckerrübenfeld" },
    mittelgebirge: { datei: "Naturpark Thüringer Wald Wachstein Geotop Panorama.jpg", von: "Jungsystems", liz: 'CC BY-SA 4.0', px: [12584, 1971], titel: "Thüringer Wald" },
    reichstag: { datei: "Berlin reichstag west panorama.jpg", von: "Matthew Field", liz: 'GFDL 1.2', px: [6000, 2708], titel: "Reichstagsgebäude in Berlin" },
    alpenvorland: { datei: "Starnberger See mit Karwendel Alpen im Hintergrund.JPG", von: "Schlaier", liz: 'CC BY 3.0', px: [4416, 3312], titel: "Starnberger See, dahinter die Alpen" },
    frauenkirche: { datei: "Frauenkirche-dresden.jpg", von: "Ronny Kreutel", liz: 'gemeinfrei', px: [2335, 2000], titel: "Frauenkirche Dresden" },
    containerhafen: { datei: "Portainers, WPAhoi, Waltershofer Hafen, Hamburg (P1080572).jpg", von: "Matti Blume", liz: 'CC BY-SA 4.0', px: [3744, 2808], titel: "Containerhafen in Hamburg" },
    kliff: { datei: "Panorama vor dem Roten Kliff.jpg", von: "Jörg Braukmann", liz: 'CC BY-SA 4.0', px: [7248, 1000], titel: "Rotes Kliff auf Sylt" },
    kreide: { datei: "2019 - Nationalpark Jasmund - 03.jpg", von: "Moahim", liz: 'CC BY-SA 4.0', px: [6114, 4218], titel: "Kreideküste im Nationalpark Jasmund" },
    flachkueste: { datei: "Heringsdorf IMG 2919aa.jpg", von: "Christof46", liz: 'CC BY-SA 4.0', px: [4284, 2778], titel: "Strand in Heringsdorf auf Usedom" },
    bodden: { datei: "Fishing, Saaler Bodden, Ribnitz-Damgarten (1X7A2751).jpg", von: "Matti Blume", liz: 'CC BY-SA 4.0', px: [5760, 3840], titel: "Saaler Bodden" },
    watt: { datei: "Zeedijk bij Koehool. 27-07-2026. (d.j.b.) 04.jpg", von: "Dominicus Johannes Bergsma", liz: 'CC BY-SA 4.0', px: [5138, 3425], titel: "Wattenmeer bei Ebbe" },
    seehund: { datei: "Common seal (Phoca vitulina).jpg", von: "Charles J. Sharp", liz: 'CC BY-SA 4.0', px: [2999, 2000], titel: "Seehund" },
    wattwurm: { datei: "Lugworm casts on mudflats of Gullmarsviken, Gullmarn 4.jpg", von: "W.carter", liz: 'CC0', px: [4864, 3086], titel: "Kothäufchen des Wattwurms" },
    foerde: { datei: "Kappeln -Schlei Luftbild 20190824.jpg", von: "Pymouss", liz: 'CC BY-SA 4.0', px: [4125, 2750], titel: "Die Schlei, eine Förde" },
    buhne: { datei: "Kühlungsborn, Blick auf die Ostsee, Buhne -- 2024 -- 5219.jpg", von: "Dietmar Rabich", liz: 'CC BY-SA 4.0', px: [6720, 4480], titel: "Buhne an der Ostsee" },
    duene: { datei: "Nes (NL), Strand -- 2026 -- 1791.jpg", von: "Dietmar Rabich", liz: 'CC BY-SA 4.0', px: [7720, 5147], titel: "Düne mit Strandhafer" },
    deich: { datei: "Bremerhaven, Deich -- 2024 -- 2286.jpg", von: "Dietmar Rabich", liz: 'CC BY-SA 4.0', px: [4896, 3264], titel: "Deich in Bremerhaven" },
    tagebau: { datei: "Jüchen, Braunkohletagebau Garzweiler, Blick vom Aussichtspunkt Jackerath -- 2021 -- 5659.jpg", von: "Dietmar Rabich", liz: 'CC BY-SA 4.0', px: [6687, 4458], titel: "Braunkohletagebau Garzweiler" },
    foerderbruecke: { datei: "Lichterfeld EE 09-2015 Foerderbruecke F60 img6.jpg", von: "A. Savin", liz: 'CC BY-SA 3.0', px: [5435, 3057], titel: "Förderbrücke F60 in Lichterfeld" },
    tagebausee: { datei: "Lichterfeld EE 09-2015 Bergheider See.jpg", von: "A. Savin", liz: 'CC BY-SA 3.0', px: [5472, 3078], titel: "Bergheider See, ein früherer Tagebau" },
    trogbruecke: { datei: "Magdeburg Kanalbrücke aerial view 13.jpg", von: "Olivier Cleynen", liz: 'CC BY 4.0', px: [4056, 3040], titel: "Kanalbrücke Magdeburg" },
    schleuse: { datei: "Sülfeld Neue Schleuse.jpg", von: "Richard Bartz", liz: 'CC BY-SA 3.0', px: [10027, 6560], titel: "Schleuse Sülfeld am Mittellandkanal" },
    zeche: { datei: "Zeche Zollverein abends.jpg", von: "Thomas Wolf (foto-tw.de)", liz: 'CC BY-SA 3.0 de', px: [13085, 8904], titel: "Zeche Zollverein in Essen" },
    muenchen: { datei: "Vista panorámica desde Olympiapark, Múnich, Alemania 2012-04-28, DD 03.JPG", von: "Diego Delso", liz: 'CC BY-SA 3.0', px: [4785, 2713], titel: "München mit den Alpen" },
    kerbtal: { datei: "Pahalgam Valley.jpg", von: "KennyOMG", liz: 'CC BY-SA 3.0', px: [6745, 3762], titel: "Kerbtal" },
    klamm: { datei: "20230608 Partnachklamm 08.jpg", von: "Flocci Nivis", liz: 'CC BY 4.0', px: [6016, 4016], titel: "Partnachklamm" },
    talsperre: { datei: "Edersee, Staumauer, 2011-08 CN-01.jpg", von: "kaʁstn", liz: 'CC BY-SA 3.0 de', px: [7751, 3750], titel: "Staumauer am Edersee" },
    granit: { datei: "Weinsberger Granit sl5.jpg", von: "Stefan Lefnaer", liz: 'CC BY-SA 4.0', px: [4128, 3096], titel: "Granit" },
    gneis: { datei: "Banded gneiss, Six Mile Lake.jpg", von: "The Cosmonaut", liz: 'CC BY-SA 2.5 ca', px: [4005, 2700], titel: "Gneis" },
    basalt: { datei: "Sinfonía de las Piedras, valle de Garni, Armenia, 2016-10-02, DD 33.jpg", von: "Diego Delso", liz: 'CC BY-SA 4.0', px: [8688, 5792], titel: "Basaltsäulen" },
    bastei: { datei: "Basteibrücke morgens (Zuschnitt).jpg", von: "Thomas Wolf (foto-tw.de)", liz: 'CC BY-SA 3.0 de', px: [4825, 3452], titel: "Bastei mit Basteibrücke" },
    fichtenwald: { datei: "Spruce forest at Holma.jpg", von: "W.carter", liz: 'CC0', px: [4864, 3648], titel: "Fichtenwald" },
    wald: { datei: "Mischwald Herbst.jpg", von: "Friedrich Böhringer", liz: 'CC BY-SA 2.5', px: [3622, 2076], titel: "Mischwald im Herbst" },
    sandstein: { datei: "Basteifelsen bei Rathen im Nationalpark Sächsische Schweiz.jpg", von: "Marc Lautenbacher", liz: 'CC BY-SA 4.0', px: [5542, 3744], titel: "Sandsteinfelsen in der Sächsischen Schweiz" },
  });
  // Für jedes Foto, das in einer Aufgabe vorkommt, aber (noch) fehlt: Platzhalter mit Namen
  const genutzt = new Set();
  Object.values(D.banken).forEach((b) => (b.E ? b.E.arten : []).forEach((a) => genutzt.add(a[0])));
  ['alpen', 'bastei'].forEach((n) => genutzt.add(n));
  genutzt.forEach((n) => { if (!D.fotos[n]) D.fotos[n] = { titel: n, fehlt: true }; });
  D.fotosAnmelden();
})();
