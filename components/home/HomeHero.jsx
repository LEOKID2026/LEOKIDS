import { HOMEPAGE_ROUTES } from "../../data/home/homepage-copy.js";
import { useHomepageCopy } from "../../hooks/useHomepageCopy.js";
import { WORKSHEET_HUB_ENTRY_ENABLED } from "../../lib/worksheets/worksheet-hub-entry-enabled.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import GlobalCoverageMap from "../i18n/GlobalCoverageMap.jsx";
import { getHomeBtnClasses, getHomeTextClasses } from "./home-theme";
import HomeCtaLink from "./HomeCtaLink";

function HeroButtons({ isBright, copy, className = "" }) {
  const parentBtn = `${getHomeBtnClasses("parents", isBright, "primary")} min-h-12 w-full whitespace-nowrap px-6 text-base font-bold sm:w-auto md:min-h-[3.25rem] md:px-8 md:text-lg`;
  const kidsBtn = `${getHomeBtnClasses("kids", isBright, "secondary")} min-h-12 w-full whitespace-nowrap px-6 text-base font-bold sm:w-auto md:min-h-[3.25rem] md:px-8 md:text-lg`;
  const worksheetsBtn = `${getHomeBtnClasses("teachers", isBright, "secondary")} min-h-12 w-full whitespace-nowrap px-6 text-base font-bold sm:w-auto md:min-h-[3.25rem] md:px-8 md:text-lg`;

  return (
    // Wrap within the content column only (no lg:nowrap) so long CTAs never spill under the map.
    <div className={`flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <HomeCtaLink
        href={HOMEPAGE_ROUTES.parentLogin}
        label={copy.parentCta}
        className={parentBtn}
        testId="home-hero-parent-cta"
      />
      <HomeCtaLink
        href={HOMEPAGE_ROUTES.studentLogin}
        label={copy.kidsCta}
        className={kidsBtn}
        testId="home-hero-kids-cta"
      />
      {WORKSHEET_HUB_ENTRY_ENABLED ? (
        <HomeCtaLink
          href={HOMEPAGE_ROUTES.worksheets}
          label={copy.worksheetsCta}
          className={worksheetsBtn}
          testId="home-hero-worksheets-cta"
        />
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          data-testid="home-hero-worksheets-cta"
          className={`${worksheetsBtn} cursor-not-allowed opacity-55`}
        >
          {copy.worksheetsCta}
        </button>
      )}
    </div>
  );
}

/**
 * Marketing hero — text + buttons || localized coverage map (replaces upper parent promo).
 * Map/card size matches pre-02523d5c4; CTAs wrap inside the content column only.
 * @param {{ isBright: boolean }} props
 */
export default function HomeHero({ isBright }) {
  const homepage = useHomepageCopy();
  const copy = homepage.hero;
  const cls = getHomeTextClasses(isBright);
  const titleClass = isBright ? "text-sky-900" : "text-sky-100";
  const { t } = useI18n();

  const mapWrap = isBright
    ? "w-full min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-xl shadow-sky-300/35 ring-1 ring-white/50 sm:p-4 lg:rounded-3xl lg:shadow-2xl"
    : "w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-3 shadow-2xl shadow-black/45 ring-1 ring-white/10 sm:p-4 lg:rounded-3xl";

  return (
    <section data-testid="home-hero" className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-4 text-center lg:gap-5 lg:text-start">
            <p
              className={`inline-flex items-center justify-center self-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wide md:text-sm lg:self-start ${cls.heroBadge}`}
            >
              {copy.badge}
            </p>

            <h1
              className={`text-[1.9rem] font-black leading-[1.1] md:text-4xl lg:text-[3rem] ${titleClass}`}
            >
              {copy.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className={`text-sm leading-relaxed md:text-base lg:text-lg ${cls.body}`}>
              {copy.subtitle}
            </p>

            <p
              className={`text-xs font-semibold md:text-sm ${cls.muted}`}
              data-testid="home-hero-reinforcement"
            >
              {copy.reinforcement}
            </p>

            <HeroButtons isBright={isBright} copy={copy} className="mt-1 justify-center lg:justify-start" />
          </div>

          <div
            className={mapWrap}
            data-testid="home-hero-coverage-map"
            aria-label={t("ui.languageSwitcher.coverageMapTitle")}
          >
            <GlobalCoverageMap
              showTitle
              compact={!isBright}
              className={isBright ? "" : "text-sky-50"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
