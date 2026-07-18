import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { createTranslator } from "./create-translator.js";
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  getSelectableLocales,
  isRtlLocale,
  resolveLocaleDefinition,
} from "./locale-registry.js";
import {
  resolveContentLocale,
  resolveInterfaceLocale,
  resolveReportLocale,
} from "./locale-resolution.js";
import { resolveCurriculum, resolveMarket } from "./market-curriculum.js";
import {
  buildLocalizedHref,
  canonicalizeLocalizedPath,
  stripLocaleFromPath,
  withLocalePath,
} from "./locale-path.js";
import { writeLocaleCookieClient } from "./locale-cookie.js";
import {
  formatCurrency,
  formatDate,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
} from "./message-format.js";

const I18nContext = createContext(null);

/**
 * @param {{
 *   locale?: string,
 *   contentLocale?: string|null,
 *   reportLocale?: string|null,
 *   market?: string|null,
 *   curriculum?: string|null,
 *   onLocaleChange?: (localeId: string) => void|Promise<void>,
 *   children: React.ReactNode,
 * }} props
 */
export function I18nProvider({
  locale = FALLBACK_LOCALE,
  contentLocale = null,
  reportLocale = null,
  market = null,
  curriculum = null,
  onLocaleChange,
  children,
}) {
  const router = useRouter();

  const interfaceLocale = resolveLocaleDefinition(locale).id;
  const def = resolveLocaleDefinition(interfaceLocale);
  const direction = def.direction;
  const isRtl = isRtlLocale(interfaceLocale);

  const resolvedContentLocale = resolveContentLocale({
    contentLocale,
    interfaceLocale,
    market: resolveMarket(interfaceLocale, market),
    curriculum: resolveCurriculum(interfaceLocale, curriculum),
  });

  const resolvedReportLocale = resolveReportLocale({
    reportLocale,
    interfaceLocale,
  });

  const translator = useMemo(() => createTranslator(interfaceLocale), [interfaceLocale]);

  const reportTranslator = useMemo(
    () => createTranslator(resolvedReportLocale),
    [resolvedReportLocale]
  );

  const setLocale = useCallback(
    async (nextLocaleId, opts = {}) => {
      const id = resolveLocaleDefinition(nextLocaleId).id;
      writeLocaleCookieClient(id);
      if (onLocaleChange) await onLocaleChange(id);

      const currentPath = canonicalizeLocalizedPath(router.asPath.split("?")[0].split("#")[0]);
      const search = router.asPath.includes("?") ? router.asPath.split("?")[1]?.split("#")[0] : "";
      const hash = router.asPath.includes("#") ? `#${router.asPath.split("#")[1]}` : "";
      const nextHref = buildLocalizedHref(id, currentPath, {
        search: search || undefined,
        hash: hash || undefined,
      });

      if (opts.reload) {
        window.location.assign(nextHref);
        return;
      }
      await router.push(nextHref, undefined, { locale: false });
    },
    [onLocaleChange, router]
  );

  const withLocalePathFn = useCallback(
    (pathname) => withLocalePath(interfaceLocale, pathname),
    [interfaceLocale]
  );

  const value = useMemo(
    () => ({
      locale: interfaceLocale,
      baseLocale: translator.baseLocale,
      direction,
      isRtl,
      interfaceLocale,
      contentLocale: resolvedContentLocale,
      reportLocale: resolvedReportLocale,
      market: resolveMarket(interfaceLocale, market),
      curriculum: resolveCurriculum(interfaceLocale, curriculum),
      t: translator.t,
      reportT: reportTranslator.t,
      getMissingKeys: translator.getMissingKeys,
      getFallbackHits: translator.getFallbackHits,
      formatNumber: (v, opts) => formatNumber(v, interfaceLocale, opts),
      formatDate: (v, opts) => formatDate(v, interfaceLocale, opts),
      formatTime: (v, opts) => formatTime(v, interfaceLocale, opts),
      formatRelativeTime: (v, opts) => formatRelativeTime(v, interfaceLocale, opts),
      formatList: (items, opts) => formatList(items, interfaceLocale, opts),
      formatCurrency: (v, currency, opts) => formatCurrency(v, interfaceLocale, currency),
      formatPercent: (v, opts) => formatPercent(v, interfaceLocale, opts),
      withLocalePath: withLocalePathFn,
      setLocale,
      selectableLocales: getSelectableLocales(),
    }),
    [
      interfaceLocale,
      translator,
      reportTranslator,
      direction,
      isRtl,
      resolvedContentLocale,
      resolvedReportLocale,
      market,
      curriculum,
      withLocalePathFn,
      setLocale,
    ]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallback = createTranslator(FALLBACK_LOCALE);
    return {
      locale: DEFAULT_LOCALE,
      baseLocale: DEFAULT_LOCALE,
      direction: "ltr",
      isRtl: false,
      interfaceLocale: DEFAULT_LOCALE,
      contentLocale: DEFAULT_LOCALE,
      reportLocale: DEFAULT_LOCALE,
      market: "global",
      curriculum: "international",
      t: fallback.t,
      getMissingKeys: fallback.getMissingKeys,
      getFallbackHits: fallback.getFallbackHits,
      formatNumber: (v, opts) => formatNumber(v, DEFAULT_LOCALE, opts),
      formatDate: (v, opts) => formatDate(v, DEFAULT_LOCALE, opts),
      formatTime: (v, opts) => formatTime(v, DEFAULT_LOCALE, opts),
      formatRelativeTime: (v, opts) => formatRelativeTime(v, DEFAULT_LOCALE, opts),
      formatList: (items, opts) => formatList(items, DEFAULT_LOCALE, opts),
      formatCurrency: (v, currency, opts) => formatCurrency(v, DEFAULT_LOCALE, currency),
      formatPercent: (v, opts) => formatPercent(v, DEFAULT_LOCALE, opts),
      withLocalePath: (p) => withLocalePath(DEFAULT_LOCALE, p),
      setLocale: async () => {},
      selectableLocales: getSelectableLocales(),
    };
  }
  return ctx;
}

/**
 * Report-scoped translator (preferred_report_language), separate from interface `t()`.
 */
export function useReportT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallback = createTranslator(FALLBACK_LOCALE);
    return fallback.t;
  }
  return ctx.reportT || ctx.t;
}

/**
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function useT() {
  const { t } = useI18n();
  return t;
}

/**
 * Resolve locale from current router path (client).
 */
export function useRouterInterfaceLocale() {
  const router = useRouter();
  return resolveInterfaceLocale({
    asPath: router.asPath,
    pathname: router.pathname,
    query: router.query,
    cookieHeader: typeof document !== "undefined" ? document.cookie : undefined,
  });
}

export { stripLocaleFromPath };
