/**
 * One-shot generator: lib/rewards/reward-card-global-en-catalog.js
 * Run: node scripts/gen-reward-card-en-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** @type {Record<string, string>} */
const WORD = {
  a: "a",
  an: "an",
  at: "at",
  the: "the",
  and: "and",
  with: "with",
  in: "in",
  on: "on",
  to: "to",
  of: "of",
  for: "for",
  from: "from",
  beach: "Beach",
  sea: "Sea",
  rain: "Rain",
  walk: "Walk",
  winter: "Winter",
  vacation: "Vacation",
  scientist: "Scientist",
  detective: "Detective",
  doctor: "Doctor",
  chef: "Chef",
  pilot: "Pilot",
  engineer: "Engineer",
  artist: "Artist",
  musician: "Musician",
  astronaut: "Astronaut",
  wizard: "Wizard",
  sorcerer: "Sorcerer",
  knight: "Knight",
  pirate: "Pirate",
  ninja: "Ninja",
  king: "King",
  football: "Football Player",
  basketball: "Basketball Player",
  runner: "Runner",
  swimmer: "Swimmer",
  surfer: "Surfer",
  dancer: "Dancer",
  champion: "Champion",
  gamer: "Gamer",
  smart: "the Smart One",
  funny: "the Funny One",
  playful: "the Playful One",
  celebration: "the Celebrator",
  classic: "the Classic Leo",
  glasses: "with Glasses",
  suit: "in a Suit",
  cool: "the Cool One",
  firefighter: "Firefighter",
  helper: "Helper",
  art: "Art",
  class: "Class",
  piano: "Piano",
  player: "Player",
  science: "Science",
  pe: "PE",
  nature: "Nature",
  explorer: "Explorer",
  skateboarder: "Skateboarder",
  strong: "Strong",
  start: "Start",
  questions: "Questions",
  day: "Day",
  streak: "Streak",
  week: "Week",
  star: "Star",
  never: "Never",
  give: "Give",
  up: "Up",
  big: "Big",
  progress: "Progress",
  task: "Task",
  complete: "Complete",
  number: "Number",
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  shapes: "Shapes",
  master: "Master",
  young: "Young",
  reader: "Reader",
  word: "Word",
  discoverer: "Discoverer",
  understanding: "Understanding",
  hebrew: "Hebrew",
  english: "English",
  great: "Great",
  listener: "Listener",
  moledet: "Homeland",
  personal: "Personal",
  activity: "Activity",
  new: "New",
  record: "Record",
  robotic: "Robotic",
  inventor: "Inventor",
  super: "Super",
  galaxy: "Galaxy",
  captain: "Captain",
  space: "Space",
  commander: "Commander",
  technodog: "Techno Dog",
  forest: "Forest",
  guardian: "Guardian",
  superhero: "Superhero",
  hanukkah: "Hanukkah",
  passover: "Passover",
  purim: "Purim",
  rosh: "Rosh",
  hashanah: "Hashanah",
  shavuot: "Shavuot",
  sukkot: "Sukkot",
  independence: "Independence",
  back: "Back",
  to: "to",
  school: "School",
  summer: "Summer",
  birthday: "Birthday",
  spring: "Spring",
  autumn: "Autumn",
};

const THE_PROFESSION = new Set([
  "scientist",
  "detective",
  "doctor",
  "chef",
  "pilot",
  "engineer",
  "artist",
  "musician",
  "astronaut",
  "wizard",
  "sorcerer",
  "knight",
  "pirate",
  "ninja",
  "king",
  "football",
  "basketball",
  "runner",
  "swimmer",
  "surfer",
  "dancer",
  "champion",
  "gamer",
]);

function cap(word) {
  if (!word) return "";
  if (WORD[word]) return WORD[word];
  return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}

function tokensToEnglish(tokens, { leoPrefix = false, achievement = false } = {}) {
  if (!tokens.length) return leoPrefix ? "Leo" : achievement ? "Achievement" : "Reward card";
  /** @type {string[]} */
  const parts = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "at" && i + 1 < tokens.length) {
      parts.push(`at the ${cap(tokens[i + 1])}`);
      i += 2;
      continue;
    }
    if (t === "in" && i + 1 < tokens.length) {
      parts.push(`in ${cap(tokens[i + 1])}`);
      i += 2;
      continue;
    }
    if (t === "with" && i + 1 < tokens.length) {
      parts.push(`with ${cap(tokens[i + 1])}`);
      i += 2;
      continue;
    }
    if (THE_PROFESSION.has(t)) {
      parts.push(`the ${cap(t)}`);
      i += 1;
      continue;
    }
    parts.push(cap(t));
    i += 1;
  }
  const body = parts.join(" ");
  if (leoPrefix) return `Leo ${body}`.replace(/\s+/g, " ").trim();
  if (achievement) return body.replace(/\s+/g, " ").trim();
  return body.replace(/\s+/g, " ").trim();
}

function cardKeyToEnglish(cardKey) {
  const key = String(cardKey || "").trim();
  if (!key) return { name: "Reward card", description: "A special Leo card!" };
  if (key.startsWith("achievement_")) {
    const name = tokensToEnglish(key.slice("achievement_".length).split("_"), { achievement: true });
    return { name, description: `Earn this card: ${name}` };
  }
  if (key.startsWith("event_")) {
    const name = tokensToEnglish(key.slice("event_".length).split("_"), { leoPrefix: true });
    return { name, description: `${name} — limited event card!` };
  }
  if (key.startsWith("leo_")) {
    const name = tokensToEnglish(key.slice("leo_".length).split("_"), { leoPrefix: true });
    return { name, description: `Collect ${name}!` };
  }
  const name = tokensToEnglish(key.split("_"));
  return { name, description: `Collect ${name}!` };
}

/** @type {Set<string>} */
const keys = new Set();

const manifest = fs.readFileSync(path.join(root, "scripts/new-cards-zip-manifest.mjs"), "utf8");
for (const m of manifest.matchAll(/card_key:\s*"([^"]+)"/g)) keys.add(m[1]);

const mig = fs.readFileSync(
  path.join(root, "supabase/migrations/059_leo_cards_full_catalog.sql"),
  "utf8",
);
for (const m of mig.matchAll(/'((?:leo|achievement|event)_[a-z0-9_]+)'/g)) keys.add(m[1]);

/** @type {Record<string, { name: string, description: string }>} */
const catalog = {};
for (const k of [...keys].sort()) {
  catalog[k] = cardKeyToEnglish(k);
}

const out = `/** Auto-generated — node scripts/gen-reward-card-en-catalog.mjs */\n/** @type {Record<string, { name: string, description: string }>} */\nexport const REWARD_CARD_GLOBAL_EN_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`;
fs.writeFileSync(path.join(root, "lib/rewards/reward-card-global-en-catalog.js"), out);
console.log(`Wrote ${keys.size} card entries`);
