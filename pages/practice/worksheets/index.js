import PracticeSeoLandingPage from "../../../components/seo/PracticeSeoLandingPage";
import { useWorksheetsPageContent } from "../../../hooks/useWorksheetsPageContent.js";

export default function PublicWorksheetsPage() {
  const content = useWorksheetsPageContent();
  if (!content) return null;
  return <PracticeSeoLandingPage content={content} />;
}
