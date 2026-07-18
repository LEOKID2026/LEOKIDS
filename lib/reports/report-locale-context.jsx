import React, { createContext, forwardRef, useContext, useMemo } from "react";
import { useI18n, useReportT } from "../i18n/I18nProvider.jsx";
import {
  formatDate,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
} from "../i18n/message-format.js";
import { createReportPackCopy } from "./report-pack-copy.js";
import { resolveReportDirection } from "./report-locale.js";

const ReportLocaleContext = createContext(null);

/**
 * Report-scoped copy + formatters — separate from interface locale.
 * Sets `lang` and `dir` on the report surface (print/PDF included).
 */
export const ReportLocaleSurface = forwardRef(function ReportLocaleSurface(
  { children, reportLocale: reportLocaleProp, className, style, ...rest },
  ref
) {
  const { reportLocale: ctxReportLocale } = useI18n();
  const reportLocale = reportLocaleProp || ctxReportLocale || "en";
  const direction = resolveReportDirection(reportLocale);
  const reportT = useReportT();
  const packCopy = useMemo(() => createReportPackCopy(reportLocale), [reportLocale]);

  const formatters = useMemo(
    () => ({
      formatNumber: (v, opts) => formatNumber(v, reportLocale, opts),
      formatPercent: (v, opts) => formatPercent(v, reportLocale, opts),
      formatDate: (v, opts) => formatDate(v, reportLocale, opts),
      formatTime: (v, opts) => formatTime(v, reportLocale, opts),
      formatRelativeTime: (v, opts) => formatRelativeTime(v, reportLocale, opts),
      formatList: (items, opts) => formatList(items, reportLocale, opts),
    }),
    [reportLocale]
  );

  const value = useMemo(
    () => ({
      reportLocale,
      direction,
      reportT,
      packCopy,
      ...formatters,
    }),
    [reportLocale, direction, reportT, packCopy, formatters]
  );

  return (
    <ReportLocaleContext.Provider value={value}>
      <div
        ref={ref}
        lang={reportLocale}
        dir={direction}
        data-report-locale={reportLocale}
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </ReportLocaleContext.Provider>
  );
});

export function useReportLocaleContext() {
  return useContext(ReportLocaleContext);
}

/** Report burn-down pack copy bound to current reportLocale. */
export function useReportPackCopy() {
  const ctx = useContext(ReportLocaleContext);
  const { reportLocale } = useI18n();
  return ctx?.packCopy || createReportPackCopy(reportLocale);
}

/** Report-scoped Intl formatters (numbers, dates, lists). */
export function useReportFormatters() {
  const ctx = useContext(ReportLocaleContext);
  const { reportLocale } = useI18n();
  const locale = ctx?.reportLocale || reportLocale || "en";
  return (
    ctx || {
      reportLocale: locale,
      formatNumber: (v, opts) => formatNumber(v, locale, opts),
      formatPercent: (v, opts) => formatPercent(v, locale, opts),
      formatDate: (v, opts) => formatDate(v, locale, opts),
      formatTime: (v, opts) => formatTime(v, locale, opts),
      formatRelativeTime: (v, opts) => formatRelativeTime(v, locale, opts),
      formatList: (items, opts) => formatList(items, locale, opts),
    }
  );
}
