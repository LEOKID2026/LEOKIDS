import Link from "next/link";
import { getHomeBtnClasses, getHomeTextClasses } from "../home/home-theme";
import HomeCtaLink from "../home/HomeCtaLink";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

const QUICK_LINK_KEYS = [
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.math", href: "/practice/math" },
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.geometry", href: "/practice/geometry" },
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.english", href: "/practice/english" },
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.science", href: "/practice/science" },
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.digitalPractice", href: "/practice/no-print" },
  { labelKey: "ui.public.homepage.seoEntry.quickLinks.parentReports", href: "/practice/parent-reports" },
  {
    labelKey: "ui.public.homepage.seoEntry.quickLinks.homePracticeRoutine",
    href: "/guides/home-practice-routine",
  },
];

/**
 * In-page SEO entry — homepage / parents only. Not global footer or HUD.
 * @param {{ isBright: boolean }} props
 */
export default function PublicSeoEntrySection({ isBright }) {
  const t = useT();
  const cls = getHomeTextClasses(isBright);

  return (
    <section
      className={`space-y-5 text-center md:space-y-6 ${cls.panel}`}
      data-testid="public-seo-entry-section"
    >
      <h2 className={cls.sectionTitle}>{t("ui.public.homepage.seoEntry.title")}</h2>
      <p className={`mx-auto max-w-2xl text-sm leading-relaxed md:text-base ${cls.body}`}>
        {t("ui.public.homepage.seoEntry.body")}
      </p>

      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <HomeCtaLink
          href="/practice"
          label={t("ui.public.homepage.seoEntry.practiceAreasCta")}
          className={getHomeBtnClasses("parents", isBright, "primary")}
          size="md"
          testId="public-seo-entry-practice"
        />
        <HomeCtaLink
          href="/guides"
          label={t("ui.public.homepage.seoEntry.parentGuidesCta")}
          className={getHomeBtnClasses("parents", isBright, "secondary")}
          size="md"
          testId="public-seo-entry-guides"
        />
      </div>

      <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
        {QUICK_LINK_KEYS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={
                isBright
                  ? "text-sky-700 underline underline-offset-2 hover:text-sky-900"
                  : "text-sky-300 underline underline-offset-2 hover:text-sky-100"
              }
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
