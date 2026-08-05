-- Waiting window before game start (games with min < max): when min active players was first reached.

begin;

alter table public.arcade_rooms
  add column if not exists start_window_started_at timestamptz;

comment on column public.arcade_rooms.start_window_started_at is
  'Arcade: start of Auto-start window (after min_players joined and room still has space). Resets when below min or when room opens.';

commit;
