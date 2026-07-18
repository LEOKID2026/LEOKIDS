import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { STUDENT_LAYOUT_CHROME_BOTTOM_CSS } from "../../lib/student-ui/student-ad-slot.client.js";
import PageSeo from "../../components/seo/PageSeo";
import { getPublicPageSeo } from "../../lib/site/public-page-seo.js";
import {
  clearAllStudentScopedBrowserStorage,
  syncStudentLocalStorageIdentity,
} from "../../lib/learning-student-local-sync";
import { isStudentIdentityDiagnosticsEnabled } from "../../lib/dev-student-identity-client";
import { buildStudentHomeView } from "../../lib/learning-client/studentHomeDashboardClient";
import {
  invalidateStudentLearningProfileClientCache,
} from "../../lib/learning-client/studentLearningProfileClient";
import {
  getCachedStudentHomePayload,
  mergeStudentHomePayloads,
  setCachedStudentHomePayload,
  invalidateStudentHomeProfileClientCache,
  shouldSkipClientAchievementGrants,
  markClientAchievementGrantsCompleted,
  getClientAchievementGrantsInFlight,
  setClientAchievementGrantsInFlight,
  clearClientAchievementGrantsInFlight,
} from "../../lib/learning-client/studentHomeProfileClient";
import { invalidateStudentMeClientCache, getCachedStudentMe } from "../../lib/learning-client/studentMeClient";
import { invalidateStudentGameAccessClientCache } from "../../lib/learning-client/studentGameAccessClient.js";
import { useStudentSessionContext } from "../../components/student/StudentSessionContext";
import { STUDENT_TRUTH_LABELS_HE } from "../../lib/learning-shared/student-display-truth.js";
import StudentAvatarPickerModal from "../../components/student/StudentAvatarPickerModal";
import {
  readProfileBackgroundFromLocalStorage,
  resolveProfileBackgroundKey,
} from "../../lib/student-ui/profile-background.client.js";
import StudentHomeModal from "../../components/student/StudentHomeModal";
import StudentDailyMissionsPanel from "../../components/student/StudentDailyMissionsPanel";
import StudentMonthlyPersistencePanel from "../../components/student/StudentMonthlyPersistencePanel";
import StudentClassroomActivitiesPanel from "../../components/student/StudentClassroomActivitiesPanel";
import StudentWorksheetsPanel from "../../components/worksheet-activities/StudentWorksheetsPanel";
import { isClassroomActivitiesEnabled } from "../../lib/classroom-activities/classroom-activities-labels.client.js";
import { normalizeStudentActivityScope } from "../../lib/classroom-activities/student-activity-scope-labels.client.js";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import StudentSurpriseBoxOpenModal from "../../components/student/rewards/StudentSurpriseBoxOpenModal";
import StudentWorldTitleScreen from "../../components/student-world-hub/StudentWorldTitleScreen.jsx";
import { isCardRewardsEnabledClient } from "../../lib/rewards/reward-feature-flags.client.js";
import { patchSurpriseBoxStatusFromOpenResult } from "../../lib/rewards/surprise-box-status-patch.client.js";
import { GUEST_LOCK_MESSAGE_KEY, GUEST_LOCKED_HOME_PANELS, LIOSH_GUEST_RESUME_TOKEN_KEY } from "../../lib/guest/constants.js";
import { isGuestStudent } from "../../lib/guest/guest-display.js";
import { shouldClearGuestResumeTokenOnLogout } from "../../lib/guest/guest-resume-token.client.js";
import StudentLoadingPanel from "../../components/ui/StudentLoadingPanel.jsx";
import MockModeBanner from "../../components/ui/MockModeBanner.jsx";
import { isDemoMode, buildDemoDisplayStudent, clearDemoSession } from "../../lib/demo/demo-mode.client.js";
import {
  buildDemoHomePayload,
  buildDemoDashboardView,
  DEMO_AVATAR_EMOJI,
  DEMO_DIAMOND_BALANCE,
} from "../../components/demo/demo-display-fixtures.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { resolveStudentApiErrorMessage } from "../../lib/student-client/student-api-legacy-errors.js";

import { syncMonthlyProgressCacheFromServer } from "../../utils/progress-storage.js";

const HOME_SUMMARY_PATH = "/api/student/home-profile/summary";
const HOME_ANALYTICS_PATH = "/api/student/home-profile/analytics";
const HOME_ACHIEVEMENT_GRANTS_PATH = "/api/student/home-profile/achievement-grants";

const studentHomeSeo = getPublicPageSeo("student-home");

function LoadingScreen({ message }) {
  const { theme } = useStudentTheme();
  return (
    <Layout studentTheme={theme} studentShell="home">
      <PageSeo
        title={studentHomeSeo.title}
        description={studentHomeSeo.description}
        canonicalPath={studentHomeSeo.canonicalPath}
        noindex={studentHomeSeo.noindex}
      />
      <StudentLoadingPanel message={message} reportPage />
    </Layout>
  );
}

function StatCard({ label, value, sub }) {
  const { tokens: T } = useStudentTheme();
  return (
    <div className={T.statCard}>
      <p className={T.statLabel}>{label}</p>
      <p className={T.statValue}>{value}</p>
      {sub ? <p className={T.statSub}>{sub}</p> : null}
    </div>
  );
}

const HOME_PANEL_KEYS = {
  stats: { key: "panelStats", emoji: "📊", size: "6xl", variant: "stats" },
  progress: { key: "panelProgress", emoji: "📈", size: "2xl", variant: "progress" },
  missions: { key: "panelMissions", emoji: "✅", size: "2xl", variant: "missions" },
  classroom: { key: "panelClassroom", emoji: "📋", size: "4xl", variant: "classroom" },
  worksheets: { key: "panelWorksheets", emoji: "📄", size: "4xl", variant: "worksheets" },
  subjects: { key: "panelSubjects", emoji: "📚", size: "6xl", variant: "subjects" },
  badges: { key: "panelBadges", emoji: "🏅", size: "2xl", variant: "badges" },
  recommendations: { key: "panelRecommendations", emoji: "💡", size: "4xl", variant: "recommendations" },
};

function StatsSection({ dashboardView, accLabel, t }) {
  const { tokens: T } = useStudentTheme();
  const { accountStats: s } = dashboardView;
  return (
    <>
      <p className={T.panelIntro}>
        {t("ui.student.statsIntro")}
      </p>
      <div className={T.statsSummaryCard}>
        <p className={T.statsSummaryTitle}>{t("ui.student.statsQuickView")}</p>
        <div className={T.statsSummaryGrid}>
          <div className={T.statsSummaryItem}>
            <p className={T.statsSummaryLabel}>{t("ui.student.level")}</p>
            <p className={T.statsSummaryValue}>{s.summaryLevel}</p>
          </div>
          <div className={T.statsSummaryItem}>
            <p className={T.statsSummaryLabel}>{t("ui.student.stars")}</p>
            <p className={T.statsSummaryValue}>{s.summaryStars}</p>
            <p className="text-[10px] text-slate-500">{s.summaryStarsScopeHe}</p>
          </div>
          <div className={T.statsSummaryItem}>
            <p className={T.statsSummaryLabel}>{t("ui.student.accuracy")}</p>
            <p className={T.statsSummaryValue}>{accLabel(s.overallAccuracyPct)}</p>
          </div>
          <div className={T.statsSummaryItem}>
            <p className={T.statsSummaryLabel}>{t("ui.student.coins")}</p>
            <p className={T.statsSummaryValue}>{dashboardView.identity.coinBalanceDisplayHe ?? dashboardView.identity.coinBalance ?? "-"}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-3">
        <StatCard label={t("ui.student.bestScore")} value={s.bestScoreOverall} />
        <StatCard label={t("ui.student.bestStreak")} value={s.bestStreakOverall} />
        <StatCard label={t("ui.student.questionsAnswered")} value={s.questionsAnswered} />
        <StatCard label={t("ui.student.correctAnswers")} value={s.correctAnswers} />
        <StatCard
          label={t("ui.student.minutesThisMonth")}
          value={s.learningMinutesThisMonthDisplayHe ?? s.learningMinutesThisMonth ?? STUDENT_TRUTH_LABELS_HE.noData}
          sub={t("ui.student.minutesGoal", {
            goal: s.monthlyGoalMinutes,
            note: s.learningMinutesFilterNoteHe || STUDENT_TRUTH_LABELS_HE.periodThisMonth,
          })}
        />
        <StatCard
          label={t("ui.student.minutesLifetime")}
          value={s.learningMinutesLifetimeDisplayHe ?? s.learningMinutesLifetimeRounded}
          sub={s.learningMinutesLifetimeScopeHe || t("ui.student.minutesLifetimeSub")}
        />
      </div>
    </>
  );
}

function MonthlyJourneySection({ monthlyJourney, className = "", t }) {
  const { tokens: T } = useStudentTheme();
  return (
    <section className={`${T.monthlySection} ${className}`}>
      <h3 className={T.monthlyTitle}>{t("ui.student.monthlyJourney")}</h3>
      <div className="space-y-3">
        <p className={T.monthlyText}>
          {t("ui.student.monthMinutes")}{" "}
          <span className={T.monthlyHighlight}>
            {monthlyJourney.minutesDisplayHe ?? monthlyJourney.minutesThisMonth ?? STUDENT_TRUTH_LABELS_HE.noData}
          </span>{" "}
          / <span className="tabular-nums">{monthlyJourney.goalMinutes}</span>
        </p>
        {monthlyJourney.filterNoteHe ? (
          <p className="text-xs text-slate-500">{monthlyJourney.filterNoteHe}</p>
        ) : null}
        {monthlyJourney.progressPct != null ? (
          <div className={T.progressTrack}>
            <div className={T.progressFill} style={{ width: `${monthlyJourney.progressPct}%` }} />
          </div>
        ) : null}
        <p className={T.monthlyEncouragement}>{monthlyJourney.encouragementHe}</p>
      </div>
    </section>
  );
}

function SubjectsSection({ subjects, t }) {
  const { tokens: T, subjectAccentBar } = useStudentTheme();
  const subjectKeyAccent = {
    math: subjectAccentBar["math-master"],
    geometry: subjectAccentBar["geometry-master"],
    english: subjectAccentBar["english-master"],
    science: subjectAccentBar["science-master"],
  };
  return (
    <>
      <p className={T.panelIntro}>
        {t("ui.student.subjectsIntro")}
      </p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {subjects.map((s) => (
          <div key={s.key} className={T.subjectCard}>
            <span
              className={`${T.subjectAccentBar} ${subjectKeyAccent[s.key] || "bg-sky-400"}`}
              aria-hidden
            />
            <h3 className={T.subjectTitle}>{s.labelHe}</h3>
            <div className={`${T.subjectBody} flex-1`}>
              <div className={T.subjectStatRow}>
                <span className={T.subjectStatLabel}>{t("ui.student.accuracy")}</span>
                <span className={T.subjectStatValue}>{s.accuracyDisplayHe ?? "-"}</span>
              </div>
              <div className={T.subjectStatRow}>
                <span className={T.subjectStatLabel}>{t("ui.student.questionsCorrect")}</span>
                <span className={T.subjectStatValue}>
                  {s.answersDisplayHe ?? s.answersTotal} / {s.correctTotal}
                </span>
              </div>
              <div className={T.subjectStatRow}>
                <span className={T.subjectStatLabel}>{t("ui.student.levelStars")}</span>
                <span className={T.subjectStatValue}>
                  {s.levelDisplayHe ?? s.level ?? "-"} · {s.stars ?? "-"}
                  {s.starsScopeHe ? ` (${s.starsScopeHe})` : ""}
                </span>
              </div>
              <div className={T.subjectStatRow}>
                <span className={T.subjectStatLabel}>{t("ui.student.learningMinutes")}</span>
                <span className={T.subjectStatValue}>
                  {s.sessionMinutesDisplayHe ?? s.sessionMinutesRounded ?? "-"}
                </span>
              </div>
            </div>
            {s.progressIndicatorPct != null ? (
              <div className={T.subjectProgressTrack}>
                <div
                  className={T.subjectProgressFill}
                  style={{ width: `${s.progressIndicatorPct}%` }}
                />
              </div>
            ) : null}
            <Link href={s.href} className={T.subjectLink}>
              {t("ui.student.goToSubject")}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function BadgesSection({ badges, t }) {
  const { tokens: T } = useStudentTheme();
  if (badges.length === 0) {
    return (
      <p className={T.emptyText}>
        {t("ui.student.noBadgesYet")}
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {badges.map((b, i) => (
        <li
          key={`${b.label}-${i}`}
          className={T.badgePill}
        >
          {b.label}
          <span className={T.badgeSubject}>({b.subjectLabelHe})</span>
        </li>
      ))}
    </ul>
  );
}

function RecommendationsSection({ recommendations }) {
  const { tokens: T } = useStudentTheme();
  return (
    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
      {recommendations.map((r) => (
        <div
          key={r.id}
          className={T.recommendCard}
        >
          <h3 className={T.recommendTitle}>{r.titleHe}</h3>
          {r.hintHe ? <p className="text-xs text-slate-500 mb-1">{r.hintHe}</p> : null}
          <p className={T.recommendBody}>{r.descriptionHe}</p>
          <Link
            href={r.href}
            className={T.recommendCta}
          >
            {r.ctaHe}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function StudentHomePage() {
  const router = useRouter();
  const { direction, locale } = useI18n();
  const t = useT();
  const { tokens: T, theme, isBright } = useStudentTheme();
  const { status: sessionStatus, student: sessionStudent } = useStudentSessionContext();
  const [authPhase, setAuthPhase] = useState("checking");
  const [student, setStudent] = useState(null);
  const [homePayload, setHomePayload] = useState(null);
  const [profilePhase, setProfilePhase] = useState("idle");
  const [analyticsPhase, setAnalyticsPhase] = useState("idle");
  const [profileError, setProfileError] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [personalActivityCount, setPersonalActivityCount] = useState(0);
  const [personalActivities, setPersonalActivities] = useState([]);
  const [personalActivitiesPhase, setPersonalActivitiesPhase] = useState("idle");
  const [heroAvatarImage, setHeroAvatarImage] = useState(null);
  const [heroAvatarEmoji, setHeroAvatarEmoji] = useState("👤");
  const [heroAvatarBackground, setHeroAvatarBackground] = useState("sky");
  const [boxModalOpen, setBoxModalOpen] = useState(false);
  const [boxRefreshToken, setBoxRefreshToken] = useState(0);
  const [surpriseBoxStatus, setSurpriseBoxStatus] = useState(null);
  const [diamondBalance, setDiamondBalance] = useState(null);
  const [guestPolicy, setGuestPolicy] = useState(null);
  const [lockToast, setLockToast] = useState("");
  const lockToastTimerRef = useRef(null);
  const handleSurpriseBoxOpened = useCallback((json) => {
    const patch = patchSurpriseBoxStatusFromOpenResult(json);
    if (patch) setSurpriseBoxStatus(patch);
    setBoxRefreshToken((token) => token + 1);
  }, []);
  const cardRewardsEnabled = isCardRewardsEnabledClient();
  const isGuestHome = Boolean(guestPolicy || student?.account_kind === "guest" || student?.accountKind === "guest");
  const guestLockedPanelSet = useMemo(() => {
    if (!isGuestHome) return new Set();
    const ids = guestPolicy?.lockedHomePanels || GUEST_LOCKED_HOME_PANELS;
    return new Set(ids);
  }, [guestPolicy, isGuestHome]);

  const loadDiamondBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/student/diamonds/balance", {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.ok === true) {
        setDiamondBalance(json.balance);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  const loadHomeAchievementGrants = useCallback(async (studentId) => {
    const sid = String(studentId || "").trim();
    if (!sid) return;
    if (shouldSkipClientAchievementGrants(sid)) return;

    const inFlight = getClientAchievementGrantsInFlight();
    if (inFlight) return inFlight;

    const flight = (async () => {
      try {
        const res = await fetch(HOME_ACHIEVEMENT_GRANTS_PATH, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.ok === true) {
          markClientAchievementGrantsCompleted(sid);
        }
      } catch {
        /* non-fatal — grants retried after cooldown */
      } finally {
        clearClientAchievementGrantsInFlight();
      }
    })();

    setClientAchievementGrantsInFlight(flight);
    return flight;
  }, []);

  const loadHomeAnalytics = useCallback(async (studentId, summaryPayload) => {
    setAnalyticsPhase("loading");
    try {
      const res = await fetch(HOME_ANALYTICS_PATH, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        setAnalyticsPhase("error");
        return;
      }

      if (!res.ok || json?.ok !== true) {
        setAnalyticsPhase("error");
        return;
      }

      if (json?.derived && studentId) {
        syncMonthlyProgressCacheFromServer(studentId, json.derived);
      }

      setCachedStudentHomePayload(studentId, { analytics: json });
      setHomePayload((prev) => mergeStudentHomePayloads(prev || summaryPayload, json));
      setAnalyticsPhase("ok");
    } catch {
      setAnalyticsPhase("error");
    }
  }, []);

  const loadHomeDashboard = useCallback(
    async (studentRecord) => {
      const studentId = studentRecord?.id;
      if (!studentId) return;

      const cached = getCachedStudentHomePayload(studentId);
      if (cached?.merged) {
        setHomePayload(cached.merged);
        setProfilePhase("ok");
        setAnalyticsPhase(cached.analytics ? "ok" : "idle");
      } else {
        setProfilePhase("loading");
        setHomePayload(null);
        setAnalyticsPhase("idle");
      }
      setProfileError("");

      try {
        const res = await fetch(HOME_SUMMARY_PATH, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const text = await res.text();
        let json = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch {
          if (!cached?.merged) {
            setProfileError(`Invalid server response (status ${res.status}).`);
            setProfilePhase("error");
          }
          return;
        }

        if (isStudentIdentityDiagnosticsEnabled()) {
          console.info("[student/home] home-profile summary response", {
            httpStatus: res.status,
            okFlag: json?.ok,
            hasAccountSnapshot: !!json?.accountSnapshot,
            hasChallenges: !!json?.challenges,
          });
        }

        if (!res.ok || json?.ok !== true || !json?.studentId || !json?.accountSnapshot) {
          if (!cached?.merged) {
            const errRaw = json?.error != null ? String(json.error) : "";
            const detail = json?.detail != null ? String(json.detail) : "";
            const combined = [
              resolveStudentApiErrorMessage(errRaw, t),
              detail && isStudentIdentityDiagnosticsEnabled() ? `(${detail})` : "",
            ]
              .filter(Boolean)
              .join(" ");
            setProfileError(combined || resolveStudentApiErrorMessage("", t));
            setProfilePhase("error");
          }
          return;
        }

        setCachedStudentHomePayload(studentId, { summary: json });
        const merged = mergeStudentHomePayloads(json, cached?.analytics);
        setHomePayload(merged);
        setProfilePhase("ok");

        void loadHomeAnalytics(studentId, json);
        void loadHomeAchievementGrants(studentId);
      } catch (e) {
        if (!cached?.merged) {
          setProfileError(t("auth.networkError"));
          setProfilePhase("error");
        }
        if (isStudentIdentityDiagnosticsEnabled()) {
          console.warn("[student/home] home-profile summary fetch threw", e);
        }
      }
    },
    [loadHomeAnalytics, loadHomeAchievementGrants, t]
  );

  useEffect(() => {
    if (!router.isReady) return undefined;
    if (isDemoMode()) {
      const demoStudent = buildDemoDisplayStudent(undefined, locale);
      setStudent(demoStudent);
      setAuthPhase("authed");
      setHomePayload(buildDemoHomePayload(locale));
      setProfilePhase("ok");
      setAnalyticsPhase("ok");
      setDiamondBalance(DEMO_DIAMOND_BALANCE);
      setPersonalActivities([]);
      setPersonalActivityCount(0);
      setPersonalActivitiesPhase("idle");
      setHeroAvatarEmoji(DEMO_AVATAR_EMOJI);
      setHeroAvatarBackground("sky");
      return undefined;
    }
    let mounted = true;
    setProfileError("");
    setPersonalActivities([]);
    setPersonalActivityCount(0);
    setPersonalActivitiesPhase("idle");

    const cachedMe = getCachedStudentMe();
    const activeStudent = sessionStudent || cachedMe?.student;

    if (sessionStatus === "blocked") {
      setAuthPhase("anon");
      router.replace("/student/login");
      return () => {
        mounted = false;
      };
    }

    if (!activeStudent?.id) {
      if (sessionStatus === "loading") {
        setAuthPhase("checking");
      }
      return () => {
        mounted = false;
      };
    }

    setStudent(activeStudent);
    setAuthPhase("authed");
    setGuestPolicy(cachedMe?.guestPolicy || null);

    const cachedHome = getCachedStudentHomePayload(activeStudent.id);
    if (cachedHome?.merged) {
      setHomePayload(cachedHome.merged);
      setProfilePhase("ok");
      setAnalyticsPhase(cachedHome.analytics ? "ok" : "idle");
      void loadHomeAnalytics(activeStudent.id, cachedHome.summary || {});
      void loadHomeAchievementGrants(activeStudent.id);
    } else {
      setProfilePhase("idle");
      setHomePayload(null);
      setAnalyticsPhase("idle");
      void loadHomeDashboard(activeStudent);
    }

    return () => {
      mounted = false;
    };
  }, [router.isReady, sessionStatus, sessionStudent, loadHomeDashboard, router, locale]);

  const dashboardView = useMemo(() => {
    if (isDemoMode()) return buildDemoDashboardView(locale);
    if (!student?.id || profilePhase !== "ok" || !homePayload) return null;
    try {
      const v = buildStudentHomeView({ student, homePayload });
      if (isStudentIdentityDiagnosticsEnabled() && v) {
        console.info("[student/home] dashboard view built", {
          summaryLevel: v.accountStats?.summaryLevel,
          summaryStars: v.accountStats?.summaryStars,
          bestScore: v.accountStats?.bestScoreOverall,
          questions: v.accountStats?.questionsAnswered,
        });
      }
      return v;
    } catch (e) {
      if (isStudentIdentityDiagnosticsEnabled()) {
        console.error("[student/home] buildStudentHomeView threw", e);
      }
      return null;
    }
  }, [student, homePayload, profilePhase, locale]);

  useEffect(() => {
    if (isDemoMode()) return undefined;
    if (authPhase !== "authed" || !student?.id) {
      setPersonalActivities([]);
      setPersonalActivityCount(0);
      setPersonalActivitiesPhase("idle");
      return undefined;
    }
    if (!isClassroomActivitiesEnabled()) {
      setPersonalActivities([]);
      setPersonalActivityCount(0);
      setPersonalActivitiesPhase("idle");
      return undefined;
    }

    let cancelled = false;
    setPersonalActivitiesPhase("loading");

    (async () => {
      try {
        const res = await fetch("/api/student/activities", {
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || json?.ok !== true) {
          setPersonalActivities([]);
          setPersonalActivityCount(0);
          setPersonalActivitiesPhase("error");
          return;
        }
        const activities = Array.isArray(json.activities) ? json.activities : [];
        const count = activities.filter((a) => {
          const scope = normalizeStudentActivityScope(a.scope);
          return scope === "student" || scope === "parent";
        }).length;
        setPersonalActivities(activities);
        setPersonalActivityCount(count);
        setPersonalActivitiesPhase("ok");
      } catch {
        if (cancelled) return;
        setPersonalActivities([]);
        setPersonalActivityCount(0);
        setPersonalActivitiesPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authPhase, student?.id]);

  useEffect(() => {
    if (isDemoMode()) return undefined;
    if (authPhase !== "authed" || !student?.id) {
      setDiamondBalance(null);
      return undefined;
    }
    void loadDiamondBalance();
  }, [authPhase, student?.id, boxRefreshToken, loadDiamondBalance]);

  const refreshHeroAvatarFromBrowser = useCallback(() => {
    if (typeof window === "undefined") return;
    const rowProf =
      homePayload?.profile && typeof homePayload.profile === "object" && !Array.isArray(homePayload.profile)
        ? homePayload.profile
        : null;
    const serverCustom =
      rowProf && typeof rowProf.avatarCustomDataUrl === "string" && rowProf.avatarCustomDataUrl.trim().startsWith("data:image/")
        ? rowProf.avatarCustomDataUrl.trim()
        : null;
    const img = localStorage.getItem("mleo_player_avatar_image");
    const em = localStorage.getItem("mleo_player_avatar");
    const profEmoji = rowProf?.avatarEmoji;
    const fromDashEmoji = dashboardView?.identity?.avatarEmoji;
    const fromDashCustom = dashboardView?.identity?.avatarCustomDataUrl;
    const fromDashBg = dashboardView?.identity?.avatarBackgroundKey;
    const profBg = rowProf?.avatarBackgroundKey;
    const localBg =
      typeof window !== "undefined" ? localStorage.getItem("mleo_player_avatar_background") : null;

    if (serverCustom || (typeof fromDashCustom === "string" && fromDashCustom.trim().startsWith("data:image/"))) {
      const url = serverCustom || String(fromDashCustom).trim();
      setHeroAvatarImage(url);
      setHeroAvatarEmoji("👤");
      setHeroAvatarBackground(
        resolveProfileBackgroundKey(profBg || fromDashBg || localBg || readProfileBackgroundFromLocalStorage()),
      );
      return;
    }
    if (img) {
      setHeroAvatarImage(img);
      setHeroAvatarEmoji("👤");
      setHeroAvatarBackground(
        resolveProfileBackgroundKey(profBg || fromDashBg || localBg || readProfileBackgroundFromLocalStorage()),
      );
      return;
    }
    setHeroAvatarImage(null);
    const pick =
      (em && String(em).trim()) ||
      (profEmoji != null && String(profEmoji).trim() !== "" ? String(profEmoji).trim() : "") ||
      (fromDashEmoji && String(fromDashEmoji).trim()) ||
      "👤";
    setHeroAvatarEmoji(pick.slice(0, 8));
    setHeroAvatarBackground(
      resolveProfileBackgroundKey(profBg || fromDashBg || localBg || readProfileBackgroundFromLocalStorage()),
    );
  }, [
    homePayload?.profile,
    dashboardView?.identity?.avatarEmoji,
    dashboardView?.identity?.avatarCustomDataUrl,
    dashboardView?.identity?.avatarBackgroundKey,
  ]);

  useEffect(() => {
    refreshHeroAvatarFromBrowser();
  }, [refreshHeroAvatarFromBrowser]);

  const mergeHomeLearningProfileAvatar = useCallback((partial) => {
    setHomePayload((prev) => {
      if (!prev || typeof prev !== "object") return prev;
      const profile =
        prev.profile && typeof prev.profile === "object" && !Array.isArray(prev.profile)
          ? { ...prev.profile }
          : {};
      if (partial && typeof partial === "object") {
        if (Object.prototype.hasOwnProperty.call(partial, "emoji")) {
          if (partial.emoji != null && String(partial.emoji).trim() !== "") {
            profile.avatarEmoji = String(partial.emoji).trim().slice(0, 8);
          } else {
            delete profile.avatarEmoji;
          }
        }
        if (Object.prototype.hasOwnProperty.call(partial, "customDataUrl")) {
          if (partial.customDataUrl != null && String(partial.customDataUrl).trim() !== "") {
            profile.avatarCustomDataUrl = String(partial.customDataUrl).trim();
          } else {
            delete profile.avatarCustomDataUrl;
          }
        }
        if (Object.prototype.hasOwnProperty.call(partial, "backgroundKey")) {
          if (partial.backgroundKey != null && String(partial.backgroundKey).trim() !== "") {
            profile.avatarBackgroundKey = resolveProfileBackgroundKey(partial.backgroundKey);
          } else {
            delete profile.avatarBackgroundKey;
          }
        }
      }
      return { ...prev, profile };
    });
  }, []);
  const profilePending = profilePhase === "idle" || profilePhase === "loading";
  const buildFailed = profilePhase === "ok" && !dashboardView;

  const accLabel = (pct) => (pct == null ? t("ui.student.noAccuracyData") : `${pct}%`);

  const openHomePanel = useCallback(
    (panelId) => {
      if (!panelId) return;
      if (isGuestHome && guestLockedPanelSet.has(panelId)) return;
      setActivePanel(panelId);
    },
    [isGuestHome, guestLockedPanelSet]
  );

  const showLockToast = useCallback((message) => {
    const text = message || t(GUEST_LOCK_MESSAGE_KEY);
    setLockToast(text);
    if (typeof window !== "undefined") {
      if (lockToastTimerRef.current) window.clearTimeout(lockToastTimerRef.current);
      lockToastTimerRef.current = window.setTimeout(() => setLockToast(""), 2200);
    }
  }, []);

  const closeHomePanel = useCallback(() => setActivePanel(null), []);

  const onLogout = async () => {
    if (isDemoMode()) {
      clearDemoSession();
      await router.replace("/");
      return;
    }
    setLogoutMessage("");
    const sid = student?.id;
    setLogoutBusy(true);
    try {
      await fetch("/api/student/logout", { method: "POST", credentials: "include" });
      if (
        typeof window !== "undefined" &&
        shouldClearGuestResumeTokenOnLogout(student, isGuestStudent(student))
      ) {
        localStorage.removeItem(LIOSH_GUEST_RESUME_TOKEN_KEY);
      }
      clearAllStudentScopedBrowserStorage(sid);
      invalidateStudentLearningProfileClientCache();
      invalidateStudentHomeProfileClientCache(sid);
      invalidateStudentMeClientCache();
      invalidateStudentGameAccessClientCache(sid);
      setStudent(null);
      setHomePayload(null);
      setProfilePhase("idle");
    setAnalyticsPhase("idle");
      setAuthPhase("anon");
      await router.replace("/student/login");
    } catch {
      setLogoutMessage(t("ui.student.logoutNetworkError"));
    } finally {
      setLogoutBusy(false);
    }
  };

  if (authPhase === "checking" || authPhase === "anon") {
    return <LoadingScreen message={authPhase === "anon" ? t("ui.student.redirectingLogin") : t("ui.student.loadingHome")} />;
  }

  if (!student) {
    return <LoadingScreen message={t("ui.student.loading")} />;
  }

  const heroName = String(student.displayNameHe || student.full_name || "").trim() || t("ui.student.childDefault");
  const heroGreeting = String(student.greetingHe || "").trim() || t("ui.student.hello", { name: heroName });
  const heroLeoNumber = String(student.leoNumber ?? student.leo_number ?? "").trim();
  const heroLeoLabel = String(student.leoNumberLabelHe || "").trim();
  const heroCoinsDisplay =
    student.coin_balance != null
      ? String(Number(student.coin_balance) || 0)
      : dashboardView?.identity?.coinBalanceDisplayHe ?? STUDENT_TRUTH_LABELS_HE.unavailable;
  const heroDiamondsDisplay =
    diamondBalance === null || diamondBalance === undefined
      ? STUDENT_TRUTH_LABELS_HE.unavailable
      : String(Number(diamondBalance) || 0);

  const renderActivePanelContent = () => {
    if (!dashboardView || !activePanel) return null;
    switch (activePanel) {
      case "stats":
        return <StatsSection dashboardView={dashboardView} accLabel={accLabel} t={t} />;
      case "missions":
        return dashboardView.dailyMissions?.missions?.length ? (
          <StudentDailyMissionsPanel dailyMissions={dashboardView.dailyMissions} />
        ) : (
          <p className={T.emptyText}>{t("ui.student.noDataYet")}</p>
        );
      case "progress":
        return dashboardView.monthlyPersistence?.loadError ? (
          <p className={T.emptyText}>{STUDENT_TRUTH_LABELS_HE.unavailable}</p>
        ) : dashboardView.monthlyPersistence?.tiers?.length ? (
          <StudentMonthlyPersistencePanel monthlyPersistence={dashboardView.monthlyPersistence} />
        ) : (
          <p className={T.emptyText}>{STUDENT_TRUTH_LABELS_HE.noData}</p>
        );
      case "classroom":
        return personalActivitiesPhase === "loading" ? (
          <p className={T.emptyText}>{t("ui.student.loadingActivities")}</p>
        ) : (
          <StudentClassroomActivitiesPanel
            activities={personalActivities}
            activitiesLoaded={personalActivitiesPhase === "ok" || personalActivitiesPhase === "error"}
            emptyFallback={
              <p className={T.panelEmpty}>
                {t("ui.student.noPersonalActivities")}
              </p>
            }
          />
        );
      case "worksheets":
        return (
          <StudentWorksheetsPanel
            emptyFallback={
              <p className={T.panelEmpty}>
                {t("ui.student.noWorksheets")}
              </p>
            }
          />
        );
      case "subjects":
        return <SubjectsSection subjects={dashboardView.subjects} t={t} />;
      case "badges":
        return <BadgesSection badges={dashboardView.badges} t={t} />;
      case "recommendations":
        return <RecommendationsSection recommendations={dashboardView.recommendations} />;
      default:
        return null;
    }
  };

  return (
    <Layout studentTheme={theme} studentShell="home">
      <PageSeo
        title={studentHomeSeo.title}
        description={studentHomeSeo.description}
        canonicalPath={studentHomeSeo.canonicalPath}
        noindex={studentHomeSeo.noindex}
      />
      <div
        key={isDemoMode() ? "demo-home" : student.id}
        className="relative flex h-full min-h-0 w-full flex-1 flex-col"
        dir={direction}
        style={{
          marginBottom: `calc(-1 * (${STUDENT_LAYOUT_CHROME_BOTTOM_CSS}))`,
          minHeight: `calc(100% + (${STUDENT_LAYOUT_CHROME_BOTTOM_CSS}))`,
        }}
      >
        {lockToast ? (
          <p
            className="absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-lg bg-slate-800/90 px-3 py-1.5 text-center text-xs font-semibold text-white"
            role="status"
            data-testid="student-world-home-lock-toast"
          >
            {lockToast}
          </p>
        ) : null}

        <MockModeBanner className="absolute left-1/2 top-12 z-30 max-w-[20rem] -translate-x-1/2" />

        <StudentWorldTitleScreen
          greetingHe={
            (isGuestHome ? heroGreeting : t("ui.student.hello", { name: heroName })).replace(/!+\s*$/, "")
          }
          coinsDisplay={heroCoinsDisplay}
          diamondsDisplay={heroDiamondsDisplay}
          leoNumber={heroLeoNumber}
          leoNumberLabelHe={heroLeoLabel}
          avatarEmoji={heroAvatarEmoji}
          avatarImage={heroAvatarImage}
          avatarBackgroundKey={heroAvatarBackground}
          guestLockedPanelSet={guestLockedPanelSet}
          lockMessage={t(guestPolicy?.lockMessageKey || GUEST_LOCK_MESSAGE_KEY)}
          logoutBusy={logoutBusy}
          onOpenPanel={openHomePanel}
          onOpenAvatar={isDemoMode() ? undefined : () => setShowAvatarModal(true)}
          onLogout={() => void onLogout()}
          onLockedTap={showLockToast}
          onSurpriseOpen={cardRewardsEnabled && !isDemoMode() ? () => setBoxModalOpen(true) : undefined}
          surpriseOpeningLocked={boxModalOpen}
          surpriseRefreshToken={boxRefreshToken}
          surpriseStatusOverride={surpriseBoxStatus}
          showParentInvite={isGuestHome}
        />

        {profilePhase === "error" && !profilePending ? (
          <p
            className={`absolute bottom-2 left-1/2 z-30 max-w-[20rem] -translate-x-1/2 rounded-lg bg-white/80 px-3 py-1 text-center text-xs backdrop-blur-sm ${isBright ? "text-rose-600" : "text-rose-200"}`}
          >
            {profileError || t("ui.student.progressLoadFailed")}{" "}
            <button type="button" className="underline" onClick={() => student && void loadHomeDashboard(student)}>
              {t("common.retry")}
            </button>
          </p>
        ) : null}

        {buildFailed ? (
          <p
            className={`absolute bottom-2 left-1/2 z-30 max-w-[20rem] -translate-x-1/2 rounded-lg bg-white/80 px-3 py-1 text-center text-xs backdrop-blur-sm ${isBright ? "text-rose-600" : "text-rose-200"}`}
          >
            {t("ui.student.dataProcessFailed")}{" "}
            <button type="button" className="underline" onClick={() => student && void loadHomeDashboard(student)}>
              {t("common.retry")}
            </button>
          </p>
        ) : null}

        {analyticsPhase === "error" && dashboardView && profilePhase === "ok" ? (
          <p
            className={`absolute bottom-8 left-1/2 z-30 max-w-[20rem] -translate-x-1/2 rounded-lg bg-white/80 px-3 py-1 text-center text-xs backdrop-blur-sm ${isBright ? "text-amber-700" : "text-amber-200"}`}
          >
            {t("ui.student.analyticsLoadFailed")}{" "}
            <button
              type="button"
              className="underline"
              onClick={() => homePayload && student?.id && void loadHomeAnalytics(student.id, homePayload)}
            >
              {t("common.retry")}
            </button>
          </p>
        ) : null}

        {logoutMessage ? (
          <p
            className={`absolute bottom-2 left-1/2 z-30 -translate-x-1/2 rounded-lg bg-white/80 px-3 py-1 text-center text-xs backdrop-blur-sm ${isBright ? "text-rose-600" : "text-rose-200"}`}
          >
            {logoutMessage}
          </p>
        ) : null}
      </div>
      <StudentHomeModal
        open={Boolean(activePanel && dashboardView)}
        title={activePanel ? t(`ui.student.${HOME_PANEL_KEYS[activePanel]?.key ?? "panelStats"}`) : ""}
        emoji={activePanel ? HOME_PANEL_KEYS[activePanel]?.emoji ?? "" : ""}
        variant={activePanel ? HOME_PANEL_KEYS[activePanel]?.variant ?? "default" : "default"}
        size={activePanel ? HOME_PANEL_KEYS[activePanel]?.size ?? "2xl" : "2xl"}
        onClose={closeHomePanel}
      >
        {renderActivePanelContent()}
      </StudentHomeModal>
      <StudentSurpriseBoxOpenModal
        open={boxModalOpen && !isDemoMode()}
        onClose={() => setBoxModalOpen(false)}
        onOpened={handleSurpriseBoxOpened}
      />
      <StudentAvatarPickerModal
        open={showAvatarModal && !isDemoMode()}
        onClose={() => setShowAvatarModal(false)}
        playerName={heroName}
        serverAvatarEmoji={
          homePayload?.profile && typeof homePayload.profile === "object" && !Array.isArray(homePayload.profile)
            ? homePayload.profile.avatarEmoji
            : dashboardView?.identity?.avatarEmoji
        }
        serverAvatarBackgroundKey={
          homePayload?.profile && typeof homePayload.profile === "object" && !Array.isArray(homePayload.profile)
            ? homePayload.profile.avatarBackgroundKey
            : dashboardView?.identity?.avatarBackgroundKey
        }
        onAvatarEmojiPersisted={(emoji) => {
          mergeHomeLearningProfileAvatar({ emoji });
        }}
        onAvatarCustomDataUrlPersisted={(customDataUrl) => {
          mergeHomeLearningProfileAvatar({ customDataUrl });
        }}
        onAvatarBackgroundPersisted={(backgroundKey) => {
          mergeHomeLearningProfileAvatar({ backgroundKey });
          setHeroAvatarBackground(resolveProfileBackgroundKey(backgroundKey));
        }}
        onAvatarChanged={() => {
          refreshHeroAvatarFromBrowser();
        }}
      />
    </Layout>
  );
}
