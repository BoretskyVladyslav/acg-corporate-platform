import type { PricingTier } from "@/src/components/blocks/Pricing";

/** Подія вибору вкладки тарифу з інших блоків (наприклад, Hero). */
export const ACG_PRICING_PRESET_EVENT = "acg-pricing-select-preset";

export type PricingTierPreset = "fop-registration";

export function findTierIndexForPreset(
  tiers: PricingTier[],
  preset: PricingTierPreset,
): number {
  if (!tiers.length) return 0;
  const names = tiers.map((t) => (t.name ?? "").trim());

  if (preset === "fop-registration") {
    const byReg = tiers.findIndex(
      (_, i) => /реєстрація/i.test(names[i]) && /фоп/i.test(names[i]),
    );
    if (byReg >= 0) return byReg;
    const fopNamed = tiers.findIndex(
      (_, i) =>
        /фоп/i.test(names[i]) &&
        !/груп/i.test(names[i]) &&
        !/консультац/i.test(names[i]),
    );
    if (fopNamed >= 0) return fopNamed;
    return Math.min(1, tiers.length - 1);
  }

  return 0;
}

export function dispatchPricingTierPreset(preset: PricingTierPreset): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ACG_PRICING_PRESET_EVENT, {
      detail: { preset },
      bubbles: true,
    }),
  );
}
