import fs from "fs";

const expected = [
  "## 1. What are we learning?",
  "## 2. Simple explanation",
  "## 3. Visual / concrete example",
  "## 4. Let's solve together",
  "## 5. Try it yourself",
  "## 6. Common mistake — watch out!",
  "## 7. Let's practice!",
];

const bad = [];
for (const g of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
  const order = (await import(`../lib/learning-book/math-${g}-registry.js`))[
    `MATH_${g.toUpperCase()}_PAGE_ORDER`
  ];
  for (const id of order) {
    const path = `docs/learning-book/math/${g}/drafts/${id}.md`;
    const c = fs.readFileSync(path, "utf8");
    const issues = [];
    if (c.includes("title_hebrew")) issues.push("title_hebrew");
    if (c.includes("[DRAFT")) issues.push("DRAFT marker");
    if (/[\u0590-\u05FF]/.test(c)) issues.push("Hebrew");
    for (let i = 0; i < 7; i++) {
      if (!c.includes(expected[i])) {
        const got = c.match(new RegExp(`^## ${i + 1}\\. .+`, "m"));
        if (got && got[0] !== expected[i]) issues.push(`S${i + 1}: ${got[0]}`);
        else if (!got) issues.push(`S${i + 1}: missing`);
      }
    }
    if (issues.length) bad.push({ page: `${g}/${id}`, issues });
  }
}

console.log(`Pages with issues: ${bad.length}`);
for (const b of bad) console.log(`${b.page}: ${b.issues.join("; ")}`);
