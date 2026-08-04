import fs from "fs";
const p="pages/teacher/students/activities/new.js";
let s=fs.readFileSync(p,"utf8");
const reps=[
 ["Could not generate questions", '{actCopy("could_not_generate")}'],
 ['setError("Please select at least one student")', 'setError(actCopy("err_select_student"))'],
 ['setError("Please enter a title")', 'setError(actCopy("err_enter_title"))'],
 ['setError("Please generate questions first")', 'setError(actCopy("err_generate_first"))'],
 ['setError("A quiz requires a time limit")', 'setError(actCopy("err_quiz_time"))'],
 ['"Creation failed"', 'actCopy("creation_failed")'],
 ['setError("Network error")', 'setError(actCopy("network_error"))'],
];
for (const [a,b] of reps){ if(!s.includes(a)) console.log("MISS",a); else s=s.split(a).join(b); }
fs.writeFileSync(p,s);
console.log("errors wired");
