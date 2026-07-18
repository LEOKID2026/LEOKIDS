import React from "react";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Generic language switcher — hidden automatically when fewer than 2 enabled locales.
 * @param {{ className?: string, onChange?: (localeId: string) => void|Promise<void> }} props
 */
export default function LanguageSwitcher({ className = "", onChange }) {
  const { locale, selectableLocales, setLocale, t } = useI18n();

  if (!selectableLocales || selectableLocales.length < 2) {
    return null;
  }

  return (
    <label className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="sr-only">{t("ui.languageSwitcher.label")}</span>
      <select
        aria-label={t("ui.languageSwitcher.label")}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
        value={locale}
        onChange={async (e) => {
          const next = e.target.value;
          if (onChange) await onChange(next);
          await setLocale(next);
        }}
      >
        {selectableLocales.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.nativeName || loc.displayName || loc.id}
          </option>
        ))}
      </select>
    </label>
  );
}
