import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";

/** Тип консультації для лідів (Hero, Pricing, `/api/sendpulse`). */
export const ACG_LEAD_INTENT_KEY = "acg_lead_intent";

export type LeadIntentValue =
  | "free_consultation"
  | "paid_consultation"
  /** Зворотна сумісність з попередніми CTA. */
  | "general_consultation";

const PAID_CONSULTATION_TIER = "Консультація";

function clearSelectedPricingTier(): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ACG_SELECTED_PRICING_TIER_KEY);
    }
  } catch {
    /* ignore */
  }
}

function setSelectedPricingTier(tierName: string): void {
  const t = tierName.trim();
  if (!t) return;
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ACG_SELECTED_PRICING_TIER_KEY, t);
    }
  } catch {
    /* ignore */
  }
}

/** Hero / Pricing: безкоштовна або платна консультація з чітким типом у ліді. */
export function prepareConsultation(
  type: "free_consultation" | "paid_consultation",
): void {
  clearSelectedPricingTier();
  if (type === "paid_consultation") {
    setSelectedPricingTier(PAID_CONSULTATION_TIER);
  }
  setLeadIntent(type);
}

/** Загальна консультація: без тарифу в ліді (Pricing, FAQ). */
export function prepareConsultationGeneral(): void {
  clearSelectedPricingTier();
  setLeadIntent("general_consultation");
}

/** Замовити з картки тарифу: лід із назвою пакета (синя кнопка «Замовити»). */
export function prepareConsultationFromPricingTier(tierName: string): void {
  clearLeadIntent();
  const t = tierName.trim();
  if (!t) return;
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ACG_SELECTED_PRICING_TIER_KEY, t);
    }
  } catch {
    /* ignore */
  }
}

export function setLeadIntent(value: LeadIntentValue): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ACG_LEAD_INTENT_KEY, value);
    }
  } catch {
    /* ignore */
  }
}

export function getLeadIntent(): LeadIntentValue | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const v = sessionStorage.getItem(ACG_LEAD_INTENT_KEY)?.trim();
    if (
      v === "free_consultation" ||
      v === "paid_consultation" ||
      v === "general_consultation"
    ) {
      return v;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function isTierlessConsultationIntent(
  intent: LeadIntentValue | undefined,
): boolean {
  return (
    intent === "free_consultation" || intent === "general_consultation"
  );
}

export function clearLeadIntent(): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ACG_LEAD_INTENT_KEY);
    }
  } catch {
    /* ignore */
  }
}
