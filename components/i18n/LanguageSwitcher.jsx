import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import {
  getLocaleSelectorRegion,
  getSelectorDisplayLabel,
  groupLocalesBySelectorRegion,
  SELECTOR_REGION_ORDER,
} from "../../lib/i18n/locale-selector-regions.js";

/**
 * Accessible HUD language switcher — uses `getSelectableLocales()` via I18nProvider.
 * Persists via `setLocale` (cookie + optional profile) and navigates same path under the locale prefix.
 * Markets are grouped by region with search; locale ids are never shown as UX labels.
 *
 * @param {{
 *   className?: string,
 *   appearance?: "bright" | "classic" | "default",
 *   onChange?: (localeId: string) => void | Promise<void>,
 * }} props
 */
export default function LanguageSwitcher({
  className = "",
  appearance = "default",
  onChange,
}) {
  const { locale, localePickerLocales, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(/** @type {Record<string, boolean>} */ ({}));
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const searchRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const listId = useId();
  const searchId = useId();

  const locales = localePickerLocales || [];
  const current =
    locales.find((loc) => loc.id === locale) ||
    locales[0] ||
    null;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      const el = rootRef.current;
      if (el && !el.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const activeRegion = getLocaleSelectorRegion(locale);
    /** @type {Record<string, boolean>} */
    const next = {};
    for (const regionId of SELECTOR_REGION_ORDER) {
      next[regionId] = regionId === activeRegion;
    }
    if (!activeRegion) {
      next.americas = true;
    }
    setExpanded(next);
    const tmr = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(tmr);
  }, [open, locale]);

  const groups = useMemo(
    () => groupLocalesBySelectorRegion(locales, { query }),
    [locales, query]
  );

  const searching = Boolean(String(query || "").trim());

  if (locales.length < 2 || !current) {
    return null;
  }

  const label = t("ui.languageSwitcher.label");
  const searchPlaceholder = t("ui.languageSwitcher.searchPlaceholder");
  const noResults = t("ui.languageSwitcher.noResults");
  const currentName = getSelectorDisplayLabel(current);

  const isBright = appearance === "bright";
  const isClassic = appearance === "classic";

  const triggerClass = isBright
    ? "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    : isClassic
      ? "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 text-white/90 text-xs sm:text-sm font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      : "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs sm:text-sm font-semibold hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

  const panelClass = isBright
    ? "absolute end-0 top-full z-50 mt-1 w-[min(92vw,20rem)] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
    : isClassic
      ? "absolute end-0 top-full z-50 mt-1 w-[min(92vw,20rem)] rounded-xl border border-white/15 bg-[#0b1020] shadow-lg overflow-hidden"
      : "absolute end-0 top-full z-50 mt-1 w-[min(92vw,20rem)] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden";

  const stickyClass = isBright
    ? "sticky top-0 z-10 border-b border-slate-100 bg-white"
    : isClassic
      ? "sticky top-0 z-10 border-b border-white/10 bg-[#0b1020]"
      : "sticky top-0 z-10 border-b border-gray-100 bg-white";

  const searchInputClass = isBright
    ? "w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sky-500"
    : isClassic
      ? "w-full min-h-9 rounded-lg border border-white/15 bg-white/5 px-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-emerald-400"
      : "w-full min-h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sky-500";

  const currentRowClass = isBright
    ? "px-3 py-2 text-xs font-semibold text-sky-800 bg-sky-50"
    : isClassic
      ? "px-3 py-2 text-xs font-semibold text-emerald-200 bg-emerald-600/20"
      : "px-3 py-2 text-xs font-semibold text-sky-900 bg-sky-50";

  const groupBtnClass = isBright
    ? "w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-500"
    : isClassic
      ? "w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/55 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400"
      : "w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-500";

  const optionBase =
    "w-full text-start px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]";
  const optionIdle = isBright
    ? "text-slate-700 hover:bg-sky-50 focus-visible:outline-sky-500"
    : isClassic
      ? "text-white/85 hover:bg-white/10 focus-visible:outline-emerald-400"
      : "text-gray-800 hover:bg-gray-50 focus-visible:outline-sky-500";
  const optionActive = isBright
    ? "bg-sky-50 text-sky-800"
    : isClassic
      ? "bg-emerald-600/30 text-white"
      : "bg-sky-50 text-sky-900";

  const emptyClass = isBright
    ? "px-3 py-4 text-sm text-slate-500"
    : isClassic
      ? "px-3 py-4 text-sm text-white/60"
      : "px-3 py-4 text-sm text-gray-500";

  async function selectLocale(nextId) {
    if (!nextId || nextId === locale) {
      close();
      return;
    }
    close();
    if (onChange) await onChange(nextId);
    await setLocale(nextId);
  }

  function toggleRegion(regionId) {
    setExpanded((prev) => ({ ...prev, [regionId]: !prev[regionId] }));
  }

  function regionLabel(regionId, fallback) {
    const key = `ui.languageSwitcher.regions.${regionId}`;
    const translated = t(key);
    return translated && translated !== key ? translated : fallback;
  }

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex shrink-0 ${className}`.trim()}
      dir="ltr"
      data-language-switcher="hud"
      data-language-switcher-layout="region-search"
    >
      <button
        type="button"
        className={triggerClass}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">{currentName}</span>
        <span className="text-[0.65rem] opacity-70" aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <div className={panelClass} data-language-switcher-panel="1">
          <div className={`${stickyClass} p-2 space-y-2`}>
            <label className="sr-only" htmlFor={searchId}>
              {searchPlaceholder}
            </label>
            <input
              ref={searchRef}
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className={searchInputClass}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className={currentRowClass} data-language-switcher-current={locale}>
              {currentName} ✓
            </div>
          </div>

          <div
            id={listId}
            role="listbox"
            aria-label={label}
            className="max-h-[min(60vh,420px)] overflow-y-auto overflow-x-hidden overscroll-contain"
          >
            {groups.length === 0 ? (
              <div className={emptyClass}>{noResults}</div>
            ) : (
              groups.map((group) => {
                const isOpen = searching || Boolean(expanded[group.regionId]);
                const heading = regionLabel(group.regionId, group.label);
                return (
                  <div key={group.regionId} data-selector-region={group.regionId}>
                    <button
                      type="button"
                      className={groupBtnClass}
                      aria-expanded={isOpen}
                      onClick={() => toggleRegion(group.regionId)}
                    >
                      <span>
                        {heading}
                        <span className="ms-1 font-semibold opacity-70">({group.locales.length})</span>
                      </span>
                      <span aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
                    </button>
                    {isOpen
                      ? group.locales.map((loc) => {
                          const name = getSelectorDisplayLabel(loc);
                          const active = loc.id === locale;
                          return (
                            <button
                              key={loc.id}
                              type="button"
                              role="option"
                              aria-selected={active}
                              className={`${optionBase} ${active ? optionActive : optionIdle}`}
                              onClick={() => {
                                void selectLocale(loc.id);
                              }}
                            >
                              {name}
                              {active ? (
                                <span className="ms-2 text-[0.7rem] opacity-80" aria-hidden="true">
                                  ✓
                                </span>
                              ) : null}
                            </button>
                          );
                        })
                      : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
