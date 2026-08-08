/**
 * Client helpers for student session interface locale (client_meta.interface_locale).
 */

/**
 * @returns {Promise<{ ok: true, interfaceLanguage: string|null } | { ok: false, error: string }>}
 */
export async function fetchStudentSessionLocale() {
  const res = await fetch("/api/student/session/locale", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    return { ok: false, error: "unauthorized" };
  }
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "fetch_failed" };
  }
  return {
    ok: true,
    interfaceLanguage: data.interfaceLanguage || null,
  };
}

/**
 * @param {{ interfaceLanguage: string }} patch
 */
export async function patchStudentSessionLocale(patch) {
  const res = await fetch("/api/student/session/locale", {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return { ok: false, error: data?.error || "patch_failed" };
  }
  return {
    ok: true,
    interfaceLanguage: data.interfaceLanguage,
  };
}
