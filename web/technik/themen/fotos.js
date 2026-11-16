/* TecDax – freie Fotos von Wikimedia Commons (Fotograf und Lizenz stehen im Bild und in bildnachweis.html).
 * Jedes Foto: Name der Zeichnung → { datei, von, liz, titel, px?, aus?, ganz? } (Felder wie LernDaxBausteine.fotoBild).
 * Das Foto liegt über der eigenen Zeichnung gleichen Namens; ohne Netz bleibt die Zeichnung stehen.
 * Ausgesucht und angesehen im eingebauten Browser. Keine Bilder aus Büchern.
 */
(function () {
  const D = window.TecDax;
  D.fotos = {
    tastatur: { datei: "German-T2-Keyboard-Prototype-May-2012.jpg", von: "Karl432", liz: 'CC BY-SA 3.0', px: [3792, 1441], ganz: true, titel: "Tastatur mit deutscher Belegung" },
    maus: { datei: "2023 Mysz komputerowa Logitech G903 Lightspeed.jpg", von: "Jacek Halicki", liz: 'CC BY-SA 4.0', px: [4382, 3020], ganz: true, titel: "Computermaus" },
    bildschirm: { datei: "EIZO Foris FG2421 VGA computer monitor displaying test pattern.png", von: "Lucasbosch", liz: 'CC BY-SA 4.0', px: [4568, 3213], ganz: true, titel: "Bildschirm" },
    drucker: { datei: "Canon S520 ink jet printer.jpg", von: "André Karwath", liz: 'CC BY-SA 2.5', px: [1000, 757], ganz: true, titel: "Tintenstrahldrucker" },
    scanner: { datei: "Scanner.view.750pix.jpg", von: "Boffy b, Arpingstone", liz: 'gemeinfrei', px: [460, 550], ganz: true, titel: "Flachbettscanner" },
    lautsprecher: { datei: "PC speakers adapter plug and 3.5mm audio plug.jpg", von: "Leon Brooks", liz: 'gemeinfrei', px: [1920, 2560], ganz: true, titel: "Computerlautsprecher" },
    mikrofon: { datei: "Tripod microphone stand.jpg", von: "Bubba73 (Jud McCranie)", liz: 'CC BY-SA 3.0', px: [1938, 2658], ganz: true, titel: "Mikrofon auf Stativ" },
    webcam: { datei: "USB webcam for PC.jpg", von: "WrS.tm.pl", liz: 'CC0', px: [2560, 1440], ganz: true, titel: "Webcam" },
    usbstick: { datei: "Kingston Technology DataTraveler G4 USB flash drive USB 3.0 32 Gb.jpg", von: "Dmitry Makeev", liz: 'CC BY-SA 4.0', px: [2900, 1462], ganz: true, titel: "USB-Stick" },
    beamer: { datei: "InFocus IN34.jpg", von: "Dave Pape", liz: 'gemeinfrei', px: [2796, 1941], ganz: true, titel: "Beamer" },
    dekupiersaege: { datei: "Scroll saw - Dremel.jpg", von: "Scott Ehardt", liz: 'gemeinfrei', px: [1112, 793], ganz: true, titel: "Dekupiersäge" },
    tischbohrmaschine: { datei: "Tischbohrmaschine Schule.png", von: "Arbeitsding", liz: 'CC BY-SA 4.0', px: [513, 980], ganz: true, titel: "Tischbohrmaschine" },
    akkuschrauber: { datei: "MacAllister cordless screwdriver 02.jpg", von: "LoMit", liz: 'CC BY-SA 4.0', px: [4195, 4122], ganz: true, titel: "Akkuschrauber" },
    naehmaschine: { datei: "Bernina 1005 sewing machine in its cover in Tuntorp 2.jpg", von: "W.carter", liz: 'CC BY 4.0', px: [4654, 3022], ganz: true, titel: "Nähmaschine" },
    laubsaege: { datei: "Laubsäge auf grauem Untergrund.jpg", von: "Gerd Fahrenhorst", liz: 'CC BY 4.0', px: [4495, 3351], ganz: true, titel: "Laubsäge" },
    feile: { datei: "Glardon Vallorbe LA2442-0 140 mm Swiss cut 0 6-piece needle file set.jpg", von: "Lucasbosch", liz: 'CC BY-SA 3.0', px: [11112, 4139], ganz: true, titel: "Feilen" },
    schraubzwinge: { datei: "1960s F clamp by Broederna Wibells Smidesfabrik Eskilstuna Sweden.jpg", von: "R. Henrik Nilsson", liz: 'CC BY 4.0', px: [3696, 2244], ganz: true, titel: "Schraubzwinge" },
    anschlagwinkel: { datei: "Try Square.jpg", von: "Luke Milburn", liz: 'CC BY 2.0', px: [3648, 2736], ganz: true, titel: "Anschlagwinkel" },
    messschieber: { datei: "2020 Suwmiarka cyfrowa.jpg", von: "Jacek Halicki", liz: 'CC BY-SA 4.0', px: [5046, 2103], ganz: true, titel: "Digitaler Messschieber" },
    schutzbrille: { datei: "Safety Goggles.jpg", von: "DJSparky", liz: 'CC BY-SA 4.0', px: [1945, 3862], ganz: true, titel: "Schutzbrille" },
  };
  Object.entries(D.fotos).forEach(([name, f]) => {
    const zeichnung = D.bilder[name];
    if (zeichnung && f.datei) D.bilder[name] = () => LernDaxBausteine.fotoBild(zeichnung, f);
  });
})();
