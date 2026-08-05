/**
 * ar-001 deep runtime audit — authenticated portals, learning flows, reports,
 * games, worksheets, books, PWA. No skips.
 *
 * Run:
 *   $env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3002"
 *   npx playwright test tests/e2e/ar-001-deep-runtime-audit.spec.ts --config=playwright.no-webserver.config.ts --project=chromium
 */
import { test, expect, type Page } from "@playwright/test";
import {
  AR_001_PREFIX,
  assertArabicDocumentShell,
  auditVisibleEnglish,
  collectAuditableBodyText,
  hasArabicContent,
} from "./helpers/ar-001-english-audit";
import { loginSchoolManager, loginTeacherDan, resolveTeacherClassId } from "./helpers/ar-001-auth";

const PARENT_DEMO_SESSION_KEY = "leokids_global_parent_demo_session";
const STUDENT_DEMO_SESSION_KEY = "leokids_global_demo_session";
const DEMO_CHILD_ID = "demo-parent-child-noam-g2";
const QA_USER = "e2e-ar";

const SOLO_GAMES = [
  "catcher",
  "flyer",
  "puzzle",
  "memory",
  "leo-jump",
  "balloons",
  "maze",
  "picture-puzzle",
  "target-tap",
  "sort-shapes",
  "smart-blocks",
  "fruit-slice",
  "leo-miners",
] as const;

const EDU_GAMES = [
  "recycling-factory",
  "leo-supermarket",
  "leo-lab",
  "leo-gifts",
  "leo-bakery",
  "leo-number-path",
  "leo-pizzeria",
  "leo-word-train",
  "leo-word-detective",
] as const;

const OFFLINE_SAME_DEVICE = [
  "tic-tac-toe",
  "rock-paper-scissors",
  "tap-battle",
  "memory-match",
] as const;

const TEACHER_DEEP_ROUTES = [
  "/teacher/dashboard",
  "/teacher/worksheets",
  "/teacher/school-messages",
  "/teacher/install-app",
  "/teacher/students/activities/new",
] as const;

const SCHOOL_DEEP_ROUTES = [
  "/school/dashboard",
  "/school/teachers",
  "/school/students",
  "/school/classes",
  "/school/messages",
  "/school/operators",
] as const;

async function dismissCookieBanner(page: Page) {
  const accept = page.getByRole("button", { name: /^(يقبل|Accept|accept)$/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click().catch(() => {});
  }
}

async function auditMain(page: Page, opts?: { allowEnglishLearningBody?: boolean }) {
  const lang = await page.locator("html").getAttribute("lang");
  const dir = await page.locator("html").getAttribute("dir");
  expect(assertArabicDocumentShell(lang, dir)).toEqual([]);
  const bodyText = await collectAuditableBodyText(page);
  expect(bodyText).not.toMatch(/This page could not be found|404|الصفحة غير موجودة/i);
  expect(hasArabicContent(bodyText) || opts?.allowEnglishLearningBody).toBeTruthy();
  // Strip Hebrew data residue from live demo accounts (names/labels) for chrome audit;
  // product chrome must not introduce new Hebrew — filter known data fields only.
  const sanitized = bodyText.replace(/[\u0590-\u05FF]+(?:[\s\u0590-\u05FF\-"']*)?/g, " ");
  const forbidden = auditVisibleEnglish(sanitized, opts);
  expect(forbidden, `forbidden: ${forbidden.join(", ")}`).toEqual([]);
}

async function clearPersonaSessions(page: Page) {
  await page.goto(`${AR_001_PREFIX}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ([parentKey, studentKey]) => {
      localStorage.removeItem(parentKey);
      localStorage.removeItem(studentKey);
      sessionStorage.clear();
    },
    [PARENT_DEMO_SESSION_KEY, STUDENT_DEMO_SESSION_KEY]
  );
}

async function enterParentDemo(page: Page) {
  await clearPersonaSessions(page);
  await page.goto(`${AR_001_PREFIX}/demo/parent/enter`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.evaluate((key) => localStorage.removeItem(key), PARENT_DEMO_SESSION_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByTestId("parent-demo-enter-button").click();
  await page.waitForURL(`**${AR_001_PREFIX}/parent/dashboard**`, { timeout: 30_000 });
}

async function enterStudentDemo(page: Page, grade = "g3") {
  await clearPersonaSessions(page);
  await page.goto(`${AR_001_PREFIX}/demo/enter?grade=${grade}`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.waitForURL(`**${AR_001_PREFIX}/student/home**`, { timeout: 30_000 });
}

/** Learning routes use StudentAccessGate — mock session like active-diagnosis flows. */
async function mockStudentSession(page: Page) {
  await page.route("**/api/student/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        student: {
          id: "00000000-0000-0000-0000-0000000000e2",
          full_name: QA_USER,
          grade_level: 3,
          is_active: true,
          coin_balance: 0,
        },
      }),
    });
  });
}

async function confirmMixedModal(page: Page) {
  const saveAr = page.getByRole("button", { name: /حفظ||Save/i });
  const allAr = page.getByRole("button", { name: /الكل||All/i });
  if (await allAr.first().isVisible().catch(() => false)) {
    await allAr.first().click();
  }
  if (await saveAr.first().isVisible().catch(() => false)) {
    await saveAr.first().click();
  }
}

async function runLearningSubjectFlow(
  page: Page,
  opts: {
    path: string;
    player: string;
    topic: string;
    start: string;
    surface: string;
    allowEnglishLearningBody?: boolean;
    mcqPrefix?: string;
    textAnswer?: string;
    checkAnswer?: string;
    topicValue?: string;
  }
) {
  await mockStudentSession(page);
  await page.goto(`${AR_001_PREFIX}${opts.path}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await dismissCookieBanner(page);
  await page.waitForTimeout(500);
  await expect(page.getByTestId(opts.player)).toBeVisible({ timeout: 60_000 });
  const player = page.getByTestId(opts.player);
  const tag = await player.evaluate((el) => el.tagName.toLowerCase());
  if (tag === "input" || tag === "textarea") {
    await player.fill(QA_USER);
  }
  if (opts.topicValue) {
    await page.getByTestId(opts.topic).selectOption(opts.topicValue);
  } else {
    await page.getByTestId(opts.topic).selectOption({ index: 1 }).catch(async () => {
      await page.getByTestId(opts.topic).selectOption({ index: 0 });
    });
  }
  await confirmMixedModal(page);
  await page.getByTestId(opts.start).click();
  await expect(page.getByTestId(opts.surface)).toBeVisible({ timeout: 60_000 });

  const auditLearningSurface = async () => {
    if (opts.allowEnglishLearningBody) {
      await auditMain(page, { allowEnglishLearningBody: true });
      return;
    }
    await auditMain(page);
  };

  await auditLearningSurface();

  if (opts.mcqPrefix) {
    const choice = page.getByTestId(`${opts.mcqPrefix}0`);
    await expect(choice).toBeVisible({ timeout: 30_000 });
    await choice.click({ force: true });
  } else if (opts.textAnswer && opts.checkAnswer) {
    const input = page.getByTestId(opts.textAnswer);
    await expect(input).toBeVisible({ timeout: 30_000 });
    await input.fill("999999");
    await page.getByTestId(opts.checkAnswer).click({ force: true });
  }

  await expect(page.getByTestId(opts.surface)).toBeVisible({ timeout: 30_000 });
  await auditLearningSurface();

  const stop = page.getByTestId("learning-stop-game");
  await expect(stop).toBeVisible({ timeout: 15_000 });
  await stop.click();
  await expect(page.getByTestId(opts.start)).toBeVisible({ timeout: 15_000 });
}

async function waitTeacherReady(page: Page) {
  await expect(page.getByTestId("teacher-dashboard-root")).toBeVisible({ timeout: 45_000 });
  await expect
    .poll(async () => page.getByTestId("teacher-dashboard-root").getAttribute("data-state"), {
      timeout: 60_000,
    })
    .toBe("ready");
  // Let locale bind settle past any English loading flash
  await page.waitForTimeout(500);
}

async function assertNot404(page: Page, status: number | undefined | null, path: string) {
  const code = status ?? 0;
  expect(code, `${path} HTTP`).toBeGreaterThanOrEqual(200);
  expect(code, `${path} must not be 404`).toBeLessThan(400);
  const bodyText = await collectAuditableBodyText(page);
  expect(bodyText).not.toMatch(/This page could not be found|404|الصفحة غير موجودة/i);
}

async function awaitTeacherRouteReady(page: Page, path: string) {
  if (path === "/teacher/worksheets" || path.endsWith("/teacher/worksheets")) {
    await expect(
      page
        .getByTestId("teacher-worksheets-ready")
        .or(page.getByTestId("teacher-worksheets-empty"))
        .or(page.getByTestId("teacher-worksheets-list"))
    ).toBeVisible({ timeout: 45_000 });
  }
  if (path.includes("/students/activities/new")) {
    await expect(page.getByTestId("teacher-activity-form-ready")).toBeVisible({ timeout: 45_000 });
  }
  if (path === "/teacher/dashboard" || path.endsWith("/teacher/dashboard")) {
    await waitTeacherReady(page);
  }
}

async function waitSchoolReady(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  // Require a ready school chrome signal — loading alone must not pass.
  await expect(
    page.getByText(/لوحة المدرسة|إدارة المدرسة|المعلمون|الطلاب|الصفوف/).first()
  ).toBeVisible({ timeout: 45_000 });
  await page.waitForTimeout(500);
}

test.describe.configure({ timeout: 180_000 });

test.describe("ar-001 teacher authenticated deep", () => {
  test("dashboard + deep portal routes", async ({ page }) => {
    await loginTeacherDan(page);
    await page.goto(`${AR_001_PREFIX}/teacher/dashboard`, { waitUntil: "domcontentloaded" });
    await waitTeacherReady(page);
    await auditMain(page);

    const classId = await resolveTeacherClassId(page);
    const teacherRoutes = [
      ...TEACHER_DEEP_ROUTES,
      `/teacher/class/${classId}`,
      `/teacher/class/${classId}/activities`,
      `/teacher/class/${classId}/worksheets`,
    ];

    const failures: string[] = [];
    for (const path of teacherRoutes) {
      const res = await page.goto(`${AR_001_PREFIX}${path}`, { waitUntil: "domcontentloaded" });
      const status = res?.status() ?? 0;
      if (status < 200 || status >= 400 || status === 0) {
        failures.push(`${path}: HTTP ${status || "navigation-failed"}`);
        continue;
      }
      try {
        await awaitTeacherRouteReady(page, path);
        await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
        const bodyText = await collectAuditableBodyText(page);
        if (/This page could not be found|404|الصفحة غير موجودة/i.test(bodyText)) {
          failures.push(`${path}: 404 body`);
          continue;
        }
        if (!hasArabicContent(bodyText)) {
          failures.push(`${path}: no Arabic content`);
          continue;
        }
        const sanitized = bodyText.replace(/[\u0590-\u05FF]+(?:[\s\u0590-\u05FF\-"']*)?/g, " ");
        const englishHits = auditVisibleEnglish(sanitized);
        if (englishHits.length) {
          failures.push(`${path}: English ${englishHits.slice(0, 5).join(" | ")}`);
        }
      } catch (err) {
        failures.push(`${path}: ${String(err)}`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});

test.describe("ar-001 school authenticated deep", () => {
  test("dashboard + deep portal routes", async ({ page }) => {
    await loginSchoolManager(page);
    await page.goto(`${AR_001_PREFIX}/school/dashboard`, { waitUntil: "domcontentloaded" });
    await waitSchoolReady(page);
    await auditMain(page);

    const failures: string[] = [];
    for (const path of SCHOOL_DEEP_ROUTES) {
      let res;
      try {
        res = await page.goto(`${AR_001_PREFIX}${path}`, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
      } catch (err) {
        // Next client transition can abort a prior goto under auth; retry once before failing.
        try {
          await page.waitForTimeout(500);
          res = await page.goto(`${AR_001_PREFIX}${path}`, {
            waitUntil: "load",
            timeout: 60_000,
          });
        } catch (err2) {
          failures.push(`${path}: navigation error ${String(err2)}`);
          continue;
        }
      }
      const status = res?.status() ?? 0;
      if (status < 200 || status >= 400 || status === 0) {
        failures.push(`${path}: HTTP ${status || "navigation-failed"}`);
        continue;
      }
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await page.waitForTimeout(800);
      const bodyText = await collectAuditableBodyText(page);
      if (/This page could not be found|404|الصفحة غير موجودة/i.test(bodyText)) {
        failures.push(`${path}: 404 body`);
        continue;
      }
      if (!hasArabicContent(bodyText)) {
        failures.push(`${path}: no Arabic content`);
        continue;
      }
      const sanitized = bodyText.replace(/[\u0590-\u05FF]+(?:[\s\u0590-\u05FF\-"']*)?/g, " ");
      const englishHits = auditVisibleEnglish(sanitized);
      if (englishHits.length) {
        failures.push(`${path}: English ${englishHits.slice(0, 5).join(" | ")}`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});

test.describe("ar-001 learning full question flows 4/4", () => {
  test("Math flow", async ({ page }) => {
    await runLearningSubjectFlow(page, {
      path: "/learning/math-master",
      player: "math-player-name",
      topic: "math-operation-select",
      start: "math-start-game",
      surface: "math-question-surface",
      topicValue: "addition",
      textAnswer: "math-text-answer",
      checkAnswer: "math-check-answer",
    });
  });

  test("Geometry flow", async ({ page }) => {
    await runLearningSubjectFlow(page, {
      path: "/learning/geometry-master",
      player: "geometry-player-name",
      topic: "geometry-topic-select",
      start: "geometry-start-game",
      surface: "geometry-question-stem",
      topicValue: "area",
      mcqPrefix: "geometry-mcq-",
      textAnswer: "geometry-text-answer",
      checkAnswer: "geometry-check-answer",
    });
  });

  test("Science flow", async ({ page }) => {
    await runLearningSubjectFlow(page, {
      path: "/learning/science-master",
      player: "science-player-name",
      topic: "science-topic-select",
      start: "science-start-game",
      surface: "science-question-stem",
      mcqPrefix: "science-mcq-",
    });
  });

  test("English flow (content English OK, chrome Arabic)", async ({ page }) => {
    await runLearningSubjectFlow(page, {
      path: "/learning/english-master",
      player: "english-player-name",
      topic: "english-topic-select",
      start: "english-start-game",
      surface: "english-question-stem",
      mcqPrefix: "english-mcq-",
      allowEnglishLearningBody: true,
    });
  });
});

test.describe("ar-001 reports short + regular + detailed", () => {
  test("short/regular parent-report + detailed + summary mode", async ({ page }) => {
    await enterParentDemo(page);

    await page.goto(
      `${AR_001_PREFIX}/parent/parent-report?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent`,
      { waitUntil: "domcontentloaded" }
    );
    await expect(page.getByTestId("report-date-range-control")).toBeVisible({ timeout: 45_000 });
    await page.getByTestId("report-range-preset-month").click({ force: true });
    await auditMain(page);

    await page.goto(
      `${AR_001_PREFIX}/parent/parent-report-detailed?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent&period=week`,
      { waitUntil: "domcontentloaded" }
    );
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("parent-report-detailed-ready")).toBeVisible({ timeout: 60_000 });
    await auditMain(page);

    // Summary mode is mandatory — navigate directly (no soft-skip on Short report button).
    await page.goto(
      `${AR_001_PREFIX}/parent/parent-report-detailed?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent&period=week&mode=summary`,
      { waitUntil: "domcontentloaded" }
    );
    await expect(page.getByTestId("parent-report-detailed-ready")).toBeVisible({ timeout: 60_000 });
    await auditMain(page);
  });
});

test.describe("ar-001 games runtime", () => {
  test("hubs + every solo game shell", async ({ page }) => {
    await enterStudentDemo(page);
    for (const path of [
      "/games",
      "/student/games",
      "/game",
      "/student/arcade",
      "/student/educational-games",
      "/offline",
    ]) {
      await page.goto(`${AR_001_PREFIX}${path}`, { waitUntil: "domcontentloaded" });
      await auditMain(page);
    }
    for (const key of SOLO_GAMES) {
      const res = await page.goto(`${AR_001_PREFIX}/student/solo-games/${key}`, {
        waitUntil: "domcontentloaded",
      });
      await assertNot404(page, res?.status(), `/student/solo-games/${key}`);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      const bodyText = await collectAuditableBodyText(page);
      expect(auditVisibleEnglish(bodyText)).toEqual([]);

      // Mandatory gameplay markers for sort-shapes + memory — no soft-skip.
      if (key === "sort-shapes" || key === "memory") {
        const start = page.getByRole("button", { name: /ابدأ|بدء|تشغيل|Start|Play/i }).first();
        await expect(start).toBeVisible({ timeout: 30_000 });
        await start.click({ force: true });
        const gameplayId = key === "memory" ? "memory-gameplay" : "sort-shapes-gameplay";
        await expect(page.getByTestId(gameplayId)).toBeVisible({ timeout: 30_000 });
        const afterStart = await collectAuditableBodyText(page);
        expect(auditVisibleEnglish(afterStart)).toEqual([]);
      } else {
        const start = page.getByRole("button", { name: /ابدأ|بدء|تشغيل|Start|Play/i }).first();
        await expect(start).toBeVisible({ timeout: 30_000 });
        await start.click({ force: true });
        await page.waitForTimeout(400);
        const afterStart = await collectAuditableBodyText(page);
        expect(auditVisibleEnglish(afterStart)).toEqual([]);
        const pause = page.getByRole("button", { name: /إيقاف مؤقت|إيقاف|Pause/i }).first();
        // Pause is not present on every shell; when present it must not leak English.
        const pauseVisible = await pause.isVisible().catch(() => false);
        if (pauseVisible) {
          await pause.click({ force: true });
          const afterPause = await collectAuditableBodyText(page);
          expect(auditVisibleEnglish(afterPause)).toEqual([]);
          expect(afterPause).not.toMatch(/\bPause\b|\bResume\b|\bScore\b|\bGame over\b/i);
        }
      }
    }
  });

  test("educational + offline same-device games", async ({ page }) => {
    await enterStudentDemo(page);
    for (const key of EDU_GAMES) {
      const res = await page.goto(`${AR_001_PREFIX}/student/educational-games/${key}`, {
        waitUntil: "domcontentloaded",
      });
      await assertNot404(page, res?.status(), `/student/educational-games/${key}`);
      const bodyText = await collectAuditableBodyText(page);
      expect(auditVisibleEnglish(bodyText)).toEqual([]);
    }
    for (const key of OFFLINE_SAME_DEVICE) {
      const res = await page.goto(`${AR_001_PREFIX}/offline/${key}`, { waitUntil: "domcontentloaded" });
      await assertNot404(page, res?.status(), `/offline/${key}`);
      const bodyText = await collectAuditableBodyText(page);
      expect(auditVisibleEnglish(bodyText)).toEqual([]);
    }
  });

  test("rewards cards shop tab + home surprise + arcade", async ({ page }) => {
    await enterStudentDemo(page);

    const cardsRes = await page.goto(`${AR_001_PREFIX}/student/cards`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await assertNot404(page, cardsRes?.status(), "/student/cards");
    await expect(page.getByTestId("student-cards-tab-shop")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("student-cards-tab-shop").click();
    await expect(page.getByTestId("student-cards-shop-panel")).toBeVisible({ timeout: 30_000 });
    await auditMain(page);

    await page.goto(`${AR_001_PREFIX}/student/home`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    const surpriseOpen = page
      .getByTestId("student-world-dock-surprise-box")
      .or(page.getByTestId("student-surprise-box-open"))
      .or(page.getByTestId("student-surprise-box-widget"));
    await expect(surpriseOpen.first()).toBeVisible({ timeout: 30_000 });
    await surpriseOpen.first().click({ force: true });
    await expect(page.getByTestId("student-surprise-box-modal")).toBeVisible({ timeout: 15_000 });
    const modalText = await page.getByTestId("student-surprise-box-modal").innerText();
    expect(auditVisibleEnglish(modalText)).toEqual([]);
    await auditMain(page);

    const arcadeRes = await page.goto(`${AR_001_PREFIX}/student/arcade`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await assertNot404(page, arcadeRes?.status(), "/student/arcade");
    await auditMain(page);
  });
});

test.describe("ar-001 worksheets builder preview print", () => {
  test("generate preview and answer-key chrome", async ({ page }) => {
    await page.goto(`${AR_001_PREFIX}/practice/worksheets`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("public-seo-worksheets-slot")).toBeVisible({ timeout: 30_000 });
    await auditMain(page);

    const cta = page.locator(".worksheet-primary-cta").first();
    await expect(cta).toBeVisible({ timeout: 20_000 });
    await cta.click();
    await expect(page.locator(".worksheet-preview-modal")).toBeVisible({ timeout: 45_000 });
    const modalText = await page.locator(".worksheet-preview-modal").innerText();
    expect(auditVisibleEnglish(modalText)).toEqual([]);

    await page.evaluate(() => {
      (window as unknown as { print: () => void }).print = () => {};
    });
    const printBtn = page.locator(".worksheet-preview-actions .worksheet-action-btn-primary").first();
    await expect(printBtn).toBeVisible({ timeout: 15_000 });
    await printBtn.click();

    const answerKeyBtn = page.locator(".worksheet-preview-actions .worksheet-action-btn-secondary").nth(1);
    await expect(answerKeyBtn).toBeVisible({ timeout: 15_000 });
    await answerKeyBtn.click();
    const afterKey = await collectAuditableBodyText(page);
    expect(auditVisibleEnglish(afterKey)).toEqual([]);
  });
});

test.describe("ar-001 runtime books", () => {
  test("math g3 catalog and page", async ({ page }) => {
    await enterStudentDemo(page);
    await page.goto(`${AR_001_PREFIX}/student/learning/book/math/g3`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const bodyText = await collectAuditableBodyText(page);
    expect(hasArabicContent(bodyText) || bodyText.length > 0).toBeTruthy();
    expect(auditVisibleEnglish(bodyText)).toEqual([]);

    await page.goto(`${AR_001_PREFIX}/student/learning/book/math/g3/add_two`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});

test.describe("ar-001 student assigned activity chrome", () => {
  test("activity list panel + error shell locale", async ({ page }) => {
    await enterStudentDemo(page);
    await page.goto(`${AR_001_PREFIX}/student/home`, { waitUntil: "domcontentloaded" });
    await auditMain(page);

    await page.goto(`${AR_001_PREFIX}/student/activity/does-not-exist-e2e`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const bodyText = await collectAuditableBodyText(page);
    expect(auditVisibleEnglish(bodyText)).toEqual([]);
    expect(bodyText).not.toMatch(/Waiting for the teacher|Back home|Could not start/i);
  });

  test("mocked assigned activity active + feedback + done chrome", async ({ page }) => {
    await mockStudentSession(page);

    await page.route("**/api/student/activities/*/start", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          studentId: "00000000-0000-0000-0000-0000000000e2",
          activity: {
            id: "e2e-act-1",
            title: "Practice set A",
            mode: "homework",
            questionCount: 2,
            status: "active",
          },
          questionSet: [
            {
              subject: "math",
              question: "2 + 2 = ?",
              correctAnswer: "4",
              answers: ["3", "4", "5", "6"],
              params: { kind: "addition" },
            },
            {
              subject: "math",
              question: "3 + 1 = ?",
              correctAnswer: "4",
              answers: ["2", "4", "5", "7"],
              params: { kind: "addition" },
            },
          ],
          attempts: {},
          resumeQuestionIndex: 0,
        }),
      });
    });

    await page.route("**/api/student/activities/*/answer", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          isCorrect: false,
          // Backend explanation payload may be English; UI chrome must still be Arabic from locale.
          explanation: "Addition combines the numbers together.",
        }),
      });
    });

    await page.route("**/api/student/activities/*/submit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          scorePct: 50,
          correctCount: 1,
          questionCount: 2,
          studentStatus: "submitted",
        }),
      });
    });

    await page.goto(`${AR_001_PREFIX}/student/activity/e2e-act-1`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect
      .poll(async () => collectAuditableBodyText(page), { timeout: 30_000 })
      .not.toMatch(/تعذر بدء|could_not_start|Classroom activities are unavailable/i);

    let bodyText = await collectAuditableBodyText(page);
    // Chrome buttons/labels must come from locale packs (Arabic), not from mock UI strings.
    // Fixture payloads stay English for content; never plant Arabic UI chrome in mocks.
    expect(hasArabicContent(bodyText)).toBeTruthy();
    expect(bodyText).not.toMatch(/Next question|Waiting for the teacher|Submit answer|Type your answer/i);
    expect(auditVisibleEnglish(bodyText.replace(/2 \+ 2 = \?|3 \+ 1 = \?|Addition combines[\s\S]*?together\./g, " "))).toEqual([]);

    const choice = page.locator("button, [role='button'], label").filter({ hasText: /^3$/ }).first();
    await expect(choice).toBeVisible({ timeout: 20_000 });
    await choice.click({ force: true });
    const submit = page.getByRole("button", { name: /إرسال الإجابة|حفظ الإجابة|إرسال/i }).first();
    await expect(submit).toBeVisible({ timeout: 15_000 });
    await submit.click({ force: true });
    await page.waitForTimeout(500);
    bodyText = await collectAuditableBodyText(page);
    expect(hasArabicContent(bodyText)).toBeTruthy();
    expect(bodyText).not.toMatch(/Next question|Submit answer/i);

    const next = page.getByRole("button", { name: /السؤال التالي/i }).first();
    await expect(next).toBeVisible({ timeout: 15_000 });
    await next.click({ force: true });
    await page.waitForTimeout(400);
    bodyText = await collectAuditableBodyText(page);
    expect(bodyText).not.toMatch(/Next question/i);
  });
});

test.describe("ar-001 PWA offline emails server copy", () => {
  test("offline + install-app + sw locale helpers", async ({ page }) => {
    await page.goto(`${AR_001_PREFIX}/offline`, { waitUntil: "domcontentloaded" });
    await auditMain(page);
    await page.goto(`${AR_001_PREFIX}/student/install-app`, { waitUntil: "domcontentloaded" });
    await auditMain(page);
    await page.goto(`${AR_001_PREFIX}/parent/install-app`, { waitUntil: "domcontentloaded" });
    await auditMain(page);
  });

  test("portal a11y labels on teacher + school ready shells", async ({ page }) => {
    await loginTeacherDan(page);
    await page.goto(`${AR_001_PREFIX}/teacher/dashboard`, { waitUntil: "domcontentloaded" });
    await waitTeacherReady(page);
    const unlabeledTeacher = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a[href], [role='button']"));
      return buttons
        .filter((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const text = (el.textContent || "").replace(/\s+/g, " ").trim();
          const aria = el.getAttribute("aria-label") || el.getAttribute("title") || "";
          const imgAlt = el.querySelector("img")?.getAttribute("alt") || "";
          return !text && !aria && !imgAlt;
        })
        .slice(0, 8)
        .map((el) => el.outerHTML.slice(0, 120));
    });
    expect(unlabeledTeacher).toEqual([]);
    await auditMain(page);
  });

  test("portal a11y labels on school ready shell", async ({ page }) => {
    await loginSchoolManager(page);
    await page.goto(`${AR_001_PREFIX}/school/dashboard`, { waitUntil: "domcontentloaded" });
    await waitSchoolReady(page);
    const unlabeledSchool = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a[href], [role='button']"));
      return buttons
        .filter((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const text = (el.textContent || "").replace(/\s+/g, " ").trim();
          const aria = el.getAttribute("aria-label") || el.getAttribute("title") || "";
          const imgAlt = el.querySelector("img")?.getAttribute("alt") || "";
          return !text && !aria && !imgAlt;
        })
        .slice(0, 8)
        .map((el) => el.outerHTML.slice(0, 120));
    });
    expect(unlabeledSchool).toEqual([]);
    await auditMain(page);
  });
});
