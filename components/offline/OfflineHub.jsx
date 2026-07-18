import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
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
            <h1 className={GH.hubTitle}>{gamePackCopy("components__offline__OfflineHub", "offline_games")}</h1>
            <p className={GH.hubSub}>{gamePackCopy("components__offline__OfflineHub", "local_games_no_saving_and_no_rewards")}</p>
          </header>

          <OfflineReconnectBanner />

          <section className="space-y-3">
            <OfflineSectionTitle GH={GH}>{gamePackCopy("components__offline__OfflineHub", "same_device_games")}</OfflineSectionTitle>
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
                <OfflineSectionTitle GH={GH}>{gamePackCopy("components__offline__OfflineHub", "leo_solo_games")}</OfflineSectionTitle>
                <OfflineHubTileCard
                  href={OFFLINE_SOLO_HUB_ROUTE}
                  emoji="🎮"
                  title="12 Solo Games"
                  blurb={gamePackCopy("components__offline__OfflineHub", "tag_puzzles_mazes_and_more_no_connection_needed")}
                  GH={GH}
                />
              </section>

              <section className="space-y-3">
                <OfflineSectionTitle GH={GH}>{gamePackCopy("components__offline__OfflineHub", "educational_games")}</OfflineSectionTitle>
                <OfflineHubTileCard
                  href={OFFLINE_EDUCATIONAL_HUB_ROUTE}
                  emoji="📚"
                  title={`${OFFLINE_EDUCATIONAL_GAMES.length} Educational Games`}
                  blurb={gamePackCopy("components__offline__OfflineHub", "recycling_grocery_store_lab_pizzeria_word_train_and_more_all_local")}
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
        <GamesHubNav offlineHubRoute={OFFLINE_HUB_ROUTE} title={gamePackCopy("components__offline__OfflineHub", "leo_games_offline")} GH={GH} />
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
        <GamesHubNav offlineHubRoute={OFFLINE_HUB_ROUTE} title={gamePackCopy("components__offline__OfflineHub", "educational_games_offline")} GH={GH} />
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
      <Link href={offlineHubRoute} className={GH.backBtn}>{gamePackCopy("components__offline__OfflineHub", "back")}</Link>
      <h1 className={`${GH.hubTitle} !text-lg sm:!text-xl`}>{title}</h1>
      <span className="w-16" aria-hidden />
    </div>
  );
}
