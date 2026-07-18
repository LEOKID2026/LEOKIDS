/**
 * SSR locale shell verification against production server.
 * Run after: npm run build && npm run start
 */
import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.BROWSER_QA_BASE || "http://localhost:3000";

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

for (const c of CASES) {
  test(`SSR locale shell ${c.path}${c.cookie ? " (cookie override)" : ""}`, async () => {
    let shell;
    try {
      shell = await fetchHtmlShell(c);
    } catch (err) {
      if (process.env.SKIP_SSR_TESTS === "1") {
        return;
      }
      throw err;
    }

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
