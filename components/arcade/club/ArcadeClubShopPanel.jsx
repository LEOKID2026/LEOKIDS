import Link from "next/link";
import { useStudentTheme } from "../../../contexts/StudentThemeContext.jsx";
import StudentCardsShopView from "../../student/rewards/StudentCardsShopView.jsx";

/**
 * @param {{
 *   gh: Record<string, string>,
 *   coinBalance?: number|null,
 *   onCoinBalanceChange?: (balance: number) => void,
 *   studentFullName?: string,
 * }} props
 */
export default function ArcadeClubShopPanel({
  gh,
  coinBalance = null,
  onCoinBalanceChange,
  studentFullName = "",
}) {
  const { tokens: T } = useStudentTheme();

  return (
    <div className={`${gh.arcadePanelShop || gh.card} space-y-4 text-left min-w-0`} dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>Card shop</h3>
        <Link href="/student/cards" className={gh.btnJoinCode || gh.btnSecondary}>
          My collection
        </Link>
      </div>
      <StudentCardsShopView
        T={T}
        coinBalance={coinBalance}
        onCoinBalanceChange={onCoinBalanceChange}
        studentFullName={studentFullName}
      />
    </div>
  );
}
