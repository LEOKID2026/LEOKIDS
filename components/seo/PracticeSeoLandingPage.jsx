import Link from "next/link";
import { useMemo } from "react";
import { getGuideLinkForLocale } from "../../lib/seo/locale-public-seo-content.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import PublicSeoWideLayout from "./PublicSeoWideLayout";
import PublicSeoWideSectionBody from "./PublicSeoWideSectionBody";
import PublicSeoWideCardGrid from "./PublicSeoWideCardGrid";
import PublicSeoWideFooterCta from "./PublicSeoWideFooterCta";
import PublicSeoWideRelatedGuides from "./PublicSeoWideRelatedGuides";
import PublicSeoWorksheetsHubSlot from "./PublicSeoWorksheetsHubSlot";
import PracticeSeoFaq from "./PracticeSeoFaq";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";
import { useDefaultPublicSeoFooterCta, useWorksheetsPublicSeoFooterCta } from "../../hooks/usePublicSeoFooterCta.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

const WORKSHEETS_HUB_SPLIT_INDEX = 2;

/**
 * @param {{ content: import("../../data/seo/practice-pages").PracticePageContent || import("../../data/seo/worksheets-pages.en.js").WorksheetsPageContent }} props
 */
export default function PracticeSeoLandingPage({ content }) {
  const { isBright } = useStudentTheme();
  const defaultFooterCta = useDefaultPublicSeoFooterCta();
  const worksheetsFooterCta = useWorksheetsPublicSeoFooterCta();
  const cls = getPublicSeoWideClasses(isBright);
  const isWorksheets = content.seoKey === "practice-worksheets";
  const isHub = content.slug === "hub";
  const pageKind = isHub ? "practice-hub" : "practice-inner";

  const { locale } = useI18n();
  const t = useT();
  const relatedGuides = useMemo(
    () => (content.relatedGuideSlugs || []).map((s) => getGuideLinkForLocale(locale, s)).filter(Boolean),
    [content.relatedGuideSlugs, locale]
  );

  const sections = content.sections || [];
  const preHubSections = isWorksheets ? sections.slice(0, WORKSHEETS_HUB_SPLIT_INDEX) : sections;
  const postHubSections = isWorksheets ? sections.slice(WORKSHEETS_HUB_SPLIT_INDEX) : [];

  const footerCta =
    content.footerCta ?? (isWorksheets ? worksheetsFooterCta : defaultFooterCta);

  return (
    <PublicSeoWideLayout
      seoKey={content.seoKey}
      pageKind={pageKind}
      badge={content.badge}
      h1={content.h1}
      intro={content.intro}
      footer={<PublicSeoWideFooterCta {...footerCta} isBright={isBright} />}
    >
      {content.hubCards?.length ? (
        <PublicSeoWideCardGrid cards={content.hubCards} isBright={isBright} />
      ) : null}

      {preHubSections.map((section) => (
        <PublicSeoWideSectionBody key={section.title} section={section} isBright={isBright} />
      ))}

      {isWorksheets ? <PublicSeoWorksheetsHubSlot /> : null}

      {postHubSections.map((section) => (
        <PublicSeoWideSectionBody key={section.title} section={section} isBright={isBright} />
      ))}

      {content.relatedPracticeLinks?.length ? (
        <section className={`space-y-4 ${cls.section}`}>
          <h2 className={cls.sectionTitle}>{t("ui.public.seoNav.morePracticeAreas")}</h2>
          <ul className={`space-y-2 text-sm md:text-base ${cls.body}`}>
            {content.relatedPracticeLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={cls.linkSky}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PublicSeoWideRelatedGuides guides={relatedGuides} isBright={isBright} />

      <PracticeSeoFaq items={content.faq} isBright={isBright} />
    </PublicSeoWideLayout>
  );
}
