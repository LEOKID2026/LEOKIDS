import Link from "next/link";
import { useOfflineHubUi } from "../../hooks/useOfflineHubUi.js";
import OfflineHubGameCard from "../games/OfflineHubGameCard.jsx";
import OfflineHubTileCard from "../games/OfflineHubTileCard.jsx";
import OfflineHubPageShell from "./OfflineHubPageShell.jsx";
import {
  OFFLINE_EDUCATIONAL_GAMES,
  OFFLINE_EDUCATIONAL_HUB_ROUTE,
  OFFLINE_HUB_ROUTE,
  OFFLINE_SOLO_GAMES,
  OFFLINE_SOLO_HUB_ROUTE,
  SAME_DEVICE_OFFLINE_GAMES,
} from "../../lib/offline/offline-game-catalog.js";
import { STUDENT_OFFLINE_FULL_GAMES_ENABLED } from "../../lib/offline/offline-flags.js";
import OfflineReconnectBanner from "./OfflineReconnectBanner.jsx";
import OfflinePrecacheWarmup from "./OfflinePrecacheWarmup.jsx";

function OfflineSectionTitle({ children, GH }) {
  return (
    <h2 className={GH.sectionTitle} dir="ltr">
      {children}
    </h2>
  );
}

export default function OfflineHub() {
  const { GH } = useOfflineHubUi();
  const fullGames = STUDENT_OFFLINE_FULL_GAMES_ENABLED;

  return (
    <>
      <OfflinePrecacheWarmup />
      <OfflineHubPageShell>
        <div className={`${GH.container} space-y-5`}>
          <header className="space-y-2 text-center sm:text-left">
            <p className={GH.badge}>🔌 Offline Games</p>
            <h1 className={GH.hubTitle}>Offline Games</h1>
            <p className={GH.hubSub}>Local games - no saving and no rewards</p>
          </header>

          <OfflineReconnectBanner />

          <section className="space-y-3">
            <OfflineSectionTitle GH={GH}>Same-Device Games</OfflineSectionTitle>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {SAME_DEVICE_OFFLINE_GAMES.map((game) => (
                <OfflineHubGameCard
                  key={game.slug}
                  game={game}
                  GH={GH}
                  hrefBase={`${OFFLINE_HUB_ROUTE}/`}
                />
              ))}
            </div>
          </section>

          {fullGames ? (
            <>
              <section className="space-y-3">
                <OfflineSectionTitle GH={GH}>Leo Solo Games</OfflineSectionTitle>
                <OfflineHubTileCard
                  href={OFFLINE_SOLO_HUB_ROUTE}
                  emoji="🎮"
                  title="12 Solo Games"
                  blurb="Tag, puzzles, mazes and more - no connection needed."
                  GH={GH}
                />
              </section>

              <section className="space-y-3">
                <OfflineSectionTitle GH={GH}>Educational Games</OfflineSectionTitle>
                <OfflineHubTileCard
                  href={OFFLINE_EDUCATIONAL_HUB_ROUTE}
                  emoji="📚"
                  title={`${OFFLINE_EDUCATIONAL_GAMES.length} Educational Games`}
                  blurb="Recycling, grocery store, lab, pizzeria, word train and more - all local."
                  GH={GH}
                />
              </section>
            </>
          ) : null}
        </div>
      </OfflineHubPageShell>
    </>
  );
}

/** Solo sub-hub grid — only rendered behind OfflineFullGamesRouteGuard. */
export function OfflineSoloGamesHub() {
  const { GH } = useOfflineHubUi();

  return (
    <OfflineHubPageShell>
      <div className={`${GH.container} space-y-4`}>
        <GamesHubNav offlineHubRoute={OFFLINE_HUB_ROUTE} title="Leo Games - Offline" GH={GH} />
        <OfflineReconnectBanner />
        <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {OFFLINE_SOLO_GAMES.map((game) => (
            <OfflineHubTileCard
              key={game.id}
              href={game.route}
              emoji={game.emoji}
              title={game.titleHe}
              blurb={game.blurbHe}
              GH={GH}
            />
          ))}
        </section>
      </div>
    </OfflineHubPageShell>
  );
}

/** Educational sub-hub — only rendered behind OfflineFullGamesRouteGuard. */
export function OfflineEducationalGamesHub() {
  const { GH } = useOfflineHubUi();

  return (
    <OfflineHubPageShell>
      <div className={`${GH.container} space-y-4`}>
        <GamesHubNav offlineHubRoute={OFFLINE_HUB_ROUTE} title="Educational Games - Offline" GH={GH} />
        <OfflineReconnectBanner />
        <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {OFFLINE_EDUCATIONAL_GAMES.map((game) => (
            <OfflineHubTileCard
              key={game.id}
              href={game.route}
              emoji={game.emoji}
              title={game.titleHe}
              blurb={game.blurbHe}
              GH={GH}
            />
          ))}
        </section>
      </div>
    </OfflineHubPageShell>
  );
}

function GamesHubNav({ offlineHubRoute, title, GH }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link href={offlineHubRoute} className={GH.backBtn}>
        Back
      </Link>
      <h1 className={`${GH.hubTitle} !text-lg sm:!text-xl`}>{title}</h1>
      <span className="w-16" aria-hidden />
    </div>
  );
}
