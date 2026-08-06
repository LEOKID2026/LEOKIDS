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
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    o[t.slice(0, i).trim()] = v;
  }
  return o;
}

const ENV = { ...load(".env.local"), ...load(".env.e2e.local"), ...process.env };
const HE = /[\u0590-\u05FF]/;
const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";
const BASE = "http://127.0.0.1:3001";

const tokRes = await fetch(
  `${ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL}/auth/v1/token?grant_type=password`,
  {
    method: "POST",
    headers: {
      apikey: ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
);
const tok = await tokRes.json();
if (!tok.access_token) {
  console.log(JSON.stringify({ error: "no token", tok }, null, 2));
  process.exit(1);
}

const results = [];
for (const p of [
  "/api/teacher/me",
  "/api/teacher/classes",
  "/api/teacher/dashboard",
]) {
  const r = await fetch(`${BASE}${p}`, {
    headers: {
      Authorization: `Bearer ${tok.access_token}`,
      Accept: "application/json",
      "Accept-Language": "en-US",
    },
  });
  const text = await r.text();
  const hits = [];
  const re = /[\u0590-\u05FF][^\n]{0,100}/g;
  let m;
  while ((m = re.exec(text)) && hits.length < 12) hits.push(m[0]);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  results.push({
    path: p,
    status: r.status,
    hebrew: HE.test(text),
    hits,
    classCount: json?.data?.classes?.length ?? json?.classes?.length ?? null,
    firstClassId:
      json?.data?.classes?.[0]?.classId ||
      json?.data?.classes?.[0]?.id ||
      json?.classes?.[0]?.classId ||
      null,
  });
}

fs.writeFileSync(
  "docs/reports/en-final-teacher-api-hebrew-probe.json",
  JSON.stringify({ emailUsed: email, results }, null, 2)
);
console.log(JSON.stringify(results, null, 2));
