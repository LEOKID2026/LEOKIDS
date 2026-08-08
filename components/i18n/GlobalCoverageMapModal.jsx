import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import GlobalCoverageMap from "./GlobalCoverageMap.jsx";

/**
 * Lightweight modal shell around GlobalCoverageMap.
 * Title/close labels come from the active locale via i18n.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   locales?: Array<{ id: string, label?: string, nativeName?: string, displayName?: string }>,
 * }} props
 */
export default function GlobalCoverageMapModal({ open, onClose, locales }) {
  const { t } = useI18n();
  const titleId = useId();
  const closeRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const previouslyFocused = useRef(/** @type {Element | null} */ (null));

  const title = t("ui.languageSwitcher.coverageMapTitle");
  const closeLabel = t("ui.languageSwitcher.coverageMapClose");

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    const tmr = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(tmr);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4"
      data-coverage-map-modal="1"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] flex max-h-[min(92vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 id={titleId} className="text-base font-bold text-slate-900 min-w-0 break-words">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            onClick={onClose}
          >
            {closeLabel}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4">
          <GlobalCoverageMap locales={locales} />
        </div>
      </div>
    </div>,
    document.body
  );
}
