import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { useGuidePageContent } from "../../hooks/useGuidePageContent.js";

export default function GuidesHubPage() {
  const content = useGuidePageContent("hub");
  if (!content) return null;
  return <GuideSeoArticlePage content={content} isHub />;
}
