-- ===========================================================================
-- 065 — Add new Leo cards batch (shop + achievements)
-- MANUAL APPLY — review and run in Supabase SQL editor.
--
-- Adds 27 new cards, 2 achievement series (geometry, science),
-- renames 5 existing shop cards (simple tier), does NOT replace images.
-- Requires 058–064 applied.
-- ===========================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Rename 5 existing shop cards (simple tier — images unchanged)
-- ---------------------------------------------------------------------------

update public.reward_cards set name_he = '', description_he = '', updated_at = now()
where card_key = 'leo_detective' and card_type = 'shop';

update public.reward_cards set name_he = '', description_he = '', updated_at = now()
where card_key = 'leo_wizard' and card_type = 'shop';

update public.reward_cards set name_he = '', description_he = '', updated_at = now()
where card_key = 'leo_surfer' and card_type = 'shop';

update public.reward_cards set name_he = '', description_he = '', updated_at = now()
where card_key = 'leo_superhero' and card_type = 'shop';

update public.reward_cards set name_he = '', description_he = '', updated_at = now()
where card_key = 'leo_forest_guardian' and card_type = 'shop';

-- ---------------------------------------------------------------------------
-- 2. New achievement series
-- ---------------------------------------------------------------------------

insert into public.reward_card_series (slug, name_he, description_he, display_order, is_active)
values
  ('geometry', '', '', 24, true),
  ('science', '', '', 25, true)
on conflict (slug) do update set
  name_he = excluded.name_he,
  description_he = excluded.description_he,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 3. Shop — 16 new cards @ 150000 coins
-- ---------------------------------------------------------------------------

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  price_coins, use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'shop',
  150000, false, true, true, true
from (values
  ('leo_master_detective', '', '', null, 'professions', 'rare'),
  ('leo_grand_wizard', '', '', null, 'fantasy', 'rare'),
  ('leo_wave_champion', '', '', null, 'sport-fun', 'special'),
  ('leo_legendary_superhero', '', '', null, 'fantasy', 'gold'),
  ('leo_enchanted_forest_guardian', '', '', null, 'fantasy', 'rare'),
  ('leo_golden_knight', '', '', null, 'fantasy', 'gold'),
  ('leo_master_chef', '', '', null, 'professions', 'special'),
  ('leo_firefighter', '', '', null, 'professions', 'special'),
  ('leo_pirate_captain', '', '', null, 'fantasy', 'special'),
  ('leo_galactic_explorer', '', '', null, 'space-tech', 'special'),
  ('leo_racing_driver', '', '', null, 'sport-fun', 'special'),
  ('leo_music_star', '', '', null, 'professions', 'special'),
  ('leo_master_painter', '', '', null, 'professions', 'regular'),
  ('leo_genius_inventor', '', '', null, 'professions', 'rare'),
  ('leo_soccer_champion', '', '', null, 'sport-fun', 'special'),
  ('leo_arcade_champion', '', '', null, 'sport-fun', 'special')
) as v(card_key, name_he, description_he, image_url, series_slug, rarity)
join public.reward_card_series s on s.slug = v.series_slug
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  series_id = excluded.series_id, rarity = excluded.rarity,
  price_coins = 150000, use_default_price = false,
  can_be_purchased = true, can_appear_in_surprise_box = true, is_active = true,
  card_type = 'shop', updated_at = now();

-- ---------------------------------------------------------------------------
-- 4. (removed) Israel-only event seed — not part of GLOBAL
-- 5. Achievements — geometry (6)
-- ---------------------------------------------------------------------------

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  subject, topic, use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'achievement',
  v.subject, v.topic, true, false, false, true
from (values
  ('achievement_geometry_shapes_champion', '', '', null, 'regular', 'geometry', null),
  ('achievement_geometry_angles_detective', '', '', null, 'special', 'geometry', null),
  ('achievement_geometry_polygon_architect', '', '', null, 'special', 'geometry', null),
  ('achievement_geometry_symmetry_explorer', '', '', null, 'special', 'geometry', null),
  ('achievement_geometry_3d_builder', '', '', null, 'rare', 'geometry', null),
  ('achievement_geometry_area_genius', '', '', null, 'rare', 'geometry', null)
) as v(card_key, name_he, description_he, image_url, rarity, subject, topic)
join public.reward_card_series s on s.slug = 'geometry'
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  series_id = excluded.series_id, rarity = excluded.rarity,
  subject = excluded.subject, topic = excluded.topic,
  card_type = 'achievement', can_be_purchased = false, can_appear_in_surprise_box = false,
  is_active = true, updated_at = now();

-- ---------------------------------------------------------------------------
-- 6. Achievements — science (4)
-- ---------------------------------------------------------------------------

insert into public.reward_cards (
  card_key, name_he, description_he, image_url, series_id, rarity, card_type,
  subject, topic, use_default_price, can_be_purchased, can_appear_in_surprise_box, is_active
)
select v.card_key, v.name_he, v.description_he, v.image_url, s.id, v.rarity, 'achievement',
  v.subject, v.topic, true, false, false, true
from (values
  ('achievement_science_young_scientist', '', '', null, 'regular', 'science', null),
  ('achievement_science_space_discoverer', '', '', null, 'special', 'science', null),
  ('achievement_science_weather_explorer', '', '', null, 'special', 'science', null),
  ('achievement_science_magnet_master', '', '', null, 'rare', 'science', null)
) as v(card_key, name_he, description_he, image_url, rarity, subject, topic)
join public.reward_card_series s on s.slug = 'science'
on conflict (card_key) do update set
  name_he = excluded.name_he, description_he = excluded.description_he,
  series_id = excluded.series_id, rarity = excluded.rarity,
  subject = excluded.subject, topic = excluded.topic,
  card_type = 'achievement', can_be_purchased = false, can_appear_in_surprise_box = false,
  is_active = true, updated_at = now();

-- ---------------------------------------------------------------------------
-- 7. Achievement rules (geometry + science)
-- ---------------------------------------------------------------------------

insert into public.reward_card_rules (
  card_id, rule_type, subject, topic, min_questions, min_accuracy, is_active, grant_enabled
)
select c.id, r.rule_type, r.subject, r.topic, r.min_questions, r.min_accuracy, true, true
from (values
  ('achievement_geometry_shapes_champion', '', '', null, 40, null),
  ('achievement_geometry_angles_detective', '', '', null, 35, null),
  ('achievement_geometry_polygon_architect', '', '', null, 45, null),
  ('achievement_geometry_symmetry_explorer', '', '', null, 40, null),
  ('achievement_geometry_3d_builder', '', '', null, 50, null),
  ('achievement_geometry_area_genius', '', '', null, 30, 75),
  ('achievement_science_young_scientist', '', '', null, 30, null),
  ('achievement_science_space_discoverer', '', '', null, 40, null),
  ('achievement_science_weather_explorer', '', '', null, 35, null),
  ('achievement_science_magnet_master', '', '', null, 25, 70)
) as r(card_key, rule_type, subject, topic, min_questions, min_accuracy)
join public.reward_cards c on c.card_key = r.card_key and c.card_type = 'achievement'
where not exists (select 1 from public.reward_card_rules existing where existing.card_id = c.id);

commit;

-- Post-apply checks:
-- select card_key, name_he, price_coins from reward_cards where card_key like 'leo_%' and price_coins = 150000;
-- select card_key, name_he from reward_cards where card_key in ('leo_detective', '', '','leo_superhero','leo_forest_guardian');
-- select s.slug, count(*) from reward_cards c join reward_card_series s on s.id = c.series_id where s.slug in ('geometry','science') group by s.slug;
