import { withStudentCardsApi } from "../../../../../lib/rewards/server/student-cards-api-auth.server.js";
import { getStudentCardsCollectionView } from "../../../../../lib/rewards/server/reward-cards.server.js";

export default async function handler(req, res) {
  await withStudentCardsApi(req, res, async ({ supabase, studentId, contentLocale }) => {
    const view = await getStudentCardsCollectionView(supabase, studentId, contentLocale);
    return res.status(200).json({ ok: true, contentLocale, ...view });
  });
}
