import { getParentPortalTheme } from "../../lib/parent-ui/parent-portal-theme.client.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Shown when guardian login returns guardian_multiple_students (409).
 */
export default function GuardianChildSelectForm({ students, busy, onSelect, bright = false }) {
  const t = useT();
  const T = getParentPortalTheme(bright);

  if (!students?.length) return null;

  return (
    <div className={`${T.guardianBox} space-y-3`}>
      <p className={T.guardianText}>{t("auth.guardian.selectChildPrompt")}</p>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.studentId}>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSelect(s.studentId)}
              className={T.guardianBtn}
            >
              {s.studentFullNameMasked || t("auth.guardian.childLabel")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
