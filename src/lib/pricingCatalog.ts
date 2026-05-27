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

/** Стабільні індекси в `DEFAULT_PRICING_TIERS` — порядок табів і CMS-мердж. */
export const PRICING_TIER_INDEX = {
  consultation: 0,
  fopRegistration: 1,
  fopGroup1: 2,
  fopGroup2: 3,
  fopGroup3: 4,
  fopGeneral: 5,
  tovAccounting: 6,
  otherServices: 7,
} as const;

const MAIN_TAB_TIER_INDEX: Record<PricingMainTabId, number> = {
  consultation: PRICING_TIER_INDEX.consultation,
  "fop-registration": PRICING_TIER_INDEX.fopRegistration,
  "fop-accounting": PRICING_TIER_INDEX.fopGroup1,
  "tov-accounting": PRICING_TIER_INDEX.tovAccounting,
  "other-services": PRICING_TIER_INDEX.otherServices,
};

const FOP_ACCOUNTING_TIER_INDICES: readonly number[] = [
  PRICING_TIER_INDEX.fopGroup1,
  PRICING_TIER_INDEX.fopGroup2,
  PRICING_TIER_INDEX.fopGroup3,
  PRICING_TIER_INDEX.fopGeneral,
];

const FOP_REGISTRATION_FEATURES: ServiceItem[] = [
  { isHeader: true, title: "В вартість включена:" },
  {
    title:
      "консультування з приводу оптимальної системи оподаткування;",
  },
  { title: "підбір КВЕД;" },
  { title: "реєстрація ФОП;" },
  { title: "реєстрація обраної системи оподаткування;" },
  {
    title:
      "отримання готових документів в електронному вигляді - виписка та витяг ФОП.",
  },
];

const FOP_GROUP_1_FEATURES: ServiceItem[] = [
  {
    isHeader: true,
    title: "Що ми можемо запропонувати для Вашого бізнесу:",
  },
  {
    title:
      "Подання звітності (річна звітність, Об'єднаний звіт з ЄСВ та ПДФО при розрахунку з фізичними особами).",
  },
  { title: "Формування реквізитів на сплату податків." },
  {
    title:
      "Відслідковування, щоб ви своєчасно сплачували податки та на вірні реквізити.",
  },
  { title: "Консультування з питань вашої діяльності." },
  { title: "Формування книги обліку доходів." },
  { title: "Відслідковування суми лімітів доходів." },
  { title: "Подання заяв до податкової." },
  {
    title:
      "Взаємодія з контролюючими органами з приводу господарської діяльності.",
  },
  {
    title:
      "Складання первинних документів (рахунок-фактура, акт виконаних робіт).",
  },
  {
    title:
      "Допомога в створенні ЕЦП, повідомлення Замовника про термін закінчення дії ключа.",
  },
];

const FOP_PRRO_FEATURES: ServiceItem[] = [
  { isHeader: true, title: "ОКРЕМИЙ ФУНКЦІОНАЛ З ПРРО" },
  {
    title:
      "11. Перевірка відповідності даних Z-звіту з даними електронного кабінету.",
  },
  {
    title: "12. Інформування про наявність помилок та розбіжностей (ПРРО).",
  },
  {
    title:
      "13. Формування актів виправлення помилок при проведенні розрахункових операцій.",
  },
];

const FOP_GROUP_2_FEATURES: ServiceItem[] = [
  ...FOP_GROUP_1_FEATURES,
  ...FOP_PRRO_FEATURES,
];

const FOP_GROUP_3_FEATURES: ServiceItem[] = [
  FOP_GROUP_1_FEATURES[0]!,
  {
    title:
      "Подання звітності (квартальна звітність, Об'єднаний звіт з ЄСВ та ПДФО при розрахунку з фізичними особами).",
  },
  ...FOP_GROUP_1_FEATURES.slice(2),
  ...FOP_PRRO_FEATURES,
];

const CONSULTATION_FEATURES: ServiceItem[] = [
  { isHeader: true, title: "Опис послуги:" },
  { title: "Детальна консультація з бухгалтером та юристом." },
  { title: "Тривалість: 1 год." },
  {
    title:
      "Формат: в офісі (м. Київ, вул. Саксаганського, 28) або онлайн (Telegram, Zoom, Google Meet, телефон).",
  },
  {
    title:
      "Бонус: після консультації ви отримуєте персональну пам'ятку для діяльності вашої групи ФОП.",
  },
];

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: "Консультація",
    priceText: "2000 грн / разово",
    description: "",
    features: CONSULTATION_FEATURES,
    isPopular: false,
  },
  {
    name: "РЕЄСТРАЦІЯ ФОП",
    priceText: "Вартість послуг - 1500 грн.",
    description: "",
    features: FOP_REGISTRATION_FEATURES,
    isPopular: false,
  },
  {
    name: "ФОП 1 група",
    priceText: "1000 грн / міс.",
    description: "",
    features: FOP_GROUP_1_FEATURES,
    isPopular: false,
  },
  {
    name: "ФОП 2 група",
    priceText: "Вартість послуг - від 1500 грн. на місяць.",
    description: "",
    features: FOP_GROUP_2_FEATURES,
    isPopular: true,
  },
  {
    name: "ФОП 3 група",
    priceText: "Вартість послуг - від 1500 грн. на місяць.",
    description: "",
    features: FOP_GROUP_3_FEATURES,
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

function clampTierIndex(tiers: PricingTier[], index: number): number {
  return index >= 0 && index < tiers.length ? index : 0;
}

function tiersMatchForFuzzy(name: string, target: string): boolean {
  if (!name || !target) return false;
  if (name === target) return true;
  if (!name.includes(target) && !target.includes(name)) return false;

  const shorter = Math.min(name.length, target.length);
  const longer = Math.max(name.length, target.length);
  if (shorter < 8 && shorter / longer < 0.55) return false;
  return true;
}

/** Зіставлення CMS-назви з канонічним слотом каталогу (без «фоп» → «фоп 1 група»). */
function cmsTierMatchesFallback(
  cmsName: string | undefined,
  fallbackName: string | undefined,
): boolean {
  const name = normalizeTierName(cmsName);
  const target = normalizeTierName(fallbackName);
  if (!name || !target) return false;
  if (name === target) return true;

  if (target.includes("фоп 1")) {
    return /фоп/i.test(name) && /1/.test(name) && /груп/i.test(name);
  }
  if (target.includes("фоп 2")) {
    return (
      /фоп/i.test(name) &&
      /2/.test(name) &&
      (/груп/i.test(name) || /3/.test(name))
    );
  }
  if (target.includes("фоп 3")) {
    return /фоп/i.test(name) && /3/.test(name) && /груп/i.test(name);
  }
  if (target.includes("загальна система")) {
    return /загальн/i.test(name) && /систем/i.test(name);
  }
  if (target.includes("консультація")) {
    return /консультац/i.test(name);
  }
  if (target.includes("реєстрація") && target.includes("фоп")) {
    return /реєстрац/i.test(name) && /фоп/i.test(name);
  }
  if (target.includes("тов")) {
    return /тов|юридичн/i.test(name);
  }
  if (target.includes("інші послуги")) {
    return /інш/i.test(name) && /послуг/i.test(name);
  }

  return tiersMatchForFuzzy(name, target);
}

function canonicalTierIndexForName(tierName: string): number | undefined {
  const target = normalizeTierName(tierName);
  const idx = DEFAULT_PRICING_TIERS.findIndex(
    (tier) => normalizeTierName(tier.name) === target,
  );
  return idx >= 0 ? idx : undefined;
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
    name: cmsTierMatchesFallback(cms.name, fallback.name)
      ? textOr(cms.name, fallback.name ?? "")
      : textOr(fallback.name, cms.name ?? ""),
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
    return cmsTierMatchesFallback(tier.name, fallback.name);
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

  const fuzzy = tiers.findIndex((tier) =>
    tiersMatchForFuzzy(normalizeTierName(tier.name), target),
  );
  if (fuzzy >= 0) return fuzzy;

  const canonical = canonicalTierIndexForName(tierName);
  if (canonical !== undefined) {
    return clampTierIndex(tiers, canonical);
  }

  return 0;
}

export function resolveActiveTierIndex(
  tiers: PricingTier[],
  mainTabId: PricingMainTabId,
  fopSubIndex: number,
): number {
  if (mainTabId === "fop-accounting") {
    const safeSub = Math.min(
      Math.max(0, fopSubIndex),
      FOP_ACCOUNTING_TIER_INDICES.length - 1,
    );
    return clampTierIndex(tiers, FOP_ACCOUNTING_TIER_INDICES[safeSub]!);
  }

  return clampTierIndex(tiers, MAIN_TAB_TIER_INDEX[mainTabId]);
}

export function inferNavigationFromTierIndex(
  tiers: PricingTier[],
  tierIndex: number,
): { mainTabId: PricingMainTabId; fopSubIndex: number } {
  const fopByPosition = FOP_ACCOUNTING_TIER_INDICES.indexOf(tierIndex);
  if (fopByPosition >= 0) {
    return { mainTabId: "fop-accounting", fopSubIndex: fopByPosition };
  }

  switch (tierIndex) {
    case PRICING_TIER_INDEX.consultation:
      return { mainTabId: "consultation", fopSubIndex: 0 };
    case PRICING_TIER_INDEX.fopRegistration:
      return { mainTabId: "fop-registration", fopSubIndex: 0 };
    case PRICING_TIER_INDEX.tovAccounting:
      return { mainTabId: "tov-accounting", fopSubIndex: 0 };
    case PRICING_TIER_INDEX.otherServices:
      return { mainTabId: "other-services", fopSubIndex: 0 };
    default:
      break;
  }

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
