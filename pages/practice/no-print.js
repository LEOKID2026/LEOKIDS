import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { usePracticePageContent } from "../../hooks/usePracticePageContent.js";

export default function PracticePage() {
  const content = usePracticePageContent("no-print");
  if (!content) return null;
  return <PracticeSeoLandingPage content={content} />;
}
