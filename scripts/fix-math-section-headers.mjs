import fs from "fs";

const replacements = [
  [/^## 3\. Example$/gm, "## 3. Visual / concrete example"],
  [/^## 3\. Visual example$/gm, "## 3. Visual / concrete example"],
  [/^## 6\. Let's check together$/gm, "## 6. Common mistake — watch out!"],
  [/^## 6\. Let us check together$/gm, "## 6. Common mistake — watch out!"],
  [/^## 2\. Explanation$/gm, "## 2. Simple explanation"],
  [/^## 1\. What we learn\?$/gm, "## 1. What are we learning?"],
  [/^## 4\. Let's solve$/gm, "## 4. Let's solve together"],
];

let fixed = 0;
for (const g of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
  const order = (await import(`../lib/learning-book/math-${g}-registry.js`))[
    `MATH_${g.toUpperCase()}_PAGE_ORDER`
  ];
  for (const id of order) {
    const filePath = `docs/learning-book/math/${g}/drafts/${id}.md`;
    let content = fs.readFileSync(filePath, "utf8");
    const original = content;
    for (const [re, rep] of replacements) content = content.replace(re, rep);
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf8");
      fixed++;
    }
  }
}
console.log(`Fixed ${fixed} files`);
