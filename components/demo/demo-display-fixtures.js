import { demoPackCopyForLocale } from "../../lib/demo/demo-pack-copy.js";

/** LEO KIDS brand mascot — Shiba dog, not lion. */
export const DEMO_AVATAR_EMOJI = "🐶";

export const DEMO_COIN_BALANCE = 150;
export const DEMO_DIAMOND_BALANCE = 5;

/**
 * @param {string} [locale]
 */
export function buildDemoDailyMissions(locale = "en") {
  return {
    missions: [
      {
        id: "demo-m1",
        titleHe: demoPackCopyForLocale(locale, "missions", "mathTitle"),
        descriptionHe: demoPackCopyForLocale(locale, "missions", "mathDescription"),
        progressCurrent: 2,
        progressTarget: 5,
        completed: false,
        rewardCoins: 10,
      },
      {
        id: "demo-m2",
        titleHe: demoPackCopyForLocale(locale, "missions", "soloTitle"),
        descriptionHe: demoPackCopyForLocale(locale, "missions", "soloDescription"),
        progressCurrent: 0,
        progressTarget: 1,
        completed: false,
        rewardCoins: 15,
      },
    ],
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoMonthlyPersistence(locale = "en") {
  return {
    tiers: [
      { id: "demo-tier-1", labelHe: demoPackCopyForLocale(locale, "missions", "tier5"), minutesRequired: 5, reached: true },
      { id: "demo-tier-2", labelHe: demoPackCopyForLocale(locale, "missions", "tier15"), minutesRequired: 15, reached: false },
      { id: "demo-tier-3", labelHe: demoPackCopyForLocale(locale, "missions", "tier30"), minutesRequired: 30, reached: false },
    ],
    minutesThisMonth: 8,
    goalMinutes: 60,
    minutesDisplayHe: demoPackCopyForLocale(locale, "display", "monthlyMinutesDisplay"),
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoHomePayload(locale = "en") {
  const monthlyDisplay = demoPackCopyForLocale(locale, "display", "monthlyMinutesDisplay");
  const lifetimeDisplay = demoPackCopyForLocale(locale, "display", "lifetimeMinutesDisplay");
  return {
    derived: {
      summaryLevel: 3,
      summaryStars: 12,
      bestScoreOverall: 850,
      bestStreakOverall: 7,
      questionsAnswered: 42,
      correctAnswers: 36,
      overallAccuracyPct: 86,
      learningMinutesThisMonth: 8,
      learningMinutesThisMonthDisplayHe: monthlyDisplay,
      monthlyGoalMinutes: 60,
      learningMinutesFilterNoteHe: demoPackCopyForLocale(locale, "display", "allSubjectsScope"),
      learningMinutesLifetimeRounded: 120,
      learningMinutesLifetimeDisplayHe: lifetimeDisplay,
      learningMinutesLifetimeScopeHe: demoPackCopyForLocale(locale, "display", "learningMinutesScope"),
      summaryStarsScopeHe: demoPackCopyForLocale(locale, "display", "allSubjectsScope"),
    },
    profile: {
      avatarEmoji: DEMO_AVATAR_EMOJI,
      avatarBackgroundKey: "sky",
    },
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoDashboardView(locale = "en") {
  const homePayload = buildDemoHomePayload(locale);
  const monthlyDisplay = demoPackCopyForLocale(locale, "display", "monthlyMinutesDisplay");
  const displayName = demoPackCopyForLocale(locale, "display", "studentName");
  return {
    identity: {
      displayNameHe: displayName,
      coinBalanceDisplayHe: String(DEMO_COIN_BALANCE),
      coinBalance: DEMO_COIN_BALANCE,
      avatarEmoji: DEMO_AVATAR_EMOJI,
      avatarCustomDataUrl: "",
      avatarBackgroundKey: "sky",
    },
    accountStats: {
      ...homePayload.derived,
    },
    dailyMissions: buildDemoDailyMissions(locale),
    monthlyPersistence: buildDemoMonthlyPersistence(locale),
    subjects: [
      { key: "math", labelHe: demoPackCopyForLocale(locale, "subjects", "math"), href: "/learning/math-master", accuracyPct: 88, level: 3, stars: 4 },
      { key: "geometry", labelHe: demoPackCopyForLocale(locale, "subjects", "geometry"), href: "/learning/geometry-master", accuracyPct: 82, level: 2, stars: 3 },
      { key: "english", labelHe: demoPackCopyForLocale(locale, "subjects", "english"), href: "/learning/english-master", accuracyPct: 75, level: 2, stars: 2 },
      { key: "science", labelHe: demoPackCopyForLocale(locale, "subjects", "science"), href: "/learning/science-master", accuracyPct: 70, level: 2, stars: 2 },
    ],
    badges: [],
    recommendations: [],
    monthlyJourney: {
      minutesThisMonth: 8,
      minutesDisplayHe: monthlyDisplay,
      goalMinutes: 60,
      progressPct: 13,
      filterNoteHe: demoPackCopyForLocale(locale, "display", "allSubjectsScope"),
      encouragementHe: demoPackCopyForLocale(locale, "display", "encouragement"),
    },
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoArcadeProfile(locale = "en") {
  return {
    displayName: demoPackCopyForLocale(locale, "display", "arcadePlayerName"),
    fullName: null,
    totalWins: 0,
    totalLosses: 0,
    totalGames: 0,
    isGuest: false,
    leoNumber: null,
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoArcadeFixtures(locale = "en") {
  return {
    balance: DEMO_COIN_BALANCE,
    diamondBalance: DEMO_DIAMOND_BALANCE,
    games: [],
    clubProfile: buildDemoArcadeProfile(locale),
    openRooms: [],
    avatar: {
      avatarEmoji: DEMO_AVATAR_EMOJI,
      avatarCustomDataUrl: "",
      avatarBackgroundKey: "sky",
    },
    history: [],
  };
}

/**
 * @param {string} [locale]
 */
export function buildDemoMyRoomFixture(locale = "en") {
  return {
    trophies: [],
    decorations: [],
    messageHe: demoPackCopyForLocale(locale, "display", "myRoomMessage"),
  };
}

/** @deprecated use buildDemoDashboardView(locale) */
export const DEMO_DASHBOARD_VIEW = buildDemoDashboardView("en");

/** @deprecated use buildDemoArcadeProfile(locale) */
export const DEMO_ARCADE_PROFILE = buildDemoArcadeProfile("en");

/** @deprecated use buildDemoArcadeFixtures(locale) */
export const DEMO_ARCADE_FIXTURES = buildDemoArcadeFixtures("en");

/** @deprecated use buildDemoHomePayload(locale) */
export const DEMO_HOME_PAYLOAD = buildDemoHomePayload("en");

export const DEMO_ARCADE_HISTORY = [];
export const DEMO_ARCADE_MISSIONS = {
  missions: [],
  achievements: [],
  featureLocked: false,
};

export const DEMO_ARCADE_AVATAR = {
  avatarEmoji: DEMO_AVATAR_EMOJI,
  avatarCustomDataUrl: "",
  avatarBackgroundKey: "sky",
};

export const DEMO_MY_ROOM_FIXTURE = buildDemoMyRoomFixture("en");
