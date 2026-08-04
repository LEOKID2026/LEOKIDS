import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { useGuidePageContent } from "../../hooks/useGuidePageContent.js";

export default function GuidePage() {
  const content = useGuidePageContent("math-practice-at-home");
  if (!content) return null;
  return <GuideSeoArticlePage content={content} />;
}
