import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { getHomeBtnClasses } from "../home/home-theme";
import HomeCtaLink from "../home/HomeCtaLink";

/**
 * Prominent parent action buttons — below hero intro on SEO pages.
 * @param {{ isBright: boolean }} props
 */
export default function PublicSeoParentCta({ isBright }) {
  return (
    <div
      className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
      data-testid="seo-parent-cta"
    >
      <HomeCtaLink
        href="/parent/login"
        label={globalBurnDownCopy("components__seo__PublicSeoParentCta", "parent_login_sign_up")}
        className={getHomeBtnClasses("parents", isBright, "primary")}
        testId="seo-cta-parent-login"
      />
      <HomeCtaLink
        href="/parents"
        label={globalBurnDownCopy("components__seo__PublicSeoParentCta", "explore_the_parent_portal")}
        className={getHomeBtnClasses("parents", isBright, "secondary")}
        size="md"
        testId="seo-cta-parents-portal"
      />
    </div>
  );
}
