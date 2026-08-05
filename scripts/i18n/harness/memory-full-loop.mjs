/**
 * ar-001 Memory full-loop audit harness
 *
 * Path: start → gameplay → completion → interstitial → skip/continue → finish → retry
 *
 * Stability strategy (no product mutation, no soft skip):
 * - Deterministic pair matching via face-up image src (not random clicks)
 * - Waits bound to product MISMATCH_HOLD_MS (1200) + interstitial duration (5000)
 * - Uses existing data-testid markers only
 * - Skip button is the product interstitial continue path (not an audit soft-skip)
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 node scripts/i18n/harness/memory-full-loop.mjs
 *
 * Requires: playwright (devDependency), running Next server, demo student session path.
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const OUT = join(ROOT, "artifacts/i18n/ar-001-memory-full-loop-proof.json");

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const LOCALE_Q = "locale=ar-001";
const MISMATCH_HOLD_MS = 1200;
const INTERSTITIAL_MAX_MS = 6000;
const GAMEPLAY_DEADLINE_MS = 180000;
const CARD_BACK_RE = /card_back/i;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForMemoryReady(page, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ready = await page
      .locator('[data-testid="memory-gameplay"]')
      .getAttribute("data-memory-ready")
      .catch(() => null);
    if (ready === "1") return true;
    await sleep(250);
  }
  return false;
}

async function readCardSrc(page, index) {
  return page.evaluate((i) => {
    const root = document.querySelector('[data-testid="memory-gameplay"]');
    if (!root) return null;
    const btn = root.querySelectorAll("button")[i];
    if (!btn) return null;
    const img = btn.querySelector("img");
    return img?.getAttribute("src") || null;
  }, index);
}

async function isCardInteractive(page, index) {
  return page.evaluate((i) => {
    const root = document.querySelector('[data-testid="memory-gameplay"]');
    if (!root) return false;
    const btn = root.querySelectorAll("button")[i];
    if (!btn) return false;
    if (btn.disabled) return false;
    // matched cards get emerald border; still clickable but noop — prefer unmatched face-down
    const img = btn.querySelector("img");
    const src = img?.getAttribute("src") || "";
    const faceDown = /card_back/i.test(src);
    const matched = btn.className.includes("border-emerald");
    return faceDown && !matched;
  }, index);
}

async function clickCard(page, index) {
  await page.evaluate((i) => {
    const root = document.querySelector('[data-testid="memory-gameplay"]');
    const btn = root?.querySelectorAll("button")?.[i];
    if (btn) btn.click();
  }, index);
  await sleep(180);
}

async function cardCount(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-testid="memory-gameplay"]');
    return root ? root.querySelectorAll("button").length : 0;
  });
}

/**
 * Deterministic memory solve: learn face-up srcs, match known pairs, explore unknowns.
 */
async function playUntilComplete(page) {
  const known = new Map(); // index -> src
  const matched = new Set();
  const deadline = Date.now() + GAMEPLAY_DEADLINE_MS;
  let flips = 0;

  while (Date.now() < deadline) {
    if (await page.getByTestId("memory-complete").count().then((n) => n > 0).catch(() => false)) {
      return { ok: true, flips, reason: "memory-complete" };
    }

    const n = await cardCount(page);
    if (n <= 0) {
      await sleep(300);
      continue;
    }

    // Prefer completing a known unmatched pair
    const bySrc = new Map();
    for (const [idx, src] of known.entries()) {
      if (matched.has(idx)) continue;
      if (!(await isCardInteractive(page, idx))) continue;
      if (!bySrc.has(src)) bySrc.set(src, []);
      bySrc.get(src).push(idx);
    }
    let pair = null;
    for (const idxs of bySrc.values()) {
      if (idxs.length >= 2) {
        pair = [idxs[0], idxs[1]];
        break;
      }
    }

    if (pair) {
      await clickCard(page, pair[0]);
      await clickCard(page, pair[1]);
      flips += 2;
      matched.add(pair[0]);
      matched.add(pair[1]);
      await sleep(400);
      continue;
    }

    // Explore next unknown face-down card
    let first = -1;
    for (let i = 0; i < n; i++) {
      if (matched.has(i)) continue;
      if (!(await isCardInteractive(page, i))) continue;
      first = i;
      break;
    }
    if (first < 0) {
      await sleep(300);
      continue;
    }

    await clickCard(page, first);
    flips += 1;
    const src1 = await readCardSrc(page, first);
    if (src1 && !CARD_BACK_RE.test(src1)) known.set(first, src1);

    // If we already know a mate, click it
    let mate = -1;
    if (src1 && !CARD_BACK_RE.test(src1)) {
      for (const [idx, src] of known.entries()) {
        if (idx === first || matched.has(idx)) continue;
        if (src === src1 && (await isCardInteractive(page, idx))) {
          mate = idx;
          break;
        }
      }
    }

    if (mate >= 0) {
      await clickCard(page, mate);
      flips += 1;
      matched.add(first);
      matched.add(mate);
      await sleep(400);
      continue;
    }

    // Flip a second explorer card
    let second = -1;
    for (let i = 0; i < n; i++) {
      if (i === first || matched.has(i)) continue;
      if (!(await isCardInteractive(page, i))) continue;
      second = i;
      break;
    }
    if (second < 0) {
      await sleep(MISMATCH_HOLD_MS + 100);
      continue;
    }

    await clickCard(page, second);
    flips += 1;
    const src2 = await readCardSrc(page, second);
    if (src2 && !CARD_BACK_RE.test(src2)) known.set(second, src2);

    if (src1 && src2 && src1 === src2 && !CARD_BACK_RE.test(src1)) {
      matched.add(first);
      matched.add(second);
      await sleep(400);
    } else {
      // Product holds mismatch for MISMATCH_HOLD_MS — wait full duration (no soft skip)
      await sleep(MISMATCH_HOLD_MS + 150);
    }
  }

  return { ok: false, flips, reason: "gameplay_deadline" };
}

async function handleInterstitial(page) {
  const deadline = Date.now() + INTERSTITIAL_MAX_MS + 2000;
  let sawInterstitial = false;
  let skipped = false;

  while (Date.now() < deadline) {
    const skipBtn = page.getByRole("button", { name: /^Skip$/i });
    if (await skipBtn.isVisible().catch(() => false)) {
      sawInterstitial = true;
      await skipBtn.click({ force: true }).catch(() => skipBtn.evaluate((el) => el.click()));
      skipped = true;
      await sleep(400);
      break;
    }
    // Interstitial may auto-complete after DEFAULT_DURATION_MS (5000)
    const body = await page.locator("body").innerText().catch(() => "");
    if (/Great job|Game over|Calculating your score/i.test(body)) {
      sawInterstitial = true;
    }
    // Finish screen durable marker (after interstitial unmounts)
    const finishComplete = await page
      .locator('[data-testid="memory-complete"]')
      .locator("xpath=ancestor::div[contains(@class,'flex-1')]")
      .count()
      .catch(() => 0);
    if (
      (await page.getByTestId("memory-retry").count().catch(() => 0)) > 0 &&
      !(await skipBtn.isVisible().catch(() => false))
    ) {
      break;
    }
    void finishComplete;
    await sleep(200);
  }

  // Allow product timer path if Skip not clicked
  if (!skipped && sawInterstitial) {
    await sleep(INTERSTITIAL_MAX_MS);
  }

  return { sawInterstitial, skipped };
}

async function enterDemoAndOpenMemory(page) {
  await page.goto(`${BASE_URL}/demo/enter?${LOCALE_Q}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(800);

  // Best-effort demo enter click (button copy/locale may vary)
  const enterCandidates = [
    page.getByTestId("demo-enter-button"),
    page.getByTestId("student-demo-enter-button"),
    page.getByRole("button", { name: /enter||ابدأ|demo/i }),
  ];
  for (const loc of enterCandidates) {
    if (await loc.first().isVisible().catch(() => false)) {
      await loc.first().click({ force: true }).catch(() => loc.first().evaluate((el) => el.click()));
      break;
    }
  }
  await sleep(1200);

  await page.goto(`${BASE_URL}/student/solo-games/memory?${LOCALE_Q}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await sleep(1000);

  // Easy = first difficulty chip (SOLO_DIFFICULTY_OPTIONS[0])
  await page.evaluate(() => {
    const chips = [...document.querySelectorAll("button")].filter((b) => {
      const t = (b.innerText || "").trim();
      return t.length > 0 && t.length < 24 && !/start|ابدأ|loading|تحميل/i.test(t);
    });
    // Prefer known easy labels across locales; else first short chip in entry area
    const easy = chips.find((b) => /سهل|easy|/i.test(b.innerText || ""));
    (easy || chips[0])?.click();
  });
  await sleep(300);

  // Start = primary CTA on entry (first full-width primary button text contains start)
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const start = btns.find((b) => /ابدأ اللعبة|start game|start/i.test(b.innerText || ""));
    if (start) start.click();
    else {
      // Fallback: largest primary-looking button in main
      const mainBtns = [...document.querySelectorAll("main button")];
      mainBtns[0]?.click();
    }
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const proof = {
    ok: false,
    locale: "ar-001",
    route: "/student/solo-games/memory",
    path: "start → gameplay → completion → interstitial → skip/continue → finish → retry",
    generatedAt: new Date().toISOString(),
    steps: {},
    errors: [],
  };

  try {
    await enterDemoAndOpenMemory(page);
    proof.steps.entry_navigated = true;

    const ready = await waitForMemoryReady(page, 90000);
    proof.steps.gameplay_ready = ready;
    if (!ready) throw new Error("memory-gameplay data-memory-ready!=1");

    const play = await playUntilComplete(page);
    proof.steps.completion = play;
    if (!play.ok) throw new Error(`gameplay did not complete: ${play.reason}`);

    const interstitial = await handleInterstitial(page);
    proof.steps.interstitial = interstitial;

    // Finish screen
    const finishDeadline = Date.now() + 20000;
    let finishReady = false;
    while (Date.now() < finishDeadline) {
      const retryVisible = await page.getByTestId("memory-retry").count().then((n) => n > 0);
      const completeVisible = await page.getByTestId("memory-complete").count().then((n) => n > 0);
      if (retryVisible && completeVisible) {
        finishReady = true;
        break;
      }
      await sleep(250);
    }
    proof.steps.finish = { ready: finishReady };
    if (!finishReady) throw new Error("finish markers memory-complete/memory-retry not ready");

    // Retry → back to entry (or new session)
    await page.getByTestId("memory-retry").first().click({ force: true }).catch(async () => {
      await page.evaluate(() => document.querySelector('[data-testid="memory-retry"]')?.click());
    });
    await sleep(800);

    const backToEntry = await page.evaluate(() => {
      const text = document.body?.innerText || "";
      return /ابدأ اللعبة|start game|choose_difficulty|اختر/i.test(text) ||
        [...document.querySelectorAll("button")].some((b) => /ابدأ اللعبة|start game/i.test(b.innerText || ""));
    });
    proof.steps.retry = { clicked: true, entryVisible: backToEntry };
    if (!backToEntry) {
      // Also accept immediate re-autoStart gameplay ready as retry success
      const again = await waitForMemoryReady(page, 15000);
      proof.steps.retry.gameplayReadyAgain = again;
      if (!again) throw new Error("retry did not return to entry or gameplay");
    }

    proof.ok = true;
  } catch (err) {
    proof.errors.push(String(err?.message || err));
    proof.ok = false;
  } finally {
    await browser.close().catch(() => {});
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, `${JSON.stringify(proof, null, 2)}\n`, "utf8");
    console.log(`memory full-loop proof → ${OUT}`);
    console.log(proof.ok ? "OK" : "FAIL", proof.errors);
  }

  process.exit(proof.ok ? 0 : 1);
}

main();
