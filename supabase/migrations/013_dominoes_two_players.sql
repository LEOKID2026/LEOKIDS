-- Dominoes: two-player only (fits engine and maybeStartDominoesSession).

begin;

update public.arcade_games
set min_players = 2,
    max_players = 2
where game_key = 'dominoes';

commit;
