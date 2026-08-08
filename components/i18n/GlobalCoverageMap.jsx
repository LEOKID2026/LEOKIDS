import React, { useCallback, useId, useMemo, useState } from "react";
import worldMap from "../../lib/i18n/data/world-countries.json";
import {
  buildSelectorCoverageMarkets,
  findUnmappedCoverageMarkets,
} from "../../lib/i18n/locale-selector-coverage.js";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";

/**
 * Reusable interactive coverage map driven by selector SoT.
 *
 * @param {{
 *   className?: string,
 *   summaryLabel?: string,
 *   hintLabel?: string,
 *   coveredLabel?: string,
 *   notCoveredLabel?: string,
 *   locales?: Array<{ id: string, label?: string, nativeName?: string, displayName?: string }>,
 * }} props
 */
export default function GlobalCoverageMap({
  className = "",
  summaryLabel,
  hintLabel,
  coveredLabel = "Covered",
  notCoveredLabel = "Not yet covered",
  locales,
}) {
  const reactId = useId();
  const detailsId = `${reactId}-details`;
  const [activeGeoId, setActiveGeoId] = useState(/** @type {string|null} */ (null));
  const [hoverGeoId, setHoverGeoId] = useState(/** @type {string|null} */ (null));

  const coverage = useMemo(
    () => buildSelectorCoverageMarkets(locales || getSelectableLocales()),
    [locales]
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
    // Surface mapping gaps during development; tests assert zero in CI.
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

  const summary =
    summaryLabel ||
    `Available across ${coverage.marketCount} markets`;

  return (
    <div
      className={`flex flex-col gap-3 min-w-0 ${className}`.trim()}
      data-global-coverage-map="1"
      data-coverage-market-count={coverage.marketCount}
    >
      <p className="text-sm font-semibold text-slate-700" data-coverage-summary="1">
        {summary.replace("{count}", String(coverage.marketCount))}
      </p>
      {hintLabel ? <p className="text-xs text-slate-500">{hintLabel}</p> : null}

      <div className="relative w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <svg
          viewBox={worldMap.viewBox}
          role="img"
          aria-label={summary.replace("{count}", String(coverage.marketCount))}
          className="block h-auto w-full max-h-[min(52vh,320px)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>{summary.replace("{count}", String(coverage.marketCount))}</title>
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
        className="min-h-[3.25rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        aria-live="polite"
        data-coverage-details={focusMarket ? focusMarket.geoId : ""}
      >
        {focusMarket ? (
          <div className="min-w-0">
            <div className="font-bold text-slate-800 break-words">{focusMarket.title}</div>
            <div className="text-slate-600 break-words">{focusMarket.detail}</div>
            <div className="sr-only">{coveredLabel}</div>
          </div>
        ) : (
          <div className="text-slate-500">{hintLabel || coveredLabel}</div>
        )}
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
