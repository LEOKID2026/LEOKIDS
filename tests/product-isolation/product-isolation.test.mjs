/**
 * Product isolation unit tests (no Supabase production writes).
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

function mockDb(handlers) {
  return {
    rpc: async (name, args) => handlers.rpc?.(name, args) ?? { data: null, error: { message: "missing", code: "PGRST202" } },
    from(table) {
      const api = {
        _table: table,
        select() {
          return api;
        },
        eq() {
          return api;
        },
        maybeSingle: async () => handlers.maybeSingle?.(table) ?? { data: null, error: null },
        insert(row) {
          api._insert = row;
          return {
            select() {
              return {
                maybeSingle: async () => handlers.insert?.(table, row) ?? { data: row, error: null },
                single: async () => handlers.insert?.(table, row) ?? { data: row, error: null },
              };
            },
          };
        },
        update() {
          return {
            eq() {
              return {
                eq: async () => handlers.update?.(table) ?? { error: null },
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
  assert.equal(resolveTrustedProductId(PRODUCT_GLOBAL), PRODUCT_GLOBAL);
  assert.equal(resolveTrustedProductId(null), PRODUCT_GLOBAL);
  assert.ok(isLeoProductId(PRODUCT_IL));
  assert.ok(isLeoProductId(PRODUCT_GLOBAL));
  assert.equal(isLeoProductId("other"), false);
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

async function testMembershipDoesNotTouchIl() {
  const { ensureGlobalProductMembership } = await import(
    "../../lib/global/product-membership.server.js"
  );
  const inserts = [];
  const db = mockDb({
    rpc: async () => ({ data: null, error: { message: "no rpc", code: "PGRST202" } }),
    maybeSingle: async () => ({ data: null, error: null }),
    insert: async (_t, row) => {
      inserts.push(row);
      return { data: row, error: null };
    },
  });
  const result = await ensureGlobalProductMembership(db, "user-1", {
    interfaceLanguage: "en",
    preferredReportLanguage: "en",
  });
  assert.equal(result.ok, true);
  assert.equal(result.productId, PRODUCT_GLOBAL);
  assert.equal(inserts[0]?.product_id, PRODUCT_GLOBAL);
  assert.notEqual(inserts[0]?.product_id, PRODUCT_IL);
}

async function testOwnedStudentProductGate() {
  const { loadOwnedGlobalStudent, loadGlobalStudentById } = await import(
    "../../lib/global/product-student.server.js"
  );

  const ilStudent = {
    id: "s-il",
    parent_id: "p1",
    product_id: PRODUCT_IL,
    is_active: true,
  };
  const globalStudent = {
    id: "s-g",
    parent_id: "p1",
    product_id: PRODUCT_GLOBAL,
    is_active: true,
  };

  const dbMiss = mockDb({
    maybeSingle: async () => ({ data: null, error: null }),
  });
  const miss = await loadOwnedGlobalStudent(dbMiss, { studentId: "s-il", parentUserId: "p1" });
  assert.equal(miss.ok, false);

  const dbHit = mockDb({
    maybeSingle: async () => ({ data: globalStudent, error: null }),
  });
  const hit = await loadOwnedGlobalStudent(dbHit, { studentId: "s-g", parentUserId: "p1" });
  assert.equal(hit.ok, true);
  assert.equal(hit.student.product_id, PRODUCT_GLOBAL);

  // Wrong product even if row returned (defense)
  const dbWrong = mockDb({
    maybeSingle: async () => ({ data: ilStudent, error: null }),
  });
  const wrong = await loadOwnedGlobalStudent(dbWrong, { studentId: "s-il", parentUserId: "p1" });
  assert.equal(wrong.ok, false);

  const byId = await loadGlobalStudentById(dbHit, "s-g");
  assert.equal(byId.ok, true);
}

async function testGuestProductSeparation() {
  assert.notEqual(GUEST_SYSTEM_PARENT_EMAIL, GUEST_SYSTEM_PARENT_EMAIL_IL);
  assert.match(GUEST_SYSTEM_PARENT_EMAIL, /global/i);
}

async function testArcadeHasNoBlanketProductFilter() {
  const arcadeServerDir = path.join(root, "lib", "arcade", "server");
  const files = fs.readdirSync(arcadeServerDir).filter((f) => f.endsWith(".js"));
  for (const f of files) {
    const src = fs.readFileSync(path.join(arcadeServerDir, f), "utf8");
    assert.equal(
      /\.eq\(\s*["']product_id["']/.test(src),
      false,
      `arcade server ${f} must not filter by product_id`
    );
  }

  const rls = fs.readFileSync(
    path.join(root, "sql", "global-product-isolation-v2", "F_rls_replace.sql"),
    "utf8"
  );
  assert.match(rls, /EXPLICITLY EXCLUDED/);
  assert.doesNotMatch(rls, /ON public\.arcade_/i);
}

async function testSqlPackageSafety() {
  const dir = path.join(root, "sql", "global-product-isolation-v2");
  // Executable stages only (exclude verification which mentions forbidden patterns as assert text).
  const stageFiles = ["A_students_and_access_codes.sql", "B_user_product_memberships.sql", "C_parent_account_settings_pk.sql", "D_guest_settings_product.sql", "E_global_rpc_and_consistency.sql", "F_rls_replace.sql"];
  const all = stageFiles.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
  // Strip SQL comments before pattern checks.
  const codeOnly = all.replace(/--[^\n]*/g, "");

  assert.doesNotMatch(codeOnly, /answers\.session_id/);
  assert.match(codeOnly, /learning_session_id/);
  assert.doesNotMatch(codeOnly, /student_access_codes\s*\(\s*product_id\s*,\s*code\s*\)/);
  assert.match(codeOnly, /code_hash/);
  assert.doesNotMatch(codeOnly, /jwt_product_id\(\)\s*IS\s*NULL/);
  assert.doesNotMatch(codeOnly, /parent_profiles[\s\S]{0,200}ADD COLUMN[\s\S]{0,40}product_id/);
  assert.match(codeOnly, /user_product_memberships/);
  assert.match(codeOnly, /PRIMARY KEY\s*\(\s*parent_user_id\s*,\s*product_id\s*\)/);
  assert.match(codeOnly, /PRIMARY KEY\s*\(\s*product_id\s*,\s*setting_key\s*\)/);
  assert.match(codeOnly, /create_global_parent_student_with_subject_defaults/);
}

async function testParentSessionReadyExports() {
  const mod = await import("../../lib/parent-server/parent-session-ready.server.js");
  assert.equal(typeof mod.finalizeParentSessionReady, "function");
  const src = fs.readFileSync(
    path.join(root, "lib", "parent-server", "parent-session-ready.server.js"),
    "utf8"
  );
  assert.doesNotMatch(src, /messageHe/);
  assert.match(src, /ensureGlobalProductMembership/);
  assert.match(src, /locale:\s*["']en["']/);
}

async function testCreateStudentApiSource() {
  const src = fs.readFileSync(path.join(root, "pages", "api", "parent", "create-student.js"), "utf8");
  assert.match(src, /getServerProductId/);
  assert.match(src, /product_id:\s*productId/);
  assert.match(src, /ensureGlobalProductMembership/);
  assert.match(src, /countGlobalParentStudents/);
  assert.doesNotMatch(src, /req\.body\.product_id/);
}

async function testLoginApiSource() {
  const src = fs.readFileSync(path.join(root, "pages", "api", "student", "login.js"), "utf8");
  assert.match(src, /loadGlobalStudentById/);
  assert.match(src, /mockStudentLogin/);
  assert.match(src, /gateMutatingApi/);
}

async function testListStudentsSource() {
  const src = fs.readFileSync(path.join(root, "pages", "api", "parent", "list-students.js"), "utf8");
  assert.match(src, /\.eq\(["']product_id["'], productId\)/);
}

const tests = [
  ["product context ignores client claims", testProductContext],
  ["write barrier default off + mock on", testWriteBarrierDefault],
  ["membership creates Global only", testMembershipDoesNotTouchIl],
  ["owned student product gate", testOwnedStudentProductGate],
  ["guest system parent separated", testGuestProductSeparation],
  ["arcade no blanket product filter", testArcadeHasNoBlanketProductFilter],
  ["SQL v2 package safety", testSqlPackageSafety],
  ["parent session ready Global", testParentSessionReadyExports],
  ["create-student product-aware", testCreateStudentApiSource],
  ["student login product-aware", testLoginApiSource],
  ["list-students product filter", testListStudentsSource],
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
