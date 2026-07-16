import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { getPracticePageContent } from "../../data/seo/practice-pages";

export default function PracticePage() {
  const content = getPracticePageContent("no-print");
  return <PracticeSeoLandingPage content={content} />;
}
