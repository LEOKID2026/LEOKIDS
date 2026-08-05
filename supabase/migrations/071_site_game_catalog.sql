-- Site game catalog: unified Admin enable/disable for 21 games (online / offline / solo).
-- FOR REVIEW ONLY — run manually after owner approval. Does not touch coin tables or legacy /mleo-* pages.
--
-- Rollback (manual):
--   drop trigger if exists trg_site_game_catalog_sync_enabled on public.site_game_catalog;
--   drop function if exists public.sync_site_game_catalog_enabled();
--   drop function if exists public.site_game_category_has_enabled(text);
--   drop table if exists public.site_game_catalog;

begin;

create table if not exists public.site_game_catalog (
  game_key text primary key,
  category text not null check (category in ('online', 'offline', 'solo')),
  title_he text not null check (char_length(title_he) between 1 and 120),
  route text not null check (char_length(route) between 1 and 200),
  hub_route text null check (hub_route is null or char_length(hub_route) <= 200),
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  emoji text null check (emoji is null or char_length(emoji) <= 16),
  blurb_he text null check (blurb_he is null or char_length(blurb_he) <= 500),
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_game_catalog_category_enabled_idx
  on public.site_game_catalog (category, is_enabled, sort_order);

comment on table public.site_game_catalog is
  'Admin master catalog for 21 site games (7 online + 4 offline + 10 solo). No legacy mleo-* entries.';

create or replace function public.site_game_category_has_enabled(p_category text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.site_game_catalog g
    where g.category = p_category
      and g.is_enabled = true
  );
$$;

revoke all on function public.site_game_category_has_enabled(text) from public;
grant execute on function public.site_game_category_has_enabled(text) to service_role;

create or replace function public.sync_site_game_catalog_enabled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.is_enabled is not distinct from new.is_enabled then
    return new;
  end if;

  new.updated_at := now();

  if new.category = 'online' then
    update public.arcade_games
    set
      enabled = new.is_enabled,
      foundation_only = case when new.is_enabled then false else foundation_only end
    where game_key = new.game_key;
  elsif new.category = 'solo' then
    update public.reward_economy_solo_game_rules
    set
      is_active = new.is_enabled,
      updated_at = now()
    where game_key = new.game_key;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_site_game_catalog_enabled() from public;
grant execute on function public.sync_site_game_catalog_enabled() to service_role;

drop trigger if exists trg_site_game_catalog_sync_enabled on public.site_game_catalog;
create trigger trg_site_game_catalog_sync_enabled
before insert or update of is_enabled, category, game_key
on public.site_game_catalog
for each row
execute function public.sync_site_game_catalog_enabled();

insert into public.site_game_catalog (
  game_key, category, title_he, route, hub_route, is_enabled, sort_order, emoji, blurb_he
) values
  (
    'fourline', 'online', 'Four in a Row', '/student/games/fourline', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'fourline'), true),
    10, '🎯', 'Play with friends in the arcade'
  ),
  (
    'ludo', 'online', 'Ludo', '/student/games/ludo', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'ludo'), true),
    20, '🎲', 'Play with friends in the arcade'
  ),
  (
    'snakes-and-ladders', 'online', 'Snakes and Ladders', '/student/games/snakes-and-ladders', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'snakes-and-ladders'), true),
    30, '🐍', 'Play with friends in the arcade'
  ),
  (
    'checkers', 'online', 'Checkers', '/student/games/checkers', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'checkers'), true),
    40, '♟️', 'Play with friends in the arcade'
  ),
  (
    'chess', 'online', 'Chess', '/student/games/chess', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'chess'), true),
    50, '♚', 'Play with friends in the arcade'
  ),
  (
    'dominoes', 'online', 'Dominoes', '/student/games/dominoes', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'dominoes'), true),
    60, '🁫', 'Play with friends in the arcade'
  ),
  (
    'bingo', 'online', 'Bingo', '/student/games/bingo', '/student/arcade',
    coalesce((select enabled from public.arcade_games where game_key = 'bingo'), true),
    70, '🎱', 'Play with friends in the arcade'
  ),
  ('tic-tac-toe', 'offline', 'Tic-Tac-Toe', '/offline/tic-tac-toe', '/offline', true, 10, '❌⭕️', 'Boards from 3×3 to 7×7 with score tracking.'),
  ('rock-paper-scissors', 'offline', 'Rock · Paper · Scissors', '/offline/rock-paper-scissors', '/offline', true, 20, '🪨📄✂️', 'Quick rounds — best of all.'),
  ('tap-battle', 'offline', 'Tap Battle', '/offline/tap-battle', '/offline', true, 30, '⚡️', 'Each side taps as fast as they can — who wins?'),
  ('memory-match', 'offline', 'Memory Match', '/offline/memory-match', '/offline', true, 40, '🧠', 'Flip cards, find pairs, and try to win.'),
  (
    'catcher', 'solo', 'Catch with Leo', '/student/solo-games/catcher', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'catcher'), true),
    10, '🎯', 'Catch coins and stay away from bombs!'
  ),
  (
    'flyer', 'solo', 'Leo in a Plane', '/student/solo-games/flyer', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'flyer'), true),
    20, '🪂', 'Hold to fly, collect coins, and avoid obstacles!'
  ),
  (
    'puzzle', 'solo', 'Leo''s Puzzle', '/student/solo-games/puzzle', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'puzzle'), true),
    30, '🧩', 'Merge tiles and rack up points before time runs out!'
  ),
  (
    'memory', 'solo', 'Leo''s Memory Game', '/student/solo-games/memory', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'memory'), true),
    40, '🧠', 'Flip cards and find pairs before the clock runs out!'
  ),
  (
    'leo-jump', 'solo', 'Leo Jumps', '/student/solo-games/leo-jump', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'leo-jump'), true),
    50, '🦘', 'Jump over obstacles and collect coins!'
  ),
  (
    'balloons', 'solo', 'Balloon Pop', '/student/solo-games/balloons', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'balloons'), true),
    60, '🎈', 'Pop balloons before time runs out!'
  ),
  (
    'maze', 'solo', 'Leo''s Maze', '/student/solo-games/maze', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'maze'), true),
    70, '🌀', 'Find the exit of the maze before time runs out!'
  ),
  (
    'picture-puzzle', 'solo', 'Picture Puzzle', '/student/solo-games/picture-puzzle', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'picture-puzzle'), true),
    80, '🖼️', 'Complete the pieces of Leo''s picture!'
  ),
  (
    'target-tap', 'solo', 'Target Tap', '/student/solo-games/target-tap', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'target-tap'), true),
    90, '🎯', 'Tap the targets before they disappear!'
  ),
  (
    'sort-shapes', 'solo', 'Sort Shapes', '/student/solo-games/sort-shapes', '/student/solo-games',
    coalesce((select is_active from public.reward_economy_solo_game_rules where game_key = 'sort-shapes'), true),
    100, '🔺', 'Sort shapes and colors into the correct boxes!'
  )
on conflict (game_key) do update set
  category = excluded.category,
  title_he = excluded.title_he,
  route = excluded.route,
  hub_route = excluded.hub_route,
  sort_order = excluded.sort_order,
  emoji = excluded.emoji,
  blurb_he = excluded.blurb_he,
  updated_at = now();

alter table public.site_game_catalog enable row level security;

comment on column public.site_game_catalog.is_enabled is
  'Admin per-game toggle. Syncs to arcade_games.enabled (online) or reward_economy_solo_game_rules.is_active (solo).';

commit;
