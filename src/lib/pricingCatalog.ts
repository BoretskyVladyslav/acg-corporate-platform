import type { PricingTier } from "@/src/components/blocks/Pricing";
import type { ServiceItem } from "@/src/components/blocks/Services";

export type PricingMainTabId =
  | "consultation"
  | "fop-registration"
  | "fop-accounting"
  | "tov-accounting"
  | "other-services";

export type PricingTierPreset = "fop-registration" | "tov-accounting";

export const ACG_PRICING_PRESET_EVENT = "acg-pricing-select-preset";

export const PRICING_MAIN_TABS: ReadonlyArray<{
  id: PricingMainTabId;
  label: string;
}> = [
  { id: "consultation", label: "Консультація" },
  { id: "fop-registration", label: "Реєстрація ФОП" },
  { id: "fop-accounting", label: "Бухгалтерія для ФОП" },
  { id: "tov-accounting", label: "Бухгалтерія для ТОВ" },
  { id: "other-services", label: "Інші послуги" },
] as const;

export const FOP_ACCOUNTING_SUB_TABS: ReadonlyArray<{
  label: string;
  tierName: string;
}> = [
  { label: "ФОП 1 група", tierName: "ФОП 1 група" },
  { label: "ФОП 2 група", tierName: "ФОП 2 група" },
  { label: "ФОП 3 група", tierName: "ФОП 3 група" },
  { label: "Загальна система", tierName: "Загальна система" },
] as const;

const FOP_GROUP_2_3_FEATURES: ServiceItem[] = [
  { title: "Всі послуги з 1-ї групи" },
  { title: "Подання заяв до податкової" },
  { title: "Подання квартальної звітності" },
  { title: "Формування реквізитів на сплату" },
  { title: "Взаємодія з контролюючими органами" },
  { title: "Складання первинних документів" },
  { title: "Допомога в створенні ЕЦП" },
];

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: "Консультація",
    priceText: "2000 грн / разово",
    description:
      "Детальна консультація з бухгалтером та юристом. Тривалість 1 година. Формат: онлайн або офлайн. Повний розбір вашої ситуації та розробка стратегії",
    features: [],
    isPopular: false,
  },
  {
    name: "Реєстрація ФОП",
    priceText: "1500 грн / разово",
    description:
      "Включає підбір КВЕД, подачу документів, вибір системи оподаткування та супровід до отримання витягу з реєстру",
    features: [],
    isPopular: false,
  },
  {
    name: "ФОП 1 група",
    priceText: "1000 грн / міс.",
    description: "",
    features: [
      { title: "Подання звітності (річна, ЄСВ та ПДФО)" },
      { title: "Формування реквізитів на сплату" },
      { title: "Відслідковування своєчасності оплат" },
      { title: "Консультування з питань діяльності" },
      { title: "Формування книги обліку доходів" },
      { title: "Відслідковування лімітів доходів" },
      { title: "Складання рахунків та актів" },
      { title: "Допомога в створенні ЕЦП" },
    ],
    isPopular: false,
  },
  {
    name: "ФОП 2 група",
    priceText: "від 1500 грн / міс.",
    description: "",
    features: FOP_GROUP_2_3_FEATURES,
    isPopular: true,
  },
  {
    name: "ФОП 3 група",
    priceText: "від 1800 грн / міс.",
    description: "",
    features: [
      ...FOP_GROUP_2_3_FEATURES,
      { title: "Облік ПДВ та податкових накладних" },
      { title: "Контроль лімітів доходу для 3 групи" },
    ],
    isPopular: false,
  },
  {
    name: "Загальна система",
    priceText: "від 2500 грн / міс.",
    description: "",
    features: [
      { title: "Повний бухгалтерський облік на загальній системі" },
      { title: "Подання декларацій з ПДВ та податку на прибуток" },
      { title: "Складання первинних документів" },
      { title: "Взаємодія з контролюючими органами" },
      { title: "Консультування з питань оподаткування" },
      { title: "Допомога в створенні ЕЦП" },
    ],
    isPopular: false,
  },
  {
    name: "Бухгалтерія для ТОВ",
    priceText: "",
    description: "Загальна тарифна сітка для ТОВ (інформація оновлюється)",
    features: [],
    isPopular: false,
    isPlaceholder: true,
  },
  {
    name: "Інші послуги",
    priceText: "На запит",
    description: "",
    features: [
      { title: "Розробка договорів" },
      { title: "Реєстрація торгової марки" },
      { title: "Реєстрація неприбуткових організацій" },
      { title: "Відновлення бухгалтерського обліку" },
      { title: "Аудит" },
    ],
    isPopular: false,
  },
];

const MAIN_TAB_TIER_NAMES: Record<PricingMainTabId, string> = {
  consultation: "Консультація",
  "fop-registration": "Реєстрація ФОП",
  "fop-accounting": "ФОП 1 група",
  "tov-accounting": "Бухгалтерія для ТОВ",
  "other-services": "Інші послуги",
};

function normalizeTierName(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function tierHasCmsFeatures(tier: PricingTier): boolean {
  return (tier.features ?? []).some(
    (x) =>
      x?.isHeader === true ||
      Boolean(x.title?.trim()) ||
      Boolean(x.description?.trim()) ||
      Boolean(x.note?.trim()) ||
      Boolean(x.icon?.trim()),
  );
}

function featuresFromCmsOnly(cms: ServiceItem[]): ServiceItem[] {
  return cms.map((item) => {
    const row: ServiceItem = {
      title: typeof item.title === "string" ? item.title.trim() : "",
      description:
        typeof item.description === "string" ? item.description.trim() : "",
      note: typeof item.note === "string" ? item.note.trim() : "",
      icon: typeof item.icon === "string" ? item.icon.trim() : "",
    };
    if (item.isHeader === true) {
      row.isHeader = true;
    }
    return row;
  });
}

function mergeSingleTier(cms: PricingTier, fallback: PricingTier): PricingTier {
  const hasCmsFeatures = tierHasCmsFeatures(cms);
  const features = hasCmsFeatures
    ? featuresFromCmsOnly(cms.features ?? [])
    : (fallback.features ?? []);

  const cmsDescriptionRaw =
    typeof cms.description === "string" ? cms.description.trim() : "";
  const description = hasCmsFeatures
    ? cmsDescriptionRaw
    : textOr(cms.description, fallback.description ?? "");

  const isPopularMerged =
    typeof cms.isPopular === "boolean" ? cms.isPopular : Boolean(fallback.isPopular);

  const merged: PricingTier = {
    name: textOr(cms.name, fallback.name ?? ""),
    priceText: textOr(cms.priceText, fallback.priceText ?? ""),
    description,
    features,
    isPopular: Boolean(isPopularMerged),
    isPlaceholder:
      typeof cms.isPlaceholder === "boolean"
        ? cms.isPlaceholder
        : Boolean(fallback.isPlaceholder),
  };

  if (fallback.isPlaceholder) {
    return {
      ...fallback,
      name: merged.name,
      isPopular: merged.isPopular,
    };
  }

  if (normalizeTierName(fallback.name) === normalizeTierName("Інші послуги")) {
    return {
      ...fallback,
      name: merged.name,
      isPopular: merged.isPopular,
      priceText: textOr(cms.priceText, fallback.priceText ?? ""),
    };
  }

  return merged;
}

function findCmsTierForDefault(
  cmsTiers: PricingTier[],
  fallback: PricingTier,
  usedIndexes: Set<number>,
): PricingTier | undefined {
  const target = normalizeTierName(fallback.name);

  const exactIdx = cmsTiers.findIndex(
    (tier, index) =>
      !usedIndexes.has(index) && normalizeTierName(tier.name) === target,
  );
  if (exactIdx >= 0) {
    usedIndexes.add(exactIdx);
    return cmsTiers[exactIdx];
  }

  if (target.includes("фоп 2")) {
    const legacyIdx = cmsTiers.findIndex(
      (tier, index) =>
        !usedIndexes.has(index) &&
        /фоп/i.test(tier.name ?? "") &&
        /2/.test(tier.name ?? "") &&
        /3|груп/i.test(tier.name ?? ""),
    );
    if (legacyIdx >= 0) {
      usedIndexes.add(legacyIdx);
      return cmsTiers[legacyIdx];
    }
  }

  const fuzzyIdx = cmsTiers.findIndex((tier, index) => {
    if (usedIndexes.has(index)) return false;
    const name = normalizeTierName(tier.name);
    if (!name) return false;
    return name.includes(target) || target.includes(name);
  });
  if (fuzzyIdx >= 0) {
    usedIndexes.add(fuzzyIdx);
    return cmsTiers[fuzzyIdx];
  }

  return undefined;
}

export function mergePricingTierCatalog(
  cms: PricingTier[] | undefined,
  defaults: PricingTier[] = DEFAULT_PRICING_TIERS,
): PricingTier[] {
  if (!cms?.length) return defaults;

  const usedIndexes = new Set<number>();
  return defaults.map((fallback) => {
    const cmsTier = findCmsTierForDefault(cms, fallback, usedIndexes);
    return cmsTier ? mergeSingleTier(cmsTier, fallback) : fallback;
  });
}

export function findTierIndexByName(
  tiers: PricingTier[],
  tierName: string,
): number {
  const target = normalizeTierName(tierName);
  const exact = tiers.findIndex(
    (tier) => normalizeTierName(tier.name) === target,
  );
  if (exact >= 0) return exact;

  const fuzzy = tiers.findIndex((tier) => {
    const name = normalizeTierName(tier.name);
    return name.includes(target) || target.includes(name);
  });
  return fuzzy >= 0 ? fuzzy : 0;
}

export function resolveActiveTierIndex(
  tiers: PricingTier[],
  mainTabId: PricingMainTabId,
  fopSubIndex: number,
): number {
  if (mainTabId === "fop-accounting") {
    const safeSub = Math.min(
      Math.max(0, fopSubIndex),
      FOP_ACCOUNTING_SUB_TABS.length - 1,
    );
    return findTierIndexByName(
      tiers,
      FOP_ACCOUNTING_SUB_TABS[safeSub]?.tierName ?? "ФОП 1 група",
    );
  }

  return findTierIndexByName(tiers, MAIN_TAB_TIER_NAMES[mainTabId]);
}

export function inferNavigationFromTierIndex(
  tiers: PricingTier[],
  tierIndex: number,
): { mainTabId: PricingMainTabId; fopSubIndex: number } {
  const tierName = tiers[tierIndex]?.name ?? "";
  const normalized = normalizeTierName(tierName);

  const fopSubIndex = FOP_ACCOUNTING_SUB_TABS.findIndex(
    (tab) => normalizeTierName(tab.tierName) === normalized,
  );
  if (fopSubIndex >= 0) {
    return { mainTabId: "fop-accounting", fopSubIndex };
  }

  if (/реєстрація/i.test(tierName) && /фоп/i.test(tierName)) {
    return { mainTabId: "fop-registration", fopSubIndex: 0 };
  }
  if (/тов|юридичн/i.test(tierName)) {
    return { mainTabId: "tov-accounting", fopSubIndex: 0 };
  }
  if (/інш/i.test(tierName)) {
    return { mainTabId: "other-services", fopSubIndex: 0 };
  }
  if (/консультац/i.test(tierName)) {
    return { mainTabId: "consultation", fopSubIndex: 0 };
  }

  return { mainTabId: "fop-accounting", fopSubIndex: 0 };
}

export function findInitialPricingNavigation(
  tiers: PricingTier[],
): { mainTabId: PricingMainTabId; fopSubIndex: number } {
  const popularIdx = tiers.findIndex((tier) => tier.isPopular === true);
  if (popularIdx >= 0) {
    return inferNavigationFromTierIndex(tiers, popularIdx);
  }
  return { mainTabId: "fop-accounting", fopSubIndex: 1 };
}

export function mainTabIdForPreset(
  preset: PricingTierPreset,
): PricingMainTabId {
  if (preset === "fop-registration") return "fop-registration";
  return "tov-accounting";
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

/** @deprecated Використовуйте mainTabIdForPreset + resolveActiveTierIndex. */
export function findTierIndexForPreset(
  tiers: PricingTier[],
  preset: PricingTierPreset,
): number {
  return resolveActiveTierIndex(tiers, mainTabIdForPreset(preset), 0);
}
