import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Accessible HUD language switcher — uses `getSelectableLocales()` via I18nProvider.
 * Persists via `setLocale` (cookie + optional profile) and navigates same path under the locale prefix.
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
  const { locale, selectableLocales, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const listId = useId();

  const locales = selectableLocales || [];
  const current =
    locales.find((loc) => loc.id === locale) ||
    locales[0] ||
    null;

  const close = useCallback(() => setOpen(false), []);

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

  if (locales.length < 2 || !current) {
    return null;
  }

  const label = t("ui.languageSwitcher.label");
  const currentName = current.nativeName || current.displayName || current.id;

  const isBright = appearance === "bright";
  const isClassic = appearance === "classic";

  const triggerClass = isBright
    ? "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    : isClassic
      ? "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 text-white/90 text-xs sm:text-sm font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      : "inline-flex items-center gap-1 min-h-8 px-2.5 py-1 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs sm:text-sm font-semibold hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

  const menuClass = isBright
    ? "absolute end-0 top-full z-50 mt-1 min-w-[9.5rem] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
    : isClassic
      ? "absolute end-0 top-full z-50 mt-1 min-w-[9.5rem] rounded-xl border border-white/15 bg-[#0b1020] py-1 shadow-lg"
      : "absolute end-0 top-full z-50 mt-1 min-w-[9.5rem] rounded-xl border border-gray-200 bg-white py-1 shadow-lg";

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

  async function selectLocale(nextId) {
    if (!nextId || nextId === locale) {
      close();
      return;
    }
    close();
    if (onChange) await onChange(nextId);
    await setLocale(nextId);
  }

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex shrink-0 ${className}`.trim()}
      dir="ltr"
      data-language-switcher="hud"
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
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className={menuClass}
        >
          {locales.map((loc) => {
            const name = loc.nativeName || loc.displayName || loc.id;
            const active = loc.id === locale;
            return (
              <li key={loc.id} role="presentation">
                <button
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
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
