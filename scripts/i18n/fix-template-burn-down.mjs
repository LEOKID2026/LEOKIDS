import fs from "node:fs";

const file = "lib/worksheets/worksheet-payload-build.server.js";
let src = fs.readFileSync(file, "utf8");
src = src.replace(/\{globalBurnDownCopy\(("([^"]+)",\s*"([^"]+)")\)\}/g, "${globalBurnDownCopy($1)}");
fs.writeFileSync(file, src);
console.log("fixed", file);

const svgFile = "lib/worksheets/worksheet-geometry-diagram-svg.js";
let svg = fs.readFileSync(svgFile, "utf8");
svg = svg.replace(
  /font-family=\{globalBurnDownCopy\(("([^"]+)",\s*"([^"]+)")\)\}/,
  'font-family="${globalBurnDownCopy($1)}"'
);
fs.writeFileSync(svgFile, svg);
console.log("fixed", svgFile);
