"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Building2, Shield, TrendingUp, UserPlus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useLenis } from "@/src/components/SmoothScrolling";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { externalLinkProps } from "@/src/lib/externalLink";
import { dispatchPricingTierPreset } from "@/src/lib/pricingTierNavigation";
import { scrollToSectionById } from "@/src/lib/scrollToAnchor";

import { prepareConsultationGeneral } from "@/src/lib/leadIntent";

import { ACG_TELEGRAM_LEADS_URL } from "@/src/lib/telegram";

import ConsultationModal from "./ConsultationModal";

export type HeroCardContent = {
  title: string;
  subtitle: string;
};

export interface HeroProps {
  heading?: string;
  subheading?: string;
  heroCards?: HeroCardContent[];
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  backgroundImageUrl?: string;
}

const FALLBACK_HERO_IMAGE = "/images/hero-man.png";

function TelegramMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  );
}

const PRIMARY_CTA_LABEL_FALLBACK =
  "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";

const SECONDARY_CTA_LABEL_FALLBACK = "ШВИДКА ВІДПОВІДЬ У TELEGRAM";

const FALLBACK_HERO_CARDS: HeroCardContent[] = [
  { title: "Реєстрація ФОП", subtitle: "Тарифи та вартість" },
  { title: "Бухгалтерія ТОВ", subtitle: "Напрями послуг" },
];

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

/** Легкий варіант для < md: лише короткий fade + невеликий slide. */
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

const figureImageShadowClass =
  "[filter:drop-shadow(0_22px_44px_rgba(0,0,0,0.09))]";

const headlineAccentClass =
  "bg-gradient-to-b from-acg-blue via-acg-blue to-acg-blue/85 bg-clip-text font-black uppercase leading-[1.06] tracking-tight text-transparent [background-clip:text] [-webkit-background-clip:text] text-[clamp(1.375rem,5.2vw,1.75rem)] sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-6xl xl:text-7xl";

const headlineSupportingClass =
  "mt-3 max-w-3xl font-light leading-relaxed tracking-normal text-foreground/80 normal-case text-sm sm:mt-6 sm:text-base md:text-lg lg:mt-7 lg:text-xl";

const grainPatternUrl =
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  ) +
  '")';

const ctaShineClass =
  "relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:content-[''] md:after:animate-[hero-cta-shine_6.5s_ease-in-out_infinite] motion-reduce:after:animate-none";

interface FloatingBadge {
  id: number;
  type: "text" | "icon";
  content: ReactNode;
  positionClass: string;
  animationDelay: number;
  parallaxMul: number;
  /** Лише десктоп (md+): приховати на вузьких екранах, щоб не перекривати фото. */
  desktopOnly?: boolean;
}

/** Координати лише всередині колонки з фото (`relative` на фігурі). Без негативних left — щоб не заходити в текстову зону. */
const floatingBadges: FloatingBadge[] = [
  {
    id: 1,
    type: "text",
    content: (
      <div className="relative z-10">
        <p className="text-xs font-semibold tracking-tight text-acg-blue md:text-sm lg:text-base">
          Досвід 10+
        </p>
        <p className="mt-0.5 text-[0.65rem] text-foreground/65 md:text-xs lg:text-sm">
          років у сфері
        </p>
      </div>
    ),
    positionClass:
      "origin-top-left top-[4%] left-[3%] max-w-[calc(100%-1rem)] sm:top-[6%] sm:left-[5%] md:top-[8%] md:left-[6%]",
    animationDelay: 0,
    parallaxMul: 12,
  },
  {
    id: 2,
    type: "icon",
    content: (
      <Shield
        className="relative z-10 h-6 w-6 text-acg-blue md:h-7 md:w-7 lg:h-8 lg:w-8"
        strokeWidth={1.75}
        aria-hidden
      />
    ),
    positionClass:
      "origin-center top-[38%] right-[4%] -translate-y-1/2 sm:right-[6%] md:top-[40%] md:right-[8%]",
    animationDelay: 1.2,
    parallaxMul: 16,
    desktopOnly: true,
  },
  {
    id: 3,
    type: "text",
    content: (
      <div className="relative z-10 flex max-w-[10.5rem] items-center gap-1.5 md:max-w-none md:gap-2">
        <TrendingUp
          className="h-4 w-4 shrink-0 text-acg-blue md:h-5 md:w-5"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-[0.7rem] font-semibold leading-tight tracking-tight text-acg-blue md:text-sm lg:text-base">
          100% звітність
        </p>
      </div>
    ),
    positionClass:
      "origin-bottom-right bottom-[8%] right-[4%] left-auto max-w-[min(100%,11rem)] sm:bottom-[10%] sm:right-[6%] md:bottom-[12%] md:right-[8%]",
    animationDelay: 2.4,
    parallaxMul: 14,
  },
];

function HeroFloatingBadge({
  badge,
  springX,
  springY,
  reduceMotion,
  isMdUp,
}: {
  badge: FloatingBadge;
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
      className={`pointer-events-none absolute z-10 flex w-max ${badge.desktopOnly ? "hidden md:flex" : ""} ${badge.positionClass}`}
      initial={
        allowHeavy
          ? { opacity: 0, scale: 0.85, y: 24 }
          : { opacity: 0, y: 10 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: allowHeavy ? 0.7 : 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: allowHeavy ? 0.6 + badge.animationDelay : 0.15 + badge.animationDelay * 0.05,
      }}
    >
      <motion.div
        animate={allowHeavy ? { y: [0, -10, 0] } : undefined}
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
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/35 bg-white/[0.22] shadow-lg shadow-acg-blue/[0.06] backdrop-blur-[6px] will-change-transform md:border-white/25 md:bg-white/[0.14] md:backdrop-blur-[8px] md:shadow-2xl ${
              badge.type === "icon"
                ? "flex h-11 w-11 items-center justify-center md:h-14 md:w-14 lg:h-16 lg:w-16"
                : "px-3 py-2 md:px-5 md:py-3.5"
            }`}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.18] via-white/[0.06] to-transparent opacity-80"
              aria-hidden
            />
            {badge.content}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroClient({
  heading = "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.",
  subheading = "",
  heroCards,
  primaryCtaLabel = PRIMARY_CTA_LABEL_FALLBACK,
  secondaryCtaLabel = SECONDARY_CTA_LABEL_FALLBACK,
  backgroundImageUrl,
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

  const resolvedFigureSrc = backgroundImageUrl ?? FALLBACK_HERO_IMAGE;
  const heroImageAlt = heading.trim() || "ACG";

  const reduceMotion = Boolean(reduceMotionPreferred);
  const contentMotion = isMdUp ? contentVariants : contentVariantsMobile;
  const itemMotion = isMdUp ? itemVariants : itemVariantsMobile;

  const telegramHref = ACG_TELEGRAM_LEADS_URL;

  const goToFopPricing = useCallback(() => {
    dispatchPricingTierPreset("fop-registration");
    requestAnimationFrame(() => {
      scrollToSectionById("pricing", lenis);
    });
  }, [lenis]);

  const goToTovServices = useCallback(() => {
    requestAnimationFrame(() => {
      scrollToSectionById("services", lenis);
    });
  }, [lenis]);

  const goToPricingSection = useCallback(() => {
    requestAnimationFrame(() => {
      scrollToSectionById("pricing", lenis);
    });
  }, [lenis]);

  const resolvedHeroCards =
    heroCards && heroCards.length > 0 ? heroCards : FALLBACK_HERO_CARDS;

  const onHeroCardClick = useCallback(
    (index: number) => {
      if (index === 0) goToFopPricing();
      else if (index === 1) goToTovServices();
      else goToPricingSection();
    },
    [goToFopPricing, goToTovServices, goToPricingSection],
  );

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-foreground/10 bg-acg-light text-foreground"
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

      <div className="relative z-[2] mx-auto max-w-7xl px-4 pb-6 pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 sm:pb-10 sm:pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+1rem)] lg:px-6 lg:pb-0 lg:pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+1.25rem)] xl:pt-[calc(var(--header-offset)+env(safe-area-inset-top,0px)+1.5rem)]">
        <h1 id="hero-heading" className="sr-only">
          {heading}
        </h1>

        <div className="relative isolate grid min-h-0 grid-cols-1 gap-6 max-md:flex max-md:min-h-0 max-md:flex-col max-md:gap-4 md:gap-10 lg:min-h-[min(680px,calc(100svh-var(--header-offset)-1.25rem))] lg:grid-cols-12 lg:items-stretch lg:gap-6 lg:gap-y-0 lg:py-0 xl:gap-8">

          {/* Текстова колонка — завжди вище фонового шару фото; відступ зверху лише в зовнішньому контейнері (хедер). */}
          <div className="relative z-20 col-span-1 flex w-full min-w-0 max-w-none flex-col justify-start px-0 pb-6 max-md:mx-auto max-md:max-w-lg max-md:items-center max-md:text-center max-md:pb-4 md:justify-center md:pb-10 lg:col-span-7 lg:mx-0 lg:max-w-none lg:items-start lg:justify-start lg:pb-14 lg:pl-2 lg:pr-4 lg:text-left xl:pb-16 xl:pl-4 xl:pr-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentMotion}
              className="flex max-w-4xl flex-col gap-3 pt-0 max-md:mx-auto max-md:items-center max-md:text-center sm:gap-4 md:gap-5"
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
              className="mt-4 flex w-full max-w-xl flex-col gap-3 max-md:mx-auto max-md:items-center max-md:text-center sm:gap-3.5 lg:mt-7 lg:max-w-xl xl:max-w-[26rem]"
              initial="hidden"
              animate="visible"
              variants={contentMotion}
            >
              {subheading.trim() ? (
                <motion.p
                  className="text-sm font-medium leading-snug text-foreground/72 sm:text-base max-md:mx-auto max-md:max-w-xl"
                  variants={itemMotion}
                >
                  {subheading}
                </motion.p>
              ) : null}
              <motion.div
                className="flex w-full flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-white/[0.45] p-3 shadow-sm shadow-acg-blue/[0.04] ring-1 ring-white/60 backdrop-blur-[6px] max-md:max-w-md sm:p-3.5"
                variants={itemMotion}
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
                  {resolvedHeroCards.map((card, index) => {
                    const Icon = index % 2 === 0 ? UserPlus : Building2;
                    return (
                      <button
                        key={`${card.title}-${index}`}
                        type="button"
                        onClick={() => onHeroCardClick(index)}
                        className={`${ctaShineClass} group flex min-h-[3rem] flex-row items-center gap-2.5 rounded-xl border border-acg-blue/15 bg-white/70 px-3 py-2.5 text-left shadow-sm ring-1 ring-white/40 backdrop-blur-[2px] transition hover:border-acg-blue/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/30 sm:min-h-0 sm:flex-col sm:items-start sm:gap-2 sm:py-3`}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-acg-blue/10 text-acg-blue transition group-hover:bg-acg-blue/15 sm:size-10 sm:rounded-xl">
                          <Icon className="size-[1.15rem] sm:size-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold tracking-tight text-foreground">
                            {card.title}
                          </span>
                          <span className="mt-0.5 block text-[0.7rem] leading-snug text-foreground/55 sm:text-xs">
                            {card.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    prepareConsultationGeneral();
                    setConsultModalKey((k) => k + 1);
                    setConsultModalOpen(true);
                  }}
                  className={`${ctaShineClass} mt-0.5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-acg-red px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-acg-red/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80`}
                >
                  <span className="relative z-20">{primaryCtaLabel}</span>
                </button>
                <a
                  href={telegramHref}
                  {...externalLinkProps(telegramHref)}
                  className={`${ctaShineClass} group/telegram inline-flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-xl border border-acg-blue/15 bg-white/60 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-wide text-acg-blue shadow-sm ring-1 ring-acg-blue/10 transition hover:border-acg-blue/35 hover:bg-acg-blue/[0.06] hover:ring-acg-blue/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 sm:text-xs`}
                >
                  <TelegramMarkIcon className="size-5 shrink-0 text-[#229ED9] transition group-hover/telegram:scale-105" />
                  <span className="text-balance transition group-hover/telegram:text-acg-blue">
                    {secondaryCtaLabel}
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Фігура: заповнює висоту клітини сітки; низ до низу секції; object-cover + object-bottom для масштабу й візуальної ваги поруч із заголовком. */}
          <div className="relative z-10 col-span-1 hidden min-h-0 overflow-x-clip overflow-y-visible md:col-span-5 md:flex md:h-full md:min-h-[min(36rem,62svh)] md:flex-col md:items-stretch md:justify-end md:self-stretch md:pb-0 md:pl-0 lg:-ml-10 lg:min-h-0 xl:-ml-14">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[12%] bg-[radial-gradient(ellipse_80%_55%_at_50%_78%,color-mix(in_oklab,var(--color-acg-blue)_14%,transparent)_0%,transparent_68%)]"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-[1] hidden h-[16%] w-[min(96%,480px)] max-w-[480px] -translate-x-1/2 rounded-[100%] bg-foreground/12 blur-[48px] lg:block"
              aria-hidden
            />

            <div className="relative min-h-0 w-full flex-1 lg:min-h-0">
              <div className="relative h-full min-h-[min(24rem,55svh)] w-full md:absolute md:inset-0 md:min-h-0">
                <div className="relative h-full min-h-0 w-full overflow-visible">
                  <div className="pointer-events-none absolute inset-0 z-0 flex min-h-0 flex-col justify-end">
                    <motion.div
                      className={`relative z-[5] h-full min-h-[min(24rem,50svh)] w-full origin-bottom md:min-h-full ${figureImageShadowClass}`}
                      initial={
                        isMdUp ? { opacity: 0, y: 80 } : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: isMdUp ? 1.2 : 0.45,
                        ease: [0.16, 1, 0.3, 1],
                        delay: isMdUp ? 0.3 : 0.08,
                      }}
                    >
                      <Image
                        src={resolvedFigureSrc}
                        alt={heroImageAlt}
                        fill
                        priority
                        sizes="(min-width: 1536px) 48vw, (min-width: 1280px) 46vw, (min-width: 1024px) 44vw, (min-width: 768px) 46vw, 100vw"
                        className="pointer-events-auto rounded-t-2xl object-cover object-bottom"
                      />
                    </motion.div>
                  </div>

                  <div className="relative z-[6] mx-auto h-full w-full min-h-0">
                    {floatingBadges.map((badge) => (
                      <HeroFloatingBadge
                        key={badge.id}
                        badge={badge}
                        springX={springX}
                        springY={springY}
                        reduceMotion={reduceMotion}
                        isMdUp={isMdUp}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
