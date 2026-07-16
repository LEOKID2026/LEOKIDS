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
    title: "Tic-Tac-Toe",
    emoji: "❌⭕️",
    players: "2 players",
    blurb: "Boards from 3×3 to 7×7 with score tracking.",
  },
  {
    slug: "rock-paper-scissors",
    gameKey: "rock-paper-scissors",
    title: "Rock · Paper · Scissors",
    titleOneLine: true,
    emoji: "🪨📄✂️",
    players: "2 players or vs robot",
    blurb: "Quick rounds — best of all.",
  },
  {
    slug: "tap-battle",
    gameKey: "tap-battle",
    title: "Tap Battle",
    emoji: "⚡️",
    players: "2 players",
    blurb: "Each side taps as fast as they can — who wins?",
  },
  {
    slug: "memory-match",
    gameKey: "memory-match",
    title: "Memory Match",
    emoji: "🧠",
    players: "1–2 players",
    blurb: "Flip cards, find pairs, and try to win.",
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
            title="Always-on games with Leo"
            subtitle="Play on the same device — even offline."
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
