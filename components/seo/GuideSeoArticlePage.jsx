import Link from "next/link";
import { getGuideLink } from "../../data/seo/guide-pages";
import { GUIDE_HUB_CARDS } from "../../data/seo/guide-pages";
import { getHomeBtnClasses } from "../home/home-theme";
import HomeCtaLink from "../home/HomeCtaLink";
import PublicSeoWideLayout from "./PublicSeoWideLayout";
import PublicSeoWideSectionBody from "./PublicSeoWideSectionBody";
import PublicSeoWideCardGrid from "./PublicSeoWideCardGrid";
import PublicSeoWideFooterCta from "./PublicSeoWideFooterCta";
import PublicSeoWideRelatedGuides from "./PublicSeoWideRelatedGuides";
import PracticeSeoFaq from "./PracticeSeoFaq";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";
import { DEFAULT_PUBLIC_SEO_FOOTER_CTA } from "./public-seo-wide-defaults";

/**
 * @param {{ content: import("../../data/seo/guide-pages").GuidePageContent, isHub?: boolean }} props
 */
export default function GuideSeoArticlePage({ content, isHub = false }) {
  const { isBright } = useStudentTheme();
  const cls = getPublicSeoWideClasses(isBright);
  const pageKind = isHub ? "guides-hub" : "guides-inner";

  const relatedGuides = (content.relatedGuideSlugs || [])
    .map((s) => getGuideLink(s))
    .filter(Boolean);

  const footerCta = content.footerCta ?? DEFAULT_PUBLIC_SEO_FOOTER_CTA;

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
          cards={GUIDE_HUB_CARDS}
          isBright={isBright}
          heading={content.hubCardsHeading || "Choose a guide by goal"}
          testId="guides-hub-list"
        />
      ) : null}

      {!isHub && content.relatedPracticePath ? (
        <aside className={`space-y-3 ${cls.highlight}`} data-testid="guide-practice-cta">
          <h2 className={cls.sectionSubtitle}>From guide to practice</h2>
          <p className={`w-full text-sm md:text-base ${cls.body}`}>
            After you choose an approach, go to the matching practice area and pick a grade and topic.
            You can return to the guide at any step to adjust what comes next.
          </p>
          <HomeCtaLink
            href={content.relatedPracticePath}
            label={content.practiceCtaLabel || "All practice areas"}
            className={getHomeBtnClasses("parents", isBright, "secondary")}
            size="md"
          />
        </aside>
      ) : null}

      {isHub ? (
        <section className={`space-y-3 ${cls.highlight}`}>
          <h2 className={cls.sectionSubtitle}>From guides to practice</h2>
          <p className={`w-full text-sm md:text-base ${cls.body}`}>
            Practice pages bring together subjects, topics, and available activities so you can choose
            your next step by goal.
          </p>
          <HomeCtaLink
            href="/practice"
            label="All practice areas"
            className={getHomeBtnClasses("parents", isBright, "secondary")}
            size="md"
          />
        </section>
      ) : null}

      {relatedGuides.length ? (
        <section className={`space-y-3 ${cls.section}`}>
          <h2 className={cls.sectionSubtitle}>More guides</h2>
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
