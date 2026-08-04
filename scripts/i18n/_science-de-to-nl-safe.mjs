/** Safe DE→NL: long phrases + long content words only (no article/umlaut destruction). */

export const DE_NL_PHRASES = [
  ["Welches Organ nutzen wir zum Sehen?", "Welk orgaan gebruiken we om te zien?"],
  ["Welches Material ist weich?", "Welk materiaal is zacht?"],
  ["Was geschieht mit einer Pflanze, wenn sie kein Wasser hat?", "Wat gebeurt er met een plant als hij geen water heeft?"],
  ["Sie welkt und wird schwach", "Hij verwelkt en wordt zwak"],
  ["Was ist die Aufgabe der Nieren im menschlichen Körper?", "Wat is de taak van de nieren in het menselijk lichaam?"],
  ["Die Nieren filtern Blut, entfernen Abfallstoffe und überschüssiges Wasser und bilden Urin, der den Körper verlässt.", "De nieren filteren bloed, verwijderen afvalstoffen en extra water en maken urine die het lichaam verlaat."],
  ["Menschen haben zwei Nieren.", "Mensen hebben twee nieren."],
  ["menschlichen Körper", "menselijk lichaam"],
  ["menschliche Körper", "menselijk lichaam"],
  ["Abfallstoffe aus dem Blut zu filtern und mit dem Urin auszuscheiden", "Afvalstoffen uit het bloed te filteren en met de urine uit te scheiden"],
  ["Nahrung zu zerlegen und Galle zu erzeugen", "Voedsel af te breken en gal te maken"],
  ["Blut wie das Herz zu pumpen", "Bloed te pompen zoals het hart"],
  ["Sauerstoff gegen Kohlenstoffdioxid auszutauschen", "Zuurstof tegen koolstofdioxide uit te wisselen"],
  ["Die Augen nehmen Licht auf, damit das Gehirn ein Bild von der Umgebung erzeugen kann.", "De ogen nemen licht op, zodat de hersenen een beeld van de omgeving kunnen vormen."],
  ["Die fünf Hauptsinne sind Sehen, Hören, Riechen, Schmecken und Tasten.", "De vijf belangrijkste zintuigen zijn zien, horen, ruiken, proeven en aanraken."],
  ["Die Augen senden Signale über den Sehnerv an das Gehirn.", "De ogen sturen signalen via de oogzenuw naar de hersenen."],
  ["Baumwolle ist weich, deshalb wird sie oft für bequeme Kleidung verwendet.", "Katoen is zacht en wordt daarom vaak gebruikt voor comfortabele kleding."],
  ["Weiche Materialien fühlen sich sanft an.", "Zachte materialen voelen zacht aan."],
  ["Baumwolle stammt von der Baumwollpflanze.", "Katoen komt van de katoenplant."],
  ["Wasser ist unverzichtbar. Ohne Wasser welkt eine Pflanze, die Blätter trocknen aus, und die Pflanze kann absterben.", "Water is onmisbaar. Zonder water verwelkt een plant, drogen de bladeren uit en kan de plant afsterven."],
  ["Wasser hilft einer Pflanze, am Leben und kräftig zu bleiben.", "Water helpt een plant levend en sterk te blijven."],
  ["Wurzeln nehmen Wasser aus der Erde auf.", "Wortels nemen water uit de grond op."],
  ["Sie wächst noch lange weiter, wenn sie viel Licht hat", "Hij groeit nog lang door als er veel licht is"],
  ["Ihre Blätter bleiben lange aufrecht und grün ohne Wasser", "De bladeren blijven lang rechtop en groen zonder water"],
  ["Sie stellt die Atmung ein, bis wieder Wasser da ist", "Hij stopt met ademen tot er weer water is"],
];

export const DE_NL_WORDS = [
  ["Kohlenstoffdioxid", "koolstofdioxide"],
  ["Kohlendioxid", "koolstofdioxide"],
  ["überschüssiges", "extra"],
  ["überschüssig", "extra"],
  ["Abfallstoffe", "afvalstoffen"],
  ["Nährstoffe", "voedingsstoffen"],
  ["Fotosynthese", "fotosynthese"],
  ["Bestäubung", "bestuiving"],
  ["Lebensraum", "leefgebied"],
  ["Anpassung", "aanpassing"],
  ["Sauerstoff", "zuurstof"],
  ["Stickstoff", "stikstof"],
  ["Wasserstoff", "waterstof"],
  ["Temperatur", "temperatuur"],
  ["Experiment", "experiment"],
  ["Hypothese", "hypothese"],
  ["Beobachtung", "waarneming"],
  ["Messungen", "metingen"],
  ["Messung", "meting"],
  ["Ergebnisse", "resultaten"],
  ["Ergebnis", "resultaat"],
  ["Schlussfolgerung", "conclusie"],
  ["Kontrollgruppe", "controlegroep"],
  ["Recycling", "recycling"],
  ["Umwelt", "milieu"],
  ["Giftstoffe", "gifstoffen"],
  ["Nahrung", "voedsel"],
  ["Pflanzen", "planten"],
  ["Pflanze", "plant"],
  ["Tiere", "dieren"],
  ["Säugetiere", "zoogdieren"],
  ["Säugetier", "zoogdier"],
  ["Vögel", "vogels"],
  ["Vogel", "vogel"],
  ["Fische", "vissen"],
  ["Fisch", "vis"],
  ["Insekten", "insecten"],
  ["Insekt", "insect"],
  ["Flügel", "vleugels"],
  ["Federn", "veren"],
  ["Feder", "veer"],
  ["Flossen", "vinnen"],
  ["Flosse", "vin"],
  ["Kiemen", "kieuwen"],
  ["Schnabel", "snavel"],
  ["Wurzeln", "wortels"],
  ["Wurzel", "wortel"],
  ["Blätter", "bladeren"],
  ["Blatt", "blad"],
  ["Blüten", "bloemen"],
  ["Blüte", "bloem"],
  ["Pollen", "stuifmeel"],
  ["Stängel", "stengel"],
  ["Materialien", "materialen"],
  ["Material", "materiaal"],
  ["Metall", "metaal"],
  ["Kunststoff", "plastic"],
  ["Holz", "hout"],
  ["Glas", "glas"],
  ["Stein", "steen"],
  ["Baumwolle", "katoen"],
  ["flüssig", "vloeibaar"],
  ["gasförmig", "gasvormig"],
  ["Schmelzen", "smelten"],
  ["schmelzen", "smelten"],
  ["Gefrieren", "bevriezen"],
  ["gefrieren", "bevriezen"],
  ["Verdampfen", "verdampen"],
  ["verdampfen", "verdampen"],
  ["Isolator", "isolator"],
  ["Elektrizität", "elektriciteit"],
  ["Magnete", "magneten"],
  ["Magnet", "magneet"],
  ["Schwerkraft", "zwaartekracht"],
  ["Kräfte", "krachten"],
  ["Lungen", "longen"],
  ["Lunge", "long"],
  ["Leber", "lever"],
  ["Nieren", "nieren"],
  ["Niere", "nier"],
  ["Magen", "maag"],
  ["Knochen", "botten"],
  ["Muskeln", "spieren"],
  ["Muskel", "spier"],
  ["Verdauung", "spijsvertering"],
  ["Verdauungssystem", "spijsverteringsstelsel"],
  ["Nervensystem", "zenuwstelsel"],
  ["Kreislauf", "bloedsomloop"],
  ["Atmung", "ademhaling"],
  ["Organe", "organen"],
  ["Organ", "orgaan"],
  ["Zellen", "cellen"],
  ["Zelle", "cel"],
  ["Körper", "lichaam"],
  ["Aufgabe", "taak"],
  ["Aufgaben", "taken"],
  ["Beispiel", "voorbeeld"],
  ["Beispiele", "voorbeelden"],
  ["Unterschied", "verschil"],
  ["Erklärung", "uitleg"],
  ["wichtig", "belangrijk"],
  ["einfach", "eenvoudig"],
  ["natürlich", "natuurlijk"],
  ["gesund", "gezond"],
  ["schädlich", "schadelijk"],
  ["sicher", "veilig"],
  ["gefährlich", "gevaarlijk"],
  ["weich", "zacht"],
  ["Menschen", "mensen"],
  ["Kinder", "kinderen"],
  ["Schüler", "leerlingen"],
  ["Lehrer", "leerkracht"],
  ["Eltern", "ouders"],
  ["Wärme", "warmte"],
  ["Energie", "energie"],
  ["Wetter", "weer"],
  ["Klima", "klimaat"],
  ["Jahreszeiten", "seizoenen"],
  ["Jahreszeit", "seizoen"],
  ["Wolken", "wolken"],
  ["Wolke", "wolk"],
  ["Regen", "regen"],
  ["Schatten", "schaduw"],
  ["Dunkelheit", "duisternis"],
  ["Sonne", "zon"],
  ["Monde", "manen"],
  ["Mond", "maan"],
  ["Sterne", "sterren"],
  ["Stern", "ster"],
  ["Erde", "Aarde"],
  ["Boden", "grond"],
  ["Wasser", "water"],
  ["Luft", "lucht"],
  ["Licht", "licht"],
  ["Blut", "bloed"],
  ["Urin", "urine"],
  ["Haut", "huid"],
  ["Herz", "hart"],
  ["Gehirn", "hersenen"],
  ["Augen", "ogen"],
  ["Ohren", "oren"],
  ["Nase", "neus"],
  ["Zunge", "tong"],
  ["Zähne", "tanden"],
  ["filtern", "filteren"],
  ["entfernen", "verwijderen"],
  ["bilden", "maken"],
  ["helfen", "helpen"],
  ["hilft", "helpt"],
  ["wachsen", "groeien"],
  ["wächst", "groeit"],
  ["welkt", "verwelkt"],
  ["überleben", "overleven"],
  ["Überleben", "overleven"],
  ["atmen", "ademen"],
  ["schwimmen", "zwemmen"],
  ["fliegen", "vliegen"],
  ["richtig", "juist"],
  ["falsch", "onjuist"],
  ["Welches", "Welk"],
  ["Welcher", "Welke"],
  ["Welche", "Welke"],
  ["Warum", "Waarom"],
].sort((a, b) => b[0].length - a[0].length);

export function deToNlSafe(de) {
  let out = String(de ?? "");
  if (!out.trim()) return out;
  for (const [a, b] of DE_NL_PHRASES) {
    if (out.includes(a)) out = out.split(a).join(b);
  }
  for (const [a, b] of DE_NL_WORDS) {
    const re = new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    out = out.replace(re, b);
  }
  // remaining common German glue (word-boundary, length>=3)
  out = out
    .replace(/\bund\b/g, "en")
    .replace(/\boder\b/g, "of")
    .replace(/\bnicht\b/g, "niet")
    .replace(/\bauch\b/g, "ook")
    .replace(/\bnur\b/g, "alleen")
    .replace(/\bmehr\b/g, "meer")
    .replace(/\bwenn\b/g, "als")
    .replace(/\bweil\b/g, "omdat")
    .replace(/\bdann\b/g, "dan")
    .replace(/\bdurch\b/g, "door")
    .replace(/\bfür\b/g, "voor")
    .replace(/\bmit\b/g, "met")
    .replace(/\bohne\b/g, "zonder")
    .replace(/\büber\b/g, "over")
    .replace(/\bunter\b/g, "onder")
    .replace(/\bzwischen\b/g, "tussen")
    .replace(/\bwährend\b/g, "tijdens")
    .replace(/\bkönnen\b/g, "kunnen")
    .replace(/\bkann\b/g, "kan")
    .replace(/\bmüssen\b/g, "moeten")
    .replace(/\bmuss\b/g, "moet")
    .replace(/\bwerden\b/g, "worden")
    .replace(/\bwird\b/g, "wordt")
    .replace(/\bhaben\b/g, "hebben")
    .replace(/\bhat\b/g, "heeft")
    .replace(/\bsind\b/g, "zijn")
    .replace(/\bist\b/g, "is")
    .replace(/\bWas\b/g, "Wat")
    .replace(/\bWie\b/g, "Hoe")
    .replace(/\bvon\b/g, "van")
    .replace(/\baus\b/g, "uit")
    .replace(/\bauf\b/g, "op")
    .replace(/\bbei\b/g, "bij")
    .replace(/\bnach\b/g, "na")
    .replace(/\bvor\b/g, "vóór")
    .replace(/\bzu\b/g, "naar")
    .replace(/\bzum\b/g, "om te")
    .replace(/\bzur\b/g, "naar de")
    .replace(/\bim\b/g, "in het")
    .replace(/\bins\b/g, "in het")
    .replace(/\bam\b/g, "aan het")
    .replace(/\bdem\b/g, "het")
    .replace(/\bden\b/g, "de")
    .replace(/\bder\b/g, "de")
    .replace(/\bdie\b/g, "de")
    .replace(/\bdas\b/g, "het")
    .replace(/\bein\b/g, "een")
    .replace(/\beine\b/g, "een")
    .replace(/\beinem\b/g, "een")
    .replace(/\beinen\b/g, "een")
    .replace(/\keiner\b/g, "geen")
    .replace(/\bkein\b/g, "geen")
    .replace(/\bkeine\b/g, "geen")
    .replace(/\bsie\b/g, "zij")
    .replace(/\bSie\b/g, "Zij")
    .replace(/\bwir\b/g, "we")
    .replace(/\bdu\b/g, "je")
    .replace(/\bdich\b/g, "je")
    .replace(/\bdein\b/g, "je")
    .replace(/\bdeine\b/g, "je")
    .replace(/\bihr\b/g, "hun")
    .replace(/\bihre\b/g, "hun")
    .replace(/\bunser\b/g, "onze")
    .replace(/\bunsere\b/g, "onze")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
  return out;
}
