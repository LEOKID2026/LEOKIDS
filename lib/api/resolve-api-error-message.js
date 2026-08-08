/**
 * Shared code-first API error display resolution (client-safe).
 *
 * Authority: stable machine code → localized validation.api mapping → generic fallback.
 * English server prose must not override a mapped code.
 */

const SNAKE_CODE_RE = /^[a-z][a-z0-9_]*$/i;

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeApiErrorCode(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function looksLikeMachineCode(value) {
  const raw = String(value ?? "").trim();
  if (!raw || !SNAKE_CODE_RE.test(raw)) return false;
  return raw.includes("_") || raw.length >= 3;
}

/**
 * Extract a candidate machine code from common API error shapes.
 *
 * @param {{ code?: string|null, errorCode?: string|null, error?: string|null, message?: string|null }|string|null|undefined} error
 * @returns {string}
 */
export function extractApiErrorCode(error) {
  if (!error) return "";
  if (typeof error === "string") {
    return looksLikeMachineCode(error) ? normalizeApiErrorCode(error) : "";
  }
  const direct =
    normalizeApiErrorCode(error.code) ||
    normalizeApiErrorCode(error.errorCode) ||
    (typeof error.error === "string" && looksLikeMachineCode(error.error)
      ? normalizeApiErrorCode(error.error)
      : "");
  if (direct) return direct;
  const message = String(error.message || "").trim();
  if (looksLikeMachineCode(message)) return normalizeApiErrorCode(message);
  return "";
}

/**
 * Resolve user-visible API error text with code-first priority.
 *
 * Semantics:
 * 1. mapped stable code → localized label
 * 2. known/unmapped code without label → localized generic fallback
 * 3. never prefer raw English `message` over a mapped code
 *
 * @param {{ code?: string|null, errorCode?: string|null, error?: string|null, message?: string|null }|string|null|undefined} error
 * @param {{
 *   labels?: Record<string, string>|null,
 *   fallback?: string|null,
 *   translate?: ((key: string) => string|null|undefined)|null,
 *   labelKeyPrefix?: string,
 * }} [options]
 * @returns {string}
 */
export function resolveApiErrorMessage(error, options = {}) {
  const labels = options.labels && typeof options.labels === "object" ? options.labels : null;
  const translate = typeof options.translate === "function" ? options.translate : null;
  const prefix = typeof options.labelKeyPrefix === "string" ? options.labelKeyPrefix : "validation.api.";
  const resolvedFallback =
    options.fallback != null && String(options.fallback).length > 0
      ? String(options.fallback)
      : "\u00a0";

  /**
   * @param {string} code
   * @returns {string|null}
   */
  const lookup = (code) => {
    if (!code) return null;
    if (labels) {
      const fromLabels = labels[code];
      if (typeof fromLabels === "string" && fromLabels.trim()) return fromLabels;
    }
    if (translate) {
      const prefixed = translate(`${prefix}${code}`);
      if (
        typeof prefixed === "string" &&
        prefixed.trim() &&
        prefixed !== `${prefix}${code}`
      ) {
        return prefixed;
      }
    }
    return null;
  };

  if (!error) return resolvedFallback;

  if (typeof error === "string") {
    const code = normalizeApiErrorCode(error);
    const mapped = lookup(code);
    if (mapped) return mapped;
    return resolvedFallback;
  }

  const code =
    normalizeApiErrorCode(error.code) ||
    normalizeApiErrorCode(error.errorCode) ||
    (typeof error.error === "string" && looksLikeMachineCode(error.error)
      ? normalizeApiErrorCode(error.error)
      : "");

  if (code) {
    const mapped = lookup(code);
    if (mapped) return mapped;
    return resolvedFallback;
  }

  const message = String(error.message || "").trim();
  if (looksLikeMachineCode(message)) {
    const mapped = lookup(normalizeApiErrorCode(message));
    if (mapped) return mapped;
  }

  return resolvedFallback;
}
