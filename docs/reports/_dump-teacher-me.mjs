#!/usr/bin/env node
import fs from "node:fs";
function load(rel) {
  const o = {};
  for (const line of fs.readFileSync(rel, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    o[t.slice(0, i).trim()] = v;
  }
  return o;
}
const ENV = { ...load(".env.local"), ...load(".env.e2e.local"), ...process.env };
const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";
const tok = await (
  await fetch(`${ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
).json();
const me = await (
  await fetch("http://127.0.0.1:3001/api/teacher/me", {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  })
).json();
const t = me?.data?.teacher || me?.teacher || me?.data || me;
console.log(
  JSON.stringify(
    {
      displayName: t?.displayName || t?.display_name,
      preferredLanguage: t?.preferredLanguage || t?.preferred_language,
      teacherKeys: Object.keys(t || {}),
      hebrew: /[\u0590-\u05FF]/.test(JSON.stringify(me)),
    },
    null,
    2
  )
);

// student login API probe
const user = ENV.E2E_STUDENT_USERNAME || "";
const pin = ENV.E2E_STUDENT_PIN || "";
const stu = await fetch("http://127.0.0.1:3001/api/student/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: user, pin }),
}).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
let stuBody = "";
try {
  stuBody = typeof stu.text === "function" ? await stu.text() : "";
} catch {
  stuBody = "";
}
console.log(
  JSON.stringify(
    {
      studentApiStatus: stu.status,
      studentUserSet: Boolean(user),
      studentBodySnippet: String(stuBody).slice(0, 200),
      studentHebrew: /[\u0590-\u05FF]/.test(stuBody),
    },
    null,
    2
  )
);
