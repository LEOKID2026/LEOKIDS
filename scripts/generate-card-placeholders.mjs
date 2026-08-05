#!/usr/bin/env node
/**
 * Regenerate Hebrew card placeholder SVGs for LOCAL DEV ONLY.
 * Do NOT run in production deploy — student world must not rely on these paths.
 * Run: node scripts/generate-card-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(__dirname, "..", "public", "rewards", "cards");

const RARITY_STYLE = {
  regular: { label: "", from: "#e2e8f0", to: "#94a3b8", stroke: "#64748b", text: "#334155", sub: "#475569" },
  special: { label: "", from: "#ddd6fe", to: "#7c3aed", stroke: "#6d28d9", text: "#ffffff", sub: "#ede9fe" },
  rare: { label: "", from: "#bae6fd", to: "#0284c7", stroke: "#0369a1", text: "#ffffff", sub: "#e0f2fe" },
  gold: { label: "", from: "#fde68a", to: "#d97706", stroke: "#b45309", text: "#78350f", sub: "#92400e" },
};

function cardSvg(nameHe, rarity) {
  const v = RARITY_STYLE[rarity] || RARITY_STYLE.regular;
  const title = String(nameHe).slice(0, 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${v.from}"/>
      <stop offset="100%" stop-color="${v.to}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="280" rx="16" fill="url(#bg)" stroke="${v.stroke}" stroke-width="3"/>
  <text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${v.text}">${title}</text>
  <text x="100" y="155" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="${v.sub}">${v.label}</text>
</svg>
`;
}

/** Matches 058_card_rewards_system.sql seed — shop + achievement paths. */
const SEED_CARDS = [
  ["shop", "animals", "lion_gold", " ", "gold"],
  ["shop", "animals", "tiger_fast", " ", "special"],
  ["shop", "animals", "panda_happy", " ", "regular"],
  ["shop", "animals", "dog_loyal", " ", "regular"],
  ["shop", "animals", "bear_strong", " ", "regular"],
  ["shop", "animals", "fox_clever", " ", "special"],
  ["shop", "space", "space_cat", " ", "special"],
  ["shop", "space", "star_rocket", " ", "regular"],
  ["shop", "space", "green_star", " ", "regular"],
  ["shop", "space", "space_pilot", " ", "regular"],
  ["shop", "space", "cute_alien", " ", "special"],
  ["shop", "space", "nebula_glow", " ", "rare"],
  ["shop", "dinosaurs", "blue_dino", " ", "regular"],
  ["shop", "dinosaurs", "trex_mighty", "-", "special"],
  ["shop", "dinosaurs", "ptero_fly", "", "regular"],
  ["shop", "dinosaurs", "tri_guard", "", "rare"],
  ["shop", "robots", "smart_robot", " ", "special"],
  ["shop", "robots", "silver_robot", " ", "regular"],
  ["shop", "robots", "gold_robot", " ", "gold"],
  ["shop", "robots", "helper_bot", " ", "regular"],
  ["shop", "heroes", "learning_hero", " ", "regular"],
  ["shop", "heroes", "class_star", " ", "special"],
  ["shop", "heroes", "number_hero", " ", "regular"],
  ["shop", "heroes", "persistence_hero", " ", "rare"],
  ["shop", "fantasy", "little_dragon", " ", "special"],
  ["shop", "fantasy", "magic_shield", " ", "regular"],
  ["shop", "fantasy", "green_spell", " ", "regular"],
  ["shop", "fantasy", "golden_knight", " ", "gold"],
  ["shop", "nature", "wise_owl", " ", "special"],
  ["shop", "nature", "wise_turtle", " ", "regular"],
  ["shop", "nature", "color_flower", " ", "regular"],
  ["shop", "nature", "magic_forest", " ", "rare"],
  ["shop", "football", "gold_striker", " ", "gold"],
  ["shop", "football", "top_goalkeeper", " ", "special"],
  ["shop", "football", "goal_king", " ", "regular"],
  ["shop", "football", "field_star", " ", "regular"],
  ["achievements", "persistence", "streak_3", " 3 ", "regular"],
  ["achievements", "persistence", "streak_7", " 7 ", "regular"],
  ["achievements", "persistence", "streak_14", " 14 ", "special"],
  ["achievements", "general", "strong_start", " ", "regular"],
  ["achievements", "general", "week_star", " ", "special"],
  ["achievements", "general", "never_give_up", " ", "rare"],
  ["achievements", "general", "mission_done", " ", "regular"],
  ["achievements", "general", "question_master", " ", "special"],
  ["achievements", "general", "power_week", " ", "rare"],
  ["achievements", "general", "parent_activity", " ", "regular"],
  ["achievements", "math", "number_explorer", " ", "regular"],
  ["achievements", "math", "math_star", " ", "special"],
  ["achievements", "math", "multiplication_champ", " ", "gold"],
  ["achievements", "hebrew", "young_reader", " ", "regular"],
  ["achievements", "hebrew", "winning_reader", " ", "special"],
  ["achievements", "hebrew", "word_discoverer", " ", "special"],
  ["achievements", "english", "english_star", " ", "regular"],
  ["achievements", "english", "english_speaker", " ", "special"],
  ["achievements", "science", "nature_explorer", " ", "regular"],
  ["achievements", "science", "young_scientist", " ", "special"],
  ["achievements", "geometry", "geometry_ace", " ", "regular"],
  ["achievements", "geometry", "shape_master", " ", "special"],
  ["achievements", "moledet", "homeland_explorer", " ", "regular"],
  ["achievements", "moledet", "homeland_scholar", " ", "special"],
];

for (const v of Object.values(RARITY_STYLE)) {
  const dir = path.join(publicRoot, "placeholders", v.label === "" ? "regular" : v.label === "" ? "special" : v.label === "" ? "rare" : "gold");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "default.svg"), cardSvg("", v.label === "" ? "regular" : v.label === "" ? "special" : v.label === "" ? "rare" : "gold"), "utf8");
}

for (const [kind, slug, key, nameHe, rarity] of SEED_CARDS) {
  const dir = path.join(publicRoot, kind, slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${key}.svg`), cardSvg(nameHe, rarity), "utf8");
}

console.log(`Generated ${SEED_CARDS.length} card SVGs + rarity defaults.`);
