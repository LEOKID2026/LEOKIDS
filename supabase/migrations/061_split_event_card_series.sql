-- ===========================================================================
-- 061 — Assign GLOBAL event cards to the events series
-- MANUAL APPLY — review and run in Supabase SQL editor.
--
-- GLOBAL: no Israeli holiday series and no Israel-only event card keys.
-- Does NOT change prices, flags, images, or card keys for GLOBAL events.
-- Legacy *_he columns are left empty; product copy comes from locale packs.
-- ===========================================================================

begin;

update public.reward_card_series
set
  name_he = '',
  description_he = '',
  display_order = 31,
  is_active = true,
  updated_at = now()
where slug = 'events';

update public.reward_cards c
set series_id = s.id, updated_at = now()
from public.reward_card_series s
where s.slug = 'events'
  and c.card_type = 'event'
  and c.card_key in (
    'event_back_to_learning',
    'event_summer',
    'event_winter',
    'event_birthday',
    'event_end_of_year'
  );

commit;
