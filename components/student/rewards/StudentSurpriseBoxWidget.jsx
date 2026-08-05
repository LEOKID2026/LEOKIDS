import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import StudentShareFriendsButton from "../StudentShareFriendsButton.jsx";
import { useStudentTheme } from "../../../contexts/StudentThemeContext.jsx";
import { isCardRewardsEnabledClient } from "../../../lib/rewards/reward-feature-flags.client.js";
import { formatCountdownLabel } from "../../../lib/rewards/rewards-ui.js";
import { useRewardUiCopy } from "../../../lib/rewards/reward-locale-context.jsx";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";

const STATUS_PATH = "/api/student/rewards/surprise-box/status";

/**
 * @param {{
 *   onOpen?: () => void,
 *   openingLocked?: boolean,
 *   refreshToken?: number,
 *   statusOverride?: { ready?: boolean, pendingBoxCount?: number } || null,
 * }} props
 */
export default function StudentSurpriseBoxWidget({
  onOpen,
  openingLocked = false,
  refreshToken = 0,
  statusOverride = null,
}) {
  const { tokens: T, isBright } = useStudentTheme();
  const copy = useRewardUiCopy();
  const demo = isDemoMode();
  const [phase, setPhase] = useState(demo ? "ok" : "idle");
  const [ready, setReady] = useState(() => {
    if (!demo) return false;
    if (statusOverride?.pendingBoxCount != null) {
      return Math.max(0, Number(statusOverride.pendingBoxCount) || 0) > 0;
    }
    if (typeof statusOverride?.ready === "boolean") return statusOverride.ready;
    return true;
  });
  const [pendingBoxCount, setPendingBoxCount] = useState(() => {
    if (!demo) return 0;
    if (statusOverride?.pendingBoxCount != null) {
      return Math.max(0, Number(statusOverride.pendingBoxCount) || 0);
    }
    return 1;
  });
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    if (demo) return;
    setPhase("loading");
    setError("");
    try {
      const res = await fetch(STATUS_PATH, {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        setError(copy("surpriseBox", "loadError"));
        setPhase("error");
        return;
      }
      setReady(json.ready === true);
      setPendingBoxCount(Math.max(0, Number(json.pendingBoxCount) || 0));
      setSecondsRemaining(
        json.secondsRemaining != null ? Math.max(0, Number(json.secondsRemaining) || 0) : null
      );
      setPhase("ok");
    } catch {
      setError(copy("surpriseBox", "networkError"));
      setPhase("error");
    }
  }, [copy, demo]);

  useEffect(() => {
    if (!isCardRewardsEnabledClient() && !demo) return undefined;
    if (demo) return undefined;
    void loadStatus();
  }, [loadStatus, refreshToken, demo]);

  useEffect(() => {
    if (!statusOverride) {
      if (demo) {
        setReady(true);
        setPendingBoxCount((prev) => (prev > 0 ? prev : 1));
        setPhase("ok");
      }
      return;
    }
    if (statusOverride.pendingBoxCount != null) {
      const count = Math.max(0, Number(statusOverride.pendingBoxCount) || 0);
      setPendingBoxCount(count);
      setReady(count > 0);
      if (count <= 0) setSecondsRemaining(null);
      setPhase("ok");
    } else if (typeof statusOverride.ready === "boolean") {
      setReady(statusOverride.ready);
      setPhase("ok");
    }
  }, [statusOverride, demo]);

  useEffect(() => {
    if (demo) return undefined;
    if (!ready && secondsRemaining != null && secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev == null || prev <= 1) {
            void loadStatus();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [ready, secondsRemaining, loadStatus, demo]);

  if (!isCardRewardsEnabledClient() && !demo) return null;

  const canOpen = (demo || phase === "ok") && ready && !openingLocked;

  const compactBtn =
    "flex-1 md:flex-none !min-h-[2.75rem] !px-3 !py-2 !text-sm text-center whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none";

  const titleColorClass = isBright ? "!text-orange-600" : "!text-amber-300";

  return (
    <section
      className={`mt-4 md:mt-5 w-full text-start overflow-x-hidden ${T.statCard}`}
      aria-label={copy("surpriseBox", "ariaLabel")}
      data-testid="student-surprise-box-widget"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-start">
            <span
              className="text-[1.625rem] md:text-xl shrink-0 leading-none inline-flex items-center"
              aria-hidden
            >
              🎁
            </span>
            <h2
              className={`${T.tileTitle} ${titleColorClass} !text-[1.625rem] md:!text-base !leading-[1.625rem] md:!leading-snug !min-h-0 !line-clamp-none`}
            >
              {copy("surpriseBox", "title")}
            </h2>
          </div>
          {phase === "loading" ? (
            <p className={`mt-0.5 text-xs md:text-sm ${T.tileSub}`}>{copy("surpriseBox", "loading")}</p>
          ) : phase === "error" ? (
            <p className="mt-0.5 text-xs md:text-sm text-rose-600">{error}</p>
          ) : ready ? (
            <p className="mt-0.5 text-xs md:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {pendingBoxCount > 1
                ? copy("surpriseBox", "readyMultiple", { count: pendingBoxCount })
                : copy("surpriseBox", "ready")}
            </p>
          ) : secondsRemaining != null ? (
            <p className={`mt-0.5 text-xs md:text-sm ${T.tileSub}`}>
              {copy("surpriseBox", "nextBoxIn")}{" "}
              <span className="tabular-nums font-semibold">{formatCountdownLabel(secondsRemaining)}</span>
            </p>
          ) : (
            <p className={`mt-0.5 text-xs md:text-sm ${T.tileSub}`}>
              {copy("surpriseBox", "keepLearning")}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-2 shrink-0 w-full md:w-auto min-w-0">
          <button
            type="button"
            data-testid="student-surprise-box-open"
            disabled={!canOpen}
            onClick={() => {
              if (!canOpen) return;
              onOpen?.();
            }}
            className={`${T.ctaSurpriseOpen} ${compactBtn}`}
          >
            {copy("surpriseBox", "openBox")}
          </button>
          <Link href="/student/cards" className={`${T.ctaCollection} ${compactBtn}`}>
            {copy("surpriseBox", "myCollection")}
          </Link>
          <div className="hidden md:contents">
            <StudentShareFriendsButton variant="desktop-surprise" />
          </div>
        </div>
      </div>
    </section>
  );
}
