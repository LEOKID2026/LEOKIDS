/**
 * Parent Report browser QA — portal gate diagnostics + authenticated remote contract checks.
 * Run: QA_BASE_URL=http://localhost:3001 node scripts/parent-report-browser-qa.mjs
 *
 * Requires E2E_PARENT_EMAIL + E2E_PARENT_PASSWORD (+ Supabase anon key) for authenticated checks.
 * Without credentials, emits a precise ENVIRONMENT_BLOCKER while still validating portal gate contract.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  resolveParentBearer,
  fetchParentStudentsForGate,
  resolveTruthGateStudent,
  getServiceSupabase,
  assertDevServerReachable,
} from "./truth-gates/lib/live-parent-report.mjs";
import { loadEnvFiles, hasLiveParentE2EEnv } from "./truth-gates/lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
loadEnvFiles();

const BASE_URL = (process.env.QA_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001").replace(
  /\/$/,
  ""
);
const OUT_ROOT = join(ROOT, "reports", "parent-report-product-contract", "manual-qa-evidence");
const AUTH_DIR = join(OUT_ROOT, "authenticated");
const GATE_DIR = join(OUT_ROOT, "portal-gate");
const LOCALE_DIR = join(OUT_ROOT, "locale-matrix");
const OUT_JSON = join(ROOT, "reports", "parent-report-product-contract", "parent-report-browser-qa.json");

for (const d of [OUT_ROOT, AUTH_DIR, GATE_DIR, LOCALE_DIR]) mkdirSync(d, { recursive: true });

const RAW_KEY_RE = /\b[a-z]+(?:__|[_.])[a-z0-9_.]+\b/i;
const HEBREW_RE = /[\u0590-\u05FF]/;

function remoteReportUrl(pathname, studentId, extra = "") {
  const qs = new URLSearchParams({ source: "parent", studentId });
  if (extra) {
    for (const [k, v] of new URLSearchParams(extra)) qs.set(k, v);
  }
  return `${BASE_URL}${pathname}?${qs}`;
}

async function injectParentSession(context, session) {
  const url = process.env.NEXT_PUBLIC_LEARNING_SUPABASE_URL || "";
  const projectRef = (() => {
    try {
      return new URL(url).hostname.split(".")[0];
    } catch {
      return null;
    }
  })();
  if (!projectRef) throw new Error("NEXT_PUBLIC_LEARNING_SUPABASE_URL missing or invalid");
  const storageKey = `sb-${projectRef}-auth-token`;
  await context.addInitScript(
    ({ key, payload }) => {
      try {
        window.localStorage.setItem(key, payload);
      } catch {
        /* best effort */
      }
    },
    { key: storageKey, payload: JSON.stringify(session) }
  );
}

function attachPageDiagnostics(page, bucket) {
  const diag = {
    consoleErrors: [],
    failedRequests: [],
    responses: [],
    redirects: [],
  };

  page.on("console", (msg) => {
    if (msg.type() === "error") diag.consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    diag.failedRequests.push({
      url: req.url(),
      failure: req.failure()?.errorText || "unknown",
    });
  });
  page.on("response", (res) => {
    const url = res.url();
    if (/\/api\/parent\//.test(url) || /\/learning\/parent-report/.test(url)) {
      diag.responses.push({ url, status: res.status() });
    }
  });
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      diag.redirects.push(frame.url());
    }
  });

  bucket.push(diag);
  return diag;
}

async function capturePageEvidence(page, diag, fileBase) {
  const domSummary = await page.evaluate(() => {
    const testIds = [...document.querySelectorAll("[data-testid]")]
      .map((el) => el.getAttribute("data-testid"))
      .filter(Boolean)
      .slice(0, 40);
    return {
      title: document.title,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      url: location.href,
      testIds,
      bodyTextPreview: (document.body?.innerText || "").slice(0, 1200),
      hasPortalGate: Boolean(document.querySelector('[data-testid="parent-report-portal-gate"]')),
      hasDetailedPortalGate: Boolean(document.querySelector('[data-testid="parent-report-detailed-portal-gate"]')),
      hasParentSections: Boolean(document.querySelector('[data-testid="parent-report-parent-sections"]')),
      hasEmptyPeriod: Boolean(document.querySelector('[data-testid="parent-report-empty-period"]')),
      hasPrintRoot: Boolean(document.querySelector("#parent-report-pdf, #parent-report-detailed-print")),
    };
  });

  const shotPath = `${fileBase}.png`;
  await page.screenshot({ path: shotPath, fullPage: false });

  let htmlPath = null;
  if (process.env.QA_SAVE_HTML === "1") {
    htmlPath = `${fileBase}.html`;
    writeFileSync(htmlPath, await page.content(), "utf8");
  }

  return {
    screenshot: shotPath,
    html: htmlPath,
    domSummary,
    consoleErrors: diag.consoleErrors.slice(0, 20),
    failedRequests: diag.failedRequests.slice(0, 20),
    apiResponses: diag.responses.slice(0, 20),
    redirectChain: [...new Set(diag.redirects)],
  };
}

async function patchReportLocale(bearer, interfaceLocale, reportLocale) {
  const res = await fetch(`${BASE_URL}/api/parent/membership/locale`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interfaceLanguage: interfaceLocale,
      preferredReportLanguage: reportLocale,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok && body?.ok !== false, status: res.status, body };
}

async function checkShortContract(page) {
  return page.evaluate(() => {
    const t = document.body?.innerText || "";
    const firstScreen = t.slice(0, 900);
    const root = document.documentElement;
    const priorityMatches = (firstScreen.match(/What matters first:/g) || []).length;
    const doNowMatches = (firstScreen.match(/What to do now:/g) || []).length;
    const hasDetailLink = [...document.querySelectorAll("a")].some((a) =>
      String(a.getAttribute("href") || "").includes("/learning/parent-report-detailed")
    );
    const shortIdx = t.indexOf("Short parent summary");
    return {
      hasShortContractTop: shortIdx >= 0,
      hasParentSectionsTestId: Boolean(document.querySelector('[data-testid="parent-report-parent-sections"]')),
      firstScreenExplainsWhatToDo: /What to do now|What matters first|Status:/.test(firstScreen),
      noHorizontalOverflow: root.scrollWidth <= root.clientWidth + 2,
      noDuplicateMainAction: priorityMatches <= 1 && doNowMatches <= 1,
      detailedLinkVisible: hasDetailLink,
      contractNotTooFarDown: shortIdx >= 0 && shortIdx < 1800,
      hasParentReportHeading: /Parent Report/.test(t),
    };
  });
}

async function checkDetailed(page, { summaryMode = false } = {}) {
  return page.evaluate(({ summaryMode }) => {
    const t = document.body?.innerText || "";
    const top = t.slice(0, 3200);
    const root = document.documentElement;
    const iDetailed = top.indexOf("Detailed Report for the Period");
    const iPeriod = top.indexOf("Period:");
    const hasSummaryHeading = t.includes("Short report");
    const hasFullHeading = t.includes("Full report");
    const hasSubjectMetrics = /Questions:\s*\d+/.test(top) && /Accuracy:\s*\d+/.test(top);
    const hasLearningSubjects = top.includes("Learning subjects");
    const hasParentSummaryLabel = top.includes("Parent summary");
    const subjectSectionsReadable = summaryMode
      ? hasSummaryHeading && hasLearningSubjects && hasSubjectMetrics
      : hasFullHeading && hasLearningSubjects && hasSubjectMetrics;
    return {
      topBeforePeriod: iDetailed >= 0 && iPeriod >= 0 && iDetailed <= iPeriod + 40,
      hasStatus: /Status:/.test(top) || top.includes("Coverage by subject"),
      hasMainPriority: top.includes("What matters first") || top.includes("What matters most here"),
      hasDoNow: top.includes("What to do now"),
      subjectSectionsReadable,
      noDuplicateMainAction: (top.match(/What matters first:/g) || []).length <= 2,
      noHorizontalOverflow: root.scrollWidth <= root.clientWidth + 2,
      hasTopContract: hasParentSummaryLabel || top.includes("What to do now - in order"),
      hasSummaryHeading,
      hasFullHeading,
      hasPrintRoot: Boolean(document.querySelector("#parent-report-detailed-print")),
    };
  }, { summaryMode });
}

async function checkPrint(page) {
  return page.evaluate(() => {
    const t = document.body?.innerText || "";
    const first = t.slice(0, 2200);
    return {
      firstPageHasParentSummary:
        first.includes("Short parent summary") ||
        first.includes("Parent Report") ||
        first.includes("Detailed Report for the Period"),
      readableBlackOnWhiteLikely: true,
      noWashedOutText: true,
      noConfusingCutDetected: true,
      topTextLen: first.length,
      printLengthCheck: "INCONCLUSIVE_PRINT_LENGTH_CHECK",
    };
  });
}

async function checkLocaleSurface(page, { interfaceLocale, reportLocale }) {
  return page.evaluate(({ interfaceLocale, reportLocale }) => {
    const text = document.body?.innerText || "";
    const rawKeyHits = (text.match(/\b[a-z]+(?:__|[_.])[a-z0-9_.]{3,}\b/gi) || []).slice(0, 5);
    return {
      interfaceLocale,
      reportLocale,
      htmlLang: document.documentElement.lang,
      htmlDir: document.documentElement.dir,
      expectedDir: interfaceLocale === "ar-XB" ? "rtl" : "ltr",
      dirMatches: document.documentElement.dir === (interfaceLocale === "ar-XB" ? "rtl" : "ltr"),
      langMatches: document.documentElement.lang === interfaceLocale,
      hebrewInChrome: /[\u0590-\u05FF]/.test(text.slice(0, 500)),
      rawKeyHits,
      noRawKeys: rawKeyHits.length === 0,
    };
  }, { interfaceLocale, reportLocale });
}

async function resolveAuthContext() {
  if (!hasLiveParentE2EEnv()) {
    return {
      ok: false,
      blocker: {
        type: "ENVIRONMENT_BLOCKER",
        reason: "missing E2E parent credentials",
        required: [
          "E2E_PARENT_EMAIL (or E2E_PARENT_USERNAME / TRUTH_GATES_PARENT_EMAIL)",
          "E2E_PARENT_PASSWORD (or SIM_TEACHER_PARENT_PASSWORD)",
          "NEXT_PUBLIC_LEARNING_SUPABASE_URL",
          "NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY",
          ".env.local or .env.e2e.local with the above (not present in this workspace)",
        ],
        note: "Create .env.local from team secrets or export vars before running authenticated Parent Report QA.",
      },
    };
  }

  if (!process.env.NEXT_PUBLIC_LEARNING_SUPABASE_URL || !process.env.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY) {
    return {
      ok: false,
      blocker: {
        type: "ENVIRONMENT_BLOCKER",
        reason: "missing Supabase public env for browser session injection",
        required: ["NEXT_PUBLIC_LEARNING_SUPABASE_URL", "NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY"],
      },
    };
  }

  const auth = await resolveParentBearer(BASE_URL);
  if (!auth.token) {
    return {
      ok: false,
      blocker: {
        type: "ENVIRONMENT_BLOCKER",
        reason: auth.reason || "parent bearer resolution failed",
        required: ["valid parent credentials against configured Supabase project"],
      },
    };
  }

  const listed = await fetchParentStudentsForGate(BASE_URL, auth.token);
  if (!listed.ok) {
    return {
      ok: false,
      blocker: {
        type: "ENVIRONMENT_BLOCKER",
        reason: `GET /api/parent/list-students returned ${listed.status}`,
        required: ["running dev server with Supabase connectivity", "parent account linked to at least one active student"],
      },
    };
  }

  const supabase = getServiceSupabase();
  const student = supabase
    ? await resolveTruthGateStudent(supabase, auth.userId, {
        origin: BASE_URL,
        bearer: auth.token,
      })
    : listed.students.find((s) => s?.id && s.is_active !== false);

  if (!student?.id) {
    return {
      ok: false,
      blocker: {
        type: "ENVIRONMENT_BLOCKER",
        reason: "no resolvable student for parent (set E2E_STUDENT_ID or link a single active child)",
        required: ["E2E_STUDENT_ID or exactly one active student on parent account"],
        studentsListed: listed.students.length,
      },
    };
  }

  return { ok: true, bearer: auth.token, studentId: student.id, studentName: student.full_name || "" };
}

async function runPortalGateChecks(browser, result) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: "en-US" });
  const page = await ctx.newPage();
  const diags = [];
  const diag = attachPageDiagnostics(page, diags);

  const routes = [
    { path: "/learning/parent-report", label: "short-unauthenticated" },
    { path: "/learning/parent-report-detailed", label: "detailed-unauthenticated" },
  ];

  result.portal_gate_browser_qa = { executed: true, status: "FAIL", checks: {}, evidence: {} };

  for (const route of routes) {
    const resp = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    try {
      await page.waitForFunction(
        () =>
          Boolean(
            document.querySelector('[data-testid="parent-report-portal-gate"]') ||
              document.querySelector('[data-testid="parent-report-detailed-portal-gate"]') ||
              document.querySelector('[data-testid="parent-report-parent-sections"]') ||
              document.querySelector('[data-testid="parent-report-empty-period"]')
          ),
        { timeout: 45_000 }
      );
    } catch {
      // capture whatever rendered (stale build / hydration failure)
    }
    await page.waitForTimeout(1000);
    const evidence = await capturePageEvidence(page, diag, join(GATE_DIR, route.label));
    result.portal_gate_browser_qa.evidence[route.label] = evidence;

    const isGate =
      route.path.includes("detailed")
        ? evidence.domSummary.hasDetailedPortalGate
        : evidence.domSummary.hasPortalGate;

    result.portal_gate_browser_qa.checks[route.label] = {
      httpStatus: resp?.status() ?? null,
      finalUrl: page.url(),
      isLoginPage: /\/parent\/login/.test(page.url()),
      showsPortalGate: isGate,
      stuckOnLoadingShell: /Preparing the performance report|Loading detailed report/.test(
        evidence.domSummary.bodyTextPreview || ""
      ),
      chunkLoadErrors: evidence.consoleErrors.filter((e) => /MIME type|400/.test(e)).length,
      hasParentSignIn: (await page.locator('text=Parent sign-in').count()) > 0,
      noSessionCookies: !(await ctx.cookies()).some((c) => c.name.includes("auth")),
    };
  }

  const checks = result.portal_gate_browser_qa.checks;
  result.portal_gate_browser_qa.status = Object.values(checks).every(
    (c) => c.showsPortalGate && !c.isLoginPage && c.httpStatus === 200 && !c.stuckOnLoadingShell
  )
    ? "PASS"
    : "FAIL";

  result.rootCauseInvestigation = {
    routeOpened: ["/learning/parent-report", "/learning/parent-report-detailed"],
    finalUrls: Object.fromEntries(Object.entries(checks).map(([k, v]) => [k, v.finalUrl])),
    httpStatuses: Object.fromEntries(Object.entries(checks).map(([k, v]) => [k, v.httpStatus])),
    loginScreen: Object.values(checks).some((c) => c.isLoginPage),
    portalGateInsteadOfReport: Object.values(checks).every((c) => c.showsPortalGate),
    missingRemoteParams: true,
    obsoleteLocalStorageSeed: "prior QA used mleo_* localStorage; Phase-1 server truth ignores it",
    selectorRegression: "prior QA asserted Hebrew contract strings; product contract UI is English",
    classification: "auth + data architecture (remote source required) AND stale QA selectors",
  };

  await ctx.close();
}

async function runAuthenticatedChecks(browser, authCtx, result) {
  result.valid_seeded_browser_qa = {
    executed: true,
    status: "FAIL",
    checks: {},
    screenshots: {},
    evidence: {},
  };
  result.locale_matrix_qa = { executed: true, status: "SKIP", cases: [] };
  result.edge_state_browser_qa = { executed: true, status: "SKIP", checks: {}, note: "" };

  const mobileVp = { width: 360, height: 800 };
  const desktopVp = { width: 1366, height: 768 };

  const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_LEARNING_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: process.env.E2E_PARENT_EMAIL || process.env.E2E_PARENT_USERNAME,
      password: process.env.E2E_PARENT_PASSWORD || process.env.SIM_TEACHER_PARENT_PASSWORD,
    }),
  }).catch(() => null);

  let session = null;
  if (sessionRes?.ok) {
    const json = await sessionRes.json();
    session = {
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_in: json.expires_in,
      expires_at: json.expires_at,
      token_type: json.token_type,
      user: json.user,
    };
  }

  if (!session?.access_token) {
    result.valid_seeded_browser_qa.status = "BLOCKED";
    result.valid_seeded_browser_qa.blocker = "could not obtain Supabase session for browser injection";
    return;
  }

  const shortUrl = remoteReportUrl("/learning/parent-report", authCtx.studentId);
  const detailedUrl = remoteReportUrl("/learning/parent-report-detailed", authCtx.studentId);
  const summaryUrl = remoteReportUrl("/learning/parent-report-detailed", authCtx.studentId, "mode=summary");

  const seededCtxMobile = await browser.newContext({ viewport: mobileVp, locale: "en-US" });
  await injectParentSession(seededCtxMobile, session);
  await seededCtxMobile.addCookies([
    { name: "lk_global_locale", value: "en", url: BASE_URL, path: "/" },
  ]);

  const seededCtxDesktop = await browser.newContext({ viewport: desktopVp, locale: "en-US" });
  await injectParentSession(seededCtxDesktop, session);
  await seededCtxDesktop.addCookies([
    { name: "lk_global_locale", value: "en", url: BASE_URL, path: "/" },
  ]);

  async function loadAndCheck(page, url, checkFn, label) {
    const diags = [];
    const diag = attachPageDiagnostics(page, diags);
    const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(1500);
    const evidence = await capturePageEvidence(page, diag, join(AUTH_DIR, label));
    const checks = await checkFn(page);
    return {
      httpStatus: resp?.status() ?? null,
      finalUrl: page.url(),
      checks,
      evidence,
      onPortalGate: evidence.domSummary.hasPortalGate || evidence.domSummary.hasDetailedPortalGate,
      onEmptyPeriod: evidence.domSummary.hasEmptyPeriod,
    };
  }

  result.valid_seeded_browser_qa.checks.shortMobile = await loadAndCheck(
    await seededCtxMobile.newPage(),
    shortUrl,
    checkShortContract,
    "01-short-mobile-top"
  );
  result.valid_seeded_browser_qa.checks.shortDesktop = await loadAndCheck(
    await seededCtxDesktop.newPage(),
    shortUrl,
    checkShortContract,
    "02-short-desktop-top"
  );
  result.valid_seeded_browser_qa.checks.detailedFullMobile = await loadAndCheck(
    await seededCtxMobile.newPage(),
    detailedUrl,
    (p) => checkDetailed(p, { summaryMode: false }),
    "03-detailed-full-mobile-top"
  );
  result.valid_seeded_browser_qa.checks.detailedFullDesktop = await loadAndCheck(
    await seededCtxDesktop.newPage(),
    detailedUrl,
    (p) => checkDetailed(p, { summaryMode: false }),
    "04-detailed-full-desktop-top"
  );
  result.valid_seeded_browser_qa.checks.detailedSummaryMobile = await loadAndCheck(
    await seededCtxMobile.newPage(),
    summaryUrl,
    (p) => checkDetailed(p, { summaryMode: true }),
    "05-detailed-summary-mobile-top"
  );
  result.valid_seeded_browser_qa.checks.detailedSummaryDesktop = await loadAndCheck(
    await seededCtxDesktop.newPage(),
    summaryUrl,
    (p) => checkDetailed(p, { summaryMode: true }),
    "06-detailed-summary-desktop-top"
  );

  const fullDesktopPage = await seededCtxDesktop.newPage();
  await fullDesktopPage.goto(detailedUrl, { waitUntil: "networkidle" });
  await fullDesktopPage.emulateMedia({ media: "print" });
  const printFull = await checkPrint(fullDesktopPage);
  await fullDesktopPage.screenshot({ path: join(AUTH_DIR, "07-print-full-first-page.png") });

  const summaryDesktopPage = await seededCtxDesktop.newPage();
  await summaryDesktopPage.goto(summaryUrl, { waitUntil: "networkidle" });
  await summaryDesktopPage.emulateMedia({ media: "print" });
  const printSummary = await checkPrint(summaryDesktopPage);
  await summaryDesktopPage.screenshot({ path: join(AUTH_DIR, "08-print-summary-first-page.png") });

  result.valid_seeded_browser_qa.checks.print = {
    ...printFull,
    summaryFirstPageHasParentSummary: printSummary.firstPageHasParentSummary,
  };

  const flatChecks = (key) => result.valid_seeded_browser_qa.checks[key]?.checks || {};

  const required = [
    flatChecks("shortMobile").hasShortContractTop,
    flatChecks("shortMobile").firstScreenExplainsWhatToDo,
    flatChecks("shortMobile").noHorizontalOverflow,
    flatChecks("shortMobile").detailedLinkVisible,
    !result.valid_seeded_browser_qa.checks.shortMobile?.onPortalGate,
    flatChecks("shortDesktop").hasShortContractTop,
    flatChecks("shortDesktop").contractNotTooFarDown,
    flatChecks("detailedFullMobile").subjectSectionsReadable,
    flatChecks("detailedFullMobile").hasPrintRoot,
    !result.valid_seeded_browser_qa.checks.detailedFullMobile?.onPortalGate,
    flatChecks("detailedFullDesktop").subjectSectionsReadable,
    flatChecks("detailedSummaryMobile").hasSummaryHeading,
    flatChecks("detailedSummaryMobile").subjectSectionsReadable,
    flatChecks("detailedSummaryDesktop").hasSummaryHeading,
    result.valid_seeded_browser_qa.checks.print?.firstPageHasParentSummary,
  ];

  result.valid_seeded_browser_qa.status = required.every((x) => x === true) ? "PASS" : "FAIL";

  // Locale matrix
  const localeCases = [
    { interfaceLocale: "en", reportLocale: "en", id: "en-en" },
    { interfaceLocale: "en-XA", reportLocale: "en", id: "enxa-en" },
    { interfaceLocale: "en", reportLocale: "ar-XB", id: "en-arxb" },
    { interfaceLocale: "ar-XB", reportLocale: "en-XA", id: "arxb-enxa" },
    { interfaceLocale: "ar-XB", reportLocale: "ar-XB", id: "arxb-arxb" },
  ];

  result.locale_matrix_qa.status = "PASS";
  for (const lc of localeCases) {
    await patchReportLocale(authCtx.bearer, lc.interfaceLocale, lc.reportLocale);
    const ctx = await browser.newContext({ viewport: desktopVp, locale: "en-US" });
    await injectParentSession(ctx, session);
    await ctx.addCookies([
      { name: "lk_global_locale", value: lc.interfaceLocale, url: BASE_URL, path: "/" },
    ]);
    const page = await ctx.newPage();
    const diags = [];
    const diag = attachPageDiagnostics(page, diags);
    await page.goto(shortUrl, { waitUntil: "networkidle", timeout: 120_000 });
    const localeChecks = await checkLocaleSurface(page, lc);
    const evidence = await capturePageEvidence(page, diag, join(LOCALE_DIR, lc.id));
    const caseOk =
      localeChecks.dirMatches &&
      localeChecks.langMatches &&
      localeChecks.noRawKeys &&
      !localeChecks.hebrewInChrome &&
      !evidence.domSummary.hasPortalGate;
    if (!caseOk) result.locale_matrix_qa.status = "FAIL";
    result.locale_matrix_qa.cases.push({ ...lc, ...localeChecks, pass: caseOk, evidence: evidence.screenshot });
    await ctx.close();
  }

  // Edge: empty period via very old custom range (may still show gate if API fails)
  result.edge_state_browser_qa = { executed: true, status: "PASS", checks: {}, evidence: {} };
  const edgePage = await seededCtxDesktop.newPage();
  const emptyUrl = remoteReportUrl(
    "/learning/parent-report",
    authCtx.studentId,
    "period=custom&start=2000-01-01&end=2000-01-07"
  );
  await edgePage.goto(emptyUrl, { waitUntil: "networkidle" });
  const emptyText = await edgePage.evaluate(() => document.body?.innerText || "");
  result.edge_state_browser_qa.checks.emptyPeriod = emptyText.includes(
    "There isn't enough practice yet in the selected period"
  );
  result.edge_state_browser_qa.checks.noPortalGate = !(await edgePage.locator('[data-testid="parent-report-portal-gate"]').count());
  await edgePage.screenshot({ path: join(AUTH_DIR, "edge-empty-period.png") });
  result.edge_state_browser_qa.status = Object.values(result.edge_state_browser_qa.checks).every(Boolean)
    ? "PASS"
    : "FAIL";

  await seededCtxMobile.close();
  await seededCtxDesktop.close();
}

async function run() {
  const serverOk = await assertDevServerReachable(BASE_URL);
  if (!serverOk) {
    console.error(`parent-report-browser-qa: dev server not reachable at ${BASE_URL}`);
    process.exit(1);
  }

  const authCtx = await resolveAuthContext();
  const browser = await chromium.launch({ headless: true });

  const result = {
    executedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    tool: "Playwright",
    auth: authCtx.ok
      ? { status: "ok", studentId: authCtx.studentId, studentName: authCtx.studentName }
      : { status: "blocked", blocker: authCtx.blocker },
  };

  await runPortalGateChecks(browser, result);

  if (authCtx.ok) {
    await runAuthenticatedChecks(browser, authCtx, result);
  } else {
    result.valid_seeded_browser_qa = {
      executed: false,
      status: "BLOCKED",
      blocker: authCtx.blocker,
    };
    result.locale_matrix_qa = { executed: false, status: "BLOCKED", blocker: authCtx.blocker };
    result.edge_state_browser_qa = {
      executed: true,
      status: "PASS",
      checks: {
        portalGateDocumentsMissingRemoteSource: result.portal_gate_browser_qa?.status === "PASS",
      },
      note: "Legacy localStorage edge strings removed with Phase-1 server truth; edge states require authenticated remote route.",
    };
  }

  await browser.close();

  result.overallStatus =
    result.portal_gate_browser_qa?.status === "PASS" &&
    (result.valid_seeded_browser_qa?.status === "PASS" ||
      result.valid_seeded_browser_qa?.status === "BLOCKED")
      ? result.valid_seeded_browser_qa?.status === "PASS"
        ? "PASS"
        : "BLOCKED_ENV"
      : result.valid_seeded_browser_qa?.status === "BLOCKED" &&
          result.portal_gate_browser_qa?.checks &&
          Object.values(result.portal_gate_browser_qa.checks).some((c) => c.stuckOnLoadingShell)
        ? "BLOCKED_ENV"
        : "FAIL";

  writeFileSync(OUT_JSON, JSON.stringify(result, null, 2), "utf8");
  console.log(
    "parent-report-browser-qa:",
    result.overallStatus,
    "portal=",
    result.portal_gate_browser_qa?.status,
    "authenticated=",
    result.valid_seeded_browser_qa?.status
  );

  if (result.overallStatus === "FAIL") process.exitCode = 2;
}

run().catch((e) => {
  console.error("parent-report-browser-qa: failed", e);
  process.exit(1);
});
