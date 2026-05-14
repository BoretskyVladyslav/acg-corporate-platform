import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";

/** Якщо `general_consultation` — заявка без прив’язки до тарифу (див. LeadCaptureForm + `/api/sendpulse`). */
export const ACG_LEAD_INTENT_KEY = "acg_lead_intent";

export type LeadIntentValue = "general_consultation";

/** Загальна консультація: без тарифу в ліді (Hero, червона кнопка під тарифами). */
export function prepareConsultationGeneral(): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ACG_SELECTED_PRICING_TIER_KEY);
    }
  } catch {
    /* ignore */
  }
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
    return v === "general_consultation" ? "general_consultation" : undefined;
  } catch {
    return undefined;
  }
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
