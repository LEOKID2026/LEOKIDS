import Link from "next/link";
import { useMemo } from "react";
import { useGlobalBurnDownCopy } from "../../hooks/useGlobalBurnDownCopy.js";
import { useT, useI18n } from "../../lib/i18n/I18nProvider.jsx";
import {
  getGuideHubCardsForLocale,
  getGuideLinkForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import { getHomeBtnClasses } from "../home/home-theme";
import HomeCtaLink from "../home/HomeCtaLink";
import PublicSeoWideLayout from "./PublicSeoWideLayout";
import PublicSeoWideSectionBody from "./PublicSeoWideSectionBody";
import PublicSeoWideCardGrid from "./PublicSeoWideCardGrid";
import PublicSeoWideFooterCta from "./PublicSeoWideFooterCta";
import PracticeSeoFaq from "./PracticeSeoFaq";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";
import { useDefaultPublicSeoFooterCta } from "../../hooks/usePublicSeoFooterCta.js";

/**
 * @param {{ content: import("../../data/seo/guide-pages").GuidePageContent, isHub?: boolean }} props
 */
export default function GuideSeoArticlePage({ content, isHub = false }) {
  const { isBright } = useStudentTheme();
  const burnDown = useGlobalBurnDownCopy();
  const t = useT();
  const { locale } = useI18n();
  const defaultFooterCta = useDefaultPublicSeoFooterCta();
  const cls = getPublicSeoWideClasses(isBright);
  const pageKind = isHub ? "guides-hub" : "guides-inner";

  const hubCards = useMemo(() => getGuideHubCardsForLocale(locale), [locale]);

  const relatedGuides = useMemo(
    () => (content.relatedGuideSlugs || []).map((s) => getGuideLinkForLocale(locale, s)).filter(Boolean),
    [content.relatedGuideSlugs, locale]
  );

  const footerCta = content.footerCta ?? defaultFooterCta;

  return (
    <PublicSeoWideLayout
      seoKey={content.seoKey}
      pageKind={pageKind}
      badge={content.badge}
      h1={content.h1}
      intro={content.intro}
      footer={<PublicSeoWideFooterCta {...footerCta} isBright={isBright} />}
    >
      {content.sections?.map((section) => (
        <PublicSeoWideSectionBody key={section.title} section={section} isBright={isBright} />
      ))}

      {isHub ? (
        <PublicSeoWideCardGrid
          cards={hubCards}
          isBright={isBright}
          heading={content.hubCardsHeading || t("ui.public.seoNav.chooseGuideByGoal")}
          testId="guides-hub-list"
        />
      ) : null}

      {!isHub && content.relatedPracticePath ? (
        <aside className={`space-y-3 ${cls.highlight}`} data-testid="guide-practice-cta">
          <h2 className={cls.sectionSubtitle}>{t("ui.public.seoNav.fromGuideToPracticeTitle")}</h2>
          <p className={`w-full text-sm md:text-base ${cls.body}`}>
            {t("ui.public.seoNav.fromGuideToPracticeBody")}
          </p>
          <HomeCtaLink
            href={content.relatedPracticePath}
            label={
              content.practiceCtaLabel ||
              burnDown("components__seo__GuideSeoArticlePage", "all_practice_areas") ||
              t("ui.public.seoNav.allPracticeAreas")
            }
            className={getHomeBtnClasses("parents", isBright, "secondary")}
            size="md"
          />
        </aside>
      ) : null}

      {isHub ? (
        <section className={`space-y-3 ${cls.highlight}`}>
          <h2 className={cls.sectionSubtitle}>{t("ui.public.seoNav.fromGuidesToPracticeTitle")}</h2>
          <p className={`w-full text-sm md:text-base ${cls.body}`}>
            {t("ui.public.seoNav.fromGuidesToPracticeBody")}
          </p>
          <HomeCtaLink
            href="/practice"
            label={
              burnDown("components__seo__GuideSeoArticlePage", "all_practice_areas") ||
              t("ui.public.seoNav.allPracticeAreas")
            }
            className={getHomeBtnClasses("parents", isBright, "secondary")}
            size="md"
          />
        </section>
      ) : null}

      {relatedGuides.length ? (
        <section className={`space-y-3 ${cls.section}`}>
          <h2 className={cls.sectionSubtitle}>{t("ui.public.seoNav.moreGuides")}</h2>
          <ul className={`space-y-2 text-sm md:text-base ${cls.body}`}>
            {relatedGuides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={cls.linkViolet}>
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PracticeSeoFaq items={content.faq} isBright={isBright} />
    </PublicSeoWideLayout>
  );
}
