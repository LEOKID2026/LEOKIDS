import cardCatalog from "../../content-packs/en/rewards/card-catalog.json" with { type: "json" };

/** @deprecated Use resolveRewardCardEntry / loadRewardCardCatalog from reward-pack-copy.js */
export const REWARD_CARD_GLOBAL_EN_CATALOG = Object.freeze(
  Object.fromEntries(
    Object.entries(cardCatalog.cards || {}).map(([cardKey, entry]) => [
      cardKey,
      {
        name: entry.title,
        description: entry.description,
      },
    ]),
  ),
);
