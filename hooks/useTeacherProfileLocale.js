import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getLearningSupabaseBrowserClient } from "../lib/learning-supabase/client";
import { resolveTeacherPortalAuth } from "../lib/teacher-portal/use-teacher-portal-session.js";
import {
  fetchTeacherProfileLocale,
  patchTeacherProfileLocale,
} from "../lib/teacher-client/profile-locale.client.js";

/**
 * Hydrates teacher preferred_language and persists manual UI changes.
 * Supports Supabase JWT and staff cookie sessions.
 * @param {{ enabled?: boolean }} [opts]
 */
export function useTeacherProfileLocale(opts = {}) {
  const router = useRouter();
  const enabled = opts.enabled !== false;
  const [preferredLanguage, setPreferredLanguage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    (async () => {
      const supabase = getLearningSupabaseBrowserClient();
      const auth = await resolveTeacherPortalAuth(supabase);
      if (!auth.ok) {
        if (!cancelled) setLoaded(true);
        return;
      }
      const result = await fetchTeacherProfileLocale(auth.token);
      if (cancelled) return;
      if (result.ok) {
        setPreferredLanguage(result.preferredLanguage);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, router.pathname]);

  const onLocaleChange = useCallback(async (localeId) => {
    const supabase = getLearningSupabaseBrowserClient();
    const auth = await resolveTeacherPortalAuth(supabase);
    if (!auth.ok) return;
    const result = await patchTeacherProfileLocale(auth.token, { preferredLanguage: localeId });
    if (result.ok) {
      setPreferredLanguage(result.preferredLanguage);
    }
  }, []);

  return {
    loaded,
    preferredLanguage,
    onLocaleChange,
  };
}
