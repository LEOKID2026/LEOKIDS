import React from "react";
import {
  getLocaleSelectorFlag,
  getMarketFlagAssetPath,
} from "../../lib/i18n/locale-selector-flags.js";

/**
 * Decorative market flag / neutral icon for the language switcher.
 * Visual aid only — always aria-hidden so screen readers announce the label once.
 *
 * @param {{
 *   localeId: string,
 *   className?: string,
 * }} props
 */
export default function MarketFlag({ localeId, className = "" }) {
  const meta = getLocaleSelectorFlag(localeId);
  const wrapClass =
    `inline-flex h-3.5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] ${className}`.trim();

  if (!meta) {
    return <span className={wrapClass} aria-hidden="true" />;
  }

  if (meta.kind === "icon") {
    return (
      <span className={wrapClass} aria-hidden="true" data-market-flag-icon={meta.icon}>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      </span>
    );
  }

  const src = getMarketFlagAssetPath(meta);
  if (!src) {
    return <span className={wrapClass} aria-hidden="true" />;
  }

  return (
    <span className={wrapClass} aria-hidden="true" data-market-flag={meta.code}>
      <img
        src={src}
        alt=""
        width={20}
        height={14}
        className="h-3.5 w-5 object-cover"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
