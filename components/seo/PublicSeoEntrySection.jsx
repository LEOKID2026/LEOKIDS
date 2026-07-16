import Link from "next/link";
import { getHomeBtnClasses, getHomeTextClasses } from "../home/home-theme";
import HomeCtaLink from "../home/HomeCtaLink";

const QUICK_LINKS = [
  { label: "Math", href: "/practice/math" },
  { label: "Geometry", href: "/practice/geometry" },
  { label: "English", href: "/practice/english" },
  { label: "Science", href: "/practice/science" },
  { label: "Digital practice", href: "/practice/no-print" },
  { label: "Parent reports", href: "/practice/parent-reports" },
  { label: "Home practice routine", href: "/guides/home-practice-routine" },
];

/**
 * In-page SEO entry — homepage / parents only. Not global footer or HUD.
 * @param {{ isBright: boolean }} props
 */
export default function PublicSeoEntrySection({ isBright }) {
  const cls = getHomeTextClasses(isBright);

  return (
    <section
      className={`space-y-5 text-center md:space-y-6 ${cls.panel}`}
      data-testid="public-seo-entry-section"
    >
      <h2 className={cls.sectionTitle}>Practice areas and parent guides</h2>
      <p className={`mx-auto max-w-2xl text-sm leading-relaxed md:text-base ${cls.body}`}>
        Want to explore Leo Kids practice areas? Browse practice pages and guides, read a short
        overview, then sign in or register in the parent area.
      </p>

      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <HomeCtaLink
          href="/practice"
          label="Practice areas"
          className={getHomeBtnClasses("parents", isBright, "primary")}
          size="md"
          testId="public-seo-entry-practice"
        />
        <HomeCtaLink
          href="/guides"
          label="Parent guides"
          className={getHomeBtnClasses("parents", isBright, "secondary")}
          size="md"
          testId="public-seo-entry-guides"
        />
      </div>

      <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
        {QUICK_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={
                isBright
                  ? "text-sky-700 underline underline-offset-2 hover:text-sky-900"
                  : "text-sky-300 underline underline-offset-2 hover:text-sky-100"
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
