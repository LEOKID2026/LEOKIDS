#!/usr/bin/env node
/**
 * Provision fixed Global EN QA accounts (owner-internal testing only).
 *
 *   node --env-file=.env.local scripts/qa/provision-global-en-qa-accounts.mjs
 *
 * Creates/updates:
 *   eran@leokids.com     — Admin
 *   eran1@leokids.com    — Parent + QA Student (username/PIN)
 *   eran2@leokids.com    — Private Teacher + English class/students
 *   eran3@leokids.com    — School Manager + LEO Global QA School
 *
 * Writes docs/qa/GLOBAL_EN_QA_ACCOUNTS.md and patches .env.e2e.local keys.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const PASSWORD = "747975";
const ACCOUNTS = {
  admin: { email: "eran@leokids.com", label: "ADMIN" },
  parent: { email: "eran1@leokids.com", label: "Parent" },
  teacher: { email: "eran2@leokids.com", label: "Private Teacher" },
  school: { email: "eran3@leokids.com", label: "School Manager" },
};

const QA = {
  parentDisplay: "QA Parent",
  studentName: "QA Student",
  teacherName: "QA Teacher",
  schoolName: "LEO Global QA School",
  schoolCity: "Global",
  schoolCode: "leoq",
  className: "Grade 3 - Global QA",
  studentUsername: "qa-student",
  // Student/staff login APIs require exactly 4 numeric digits (not the email password).
  studentPin: "7479",
  staffPin: "7479",
};

function requireEnv(name) {
  const v = String(process.env[name] || "").trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function adminClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_LEARNING_SUPABASE_URL"),
    requireEnv("LEARNING_SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function findUserByEmail(admin, email) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 40; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data?.users?.find((u) => String(u.email || "").toLowerCase() === target);
    if (match) return match;
    if (!data?.users?.length || data.users.length < 200) break;
  }
  return null;
}

async function ensureAuthUser(admin, { email, password, role, userMetadata = {} }) {
  const normalized = email.toLowerCase();
  const existing = await findUserByEmail(admin, normalized);
  if (existing?.id) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      app_metadata: { ...(existing.app_metadata || {}), role },
      user_metadata: { ...(existing.user_metadata || {}), ...userMetadata, qa_global_en: true },
    });
    if (error) throw new Error(`updateUser ${normalized}: ${error.message}`);
    return data.user || existing;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email: normalized,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: { ...userMetadata, qa_global_en: true, source: "provision-global-en-qa-accounts" },
  });
  if (error) throw new Error(`createUser ${normalized}: ${error.message}`);
  return data.user;
}

async function upsertEntitlement(admin, userId, persona) {
  const { error } = await admin.from("account_persona_entitlements").upsert(
    {
      user_id: userId,
      persona,
      status: "active",
      approval_source: "admin",
      approved_at: new Date().toISOString(),
    },
    { onConflict: "user_id,persona" }
  );
  if (error) throw new Error(`entitlement ${persona}: ${error.message}`);
}

function hashStudentSecret(value, secret) {
  return crypto.createHmac("sha256", secret).update(String(value)).digest("hex");
}

async function main() {
  const admin = adminClient();
  const studentSecret = requireEnv("LEARNING_STUDENT_ACCESS_SECRET");
  const { PRODUCT_GLOBAL } = await import(
    pathToFileURL(path.join(ROOT, "lib/global/product-context.server.js")).href
  );
  const { ensureGlobalProductMembership } = await import(
    pathToFileURL(path.join(ROOT, "lib/global/product-membership.server.js")).href
  );
  const { assignSchoolManager } = await import(
    pathToFileURL(path.join(ROOT, "lib/admin-server/admin-schools.server.js")).href
  );
  const { hashStaffSecret } = await import(
    pathToFileURL(path.join(ROOT, "lib/school-server/school-staff-crypto.server.js")).href
  );

  async function ensureEnMembership(userId) {
    const mem = await ensureGlobalProductMembership(admin, userId, {
      interfaceLanguage: "en",
      preferredReportLanguage: "en",
      preserveExistingLanguages: false,
    });
    if (!mem.ok) {
      throw new Error(`global membership failed: ${mem.error || mem.code || mem.message}`);
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    password: PASSWORD,
    accounts: {},
    student: {},
    school: {},
    staffLogin: null,
  };

  // --- ADMIN ---
  {
    const user = await ensureAuthUser(admin, {
      email: ACCOUNTS.admin.email,
      password: PASSWORD,
      role: "admin",
    });
    await upsertEntitlement(admin, user.id, "admin");
    out.accounts.admin = { email: ACCOUNTS.admin.email, userId: user.id, role: "admin" };
    console.log("OK admin", ACCOUNTS.admin.email, user.id);
  }

  // --- PARENT + STUDENT ---
  {
    const user = await ensureAuthUser(admin, {
      email: ACCOUNTS.parent.email,
      password: PASSWORD,
      role: "parent",
    });
    await upsertEntitlement(admin, user.id, "parent");
    await ensureEnMembership(user.id);

    const { error: ppErr } = await admin.from("parent_profiles").upsert(
      { id: user.id, display_name: QA.parentDisplay },
      { onConflict: "id" }
    );
    if (ppErr) {
      // older schemas may lack display_name
      const { error: pp2 } = await admin.from("parent_profiles").upsert({ id: user.id }, { onConflict: "id" });
      if (pp2) throw new Error(`parent_profiles: ${ppErr.message} / ${pp2.message}`);
    }

    // Find or create QA student under this parent
    let studentId = null;
    const { data: existingStudents } = await admin
      .from("students")
      .select("id, full_name")
      .eq("parent_id", user.id)
      .eq("full_name", QA.studentName)
      .limit(1);
    if (existingStudents?.[0]?.id) {
      studentId = existingStudents[0].id;
      await admin
        .from("students")
        .update({
          full_name: QA.studentName,
          grade_level: "g3",
          is_active: true,
          product_id: PRODUCT_GLOBAL,
          account_kind: "registered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId);
    } else {
      const { data: created, error: stErr } = await admin
        .from("students")
        .insert({
          parent_id: user.id,
          full_name: QA.studentName,
          grade_level: "g3",
          is_active: true,
          product_id: PRODUCT_GLOBAL,
          account_kind: "registered",
        })
        .select("id")
        .single();
      if (stErr) throw new Error(`students insert: ${stErr.message}`);
      studentId = created.id;
    }

    const loginUsername = QA.studentUsername.toLowerCase();
    const codeHash = hashStudentSecret(loginUsername, studentSecret);
    const pinHash = hashStudentSecret(QA.studentPin, studentSecret);
    const { data: existingCode } = await admin
      .from("student_access_codes")
      .select("id")
      .eq("student_id", studentId)
      .eq("is_active", true)
      .is("revoked_at", null)
      .maybeSingle();
    if (existingCode?.id) {
      const { error } = await admin
        .from("student_access_codes")
        .update({
          login_username: loginUsername,
          code_hash: codeHash,
          pin_hash: pinHash,
        })
        .eq("id", existingCode.id);
      if (error) throw new Error(`student_access_codes update: ${error.message}`);
    } else {
      // Revoke conflicting username if any
      await admin
        .from("student_access_codes")
        .update({ is_active: false, revoked_at: new Date().toISOString() })
        .eq("login_username", loginUsername)
        .eq("is_active", true);
      const { error } = await admin.from("student_access_codes").insert({
        student_id: studentId,
        login_username: loginUsername,
        code_hash: codeHash,
        pin_hash: pinHash,
        is_active: true,
      });
      if (error) throw new Error(`student_access_codes insert: ${error.message}`);
    }

    out.accounts.parent = { email: ACCOUNTS.parent.email, userId: user.id, role: "parent" };
    out.student = {
      studentId,
      fullName: QA.studentName,
      username: loginUsername,
      pin: QA.studentPin,
    };
    console.log("OK parent+student", ACCOUNTS.parent.email, studentId, loginUsername);
  }

  // --- PRIVATE TEACHER ---
  {
    const user = await ensureAuthUser(admin, {
      email: ACCOUNTS.teacher.email,
      password: PASSWORD,
      role: "teacher",
    });
    await upsertEntitlement(admin, user.id, "private_teacher");
    await ensureEnMembership(user.id);

    const { error: tpErr } = await admin.from("teacher_profiles").upsert(
      {
        id: user.id,
        display_name: QA.teacherName,
        preferred_language: "en",
        is_active: true,
      },
      { onConflict: "id" }
    );
    if (tpErr) throw new Error(`teacher_profiles: ${tpErr.message}`);

    const { data: limits } = await admin
      .from("teacher_limits")
      .select("teacher_id")
      .eq("teacher_id", user.id)
      .maybeSingle();
    if (!limits) {
      const { error } = await admin.from("teacher_limits").insert({
        teacher_id: user.id,
        plan_code: "teacher_basic_20",
      });
      if (error) throw new Error(`teacher_limits: ${error.message}`);
    }

    // Class
    let classId = null;
    const { data: classes } = await admin
      .from("teacher_classes")
      .select("id, name")
      .eq("teacher_id", user.id)
      .eq("is_archived", false);
    const existingClass = (classes || []).find((c) => c.name === QA.className) || (classes || [])[0];
    if (existingClass?.id) {
      classId = existingClass.id;
      await admin
        .from("teacher_classes")
        .update({ name: QA.className, grade_level: "g3", is_archived: false })
        .eq("id", classId);
    } else {
      const { data: created, error } = await admin
        .from("teacher_classes")
        .insert({
          teacher_id: user.id,
          name: QA.className,
          grade_level: "g3",
          is_archived: false,
        })
        .select("id")
        .single();
      if (error) throw new Error(`teacher_classes: ${error.message}`);
      classId = created.id;
    }

    // Ensure parent student is also linked to this teacher class for richer teacher UI,
    // plus a few English roster classmates owned by the same parent.
    const parentId = out.accounts.parent.userId;
    const rosterNames = [
      QA.studentName,
      "Alex Rivera",
      "Sam Jordan",
      "Taylor Brooks",
      "Jordan Lee",
    ];
    const rosterIds = [];
    for (const name of rosterNames) {
      let sid = null;
      if (name === QA.studentName) {
        sid = out.student.studentId;
      } else {
        const { data: found } = await admin
          .from("students")
          .select("id")
          .eq("parent_id", parentId)
          .eq("full_name", name)
          .maybeSingle();
        if (found?.id) {
          sid = found.id;
        } else {
          const { data: created, error } = await admin
            .from("students")
            .insert({
              parent_id: parentId,
              full_name: name,
              grade_level: "g3",
              is_active: true,
              product_id: PRODUCT_GLOBAL,
              account_kind: "registered",
            })
            .select("id")
            .single();
          if (error) throw new Error(`roster student ${name}: ${error.message}`);
          sid = created.id;
        }
      }
      rosterIds.push(sid);

      // teacher_students link
      const { data: link } = await admin
        .from("teacher_students")
        .select("id")
        .eq("teacher_id", user.id)
        .eq("student_id", sid)
        .maybeSingle();
      if (!link?.id) {
        const { error } = await admin.from("teacher_students").insert({
          teacher_id: user.id,
          student_id: sid,
        });
        if (error && error.code !== "23505") throw new Error(`teacher_students: ${error.message}`);
      }

      const { data: mem } = await admin
        .from("teacher_class_students")
        .select("id")
        .eq("class_id", classId)
        .eq("student_id", sid)
        .is("removed_at", null)
        .maybeSingle();
      if (!mem?.id) {
        const { error } = await admin.from("teacher_class_students").insert({
          class_id: classId,
          student_id: sid,
        });
        if (error && error.code !== "23505") throw new Error(`class member: ${error.message}`);
      }
    }

    out.accounts.teacher = {
      email: ACCOUNTS.teacher.email,
      userId: user.id,
      role: "teacher",
      classId,
      className: QA.className,
      displayName: QA.teacherName,
      preferredLanguage: "en",
      rosterCount: rosterIds.length,
    };
    console.log("OK private teacher", ACCOUNTS.teacher.email, classId);
  }

  // --- SCHOOL MANAGER ---
  {
    const user = await ensureAuthUser(admin, {
      email: ACCOUNTS.school.email,
      password: PASSWORD,
      role: "teacher",
    });
    await upsertEntitlement(admin, user.id, "school_manager");
    await ensureEnMembership(user.id);

    const { error: tpErr } = await admin.from("teacher_profiles").upsert(
      {
        id: user.id,
        display_name: "QA School Manager",
        preferred_language: "en",
        is_active: true,
      },
      { onConflict: "id" }
    );
    if (tpErr) throw new Error(`school manager profile: ${tpErr.message}`);

    const { data: limits } = await admin
      .from("teacher_limits")
      .select("teacher_id")
      .eq("teacher_id", user.id)
      .maybeSingle();
    if (!limits) {
      await admin.from("teacher_limits").insert({
        teacher_id: user.id,
        plan_code: "teacher_basic_20",
      });
    }

    let school = null;
    const { data: byName } = await admin
      .from("school_accounts")
      .select("id, name, school_code, city")
      .eq("name", QA.schoolName)
      .maybeSingle();
    if (byName?.id) {
      school = byName;
      await admin
        .from("school_accounts")
        .update({
          city: QA.schoolCity,
          country_code: "US",
          contact_email: ACCOUNTS.school.email,
          school_code: QA.schoolCode,
          is_active: true,
        })
        .eq("id", school.id);
    } else {
      const { data: created, error } = await admin
        .from("school_accounts")
        .insert({
          name: QA.schoolName,
          city: QA.schoolCity,
          country_code: "US",
          contact_email: ACCOUNTS.school.email,
          school_code: QA.schoolCode,
          max_teachers: 20,
          is_active: true,
        })
        .select("id, name, school_code")
        .single();
      if (error) throw new Error(`school_accounts: ${error.message}`);
      school = created;
    }

    const assigned = await assignSchoolManager(admin, school.id, user.id);
    if (!assigned.ok) {
      throw new Error(`assignSchoolManager failed: ${assigned.code || JSON.stringify(assigned)}`);
    }

    // Staff code for /school/staff/login (code + PIN). Prefer fixed display if free.
    const staffCodeDisplay = `${QA.schoolCode}-t0001`;
    const pinHash = hashStaffSecret(QA.staffPin);
    const { data: existingStaff } = await admin
      .from("school_staff_access_codes")
      .select("id, code_display")
      .eq("user_id", user.id)
      .eq("school_id", school.id)
      .eq("is_active", true)
      .is("revoked_at", null)
      .maybeSingle();

    if (existingStaff?.id) {
      await admin
        .from("school_staff_access_codes")
        .update({
          code_display: staffCodeDisplay,
          code_display_normalized: staffCodeDisplay,
          pin_hash: pinHash,
          must_change_pin: false,
          failed_attempts: 0,
          locked_until: null,
          staff_role: "school_teacher",
        })
        .eq("id", existingStaff.id);
    } else {
      // Clear conflicting code owner if needed
      await admin
        .from("school_staff_access_codes")
        .update({ is_active: false, revoked_at: new Date().toISOString() })
        .eq("code_display_normalized", staffCodeDisplay)
        .eq("is_active", true);

      const { error: staffErr } = await admin.from("school_staff_access_codes").insert({
        school_id: school.id,
        user_id: user.id,
        staff_role: "school_teacher",
        code_display: staffCodeDisplay,
        code_display_normalized: staffCodeDisplay,
        pin_hash: pinHash,
        must_change_pin: false,
        is_active: true,
        created_by: user.id,
      });
      if (staffErr) throw new Error(`school_staff_access_codes: ${staffErr.message}`);
    }

    out.accounts.school = {
      email: ACCOUNTS.school.email,
      userId: user.id,
      role: "school_manager",
      schoolId: school.id,
      schoolName: QA.schoolName,
    };
    out.school = {
      schoolId: school.id,
      schoolName: QA.schoolName,
      schoolCode: QA.schoolCode,
    };
    out.staffLogin = {
      staffCode: staffCodeDisplay,
      pin: QA.staffPin,
      note: "Primary school manager path is /teacher/login (email+password) → /school/dashboard. Staff code works on /school/staff/login.",
    };
    console.log("OK school manager", ACCOUNTS.school.email, school.id, staffCodeDisplay);
  }

  // --- Write docs ---
  const docsDir = path.join(ROOT, "docs/qa");
  fs.mkdirSync(docsDir, { recursive: true });
  const md = `# Global EN QA accounts (internal)

**Do not commit passwords to public docs outside this private repo.**  
Generated: ${out.generatedAt}

All accounts use password: \`${PASSWORD}\`

| Role | Email | Notes |
|---|---|---|
| ADMIN | \`${ACCOUNTS.admin.email}\` | Admin portal (Hebrew OK). Not part of English SoT public crawl. |
| Parent | \`${ACCOUNTS.parent.email}\` | Linked student: **${QA.studentName}** |
| Private Teacher | \`${ACCOUNTS.teacher.email}\` | Class: **${QA.className}**, preferredLanguage=en |
| School Manager | \`${ACCOUNTS.school.email}\` | School: **${QA.schoolName}** |

## Student login (username / PIN)

\`\`\`text
Student username: ${QA.studentUsername}
Student PIN: ${QA.studentPin}
\`\`\`

## School staff login (optional code path)

\`\`\`text
Staff code: ${out.staffLogin.staffCode}
Staff PIN: ${out.staffLogin.pin}
\`\`\`

School manager **email/password** login: use \`/teacher/login\` → redirects to \`/school/dashboard\`.

## English fixture labels

\`\`\`text
Parent name: ${QA.parentDisplay}
Student name: ${QA.studentName}
Teacher name: ${QA.teacherName}
School name: ${QA.schoolName}
Class name: ${QA.className}
\`\`\`

## Re-provision

\`\`\`bash
node --env-file=.env.local scripts/qa/provision-global-en-qa-accounts.mjs
\`\`\`
`;
  fs.writeFileSync(path.join(docsDir, "GLOBAL_EN_QA_ACCOUNTS.md"), md);

  // Artifact JSON (gitignored-friendly under docs/reports too)
  fs.mkdirSync(path.join(ROOT, "docs/reports"), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, "docs/reports/global-en-qa-accounts-provision.json"),
    JSON.stringify(out, null, 2)
  );

  // Patch .env.e2e.local
  const envPath = path.join(ROOT, ".env.e2e.local");
  const patch = {
    E2E_PARENT_EMAIL: ACCOUNTS.parent.email,
    E2E_PARENT_PASSWORD: PASSWORD,
    E2E_STUDENT_USERNAME: QA.studentUsername,
    E2E_STUDENT_PIN: QA.studentPin,
    ACTIVITY_SIM_STUDENT_USER: QA.studentUsername,
    ACTIVITY_SIM_STUDENT_PIN: QA.studentPin,
    TEACHER_PORTAL_VERIFY_EMAIL: ACCOUNTS.teacher.email,
    TEACHER_PORTAL_VERIFY_PASSWORD: PASSWORD,
    E2E_SCHOOL_EMAIL: ACCOUNTS.school.email,
    E2E_SCHOOL_PASSWORD: PASSWORD,
    SCHOOL_QA_EMAIL: ACCOUNTS.school.email,
    SCHOOL_QA_PASSWORD: PASSWORD,
    E2E_ADMIN_EMAIL: ACCOUNTS.admin.email,
    E2E_ADMIN_PASSWORD: PASSWORD,
    ADMIN_TEST_EMAIL: ACCOUNTS.admin.email,
    ADMIN_TEST_PASSWORD: PASSWORD,
    E2E_SCHOOL_STAFF_CODE: out.staffLogin.staffCode,
    E2E_SCHOOL_STAFF_PIN: QA.staffPin,
  };

  let envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  for (const [k, v] of Object.entries(patch)) {
    const re = new RegExp(`^${k}=.*$`, "m");
    if (re.test(envText)) {
      envText = envText.replace(re, `${k}=${v}`);
    } else {
      envText = envText.replace(/\s*$/, `\n${k}=${v}\n`);
    }
  }
  if (!envText.includes("# Global EN QA accounts")) {
    envText =
      `# Global EN QA accounts (provision-global-en-qa-accounts.mjs)\n` + envText;
  }
  fs.writeFileSync(envPath, envText);

  console.log("\nWrote docs/qa/GLOBAL_EN_QA_ACCOUNTS.md and updated .env.e2e.local");
  console.log(JSON.stringify({ student: out.student, staffLogin: out.staffLogin }, null, 2));
}

main().catch((e) => {
  console.error("provision-global-en-qa-accounts: FAIL", e.message || e);
  process.exit(1);
});
