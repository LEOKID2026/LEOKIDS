/**
 * Patch deep-runtime e2e helpers: correct parent-demo key, persona isolation,
 * hard rewards assertions, report ready marker, game gameplay markers.
 */
import fs from "node:fs";

const p = "tests/e2e/ar-001-deep-runtime-audit.spec.ts";
let s = fs.readFileSync(p, "utf8");

s = s.replace(
  'const PARENT_DEMO_SESSION_KEY = "leokids_parent_demo_session";',
  'const PARENT_DEMO_SESSION_KEY = "leokids_global_parent_demo_session";\nconst STUDENT_DEMO_SESSION_KEY = "leokids_global_demo_session";'
);

const clearPersona = `
async function clearPersonaSessions(page: Page) {
  await page.goto(\`\${AR_001_PREFIX}/\`, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ([parentKey, studentKey]) => {
      localStorage.removeItem(parentKey);
      localStorage.removeItem(studentKey);
      sessionStorage.clear();
    },
    [PARENT_DEMO_SESSION_KEY, STUDENT_DEMO_SESSION_KEY]
  );
}
`;

if (!s.includes("clearPersonaSessions")) {
  s = s.replace(
    "async function enterParentDemo(page: Page) {",
    clearPersona + "\nasync function enterParentDemo(page: Page) {"
  );
}

s = s.replace(
  /async function enterParentDemo\(page: Page\) \{[\s\S]*?\n\}/,
  `async function enterParentDemo(page: Page) {
  await clearPersonaSessions(page);
  await page.goto(\`\${AR_001_PREFIX}/demo/parent/enter\`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.evaluate((key) => localStorage.removeItem(key), PARENT_DEMO_SESSION_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByTestId("parent-demo-enter-button").click();
  await page.waitForURL(\`**\${AR_001_PREFIX}/parent/dashboard**\`, { timeout: 30_000 });
}`
);

s = s.replace(
  /async function enterStudentDemo\(page: Page, grade = "g3"\) \{[\s\S]*?\n\}/,
  `async function enterStudentDemo(page: Page, grade = "g3") {
  await clearPersonaSessions(page);
  await page.goto(\`\${AR_001_PREFIX}/demo/enter?grade=\${grade}\`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.waitForURL(\`**\${AR_001_PREFIX}/student/home**\`, { timeout: 30_000 });
}`
);

// Replace rewards test
const rewardsOld = /test\("rewards cards shop tab \+ home surprise \+ arcade", async \(\{ page \}\) => \{[\s\S]*?\n  \}\);\n\}\);/;
const rewardsNew = `test("rewards cards shop tab + home surprise + arcade", async ({ page }) => {
    await enterStudentDemo(page);

    await page.route("**/api/student/rewards/surprise-box/status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, ready: true, pendingBoxCount: 1, secondsRemaining: null }),
      });
    });
    await page.route("**/api/demo/**/surprise-box/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, ready: true, pendingBoxCount: 1 }),
      });
    });
    await page.route("**/api/student/rewards/surprise-box/open", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          cards: [{ id: "e2e-card", rarity: "common", isNew: true }],
        }),
      });
    });

    const cardsRes = await page.goto(\`\${AR_001_PREFIX}/student/cards\`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    expect(cardsRes?.status() ?? 0).toBeLessThan(400);
    await expect(page.getByTestId("student-cards-tab-shop")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("student-cards-tab-shop").click();
    await expect(page.getByTestId("student-cards-tab-shop")).toBeVisible();
    await auditMain(page);

    await page.goto(\`\${AR_001_PREFIX}/student/home\`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await expect(page.getByTestId("student-surprise-box-widget")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("student-surprise-box-open")).toBeVisible();
    await page.getByTestId("student-surprise-box-open").click({ force: true });
    await expect(page.getByTestId("student-surprise-box-modal")).toBeVisible({ timeout: 15_000 });
    await auditMain(page);

    const arcadeRes = await page.goto(\`\${AR_001_PREFIX}/student/arcade\`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    expect(arcadeRes?.status() ?? 0).toBeLessThan(400);
    await auditMain(page);
  });
});`;

if (rewardsOld.test(s)) {
  s = s.replace(rewardsOld, rewardsNew);
  console.log("rewards test replaced");
} else {
  console.log("rewards test pattern MISS");
}

// Parent report ready assertion - find and harden
s = s.replace(
  /await page\.goto\(\s*`\$\{AR_001_PREFIX\}\/parent\/parent-report-detailed\?studentId=\$\{encodeURIComponent\(DEMO_CHILD_ID\)\}&source=parent&period=week`,\s*\{ waitUntil: "domcontentloaded" \}\s*\);\s*await expect\(page\.locator\("html"\)\)\.toHaveAttribute\("dir", "rtl"\);\s*await auditMain\(page\);/,
  `await page.goto(
      \\\`\\\${AR_001_PREFIX}/parent/parent-report-detailed?studentId=\\\${encodeURIComponent(DEMO_CHILD_ID)}&source=parent&period=week\\\`,
      { waitUntil: "domcontentloaded" }
    );
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect
      .poll(async () => page.getByText(/جارٍ تحميل|Loading/i).count(), { timeout: 60_000 })
      .toBe(0);
    await expect(
      page.getByText(/التغطية|المواد|وقت|دقة|أسئلة|تغطية|Coverage|Subjects/i).first()
    ).toBeVisible({ timeout: 60_000 });
    await auditMain(page);`
);

fs.writeFileSync(p, s);
console.log("deep audit patched");
