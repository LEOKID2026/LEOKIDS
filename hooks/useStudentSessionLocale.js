import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { writeLocaleCookieClient } from "../lib/i18n/locale-cookie.js";
import {
  fetchStudentSessionLocale,
  patchStudentSessionLocale,
} from "../lib/student-client/session-locale.client.js";

/**
 * Hydrates student session interface locale from client_meta and persists selector changes.
 * Isolates two students on the same browser via per-student session authority.
 * @param {{ enabled?: boolean }} [opts]
 */
export function useStudentSessionLocale(opts = {}) {
  const router = useRouter();
  const enabled = opts.enabled !== false;
  const [interfaceLanguage, setInterfaceLanguage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    (async () => {
      const result = await fetchStudentSessionLocale();
      if (cancelled) return;
      if (result.ok && result.interfaceLanguage) {
        setInterfaceLanguage(result.interfaceLanguage);
        writeLocaleCookieClient(result.interfaceLanguage);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, router.pathname]);

  const onLocaleChange = useCallback(async (localeId) => {
    setInterfaceLanguage(localeId);
    writeLocaleCookieClient(localeId);
    const result = await patchStudentSessionLocale({ interfaceLanguage: localeId });
    if (result.ok) {
      setInterfaceLanguage(result.interfaceLanguage);
    }
  }, []);

  return {
    loaded,
    interfaceLanguage,
    onLocaleChange,
  };
}
