"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Building2, LayoutGrid, TrendingUp, UserPlus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState, type MouseEvent as AnchorMouseEvent } from "react";

import { useLenis } from "@/src/components/SmoothScrolling";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { scrollToSectionById } from "@/src/lib/scrollToAnchor";

import { prepareConsultation } from "@/src/lib/leadIntent";
import {
  dispatchPricingTierPreset,
  type PricingTierPreset,
} from "@/src/lib/pricingTierNavigation";

import teamPhoto from "@/public/images/hero-team.png";

import ConsultationModal from "./ConsultationModal";

export type HeroCardContent = {
  /** Заголовок картки з CMS або дефолт з HERO_NAV_CARDS. */
  title?: string;
  subtitle?: string;
};

export interface HeroProps {
  heading?: string;
  subheading?: string;
  heroCards?: HeroCardContent[];
  mainButtons?: Array<{
    title?: string;
    subtitle?: string;
    price?: string;
    buttonStyle?: string;
    actionType?: string;
  }>;
  backgroundImageUrl?: string;
}

// ─── Дефолти (fallback якщо CMS порожній) ────────────────────────────────────
const HERO_TEAM_IMAGE_ALT = "Команда ACG Accounting";

const HERO_FREE_CTA_DEFAULTS = {
  title: "Отримати первинну консультацію",
  hint: "ШВИДКА ВІДПОВІДЬ У TELEGRAM",
} as const;

const HERO_PAID_CTA_DEFAULTS = {
  title: "КОНСУЛЬТАЦІЯ",
  hint: "ТРИВАЛІСТЬ 1 ГОД. З БУХГАЛТЕРОМ ТА ЮРИСТОМ",
  price: "2000 грн",
} as const;

// ─── Навігаційні картки (дефолти; title та subtitle перекриваються з CMS) ──────
type HeroNavCard = {
  defaultTitle: string;
  defaultSubtitle: string;
  icon: typeof UserPlus;
  href: string;
  pricingPreset?: PricingTierPreset;
};

const HERO_NAV_CARDS: HeroNavCard[] = [
  {
    defaultTitle: "Реєстрація ФОП",
    defaultSubtitle: "Пакет послуг: Реєстрація ФОП",
    icon: UserPlus,
    href: "#pricing?tab=fop-registration",
    pricingPreset: "fop-registration",
  },
  {
    defaultTitle: "Бухгалтерія для ФОП",
    defaultSubtitle: "Пакет послуг: Бухгалтерія для ФОП",
    icon: TrendingUp,
    href: "#pricing?tab=fop-accounting",
    pricingPreset: "fop-accounting",
  },
  {
    defaultTitle: "Бухгалтерія для ТОВ",
    defaultSubtitle: "Пакет послуг: Бухгалтерія для ТОВ",
    icon: Building2,
    href: "#pricing?tab=tov-accounting",
    pricingPreset: "tov-accounting",
  },
  {
    defaultTitle: "Інші послуги",
    defaultSubtitle: "Пакет послуг: Інші послуги",
    icon: LayoutGrid,
    href: "#pricing?tab=other-services",
    pricingPreset: "other-services",
  },
];

// ─── Утиліти ─────────────────────────────────────────────────────────────────

function splitHeroHeading(heading: string): {
  accentPrimary: string;
  accentSecondary: string;
  supporting: string | null;
} {
  const emDashIdx = heading.indexOf("—");
  if (emDashIdx === -1) {
    const dotIdx = heading.indexOf(". ");
    if (dotIdx !== -1) {
      return {
        accentPrimary: heading.slice(0, dotIdx).trim(),
        accentSecondary: "",
        supporting: heading.slice(dotIdx + 2).trim(),
      };
    }
    return {
      accentPrimary: heading.trim(),
      accentSecondary: "",
      supporting: null,
    };
  }
  const accentPrimary = heading.slice(0, emDashIdx).trim();
  const rest = heading.slice(emDashIdx + 1).trim();
  const dotIdx = rest.indexOf(". ");
  if (dotIdx !== -1) {
    return {
      accentPrimary,
      accentSecondary: rest.slice(0, dotIdx).trim(),
      supporting: rest.slice(dotIdx + 2).trim(),
    };
  }
  return {
    accentPrimary,
    accentSecondary: rest,
    supporting: null,
  };
}

function useMousePosition(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (!enabled) return;
    const handle = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [enabled, x, y]);

  return { x, y };
}

// ─── Анімаційні варіанти ──────────────────────────────────────────────────────

const contentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const itemVariantsMobile = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const contentVariantsMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0,
    },
  },
};

// ─── CSS-класи ───────────────────────────────────────────────────────────────

const headlineAccentClass =
  "bg-gradient-to-b from-acg-blue via-acg-blue to-acg-blue/85 bg-clip-text font-black uppercase leading-[1.06] tracking-tight text-transparent [background-clip:text] [-webkit-background-clip:text] text-[clamp(1.375rem,5.2vw,1.75rem)] sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-[3.25rem] lg:leading-[1.05] xl:text-[3.75rem]";

const headlineSupportingClass =
  "mt-3 max-w-3xl font-light leading-relaxed tracking-normal text-foreground/80 normal-case text-sm sm:mt-6 sm:text-base md:text-lg lg:mt-6 lg:text-[1.0625rem] xl:mt-7 xl:text-[1.125rem]";

const grainPatternUrl =
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  ) +
  '")';

const ctaShineClass = "cta-shine";

const heroPrimaryCtaClass = `${ctaShineClass} inline-flex min-h-[4.25rem] w-full flex-1 items-center justify-center rounded-2xl bg-acg-red px-4 py-3.5 text-center shadow-md shadow-acg-red/20 transition-colors hover:bg-acg-red/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 sm:min-h-[4.5rem] sm:px-5 sm:py-4`;

const heroSecondaryCtaClass = `${ctaShineClass} inline-flex min-h-[4.25rem] w-full flex-1 items-center justify-center rounded-2xl border-2 border-acg-red/25 bg-white px-4 py-3.5 text-center shadow-sm transition hover:border-acg-red/45 hover:bg-acg-red/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-red/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 sm:min-h-[4.5rem] sm:px-5 sm:py-4`;

// ─── Компонент CTA-кнопки ─────────────────────────────────────────────────────

function HeroConsultationCta({
  variant,
  title,
  hint,
  price,
  onClick,
}: {
  variant: "free" | "paid";
  title: string;
  hint: string;
  price?: string;
  onClick: () => void;
}) {
  const hintClass =
    variant === "free"
      ? "text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.06em] text-white/85 sm:text-[0.6875rem]"
      : "text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.06em] text-acg-red/70 sm:text-[0.6875rem]";
  const priceClass =
    "text-[0.75rem] font-bold uppercase leading-snug tracking-[0.05em] text-acg-red sm:text-[0.8125rem]";

  const labelClass =
    variant === "free"
      ? "text-[0.6875rem] font-bold uppercase leading-[1.2] tracking-[0.04em] text-white sm:text-xs lg:text-[0.8125rem]"
      : "text-[0.6875rem] font-bold uppercase leading-[1.2] tracking-[0.04em] text-acg-red sm:text-xs lg:text-[0.8125rem]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={variant === "free" ? heroPrimaryCtaClass : heroSecondaryCtaClass}
    >
      <span className="relative z-20 flex max-w-[18rem] flex-col items-center gap-1.5 sm:max-w-[14rem] lg:max-w-[16rem]">
        <span className={labelClass}>{title}</span>
        <span className={hintClass}>{hint}</span>
        {price ? <span className={priceClass}>{price}</span> : null}
      </span>
    </button>
  );
}

// ─── Фото-бейджи ─────────────────────────────────────────────────────────────

const heroPhotoCardClass =
  "relative mx-auto w-full max-w-[min(100%,36rem)] aspect-square min-w-0 lg:max-w-[28rem] xl:max-w-[32rem]";

const heroPhotoFrameClass =
  "relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/90 via-acg-light/45 to-acg-blue/[0.05] shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/[0.06] md:rounded-3xl";

const heroPhotoImageClass = "h-full w-full object-cover object-center";

const heroStatBadgeShellClass =
  "relative overflow-hidden rounded-xl border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-900/10 backdrop-blur-md ring-1 ring-white/50";

interface HeroStatBadgeConfig {
  id: string;
  positionClass: string;
  animationDelay: number;
  parallaxMul: number;
  content: ReactNode;
}

const heroStatBadges: HeroStatBadgeConfig[] = [
  {
    id: "experience",
    positionClass: "-left-5 top-8 max-w-[10rem] sm:-left-7 sm:top-10 lg:-left-8 lg:top-12",
    animationDelay: 0,
    parallaxMul: 12,
    content: (
      <>
        <p className="text-sm font-semibold tracking-tight text-acg-blue lg:text-base">
          Досвід 15+
        </p>
        <p className="mt-1 text-xs font-medium text-foreground/80">
          у сфері бухгалтерії
        </p>
      </>
    ),
  },
  {
    id: "reporting",
    positionClass: "bottom-6 right-6 lg:bottom-8 lg:right-8",
    animationDelay: 1.4,
    parallaxMul: 14,
    content: (
      <div className="flex items-center gap-2">
        <TrendingUp
          className="h-4 w-4 shrink-0 text-acg-blue lg:h-5 lg:w-5"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-sm font-semibold tracking-tight text-acg-blue lg:text-base">
          100% звітність
        </p>
      </div>
    ),
  },
];

function HeroStatBadge({
  badge,
  springX,
  springY,
  reduceMotion,
  isMdUp,
}: {
  badge: HeroStatBadgeConfig;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  reduceMotion: boolean;
  isMdUp: boolean;
}) {
  const mul = isMdUp && !reduceMotion ? badge.parallaxMul : 0;
  const tx = useTransform(springX, (v) => v * mul);
  const ty = useTransform(springY, (v) => v * (mul * 0.75));
  const floatDuration = 5 + badge.animationDelay * 0.15;
  const allowHeavy = isMdUp && !reduceMotion;

  return (
    <motion.div
      className={`pointer-events-none absolute z-20 w-max ${badge.positionClass}`}
      initial={
        allowHeavy
          ? { opacity: 0, scale: 0.9, y: 16 }
          : { opacity: 0, y: 10 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: allowHeavy ? 0.7 : 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: allowHeavy ? 0.55 + badge.animationDelay * 0.12 : 0.15,
      }}
    >
      <motion.div
        animate={allowHeavy ? { y: [0, -9, 0] } : undefined}
        transition={
          allowHeavy
            ? {
                duration: floatDuration,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }
            : undefined
        }
      >
        <motion.div style={{ x: tx, y: ty }}>
          <div className={heroStatBadgeShellClass}>
            <div
              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/45 via-white/15 to-transparent"
              aria-hidden
            />
            <div className="relative z-10">{badge.content}</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Головний компонент ───────────────────────────────────────────────────────

export default function HeroClient({
  heading = "ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.",
  subheading = "",
  heroCards,
  mainButtons,
}: HeroProps) {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultModalKey, setConsultModalKey] = useState(0);
  const lenis = useLenis();
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const { accentPrimary, accentSecondary, supporting } = useMemo(
    () => splitHeroHeading(heading),
    [heading],
  );

  const parallaxOn = isMdUp && !reduceMotionPreferred;
  const { x: mouseX, y: mouseY } = useMousePosition(parallaxOn);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 22 });
  const reduceMotion = Boolean(reduceMotionPreferred);

  const heroImageAlt = HERO_TEAM_IMAGE_ALT;

  const contentMotion = isMdUp ? contentVariants : contentVariantsMobile;
  const itemMotion = isMdUp ? itemVariants : itemVariantsMobile;

  // Формуємо навігаційні картки: title та subtitle беруться з CMS якщо є,
  // інакше — з HERO_NAV_CARDS дефолтів.
  const heroNavCards = useMemo(() => {
    return HERO_NAV_CARDS.map((card, index) => {
      const cmsCard = heroCards?.[index];
      return {
        title: cmsCard?.title?.trim() || card.defaultTitle,
        subtitle: cmsCard?.subtitle?.trim() || card.defaultSubtitle,
        icon: card.icon,
        href: card.href,
        pricingPreset: card.pricingPreset,
      };
    });
  }, [heroCards]);

  // Головні кнопки: беремо з CMS, або дефолти якщо CMS порожня
  const ctaButtons = mainButtons?.length
    ? mainButtons
    : [
        {
          title: HERO_FREE_CTA_DEFAULTS.title,
          subtitle: HERO_FREE_CTA_DEFAULTS.hint,
          buttonStyle: "primary",
          actionType: "free_consultation",
        },
        {
          title: HERO_PAID_CTA_DEFAULTS.title,
          subtitle: HERO_PAID_CTA_DEFAULTS.hint,
          price: HERO_PAID_CTA_DEFAULTS.price,
          buttonStyle: "secondary",
          actionType: "paid_consultation",
        },
      ];

  const handleNavAnchorClick = useCallback(
    (
      event: AnchorMouseEvent<HTMLAnchorElement>,
      href: string,
      pricingPreset?: PricingTierPreset,
    ) => {
      if (!href.startsWith("#")) return;
      event.preventDefault();
      const cleanId = href.split("?")[0]!.slice(1);
      scrollToSectionById(cleanId, lenis);
      if (pricingPreset) {
        dispatchPricingTierPreset(pricingPreset);
      }
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", href);
      }
    },
    [lenis],
  );

  const openConsultationModal = useCallback(
    (type: "free_consultation" | "paid_consultation") => {
      prepareConsultation(type);
      setConsultModalKey((k) => k + 1);
      setConsultModalOpen(true);
    },
    [],
  );

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-foreground/10 bg-acg-light text-foreground lg:h-[100svh] lg:min-h-[700px] lg:flex lg:flex-col lg:justify-center"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[0] bg-[radial-gradient(ellipse_55%_48%_at_100%_0%,color-mix(in_oklab,var(--color-acg-blue)_9%,transparent)_0%,transparent_62%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: grainPatternUrl,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[10%] top-[6%] h-[min(580px,60vw)] w-[min(580px,60vw)] rounded-full bg-acg-blue/10 blur-[80px] will-change-transform md:animate-[hero-blob-1_26s_ease-in-out_infinite] lg:left-[50%]" />
        <div className="absolute left-[32%] top-[16%] h-[min(520px,55vw)] w-[min(520px,55vw)] rounded-full bg-acg-blue/[0.07] blur-[80px] will-change-transform md:animate-[hero-blob-2_26s_ease-in-out_4s_infinite] lg:left-[58%] lg:top-[12%]" />
        <div className="absolute bottom-[18%] right-[-6%] h-[min(420px,48vw)] w-[min(420px,48vw)] rounded-full bg-acg-red/[0.08] blur-[80px] will-change-transform md:animate-[hero-blob-3_26s_ease-in-out_8s_infinite]" />
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 pb-6 pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 sm:pb-10 sm:pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+1rem)] lg:px-6 lg:pb-10 lg:pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+2rem)] xl:gap-12 lg:flex lg:flex-col lg:justify-center lg:h-full lg:flex-1">
        <h1 id="hero-heading" className="sr-only">
          {heading}
        </h1>

        <div className="relative isolate grid min-h-0 grid-cols-1 gap-8 max-md:flex max-md:min-h-0 max-md:flex-col max-md:gap-6 md:gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-x-10 lg:gap-y-0 xl:gap-x-12 lg:flex-1 lg:min-h-0">

          {/* Ліва колонка — текст, навігація та CTA. */}
          <div className="relative z-20 col-span-1 flex w-full min-w-0 max-w-none flex-col justify-center px-0 pb-6 max-md:mx-auto max-md:max-w-lg max-md:items-center max-md:text-center max-md:pb-4 lg:col-span-7 lg:mx-0 lg:max-w-none lg:items-start lg:py-4 lg:pl-2 lg:pr-2 lg:text-left xl:pl-4 xl:pr-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentMotion}
              className="flex max-w-4xl flex-col gap-3 pt-0 max-md:mx-auto max-md:items-center max-md:text-center sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6"
            >
              {accentSecondary ? (
                <>
                  <motion.p
                    aria-hidden
                    className={`max-w-5xl ${headlineAccentClass}`}
                    variants={itemMotion}
                  >
                    {accentPrimary} —
                  </motion.p>
                  <motion.p
                    aria-hidden
                    className={`max-w-5xl ${headlineAccentClass}`}
                    variants={itemMotion}
                  >
                    {accentSecondary}
                  </motion.p>
                </>
              ) : (
                <motion.p
                  aria-hidden
                  className={`max-w-5xl ${headlineAccentClass}`}
                  variants={itemMotion}
                >
                  {accentPrimary}
                </motion.p>
              )}
              {supporting ? (
                <motion.p
                  aria-hidden
                  className={headlineSupportingClass}
                  variants={itemMotion}
                >
                  {supporting}
                </motion.p>
              ) : null}
            </motion.div>

            <motion.div
              className="mt-4 flex w-full flex-col gap-3 max-md:mx-auto max-md:items-center max-md:text-center sm:gap-4 lg:mt-8 xl:mt-10 lg:gap-5 xl:gap-6"
              initial="hidden"
              animate="visible"
              variants={contentMotion}
            >
              {subheading.trim() ? (
                <motion.p
                  className="text-sm font-medium leading-snug text-foreground/72 sm:text-base max-md:mx-auto max-md:max-w-xl lg:max-w-none"
                  variants={itemMotion}
                >
                  {subheading}
                </motion.p>
              ) : null}
              <motion.div
                className="flex w-full flex-col gap-2.5 rounded-2xl border border-foreground/[0.06] bg-white/[0.45] p-3 shadow-sm shadow-acg-blue/[0.04] ring-1 ring-white/60 backdrop-blur-[6px] sm:gap-3 sm:p-4 lg:p-4"
                variants={itemMotion}
              >
                <motion.div
                  className="flex flex-wrap gap-2.5 sm:gap-3"
                  variants={contentMotion}
                >
                  {heroNavCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.a
                        key={`${card.href}-${card.title}`}
                        href={card.href}
                        onClick={(event) =>
                          handleNavAnchorClick(event, card.href, card.pricingPreset)
                        }
                        variants={itemMotion}
                        className={`${ctaShineClass} group flex flex-grow w-full sm:w-[calc(50%-6px)] xl:w-[calc(25%-9px)] min-h-[3.25rem] flex-row items-center gap-2.5 rounded-xl border border-acg-blue/15 bg-white/70 px-3.5 py-3 text-left shadow-sm ring-1 ring-white/40 backdrop-blur-[2px] transition hover:border-acg-blue/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/30 sm:min-h-[4.5rem] sm:flex-col sm:items-start sm:justify-center sm:gap-2 sm:px-3 sm:py-3.5`}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-acg-blue/10 text-acg-blue transition group-hover:bg-acg-blue/15 sm:size-10 sm:rounded-xl">
                          <Icon className="size-[1.15rem] sm:size-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold tracking-tight text-foreground sm:text-[0.9375rem]">
                            {card.title}
                          </span>
                          <span className="mt-0.5 block text-[0.7rem] leading-snug text-foreground/55 sm:text-xs">
                            {card.subtitle}
                          </span>
                        </span>
                      </motion.a>
                    );
                  })}
                </motion.div>
              </motion.div>
              <motion.div
                className="flex w-full flex-col gap-2.5 md:flex-row md:flex-wrap md:items-stretch md:gap-3"
                variants={itemMotion}
              >
                {ctaButtons.map((btn: any, idx: number) => (
                  <HeroConsultationCta
                    key={`hero-btn-${idx}`}
                    variant={btn.buttonStyle === "secondary" ? "paid" : "free"}
                    title={btn.title || ""}
                    hint={btn.subtitle || ""}
                    price={btn.price || undefined}
                    onClick={() =>
                      openConsultationModal(
                        (btn.actionType as "free_consultation" | "paid_consultation") ||
                          "free_consultation"
                      )
                    }
                  />
                ))}
              </motion.div>

              {/* Мобільне фото команди — квадратне, без апскейлу вище нативної роздільності. */}
              <motion.div
                className="relative mx-auto mt-2 w-full max-w-[min(100%,20rem)] md:hidden"
                variants={itemMotion}
              >
                <div className={`${heroPhotoFrameClass} aspect-square`}>
                  <Image
                    src={teamPhoto}
                    alt={heroImageAlt}
                    width={teamPhoto.width}
                    height={teamPhoto.height}
                    priority
                    sizes="(max-width: 767px) 80vw, 0px"
                    className={heroPhotoImageClass}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Права колонка: квадратне фото команди, вирівняне по центру. */}
          <div className="relative z-10 hidden min-h-0 md:flex md:col-span-5 md:items-center md:justify-center lg:col-span-5">
            <motion.div
              className={heroPhotoCardClass}
              initial={isMdUp ? { opacity: 0, y: 32 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: isMdUp ? 1 : 0.45,
                ease: [0.16, 1, 0.3, 1],
                delay: isMdUp ? 0.25 : 0.08,
              }}
            >
              <div className={heroPhotoFrameClass}>
                <Image
                  src={teamPhoto}
                  alt={heroImageAlt}
                  width={teamPhoto.width}
                  height={teamPhoto.height}
                  priority
                  sizes="(min-width: 1280px) 576px, (min-width: 1024px) 42vw, (min-width: 768px) 45vw, 100vw"
                  className={heroPhotoImageClass}
                />
              </div>

              {heroStatBadges.map((badge) => (
                <HeroStatBadge
                  key={badge.id}
                  badge={badge}
                  springX={springX}
                  springY={springY}
                  reduceMotion={reduceMotion}
                  isMdUp={isMdUp}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <ConsultationModal
        key={consultModalKey}
        open={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </section>
  );
}
