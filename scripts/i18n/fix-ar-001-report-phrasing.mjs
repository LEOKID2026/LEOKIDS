import fs from "fs";
import path from "path";

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith(".json")) out.push(p);
  }
  return out;
}

let n = 0;
for (const p of [...walk("content-packs/ar-001"), ...walk("locales/ar-001")]) {
  let t = fs.readFileSync(p, "utf8");
  const o = t;
  t = t.split('"ارتفاعات"').join('"الارتفاعات"');
  t = t.split(
    "اجمع المزيد من عناصر التدريب؛ يتم تأجيل الاستنتاجات."
  ).join("اجمع المزيد من عناصر التمرين؛ أُرجئت الاستنتاجات إلى حين توافر أدلة كافية.");
  if (t !== o) {
    fs.writeFileSync(p, t);
    n += 1;
    console.log(p);
  }
}

const rp = "locales/ar-001/reports.json";
const r = JSON.parse(fs.readFileSync(rp, "utf8"));
function fix(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      if (k === "gatingApplied" || v.includes("تم تأجيل بعض التفاصيل التشخيصية")) {
        obj[k] = "أُرجئت بعض التفاصيل التحليلية إلى حين توافر أدلة كافية";
      }
      if (v.includes("يحتاج إلى مزيد من التدريب")) {
        obj[k] = v.replaceAll("يحتاج إلى مزيد من التدريب", "يحتاج إلى مزيد من التمرين");
      }
      if (v.includes("يمكنه استخدام المزيد من التدريب")) {
        obj[k] = v.replaceAll(
          "يمكنه استخدام المزيد من التدريب",
          "يحتاج إلى مزيد من التمرين"
        );
      }
    } else fix(v);
  }
}
fix(r);
fs.writeFileSync(rp, JSON.stringify(r, null, 2) + "\n");
console.log("heights+report files", n);
