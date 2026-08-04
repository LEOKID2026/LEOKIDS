import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { useGuidePageContent } from "../../hooks/useGuidePageContent.js";

export default function GuidePage() {
  const content = useGuidePageContent("no-print-worksheets");
  if (!content) return null;
  return <GuideSeoArticlePage content={content} />;
}
