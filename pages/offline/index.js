import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
import { useIOSViewportFix } from "../../hooks/useIOSViewportFix";
import { useOfflineHubUi } from "../../hooks/useOfflineHubUi.js";
import OfflineHubPageShell from "../../components/offline/OfflineHubPageShell.jsx";
import GameAccessGuard from "../../components/games/GameAccessGuard.jsx";
import GamesHubNavBar from "../../components/games/GamesHubNavBar.jsx";
import GamesHubHeader from "../../components/games/GamesHubHeader.jsx";
import OfflineHubGameCard from "../../components/games/OfflineHubGameCard.jsx";
import { useStudentGameAccess } from "../../hooks/useStudentGameAccess.js";
const OFFLINE_GAMES = [
  {
    slug: "tic-tac-toe",
    gameKey: "tic-tac-toe",
    title: gamePackCopy("pages__offline__index", "tic_tac_toe"),
    emoji: "❌⭕️",
    players: "2 players",
    blurb: gamePackCopy("pages__offline__index", "boards_from_3_3_to_7_7_with_score_tracking"),
  },
  {
    slug: "rock-paper-scissors",
    gameKey: "rock-paper-scissors",
    title: gamePackCopy("pages__offline__index", "rock_paper_scissors"),
    titleOneLine: true,
    emoji: "🪨📄✂️",
    players: "2 players or vs robot",
    blurb: gamePackCopy("pages__offline__index", "quick_rounds_best_of_all"),
  },
  {
    slug: "tap-battle",
    gameKey: "tap-battle",
    title: gamePackCopy("pages__offline__index", "tap_battle"),
    emoji: "⚡️",
    players: "2 players",
    blurb: gamePackCopy("pages__offline__index", "each_side_taps_as_fast_as_they_can_who_wins"),
  },
  {
    slug: "memory-match",
    gameKey: "memory-match",
    title: gamePackCopy("pages__offline__index", "memory_match"),
    emoji: "🧠",
    players: "1–2 players",
    blurb: gamePackCopy("pages__offline__index", "flip_cards_find_pairs_and_try_to_win"),
  },
];

export default function OfflineHub() {
  useIOSViewportFix();
  const { GH } = useOfflineHubUi();
  const { state, gamesByKey, isGuest } = useStudentGameAccess();
  const visibleGames = OFFLINE_GAMES.filter((g) => {
    const row = gamesByKey[g.gameKey];
    if (!row?.isEnabled) return false;
    if (isGuest) return true;
    return row.playable;
  }).map((g) => ({
    ...g,
    locked: isGuest && !gamesByKey[g.gameKey]?.playable,
  }));

  return (
    <OfflineHubPageShell>
      <GameAccessGuard category="offline">
        <div className={`${GH.container} space-y-4`}>
          <GamesHubNavBar
            backHref="/games"
            backLabel="Games"
            badge="🔌 Always with Leo"
            backBtnClass={GH.backBtn}
            badgeClass={GH.badge}
          />

          <GamesHubHeader
            title={gamePackCopy("pages__offline__index", "always_on_games_with_leo")}
            subtitle={gamePackCopy("pages__offline__index", "play_on_the_same_device_even_offline")}
            titleClass={GH.hubTitle}
            subtitleClass={GH.hubSub}
          />

          <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {state === "loading"
              ? null
              : visibleGames.map((game) => (
                  <OfflineHubGameCard key={game.slug} game={game} GH={GH} />
                ))}
          </section>
        </div>
      </GameAccessGuard>
    </OfflineHubPageShell>
  );
}
