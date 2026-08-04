import fs from "node:fs";
import path from "node:path";

const EN =
  /\b(Leaderboard|operations|king|board|help board|concept board|leveled up|Welcome|Loading|Click|Try again|Answer key|Create worksheet|All grades|Science|Math\b|Geometry|student|teacher|parent)\b/;

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".json")) a.push(p);
  }
  return a;
}

const hits = [];
for (const f of walk("locales/nl-NL")) {
  const obj = JSON.parse(fs.readFileSync(f, "utf8"));
  const stack = [["", obj]];
  while (stack.length) {
    const [k, v] = stack.pop();
    if (typeof v === "string") {
      if (EN.test(v)) hits.push({ f, k, v: v.slice(0, 140) });
    } else if (v && typeof v === "object") {
      for (const [ck, cv] of Object.entries(v)) stack.push([k ? `${k}.${ck}` : ck, cv]);
    }
  }
}
console.log({ hitCount: hits.length });
console.log(hits.slice(0, 60).map((h) => `${h.f} :: ${h.k} :: ${h.v}`).join("\n"));
