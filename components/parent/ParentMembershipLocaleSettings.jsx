import { useCallback, useEffect, useState } from "react";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { useParentMembershipLocale } from "../../hooks/useParentMembershipLocale.js";
import { getParentPortalTheme } from "../../lib/parent-ui/parent-portal-theme.client.js";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import {
  isParentReportLocaleExplicit,
  setParentReportLocaleExplicit,
} from "../../lib/parent-client/report-locale-preference.client.js";

/**
 * Parent dashboard controls for interface vs report language (separate persistence).
 */
export default function ParentMembershipLocaleSettings({ className = "" }) {
  const t = useT();
  const { selectableLocales, locale: interfaceLocale, reportLocale } = useI18n();
  const { isBright } = useStudentTheme();
  const T = getParentPortalTheme(isBright);
  const {
    loaded,
    membershipInterfaceLanguage,
    preferredReportLanguage,
    onInterfaceLocaleChange,
    onReportLocaleChange,
  } = useParentMembershipLocale({ enabled: true });

  const [reportExplicit, setReportExplicit] = useState(false);

  useEffect(() => {
    setReportExplicit(isParentReportLocaleExplicit());
  }, [loaded, preferredReportLanguage]);

  const handleInterfaceChange = useCallback(
    async (nextLocaleId) => {
      await onInterfaceLocaleChange(nextLocaleId, { syncReportUnlessExplicit: !reportExplicit });
    },
    [onInterfaceLocaleChange, reportExplicit]
  );

  const handleReportChange = useCallback(
    async (nextLocaleId) => {
      setParentReportLocaleExplicit(true);
      setReportExplicit(true);
      await onReportLocaleChange(nextLocaleId);
    },
    [onReportLocaleChange]
  );

  if (!loaded || !selectableLocales || selectableLocales.length < 2) {
    return null;
  }

  const interfaceValue = membershipInterfaceLanguage || interfaceLocale;
  const reportValue = preferredReportLanguage || reportLocale || interfaceValue;

  return (
    <section
      className={`${T.card} ${className}`.trim()}
      aria-labelledby="parent-locale-settings-heading"
    >
      <h2 id="parent-locale-settings-heading" className={`text-sm font-semibold ${T.heading}`}>
        {t("ui.localeSettings.heading")}
      </h2>
      <p className={`mt-1 text-xs ${T.faint}`}>{t("ui.localeSettings.description")}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <LocaleSelect
          id="parent-interface-locale"
          label={t("ui.localeSettings.interfaceLanguage")}
          hint={t("ui.localeSettings.interfaceHint")}
          value={interfaceValue}
          locales={selectableLocales}
          onChange={handleInterfaceChange}
          T={T}
        />
        <LocaleSelect
          id="parent-report-locale"
          label={t("ui.localeSettings.reportLanguage")}
          hint={t("ui.localeSettings.reportHint")}
          value={reportValue}
          locales={selectableLocales}
          onChange={handleReportChange}
          T={T}
        />
      </div>
    </section>
  );
}

function LocaleSelect({ id, label, hint, value, locales, onChange, T }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className={`text-xs font-medium ${T.label}`}>{label}</span>
      <select
        id={id}
        className={`rounded-md border px-2 py-1.5 text-sm ${T.input}`}
        value={value}
        onChange={(e) => void onChange(e.target.value)}
      >
        {locales.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.nativeName || loc.displayName || loc.id}
          </option>
        ))}
      </select>
      <span className={`text-[11px] ${T.faint}`}>{hint}</span>
    </label>
  );
}
