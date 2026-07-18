/**
 * lk_global_locale cookie — read/write/delete for interface locale persistence.
 */

import { LOCALE_COOKIE_NAME } from "./locale-registry.js";
import { normalizeLocaleId } from "./locale-normalize.js";
import { resolveLocaleDefinition } from "./locale-registry.js";

export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year
export const LOCALE_COOKIE_PATH = "/";

/**
 * @param {string} cookieHeader
 * @param {string} [name]
 * @returns {string|null}
 */
export function readLocaleCookie(cookieHeader, name = LOCALE_COOKIE_NAME) {
  const parts = String(cookieHeader || "").split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) {
      const raw = decodeURIComponent(rest.join("=") || "").trim();
      return raw || null;
    }
  }
  return null;
}

/**
 * Serialize Set-Cookie value for locale (server/middleware).
 * @param {string} localeId
 * @param {{ maxAge?: number, sameSite?: 'Lax'|'Strict'|'None', secure?: boolean }} [opts]
 */
export function serializeLocaleCookie(localeId, opts = {}) {
  const id = normalizeLocaleId(localeId);
  resolveLocaleDefinition(id); // validate
  const maxAge = opts.maxAge ?? LOCALE_COOKIE_MAX_AGE_SECONDS;
  const sameSite = opts.sameSite ?? "Lax";
  const secure = opts.secure ?? process.env.NODE_ENV === "production";
  const parts = [
    `${LOCALE_COOKIE_NAME}=${encodeURIComponent(id)}`,
    `Path=${LOCALE_COOKIE_PATH}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

/**
 * Client-side cookie write.
 * @param {string} localeId
 */
export function writeLocaleCookieClient(localeId) {
  if (typeof document === "undefined") return;
  const id = normalizeLocaleId(localeId);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(id)}; Path=${LOCALE_COOKIE_PATH}; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/**
 * Client-side cookie delete.
 */
export function deleteLocaleCookieClient() {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE_NAME}=; Path=${LOCALE_COOKIE_PATH}; Max-Age=0; SameSite=Lax`;
}

/**
 * @param {import('next/server').NextResponse} response
 * @param {string} localeId
 */
export function setLocaleCookieOnResponse(response, localeId) {
  response.cookies.set(LOCALE_COOKIE_NAME, normalizeLocaleId(localeId), {
    path: LOCALE_COOKIE_PATH,
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
