import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import Layout from "../Layout";
import { syncStudentLocalStorageIdentity } from "../../lib/learning-student-local-sync";
import { isStudentIdentityDiagnosticsEnabled } from "../../lib/dev-student-identity-client";
import {
  fetchStudentMeClient,
  getCachedStudentMe,
  invalidateStudentMeClientCache,
} from "../../lib/learning-client/studentMeClient";
import { StudentSessionProvider } from "./StudentSessionContext";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import StudentLoadingPanel from "../ui/StudentLoadingPanel.jsx";
import { StudentGameAccessProvider } from "../../contexts/StudentGameAccessContext.jsx";
import { StudentSubjectAccessProvider } from "../../contexts/StudentSubjectAccessContext.jsx";
import { buildStudentGameAccessView } from "../../hooks/useStudentGameAccess.js";
import {
  fetchStudentGameAccessCached,
  getCachedStudentGameAccess,
  invalidateStudentGameAccessClientCache,
} from "../../lib/learning-client/studentGameAccessClient.js";
import { prefetchStudentHubRoutes } from "../../lib/student-ui/student-hub-prefetch.client.js";
import { studentPathNeedsGameAccess } from "../../lib/student-ui/student-game-access-paths.client.js";

/** Allowed to store in next= after login — no open redirect */
function isSafeNextPath(path) {
  return (
    typeof path === "string" &&
    !path.startsWith("//") &&
    !path.includes("://") &&
    (path.startsWith("/learning") || path.startsWith("/student/"))
  );
}

function resolveGateLayoutShell(pathname) {
  const path = pathname || "";
  if (path.startsWith("/student/")) return "home";
  return "learning";
}

function StudentGateShell({ pathname, children }) {
  const { theme } = useStudentTheme();
  return (
    <Layout studentTheme={theme} studentShell={resolveGateLayoutShell(pathname)}>
      {children}
    </Layout>
  );
}

function StudentGateBlockedPanel({ loginHref }) {
  const { tokens: T } = useStudentTheme();
  const t = useT();
  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-12 space-y-4" dir="ltr" lang="en">
      <p className={`${T.loadingText} text-left`}>{t("ui.student.accessGateSignInPrompt")}</p>
      <Link href={loginHref} className={`${T.ctaPrimary} inline-flex justify-center w-full sm:w-auto`}>
        {t("ui.student.accessGateSignInCta")}
      </Link>
    </div>
  );
}

function buildSubjectAccessFromMe(mePayload) {
  return {
    allowStudentGradePicker: mePayload?.allowStudentGradePicker === true,
    subjectPermissions: mePayload?.subjectPermissions || {},
    enforced: Object.prototype.hasOwnProperty.call(mePayload || {}, "subjectPermissions"),
  };
}

const EMPTY_SESSION = { status: "loading", student: null, subjectAccess: null };
const EMPTY_GAME_ACCESS = { status: "loading", data: null };

function applyCachedSession(setters, needsGameAccess) {
  const cached = getCachedStudentMe();
  if (!cached?.student?.id) return false;

  setters.setSession({
    status: "ok",
    student: cached.student,
    subjectAccess: buildSubjectAccessFromMe(cached),
  });
  setters.setInitialColdLoad(false);

  if (needsGameAccess) {
    const gameCached = getCachedStudentGameAccess(cached.student.id);
    if (gameCached) {
      setters.setGameAccess({ status: "ready", data: gameCached });
    }
  } else {
    setters.setGameAccess({ status: "skip", data: null });
  }
  return true;
}

export default function StudentAccessGate({ children }) {
  const router = useRouter();
  const t = useT();
  const pathname = router.pathname || "";
  const needsGameAccess = studentPathNeedsGameAccess(pathname);
  const bootstrappedRef = useRef(false);
  const hubsPrefetchedRef = useRef(false);

  /** @type {[{ status: "loading" | "ok" | "blocked", student: object | null, subjectAccess?: object|null }, function]: any} */
  const [session, setSession] = useState(EMPTY_SESSION);
  /** @type {[{ status: "skip" | "loading" | "ready" | "error", data: object | null }, function]: any} */
  const [gameAccess, setGameAccess] = useState(() =>
    needsGameAccess ? EMPTY_GAME_ACCESS : { status: "skip", data: null },
  );
  const [loginNextPath, setLoginNextPath] = useState("/learning");
  const [initialColdLoad, setInitialColdLoad] = useState(true);

  const bootstrapSession = useCallback(async () => {
    const meResult = await fetchStudentMeClient({
      force: session.status !== "ok",
      background: session.status === "ok",
    });

    if (!meResult.ok || !meResult.payload?.student?.id) {
      setSession({ status: "blocked", student: null, subjectAccess: null });
      const pathForNext = router.asPath || "/learning";
      const safeNext = isSafeNextPath(pathForNext) ? pathForNext : "/learning";
      router.replace(`/student/login?next=${encodeURIComponent(safeNext)}`);
      return;
    }

    const mePayload = meResult.payload;
    if (isStudentIdentityDiagnosticsEnabled()) {
      console.log("[StudentAccessGate] /me student", {
        id: mePayload.student?.id,
        fullName: mePayload.student?.full_name,
        gradeLevel: mePayload.student?.grade_level,
        fromCache: meResult.fromCache,
      });
    }

    syncStudentLocalStorageIdentity(mePayload.student, "StudentAccessGate after /me");

    setSession({
      status: "ok",
      student: mePayload.student,
      subjectAccess: buildSubjectAccessFromMe(mePayload),
    });
    setInitialColdLoad(false);

    if (!hubsPrefetchedRef.current) {
      hubsPrefetchedRef.current = true;
      prefetchStudentHubRoutes(router);
    }

    const sid = mePayload.student.id;
    const needsGame = studentPathNeedsGameAccess(router.pathname);
    if (needsGame) {
      void fetchStudentGameAccessCached(sid, {
        force: !getCachedStudentGameAccess(sid),
        background: Boolean(getCachedStudentGameAccess(sid)),
      }).then((gameResult) => {
        if (gameResult.ok && gameResult.data) {
          setGameAccess({ status: "ready", data: gameResult.data });
        } else if (!gameResult.fromCache) {
          setGameAccess({ status: "error", data: null });
        }
      });
    } else {
      setGameAccess({ status: "skip", data: null });
      void fetchStudentGameAccessCached(sid, {
        force: !getCachedStudentGameAccess(sid),
        background: true,
      });
    }
  }, [router, session.status]);

  useEffect(() => {
    if (!router.isReady || bootstrappedRef.current) return undefined;
    bootstrappedRef.current = true;

    const pathForNext = router.asPath || "/learning";
    const safeNext = isSafeNextPath(pathForNext) ? pathForNext : "/learning";
    setLoginNextPath(safeNext);

    const needsGame = studentPathNeedsGameAccess(router.pathname);
    applyCachedSession({ setSession, setGameAccess, setInitialColdLoad }, needsGame);

    void bootstrapSession().catch(() => {
      setSession({ status: "blocked", student: null, subjectAccess: null });
      setInitialColdLoad(false);
    });

    return undefined;
  }, [router.isReady, router.asPath, bootstrapSession]);

  const providerValue = useMemo(
    () => ({
      status: session.status,
      student: session.student,
    }),
    [session.status, session.student],
  );

  const gameAccessValue = useMemo(() => {
    if (gameAccess.status === "ready" && gameAccess.data) {
      return buildStudentGameAccessView(gameAccess.data);
    }
    return null;
  }, [gameAccess.status, gameAccess.data]);

  const loginHref = `/student/login?next=${encodeURIComponent(loginNextPath)}`;

  const showFullLoader =
    initialColdLoad && session.status === "loading" && !session.student;
  const showGameLoader = needsGameAccess && gameAccess.status === "loading" && session.status === "ok";

  const subjectAccessValue = useMemo(
    () => session.subjectAccess || { enforced: false, allowStudentGradePicker: false, subjectPermissions: {} },
    [session.subjectAccess],
  );

  const wrapWithSubjectAccess = (node) => (
    <StudentSubjectAccessProvider
      enforced={subjectAccessValue.enforced}
      allowStudentGradePicker={subjectAccessValue.allowStudentGradePicker}
      subjectPermissions={subjectAccessValue.subjectPermissions}
    >
      {node}
    </StudentSubjectAccessProvider>
  );

  const pageContent =
    session.status === "blocked" ? (
      <StudentGateShell pathname={pathname}>
        <StudentGateBlockedPanel loginHref={loginHref} />
      </StudentGateShell>
    ) : needsGameAccess && gameAccessValue ? (
      wrapWithSubjectAccess(
        <StudentGameAccessProvider value={gameAccessValue}>{children}</StudentGameAccessProvider>,
      )
    ) : session.status === "ok" ? (
      wrapWithSubjectAccess(children)
    ) : null;

  return (
    <StudentSessionProvider value={providerValue}>
      {showFullLoader || showGameLoader ? (
        <StudentLoadingPanel message={t("ui.student.loading")} fullPage />
      ) : (
        pageContent
      )}
    </StudentSessionProvider>
  );
}

export {
  invalidateStudentMeClientCache,
  invalidateStudentGameAccessClientCache,
};
