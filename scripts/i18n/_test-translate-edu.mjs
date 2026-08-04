import { translateEduNl } from "./_nl-NL-edu-translate.mjs";

const samples = [
  "Today we will use a formula for the area of a square:",
  "Today we will apply parallel and perpendicular to the sides of a rectangle.",
  "Today we'll learn about the diagonal of a parallelogram in geometry — ideas, not one formula for every case.",
  "Area = side × side.",
  "Now you know how to find the area of a square — with a grid or by multiplying!",
];
for (const s of samples) {
  console.log("EN:", s);
  console.log("NL:", translateEduNl(s, { childFacing: true }));
  console.log("---");
}
