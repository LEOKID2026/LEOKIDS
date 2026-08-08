const fs = require("fs");
const path = require("path");
const validation = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "locales", "id-ID", "validation.json"), "utf8")
);
const mapped = new Set(Object.keys(validation.api || {}));

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(js|ts)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const codeSet = new Map(); // code -> sample file
const areas = ["teacher", "school", "parent", "student", "guardian", "auth"];
for (const area of areas) {
  const dir = path.join(process.cwd(), "pages", "api", area);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    // sendXApiError(..., "code", ...)
    const re = /send(?:Teacher|School|Persona|Guardian)ApiError\(\s*[^,]+,\s*[^,]+,\s*["'`]([a-z][a-z0-9_]*)["'`]/g;
    let m;
    while ((m = re.exec(text))) {
      const code = m[1];
      if (!codeSet.has(code)) codeSet.set(code, { area, file: rel });
    }
    // error: "snake_code" or code: "snake"
    const re2 = /\b(?:error|code|errorCode)\s*:\s*["'`]([a-z][a-z0-9_]{2,})["'`]/g;
    while ((m = re2.exec(text))) {
      const code = m[1];
      if (code.includes(" ") || /[A-Z]/.test(code)) continue;
      if (!codeSet.has(code)) codeSet.set(code, { area, file: rel });
    }
  }
}

const allCodes = [...codeSet.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const covered = [];
const missing = [];
for (const [code, meta] of allCodes) {
  if (mapped.has(code)) covered.push({ code, ...meta });
  else missing.push({ code, ...meta });
}

const out = {
  validationApiKeys: [...mapped].sort(),
  stableCodesFound: allCodes.length,
  coveredCount: covered.length,
  missingCount: missing.length,
  covered: covered.map((c) => c.code),
  missing: missing.map((c) => ({ code: c.code, area: c.area, file: c.file })),
};
fs.writeFileSync(
  path.join(process.cwd(), "artifacts", "phase9a", "validation-code-coverage.json"),
  JSON.stringify(out, null, 2)
);
console.log(JSON.stringify({ stableCodesFound: allCodes.length, covered: covered.length, missing: missing.length }, null, 2));
console.log("\nMISSING sample:");
missing.slice(0, 100).forEach((m) => console.log(`- [${m.area}] ${m.code}`));
