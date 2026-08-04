import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { useGuidePageContent } from "../../hooks/useGuidePageContent.js";

export default function GuidePage() {
  const content = useGuidePageContent("english-vocabulary-practice");
  if (!content) return null;
  return <GuideSeoArticlePage content={content} />;
}
