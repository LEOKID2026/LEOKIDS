import PracticeSeoLandingPage from "../../components/seo/PracticeSeoLandingPage";
import { getPracticePageContent } from "../../data/seo/practice-pages";

export default function PracticeHubPage() {
  const content = getPracticePageContent("hub");
  return <PracticeSeoLandingPage content={content} />;
}
