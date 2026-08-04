import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getLegalPolicyBundleForLocale } from "../lib/legal/locale-legal-content.js";

/**
 * Educational legal disclaimer — shared wording for the parent report, the
 * full/summary detailed report, and print.
 * Source of copy: locale legal overlay (fallback: data/legal/sitePolicies.js)
 */
export function ParentReportImportantDisclaimer() {
  const { locale, direction } = useI18n();
  const bundle = getLegalPolicyBundleForLocale(locale);
  const title = bundle.parentReportDisclaimerTitle;
  const paragraphs = Array.isArray(bundle.parentReportDisclaimerParagraphs)
    ? bundle.parentReportDisclaimerParagraphs
    : [];

  return (
    <aside
      className="parent-report-important-disclaimer mt-5 md:mt-6 mb-1 rounded-lg border border-white/14 bg-white/[0.06] px-3 py-3 md:px-4 md:py-3.5 text-start shadow-none"
      dir={direction}
      lang={locale}
      role="note"
    >
      <h2 className="parent-report-important-disclaimer-title text-sm font-extrabold text-white/90 mb-2 tracking-tight m-0">
        {title}
      </h2>
      <div className="parent-report-important-disclaimer-body space-y-2 text-[0.8125rem] md:text-sm leading-relaxed text-white/76">
        {paragraphs.map((paragraph) => (
          <p key={String(paragraph).slice(0, 32)} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </aside>
  );
}
