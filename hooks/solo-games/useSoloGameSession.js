import { useCallback, useRef, useState } from "react";
import { isDemoMode } from "../../lib/demo/demo-mode.client.js";
import { assertDemoPlayAllowed, DEMO_TIME_EXPIRED_CODE } from "../../lib/demo/demo-play-guard.client.js";

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
          setError(typeof payload?.error === "string" ? payload.error : "start_failed");
          return null;
        }
        setSessionId(payload.sessionId);
        const startedMs = payload.startedAt
          ? new Date(payload.startedAt).getTime()
          : Date.now();
        setSessionStartedAtMs(startedMs);
        return payload.sessionId;
      } catch {
        setError("network_error");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [gameKey]
  );

  const finishSession = useCallback(
    async (metrics) => {
      if (!sessionId) {
        setError("missing_session");
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
          setError(typeof payload?.error === "string" ? payload.error : "finish_failed");
          return null;
        }
        finishResultRef.current = payload;
        return payload;
      } catch {
        setError("network_error");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [sessionId, sessionStartedAtMs]
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
