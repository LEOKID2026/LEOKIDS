import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { getPracticePageContent } from "../../data/seo/practice-pages";

export default function PracticePage() {
  const content = getPracticePageContent("parent-reports");
  return <PracticeSeoLandingPage content={content} />;
}
