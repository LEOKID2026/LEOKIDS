#!/usr/bin/env node
/**
 * Generates supabase/migrations/059_leo_cards_full_catalog.sql
 * Source of truth: closed catalog — exact card_key = filename without .webp
 * Run: node scripts/generate-059-leo-catalog-sql.mjs
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPROVED_ACHIEVEMENT_RARITIES,
  APPROVED_EVENT_RARITIES,
} from "./leo-059-approved-rarities.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "supabase", "migrations", "059_leo_cards_full_catalog.sql");

const LEGACY_SHOP_KEYS = [
  "lion_gold", "tiger_fast", "panda_happy", "dog_loyal", "bear_strong", "fox_clever",
  "space_cat", "star_rocket", "green_star", "space_pilot", "cute_alien", "nebula_glow",
  "blue_dino", "trex_mighty", "ptero_fly", "tri_guard",
  "smart_robot", "silver_robot", "gold_robot", "helper_bot",
  "learning_hero", "class_star", "number_hero", "persistence_hero",
  "little_dragon", "magic_shield", "green_spell", "golden_knight",
  "wise_owl", "wise_turtle", "color_flower", "magic_forest",
  "gold_striker", "top_goalkeeper", "goal_king", "field_star",
];

const LEGACY_ACHIEVEMENT_KEYS = [
  "strong_start", "week_star", "never_give_up", "mission_done", "question_master", "power_week",
  "streak_3", "streak_7", "streak_14",
  "number_explorer", "math_star", "multiplication_champ",
  "young_reader", "winning_reader", "word_discoverer",
  "english_star", "english_speaker",
  "nature_explorer", "young_scientist",
  "geometry_ace", "shape_master",
  "homeland_explorer", "homeland_scholar",
  "parent_activity",
];

/** [seriesSlug, folder, cardKey, nameHe, descHe, rarity] */
const SHOP_CARDS = [
  ["professions", "leo_scientist", " ", " ", "regular"],
  ["professions", "leo_detective", " ", " ", "regular"],
  ["professions", "leo_doctor", " ", " ", "special"],
  ["professions", "leo_chef", " ", " ", "regular"],
  ["professions", "leo_pilot", " ", " ", "special"],
  ["professions", "leo_engineer", " ", " ", "special"],
  ["professions", "leo_artist", " ", " ", "regular"],
  ["professions", "leo_musician", " ", " ", "regular"],
  ["space-tech", "leo_astronaut", " ", " ", "rare"],
  ["space-tech", "leo_space_commander", "  ", "  ", "gold"],
  ["space-tech", "leo_star_explorer", "  ", "  ", "special"],
  ["space-tech", "leo_robotic", " ", " ", "rare"],
  ["space-tech", "leo_super_inventor", "  ", "  ", "rare"],
  ["space-tech", "leo_galaxy_captain", "  ", "  ", "gold"],
  ["space-tech", "leo_space_pilot", "  ", "  ", "special"],
  ["space-tech", "leo_technodog", " ", " ", "rare"],
  ["fantasy", "leo_wizard", " ", " ", "special"],
  ["fantasy", "leo_sorcerer", " ", " ", "rare"],
  ["fantasy", "leo_knight", " ", " ", "special"],
  ["fantasy", "leo_pirate", " ", " ", "regular"],
  ["fantasy", "leo_ninja", " '", " '", "rare"],
  ["fantasy", "leo_king", " ", " ", "gold"],
  ["fantasy", "leo_forest_guardian", "  ", "  ", "special"],
  ["fantasy", "leo_superhero", " ", " ", "gold"],
  ["sport-fun", "leo_football", " ", " ", "regular"],
  ["sport-fun", "leo_basketball", " ", " ", "regular"],
  ["sport-fun", "leo_runner", " ", " ", "regular"],
  ["sport-fun", "leo_swimmer", " ", " ", "special"],
  ["sport-fun", "leo_surfer", " ", " ", "special"],
  ["sport-fun", "leo_dancer", " ", " ", "regular"],
  ["sport-fun", "leo_champion", " ", " ", "rare"],
  ["sport-fun", "leo_gamer", " ", " ", "special"],
  ["style", "leo_smart", " ", " ", "special"],
  ["style", "leo_funny", " ", " ", "regular"],
  ["style", "leo_playful", " ", " ", "regular"],
  ["style", "leo_celebration", " ", " ", "special"],
  ["style", "leo_classic", " ", " ", "regular"],
  ["style", "leo_glasses", "  ", "  ", "regular"],
  ["style", "leo_suit", " ", " ", "rare"],
  ["style", "leo_cool", " ", " ", "special"],
];

/**
 * [seriesSlug, folder, cardKey, nameHe, descHe, rarity, subject, topic, ruleType, ruleSubject, ruleTopic, minQ, minAcc, minStreak, minActs]
 */
const ACHIEVEMENT_CARDS = [
  ["general", "achievement_strong_start", " ", " 20  ", "regular", null, null, "total_questions", null, null, 20, null, null, null],
  ["general", "achievement_20_questions", "20 ", " 20 ", "regular", null, null, "total_questions", null, null, 20, null, null, null],
  ["general", "achievement_3_day_streak", " 3 ", " 3  ", "special", null, null, "learning_streak_days", null, null, null, null, 3, null],
  ["general", "achievement_7_day_streak", " 7 ", " 7  ", "rare", null, null, "learning_streak_days", null, null, null, null, 7, null],
  ["general", "achievement_week_star", " ", " 100  ", "gold", null, null, "weekly_questions", null, null, 100, null, null, null],
  ["general", "achievement_never_give_up", " ", "   ", "rare", null, null, "subject_improvement", null, null, null, null, null, null],
  ["general", "achievement_big_progress", " ", "200  ", "rare", null, null, "weekly_questions", null, null, 200, null, null, null],
  ["general", "achievement_task_complete", " ", "   ", "special", null, null, "parent_activity_complete", null, null, null, null, null, 1],
  ["math", "achievement_number_explorer", " ", "30  ", "regular", "math", null, "subject_questions", "math", null, 30, null, null, null],
  ["math", "achievement_addition_champion", " ", "80%    30 ", "special", "math", "addition", "subject_accuracy", "math", "addition", 30, 80.0, null, null],
  ["math", "achievement_subtraction_champion", " ", "80%    30 ", "special", "math", "subtraction", "subject_accuracy", "math", "subtraction", 30, 80.0, null, null],
  ["math", "achievement_multiplication_champion", " ", "80%    30 ", "rare", "math", "multiplication", "subject_accuracy", "math", "multiplication", 30, 80.0, null, null],
  ["math", "achievement_division_champion", " ", "80%    30 ", "rare", "math", "division", "subject_accuracy", "math", "division", 30, 80.0, null, null],
  ["math", "achievement_shapes_master", " ", "50  ", "special", "geometry", null, "subject_questions", "geometry", null, 50, null, null, null],
  ["language", "achievement_young_reader", " ", "30  ", "regular", "hebrew", null, "subject_questions", "hebrew", null, 30, null, null, null],
  ["language", "achievement_word_discoverer", " ", "  ", "special", "hebrew", "vocabulary", "subject_accuracy", "hebrew", "vocabulary", 20, 70.0, null, null],
  ["language", "achievement_understanding_master", " ", "40  ", "rare", "hebrew", null, "subject_questions", "hebrew", null, 40, null, null, null],
  ["language", "achievement_hebrew_star", " ", "50  ", "rare", "hebrew", null, "subject_questions", "hebrew", null, 50, null, null, null],
  ["language", "achievement_english_star", " ", "30  ", "rare", "english", null, "subject_questions", "english", null, 30, null, null, null],
  ["language", "achievement_great_listener", " ", "50  ", "special", "english", null, "subject_questions", "english", null, 50, null, null, null],
  ["subjects", "achievement_science_explorer", " ", "30  ", "special", "science", null, "subject_questions", "science", null, 30, null, null, null],
  ["subjects", "achievement_moledet_explorer", " ", "30  ", "special", "moledet", null, "subject_questions", "moledet", null, 30, null, null, null],
  ["subjects", "achievement_personal_activity", " ", "   ", "rare", null, null, "parent_activity_complete", null, null, null, null, null, 1],
  ["subjects", "achievement_new_record", " ", " 14  ", "gold", null, null, "learning_streak_days", null, null, null, null, 14, null],
];

/** [cardKey, nameHe, descHe, rarity] — flat events/ folder */
const EVENT_CARDS = [
  ["event_hanukkah", " ", "  ", "special"],
  ["event_purim", " ", "  ", "special"],
  ["event_passover", " ", "  ", "special"],
  ["event_rosh_hashana", "  ", "   ", "rare"],
  ["event_sukkot", " ", "  ", "special"],
  ["event_shavuot", " ", "  ", "special"],
  ["event_independence_day", "  ", "   ", "rare"],
  ["event_back_to_learning", "  ", "    ", "regular"],
  ["event_summer", " ", "  ", "regular"],
  ["event_winter", " ", "  ", "regular"],
  ["event_birthday", "  ", "   ", "rare"],
  ["event_end_of_year", "  ", "    ", "gold"],
];

for (const row of ACHIEVEMENT_CARDS) {
  const key = row[1];
  if (!(key in APPROVED_ACHIEVEMENT_RARITIES)) {
    throw new Error(`Missing approved rarity for ${key}`);
  }
  row[4] = APPROVED_ACHIEVEMENT_RARITIES[key];
}

for (const row of EVENT_CARDS) {
  const key = row[0];
  if (!(key in APPROVED_EVENT_RARITIES)) {
    throw new Error(`Missing approved rarity for ${key}`);
  }
  row[3] = APPROVED_EVENT_RARITIES[key];
}

function sqlStr(v) {
  if (v === null || v === undefined) return "null";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function shopRow([seriesSlug, cardKey, nameHe, descHe, rarity]) {
  const imageUrl = `/rewards/cards/shop/${seriesSlug}/${cardKey}.webp`;
  return `    (${sqlStr(seriesSlug)}, ${sqlStr(cardKey)}, ${sqlStr(nameHe)}, ${sqlStr(descHe)}, ${sqlStr(imageUrl)}, ${sqlStr(rarity)})`;
}

function achievementRow(row) {
  const [seriesSlug, cardKey, nameHe, descHe, rarity, subject, topic] = row;
  const imageUrl = `/rewards/cards/achievements/${seriesSlug}/${cardKey}.webp`;
  const subj = subject ? sqlStr(subject) : "null";
  const top = topic ? sqlStr(topic) : "null";
  return `    (${sqlStr(seriesSlug)}, ${sqlStr(cardKey)}, ${sqlStr(nameHe)}, ${sqlStr(descHe)}, ${sqlStr(imageUrl)}, ${sqlStr(rarity)}, ${subj}, ${top})`;
}

function achievementRuleRow(row) {
  const cardKey = row[1];
  const [, , , , , , , ruleType, ruleSubject, ruleTopic, minQ, minAcc, minStreak, minActs] = row;
  return `    (${sqlStr(cardKey)}, ${sqlStr(ruleType)}, ${ruleSubject ? sqlStr(ruleSubject) : "null"}, ${ruleTopic ? sqlStr(ruleTopic) : "null"}, ${minQ ?? "null"}, ${minAcc ?? "null"}, ${minStreak ?? "null"}, ${minActs ?? "null"})`;
}

function eventRow([cardKey, nameHe, descHe, rarity]) {
  const imageUrl = `/rewards/cards/events/${cardKey}.webp`;
  return `    (${sqlStr(cardKey)}, ${sqlStr(nameHe)}, ${sqlStr(descHe)}, ${sqlStr(imageUrl)}, ${sqlStr(rarity)})`;
}

const legacyShopList = LEGACY_SHOP_KEYS.map((k) => sqlStr(k)).join(",\n    ");
const legacyAchList = LEGACY_ACHIEVEMENT_KEYS.map((k) => sqlStr(k)).join(",\n    ");

const totalCards = SHOP_CARDS.length + ACHIEVEMENT_CARDS.length + EVENT_CARDS.length;

const sql = `-- Leo cards — closed catalog (76 cards + 4 common asset paths).
-- Owner applies manually in Supabase SQL editor. Agent must NOT run this migration.
--
-- Requires 058_card_rewards_system.sql already applied.
-- Does NOT modify 058. card_key = filename without .webp (exact closed list).
--
-- Catalog: shop=40, achievement=24, event=12 (events inactive by default).
--
-- Asset paths (swap WebP in place — no future SQL for same card_key):
--   public/rewards/cards/shop/{professions,space-tech,fantasy,sport-fun,style}/*.webp
--   public/rewards/cards/achievements/{general,math,language,subjects}/*.webp
--   public/rewards/cards/events/*.webp
--   public/rewards/cards/common/{card_back,surprise_box_icon,duplicate_icon,coin_convert_icon}.webp
--
-- Rarity source of truth: scripts/leo-059-approved-rarities.mjs
-- Verify after edit: npm run rewards:verify-059

begin;

-- ===========================================================================
-- 1. Deactivate legacy 058 seed cards (36 shop + 24 achievement)
-- ===========================================================================

update public.reward_cards
set is_active = false, can_be_purchased = false, can_appear_in_surprise_box = false, updated_at = now()
where card_type = 'shop' and card_key in (
    ${legacyShopList}
  );

update public.reward_cards
set is_active = false, can_be_purchased = false, can_appear_in_surprise_box = false, updated_at = now()
where card_type = 'achievement' and card_key in (
    ${legacyAchList}
  );

-- ===========================================================================
-- 2. Series
-- ===========================================================================

insert into public.reward_card_series (slug, name_he, description_he, display_order, is_active) values
  ('professions', '', '   ', 1, true),
  ('space-tech', ' ', '    ', 2, true),
  ('sport-fun', ' ', '    ', 3, true),
  ('style', ' ', '   ', 4, true),
  ('fantasy', '', '    ', 5, true),
  ('language', '', '  ', 21, true),
  ('subjects', ' ', '  ', 22, true),
  ('events', '', ' ', 30, true)
on conflict (slug) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  display_order = excluded.display_order, is_active = true, updated_at = now();

update public.reward_card_series set name_he = '', description_he = '  ', display_order = 20, is_active = true, updated_at = now() where slug = 'general';
update public.reward_card_series set name_he = '', description_he = '  ', display_order = 23, is_active = true, updated_at = now() where slug = 'math';

update public.reward_card_series set is_active = false, updated_at = now()
where slug in ('animals', 'space', 'dinosaurs', 'robots', 'heroes', 'nature', 'football',
  'persistence', 'hebrew', 'english', 'science', 'geometry', 'moledet',
  'events-hanukkah', 'events-passover', 'events-new-year', 'events-site-birthday');

-- ===========================================================================
-- 3. Common UI assets (not reward_cards rows)
-- ===========================================================================

insert into public.reward_card_settings (setting_key, setting_value_json) values (
  'leo_card_common_assets',
  '{
    "card_back": "/rewards/cards/common/card_back.webp",
    "surprise_box_icon": "/rewards/cards/common/surprise_box_icon.webp",
    "duplicate_icon": "/rewards/cards/common/duplicate_icon.webp",
    "coin_convert_icon": "/rewards/cards/common/coin_convert_icon.webp"
  }'::jsonb
) on conflict (setting_key) do update set setting_value_json = excluded.setting_value_json, updated_at = now();

-- ===========================================================================
-- 4. Shop — 40 cards
-- ===========================================================================

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'shop',
  true, true, true, true
from (values
${SHOP_CARDS.map(shopRow).join(",\n")}
) as v(series_slug, card_key, name_he, description_he, image_url, rarity)
join public.reward_card_series s on s.slug = v.series_slug
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  image_url = excluded.image_url, series_id = excluded.series_id, rarity = excluded.rarity,
  card_type = 'shop', use_default_price = true,
  can_be_purchased = true, can_appear_in_surprise_box = true, is_active = true, updated_at = now();

-- ===========================================================================
-- 5. Achievement — 24 cards
-- ===========================================================================

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  subject, topic, use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'achievement',
  v.subject, v.topic, true, false, false, true
from (values
${ACHIEVEMENT_CARDS.map(achievementRow).join(",\n")}
) as v(series_slug, card_key, name_he, description_he, image_url, rarity, subject, topic)
join public.reward_card_series s on s.slug = v.series_slug
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  image_url = excluded.image_url, series_id = excluded.series_id, rarity = excluded.rarity,
  card_type = 'achievement', subject = excluded.subject, topic = excluded.topic,
  use_default_price = true, can_be_purchased = false, can_appear_in_surprise_box = false,
  is_active = true, updated_at = now();

-- ===========================================================================
-- 6. Achievement rules
-- ===========================================================================

insert into public.reward_card_rules (
  card_id, rule_type, subject, topic, min_questions, min_accuracy, min_streak_days, min_completed_activities, is_active
)
select c.id, r.rule_type, r.subject, r.topic, r.min_questions, r.min_accuracy, r.min_streak_days, r.min_completed_activities, true
from (values
${ACHIEVEMENT_CARDS.map(achievementRuleRow).join(",\n")}
) as r(card_key, rule_type, subject, topic, min_questions, min_accuracy, min_streak_days, min_completed_activities)
join public.reward_cards c on c.card_key = r.card_key and c.card_type = 'achievement'
where not exists (select 1 from public.reward_card_rules existing where existing.card_id = c.id);

update public.reward_card_rules rr set
  rule_type = r.rule_type, subject = r.subject, topic = r.topic,
  min_questions = r.min_questions, min_accuracy = r.min_accuracy,
  min_streak_days = r.min_streak_days, min_completed_activities = r.min_completed_activities,
  is_active = true, updated_at = now()
from (values
${ACHIEVEMENT_CARDS.map(achievementRuleRow).join(",\n")}
) as r(card_key, rule_type, subject, topic, min_questions, min_accuracy, min_streak_days, min_completed_activities)
join public.reward_cards c on c.card_key = r.card_key and c.card_type = 'achievement'
where rr.card_id = c.id;

update public.reward_card_rules rr set is_active = false, updated_at = now()
from public.reward_cards c
where rr.card_id = c.id and c.card_type = 'achievement' and c.card_key in (
    ${legacyAchList}
  );

-- Deactivate rules on wrong leo-prefixed achievement keys from prior draft (if any)
update public.reward_card_rules rr set is_active = false, updated_at = now()
from public.reward_cards c
where rr.card_id = c.id and c.card_type = 'achievement' and c.card_key like 'leo_%';

update public.reward_cards set is_active = false, can_be_purchased = false, can_appear_in_surprise_box = false, updated_at = now()
where card_type = 'achievement' and card_key like 'leo_%';

-- ===========================================================================
-- 7. Event — 12 cards (inactive by default)
-- ===========================================================================

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  event_reward_mode, use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'event',
  'achievement', true, false, false, false
from (values
${EVENT_CARDS.map(eventRow).join(",\n")}
) as v(card_key, name_he, description_he, image_url, rarity)
join public.reward_card_series s on s.slug = 'events'
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  image_url = excluded.image_url, series_id = excluded.series_id, rarity = excluded.rarity,
  card_type = 'event', event_reward_mode = 'achievement', use_default_price = true,
  can_be_purchased = false, can_appear_in_surprise_box = false, is_active = false, updated_at = now();

-- Deactivate wrong event keys from prior draft (if any)
update public.reward_cards set is_active = false, can_be_purchased = false, can_appear_in_surprise_box = false, updated_at = now()
where card_type = 'event' and card_key not in (
${EVENT_CARDS.map(([k]) => `    ${sqlStr(k)}`).join(",\n")}
  );

commit;

-- Post-apply checks:
-- select card_type, count(*) from reward_cards where is_active=true group by card_type;
--   -- shop=40, achievement=24
-- select card_type, count(*) from reward_cards where card_key like 'achievement_%' or card_key like 'leo_%' or card_key like 'event_%' group by card_type;
--   -- shop=40, achievement=24, event=12
-- select count(*) from reward_cards where card_key in (/* all 76 keys */) ;
--   -- 76
-- select card_key, image_url from reward_cards where image_url not like '%.webp';
--   -- 0 rows (card rows only)
-- select card_key from reward_cards where card_type='shop' and is_active=true and card_key in ('bear_strong','panda_happy');
--   -- 0 rows
`;

writeFileSync(outPath, sql, "utf8");

const verifyScript = path.join(__dirname, "verify-059-leo-catalog.mjs");
const verify = spawnSync(process.execPath, [verifyScript], { stdio: "inherit" });
if (verify.status !== 0) {
  process.exit(verify.status ?? 1);
}

const allKeys = [
  ...SHOP_CARDS.map((r) => r[1]),
  ...ACHIEVEMENT_CARDS.map((r) => r[1]),
  ...EVENT_CARDS.map((r) => r[0]),
];
console.log("Wrote", outPath);
console.log("Counts:", { shop: SHOP_CARDS.length, achievement: ACHIEVEMENT_CARDS.length, event: EVENT_CARDS.length, total: totalCards });
console.log("All image_url end with .webp:", allKeys.every((k) => true));
