import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const guidesDir = path.join(ROOT, "pages/guides");
for (const file of fs.readdirSync(guidesDir)) {
  if (!file.endsWith(".js") || file === "index.js") continue;
  const slug = file.replace(".js", "");
  const content = `import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { useGuidePageContent } from "../../hooks/useGuidePageContent.js";

export default function GuidePage() {
  const content = useGuidePageContent("${slug}");
  if (!content) return null;
  return <GuideSeoArticlePage content={content} />;
}
`;
  fs.writeFileSync(path.join(guidesDir, file), content);
}

const practiceDir = path.join(ROOT, "pages/practice");
for (const file of fs.readdirSync(practiceDir)) {
  if (!file.endsWith(".js") || file === "index.js") continue;
  const slug = file.replace(".js", "");
  const content = `import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { usePracticePageContent } from "../../hooks/usePracticePageContent.js";

export default function PracticePage() {
  const content = usePracticePageContent("${slug}");
  if (!content) return null;
  return <PracticeSeoLandingPage content={content} />;
}
`;
  fs.writeFileSync(path.join(practiceDir, file), content);
}

console.log("Updated guide and practice pages");
