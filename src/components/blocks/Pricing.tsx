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
  prepareConsultationFromPricingTier,
  prepareConsultationGeneral,
} from "@/src/lib/leadIntent";
import {
  ACG_PRICING_PRESET_EVENT,
  findTierIndexForPreset,
  type PricingTierPreset,
} from "@/src/lib/pricingTierNavigation";
import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";

import type { ServiceItem } from "./Services";

export interface PricingTier {
  name?: string;
  /** Повний рядок ціни з CMS (або дефолтів), як показано на сторінці. */
  priceText?: string;
  description?: string;
  /** Пункти тарифу з Sanity (`featureItem`). */
  features?: ServiceItem[];
  isPopular?: boolean;
}

export interface PricingProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  tiers?: PricingTier[];
  /** Текст над нижньою кнопкою консультації (Sanity `pricing.ctaText`). */
  ctaText?: string;
  /** Підпис синьої кнопки замовлення у картці тарифу (`pricing.globalButtonLabel`). */
  globalButtonLabel?: string;
}

const DEFAULT_GLOBAL_ORDER_LABEL = "Замовити";

const DEFAULT_PRICING_CTA_BOTTOM_TEXT =
  "Потрібна допомога з вибором? Залиште заявку на загальну консультацію — підкажемо оптимальний формат без прив’язки до конкретного тарифу.";

const defaultTiers: PricingTier[] = [
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
    name: "ФОП 2 та 3 групи",
    priceText: "від 1500 грн / міс.",
    description: "",
    features: [
      { title: "Всі послуги з 1-ї групи" },
      { title: "Подання заяв до податкової" },
      { title: "Подання квартальної звітності" },
      { title: "Формування реквізитів на сплату" },
      { title: "Взаємодія з контролюючими органами" },
      { title: "Складання первинних документів" },
      { title: "Допомога в створенні ЕЦП" },
    ],
    isPopular: true,
  },
];

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

/** Якщо в CMS є хоч один пункт — показуємо лише їх, без змішування з дефолтами. */
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

function mergePricingTiers(
  cms: PricingTier[] | undefined,
  defaults: PricingTier[],
): PricingTier[] {
  if (!cms?.length) return defaults;
  return cms.map((t, i) => {
    const d = defaults[Math.min(i, defaults.length - 1)];
    const hasCmsFeatures = tierHasCmsFeatures(t);
    const features = hasCmsFeatures
      ? featuresFromCmsOnly(t.features ?? [])
      : (d.features ?? []);

    const isPopularMerged =
      typeof t.isPopular === "boolean" ? t.isPopular : Boolean(d.isPopular);

    const cmsDescriptionRaw =
      typeof t.description === "string" ? t.description.trim() : "";
    const description = hasCmsFeatures
      ? cmsDescriptionRaw
      : textOr(t.description, d.description ?? "");

    return {
      name: textOr(t.name, d.name ?? ""),
      priceText: textOr(t.priceText, d.priceText ?? ""),
      description,
      features,
      isPopular: Boolean(isPopularMerged),
    };
  });
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

const ctaPulseShadowBlue = [
  "0 10px 26px -14px rgba(36, 84, 148, 0.22)",
  "0 12px 42px -10px rgba(36, 84, 148, 0.42)",
  "0 10px 26px -14px rgba(36, 84, 148, 0.22)",
];

const headingGradientClass =
  "bg-linear-to-b from-acg-blue via-acg-blue to-acg-blue/75 bg-clip-text font-black uppercase leading-[0.95] tracking-tighter text-transparent [background-clip:text] [-webkit-background-clip:text]";

const headerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const headerContainerVariantsMobile = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0 },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 105,
      damping: 20,
      mass: 1,
    },
  },
};

const headerItemVariantsMobile = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: tierSwitchEase },
  },
};

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
    Boolean(f.title?.trim()) ||
    Boolean(f.description?.trim()) ||
    Boolean(f.note?.trim())
  );
}

/** Усі звичайні пункти після останнього `isHeader` (до наступного заголовка) — компактний підсписок. */
function followsPricingSubsectionHeader(
  items: ServiceItem[],
  index: number,
): boolean {
  let lastHeaderIndex = -1;
  for (let i = 0; i < index; i++) {
    const row = items[i];
    if (!pricingFeatureRowIsRenderable(row)) continue;
    if (row.isHeader === true) {
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
  tiers,
  ctaText,
  globalButtonLabel,
}: PricingProps) {
  const displayEyebrow = textOr(eyebrow, DEFAULT_PRICING_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_PRICING_HEADING);
  const displayIntro = textOr(intro, DEFAULT_PRICING_INTRO);
  const displayCtaText = textOr(ctaText, DEFAULT_PRICING_CTA_BOTTOM_TEXT);
  const displayOrderLabel = textOr(
    globalButtonLabel,
    DEFAULT_GLOBAL_ORDER_LABEL,
  );
  const resolvedTiers = mergePricingTiers(tiers, defaultTiers);
  const preferredPopularIdx = resolvedTiers.findIndex((t) => isPopularTier(t));
  const [selectedIndex, setSelectedIndex] = useState(
    preferredPopularIdx >= 0 ? preferredPopularIdx : 0,
  );
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultModalKey, setConsultModalKey] = useState(0);
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();

  const maxTierIndex = Math.max(0, resolvedTiers.length - 1);
  const safeIndex = Math.min(Math.max(0, selectedIndex), maxTierIndex);
  const tier = resolvedTiers[safeIndex] ?? resolvedTiers[0];

  useEffect(() => {
    const tierName = resolvedTiers[safeIndex]?.name?.trim() ?? "";
    try {
      if (typeof window !== "undefined" && tierName) {
        sessionStorage.setItem(ACG_SELECTED_PRICING_TIER_KEY, tierName);
      }
    } catch {
      /* sessionStorage недоступний або переповнений */
    }
  }, [safeIndex, resolvedTiers]);

  const selectTier = (index: number) => {
    if (index >= 0 && index < resolvedTiers.length) {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ preset?: PricingTierPreset }>;
      const preset = ce.detail?.preset;
      if (preset !== "fop-registration") return;
      const idx = findTierIndexForPreset(resolvedTiers, preset);
      if (idx >= 0 && idx < resolvedTiers.length) {
        setSelectedIndex(idx);
      }
    };
    window.addEventListener(ACG_PRICING_PRESET_EVENT, handler);
    return () => window.removeEventListener(ACG_PRICING_PRESET_EVENT, handler);
  }, [resolvedTiers]);

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

  const headerContainerResolved = useMemo(
    () =>
      reduceMotionPreferred
        ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
        : isMdUp
          ? headerContainerVariants
          : headerContainerVariantsMobile,
    [reduceMotionPreferred, isMdUp],
  );

  const headerItemResolved = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0 } },
          }
        : isMdUp
          ? headerItemVariants
          : headerItemVariantsMobile,
    [reduceMotionPreferred, isMdUp],
  );

  if (!tier) {
    return null;
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="overflow-x-hidden bg-acg-light text-foreground"
    >
      <div className="mx-auto max-w-6xl min-w-0 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          variants={headerContainerResolved}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={headerItemResolved}
            className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60"
          >
            {displayEyebrow}
          </motion.p>
          <motion.h2
            id="pricing-heading"
            variants={headerItemResolved}
            className={`${headingGradientClass} mt-3 max-w-[min(100%,28rem)] text-4xl sm:text-5xl lg:text-6xl`}
          >
            {displayHeading}
          </motion.h2>
          <motion.p
            variants={headerItemResolved}
            className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75"
          >
            {displayIntro}
          </motion.p>
        </motion.div>

        {resolvedTiers.length > 1 ? (
          <motion.div
            role="tablist"
            aria-label="Тарифи та послуги"
            className="mt-8 flex w-full min-w-0 snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-px-2 pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 md:mt-10 md:flex-wrap md:justify-center md:gap-2 md:overflow-x-visible md:scroll-px-0 md:pb-2 md:pt-0 lg:justify-start [&::-webkit-scrollbar]:hidden"
            initial={isMdUp ? { opacity: 0, y: 12 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: isMdUp ? 0.45 : 0.32,
              ease: tierSwitchEase,
            }}
          >
            {resolvedTiers.map((t, i) => {
              const isActive = i === safeIndex;
              return (
                <motion.button
                  key={`${t.name}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="pricing-tier-panel"
                  id={`pricing-tier-tab-${i}`}
                  onClick={() => selectTier(i)}
                  className={`snap-start shrink-0 touch-manipulation rounded-full border font-semibold transition-colors min-h-[48px] max-w-[calc(100vw-2.5rem)] px-4 py-3.5 text-left text-sm leading-snug sm:max-w-none sm:px-5 sm:py-4 sm:text-base md:min-h-0 md:max-w-none md:px-4 md:py-2.5 md:text-center md:text-sm md:font-medium ${
                    isActive
                      ? "border-acg-blue bg-acg-blue text-white shadow-md shadow-acg-blue/30 ring-1 ring-black/[0.06] md:shadow-acg-blue/25 md:ring-0"
                      : "border-foreground/20 bg-white text-foreground/85 hover:border-acg-blue/50 hover:bg-acg-blue/[0.08] hover:text-acg-blue md:border-acg-blue/20 md:text-acg-blue md:hover:border-acg-blue/40 md:hover:bg-acg-blue/5"
                  } ${isPopularTier(t) ? "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-white" : ""}`}
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
                      <span className="break-words">{t.name}</span>
                      {isPopularTier(t) ? (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"}`}
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
          </motion.div>
        ) : null}

        <div className="relative mx-auto mt-6 min-w-0 max-w-4xl sm:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={safeIndex}
              id="pricing-tier-panel"
              role="tabpanel"
              aria-labelledby={
                resolvedTiers.length > 1
                  ? `pricing-tier-tab-${safeIndex}`
                  : "pricing-heading"
              }
              aria-live="polite"
              {...panelMotionProps}
              className={`relative min-w-0 overflow-hidden rounded-3xl border bg-white shadow-lg transition-[box-shadow,border-color] ${
                isPopularTier(tier)
                  ? "border-acg-blue/45 shadow-2xl shadow-amber-500/10 ring-2 ring-amber-400/55"
                  : "border-acg-blue/12 shadow-md shadow-acg-blue/[0.06]"
              }`}
            >
              {reduceMotionPreferred || !isMdUp ? (
                <span
                  aria-hidden
                  style={watermarkOutlineStyle}
                  className={`${watermarkPositionClass} opacity-[0.45]`}
                >
                  {String(safeIndex + 1).padStart(2, "0")}
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
                  {String(safeIndex + 1).padStart(2, "0")}
                </motion.span>
              )}
              <div className="relative z-[1]">
                <PricingCheckoutPanel
                  tier={tier}
                  orderButtonLabel={displayOrderLabel}
                  onOrderClick={() => {
                    prepareConsultationFromPricingTier(tier.name ?? "");
                    setConsultModalKey((k) => k + 1);
                    setConsultModalOpen(true);
                  }}
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 px-1 sm:mt-12"
          initial={isMdUp ? { opacity: 0, y: 12 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: tierSwitchEase }}
        >
          <p className="max-w-xl text-center text-sm leading-relaxed text-foreground/65">
            {displayCtaText}
          </p>
          <motion.button
            type="button"
            onClick={() => {
              prepareConsultationGeneral();
              setConsultModalKey((k) => k + 1);
              setConsultModalOpen(true);
            }}
            className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center rounded-full bg-acg-red px-8 py-3.5 text-center text-sm font-semibold text-white shadow-md ring-1 ring-white/25 transition hover:bg-acg-red/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-red/35 focus-visible:ring-offset-2 focus-visible:ring-offset-acg-light sm:w-auto"
          >
            Отримати консультацію
          </motion.button>
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
  const hasFeatureRows = mainFeatures.some(
    (f) =>
      f.isHeader === true ||
      Boolean(f.title?.trim()) ||
      Boolean(f.description?.trim()) ||
      Boolean(f.note?.trim()),
  );
  const descLines =
    !hasFeatureRows && tier.description?.trim()
      ? splitDescriptionToLines(tier.description)
      : [];
  const gapClass = Math.max(mainFeatures.length, descLines.length) > 6 ? "gap-2.5" : "gap-3";
  const priceDisplayRaw = tier.priceText?.trim() ?? "";
  const popular = isPopularTier(tier);
  const ctaBase = popular
    ? "bg-acg-blue ring-2 ring-amber-300/60 hover:brightness-105"
    : "bg-acg-blue hover:brightness-110";
  const showEmptyFallback =
    !hasFeatureRows &&
    descLines.length === 0 &&
    !tier.description?.trim();

  const ctaPulseAnimate =
    reduceMotionPreferred || !isMdUp ? {} : { boxShadow: ctaPulseShadowBlue };

  return (
    <div className="flex min-h-[min(28rem,82svh)] flex-col md:min-h-[26rem] md:flex-row md:items-stretch">
      <div className="relative flex min-h-0 flex-1 flex-col border-b border-acg-blue/[0.1] p-6 sm:p-8 md:border-b-0 md:border-r lg:basis-[62%] lg:p-10 lg:pl-11">
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
        <div className="mt-4 h-px w-full min-w-0 bg-acg-border" aria-hidden />
        {tier.description?.trim() && hasFeatureRows ? (
          <p className="mt-5 text-sm leading-relaxed text-foreground/72">
            {tier.description}
          </p>
        ) : null}
        {hasFeatureRows ? (
          <motion.ul
            variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
            initial="hidden"
            animate="visible"
            className="mt-6 flex min-h-0 flex-1 flex-col"
          >
            {mainFeatures.map((f, j) => {
              if (
                f.isHeader !== true &&
                !f.title?.trim() &&
                !f.description?.trim() &&
                !f.note?.trim()
              ) {
                return null;
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
                    className="mt-6 mb-2 first:mt-0"
                  >
                    <p className="text-base font-bold leading-snug text-acg-blue sm:text-[1.0625rem]">
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
                    compact ? pricingSubsectionItem.row : "flex gap-4 py-5 first:pt-0 lg:gap-5 lg:py-6"
                  }
                >
                  <FeatureIcon
                    className={
                      compact
                        ? pricingSubsectionItem.icon
                        : "mt-1 h-4 w-4 shrink-0 text-acg-blue"
                    }
                    aria-hidden
                    strokeWidth={2.25}
                  />
                  <div
                    className={
                      compact
                        ? pricingSubsectionItem.stack
                        : "min-w-0 flex-1 space-y-2.5"
                    }
                  >
                    {headline ? (
                      <p
                        className={
                          compact
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
                          compact ? pricingSubsectionItem.bulletList : "space-y-2"
                        }
                      >
                        {bullets.map((line, idx) => (
                          <li
                            key={idx}
                            className={
                              compact
                                ? pricingSubsectionItem.bulletRow
                                : "flex gap-2.5 text-sm font-light leading-relaxed text-foreground/72"
                            }
                          >
                            <span
                              className={
                                compact
                                  ? pricingSubsectionItem.bulletMark
                                  : "mt-2 h-px w-2.5 shrink-0 bg-foreground/20"
                              }
                              aria-hidden
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {showNote ? (
                      <p
                        className={
                          compact
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
          </motion.ul>
        ) : null}
        {!hasFeatureRows && descLines.length > 0 ? (
          <motion.ul
            variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
            initial="hidden"
            animate="visible"
            className={`mt-6 flex flex-col text-sm text-foreground/82 ${gapClass}`}
          >
            {descLines.map((f, j) => (
              <motion.li
                key={`${f}-${j}`}
                variants={isMdUp ? featureItemVariants : featureItemVariantsMobile}
                className="flex gap-3 leading-relaxed"
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

      <aside
        className={`relative flex flex-1 flex-col border-t border-acg-blue/[0.1] p-6 sm:p-8 md:border-l md:border-t-0 lg:max-w-sm lg:basis-[38%] lg:p-10 ${
          popular
            ? "bg-[linear-gradient(165deg,color-mix(in_oklab,var(--color-acg-blue)_6%,transparent)_0%,#fff_38%,rgb(254_252_232/0.7)_100%)]"
            : "bg-gradient-to-b from-acg-blue/[0.035] to-white"
        }`}
      >
        <div className="min-w-0 flex-1 pb-6">
          {priceDisplayRaw ? (
            <p className="break-words text-[1.625rem] font-bold leading-snug tracking-tight text-acg-blue sm:text-4xl md:text-[2.25rem] lg:text-[2.75rem]">
              {priceDisplayRaw}
            </p>
          ) : (
            <p className="max-w-[18rem] text-base font-semibold leading-snug tracking-tight text-acg-blue sm:text-xl">
              На запит
            </p>
          )}
          {!priceDisplayRaw ? (
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-foreground/65">
              Ціна залежить від об&apos;єму послуг; залишіть заявку — узгодимо умови.
            </p>
          ) : null}
        </div>
        <motion.button
          type="button"
          onClick={onOrderClick}
          className={`mt-auto inline-flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-semibold text-white transition-[transform,filter] duration-300 ease-out md:hover:-translate-y-px ${ctaBase}`}
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
    </div>
  );
}
