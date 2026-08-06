#!/usr/bin/env node
/**
 * Sanitize teacher@leo.com simulation data to English-only for Global EN product.
 *
 * Updates (live DB via service role):
 *   - teacher_profiles.display_name, preferred_language
 *   - teacher_classes.name (Hebrew → English)
 *   - students.full_name for students linked to this teacher
 *
 * Usage:
 *   node --env-file=.env.local scripts/teacher-portal/sanitize-leo-teacher-english-data.mjs --dry-run
 *   node --env-file=.env.local scripts/teacher-portal/sanitize-leo-teacher-english-data.mjs --execute
 */
import { createClient } from "@supabase/supabase-js";

const HE = /[\u0590-\u05FF]/;
const dryRun = !process.argv.includes("--execute");

const TEACHER_EMAIL = String(
  process.env.TEACHER_PORTAL_VERIFY_EMAIL ||
    process.env.SIM_TEACHER_EMAIL ||
    "teacher@leo.com"
)
  .trim()
  .toLowerCase();

const TARGET_TEACHER_DISPLAY = "LEO Teacher";
const TARGET_PREFERRED_LANGUAGE = "en";
const TARGET_CLASS_NAME = "Grade 3 - LEO";

/** Stable English roster (20) — used in order of current class membership. */
const EN_STUDENT_NAMES = [
  "Noah Cohen",
  "Emma Levy",
  "Liam Abraham",
  "Olivia Mizrahi",
  "Ethan Perez",
  "Ava Biton",
  "Mason David",
  "Sophia Israeli",
  "Lucas Golan",
  "Mia Chen",
  "Jacob Rosen",
  "Amelia Dayan",
  "Benjamin Alon",
  "Harper Zur",
  "Henry Kaplan",
  "Evelyn Saban",
  "Alexander Azoulay",
  "Ella Mor",
  "James Sharabi",
  "Charlotte Dahan",
];

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function createAdmin() {
  const url = requireEnv("NEXT_PUBLIC_LEARNING_SUPABASE_URL");
  const key = requireEnv("LEARNING_SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function findAuthUserByEmail(admin, email) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 30; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const match = data?.users?.find((u) => String(u.email || "").toLowerCase() === target);
    if (match?.id) return match;
    if (!data?.users?.length || data.users.length < 200) break;
  }
  return null;
}

function englishClassName(currentName) {
  const n = String(currentName || "").trim();
  if (!n) return TARGET_CLASS_NAME;
  if (!HE.test(n)) {
    // Already Latin — keep unless it is the known Hebrew LEO class transliteration gap
    if (/^(Class|Grade)\s*3\s*[-–—]\s*LEO$/i.test(n)) return n.replace(/^Class/i, "Grade");
    return n;
  }
  // Hebrew grade-3 LEO class (and close variants)
  if (/כיתה|ג[׳']|LEO/i.test(n) || HE.test(n)) return TARGET_CLASS_NAME;
  return TARGET_CLASS_NAME;
}

async function main() {
  const admin = createAdmin();
  const user = await findAuthUserByEmail(admin, TEACHER_EMAIL);
  if (!user?.id) throw new Error(`Teacher auth user not found: ${TEACHER_EMAIL}`);
  const teacherId = user.id;

  console.log(dryRun ? "DRY RUN — no writes" : "EXECUTE — writing English teacher data");
  console.log(`Teacher: ${TEACHER_EMAIL} (${teacherId})`);

  const changes = [];

  // --- profile ---
  const { data: profile, error: profileErr } = await admin
    .from("teacher_profiles")
    .select("id, display_name, preferred_language")
    .eq("id", teacherId)
    .maybeSingle();
  if (profileErr) throw new Error(profileErr.message);
  if (!profile) throw new Error("teacher_profiles row missing");

  const nextDisplay =
    HE.test(String(profile.display_name || "")) || !String(profile.display_name || "").trim()
      ? TARGET_TEACHER_DISPLAY
      : String(profile.display_name).trim() === "מורה LEO"
        ? TARGET_TEACHER_DISPLAY
        : String(profile.display_name).trim();
  const forceDisplay =
    String(profile.display_name || "").trim() !== TARGET_TEACHER_DISPLAY &&
    (HE.test(String(profile.display_name || "")) ||
      String(profile.display_name || "").includes("מורה") ||
      String(profile.display_name || "").trim() === "מורה LEO");
  const displayOut = forceDisplay ? TARGET_TEACHER_DISPLAY : nextDisplay === "מורה LEO" ? TARGET_TEACHER_DISPLAY : String(profile.display_name || TARGET_TEACHER_DISPLAY).trim() || TARGET_TEACHER_DISPLAY;
  // Always normalize known Hebrew teacher label + preferred language
  const profilePatch = {};
  if (
    HE.test(String(profile.display_name || "")) ||
    String(profile.display_name || "").trim() !== TARGET_TEACHER_DISPLAY
  ) {
    // Only rewrite if Hebrew or exact legacy label; keep custom English names
    if (
      HE.test(String(profile.display_name || "")) ||
      /מורה/.test(String(profile.display_name || "")) ||
      !String(profile.display_name || "").trim()
    ) {
      profilePatch.display_name = TARGET_TEACHER_DISPLAY;
    }
  }
  if (String(profile.preferred_language || "").toLowerCase() !== TARGET_PREFERRED_LANGUAGE) {
    profilePatch.preferred_language = TARGET_PREFERRED_LANGUAGE;
  }
  if (Object.keys(profilePatch).length) {
    changes.push({
      kind: "teacher_profiles",
      before: {
        display_name: profile.display_name,
        preferred_language: profile.preferred_language,
      },
      after: { ...profile, ...profilePatch },
    });
    if (!dryRun) {
      const { error } = await admin
        .from("teacher_profiles")
        .update(profilePatch)
        .eq("id", teacherId);
      if (error) throw new Error(error.message);
    }
  }

  // --- classes ---
  const { data: classes, error: classErr } = await admin
    .from("teacher_classes")
    .select("id, name, is_archived")
    .eq("teacher_id", teacherId);
  if (classErr) throw new Error(classErr.message);

  for (const c of classes || []) {
    if (c.is_archived) continue;
    const nextName = englishClassName(c.name);
    if (nextName !== String(c.name || "").trim() || HE.test(String(c.name || ""))) {
      const finalName = HE.test(String(c.name || "")) ? TARGET_CLASS_NAME : nextName;
      if (finalName === String(c.name || "").trim() && !HE.test(String(c.name || ""))) continue;
      changes.push({
        kind: "teacher_classes",
        id: c.id,
        before: c.name,
        after: HE.test(String(c.name || "")) ? TARGET_CLASS_NAME : finalName,
      });
      if (!dryRun) {
        const { error } = await admin
          .from("teacher_classes")
          .update({ name: HE.test(String(c.name || "")) ? TARGET_CLASS_NAME : finalName })
          .eq("id", c.id)
          .eq("teacher_id", teacherId);
        if (error) throw new Error(error.message);
      }
    }
  }

  // --- students linked to teacher (via teacher_students and/or class membership) ---
  const studentIds = new Set();
  const { data: links, error: linkErr } = await admin
    .from("teacher_students")
    .select("student_id")
    .eq("teacher_id", teacherId);
  if (linkErr) throw new Error(linkErr.message);
  for (const row of links || []) if (row.student_id) studentIds.add(row.student_id);

  for (const c of classes || []) {
    if (c.is_archived) continue;
    const { data: members, error: memErr } = await admin
      .from("teacher_class_students")
      .select("student_id")
      .eq("class_id", c.id);
    if (memErr) throw new Error(memErr.message);
    for (const m of members || []) if (m.student_id) studentIds.add(m.student_id);
  }

  const ids = [...studentIds];
  if (ids.length) {
    const { data: students, error: stuErr } = await admin
      .from("students")
      .select("id, full_name")
      .in("id", ids);
    if (stuErr) throw new Error(stuErr.message);

    // Stable sort by current name then id so renames are deterministic across runs
    const sorted = [...(students || [])].sort((a, b) => {
      const an = String(a.full_name || "");
      const bn = String(b.full_name || "");
      if (an !== bn) return an.localeCompare(bn, "en");
      return String(a.id).localeCompare(String(b.id));
    });

    let nameIdx = 0;
    for (const s of sorted) {
      const current = String(s.full_name || "").trim();
      if (!HE.test(current)) {
        // Already English — leave as-is
        continue;
      }
      const target = EN_STUDENT_NAMES[nameIdx % EN_STUDENT_NAMES.length];
      nameIdx += 1;
      changes.push({
        kind: "students",
        id: s.id,
        before: current,
        after: target,
      });
      if (!dryRun) {
        const { error } = await admin
          .from("students")
          .update({ full_name: target, updated_at: new Date().toISOString() })
          .eq("id", s.id);
        if (error) throw new Error(error.message);
      }
    }
  }

  console.log(`Changes: ${changes.length}`);
  for (const ch of changes.slice(0, 60)) {
    console.log(JSON.stringify(ch));
  }
  if (changes.length > 60) console.log(`... +${changes.length - 60} more`);

  if (dryRun) {
    console.log("\nRe-run with --execute to apply.");
    process.exit(0);
  }
  console.log("\nApplied.");
}

main().catch((e) => {
  console.error("sanitize-leo-teacher-english-data: FAIL", e.message || e);
  process.exit(1);
});
