/**
 * Build API error payload from guest/arcade access guard result.
 * @param {{ ok: false, status?: number, code?: string, messageKey?: string, message?: string, featureKey?: string, category?: string }} access
 */
export function arcadeAccessErrorPayload(access) {
  return {
    ok: false,
    code: access.code || "forbidden",
    messageKey: access.messageKey || null,
    featureKey: access.featureKey || null,
    category: access.category || null,
  };
}
