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

export interface HeroProps {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
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

function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [x, y]);

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

const DEFAULT_SECONDARY_CTA_HREF =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim()) ||
  "#contact";

const ctaShineClass =
  "relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:animate-[hero-cta-shine_6.5s_ease-in-out_infinite] after:content-[''] motion-reduce:after:animate-none";

interface FloatingBadge {
  id: number;
  type: "text" | "icon";
  content: ReactNode;
  positionClass: string;
  animationDelay: number;
  parallaxMul: number;
}

const floatingBadges: FloatingBadge[] = [
  {
    id: 1,
    type: "text",
    content: (
      <div className="relative z-10">
        <p className="text-sm font-semibold tracking-tight text-acg-blue sm:text-base">
          Досвід 10+
        </p>
        <p className="mt-0.5 text-xs text-foreground/65 sm:text-sm">
          років у сфері
        </p>
      </div>
    ),
    positionClass:
      "top-16 -left-2 sm:top-20 sm:-left-6 lg:top-[30%] lg:-left-8 xl:top-[28%] xl:-left-10",
    animationDelay: 0,
    parallaxMul: 12,
  },
  {
    id: 2,
    type: "icon",
    content: (
      <Shield
        className="relative z-10 h-7 w-7 text-acg-blue sm:h-8 sm:w-8"
        strokeWidth={1.75}
        aria-hidden
      />
    ),
    positionClass:
      "top-1/2 right-0 -translate-y-[42%] translate-x-2 sm:-translate-y-[40%] sm:translate-x-3 md:-right-2 md:translate-x-4 lg:top-1/2 lg:-right-5 lg:translate-x-1 lg:-translate-y-[38%]",
    animationDelay: 1.2,
    parallaxMul: 16,
  },
  {
    id: 3,
    type: "text",
    content: (
      <div className="relative z-10 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-acg-blue" strokeWidth={2} aria-hidden />
        <p className="text-sm font-semibold tracking-tight text-acg-blue sm:text-base">
          100% звітність
        </p>
      </div>
    ),
    positionClass:
      "bottom-20 left-1/2 z-[7] -translate-x-1/2 sm:bottom-24 sm:left-auto sm:translate-x-0 sm:-left-8 md:bottom-28 md:-left-12 lg:-left-14 lg:bottom-[7.5rem] xl:-left-16",
    animationDelay: 2.4,
    parallaxMul: 14,
  },
];

function HeroFloatingBadge({
  badge,
  springX,
  springY,
  reduceMotion,
}: {
  badge: FloatingBadge;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const tx = useTransform(springX, (v) => v * badge.parallaxMul);
  const ty = useTransform(springY, (v) => v * (badge.parallaxMul * 0.75));

  const floatDuration = 5 + badge.animationDelay * 0.15;

  return (
    <motion.div
      className={`pointer-events-none absolute z-[6] flex w-max ${badge.positionClass}`}
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.6 + badge.animationDelay,
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: floatDuration,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }
        }
      >
        <motion.div style={{ x: tx, y: ty }}>
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/35 bg-white/[0.22] shadow-lg shadow-acg-blue/[0.06] backdrop-blur-[6px] will-change-transform md:border-white/25 md:bg-white/[0.14] md:backdrop-blur-[8px] md:shadow-2xl ${
              badge.type === "icon"
                ? "flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16"
                : "px-4 py-3 sm:px-5 sm:py-3.5"
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

export default function Hero({
  heading = "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.",
  subheading = "",
  primaryCtaLabel = "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО",
  secondaryCtaLabel = "ШВИДКА ВІДПОВІДЬ У TELEGRAM",
  primaryCtaHref = "#contact",
  secondaryCtaHref = DEFAULT_SECONDARY_CTA_HREF,
  backgroundImageUrl,
  backgroundImageAlt,
}: HeroProps) {
  const reduceMotionPreferred = useReducedMotion();
  const { accentPrimary, accentSecondary, supporting } = useMemo(
    () => splitHeroHeading(heading),
    [heading],
  );

  const { x: mouseX, y: mouseY } = useMousePosition();
  const springX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 22 });

  const resolvedFigureSrc = backgroundImageUrl ?? FALLBACK_HERO_IMAGE;
  const resolvedFigureAlt =
    backgroundImageAlt ?? FALLBACK_HERO_IMAGE_ALT;

  const reduceMotion = Boolean(reduceMotionPreferred);

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
        <div className="absolute -left-[10%] top-[6%] h-[min(580px,60vw)] w-[min(580px,60vw)] rounded-full bg-acg-blue/10 blur-[80px] will-change-transform animate-[hero-blob-1_26s_ease-in-out_infinite] lg:left-[50%]" />
        <div className="absolute left-[32%] top-[16%] h-[min(520px,55vw)] w-[min(520px,55vw)] rounded-full bg-acg-blue/[0.07] blur-[80px] will-change-transform animate-[hero-blob-2_26s_ease-in-out_4s_infinite] lg:left-[58%] lg:top-[12%]" />
        <div className="absolute bottom-[18%] right-[-6%] h-[min(420px,48vw)] w-[min(420px,48vw)] rounded-full bg-acg-red/[0.08] blur-[80px] will-change-transform animate-[hero-blob-3_26s_ease-in-out_8s_infinite]" />
      </div>

      <div className="relative z-[2] mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">
        <h1 id="hero-heading" className="sr-only">
          {heading}
        </h1>

        <div className="relative grid min-h-0 grid-cols-1 gap-0 max-md:flex max-md:min-h-[90vh] max-md:flex-col lg:grid lg:min-h-[90vh] lg:grid-cols-12 lg:h-screen lg:items-stretch">

          <div className="relative z-10 col-span-1 flex max-w-none flex-col justify-center px-0 max-md:order-1 max-md:pb-6 max-md:pt-[max(5.5rem,calc(1.5rem+env(safe-area-inset-top,0px)+4.25rem))] lg:col-span-7 lg:max-w-none lg:px-0 lg:pl-16 lg:py-0 lg:pt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="flex max-w-4xl flex-col gap-2 pt-1"
            >
              {accentSecondary ? (
                <>
                  <motion.p
                    aria-hidden
                    className={`max-w-5xl ${headlineAccentClass}`}
                    variants={itemVariants}
                  >
                    {accentPrimary} —
                  </motion.p>
                  <motion.p
                    aria-hidden
                    className={`max-w-5xl ${headlineAccentClass}`}
                    variants={itemVariants}
                  >
                    {accentSecondary}
                  </motion.p>
                </>
              ) : (
                <motion.p
                  aria-hidden
                  className={`max-w-5xl ${headlineAccentClass}`}
                  variants={itemVariants}
                >
                  {accentPrimary}
                </motion.p>
              )}
              {supporting ? (
                <motion.p
                  aria-hidden
                  className={`mt-3 ${headlineSupportingClass}`}
                  variants={itemVariants}
                >
                  {supporting}
                </motion.p>
              ) : null}
            </motion.div>

            <motion.div
              className="mt-8 flex max-w-xl flex-col gap-6"
              initial="hidden"
              animate="visible"
              variants={contentVariants}
            >
              {subheading.trim() ? (
                <motion.p
                  className="text-base font-medium leading-relaxed text-foreground/72 sm:text-lg"
                  variants={itemVariants}
                >
                  {subheading}
                </motion.p>
              ) : null}
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                variants={itemVariants}
              >
                <a
                  href={primaryCtaHref}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full bg-acg-red px-6 py-3 text-sm font-medium text-white ring-1 ring-white/20 transition-colors duration-300 hover:bg-acg-red/92`}
                >
                  <span className="relative z-20">{primaryCtaLabel}</span>
                </a>
                <a
                  href={secondaryCtaHref}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full border border-acg-blue bg-white/25 px-6 py-3 text-sm font-medium text-acg-blue backdrop-blur-[2px] ring-1 ring-white/40 transition-colors duration-300 hover:bg-acg-blue/10`}
                >
                  <span className="relative z-20">{secondaryCtaLabel}</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div
            className="relative col-span-1 z-20 flex max-md:order-2 max-md:mt-auto max-md:w-full max-md:flex-col max-md:items-center max-md:justify-end max-md:pb-0 max-md:pt-2 lg:col-span-5 lg:-ml-20 lg:min-h-0 lg:flex-col lg:items-stretch lg:justify-end lg:overflow-visible lg:pb-0"
          >
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(ellipse_80%_55%_at_50%_78%,color-mix(in_oklab,var(--color-acg-blue)_14%,transparent)_0%,transparent_68%)] max-md:hidden"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-[1] hidden h-[14%] w-[min(92%,480px)] -translate-x-1/2 rounded-[100%] bg-foreground/18 blur-[48px] lg:block"
              aria-hidden
            />

            <motion.div
              className={`relative z-[5] mt-auto w-full max-w-full max-md:max-h-[min(52vh,420px)] max-md:w-full max-md:overflow-visible max-md:rounded-2xl lg:flex lg:max-h-[min(88vh,52rem)] lg:min-h-0 lg:w-full lg:max-w-none lg:items-end lg:justify-center origin-bottom ${figureScaleClass} [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.12))]`}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              <Image
                src={resolvedFigureSrc}
                alt={resolvedFigureAlt}
                width={800}
                height={1000}
                priority
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 50vw, (min-width: 768px) 90vw, 100vw"
                className="h-auto w-full max-md:max-h-[min(52vh,420px)] max-md:object-contain max-md:object-bottom lg:block lg:max-h-[min(88vh,52rem)] lg:w-full lg:object-contain lg:object-bottom"
              />
            </motion.div>

            {floatingBadges.map((badge) => (
              <HeroFloatingBadge
                key={badge.id}
                badge={badge}
                springX={springX}
                springY={springY}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
