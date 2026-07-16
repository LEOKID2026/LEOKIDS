import PracticeSeoLandingPage from "../../../components/seo/PracticeSeoLandingPage";
import { getWorksheetsPageContent } from "../../../data/seo/worksheets-pages.en.js";

export default function PublicWorksheetsPage() {
  const content = getWorksheetsPageContent();
  return <PracticeSeoLandingPage content={content} />;
}
