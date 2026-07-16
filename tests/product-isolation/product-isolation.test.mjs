/**
 * Product isolation unit tests (v3) — no Supabase production writes.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getServerProductId,
  resolveTrustedProductId,
  isLeoProductId,
  PRODUCT_GLOBAL,
  PRODUCT_IL,
} from "../../lib/global/product-context.server.js";
import {
  isGlobalDataWritesEnabled,
  isGlobalMockModeEnabled,
} from "../../lib/global/write-barrier.js";
import { GUEST_SYSTEM_PARENT_EMAIL, GUEST_SYSTEM_PARENT_EMAIL_IL } from "../../lib/guest/constants.js";
import {
  PRODUCT_PARENT_ACCOUNT_SETTINGS_TABLE,
  PRODUCT_GUEST_MODE_SETTINGS_TABLE,
} from "../../lib/global/product-settings.server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

function mockDb(handlers) {
  return {
    rpc: async (name, args) =>
      handlers.rpc?.(name, args) ?? { data: null, error: { message: "missing", code: "PGRST202" } },
    from(table) {
      const api = {
        _table: table,
        select() {
          return api;
        },
        eq() {
          return api;
        },
        in() {
          return api;
        },
        maybeSingle: async () => handlers.maybeSingle?.(table) ?? { data: null, error: null },
        insert(row) {
          return {
            select() {
              return {
                maybeSingle: async () => handlers.insert?.(table, row) ?? { data: row, error: null },
                single: async () => handlers.insert?.(table, row) ?? { data: row, error: null },
              };
            },
          };
        },
        update(patch) {
          return {
            eq() {
              return {
                eq() {
                  return {
                    eq: async () => handlers.update?.(table, patch) ?? { error: null },
                  };
                },
              };
            },
          };
        },
        upsert(row) {
          return {
            select() {
              return {
                single: async () => handlers.upsert?.(table, row) ?? { data: row, error: null },
              };
            },
          };
        },
      };
      return api;
    },
  };
}

async function testProductContext() {
  assert.equal(getServerProductId(), PRODUCT_GLOBAL);
  assert.equal(resolveTrustedProductId("leokids_il"), PRODUCT_GLOBAL);
  assert.ok(isLeoProductId(PRODUCT_IL));
}

async function testWriteBarrierDefault() {
  const prevW = process.env.GLOBAL_DATA_WRITES_ENABLED;
  const prevM = process.env.GLOBAL_MOCK_MODE;
  delete process.env.GLOBAL_DATA_WRITES_ENABLED;
  delete process.env.GLOBAL_MOCK_MODE;
  assert.equal(isGlobalDataWritesEnabled(), false);
  assert.equal(isGlobalMockModeEnabled(), true);
  if (prevW !== undefined) process.env.GLOBAL_DATA_WRITES_ENABLED = prevW;
  else delete process.env.GLOBAL_DATA_WRITES_ENABLED;
  if (prevM !== undefined) process.env.GLOBAL_MOCK_MODE = prevM;
  else delete process.env.GLOBAL_MOCK_MODE;
}

async function testMembershipDoesNotReactivateSuspended() {
  const { ensureGlobalProductMembership } = await import(
    "../../lib/global/product-membership.server.js"
  );
  const db = mockDb({
    rpc: async () => ({
      data: null,
      error: { message: "membership suspended for user", code: "P0001" },
    }),
    maybeSingle: async () => ({
      data: { user_id: "u1", product_id: PRODUCT_GLOBAL, status: "suspended" },
      error: null,
    }),
  });
  const result = await ensureGlobalProductMembership(db, "u1", { interfaceLanguage: "en" });
  assert.equal(result.ok, false);
  assert.equal(result.error, "product_membership_suspended");
}

async function testMembershipCreatesGlobalOnly() {
  const { ensureGlobalProductMembership } = await import(
    "../../lib/global/product-membership.server.js"
  );
  const inserts = [];
  const db = mockDb({
    rpc: async () => ({ data: null, error: { message: "no rpc", code: "42883" } }),
    maybeSingle: async () => ({ data: null, error: null }),
    insert: async (_t, row) => {
      inserts.push(row);
      return { data: row, error: null };
    },
  });
  // When RPC missing with non-schema error, falls through — use schema missing on insert path
  const db2 = mockDb({
    rpc: async () => ({
      data: { user_id: "u1", product_id: PRODUCT_GLOBAL, status: "active" },
      error: null,
    }),
  });
  const ok = await ensureGlobalProductMembership(db2, "u1", {
    interfaceLanguage: "en",
    productId: PRODUCT_IL, // must be ignored
  });
  assert.equal(ok.ok, true);
  assert.equal(ok.productId, PRODUCT_GLOBAL);
}

async function testOwnedStudentProductGate() {
  const { loadOwnedGlobalStudent } = await import("../../lib/global/product-student.server.js");
  const miss = await loadOwnedGlobalStudent(
    mockDb({ maybeSingle: async () => ({ data: null, error: null }) }),
    { studentId: "s-il", parentUserId: "p1" }
  );
  assert.equal(miss.ok, false);

  const hit = await loadOwnedGlobalStudent(
    mockDb({
      maybeSingle: async () => ({
        data: { id: "s-g", parent_id: "p1", product_id: PRODUCT_GLOBAL },
        error: null,
      }),
    }),
    { studentId: "s-g", parentUserId: "p1" }
  );
  assert.equal(hit.ok, true);
}

async function testProductSettingsTables() {
  assert.equal(PRODUCT_PARENT_ACCOUNT_SETTINGS_TABLE, "product_parent_account_settings");
  assert.equal(PRODUCT_GUEST_MODE_SETTINGS_TABLE, "product_guest_mode_settings");

  const { loadParentAccountSettings } = await import("../../lib/auth/persona-entitlement.server.js");
  let usedTable = null;
  const db = {
    from(table) {
      usedTable = table;
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        maybeSingle: async () => ({ data: null, error: null }),
      };
    },
  };
  await loadParentAccountSettings(db, "p1");
  assert.equal(usedTable, "product_parent_account_settings");

  const guestSrc = fs.readFileSync(path.join(root, "lib", "guest", "guest-settings.server.js"), "utf8");
  assert.match(guestSrc, /product_guest_mode_settings/);
  assert.doesNotMatch(guestSrc, /\.from\(\s*["']guest_mode_settings["']/);
}

async function testGuestProductSeparation() {
  assert.notEqual(GUEST_SYSTEM_PARENT_EMAIL, GUEST_SYSTEM_PARENT_EMAIL_IL);
}

async function testArcadeHasNoBlanketProductFilter() {
  const arcadeServerDir = path.join(root, "lib", "arcade", "server");
  for (const f of fs.readdirSync(arcadeServerDir).filter((x) => x.endsWith(".js"))) {
    const src = fs.readFileSync(path.join(arcadeServerDir, f), "utf8");
    assert.equal(/\.eq\(\s*["']product_id["']/.test(src), false, f);
  }
  const rls = fs.readFileSync(
    path.join(root, "sql", "global-product-isolation", "F_rls_restrictive_il_only.sql"),
    "utf8"
  );
  assert.match(rls, /EXPLICITLY EXCLUDED/);
  assert.doesNotMatch(rls, /ON public\.arcade_/i);
  assert.match(rls, /AS RESTRICTIVE/);
}

async function testSqlPackageSafety() {
  const sqlRoot = path.join(root, "sql");
  const isolationDirs = fs
    .readdirSync(sqlRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("global-product-isolation"))
    .map((d) => d.name);
  assert.deepEqual(isolationDirs, ["global-product-isolation"], "exactly one isolation package dir");

  const dir = path.join(sqlRoot, "global-product-isolation");
  const stages = [
    "A_students_product_id.sql",
    "B_user_product_memberships.sql",
    "C_product_parent_account_settings.sql",
    "D_product_guest_mode_settings.sql",
    "E_global_rpc_and_il_compat.sql",
    "F_rls_restrictive_il_only.sql",
  ];
  const all = stages.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
  const codeOnly = all.replace(/--[^\n]*/g, "");

  assert.doesNotMatch(codeOnly, /answers\.session_id/);
  assert.match(codeOnly, /learning_session_id|v3_student_is_il_visible/);
  assert.doesNotMatch(codeOnly, /student_access_codes\s*\(\s*product_id\s*,\s*code\s*\)/);
  assert.match(codeOnly, /code_hash/);
  assert.doesNotMatch(codeOnly, /jwt_product_id\(\)\s*IS\s*NULL/);
  assert.doesNotMatch(codeOnly, /ALTER TABLE[\s\S]{0,80}parent_account_settings[\s\S]{0,120}DROP CONSTRAINT/);
  assert.doesNotMatch(codeOnly, /ALTER TABLE[\s\S]{0,80}guest_mode_settings[\s\S]{0,120}DROP CONSTRAINT/);
  assert.match(codeOnly, /product_parent_account_settings/);
  assert.match(codeOnly, /product_guest_mode_settings/);
  assert.match(codeOnly, /GRANT EXECUTE[\s\S]*TO service_role/);
  assert.match(codeOnly, /REVOKE ALL[\s\S]*FROM authenticated/);
  assert.match(codeOnly, /trg_v3_auto_il_membership_on_student/);
  assert.match(codeOnly, /AS RESTRICTIVE/);
  assert.match(codeOnly, /create_global_parent_student_with_subject_defaults/);

  const g = fs.readFileSync(path.join(dir, "G_verification_assertions.sql"), "utf8");
  assert.match(g, /exactly 2/);
  assert.match(g, /SET LOCAL ROLE authenticated/);
  assert.match(g, /has_function_privilege/);
  assert.match(g, /parent_account_settings PK altered/);

  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
  assert.match(readme, /00 → A → B → C → D → E → F → G → H/);
  for (const suffix of ["v2", "v3"]) {
    assert.equal(
      isolationDirs.includes(`global-product-isolation-${suffix}`),
      false,
      `must not keep isolation package suffix ${suffix}`
    );
    assert.equal(readme.includes(`global-product-isolation-${suffix}`), false);
  }
}

async function testParentSessionReady() {
  const src = fs.readFileSync(
    path.join(root, "lib", "parent-server", "parent-session-ready.server.js"),
    "utf8"
  );
  assert.doesNotMatch(src, /messageHe/);
  assert.match(src, /ensureGlobalProductMembership/);
}

async function testCreateListLoginSources() {
  const create = fs.readFileSync(path.join(root, "pages", "api", "parent", "create-student.js"), "utf8");
  assert.match(create, /getServerProductId/);
  assert.match(create, /product_id:\s*productId/);
  assert.match(create, /ensureGlobalProductMembership/);

  const list = fs.readFileSync(path.join(root, "pages", "api", "parent", "list-students.js"), "utf8");
  assert.match(list, /\.eq\(["']product_id["'], productId\)/);

  const login = fs.readFileSync(path.join(root, "pages", "api", "student", "login.js"), "utf8");
  assert.match(login, /loadGlobalStudentById/);
  assert.match(login, /mockStudentLogin/);
}

async function testProvisionUsesProductTable() {
  const src = fs.readFileSync(
    path.join(root, "lib", "parent-server", "parent-entitlement-provision.server.js"),
    "utf8"
  );
  assert.match(src, /insertProductParentAccountSettings/);
  assert.doesNotMatch(src, /\.from\(["']parent_account_settings["']\)/);
}

const tests = [
  ["product context ignores client claims", testProductContext],
  ["write barrier default off + mock on", testWriteBarrierDefault],
  ["membership does not reactivate suspended", testMembershipDoesNotReactivateSuspended],
  ["membership uses server Global product only", testMembershipCreatesGlobalOnly],
  ["owned student product gate", testOwnedStudentProductGate],
  ["Global uses product_* settings tables", testProductSettingsTables],
  ["guest system parent separated", testGuestProductSeparation],
  ["arcade no blanket product filter", testArcadeHasNoBlanketProductFilter],
  ["SQL package safety", testSqlPackageSafety],
  ["parent session ready Global", testParentSessionReady],
  ["create/list/login product-aware", testCreateListLoginSources],
  ["provision writes product_parent_account_settings", testProvisionUsesProductTable],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL - ${name}`);
    console.error(err);
  }
}

if (failed) {
  console.error(`\n${failed} product-isolation test(s) failed`);
  process.exit(1);
}
console.log(`\n${tests.length} product-isolation tests passed`);
