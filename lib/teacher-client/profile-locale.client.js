/**
 * Client helpers for teacher profile locale (preferred_language).
 */

/**
 * @param {string|null} bearerToken
 */
export async function fetchTeacherProfileLocale(bearerToken) {
  const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
  const res = await fetch("/api/teacher/profile/locale", {
    method: "GET",
    headers,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "fetch_failed" };
  }
  return {
    ok: true,
    preferredLanguage: data.preferredLanguage || "en",
  };
}

/**
 * @param {string|null} bearerToken
 * @param {{ preferredLanguage: string }} patch
 */
export async function patchTeacherProfileLocale(bearerToken, patch) {
  const headers = {
    "Content-Type": "application/json",
    ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
  };
  const res = await fetch("/api/teacher/profile/locale", {
    method: "PATCH",
    headers,
    credentials: "same-origin",
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "patch_failed" };
  }
  return {
    ok: true,
    preferredLanguage: data.preferredLanguage,
  };
}
