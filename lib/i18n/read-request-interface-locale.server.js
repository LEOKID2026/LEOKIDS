/**
 * Read interface locale from SSR request (middleware-forwarded or URL prefix).
 * @param {import('http').IncomingMessage|undefined} req
 * @param {string} [asPath]
 */
import { LOCALE_REQUEST_HEADER, resolveLocaleDefinition } from "./locale-registry.js";
import { getLocaleFromPath, stripLocaleFromPath } from "./locale-path.js";

export function readRequestInterfaceLocale(req, asPath = "") {
  if (req?.headers) {
    const direct = req.headers[LOCALE_REQUEST_HEADER] || req.headers["x-lk-interface-locale"];
    if (typeof direct === "string" && direct) {
      return resolveLocaleDefinition(direct).id;
    }

    const forwarded =
      req.headers[`x-middleware-request-${LOCALE_REQUEST_HEADER}`] ||
      req.headers["x-middleware-request-x-lk-interface-locale"];
    if (typeof forwarded === "string" && forwarded) {
      return resolveLocaleDefinition(forwarded).id;
    }
  }

  const fromAsPath = getLocaleFromPath(String(asPath || "").split("?")[0]);
  if (fromAsPath) return resolveLocaleDefinition(fromAsPath).id;

  const fromUrl = stripLocaleFromPath(String(req?.url || "").split("?")[0]).locale;
  if (fromUrl) return resolveLocaleDefinition(fromUrl).id;

  return null;
}

/**
 * @param {import('http').IncomingMessage|undefined} req
 * @param {string} [resolvedUrl]
 */
export function readSsrLocaleForRedirect(req, resolvedUrl = "") {
  return readRequestInterfaceLocale(req, resolvedUrl) || "en";
}
