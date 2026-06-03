"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ConsultationModal from "./ConsultationModal";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { resolveFeatureIcon } from "@/src/lib/featureIcons";
import {
  prepareConsultation,
  prepareConsultationGeneral,
} from "@/src/lib/leadIntent";
import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";
import {
  ACG_PRICING_PRESET_EVENT,
  DEFAULT_PRICING_TIERS,
  FOP_ACCOUNTING_SUB_TABS,
  PRICING_MAIN_TABS,
  findInitialPricingNavigation,
  mainTabIdForPreset,
  mergePricingTierCatalog,
  resolveActiveTierIndex,
  type PricingMainTabId,
  type PricingTierPreset,
} from "@/src/lib/pricingCatalog";
import {
  LANDING_SECTION_H2_SIZE,
  LANDING_SECTION_SHELL,
  LANDING_PRICING_SECTION_CLASS,
  LANDING_PRICING_SECTION_GLOW,
  LANDING_PRICING_EYEBROW_ON_DARK,
  LANDING_PRICING_H2_ON_DARK,
  LANDING_PRICING_LEDE_ON_DARK,
  LANDING_PRICING_TAB_ACTIVE,
  LANDING_PRICING_TAB_IDLE,
  LANDING_PRICING_SUBTAB_ACTIVE,
  LANDING_PRICING_SUBTAB_IDLE,
} from "@/src/lib/landingSectionRhythm";

import type { ServiceItem } from "./Services";

export interface PricingTier {
  name?: string;
  /** Повний рядок ціни з CMS (або дефолтів), як показано на сторінці. */
  priceText?: string;
  description?: string;
  /** Пункти тарифу з Sanity (`featureItem`). */
  features?: ServiceItem[];
  isPopular?: boolean;
  /** Тимчасова заглушка (наприклад, тарифна сітка ТОВ). */
  isPlaceholder?: boolean;
}

export interface PricingCategory {
  categoryName?: string;
  tariffs?: PricingTier[];
}

export interface PricingProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  categories?: PricingCategory[];
  /** Текст над нижньою кнопкою консультації (Sanity `pricing.ctaText`). */
  ctaText?: string;
  /** Підпис синьої кнопки замовлення у картці тарифу (`pricing.globalButtonLabel`). */
  globalButtonLabel?: string;
}

const DEFAULT_GLOBAL_ORDER_LABEL = "Отримати консультацію безкоштовно";

const DEFAULT_PRICING_CTA_BOTTOM_TEXT =
  "Не знаєте, який тариф обрати? Напишіть нам — підкажемо оптимальний пакет під ваші задачі, без зайвих опцій.";

const DEFAULT_PRICING_CTA_BOTTOM_BUTTON = "Отримати допомогу з вибором";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

const DEFAULT_PRICING_EYEBROW = "Тарифи";
const DEFAULT_PRICING_HEADING = "Пакети послуг";
const DEFAULT_PRICING_INTRO =
  "Прозоре ціноутворення без прихованих платежів";

const tierSwitchEase = [0.22, 1, 0.36, 1] as const;
const tierSwitchTransition = {
  duration: 0.38,
  ease: tierSwitchEase,
};

const SECTION_SCROLL_EASE_OUT = [0, 0, 0.2, 1] as const;
const SECTION_ITEM_REVEAL_TRANSITION = {
  duration: 0.5,
  ease: SECTION_SCROLL_EASE_OUT,
} as const;

const watermarkOutlineStyle = {
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px rgb(36 84 148)",
} as const;

const watermarkPositionClass =
  "pointer-events-none absolute bottom-[10%] left-1/2 z-0 origin-center -translate-x-1/2 translate-y-[10%] select-none font-semibold tabular-nums leading-none text-[min(340px,82vw)] sm:text-[min(440px,58vw)] md:bottom-[11%] md:left-[62%] md:-translate-x-[44%] md:translate-y-[14%] lg:left-[63%] lg:-translate-x-[46%] lg:bottom-[9%] lg:translate-y-[16%] lg:text-[400px] xl:text-[440px]";

const ctaPulseTransition = {
  duration: 2.65,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const ctaPulseShadowRed = [
  "0 10px 26px -14px rgba(196, 30, 58, 0.22)",
  "0 12px 42px -10px rgba(196, 30, 58, 0.42)",
  "0 10px 26px -14px rgba(196, 30, 58, 0.22)",
];

const featuresListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: tierSwitchEase },
  },
};

const featureItemVariantsMobile = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.32, ease: tierSwitchEase },
  },
};

const featuresListVariantsMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
};

/**
 * Стилі рядків після `isHeader`: щільний блок, текст 15px — на крок менший за основний список на `sm` (`text-base`).
 */
const pricingSubsectionItem = {
  row: "flex gap-2 py-1",
  icon: "mt-0.5 h-4 w-4 shrink-0 text-acg-blue/65",
  stack: "min-w-0 flex-1 space-y-1.5",
  title: "text-[15px] font-medium leading-snug text-slate-700",
  bulletList: "space-y-1",
  bulletRow:
    "flex gap-2 text-[15px] font-normal leading-relaxed text-slate-700",
  bulletMark: "mt-2 h-px w-2.5 shrink-0 bg-slate-400/55",
  note: "mt-0.5 border-t border-slate-200/90 pt-2 text-[11px] font-normal uppercase tracking-[0.18em] text-slate-600",
} as const;

function splitDescriptionToLines(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const chunks = trimmed
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));
  return chunks.length ? chunks : [trimmed];
}

function pricingFeatureRowIsRenderable(f: ServiceItem): boolean {
  return (
    f.isHeader === true ||
    f.isSubheading === true ||
    Boolean(f.title?.trim()) ||
    Boolean(f.description?.trim()) ||
    Boolean(f.note?.trim())
  );
}

/** Усі звичайні пункти після останнього `isHeader`/`isSubheading` (до наступного заголовка) — компактний підсписок. */
function followsPricingSubsectionHeader(
  items: ServiceItem[],
  index: number,
): boolean {
  let lastHeaderIndex = -1;
  for (let i = 0; i < index; i++) {
    const row = items[i];
    if (!pricingFeatureRowIsRenderable(row)) continue;
    if (row.isHeader === true || row.isSubheading === true) {
      lastHeaderIndex = i;
    }
  }
  return lastHeaderIndex >= 0;
}

function isPopularTier(tier: PricingTier): boolean {
  return tier.isPopular === true;
}

export default function Pricing({
  eyebrow,
  heading,
  intro,
  categories,
  ctaText,
  globalButtonLabel,
}: PricingProps) {
  const displayEyebrow = textOr(eyebrow, DEFAULT_PRICING_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_PRICING_HEADING);
  const displayIntro = textOr(intro, DEFAULT_PRICING_INTRO);
  const displayCtaText = textOr(ctaText, DEFAULT_PRICING_CTA_BOTTOM_TEXT);
  /** Текст CTA у картках тарифів — фіксований згідно з ТЗ клієнта. */
  const cardOrderLabel = DEFAULT_GLOBAL_ORDER_LABEL;
  
  const categoriesList = categories ?? [];
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeTariffIndex, setActiveTariffIndex] = useState(0);
  
  const activeCategory = categoriesList[activeCategoryIndex];
  const tier = activeCategory?.tariffs?.[activeTariffIndex] ?? activeCategory?.tariffs?.[0];

  const watermarkText = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < activeCategoryIndex; i++) {
      sum += categoriesList[i]?.tariffs?.length ?? 0;
    }
    sum += activeTariffIndex;
    return String(sum + 1).padStart(2, "0");
  }, [activeCategoryIndex, activeTariffIndex, categoriesList]);

  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultModalKey, setConsultModalKey] = useState(0);
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();

  useEffect(() => {
    const tierName = tier?.name?.trim() ?? "";
    try {
      if (typeof window !== "undefined" && tierName) {
        sessionStorage.setItem(ACG_SELECTED_PRICING_TIER_KEY, tierName);
      }
    } catch {
      /* sessionStorage недоступний або переповнений */
    }
  }, [tier]);

  const selectMainTab = (index: number) => {
    setActiveCategoryIndex(index);
    setActiveTariffIndex(0);
  };

  const selectSubTab = (index: number) => {
    setActiveTariffIndex(index);
  };

  useEffect(() => {
    const parseUrlAndSelectTab = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;
      if (!hash.startsWith("#pricing")) return;
      
      const searchParams = new URLSearchParams(hash.slice(hash.indexOf("?") + 1));
      const tab = searchParams.get("tab") as PricingTierPreset | null;
      if (!tab) return;
      
      let matchedCatIndex = -1;
      const p = tab.toLowerCase();
      
      if (p === "fop-registration") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("реєстрац") && name.includes("фоп");
        });
      } else if (p === "fop-accounting") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("бухгалтер") && name.includes("фоп");
        });
      } else if (p === "tov-accounting") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("тов") || name.includes("юридичн");
        });
      } else if (p === "other-services") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("інш") || name.includes("послуг");
        });
      }
      
      if (matchedCatIndex >= 0) {
        setActiveCategoryIndex(matchedCatIndex);
        setActiveTariffIndex(0);
      }
    };

    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ preset?: PricingTierPreset }>;
      const preset = ce.detail?.preset;
      if (!preset) return;
      
      let matchedCatIndex = -1;
      const p = preset.toLowerCase();
      
      if (p === "fop-registration") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("реєстрац") && name.includes("фоп");
        });
      } else if (p === "fop-accounting") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("бухгалтер") && name.includes("фоп");
        });
      } else if (p === "tov-accounting") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("тов") || name.includes("юридичн");
        });
      } else if (p === "other-services") {
        matchedCatIndex = categoriesList.findIndex(c => {
          const name = c.categoryName?.toLowerCase() ?? "";
          return name.includes("інш") || name.includes("послуг");
        });
      }

      if (matchedCatIndex >= 0) {
        setActiveCategoryIndex(matchedCatIndex);
        setActiveTariffIndex(0);
      }
    };

    // Run URL parser on mount
    parseUrlAndSelectTab();

    window.addEventListener(ACG_PRICING_PRESET_EVENT, handler);
    window.addEventListener("hashchange", parseUrlAndSelectTab);
    return () => {
      window.removeEventListener(ACG_PRICING_PRESET_EVENT, handler);
      window.removeEventListener("hashchange", parseUrlAndSelectTab);
    };
  }, [categoriesList]);

  const panelMotionProps = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            initial: false as const,
            animate: { opacity: 1, y: 0 } as const,
            exit: undefined,
            transition: { duration: 0 },
          }
        : !isMdUp
          ? {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 6 },
              transition: { duration: 0.28, ease: tierSwitchEase },
            }
          : {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 8 },
              transition: tierSwitchTransition,
            },
    [reduceMotionPreferred, isMdUp],
  );

  const shellContainerVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: {},
            show: {
              transition: { staggerChildren: 0, delayChildren: 0 },
            },
          }
        : {
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0 },
            },
          },
    [reduceMotionPreferred],
  );

  const shellItemVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: { opacity: 1, y: 0 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0 },
            },
          }
        : {
            hidden: { opacity: 0, y: 50 },
            show: {
              opacity: 1,
              y: 0,
              transition: SECTION_ITEM_REVEAL_TRANSITION,
            },
          },
    [reduceMotionPreferred],
  );

  if (!tier) {
    return null;
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={LANDING_PRICING_SECTION_CLASS}
    >
      <div
        className={`${LANDING_PRICING_SECTION_GLOW}`}
        aria-hidden
      />
      <div className={`relative z-[1] ${LANDING_SECTION_SHELL} min-w-0`}>
        <motion.div
          className="min-w-0"
          variants={shellContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={shellItemVariants}>
            <p className={LANDING_PRICING_EYEBROW_ON_DARK}>{displayEyebrow}</p>
            <h2
              id="pricing-heading"
              className={`${LANDING_PRICING_H2_ON_DARK} ${LANDING_SECTION_H2_SIZE} mt-3 max-w-[min(100%,28rem)]`}
            >
              {displayHeading}
            </h2>
            <p className={`mt-4 max-w-3xl ${LANDING_PRICING_LEDE_ON_DARK}`}>
              {displayIntro}
            </p>
          </motion.div>

        {categoriesList.length > 1 ? (
          <motion.div variants={shellItemVariants} className="mt-8 md:mt-10">
            <div
              role="tablist"
              aria-label="Категорії тарифів"
              className="flex flex-wrap w-full min-w-0 gap-2.5 sm:gap-3 md:justify-center md:gap-2 lg:justify-start"
            >
              {categoriesList.map((cat, idx) => {
                const isActive = idx === activeCategoryIndex;
                const isPopular = cat.tariffs?.some(isPopularTier) ?? false;

                return (
                  <motion.button
                    key={`cat-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="pricing-tier-panel"
                    id={`pricing-main-tab-${idx}`}
                    onClick={() => selectMainTab(idx)}
                    className={`snap-start shrink-0 touch-manipulation rounded-full border font-semibold transition-colors min-h-[48px] max-w-[calc(100vw-2.5rem)] px-4 py-3.5 text-left text-sm leading-snug sm:max-w-none sm:px-5 sm:py-4 sm:text-base md:min-h-0 md:max-w-none md:px-4 md:py-2.5 md:text-center md:text-sm md:font-medium ${
                      isActive ? LANDING_PRICING_TAB_ACTIVE : LANDING_PRICING_TAB_IDLE
                    } ${isPopular ? "ring-2 ring-amber-300/75 ring-offset-2 ring-offset-[#245494]" : ""}`}
                    layout={isMdUp}
                    transition={
                      isMdUp
                        ? { type: "spring", stiffness: 400, damping: 30 }
                        : { duration: 0.2 }
                    }
                    whileTap={
                      isMdUp && !reduceMotionPreferred
                        ? { scale: 0.97 }
                        : undefined
                    }
                  >
                    <span className="inline-flex w-full flex-col items-start gap-1 md:items-center">
                      <span className="inline-flex flex-wrap items-center gap-1.5 break-words md:justify-center">
                        <span className="break-words">{cat.categoryName}</span>
                        {isPopular ? (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${isActive ? "bg-acg-blue/10 text-acg-blue" : "bg-amber-100 text-amber-900"}`}
                            aria-label="Рекомендовано"
                          >
                            Топ
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {(activeCategory?.tariffs?.length ?? 0) > 1 ? (
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.06] p-3 sm:p-4 md:mt-5">
                <p className="mb-3 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/60 md:text-left">
                  Оберіть тариф
                </p>
                <div
                  role="tablist"
                  aria-label="Тарифи"
                  className="flex flex-wrap w-full min-w-0 gap-2 sm:justify-center md:justify-start"
                >
                  {activeCategory.tariffs!.map((subTab, index) => {
                    const isSubActive = index === activeTariffIndex;
                    const isSubPopular = isPopularTier(subTab);

                    return (
                      <button
                        key={`subtab-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={isSubActive}
                        aria-controls="pricing-tier-panel"
                        id={`pricing-subtab-${index}`}
                        onClick={() => selectSubTab(index)}
                        className={`snap-start shrink-0 touch-manipulation rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
                          isSubActive
                            ? LANDING_PRICING_SUBTAB_ACTIVE
                            : LANDING_PRICING_SUBTAB_IDLE
                        } ${isSubPopular ? "ring-1 ring-amber-300/70" : ""}`}
                      >
                        {subTab.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : null}

        <motion.div
          variants={shellItemVariants}
          className="relative mx-auto mt-6 min-w-0 max-w-4xl sm:mt-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={`${activeCategoryIndex}-${activeTariffIndex}`}
              id="pricing-tier-panel"
              role="tabpanel"
              aria-labelledby={
                categoriesList.length > 1
                  ? (activeCategory?.tariffs?.length ?? 0) > 1
                    ? `pricing-subtab-${activeTariffIndex}`
                    : `pricing-main-tab-${activeCategoryIndex}`
                  : "pricing-heading"
              }
              aria-live="polite"
              {...panelMotionProps}
              className={`relative min-w-0 overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-black/30 transition-[box-shadow,border-color] ${
                isPopularTier(tier)
                  ? "border-acg-blue/45 shadow-[0_28px_80px_-32px_rgba(0,0,0,0.55)] ring-2 ring-amber-400/55"
                  : "border-white/70 shadow-black/25"
              }`}
            >
              {reduceMotionPreferred || !isMdUp ? (
                <span
                  aria-hidden
                  style={watermarkOutlineStyle}
                  className={`${watermarkPositionClass} opacity-[0.45]`}
                >
                  {watermarkText}
                </span>
              ) : (
                <motion.span
                  aria-hidden
                  style={watermarkOutlineStyle}
                  className={watermarkPositionClass}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{
                    duration: 0.42,
                    ease: tierSwitchEase,
                    delay: 0.04,
                  }}
                >
                  {watermarkText}
                </motion.span>
              )}
              <div className="relative z-[1]">
                <PricingCheckoutPanel
                  tier={tier}
                  orderButtonLabel={cardOrderLabel}
                  onOrderClick={() => {
                    prepareConsultation("free_consultation");
                    const tierName = tier.name?.trim() ?? "";
                    if (tierName) {
                      try {
                        sessionStorage.setItem(
                          ACG_SELECTED_PRICING_TIER_KEY,
                          tierName,
                        );
                      } catch {
                        /* sessionStorage недоступний */
                      }
                    }
                    setConsultModalKey((k) => k + 1);
                    setConsultModalOpen(true);
                  }}
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={shellItemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-3 px-1 sm:mt-12"
        >
          <p className="max-w-xl text-center text-sm leading-relaxed text-white/75">
            {displayCtaText}
          </p>
          <button
            type="button"
            onClick={() => {
              prepareConsultationGeneral();
              setConsultModalKey((k) => k + 1);
              setConsultModalOpen(true);
            }}
            className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center rounded-full bg-acg-red px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-black/25 ring-1 ring-white/20 transition hover:bg-acg-red/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#245494] sm:w-auto"
          >
            {DEFAULT_PRICING_CTA_BOTTOM_BUTTON}
          </button>
        </motion.div>
        </motion.div>
      </div>

      <ConsultationModal
        key={consultModalKey}
        open={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </section>
  );
}

function PricingCheckoutPanel({
  tier,
  orderButtonLabel,
  onOrderClick,
}: {
  tier: PricingTier;
  orderButtonLabel: string;
  onOrderClick: () => void;
}) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const mainFeatures = tier.features ?? [];
  const isPlaceholder = tier.isPlaceholder === true;
  const hasFeatureRows = mainFeatures.some(
    (f) =>
      f.isHeader === true ||
      f.isSubheading === true ||
      Boolean(f.title?.trim()) ||
      Boolean(f.description?.trim()) ||
      Boolean(f.note?.trim()),
  );
  const descLines =
    !hasFeatureRows && tier.description?.trim() && !isPlaceholder
      ? splitDescriptionToLines(tier.description)
      : [];
  const isSimpleOffer =
    !isPlaceholder && !hasFeatureRows && descLines.length > 0;
  const gapClass = Math.max(mainFeatures.length, descLines.length) > 6 ? "gap-2.5" : "gap-3";
  const priceDisplayRaw = tier.priceText?.trim() ?? "";
  const popular = isPopularTier(tier);
  const isRegistrationTier = /реєстрац/i.test(tier.name ?? "");
  const ctaBase = popular
    ? "bg-acg-red ring-2 ring-amber-300/60 hover:bg-acg-red/92"
    : "bg-acg-red shadow-lg shadow-acg-red/25 hover:bg-acg-red/92";
  const hasNoFeatures = !hasFeatureRows && descLines.length === 0;
  const showEmptyFallback = false;
  const showRightColumn = Boolean(priceDisplayRaw) && !hasNoFeatures;

  const ctaPulseAnimate =
    reduceMotionPreferred || !isMdUp ? {} : { boxShadow: ctaPulseShadowRed };

  const hasContent =
    Boolean(tier.description?.trim()) ||
    hasFeatureRows ||
    descLines.length > 0;

  return (
    <div
      className={`flex flex-col md:flex-row md:items-stretch ${
        hasNoFeatures
          ? "min-h-[400px]"
          : !showRightColumn
            ? "min-h-0"
            : isRegistrationTier
              ? "min-h-[min(23rem,72svh)] md:min-h-[22rem]"
              : "min-h-[min(28rem,82svh)] md:min-h-[26rem]"
      }`}
    >
      <div
        className={`relative flex min-h-0 flex-col p-6 sm:p-8 lg:p-10 lg:pl-11 ${
          showRightColumn
            ? `flex-1 border-b border-acg-blue/[0.1] md:border-b-0 md:border-r ${
                isRegistrationTier ? "lg:basis-[68%]" : "lg:basis-[62%]"
              }`
            : "w-full"
        }`}
      >
        {popular ? (
          <span className="mb-3 inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-950 ring-1 ring-amber-300/70">
            Рекомендовано
          </span>
        ) : (
          <span className="sr-only">Тарифний пакет</span>
        )}
        <h3 className="break-words text-xl font-semibold tracking-tight text-acg-blue sm:text-2xl">
          {tier.name}
        </h3>
        {hasContent || hasNoFeatures ? (
          <div className="mt-4 h-px w-full min-w-0 bg-acg-border" aria-hidden />
        ) : null}
        {tier.description?.trim() && !hasNoFeatures ? (
          <p className="mt-5 text-sm leading-relaxed text-foreground/72">
            {tier.description}
          </p>
        ) : null}
        {hasNoFeatures ? (
          <div className="mt-6 flex min-h-0 flex-1 flex-col items-center justify-center py-4 sm:py-6">
            <div className="w-full max-w-xl rounded-2xl border border-dashed border-acg-blue/30 bg-acg-blue/[0.04] p-6 text-center sm:p-8">
              <p className="text-base leading-relaxed text-foreground/72 sm:text-lg mb-6">
                {tier.description?.trim() || "Інформація оновлюється"}
              </p>
              {!showRightColumn ? (
                <button
                  type="button"
                  onClick={onOrderClick}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-acg-red px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-acg-red/20 transition hover:bg-acg-red/92"
                >
                  {orderButtonLabel}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
        {hasFeatureRows ? (
          <motion.ol
            variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
            initial="hidden"
            animate="visible"
            className="mt-6 flex min-h-0 flex-1 flex-col [counter-reset:pricing-features]"
          >
            {mainFeatures.map((f, j) => {
              if (
                f.isHeader !== true &&
                f.isSubheading !== true &&
                !f.title?.trim() &&
                !f.description?.trim() &&
                !f.note?.trim()
              ) {
                return null;
              }

              let isPrroSection = false;
              for (let i = j; i >= 0; i--) {
                const prev = mainFeatures[i];
                if (prev.isHeader === true || prev.isSubheading === true) {
                  const hdrTitle = prev.title?.trim().toUpperCase() || "";
                  if (hdrTitle.includes("ОКРЕМИЙ ФУНКЦІОНАЛ") || hdrTitle.includes("ПРРО")) {
                    isPrroSection = true;
                  }
                  break;
                }
              }

              if (f.isHeader === true) {
                const headline = f.title?.trim() ?? "";
                if (!headline) return null;
                return (
                  <motion.li
                    key={`hdr-${headline}-${j}`}
                    variants={
                      isMdUp ? featureItemVariants : featureItemVariantsMobile
                    }
                    className={`mt-6 mb-2 first:mt-0 ${isPrroSection ? "border-t border-acg-blue/10 pt-5" : ""}`}
                  >
                    <p className={`font-bold leading-snug sm:text-[1.0625rem] ${isPrroSection ? "text-[0.9375rem] text-slate-800" : "text-base text-acg-blue"}`}>
                      {headline}
                    </p>
                  </motion.li>
                );
              }

              if (f.isSubheading === true) {
                const headline = f.title?.trim() ?? "";
                if (!headline) return null;
                return (
                  <motion.li
                    key={`subhdr-${headline}-${j}`}
                    variants={
                      isMdUp ? featureItemVariants : featureItemVariantsMobile
                    }
                    className={`mt-5 mb-2 first:mt-0 ${isPrroSection ? "border-t border-acg-blue/10 pt-4" : ""}`}
                  >
                    <p className={`font-semibold leading-snug sm:text-base ${isPrroSection ? "text-[0.9375rem] text-slate-700" : "text-sm text-acg-blue"}`}>
                      {headline}
                    </p>
                  </motion.li>
                );
              }

              const compact = followsPricingSubsectionHeader(mainFeatures, j);
              const headline = f.title?.trim() ?? "";
              const descRaw = f.description?.trim() ?? "";
              const FeatureIcon = resolveFeatureIcon(f.icon);
              const bullets =
                headline && descRaw
                  ? splitDescriptionToLines(descRaw)
                  : !headline && descRaw
                    ? splitDescriptionToLines(descRaw)
                    : [];
              const showNote = Boolean(f.note?.trim());
              return (
                <motion.li
                  key={`${headline}-${j}`}
                  variants={isMdUp ? featureItemVariants : featureItemVariantsMobile}
                  className={
                    isPrroSection
                      ? "flex gap-3 py-2 pl-3 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-full before:bg-acg-blue/10"
                      : compact ? pricingSubsectionItem.row : "flex gap-4 py-5 first:pt-0 lg:gap-5 lg:py-6"
                  }
                >
                  {!isPrroSection && (
                    <span 
                      className={
                        compact
                          ? "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-acg-blue/10 text-[0.625rem] font-bold text-acg-blue before:content-[counter(pricing-features)] [counter-increment:pricing-features]"
                          : "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-acg-blue/10 text-xs font-bold text-acg-blue before:content-[counter(pricing-features)] [counter-increment:pricing-features]"
                      } 
                      aria-hidden 
                    />
                  )}
                  <div
                    className={
                      isPrroSection
                        ? "min-w-0 flex-1 space-y-1.5"
                        : compact
                          ? pricingSubsectionItem.stack
                          : "min-w-0 flex-1 space-y-2.5"
                    }
                  >
                    {headline ? (
                      <p
                        className={
                          isPrroSection
                            ? "text-[0.875rem] font-medium leading-snug text-slate-700"
                            : compact
                              ? pricingSubsectionItem.title
                              : "text-[0.9375rem] font-semibold leading-snug text-acg-blue sm:text-base"
                        }
                      >
                        {headline}
                      </p>
                    ) : null}
                    {bullets.length ? (
                      <ul
                        className={
                          isPrroSection ? "space-y-1" : compact ? pricingSubsectionItem.bulletList : "space-y-2"
                        }
                      >
                        {bullets.map((line, idx) => (
                          <li
                            key={idx}
                            className={
                              isPrroSection
                                ? "flex gap-2 text-[0.875rem] leading-relaxed text-slate-600"
                                : compact
                                  ? pricingSubsectionItem.bulletRow
                                  : "flex gap-2.5 text-sm font-light leading-relaxed text-foreground/72"
                            }
                          >
                            {!isPrroSection && (
                              <span
                                className={
                                  compact
                                    ? pricingSubsectionItem.bulletMark
                                    : "mt-2 h-px w-2.5 shrink-0 bg-foreground/20"
                                }
                                aria-hidden
                              />
                            )}
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {showNote ? (
                      <p
                        className={
                          isPrroSection
                            ? "mt-0.5 pt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500"
                            : compact
                              ? pricingSubsectionItem.note
                              : "mt-1 border-t border-foreground/[0.08] pt-3 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/42"
                        }
                      >
                        {f.note}
                      </p>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        ) : null}
        {!hasFeatureRows && descLines.length > 0 ? (
          <motion.ul
            variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
            initial="hidden"
            animate="visible"
            className={`mt-6 flex flex-col text-sm text-foreground/82 ${gapClass} ${
              isSimpleOffer
                ? "rounded-2xl border border-acg-blue/10 bg-acg-blue/[0.03] p-5 sm:p-6"
                : ""
            }`}
          >
            {descLines.map((f, j) => (
              <motion.li
                key={`${f}-${j}`}
                variants={isMdUp ? featureItemVariants : featureItemVariantsMobile}
                className={`flex gap-3 leading-relaxed ${isSimpleOffer ? "text-[0.9375rem] sm:text-base" : ""}`}
              >
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-acg-blue"
                  strokeWidth={2.25}
                  aria-hidden
                />
                <span className="min-w-0 break-words">{f}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
        {showEmptyFallback ? (
          <p className="mt-6 rounded-2xl border border-dashed border-foreground/20 bg-white/70 px-4 py-4 text-sm leading-relaxed text-foreground/62">
            Деталі пакета уточнюйте у менеджера — підкажемо оптимальний формат супроводу під ваш ФОП чи ТОВ.
          </p>
        ) : null}
      </div>

      {showRightColumn ? (
        <aside
          className={`relative flex flex-1 flex-col border-t border-acg-blue/[0.1] p-6 sm:p-8 md:border-l md:border-t-0 lg:max-w-sm lg:basis-[38%] lg:p-10 ${
            popular
              ? "bg-[linear-gradient(165deg,color-mix(in_oklab,var(--color-acg-blue)_6%,transparent)_0%,#fff_38%,rgb(254_252_232/0.7)_100%)]"
              : "bg-gradient-to-b from-acg-blue/[0.035] to-white"
          } ${isRegistrationTier ? "lg:basis-[32%]" : "lg:basis-[38%]"}`}
        >
          <div className="min-w-0 flex-1 pb-6">
            {isPlaceholder ? (
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/45">
                Оновлюється
              </p>
            ) : priceDisplayRaw ? (
              <p className="break-words text-[1.625rem] font-bold leading-snug tracking-tight text-acg-blue sm:text-4xl md:text-[2.25rem] lg:text-[2.75rem]">
                {priceDisplayRaw}
              </p>
            ) : (
              <p className="max-w-[18rem] text-base font-semibold leading-snug tracking-tight text-acg-blue sm:text-xl">
                На запит
              </p>
            )}
            {!isPlaceholder && !priceDisplayRaw ? (
              <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-foreground/65">
                Ціна залежить від об&apos;єму послуг; залишіть заявку — узгодимо умови.
              </p>
            ) : null}
          </div>
          <motion.button
            type="button"
            onClick={onOrderClick}
            className={`mt-auto inline-flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-full px-5 py-3.5 text-center text-sm font-semibold leading-snug text-white transition-[transform,filter] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-red/40 focus-visible:ring-offset-2 md:hover:-translate-y-px sm:px-6 sm:text-[0.9375rem] ${ctaBase}`}
            initial={false}
            animate={ctaPulseAnimate}
            transition={
              reduceMotionPreferred || !isMdUp
                ? { duration: 0 }
                : ctaPulseTransition
            }
          >
            {orderButtonLabel}
          </motion.button>
        </aside>
      ) : null}
    </div>
  );
}
