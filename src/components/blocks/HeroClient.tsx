"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Shield, TrendingUp } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { externalLinkProps } from "@/src/lib/externalLink";

export interface HeroProps {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  /** URL кнопки Telegram; після resolve має бути реальний URL або `#`. */
  secondaryCtaHref?: string;
  /** Сирий URL з Sanity (опційно; для передачі в `resolveHeroProps`). */
  telegramLink?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
}

const FALLBACK_HERO_IMAGE = "/images/hero-man.png";
const FALLBACK_HERO_IMAGE_ALT = "Експерт бухгалтерського супроводу";

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

const figureScaleClass = "lg:scale-[1.32] xl:scale-[1.72]";

const headlineAccentClass =
  "bg-gradient-to-b from-acg-blue via-acg-blue to-acg-blue/85 bg-clip-text font-black uppercase leading-[1.08] tracking-tight text-transparent [background-clip:text] [-webkit-background-clip:text] text-5xl sm:text-6xl lg:text-6xl xl:text-7xl";

const headlineSupportingClass =
  "max-w-3xl font-light leading-relaxed tracking-normal text-foreground/80 normal-case text-base sm:text-lg lg:text-xl";

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
      "origin-top-left top-[3%] left-[1%] max-w-[calc(100%-0.5rem)] md:top-20 md:left-auto md:max-w-none md:-left-6 lg:top-[30%] lg:-left-8 xl:top-[28%] xl:-left-10",
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
      "origin-center top-1/2 right-0 -translate-y-[42%] translate-x-2 md:-translate-y-[40%] md:translate-x-3 md:-right-2 lg:top-1/2 lg:-right-5 lg:translate-x-1 lg:-translate-y-[38%]",
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
      "origin-bottom-right bottom-[5%] right-[2%] left-auto z-[7] max-w-[min(100%,11rem)] translate-x-0 md:bottom-28 md:left-auto md:right-auto md:max-w-none md:-left-12 lg:-left-14 lg:bottom-[7.5rem] xl:-left-16",
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
      className={`pointer-events-none absolute z-[6] flex w-max ${badge.desktopOnly ? "hidden md:flex" : ""} ${badge.positionClass}`}
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
  primaryCtaLabel = "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО",
  secondaryCtaLabel = "ШВИДКА ВІДПОВІДЬ У TELEGRAM",
  primaryCtaHref = "#contact",
  secondaryCtaHref = "#",
  backgroundImageUrl,
  backgroundImageAlt,
}: HeroProps) {
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
  const resolvedFigureAlt =
    backgroundImageAlt ?? FALLBACK_HERO_IMAGE_ALT;

  const reduceMotion = Boolean(reduceMotionPreferred);
  const contentMotion = isMdUp ? contentVariants : contentVariantsMobile;
  const itemMotion = isMdUp ? itemVariants : itemVariantsMobile;

  const secondaryHref = secondaryCtaHref || "#";

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

      <div className="relative z-[2] mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">
        <h1 id="hero-heading" className="sr-only">
          {heading}
        </h1>

        <div className="relative grid min-h-0 grid-cols-1 gap-0 max-md:flex max-md:min-h-[min(100svh,100dvh)] max-md:flex-col lg:grid lg:min-h-[90vh] lg:grid-cols-12 lg:h-screen lg:items-stretch">

          {/* Вище z колонки з фото (z-20): інакше через lg:-ml-20 зображення перекриває кнопки й блокує кліки */}
          <div className="relative z-30 col-span-1 flex w-full max-w-none flex-col justify-center px-0 max-md:min-h-0 max-md:flex-1 max-md:items-center max-md:justify-center max-md:text-center max-md:px-4 max-md:pb-16 max-md:pt-[max(5.5rem,calc(1.5rem+env(safe-area-inset-top,0px)+4.25rem))] lg:col-span-7 lg:min-h-0 lg:max-w-none lg:items-start lg:justify-center lg:px-0 lg:pl-16 lg:pb-0 lg:pt-0 lg:text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentMotion}
              className="flex max-w-4xl flex-col gap-2 pt-1 max-md:mx-auto max-md:items-center max-md:text-center"
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
                  className={`mt-3 ${headlineSupportingClass}`}
                  variants={itemMotion}
                >
                  {supporting}
                </motion.p>
              ) : null}
            </motion.div>

            <motion.div
              className="mt-8 flex max-w-xl flex-col gap-6 max-md:mx-auto max-md:items-center max-md:text-center"
              initial="hidden"
              animate="visible"
              variants={contentMotion}
            >
              {subheading.trim() ? (
                <motion.p
                  className="text-base font-medium leading-relaxed text-foreground/72 sm:text-lg max-md:mx-auto max-md:max-w-xl"
                  variants={itemMotion}
                >
                  {subheading}
                </motion.p>
              ) : null}
              <motion.div
                className="flex flex-col gap-3 max-md:mx-auto max-md:w-full max-md:max-w-md max-md:items-stretch sm:flex-row sm:items-center"
                variants={itemMotion}
              >
                <a
                  href={primaryCtaHref}
                  {...externalLinkProps(primaryCtaHref)}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full bg-acg-red px-6 py-3 text-sm font-medium text-white ring-1 ring-white/20 transition-colors duration-300 hover:bg-acg-red/92`}
                >
                  <span className="relative z-20">{primaryCtaLabel}</span>
                </a>
                <a
                  href={secondaryHref}
                  {...externalLinkProps(secondaryHref)}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full border border-acg-blue bg-white/25 px-6 py-3 text-sm font-medium text-acg-blue backdrop-blur-[2px] ring-1 ring-white/40 transition-colors duration-300 hover:bg-acg-blue/10`}
                >
                  <span className="relative z-20">{secondaryCtaLabel}</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

            {/* Фото + бейджі: лише md+ (hidden на мобільних). */}
            <div
              className="relative z-20 col-span-1 hidden min-h-0 md:pointer-events-none md:flex md:flex-col md:items-stretch md:justify-end md:overflow-visible lg:col-span-5 lg:-ml-20 lg:pb-0 lg:pt-0"
            >
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(ellipse_80%_55%_at_50%_78%,color-mix(in_oklab,var(--color-acg-blue)_14%,transparent)_0%,transparent_68%)] max-md:hidden"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-[1] hidden h-[14%] w-[min(92%,480px)] -translate-x-1/2 rounded-[100%] bg-foreground/18 blur-[48px] lg:block"
              aria-hidden
            />

            {/* Мобільний: фото + бейджі в одному relative — бейджі «сидять» на фігурі. md+: `contents` — бейджі знову відносно високої колонки, як у десктопному макеті. */}
            <div className="relative mx-auto w-full max-w-[min(100%,400px)] pb-1 md:contents">
            <motion.div
              className={`relative z-[5] w-full max-md:mx-auto max-md:min-h-0 max-md:overflow-visible max-md:rounded-2xl md:mt-auto lg:flex lg:max-h-[min(88vh,52rem)] lg:min-h-0 lg:w-full lg:max-w-none lg:items-end lg:justify-center origin-bottom ${figureScaleClass} [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.12))]`}
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
                alt={resolvedFigureAlt}
                width={800}
                height={1000}
                priority
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 50vw, (min-width: 768px) 90vw, 100vw"
                className="h-auto w-full max-md:origin-bottom max-md:scale-[1.14] max-md:object-contain max-md:object-bottom md:scale-100 lg:block lg:max-h-[min(88vh,52rem)] lg:w-full lg:object-contain lg:object-bottom"
              />
            </motion.div>

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
    </section>
  );
}
