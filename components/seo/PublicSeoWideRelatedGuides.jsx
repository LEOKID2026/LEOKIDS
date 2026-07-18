import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import Link from "next/link";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";

/**
 * @param {{ guides: { href: string, label: string }[], isBright: boolean }} props
 */
export default function PublicSeoWideRelatedGuides({ guides, isBright }) {
  if (!guides?.length) return null;

  const cls = getPublicSeoWideClasses(isBright);

  return (
    <aside
      className={`space-y-3 ${cls.section}`}
      data-testid="practice-related-guides"
      aria-label={globalBurnDownCopy("components__seo__PublicSeoWideRelatedGuides", "related_guides")}
    >
      <h2 className={cls.sectionSubtitle}>Related guides</h2>
      <ul className={`space-y-2 text-sm md:text-base ${cls.body}`}>
        {guides.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className={cls.linkSky}>
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
