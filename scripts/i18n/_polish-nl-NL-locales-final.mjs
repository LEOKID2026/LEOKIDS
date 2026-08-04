/**
 * Final polish for nl-NL locale JSON display strings (exact replacements).
 */
import fs from "node:fs";
import path from "node:path";

const REPLACEMENTS = [
  ["Welcome, ouders", "Welkom, ouders"],
  ["🏆 Leaderboard – Rekenen", "🏆 Ranglijst – Rekenen"],
  ["🏆 Leaderboard – Meetkunde", "🏆 Ranglijst – Meetkunde"],
  ["🏆 Leaderboard – Engels", "🏆 Ranglijst – Engels"],
  ["🏆 Leaderboard – Natuur en techniek", "🏆 Ranglijst – Natuur en techniek"],
  ["📚 Rekenen helpen board", "📚 Rekenen-hulpboard"],
  ["📚 Helpen board", "📚 Hulpboard"],
  ["📚 Natuur en techniek concept board", "📚 Conceptboard natuur en techniek"],
  ["📐 Shapes en formulas board", "📐 Board met vormen en formules"],
  ["Je leveled up in rekenen!", "Je bent een niveau omhoog gegaan in rekenen!"],
  ["Je leveled up in natuur en techniek!", "Je bent een niveau omhoog gegaan in natuur en techniek!"],
  ["👑 Rekenen king", "👑 Rekenen-koning"],
  ["👑 Natuur en techniek king", "👑 Natuur-en-techniekkoning"],
  ["🧮 King van {op}", "🧮 Koning van {op}"],
  ["Order van operations", "Volgorde van bewerkingen"],
  ["Rekenen operations", "Rekenbewerkingen"],
  ["Hoe naar learn rekenen here?", "Hoe leer je hier rekenen?"],
  ["Hoe naar learn natuur en techniek here?", "Hoe leer je hier natuur en techniek?"],
  ["Vermenigvuldigen table", "Tafels van vermenigvuldiging"],
  ["Pick een row of column naar practice:", "Kies een rij of kolom om te oefenen:"],
  ["Delen met remainder", "Delen met rest"],
  ["Geen badges yet. Houden practicing!", "Nog geen badges. Blijf oefenen!"],
  ["🔥 Houden it up!", "🔥 Ga zo door!"],
  ["Life natuur en techniek", "Leven en natuur"],
  ["Aarde en space", "Aarde en ruimte"],
  ["Materials en experiments", "Materialen en experimenten"],
  ["Alle topics", "Alle onderwerpen"],
  ["Checking ouder session…", "Oudersessie controleren…"],
  ["jeïdentificeerd", "geïdentificeerd"],
  ["Listen naar question", "Luister naar de vraag"],
  ["Remember: I altijd gebruikt am, niet is. I am = I.", "Onthoud: bij I gebruik je altijd am, niet is. I am = I am."],
];

const files = [
  "locales/nl-NL/auth.json",
  "locales/nl-NL/learning.json",
  "locales/nl-NL/reports.json",
  "locales/nl-NL/ui.json",
];

let changed = 0;
for (const f of files) {
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of REPLACEMENTS) t = t.split(a).join(b);
  if (t !== before) {
    fs.writeFileSync(f, t);
    changed++;
  }
}
console.log({ changedFiles: changed });
