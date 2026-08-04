import { useGlobalBurnDownCopy } from "../../hooks/useGlobalBurnDownCopy.js";
import Link from "next/link";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";

/**
 * @param {{ guides: { href: string, label: string }[], isBright: boolean }} props
 */
export default function PublicSeoWideRelatedGuides({ guides, isBright }) {
  const burnDown = useGlobalBurnDownCopy();
  const t = useT();
  if (!guides?.length) return null;

  const cls = getPublicSeoWideClasses(isBright);

  return (
    <aside
      className={`space-y-3 ${cls.section}`}
      data-testid="practice-related-guides"
      aria-label={burnDown("components__seo__PublicSeoWideRelatedGuides", "related_guides")}
    >
      <h2 className={cls.sectionSubtitle}>{t("ui.public.seoNav.relatedGuides")}</h2>
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
