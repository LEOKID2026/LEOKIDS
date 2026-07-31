/**
 * SSR locale shell verification against a production Next server.
 *
 * Contract: asserts lang/dir on real HTML shells. Starts `next start` itself when
 * BROWSER_QA_BASE is unset or unreachable (does not skip assertions).
 */
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PORT = Number(process.env.SSR_LOCALE_SHELL_PORT || 3017);
const DEFAULT_BASE = `http://127.0.0.1:${PORT}`;
const EXTERNAL_BASE = process.env.BROWSER_QA_BASE || "";

/** @typedef {{ path: string, cookie?: string, expectLang: string, expectDir: string }} LocaleCase */

/** @type {LocaleCase[]} */
const CASES = [
  { path: "/", expectLang: "en", expectDir: "ltr" },
  { path: "/en-XA/", expectLang: "en-XA", expectDir: "ltr" },
  { path: "/ar-XB/", expectLang: "ar-XB", expectDir: "rtl" },
  { path: "/en-XA/parents", expectLang: "en-XA", expectDir: "ltr" },
  { path: "/ar-XB/games", expectLang: "ar-XB", expectDir: "rtl" },
  {
    path: "/",
    cookie: "lk_global_locale=ar-XB",
    expectLang: "ar-XB",
    expectDir: "rtl",
  },
  {
    path: "/ar-XB/",
    cookie: "lk_global_locale=en",
    expectLang: "ar-XB",
    expectDir: "rtl",
  },
];

/** @type {import('node:child_process').ChildProcess | null} */
let startedServer = null;
/** @type {string} */
let base = EXTERNAL_BASE || DEFAULT_BASE;

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function probe(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.status > 0;
  } catch {
    return false;
  }
}

async function waitUntilReady(url, timeoutMs = 90_000) {
  const start = Date.now();
  let lastErr = "";
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.status > 0) return;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
    await sleep(500);
  }
  throw new Error(`SSR locale shell server not ready at ${url}: ${lastErr || "timeout"}`);
}

async function ensureServer() {
  if (EXTERNAL_BASE) {
    const ok = await probe(EXTERNAL_BASE);
    if (!ok) {
      throw new Error(
        `BROWSER_QA_BASE=${EXTERNAL_BASE} is set but unreachable. Start the server or unset BROWSER_QA_BASE.`
      );
    }
    base = EXTERNAL_BASE;
    return;
  }

  if (await probe(DEFAULT_BASE)) {
    base = DEFAULT_BASE;
    return;
  }

  const nextDir = path.join(ROOT, ".next");
  if (!fs.existsSync(nextDir)) {
    throw new Error(
      "SSR locale shell: no .next build found. Run `npx next build` before this suite (or set BROWSER_QA_BASE)."
    );
  }

  const nextCli = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
  if (!fs.existsSync(nextCli)) {
    throw new Error(`SSR locale shell: next CLI not found at ${nextCli}`);
  }

  startedServer = spawn(
    process.execPath,
    [nextCli, "start", "-H", "127.0.0.1", "-p", String(PORT)],
    {
      cwd: ROOT,
      env: { ...process.env, PORT: String(PORT) },
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      windowsHide: true,
    }
  );

  let stderr = "";
  startedServer.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
  });
  startedServer.on("exit", (code, signal) => {
    if (startedServer) {
      startedServer = null;
      if (code && code !== 0) {
        console.error(`[ssr-locale-shell] next start exited code=${code} signal=${signal}\n${stderr.slice(-2000)}`);
      }
    }
  });

  try {
    await waitUntilReady(DEFAULT_BASE);
  } catch (err) {
    stopServer();
    throw new Error(`${err.message}\n--- next start stderr ---\n${stderr.slice(-2000)}`);
  }
  base = DEFAULT_BASE;
}

function stopServer() {
  if (!startedServer) return;
  const child = startedServer;
  startedServer = null;
  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/f", "/t"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  } catch {
    /* ignore */
  }
}

/**
 * @param {LocaleCase} c
 */
async function fetchHtmlShell(c) {
  const headers = {};
  if (c.cookie) headers.Cookie = c.cookie;
  const res = await fetch(`${base}${c.path}`, { redirect: "follow", headers });
  const html = await res.text();
  const langMatch = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
  const dirMatch = html.match(/<html[^>]*\sdir=["']([^"']+)["']/i);
  return {
    status: res.status,
    lang: langMatch?.[1] || "",
    dir: dirMatch?.[1] || "",
    htmlSnippet: html.slice(0, 400),
  };
}

before(async () => {
  await ensureServer();
});

after(() => {
  stopServer();
});

for (const c of CASES) {
  test(`SSR locale shell ${c.path}${c.cookie ? " (cookie override)" : ""}`, async () => {
    const shell = await fetchHtmlShell(c);
    assert.equal(shell.status, 200, `expected 200 for ${c.path}`);
    assert.equal(
      shell.lang,
      c.expectLang,
      `lang mismatch for ${c.path}: got "${shell.lang}" expected "${c.expectLang}"`
    );
    assert.equal(
      shell.dir,
      c.expectDir,
      `dir mismatch for ${c.path}: got "${shell.dir}" expected "${c.expectDir}"`
    );
    assert.doesNotMatch(shell.htmlSnippet, /data-reactroot.*data-reactroot/i, "unexpected duplicate react root");
  });
}

test("invalid locale prefix falls back without 500", async () => {
  const res = await fetch(`${base}/zz-ZZ/`, { redirect: "manual" });
  assert.ok(res.status === 200 || res.status === 302 || res.status === 308);
});
