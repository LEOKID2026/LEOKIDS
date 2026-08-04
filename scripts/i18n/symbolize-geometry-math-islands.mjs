import fs from "fs";

const path = "utils/geometry-explanations.js";
let s = fs.readFileSync(path, "utf8");

const reps = [
  [['"4 ×", "side × side"'], '["4 ×", "s × s"]'],
  [['"length × width"'], '["ℓ × w"]'],
  [['"base × height", "2"'], '["b × h", "2"]'],
  [['"2πr", "π × radius²"'], '["2πr", "π × r²"]'],
  [['"side²", "4 ×"'], '["s²", "4 ×"]'],
  [['"length × width", "the sum of the sides × 2"'], '["ℓ × w", "2(ℓ+w)"]'],
  [['"side²", "side³"'], '["s²", "s³"]'],
  [['"base area × height"'], '["A_base × h"]'],
  [['"(⅓)×base area×height", "π"'], '["(⅓)×A_base×h", "π"]'],
  [['"√2 × side"'], '["√2 × s"]'],
  [['"(area × 2) ÷ base"'], '["(A × 2) ÷ b"]'],
  [['"base × height", "area ÷ base"'], '["b × h", "A ÷ b"]'],
  [['"(base 1 + base 2)", "(area × 2) ÷ (the sum of the bases)"'], '["(b1 + b2)", "(A × 2) ÷ (b1 + b2)"]'],
  [['"area ÷ base"'], '["A ÷ b"]'],
  [['"2", "area ÷ base"'], '["2", "A ÷ b"]'],
  [['"√(length² + width²)"'], '["√(ℓ² + w²)"]'],
  [['"side × √2"'], '["s × √2"]'],
  [['"√(side²+side²)", "side×√2"'], '["√(s²+s²)", "s×√2"]'],
  [['"2", "√2 × side"'], '["2", "√2 × s"]'],
  [['"π × radius²"'], '["π × r²"]'],
  [['"area ∝ r², perimeter ∝ r"'], '["A ∝ r², P ∝ r"]'],
  [['"1 equilateral (all equal), 2 isosceles (two equal), 3 scalene"'], '["1 متساوي الأضلاع، 2 متساوي الساقين، 3 مختلف الأضلاع"]'],
  [['"180° − (angle 1 + angle 2)"'], '["180° − (∠1 + ∠2)"]'],
];

let n = 0;
for (const [from, to] of reps) {
  const f = from[0];
  if (!s.includes(f)) continue;
  const c = s.split(f).length - 1;
  s = s.split(f).join(to);
  n += c;
  console.log("ok", c, f);
}
fs.writeFileSync(path, s);
console.log("total", n);
