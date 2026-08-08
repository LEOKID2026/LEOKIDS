import React, { useCallback, useId, useMemo, useState } from "react";
import worldMap from "../../lib/i18n/data/world-countries.json";
import {
  buildSelectorCoverageMarkets,
  findUnmappedCoverageMarkets,
  getCoverageLanguageLabel,
  getCoverageIntlLocale,
} from "../../lib/i18n/locale-selector-coverage.js";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";
import { getSelectorDisplayLabel } from "../../lib/i18n/locale-selector-regions.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Reusable interactive coverage map driven by selector SoT.
 * Compact header + reserved details height prevent layout shift on selection.
 *
 * @param {{
 *   className?: string,
 *   locales?: Array<{ id: string, label?: string, nativeName?: string, displayName?: string }>,
 *   showTitle?: boolean,
 *   compact?: boolean,
 * }} props
 */
export default function GlobalCoverageMap({
  className = "",
  locales,
  showTitle = false,
  compact = false,
}) {
  const { t, locale } = useI18n();
  const reactId = useId();
  const detailsId = `${reactId}-details`;
  const [activeGeoId, setActiveGeoId] = useState(/** @type {string|null} */ (null));
  const [hoverGeoId, setHoverGeoId] = useState(/** @type {string|null} */ (null));

  const displayLocale = getCoverageIntlLocale(locale);

  const resolveLanguageLabel = useCallback(
    (localeId) => {
      const lang = String(localeId || "").split("-")[0]?.toLowerCase() || "";
      const key = `ui.languageSwitcher.coverageLanguages.${lang}`;
      const translated = t(key);
      if (translated && translated !== key) return translated;
      return getCoverageLanguageLabel(localeId);
    },
    [t]
  );

  const resolveUkNationLabel = useCallback(
    (loc) => {
      const key = `ui.languageSwitcher.coverageUkNations.${loc.id}`;
      const translated = t(key);
      if (translated && translated !== key) return translated;
      return getSelectorDisplayLabel(loc);
    },
    [t]
  );

  const coverage = useMemo(
    () =>
      buildSelectorCoverageMarkets(locales || getSelectableLocales(), {
        displayLocale,
        resolveLanguageLabel,
        resolveUkNationLabel,
      }),
    [locales, displayLocale, resolveLanguageLabel, resolveUkNationLabel]
  );

  const mapGeoIds = useMemo(() => {
    const ids = [
      ...(worldMap.countries || []).map((c) => c.id),
      ...(worldMap.markers || []).map((m) => m.id),
    ];
    return ids;
  }, []);

  const unmapped = useMemo(
    () => findUnmappedCoverageMarkets(mapGeoIds, coverage.markets),
    [mapGeoIds, coverage.markets]
  );

  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production" && unmapped.length) {
    // eslint-disable-next-line no-console
    console.warn(
      "[GlobalCoverageMap] unmapped markets:",
      unmapped.map((m) => m.geoId).join(", ")
    );
  }

  const focusGeoId = hoverGeoId || activeGeoId;
  const focusMarket = focusGeoId ? coverage.byGeoId.get(focusGeoId) || null : null;

  const onActivate = useCallback(
    (geoId) => {
      if (!coverage.byGeoId.has(geoId)) return;
      setActiveGeoId((prev) => (prev === geoId ? null : geoId));
    },
    [coverage.byGeoId]
  );

  const title = t("ui.languageSwitcher.coverageMapTitle");
  const summary = t("ui.languageSwitcher.coverageMapSummary", {
    count: coverage.marketCount,
  });
  const hint = t("ui.languageSwitcher.coverageMapHint");
  const coveredLabel = t("ui.languageSwitcher.coverageMapCovered");
  const notCoveredLabel = t("ui.languageSwitcher.coverageMapNotCovered");

  const titleClass = compact
    ? "text-base font-bold text-inherit min-w-0 md:text-lg"
    : "text-base font-bold text-slate-900 min-w-0 md:text-lg";
  const summaryClass = compact
    ? "text-sm font-semibold text-inherit min-w-0"
    : "text-sm font-semibold text-slate-700 min-w-0";
  const mapShellClass = compact
    ? "relative w-full min-w-0 overflow-hidden rounded-xl border border-white/20 bg-black/10"
    : "relative w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50";
  // Fixed height details slot — content swap must not change card/page height.
  const detailsClass = compact
    ? "h-[3.75rem] rounded-lg border border-white/15 bg-black/15 px-3 py-2 text-sm overflow-hidden"
    : "h-[3.75rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm overflow-hidden";

  return (
    <div
      className={`flex flex-col gap-3 min-w-0 ${className}`.trim()}
      data-global-coverage-map="1"
      data-coverage-market-count={coverage.marketCount}
      data-coverage-locale={locale}
      data-coverage-layout="stable-details"
    >
      <div
        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"
        data-coverage-header="1"
      >
        {showTitle ? <h2 className={titleClass}>{title}</h2> : null}
        <p className={`${summaryClass} ${showTitle ? "ms-auto text-end" : ""}`} data-coverage-summary="1">
          {summary}
        </p>
      </div>

      <div className={mapShellClass}>
        <svg
          viewBox={worldMap.viewBox}
          role="img"
          aria-label={`${title}. ${summary}`}
          className="block h-auto w-full max-h-[min(52vh,320px)]"
          preserveAspectRatio="xMidYMid meet"
          dir="ltr"
        >
          <title>{`${title}. ${summary}`}</title>
          {(worldMap.countries || []).map((country) => {
            const covered = coverage.byGeoId.has(country.id);
            const selected = focusGeoId === country.id;
            return (
              <path
                key={country.id}
                d={country.d}
                data-geo-id={country.id}
                data-covered={covered ? "1" : "0"}
                tabIndex={covered ? 0 : -1}
                role={covered ? "button" : undefined}
                aria-label={
                  covered
                    ? `${coverage.byGeoId.get(country.id)?.title}. ${coveredLabel}. ${
                        coverage.byGeoId.get(country.id)?.detail || ""
                      }`
                    : undefined
                }
                aria-pressed={covered ? selected : undefined}
                className={
                  covered
                    ? selected
                      ? "fill-sky-600 stroke-white stroke-[0.4] cursor-pointer outline-none focus-visible:stroke-amber-400 focus-visible:stroke-[1.2]"
                      : "fill-sky-500 stroke-white stroke-[0.35] cursor-pointer hover:fill-sky-600 outline-none focus-visible:stroke-amber-400 focus-visible:stroke-[1.2]"
                    : "fill-slate-200 stroke-slate-300 stroke-[0.25] pointer-events-none"
                }
                onMouseEnter={() => {
                  if (covered) setHoverGeoId(country.id);
                }}
                onMouseLeave={() => setHoverGeoId((prev) => (prev === country.id ? null : prev))}
                onFocus={() => {
                  if (covered) setHoverGeoId(country.id);
                }}
                onBlur={() => setHoverGeoId((prev) => (prev === country.id ? null : prev))}
                onClick={() => onActivate(country.id)}
                onKeyDown={(event) => {
                  if (!covered) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onActivate(country.id);
                  }
                }}
              />
            );
          })}
          {(worldMap.markers || []).map((marker) => {
            const covered = coverage.byGeoId.has(marker.id);
            if (!covered) return null;
            const selected = focusGeoId === marker.id;
            const market = coverage.byGeoId.get(marker.id);
            return (
              <g key={`marker-${marker.id}`}>
                <circle
                  cx={marker.cx}
                  cy={marker.cy}
                  r={selected ? 5.5 : 4.5}
                  data-geo-id={marker.id}
                  data-covered="1"
                  data-coverage-marker="1"
                  tabIndex={0}
                  role="button"
                  aria-label={`${market?.title}. ${coveredLabel}. ${market?.detail || ""}`}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "fill-sky-700 stroke-white stroke-[1] cursor-pointer outline-none focus-visible:stroke-amber-400"
                      : "fill-sky-500 stroke-white stroke-[1] cursor-pointer hover:fill-sky-600 outline-none focus-visible:stroke-amber-400"
                  }
                  onMouseEnter={() => setHoverGeoId(marker.id)}
                  onMouseLeave={() => setHoverGeoId((prev) => (prev === marker.id ? null : prev))}
                  onFocus={() => setHoverGeoId(marker.id)}
                  onBlur={() => setHoverGeoId((prev) => (prev === marker.id ? null : prev))}
                  onClick={() => onActivate(marker.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onActivate(marker.id);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div
        id={detailsId}
        className={detailsClass}
        aria-live="polite"
        data-coverage-details={focusMarket ? focusMarket.geoId : "idle"}
        data-coverage-details-stable="1"
      >
        <div className="flex h-full min-w-0 items-center">
          {focusMarket ? (
            <div className="min-w-0 w-full">
              <div
                className={`font-bold leading-snug truncate ${compact ? "text-inherit" : "text-slate-800"}`}
              >
                {focusMarket.title}
              </div>
              <div
                className={`leading-snug truncate ${compact ? "opacity-90" : "text-slate-600"}`}
              >
                {focusMarket.detail}
              </div>
              <div className="sr-only">{coveredLabel}</div>
            </div>
          ) : (
            <div
              className={`leading-snug line-clamp-2 ${compact ? "opacity-80" : "text-slate-500"}`}
            >
              {hint}
            </div>
          )}
        </div>
      </div>

      <ul className="sr-only">
        {coverage.markets.map((market) => (
          <li key={market.geoId}>
            {market.title}: {market.detail}. {coveredLabel}.
          </li>
        ))}
      </ul>
      <p className="sr-only">{notCoveredLabel}</p>
    </div>
  );
}
