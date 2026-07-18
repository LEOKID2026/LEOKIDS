import test from "node:test";
import assert from "node:assert/strict";
import { buildPwaCacheKey, resolvePwaStartUrl } from "../../lib/pwa/pwa-locale.js";

test("buildPwaCacheKey isolates caches per locale", () => {
  assert.equal(buildPwaCacheKey("en", "dynamic-v2"), "lk-global-en-dynamic-v2");
  assert.equal(buildPwaCacheKey("en-XA", "dynamic-v2"), "lk-global-en-XA-dynamic-v2");
  assert.equal(buildPwaCacheKey("ar-XB", "dynamic-v2"), "lk-global-ar-XB-dynamic-v2");
  assert.notEqual(
    buildPwaCacheKey("en", "dynamic-v2"),
    buildPwaCacheKey("ar-XB", "dynamic-v2")
  );
});

test("resolvePwaStartUrl prefixes non-default locales", () => {
  assert.equal(resolvePwaStartUrl("en", "/parent/login"), "/parent/login");
  assert.equal(resolvePwaStartUrl("ar-XB", "/parent/login"), "/ar-XB/parent/login");
});
