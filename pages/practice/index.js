import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { usePracticePageContent } from "../../hooks/usePracticePageContent.js";

export default function PracticeHubPage() {
  const content = usePracticePageContent("hub");
  if (!content) return null;
  return <PracticeSeoLandingPage content={content} />;
}
