const fs = require("fs");
const path = require("path");

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(js|ts)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const roots = [
  path.join(process.cwd(), "pages", "api", "teacher"),
  path.join(process.cwd(), "pages", "api", "school"),
  path.join(process.cwd(), "pages", "api", "guardian"),
  path.join(process.cwd(), "pages", "api", "auth"),
  path.join(process.cwd(), "lib", "teacher-server"),
  path.join(process.cwd(), "lib", "school-server"),
  path.join(process.cwd(), "lib", "guardian-server"),
  path.join(process.cwd(), "lib", "auth"),
];

const unique = new Map();
const codeOnly = new Map();

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    // sendXApiError(res, status, code, "message")
    const re =
      /send(?:Teacher|School|Persona|Guardian)ApiError\(\s*[^,]+,\s*[^,]+,\s*["'`]([^"'`]+)["'`]\s*(?:,\s*["'`]([^"'`]+)["'`])?\s*\)/g;
    let m;
    while ((m = re.exec(text))) {
      const code = m[1];
      const msg = m[2] || "";
      if (msg && (/\s/.test(msg) || /[A-Z]/.test(msg))) {
        const key = msg;
        if (!unique.has(key)) unique.set(key, { file: rel, code, text: msg });
      } else if (!msg || msg === code) {
        if (!codeOnly.has(code)) codeOnly.set(code, { file: rel, code });
      }
    }
    // also bare string 4th args where message var used: harder; catch literal 4th args with simpler scan
    const re2 =
      /send(?:Teacher|School|Persona|Guardian)ApiError\([^)]*?,\s*["'`]([A-Za-z][^"'`]{3,})["'`]\s*\)/g;
    while ((m = re2.exec(text))) {
      const s = m[1];
      if (/^[a-z][a-z0-9_]*$/.test(s)) {
        if (!codeOnly.has(s)) codeOnly.set(s, { file: rel, code: s });
        continue;
      }
      if (!unique.has(s)) unique.set(s, { file: rel, code: "", text: s });
    }
  }
}

const prose = [...unique.values()].sort((a, b) => a.text.localeCompare(b.text));
const codes = [...codeOnly.values()].sort((a, b) => a.code.localeCompare(b.code));
const outDir = path.join(process.cwd(), "artifacts", "phase9a");
fs.writeFileSync(path.join(outDir, "teacher-school-helper-prose.json"), JSON.stringify(prose, null, 2));
fs.writeFileSync(path.join(outDir, "teacher-school-helper-codes.json"), JSON.stringify(codes, null, 2));
console.log("PROSE", prose.length);
prose.forEach((p) => console.log(`- [${p.file}] (${p.code}) ${p.text}`));
console.log("\nCODES", codes.length);
codes.slice(0, 80).forEach((c) => console.log(`- ${c.code}`));
