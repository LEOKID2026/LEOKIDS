/**
 * Client helpers for parent membership locale (interface + report language).
 */

/**
 * @param {string} bearerToken
 */
export async function fetchParentMembershipLocale(bearerToken) {
  const res = await fetch("/api/parent/membership/locale", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "fetch_failed" };
  }
  return {
    ok: true,
    interfaceLanguage: data.interfaceLanguage || "en",
    preferredReportLanguage: data.preferredReportLanguage || data.interfaceLanguage || "en",
  };
}

/**
 * @param {string} bearerToken
 * @param {{ interfaceLanguage?: string, preferredReportLanguage?: string }} patch
 */
export async function patchParentMembershipLocale(bearerToken, patch) {
  const res = await fetch("/api/parent/membership/locale", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "patch_failed" };
  }
  return {
    ok: true,
    interfaceLanguage: data.interfaceLanguage,
    preferredReportLanguage: data.preferredReportLanguage,
  };
}
