import { getParentPortalTheme } from "../../lib/parent-ui/parent-portal-theme.client.js";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import PublicWorksheetsHub from "../worksheets/PublicWorksheetsHub.client.jsx";
import { getPublicSeoWideClasses } from "./public-seo-wide-theme";

/**
 * Worksheets generator + catalog embedded in the public SEO wide layout.
 */
export default function PublicSeoWorksheetsHubSlot() {
  const { isBright } = useStudentTheme();
  const cls = getPublicSeoWideClasses(isBright);
  const T = getParentPortalTheme(isBright);
  const t = useT();

  return (
    <section
      className={`public-seo-worksheets-slot ${cls.interactiveSlot}`}
      data-testid="public-seo-worksheets-slot"
      aria-label={t("worksheets.hubSlotAriaLabel")}
    >
      <PublicWorksheetsHub T={T} />
    </section>
  );
}
