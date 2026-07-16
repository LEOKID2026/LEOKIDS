import GuideSeoArticlePage from "../../components/seo/GuideSeoArticlePage";
import { getGuidePageContent } from "../../data/seo/guide-pages";

export default function GuidePage() {
  const content = getGuidePageContent("parent-progress-tracking");
  return <GuideSeoArticlePage content={content} />;
}
