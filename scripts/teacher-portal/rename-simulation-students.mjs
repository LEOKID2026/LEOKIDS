#!/usr/bin/env node
/**
 * Rename teacher classroom simulation students to English display names.
 * Keeps the same student IDs — updates students.full_name only.
 *
 * Prefer: node --env-file=.env.local scripts/teacher-portal/sanitize-leo-teacher-english-data.mjs --execute
 * This script remains for roster-only renames against a local manifest when present.
 *
 * node --env-file=.env.local scripts/teacher-portal/rename-simulation-students.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const TEACHER_EMAIL = String(
  process.env.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com"
)
  .trim()
  .toLowerCase();

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

const admin = createClient(
  requireEnv("NEXT_PUBLIC_LEARNING_SUPABASE_URL"),
  requireEnv("LEARNING_SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function findTeacherId() {
  for (let page = 1; page <= 30; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const match = data?.users?.find((u) => String(u.email || "").toLowerCase() === TEACHER_EMAIL);
    if (match?.id) return match.id;
    if (!data?.users?.length || data.users.length < 200) break;
  }
  throw new Error(`Teacher not found: ${TEACHER_EMAIL}`);
}

const teacherId = await findTeacherId();
const { data: links, error: linkErr } = await admin
  .from("teacher_students")
  .select("student_id")
  .eq("teacher_id", teacherId);
if (linkErr) throw new Error(linkErr.message);

const ids = [...new Set((links || []).map((r) => r.student_id).filter(Boolean))];
if (!ids.length) {
  console.error("No teacher_students links — nothing to rename.");
  process.exit(1);
}

const { data: students, error: stuErr } = await admin
  .from("students")
  .select("id, full_name")
  .in("id", ids);
if (stuErr) throw new Error(stuErr.message);

const sorted = [...(students || [])].sort((a, b) =>
  String(a.full_name || "").localeCompare(String(b.full_name || ""), "en")
);

let updated = 0;
let nameIdx = 0;
for (const s of sorted) {
  const current = String(s.full_name || "").trim();
  if (!HE.test(current)) {
    console.log(`keep: "${current}"`);
    continue;
  }
  const target = EN_STUDENT_NAMES[nameIdx % EN_STUDENT_NAMES.length];
  nameIdx += 1;
  const { error } = await admin
    .from("students")
    .update({ full_name: target, updated_at: new Date().toISOString() })
    .eq("id", s.id);
  if (error) throw new Error(error.message);
  console.log(`"${current}" → "${target}"`);
  updated += 1;
}

// Optional: sync manifest names if present (legacy sim state)
const manifestPath = path.join(
  process.cwd(),
  "scripts/teacher-portal/teacher-classroom-sim/.state/manifest.json"
);
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (Array.isArray(manifest.students)) {
      for (const entry of manifest.students) {
        const row = sorted.find((s) => s.id === entry.id);
        if (row) entry.fullName = row.full_name;
      }
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("Updated local sim manifest names.");
    }
  } catch {
    /* ignore */
  }
}

console.log(`\nDone. Updated ${updated} of ${sorted.length} students.`);
