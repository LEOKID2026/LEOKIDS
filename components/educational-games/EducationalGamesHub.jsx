import Link from "next/link";
import Layout from "../Layout";
import { useGamesHubUi } from "../../hooks/useGamesHubUi.js";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import GameAccessGuard from "../games/GameAccessGuard.jsx";
import GamesHubNavBar from "../games/GamesHubNavBar.jsx";
import GamesHubHeader from "../games/GamesHubHeader.jsx";
import GamesHubLockFooter from "../games/GamesHubLockFooter.jsx";
import { useStudentGameAccess } from "../../hooks/useStudentGameAccess.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

export default function EducationalGamesHub() {
  const { theme } = useStudentTheme();
  const { GH } = useGamesHubUi();
  const { direction } = useI18n();
  const t = useT();
  const { state, playableGames, enabledGames, isGuest } = useStudentGameAccess();
  const games = isGuest ? enabledGames("educational") : playableGames("educational");

  return (
    <Layout studentTheme={theme} studentShell="home">
      <GameAccessGuard category="educational">
        <main className={GH.pageWrap} dir={direction}>
          <div className={`${GH.container} space-y-4`}>
            <GamesHubNavBar
              backHref="/games"
              backLabel={t("games.back")}
              badge={`📚 ${t("games.educationalBadge")}`}
              backBtnClass={GH.backBtn}
              badgeClass={GH.badge}
            />

            <GamesHubHeader
              title={t("games.educationalHubTitle")}
              subtitle={t("games.educationalHubSubtitle")}
              titleClass={GH.hubTitle}
              subtitleClass={GH.hubSub}
            />

            <section className="grid sm:grid-cols-2 gap-3 md:gap-4">
              {state === "loading" ? null : games.length === 0 ? (
                <p className={`col-span-full text-center text-sm ${GH.muted}`}>
                  אין משחקים חינוכיים זמינים כרגע
                </p>
              ) : (
                games.map((row) => {
                  const locked = isGuest && !row.playable;
                  const cardBody = (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={GH.cardEmoji}>{row.emoji || "📚"}</div>
                        <div>
                          <h2 className={GH.cardTitle}>{row.titleHe}</h2>
                          <p className={GH.cardMeta}>משחק חינוכי · מטבעות</p>
                        </div>
                      </div>
                      <p className={`${GH.cardBlurb} flex-1`}>{row.blurbHe}</p>
                      {locked ? (
                        <GamesHubLockFooter ctaClass={GH.cardCta} />
                      ) : (
                        <span className={GH.cardCta}>שחק עכשיו</span>
                      )}
                    </>
                  );

                  if (locked) {
                    return (
                      <div key={row.gameKey} className={`${GH.card} opacity-80`} aria-disabled="true">
                        {cardBody}
                      </div>
                    );
                  }

                  return (
                    <Link key={row.gameKey} href={row.route} className={GH.card}>
                      {cardBody}
                    </Link>
                  );
                })
              )}
            </section>
          </div>
        </main>
      </GameAccessGuard>
    </Layout>
  );
}

