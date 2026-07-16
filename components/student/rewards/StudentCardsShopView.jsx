import { useCallback, useEffect, useState } from "react";
import WindowedStudentCardsGrid from "./WindowedStudentCardsGrid.jsx";
import StudentLoadingPanel from "../../ui/StudentLoadingPanel.jsx";
import {
  formatCoinAmountHe,
  SHOP_CARD_ALREADY_OWNED_HE,
  SHOP_CARD_SELL_DUPLICATE_HE,
} from "../../../lib/rewards/rewards-ui.js";

const SHOP_PATH = "/api/student/rewards/cards/shop";
const PURCHASE_PATH = "/api/student/rewards/shop/purchase";
const SELL_DUPLICATE_PATH = "/api/student/rewards/shop/sell-duplicate";

/**
 * Card shop grid — same behavior as /student/cards shop tab.
 *
 * @param {{
 *   T: Record<string, string>,
 *   coinBalance?: number|null,
 *   onCoinBalanceChange?: (balance: number) => void,
 *   onAfterMutation?: () => void | Promise<void>,
 *   studentFullName?: string,
 *   gridClassName?: string,
 *   actionButtonClassName?: string,
 * }} props
 */
export default function StudentCardsShopView({
  T,
  coinBalance = null,
  onCoinBalanceChange,
  onAfterMutation,
  studentFullName = "",
  gridClassName,
  actionButtonClassName = "",
}) {
  const [shop, setShop] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [messageHe, setMessageHe] = useState("");
  const [actionBusy, setActionBusy] = useState("");

  const loadShop = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch(SHOP_PATH, {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        throw new Error(json?.error || "shop_load_failed");
      }
      setShop(Array.isArray(json.shop) ? json.shop : []);
      setPhase("ok");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void loadShop();
  }, [loadShop]);

  const handlePurchase = async (cardId) => {
    const shopCard = shop.find((c) => c.id === cardId);
    if (shopCard?.alreadyOwned || shopCard?.canAfford === false) return;

    setActionBusy(cardId);
    setMessageHe("");
    try {
      const res = await fetch(PURCHASE_PATH, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        setMessageHe(json?.code === "insufficient_coins" ? "Not enough coins to buy this." : "Purchase failed — try again.");
        return;
      }
      setMessageHe(`You bought ${json.card?.name_he || json.card?.nameHe || "the card"}!`);
      if (json.balanceAfter != null && onCoinBalanceChange) {
        onCoinBalanceChange(Math.floor(Number(json.balanceAfter)));
      }
      await loadShop();
      if (onAfterMutation) await onAfterMutation();
    } catch {
      setMessageHe("Network error while purchasing.");
    } finally {
      setActionBusy("");
    }
  };

  const handleSellDuplicate = async (card) => {
    if (!card?.canSellDuplicate || card?.sellbackCoins <= 0) return;

    const confirmed = window.confirm(
      `Sell a duplicate of ${card.nameHe} for ${formatCoinAmountHe(card.sellbackCoins)}?\n` +
        "You'll keep one copy in your collection."
    );
    if (!confirmed) return;

    const busyKey = `sell:${card.id}`;
    setActionBusy(busyKey);
    setMessageHe("");
    try {
      const res = await fetch(SELL_DUPLICATE_PATH, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          idempotencyKey: `card:sellback:${card.id}:${card.duplicateCount ?? 0}`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        setMessageHe(
          json?.code === "no_duplicate"
            ? "No duplicate copy to sell."
            : "Couldn't sell the duplicate — try again."
        );
        return;
      }
      setMessageHe(
        `You sold a duplicate of ${json.card?.name_he || json.card?.nameHe || card.nameHe} and got ${formatCoinAmountHe(json.sellbackCoins || 0)}!`
      );
      if (json.balanceAfter != null && onCoinBalanceChange) {
        onCoinBalanceChange(Math.floor(Number(json.balanceAfter)));
      }
      await loadShop();
      if (onAfterMutation) await onAfterMutation();
    } catch {
      setMessageHe("Network error while selling.");
    } finally {
      setActionBusy("");
    }
  };

  if (phase === "loading") {
    return <StudentLoadingPanel message="Loading card shop..." reportPage />;
  }

  if (phase === "error") {
    return (
      <div className={T.errorBox}>
        <p className={T.errorTitle}>We couldn't load the card shop.</p>
        <button type="button" onClick={() => void loadShop()} className={T.errorBtn}>
          Try again
        </button>
      </div>
    );
  }

  const shopPreviewCards = shop.map((c) => (c.alreadyOwned ? c : { ...c, showLockedStamp: true }));

  return (
    <div className="space-y-3 min-w-0">
      {coinBalance != null ? (
        <p className={`text-sm font-semibold ${T.statValue}`}>
          Coin balance: {formatCoinAmountHe(coinBalance)}
        </p>
      ) : null}
      {messageHe ? <p className={`text-sm ${T.userMessage || T.tileSub}`}>{messageHe}</p> : null}
      <WindowedStudentCardsGrid
        items={shop}
        emptyMessage="No cards available to buy right now."
        T={T}
        previewCards={shopPreviewCards}
        studentFullName={studentFullName}
        gridClassName={gridClassName}
        getPreviewAllowDownload={(card) => card.alreadyOwned === true}
        renderCardProps={(card) => {
          const canBuy = card.canAfford === true && !card.alreadyOwned;
          const canSell = card.canSellDuplicate === true && card.sellbackCoins > 0;
          const ownedOnly = card.alreadyOwned && !canSell;
          const priceLabel = Math.floor(Number(card.priceCoins) || 0).toLocaleString("en-US");
          const sellBusy = actionBusy === `sell:${card.id}`;
          const buyBusy = actionBusy === card.id;
          return {
            showLockedStamp: !card.alreadyOwned,
            allowDownload: card.alreadyOwned,
            footer: (
              <>
                <p className={`text-sm font-semibold ${T.statValue}`}>
                  Buy price: {formatCoinAmountHe(card.priceCoins)}
                </p>
                {card.sellbackCoins > 0 ? (
                  <p className={`text-xs leading-snug ${T.tileSub}`}>
                    Sell value: {formatCoinAmountHe(card.sellbackCoins)}
                  </p>
                ) : (
                  <p className={`text-xs min-h-[1.125rem] ${T.tileSub}`}>{"\u00a0"}</p>
                )}
                <p className={`text-xs leading-snug min-h-[1.125rem] ${T.tileSub}`}>
                  {!card.alreadyOwned && !canBuy
                    ? card.missingCoins > 0
                      ? `You need ${formatCoinAmountHe(card.missingCoins)} more`
                      : "Not enough coins"
                    : "\u00a0"}
                </p>
                <button
                  type="button"
                  disabled={ownedOnly || sellBusy || buyBusy || (!canBuy && !canSell)}
                  onClick={() => {
                    if (canSell) void handleSellDuplicate(card);
                    else if (canBuy) void handlePurchase(card.id);
                  }}
                  className={
                    (ownedOnly
                      ? `${T.ctaPrimary} !text-sm md:!text-sm w-full md:whitespace-nowrap !bg-amber-500 hover:!bg-amber-500 !text-white shadow-md cursor-default disabled:!opacity-100`
                      : canSell
                        ? `${T.ctaGames} !text-sm md:!text-sm w-full md:whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none`
                        : `${T.ctaPrimary} !text-sm md:!text-sm w-full md:whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none`) +
                    (actionButtonClassName ? ` ${actionButtonClassName}` : "")
                  }
                >
                  {canSell
                    ? sellBusy
                      ? "Selling..."
                      : SHOP_CARD_SELL_DUPLICATE_HE
                    : card.alreadyOwned
                      ? SHOP_CARD_ALREADY_OWNED_HE
                      : buyBusy
                        ? "Buying..."
                        : `Buy for ${priceLabel}`}
                </button>
              </>
            ),
          };
        }}
      />
    </div>
  );
}
