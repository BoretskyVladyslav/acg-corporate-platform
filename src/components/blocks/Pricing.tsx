"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { externalLinkProps } from "@/src/lib/externalLink";
import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";

export interface PricingTier {
  name?: string;
  price?: string;
  cadence?: string;
  description?: string;
  features?: string[];
  extraSections?: Array<{ title?: string; items?: string[] }>;
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

export interface PricingProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: "Консультація",
    price: "2000 грн",
    cadence: "",
    description:
      "Детальна консультація з бухгалтером та юристом. Тривалість 1 година. Формат: онлайн або офлайн. Повний розбір вашої ситуації та розробка стратегії",
    features: [],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: false,
  },
  {
    name: "Реєстрація ФОП",
    price: "1500 грн",
    cadence: "",
    description:
      "Включає підбір КВЕД, подачу документів, вибір системи оподаткування та супровід до отримання витягу з реєстру",
    features: [],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: false,
  },
  {
    name: "ФОП 1 група",
    price: "1000 грн",
    cadence: " / міс.",
    description: "",
    features: [
      "Подання звітності (річна, ЄСВ та ПДФО)",
      "Формування реквізитів на сплату",
      "Відслідковування своєчасності оплат",
      "Консультування з питань діяльності",
      "Формування книги обліку доходів",
      "Відслідковування лімітів доходів",
      "Складання рахунків та актів",
      "Допомога в створенні ЕЦП",
    ],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: false,
  },
  {
    name: "ФОП 2 та 3 групи",
    price: "від 1500 грн",
    cadence: " / міс.",
    description: "",
    features: [
      "Всі послуги з 1-ї групи",
      "Подання заяв до податкової",
      "Подання квартальної звітності",
      "Формування реквізитів на сплату",
      "Взаємодія з контролюючими органами",
      "Складання первинних документів",
      "Допомога в створенні ЕЦП",
    ],
    extraSections: [
      {
        title: "Окремий функціонал з ПРРО",
        items: [
          "Перевірка даних Z-звіту з кабінетом (ПРРО)",
          "Інформування про помилки (ПРРО)",
          "Акти виправлення помилок (ПРРО)",
        ],
      },
    ],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: true,
  },
];

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function mergePricingTiers(
  cms: PricingTier[] | undefined,
  defaults: PricingTier[],
): PricingTier[] {
  if (!cms?.length) return defaults;
  return cms.map((t, i) => {
    const d = defaults[Math.min(i, defaults.length - 1)];
    const cmsFeatures = (t.features ?? []).filter((x) => Boolean(x?.trim()));
    const features = cmsFeatures.length ? cmsFeatures : (d.features ?? []);
    const extraFromCms = t.extraSections?.filter(
      (s) =>
        Boolean(s.title?.trim()) &&
        (s.items ?? []).some((line) => Boolean(line?.trim())),
    );
    const extraSections =
      extraFromCms && extraFromCms.length > 0 ? extraFromCms : d.extraSections;

    return {
      name: textOr(t.name, d.name ?? ""),
      price: textOr(t.price, d.price ?? ""),
      cadence: t.cadence?.trim() || d.cadence || "",
      description: textOr(t.description, d.description ?? ""),
      features,
      extraSections,
      ctaLabel: textOr(t.ctaLabel, d.ctaLabel ?? "Отримати консультацію"),
      ctaHref: textOr(t.ctaHref, d.ctaHref ?? "#contact"),
      highlighted:
        typeof t.highlighted === "boolean"
          ? t.highlighted
          : Boolean(d.highlighted),
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

function getPriceParts(tier: PricingTier): {
  prefix?: string;
  figure: string;
  showCurrency: boolean;
  cadenceSuffix: string;
} {
  const raw = (tier.price ?? "").trim();
  const cadRaw = (tier.cadence ?? "").trim();
  const cadenceSuffix = cadRaw.replace(/^\s*\/?\s*/, "").trim();

  let prefix: string | undefined;
  let rest = raw;
  if (/^від\s+/i.test(rest)) {
    prefix = "Від";
    rest = rest.replace(/^від\s+/i, "").trim();
  }

  const m = rest.match(/^([\d\s]+)\s*(грн)?\.?$/i);
  if (m) {
    const figure = m[1].replace(/\s/g, "");
    return {
      prefix,
      figure,
      showCurrency: true,
      cadenceSuffix,
    };
  }

  return {
    prefix,
    figure: raw,
    showCurrency: false,
    cadenceSuffix,
  };
}

function tierShowsPopularBadge(tier: PricingTier): boolean {
  if (tier.highlighted) return true;
  const n = tier.name ?? "";
  return n.includes("2") && n.includes("3") && n.toLowerCase().includes("фоп");
}

export default function Pricing({
  eyebrow,
  heading,
  intro,
  tiers,
}: PricingProps) {
  const displayEyebrow = textOr(eyebrow, DEFAULT_PRICING_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_PRICING_HEADING);
  const displayIntro = textOr(intro, DEFAULT_PRICING_INTRO);
  const resolvedTiers = mergePricingTiers(tiers, defaultTiers);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const selectTier = useCallback(
    (index: number) => {
      if (index >= 0 && index < resolvedTiers.length) {
        setSelectedIndex(index);
      }
    },
    [resolvedTiers.length],
  );

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
      <div className="mx-auto max-w-6xl min-w-0 px-4 py-24 sm:px-6 sm:py-28 lg:py-32">
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
            className="mt-10 flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:gap-2 md:overflow-x-visible md:scroll-px-0 md:pb-2 lg:justify-start [&::-webkit-scrollbar]:hidden"
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
                  className={`snap-start shrink-0 touch-manipulation whitespace-nowrap rounded-full border font-semibold transition-colors min-h-[48px] px-5 py-4 text-base leading-snug md:min-h-0 md:px-4 md:py-2.5 md:text-sm md:font-medium ${
                    isActive
                      ? "border-acg-blue bg-acg-blue text-white shadow-md shadow-acg-blue/30 ring-1 ring-black/[0.06] md:shadow-acg-blue/25 md:ring-0"
                      : "border-foreground/20 bg-white text-foreground/85 hover:border-acg-blue/50 hover:bg-acg-blue/[0.08] hover:text-acg-blue md:border-acg-blue/20 md:text-acg-blue md:hover:border-acg-blue/40 md:hover:bg-acg-blue/5"
                  }`}
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
                  {t.name}
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}

        <div className="relative mx-auto mt-10 max-w-4xl">
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
              className="relative overflow-hidden rounded-3xl border border-acg-blue/10 bg-white shadow-lg shadow-acg-blue/[0.07]"
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
                <PricingCheckoutPanel tier={tier} />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PricingCheckoutPanel({ tier }: { tier: PricingTier }) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const mainFeatures = tier.features ?? [];
  const sections = tier.extraSections ?? [];
  const descLines =
    mainFeatures.length === 0 && tier.description?.trim()
      ? splitDescriptionToLines(tier.description)
      : [];
  const allLines = mainFeatures.length > 0 ? mainFeatures : descLines;
  const gapClass = allLines.length > 6 ? "gap-2.5" : "gap-3";
  const priceParts = getPriceParts(tier);
  const popular = tierShowsPopularBadge(tier);
  const ctaBase = "bg-acg-blue hover:brightness-110";
  const ctaHref = textOr(tier.ctaHref, "#contact");

  const ctaPulseAnimate =
    reduceMotionPreferred || !isMdUp ? {} : { boxShadow: ctaPulseShadowBlue };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="flex flex-col md:col-span-2 md:border-r md:border-acg-blue/[0.08] p-8 sm:p-10">
        {popular ? (
          <span className="mb-3 inline-flex w-fit rounded-full bg-acg-blue/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-acg-blue">
            Найчастіший вибір
          </span>
        ) : null}
        <h3 className="text-xl font-semibold tracking-tight text-acg-blue sm:text-2xl">
          {tier.name}
        </h3>
        <div className="mt-4 h-px w-full bg-acg-border" aria-hidden />
        {tier.description?.trim() && mainFeatures.length > 0 ? (
          <p className="mt-5 text-sm leading-relaxed text-foreground/72">
            {tier.description}
          </p>
        ) : null}
        {allLines.length > 0 ? (
          <motion.ul
            variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
            initial="hidden"
            animate="visible"
            className={`mt-6 flex flex-col text-sm text-foreground/85 ${gapClass}`}
          >
            {allLines.map((f, j) => (
              <motion.li
                key={j}
                variants={isMdUp ? featureItemVariants : featureItemVariantsMobile}
                className="flex gap-3 leading-relaxed"
              >
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-acg-blue"
                  strokeWidth={2.25}
                  aria-hidden
                />
                <span>{f}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
        {sections.map((block, si) => {
          const lines = (block.items ?? []).filter((x) => Boolean(x?.trim()));
          const title = block.title?.trim();
          if (!title || lines.length === 0) return null;
          return (
            <div key={`${title}-${si}`} className="mt-8">
              <p className="text-sm font-semibold text-acg-blue">{title}</p>
              <motion.ul
                variants={isMdUp ? featuresListVariants : featuresListVariantsMobile}
                initial="hidden"
                animate="visible"
                className={`mt-3 flex flex-col text-sm text-foreground/85 ${gapClass}`}
              >
                {lines.map((f, j) => (
                  <motion.li
                    key={j}
                    variants={isMdUp ? featureItemVariants : featureItemVariantsMobile}
                    className="flex gap-3 leading-relaxed"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-acg-blue"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                    <span>{f}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between gap-8 border-t border-acg-blue/[0.08] bg-acg-blue/[0.05] p-8 sm:p-10 md:col-span-1 md:border-t-0 md:rounded-none">
        <div>
          {priceParts.prefix ? (
            <p className="text-base font-medium tracking-wide text-acg-muted">
              {priceParts.prefix}
            </p>
          ) : null}
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-6xl font-semibold tracking-tighter text-acg-blue sm:text-7xl">
              {priceParts.figure}
            </span>
            {priceParts.showCurrency ? (
              <span className="text-base font-normal tracking-wide text-acg-muted">
                грн
                {priceParts.cadenceSuffix ? (
                  <span className="text-acg-muted">
                    {" "}
                    / {priceParts.cadenceSuffix}
                  </span>
                ) : null}
              </span>
            ) : priceParts.cadenceSuffix ? (
              <span className="text-base font-normal tracking-wide text-acg-muted">
                {priceParts.cadenceSuffix}
              </span>
            ) : null}
          </p>
        </div>
        <motion.a
          href={ctaHref}
          {...externalLinkProps(ctaHref)}
          className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-semibold text-white transition-[transform,filter] duration-300 ease-out md:hover:-translate-y-px ${ctaBase}`}
          initial={false}
          animate={ctaPulseAnimate}
          transition={
            reduceMotionPreferred || !isMdUp
              ? { duration: 0 }
              : ctaPulseTransition
          }
        >
          {textOr(tier.ctaLabel, "Почати")}
        </motion.a>
      </div>
    </div>
  );
}
