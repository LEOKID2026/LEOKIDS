import fs from "fs";

const indexPath = "data/help-center/ar-001/index.js";
let index = fs.readFileSync(indexPath, "utf8");
index = index
  .replaceAll("دليل للآباء والأمهات", "دليل لأولياء الأمور")
  .replaceAll(
    "قم بالتسجيل وإدارة الأطفال والتقارير وأدوات أولياء الأمور.",
    "سجّل الدخول، وأدر الأطفال والتقارير وأدوات أولياء الأمور."
  )
  .replaceAll("دليل للطلاب", "دليل للتلاميذ")
  .replaceAll("دليل للتلاميذ", "دليل للتلاميذ")
  .replaceAll(
    "ما يجب التدرب عليه في كل موضوع وكيف.",
    "ما يجب التدرّب عليه في كل مادة وكيف."
  );
fs.writeFileSync(indexPath, index);

const studentsPath = "data/help-center/ar-001/students.js";
let students = fs.readFileSync(studentsPath, "utf8");
students = students
  .replaceAll("الموضوعات والعملات المعدنية", "المواد والعملات المعدنية")
  .replaceAll("بطاقات الموضوع", "بطاقات المواد")
  .replaceAll('"اختيار الموضوع والصف"', '"اختيار المادة والصف"')
  .replaceAll("التدريب في الموضوع الذي اخترته", "التمرين في المادة التي اخترتها")
  .replaceAll('      "موضوع",', '      "مادة",')
  .replaceAll(
    "اختر موضوعًا من القائمة. سوف تتناسب الأنشطة مع درجتك.",
    "اختر مادة من القائمة. ستتناسب الأنشطة مع صفّك."
  )
  .replaceAll("للطلاب", "للتلاميذ")
  .replaceAll("الطلاب", "التلاميذ")
  .replaceAll("الطالب", "التلميذ");
fs.writeFileSync(studentsPath, students);

const subjectsPath = "data/help-center/ar-001/subjects.js";
let subjects = fs.readFileSync(subjectsPath, "utf8");
subjects = subjects.replaceAll('      "موضوع",', '      "مادة",');
fs.writeFileSync(subjectsPath, subjects);

for (const f of [
  "data/help-center/ar-001/parents.js",
  "data/help-center/ar-001/parent-report.js",
  "data/help-center/ar-001/index.js",
]) {
  let t = fs.readFileSync(f, "utf8");
  const o = t;
  t = t
    .replaceAll("للطلاب", "للتلاميذ")
    .replaceAll("الطلاب", "التلاميذ")
    .replaceAll("الطالب", "التلميذ")
    .replaceAll("للآباء والأمهات", "لأولياء الأمور")
    .replaceAll("الآباء والأمهات", "أولياء الأمور");
  if (t !== o) {
    fs.writeFileSync(f, t);
    console.log("updated", f);
  }
}

console.log("help terminology pass done");
