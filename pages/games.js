import Layout from "../components/Layout";
import PageSeo from "../components/seo/PageSeo";
import { getPublicPageSeo } from "../lib/site/public-page-seo.js";
import { useIOSViewportFix } from "../hooks/useIOSViewportFix";
import { useGamesHubUi } from "../hooks/useGamesHubUi.js";
import { useStudentTheme } from "../contexts/StudentThemeContext.jsx";
import GameHubCard from "../components/games/GameHubCard.jsx";
import GamesHubNavBar from "../components/games/GamesHubNavBar.jsx";
import GamesHubHeader from "../components/games/GamesHubHeader.jsx";
import { useStudentGameAccess } from "../hooks/useStudentGameAccess.js";
import { hubCardKeyToCategory, GAME_ACCESS_STATES } from "../lib/games/game-catalog.constants.js";
import { useT } from "../lib/i18n/I18nProvider.jsx";

const GAME_HUB_CARD_KEYS = [
  { key: "regular", titleKey: "games.hubRegularTitle", blurbKey: "games.hubRegularBlurb", emoji: "🎮", href: "/game" },
  { key: "online", titleKey: "games.hubOnlineTitle", blurbKey: "games.hubOnlineBlurb", emoji: "🌐", href: "/student/arcade" },
  { key: "offline", titleKey: "games.hubOfflineTitle", blurbKey: "games.hubOfflineBlurb", emoji: "🔌", href: "/offline" },
  { key: "educational", titleKey: "games.hubEducationalTitle", blurbKey: "games.hubEducationalBlurb", emoji: "📚", href: "/student/educational-games" },
];

const gamesSeo = getPublicPageSeo("games");

export default function GamesHubPage() {
  useIOSViewportFix();
  const t = useT();
  const { theme } = useStudentTheme();
  const { GH } = useGamesHubUi();
  const { state, categoryState, isGuest } = useStudentGameAccess();

  return (
    <Layout studentTheme={theme} studentShell="home">
      <PageSeo
        title={gamesSeo.title}
        description={gamesSeo.description}
        canonicalPath={gamesSeo.canonicalPath}
      />
      <main className={GH.pageWrap} dir="ltr" lang="en">
        <div className={`${GH.container} space-y-4`}>
          <GamesHubNavBar
            backHref="/student/home"
            backLabel={t("games.back")}
            badge={`🎯 ${t("games.gamesBadge")}`}
            backBtnClass={GH.backBtn}
            badgeClass={GH.badge}
          />

          <GamesHubHeader
            title=""
            subtitle={t("games.hubSubtitle")}
            titleClass={GH.hubTitle}
            subtitleClass={GH.hubSub}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {state === "loading"
              ? null
              : GAME_HUB_CARD_KEYS.map((card) => {
                const category = hubCardKeyToCategory(card.key);
                const catState = category ? categoryState(category) : null;
                const guestBrowseOnly =
                  isGuest && catState?.state === GAME_ACCESS_STATES.GUEST_LOCKED && catState?.visible;
                const categoryLocked = Boolean(catState?.locked) && !guestBrowseOnly;
                const categoryHref =
                  catState?.playable || guestBrowseOnly ? card.href : undefined;
                return (
                  <GameHubCard
                    key={card.key}
                    title={t(card.titleKey)}
                    emoji={card.emoji}
                    blurb={t(card.blurbKey)}
                    href={categoryHref}
                    cardClass={`${GH.card} text-left min-h-[9.5rem] md:min-h-[11rem]`}
                    ctaClass={GH.cardCta}
                    hidden={catState ? !catState.visible : false}
                    locked={categoryLocked}
                    lockTitle={catState?.message || undefined}
                  />
                );
              })}
          </section>
        </div>
      </main>
    </Layout>
  );
}
