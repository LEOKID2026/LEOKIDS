import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getLearningSupabaseBrowserClient } from "../lib/learning-supabase/client";
import { resolveParentBearerSession } from "../lib/parent-client/parent-bearer-session.client.js";
import {
  fetchParentMembershipLocale,
  patchParentMembershipLocale,
} from "../lib/parent-client/membership-locale.client.js";
import { writeLocaleCookieClient } from "../lib/i18n/locale-cookie.js";
import { isParentReportLocaleExplicit } from "../lib/parent-client/report-locale-preference.client.js";

/**
 * Hydrates parent membership locale from API and persists manual UI/report changes.
 * @param {{ enabled?: boolean }} [opts]
 */
export function useParentMembershipLocale(opts = {}) {
  const router = useRouter();
  const enabled = opts.enabled !== false;
  const [membershipInterfaceLanguage, setMembershipInterfaceLanguage] = useState(null);
  const [preferredReportLanguage, setPreferredReportLanguage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const reloadMembership = useCallback(async () => {
    const supabase = getLearningSupabaseBrowserClient();
    const session = await resolveParentBearerSession(supabase);
    if (!session?.access_token) {
      setLoaded(true);
      return;
    }
    const result = await fetchParentMembershipLocale(session.access_token);
    if (result.ok) {
      setMembershipInterfaceLanguage(result.interfaceLanguage);
      setPreferredReportLanguage(result.preferredReportLanguage);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    (async () => {
      await reloadMembership();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, router.pathname, reloadMembership]);

  const patchLocales = useCallback(async (patch) => {
    const supabase = getLearningSupabaseBrowserClient();
    const session = await resolveParentBearerSession(supabase);
    if (!session?.access_token) return { ok: false };
    return patchParentMembershipLocale(session.access_token, patch);
  }, []);

  const onInterfaceLocaleChange = useCallback(
    async (localeId, changeOpts = {}) => {
      const patch = { interfaceLanguage: localeId };
      if (changeOpts.syncReportUnlessExplicit) {
        patch.preferredReportLanguage = localeId;
      }
      writeLocaleCookieClient(localeId);
      const result = await patchLocales(patch);
      if (result.ok) {
        setMembershipInterfaceLanguage(result.interfaceLanguage);
        setPreferredReportLanguage(result.preferredReportLanguage);
      }
    },
    [patchLocales]
  );

  const onReportLocaleChange = useCallback(
    async (localeId) => {
      const result = await patchLocales({ preferredReportLanguage: localeId });
      if (result.ok) {
        setPreferredReportLanguage(result.preferredReportLanguage);
        if (result.interfaceLanguage) {
          setMembershipInterfaceLanguage(result.interfaceLanguage);
        }
      }
    },
    [patchLocales]
  );

  const onLocaleChange = useCallback(
    async (localeId) => {
      await onInterfaceLocaleChange(localeId, {
        syncReportUnlessExplicit: !isParentReportLocaleExplicit(),
      });
    },
    [onInterfaceLocaleChange]
  );

  return {
    loaded,
    membershipInterfaceLanguage,
    preferredReportLanguage,
    onLocaleChange,
    onInterfaceLocaleChange,
    onReportLocaleChange,
    reloadMembership,
  };
}
