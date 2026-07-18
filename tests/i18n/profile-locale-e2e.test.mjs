import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureGlobalProductMembership,
  normalizeMembershipLocale,
  updateGlobalProductMembershipLocales,
} from "../../lib/global/product-membership.server.js";
import { resolveInterfaceLocale, resolveReportLocale } from "../../lib/i18n/locale-resolution.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";

test("normalizeMembershipLocale: enabled pseudo locales pass through, disabled fall back to en", () => {
  assert.equal(normalizeMembershipLocale("en-XA"), "en-XA");
  assert.equal(normalizeMembershipLocale("ar-XB"), "ar-XB");
  assert.equal(normalizeMembershipLocale("he"), "en");
  assert.equal(normalizeMembershipLocale("invalid-locale"), "en");
  assert.equal(normalizeMembershipLocale(null, "en-XA"), "en-XA");
});

test("interface locale change preserves report locale when report choice is explicit", async () => {
  const rows = new Map();
  const userId = "user-explicit-report";
  const productId = "leokids_global";

  const db = buildMembershipMockDb(rows, productId);

  await updateGlobalProductMembershipLocales(db, userId, {
    interfaceLanguage: "en",
    preferredReportLanguage: "en-XA",
  });

  const interfaceOnly = await updateGlobalProductMembershipLocales(db, userId, {
    interfaceLanguage: "ar-XB",
  });
  assert.equal(interfaceOnly.ok, true);
  assert.equal(interfaceOnly.membership.interface_language, "ar-XB");
  assert.equal(interfaceOnly.membership.preferred_report_language, "en-XA");
});

test("interface locale change syncs report locale when only interface was set", async () => {
  const rows = new Map();
  const userId = "user-sync-report";
  const productId = "leokids_global";
  const db = buildMembershipMockDb(rows, productId);

  await ensureGlobalProductMembership(db, userId, { initialInterfaceLanguage: "en" });

  const both = await updateGlobalProductMembershipLocales(db, userId, {
    interfaceLanguage: "en-XA",
    preferredReportLanguage: "en-XA",
  });
  assert.equal(both.ok, true);
  assert.equal(both.membership.interface_language, "en-XA");
  assert.equal(both.membership.preferred_report_language, "en-XA");
});

function buildMembershipMockDb(rows, productId) {
  return {
    rpc: async () => ({ error: { message: "function not found" } }),
    from(table) {
      if (table !== "user_product_memberships") throw new Error(`unexpected table ${table}`);
      const state = { filters: {} };
      const api = {
        select() {
          return api;
        },
        eq(col, val) {
          state.filters[col] = val;
          return api;
        },
        maybeSingle: async () => {
          const row = rows.get(`${state.filters.user_id}:${state.filters.product_id}`);
          return { data: row || null, error: null };
        },
        update(patch) {
          return {
            eq(_c1, uid) {
              return {
                eq(_c2, pid) {
                  return {
                    eq(_c3, status) {
                      const key = `${uid}:${pid}`;
                      const existing = rows.get(key);
                      if (existing && status === "active") {
                        rows.set(key, { ...existing, ...patch });
                      }
                      return Promise.resolve({ error: null });
                    },
                  };
                },
              };
            },
          };
        },
        insert(row) {
          return {
            select() {
              return this;
            },
            maybeSingle: async () => {
              rows.set(`${row.user_id}:${productId}`, row);
              return { data: row, error: null };
            },
          };
        },
      };
      return api;
    },
  };
}

test("ensureGlobalProductMembership preserveExistingLanguages does not overwrite stored locale", async () => {
  const rows = new Map();
  const userId = "user-preserve-locale";
  const productId = "leokids_global";

  const db = buildMembershipMockDb(rows, productId);

  const created = await ensureGlobalProductMembership(db, userId, {
    initialInterfaceLanguage: "en",
  });
  assert.equal(created.ok, true);

  const updated = await updateGlobalProductMembershipLocales(db, userId, {
    interfaceLanguage: "en-XA",
    preferredReportLanguage: "ar-XB",
  });
  assert.equal(updated.ok, true);
  assert.equal(updated.membership.interface_language, "en-XA");

  const loginAgain = await ensureGlobalProductMembership(db, userId, {
    preserveExistingLanguages: true,
  });
  assert.equal(loginAgain.ok, true);
  assert.equal(loginAgain.membership.interface_language, "en-XA");
  assert.equal(loginAgain.membership.preferred_report_language, "ar-XB");
});

test("profile locale resolution chain: URL > profile > cookie > Accept-Language > en", () => {
  const cookieEnXa = serializeLocaleCookie("en-XA").split(";")[0];
  const profile = "ar-XB";

  assert.equal(
    resolveInterfaceLocale({
      asPath: "/en-XA/parent/dashboard",
      profileInterfaceLocale: profile,
      cookieHeader: cookieEnXa,
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "en-XA"
  );

  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: profile,
      cookieHeader: cookieEnXa,
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "ar-XB"
  );

  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: null,
      cookieHeader: cookieEnXa,
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "en-XA"
  );

  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "en"
  );
});

test("report locale stays independent from interface locale when preferred_report_language is set", () => {
  assert.equal(
    resolveReportLocale({
      preferredReportLanguage: "ar-XB",
      interfaceLocale: "en-XA",
    }),
    "ar-XB"
  );
  assert.equal(
    resolveReportLocale({
      interfaceLocale: "en-XA",
    }),
    "en-XA"
  );
});

test("invalid or disabled profile locale falls back through chain", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: "he",
      cookieHeader: serializeLocaleCookie("en-XA").split(";")[0],
    }),
    "en-XA"
  );
});
