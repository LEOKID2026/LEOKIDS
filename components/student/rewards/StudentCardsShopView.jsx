import { useCallback, useEffect, useState } from "react";
import WindowedStudentCardsGrid from "./WindowedStudentCardsGrid.jsx";
import StudentLoadingPanel from "../../ui/StudentLoadingPanel.jsx";
import {
  formatCoinAmountHe,
} from "../../../lib/rewards/rewards-ui.js";
import { useRewardUiCopy } from "../../../lib/rewards/reward-locale-context.jsx";

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
  const copy = useRewardUiCopy();
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
        setMessageHe(
          json?.code === "insufficient_coins"
            ? copy("shop", "notEnoughCoins")
            : copy("shop", "purchaseFailed"),
        );
        return;
      }
      setMessageHe(
        copy("shop", "purchaseSuccess", {
          name: json.card?.name_he || json.card?.nameHe || copy("fallback", "rewardCard"),
        }),
      );
      if (json.balanceAfter != null && onCoinBalanceChange) {
        onCoinBalanceChange(Math.floor(Number(json.balanceAfter)));
      }
      await loadShop();
      if (onAfterMutation) await onAfterMutation();
    } catch {
      setMessageHe(copy("shop", "purchaseNetworkError"));
    } finally {
      setActionBusy("");
    }
  };

  const handleSellDuplicate = async (card) => {
    if (!card?.canSellDuplicate || card?.sellbackCoins <= 0) return;

    const confirmed = window.confirm(
      `${copy("shop", "sellConfirmTitle", { name: card.nameHe, amount: formatCoinAmountHe(card.sellbackCoins) })}\n${copy("shop", "sellConfirmBody")}`,
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
            ? copy("shopView", "noDuplicateToSell")
            : copy("shopView", "sellFailed"),
        );
        return;
      }
      setMessageHe(
        copy("shopView", "sellSuccess", {
          name: json.card?.name_he || json.card?.nameHe || card.nameHe,
          amount: formatCoinAmountHe(json.sellbackCoins || 0),
        }),
      );
      if (json.balanceAfter != null && onCoinBalanceChange) {
        onCoinBalanceChange(Math.floor(Number(json.balanceAfter)));
      }
      await loadShop();
      if (onAfterMutation) await onAfterMutation();
    } catch {
      setMessageHe(copy("shopView", "sellNetworkError"));
    } finally {
      setActionBusy("");
    }
  };

  if (phase === "loading") {
    return <StudentLoadingPanel message={copy("shopView", "loading")} reportPage />;
  }

  if (phase === "error") {
    return (
      <div className={T.errorBox}>
        <p className={T.errorTitle}>{copy("shopView", "loadErrorTitle")}</p>
        <button type="button" onClick={() => void loadShop()} className={T.errorBtn}>
          {copy("shopView", "tryAgain")}
        </button>
      </div>
    );
  }

  const shopPreviewCards = shop.map((c) => (c.alreadyOwned ? c : { ...c, showLockedStamp: true }));

  return (
    <div className="space-y-3 min-w-0">
      {coinBalance != null ? (
        <p className={`text-sm font-semibold ${T.statValue}`}>
          {copy("shopView", "coinBalance", { amount: formatCoinAmountHe(coinBalance) })}
        </p>
      ) : null}
      {messageHe ? <p className={`text-sm ${T.userMessage || T.tileSub}`}>{messageHe}</p> : null}
      <WindowedStudentCardsGrid
        items={shop}
        emptyMessage={copy("shopView", "empty")}
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
                  {copy("shopView", "buyPrice", { amount: formatCoinAmountHe(card.priceCoins) })}
                </p>
                {card.sellbackCoins > 0 ? (
                  <p className={`text-xs leading-snug ${T.tileSub}`}>
                    {copy("shopView", "sellValue", { amount: formatCoinAmountHe(card.sellbackCoins) })}
                  </p>
                ) : (
                  <p className={`text-xs min-h-[1.125rem] ${T.tileSub}`}>{"\u00a0"}</p>
                )}
                <p className={`text-xs leading-snug min-h-[1.125rem] ${T.tileSub}`}>
                  {!card.alreadyOwned && !canBuy
                    ? card.missingCoins > 0
                      ? copy("shopView", "needMoreCoins", {
                          amount: formatCoinAmountHe(card.missingCoins),
                        })
                      : copy("shopView", "notEnoughCoinsShort")
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
                      ? copy("shopView", "selling")
                      : copy("shop", "sellDuplicate")
                    : card.alreadyOwned
                      ? copy("shop", "alreadyOwned")
                      : buyBusy
                        ? copy("shopView", "buying")
                        : copy("shopView", "buyFor", { price: priceLabel })}
                </button>
              </>
            ),
          };
        }}
      />
    </div>
  );
}
