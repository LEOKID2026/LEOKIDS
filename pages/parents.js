import MarketingLandingPage from "../components/marketing/MarketingLandingPage";
import { PARENTS_LANDING } from "../data/marketing/landing-pages.js";

export default function ParentsLandingPage() {
  return (
    <MarketingLandingPage
      audience="parents"
      content={PARENTS_LANDING}
      showPublicSeoEntrySection
    />
  );
}
