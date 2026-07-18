import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/Layout";
import PageSeo from "../../components/seo/PageSeo";
import { getPublicPageSeo } from "../../lib/site/public-page-seo.js";
import Link from "next/link";
import { useIOSViewportFix } from "../../hooks/useIOSViewportFix";
import { isStudentIdentityDiagnosticsEnabled } from "../../lib/dev-student-identity-client";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import LearningHubSubjectCard from "../../components/learning/LearningHubSubjectCard.jsx";
import StudentHomeModal from "../../components/student/StudentHomeModal";
import StudentMonthlyPersistencePanel from "../../components/student/StudentMonthlyPersistencePanel";
import { buildStudentHomeView } from "../../lib/learning-client/studentHomeDashboardClient";
import {
  getCachedStudentHomePayload,
  mergeStudentHomePayloads,
  setCachedStudentHomePayload,
} from "../../lib/learning-client/studentHomeProfileClient";
import { getCachedStudentMe, setCachedStudentMe } from "../../lib/learning-client/studentMeClient";
import { STUDENT_TRUTH_LABELS_HE } from "../../lib/learning-shared/student-display-truth.js";
import { GUEST_LOCKED_HOME_PANELS } from "../../lib/guest/constants.js";
import { isGuestStudent } from "../../lib/guest/guest-display.js";
import { isDemoMode, buildDemoDisplayStudent, readDemoSession } from "../../lib/demo/demo-mode.client.js";
import { useDemoMode } from "../../components/demo/DemoModeContext.jsx";
import {
  buildDemoDashboardView,
  buildDemoHomePayload,
} from "../../components/demo/demo-display-fixtures.js";

const HOME_SUMMARY_PATH = "/api/student/home-profile/summary";

const DEFAULT_SUBJECT_CARD = {
  card: "border-slate-100 hover:border-sky-100 bg-white",
  bar: "bg-sky-300",
  emoji: "bg-slate-50 border-slate-100",
};

const learningSeo = getPublicPageSeo("learning");

export async function getServerSideProps() {
  return {
    props: {
      showDevStudentSimulator:
        String(process.env.ENABLE_DEV_STUDENT_SIMULATOR || "").trim().toLowerCase() === "true",
    },
  };
}

export default function LearningHub({ showDevStudentSimulator }) {
  useIOSViewportFix();
  const { tokens: T, theme, subjectHubCard } = useStudentTheme();
  const { direction, locale } = useI18n();
  const t = useT();
  const { session: demoSession } = useDemoMode();
  const [progressOpen, setProgressOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [homePayload, setHomePayload] = useState(null);
  const [progressLoadPhase, setProgressLoadPhase] = useState("idle");
  const [guestPolicy, setGuestPolicy] = useState(null);
  const [lockToast, setLockToast] = useState("");
  const lockToastTimerRef = useRef(null);

  const progressPanel = useMemo(
    () => ({
      title: t("learning.myProgress"),
      emoji: "📈",
      size: "2xl",
      variant: "progress",
    }),
    [t]
  );

  const learningGames = useMemo(
    () => [
      {
        slug: "math-master",
        permissionKey: "math",
        title: t("learning.subjects.math"),
        emoji: "🧮",
        blurb: t("learning.blurbs.math"),
      },
      {
        slug: "geometry-master",
        permissionKey: "geometry",
        title: t("learning.subjects.geometry"),
        emoji: "📐",
        blurb: t("learning.blurbs.geometry"),
      },
      {
        slug: "english-master",
        permissionKey: "english",
        title: t("learning.subjects.english"),
        emoji: "🇬🇧",
        blurb: t("learning.blurbs.english"),
      },
      {
        slug: "science-master",
        permissionKey: "science",
        title: t("learning.subjects.science"),
        emoji: "🔬",
        blurb: t("learning.blurbs.science"),
      },
    ],
    [t]
  );

  const dashboardView = useMemo(() => {
    if (isDemoMode()) return buildDemoDashboardView(locale);
    if (!student?.id || !homePayload) return null;
    try {
      return buildStudentHomeView({ student, homePayload });
    } catch {
      return null;
    }
  }, [student, homePayload, locale]);

  const guestLockMessage = t("ui.student.guestLock");

  const showLockToast = useCallback(
    (message) => {
      const text = message || guestLockMessage;
      setLockToast(text);
      if (typeof window !== "undefined") {
        if (lockToastTimerRef.current) window.clearTimeout(lockToastTimerRef.current);
        lockToastTimerRef.current = window.setTimeout(() => setLockToast(""), 2200);
      }
    },
    [guestLockMessage]
  );

  const loadProgressData = useCallback(async () => {
    if (isDemoMode()) {
      setStudent(buildDemoDisplayStudent(demoSession || readDemoSession(), locale));
      setHomePayload(buildDemoHomePayload(locale));
      setProgressLoadPhase("ok");
      return;
    }
    setProgressLoadPhase("loading");
    try {
      const cachedMe = getCachedStudentMe();
      let mePayload = cachedMe;
      if (!mePayload?.student?.id) {
        const meRes = await fetch("/api/student/me", {
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        mePayload = await meRes.json().catch(() => ({}));
        if (meRes.ok && mePayload?.student?.id) {
          setCachedStudentMe(mePayload);
        }
      }

      const nextStudent = mePayload?.student;
      if (!nextStudent?.id) {
        setProgressLoadPhase("error");
        return;
      }

      setStudent(nextStudent);
      setGuestPolicy(mePayload?.guestPolicy || null);

      const cachedHome = getCachedStudentHomePayload(nextStudent.id);
      if (cachedHome?.merged) {
        setHomePayload(cachedHome.merged);
        setProgressLoadPhase("ok");
      }

      const summaryRes = await fetch(HOME_SUMMARY_PATH, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const summaryText = await summaryRes.text();
      let summaryJson = {};
      try {
        summaryJson = summaryText ? JSON.parse(summaryText) : {};
      } catch {
        if (!cachedHome?.merged) setProgressLoadPhase("error");
        return;
      }

      if (!summaryRes.ok || summaryJson?.ok !== true || !summaryJson?.accountSnapshot) {
        if (!cachedHome?.merged) setProgressLoadPhase("error");
        return;
      }

      setCachedStudentHomePayload(nextStudent.id, { summary: summaryJson });
      const merged = mergeStudentHomePayloads(summaryJson, cachedHome?.analytics);
      setHomePayload(merged);
      setProgressLoadPhase("ok");
    } catch {
      setProgressLoadPhase("error");
    }
  }, [demoSession, locale]);

  const openProgressModal = useCallback(() => {
    if (isDemoMode()) {
      setStudent(buildDemoDisplayStudent(demoSession || readDemoSession(), locale));
      setHomePayload(buildDemoHomePayload(locale));
      setProgressOpen(true);
      setProgressLoadPhase("ok");
      return;
    }
    const cachedMe = getCachedStudentMe();
    const cachedGuestPolicy = guestPolicy || cachedMe?.guestPolicy || null;
    const cachedStudent = student || cachedMe?.student || null;
    const guestLocked =
      Boolean(cachedGuestPolicy || isGuestStudent(cachedStudent)) &&
      new Set(cachedGuestPolicy?.lockedHomePanels || GUEST_LOCKED_HOME_PANELS).has("progress");
    if (guestLocked) {
      showLockToast(t(cachedGuestPolicy?.lockMessageKey || "ui.student.guestLock"));
      return;
    }

    setProgressOpen(true);
    if (!homePayload || !student) {
      void loadProgressData();
    } else {
      setProgressLoadPhase("ok");
    }
  }, [guestPolicy, guestLockMessage, homePayload, loadProgressData, showLockToast, student, demoSession, locale, t]);

  const closeProgressModal = useCallback(() => setProgressOpen(false), []);

  const renderProgressPanelContent = () => {
    if (progressLoadPhase === "loading" || (progressOpen && !dashboardView && progressLoadPhase !== "error")) {
      return <p className={T.emptyText}>{t("learning.hubLoading")}</p>;
    }
    if (progressLoadPhase === "error" || !dashboardView) {
      return <p className={T.emptyText}>{STUDENT_TRUTH_LABELS_HE.unavailable}</p>;
    }
    if (dashboardView.monthlyPersistence?.loadError) {
      return <p className={T.emptyText}>{STUDENT_TRUTH_LABELS_HE.unavailable}</p>;
    }
    if (dashboardView.monthlyPersistence?.tiers?.length) {
      return <StudentMonthlyPersistencePanel monthlyPersistence={dashboardView.monthlyPersistence} />;
    }
    return <p className={T.emptyText}>{STUDENT_TRUTH_LABELS_HE.noData}</p>;
  };

  useEffect(() => {
    if (!isDemoMode()) return undefined;
    setStudent(buildDemoDisplayStudent(demoSession || readDemoSession(), locale));
    setHomePayload(buildDemoHomePayload(locale));
    return undefined;
  }, [demoSession?.gradeLevel, locale]);

  useEffect(() => {
    if (isDemoMode()) return undefined;
    if (!isStudentIdentityDiagnosticsEnabled()) return undefined;
    console.log("[learning/index] localStorage on mount", {
      liosh_active_student_id: localStorage.getItem("liosh_active_student_id"),
      mleo_player_name: localStorage.getItem("mleo_player_name"),
    });
    fetch("/api/student/me", { credentials: "include", cache: "no-store" })
      .then((r) => r.json().catch(() => ({})))
      .then((payload) => {
        console.log("[learning/index] GET /api/student/me", {
          ok: payload?.ok === true,
          id: payload.student?.id,
          fullName: payload.student?.full_name,
          gradeLevel: payload.student?.grade_level,
          debug: payload.debugStudentIdentity,
        });
        console.log("[learning/index] localStorage after /me response", {
          liosh_active_student_id: localStorage.getItem("liosh_active_student_id"),
          mleo_player_name: localStorage.getItem("mleo_player_name"),
        });
      })
      .catch((err) => {
        console.log("[learning/index] GET /api/student/me failed", String(err?.message || err));
      });
    return undefined;
  }, []);

  useEffect(
    () => () => {
      if (lockToastTimerRef.current) window.clearTimeout(lockToastTimerRef.current);
    },
    []
  );

  return (
    <Layout studentTheme={theme} studentShell="learning">
      <PageSeo
        title={learningSeo.title}
        description={learningSeo.description}
        canonicalPath={learningSeo.canonicalPath}
      />
      <div
        className={`max-w-5xl mx-auto px-3 sm:px-4 py-3 md:py-6 pb-4 overflow-x-hidden ${T.learningPageWrap}`}
        dir={direction}
      >
        {lockToast ? (
          <p
            className="fixed left-1/2 top-3 z-40 -translate-x-1/2 rounded-lg bg-slate-800/90 px-3 py-1.5 text-center text-xs font-semibold text-white"
            role="status"
          >
            {lockToast}
          </p>
        ) : null}

        <div className={T.hubTopBar}>
          <div className={T.hubTopBarBack}>
            <Link
              href="/student/home"
              className={`${T.hubBackLink} whitespace-nowrap max-md:text-xs max-md:px-2 max-md:py-1 max-md:min-h-8`}
            >
              {t("common.back")}
            </Link>
          </div>
          <p
            className={`${T.hubBadge} max-w-[min(100%,14rem)] sm:max-w-none text-center leading-tight max-md:min-h-8 max-md:py-1 max-md:leading-none`}
          >
            📚 {t("learning.hubBadge")}
          </p>
          <div className={T.hubTopBarTheme}>
            <button
              type="button"
              className={`${T.hubBackLink} whitespace-nowrap max-md:text-xs max-md:px-2 max-md:py-1 max-md:min-h-8`}
              onClick={openProgressModal}
              aria-haspopup="dialog"
            >
              {t("learning.myProgress")}
            </button>
          </div>
        </div>

        <header className={T.hubHeaderCard}>
          <h1 className={T.hubTitle}>{t("learning.hubTitle")}</h1>
          <p className={`${T.hubDesc} mt-2 line-clamp-2 md:line-clamp-none`}>
            {t("learning.hubSubtitle")}
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" aria-label={t("learning.chooseSubject")}>
          {learningGames.map((g) => {
            const subject = subjectHubCard[g.slug] || DEFAULT_SUBJECT_CARD;
            return (
              <LearningHubSubjectCard
                key={g.slug}
                slug={g.slug}
                permissionKey={g.permissionKey}
                title={g.title}
                emoji={g.emoji}
                blurb={g.blurb}
                subjectCard={subject}
                hubCardTokens={T}
              />
            );
          })}
        </section>

        {false && showDevStudentSimulator ? (
          <section className="mt-4">
            <Link
              href="/learning/dev-student-simulator"
              className="block rounded-2xl border border-indigo-300/40 bg-indigo-500/10 hover:bg-indigo-500/20 transition p-4 text-center"
            >
              <h2 className="font-bold text-lg">Student simulator (dev)</h2>
              <p className="text-sm text-white/70">Development student simulator</p>
            </Link>
          </section>
        ) : null}
      </div>

      <StudentHomeModal
        open={progressOpen}
        title={progressPanel.title}
        emoji={progressPanel.emoji}
        variant={progressPanel.variant}
        size={progressPanel.size}
        onClose={closeProgressModal}
      >
        {renderProgressPanelContent()}
      </StudentHomeModal>
    </Layout>
  );
}
