import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { isMockModeClient } from "../../lib/global/mock-mode.client.js";

/**
 * Small preview-mode banner for parent and student shells.
 */
export default function MockModeBanner({ className = "" }) {
  const t = useT();
  if (!isMockModeClient()) return null;

  return (
    <div
      role="status"
      data-testid="mock-mode-banner"
      className={`rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-1.5 text-center text-xs font-semibold text-amber-900 ${className}`.trim()}
    >
      {t("common.mockModeBanner")}
    </div>
  );
}
