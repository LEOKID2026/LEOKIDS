import { useCallback, useRef, useState } from "react";
import { isDemoMode } from "../../lib/demo/demo-mode.client.js";
import { assertDemoPlayAllowed, DEMO_TIME_EXPIRED_CODE } from "../../lib/demo/demo-play-guard.client.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { resolveStudentApiErrorMessage } from "../../lib/student-client/student-api-legacy-errors.js";

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  return { ok: res.ok && payload?.ok === true, status: res.status, payload };
}

/**
 * @param {string} gameKey
 */
export function useSoloGameSession(gameKey) {
  const { t } = useI18n();
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartedAtMs, setSessionStartedAtMs] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const finishResultRef = useRef(null);

  const startSession = useCallback(
    async (difficulty = null) => {
      setBusy(true);
      setError("");
      finishResultRef.current = null;
      try {
        if (isDemoMode()) {
          if (!assertDemoPlayAllowed()) {
            setError(DEMO_TIME_EXPIRED_CODE);
            return null;
          }
          const demoId = `demo-solo-${gameKey}-${Date.now()}`;
          setSessionId(demoId);
          setSessionStartedAtMs(Date.now());
          return demoId;
        }
        const { ok, payload } = await postJson("/api/student/solo-games/start", {
          gameKey,
          difficulty: difficulty || undefined,
        });
        if (!ok) {
          setError(resolveStudentApiErrorMessage(payload?.code ? payload : { ...payload, error: payload?.error || "start_failed" }, t));
          return null;
        }
        setSessionId(payload.sessionId);
        const startedMs = payload.startedAt
          ? new Date(payload.startedAt).getTime()
          : Date.now();
        setSessionStartedAtMs(startedMs);
        return payload.sessionId;
      } catch {
        setError(resolveStudentApiErrorMessage("network_error", t));
        return null;
      } finally {
        setBusy(false);
      }
    },
    [gameKey, t]
  );

  const finishSession = useCallback(
    async (metrics) => {
      if (!sessionId) {
        setError(resolveStudentApiErrorMessage("missing_session", t));
        return null;
      }
      setBusy(true);
      setError("");
      try {
        if (isDemoMode()) {
          const payload = { ok: true, demo: true, sessionId, metrics };
          finishResultRef.current = payload;
          return payload;
        }
        const durationMs =
          sessionStartedAtMs != null ? Math.max(0, Date.now() - sessionStartedAtMs) : undefined;
        const { ok, payload } = await postJson("/api/student/solo-games/finish", {
          sessionId,
          metrics: {
            ...metrics,
            durationMs: metrics?.durationMs ?? durationMs,
          },
        });
        if (!ok) {
          setError(resolveStudentApiErrorMessage(payload?.code ? payload : { ...payload, error: payload?.error || "finish_failed" }, t));
          return null;
        }
        finishResultRef.current = payload;
        return payload;
      } catch {
        setError(resolveStudentApiErrorMessage("network_error", t));
        return null;
      } finally {
        setBusy(false);
      }
    },
    [sessionId, sessionStartedAtMs, t]
  );

  return {
    sessionId,
    busy,
    error,
    startSession,
    finishSession,
    finishResultRef,
  };
}
