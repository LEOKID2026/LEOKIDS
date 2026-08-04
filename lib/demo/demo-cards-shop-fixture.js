/**
 * Deterministic demo shop catalog — used when live demo shop API / Supabase is unavailable.
 * Prices are fixed so afford / insufficient-balance paths are stable with DEMO_COIN_BALANCE (150).
 * Names are Arabic-script so locale audits do not flag English chrome on /ar-001.
 */

const PLACEHOLDER = "/rewards/cards/placeholders/regular/default.svg";

/**
 * @param {number} [coinBalance=150]
 * @returns {{ shop: Array<Record<string, unknown>> }}
 */
export function buildDemoCardsShopFixture(coinBalance = 150) {
  const balance = Math.max(0, Math.floor(Number(coinBalance) || 0));
  const rows = [
    {
      id: "demo-shop-star-badge",
      cardKey: "demo_shop_star_badge",
      cardType: "shop",
      nameHe: "شارة النجمة",
      rarityHe: "شائعة",
      rarity: "common",
      priceCoins: 50,
      sellbackCoins: 10,
      imageUrl: PLACEHOLDER,
      imageThumbUrl: PLACEHOLDER,
      imageDisplayUrl: PLACEHOLDER,
      alreadyOwned: false,
    },
    {
      id: "demo-shop-rainbow-pin",
      cardKey: "demo_shop_rainbow_pin",
      cardType: "shop",
      nameHe: "دبوس قوس قزح",
      rarityHe: "نادرة",
      rarity: "rare",
      priceCoins: 120,
      sellbackCoins: 24,
      imageUrl: PLACEHOLDER,
      imageThumbUrl: PLACEHOLDER,
      imageDisplayUrl: PLACEHOLDER,
      alreadyOwned: false,
    },
    {
      id: "demo-shop-golden-crown",
      cardKey: "demo_shop_golden_crown",
      cardType: "shop",
      nameHe: "التاج الذهبي",
      rarityHe: "ملحمية",
      rarity: "epic",
      priceCoins: 400,
      sellbackCoins: 80,
      imageUrl: PLACEHOLDER,
      imageThumbUrl: PLACEHOLDER,
      imageDisplayUrl: PLACEHOLDER,
      alreadyOwned: false,
    },
  ];

  return {
    shop: rows.map((card) => {
      const price = Math.floor(Number(card.priceCoins) || 0);
      const missing = Math.max(0, price - balance);
      return {
        ...card,
        canAfford: balance >= price,
        missingCoins: missing,
        canSellDuplicate: false,
        duplicateCount: 0,
        sellbackPercent: 20,
      };
    }),
  };
}
