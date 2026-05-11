"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useMemo } from "react";

export interface HeroProps {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
}

function splitHeading(heading: string): { line1: string; line2: string | null } {
  const emDash = heading.indexOf("—");
  if (emDash !== -1) {
    return {
      line1: heading.slice(0, emDash).trim(),
      line2: heading.slice(emDash + 1).trim(),
    };
  }
  const hyphenDash = heading.match(/\s+[–-]\s+/);
  if (hyphenDash && hyphenDash.index !== undefined) {
    const idx = hyphenDash.index;
    return {
      line1: heading.slice(0, idx).trim(),
      line2: heading.slice(idx + hyphenDash[0].length).trim(),
    };
  }
  return { line1: heading, line2: null };
}

/* ─── One-shot entrance variants (framer-motion, runs once then stops) ─── */

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
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/* ─── Figure sizing config — edit scales & heights per breakpoint here ───
   Mobile / Tablet: NO fixed vh — the image flows naturally (relative positioning).
   Desktop (lg+):   absolute positioning with vh-based height + scale for drama.
   ─────────────────────────────────────────────────────────────────────── */

const figureHeightClass = "lg:h-[95vh]";
const figureScaleClass  = "lg:scale-[1.4] xl:scale-[2]";


/* ─── Static style tokens ─── */

const headlineText =
  "bg-gradient-to-b from-[#1a3a63] via-[#245494] to-[#1a3a63] bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text]";

const headlineTrack =
  "leading-[1.1] tracking-[-0.06em] max-w-4xl font-black uppercase";

const grainPatternUrl =
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  ) +
  '")';

const ctaShineClass =
  "relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:animate-[hero-cta-shine_6.5s_ease-in-out_infinite] after:content-[''] motion-reduce:after:animate-none";

/* ─── Floating Badges — CMS-ready data layer ─── */

interface FloatingBadge {
  id: number;
  type: "text" | "icon";
  content: ReactNode;
  /** CSS position values (% relative to the right-column figure wrapper) */
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /** Seconds — offsets both entrance delay and float cycle for organic variety */
  animationDelay: number;
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
    position: { top: "20%", left: "20%" },
    animationDelay: 0,
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
    position: { top: "45%", right: "5%" },
    animationDelay: 1.2,
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
    position: { bottom: "20%", left: "-7%" },
    animationDelay: 2.4,
  },
];

export default function Hero({
  heading = "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ",
  subheading = "Оптимізуємо ваші податки та забезпечимо 100% порядок у звітності та документах. Довірте рутину професіоналам.",
  primaryCtaLabel = "Консультація",
  secondaryCtaLabel = "Наші послуги",
  primaryCtaHref = "#contact",
  secondaryCtaHref = "#about",
}: HeroProps) {
  const { line1, line2 } = useMemo(() => splitHeading(heading), [heading]);

  const headlineSizes =
    "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-foreground/10 bg-[#f8fafc] text-foreground"
    >
      {/* Grain texture — static, no animation cost */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: grainPatternUrl,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />

      {/* ─── Background blobs — CSS @keyframes, GPU-composited ───
           Moved from framer-motion animate() to pure CSS.
           blur reduced 120→80px, elements use will-change:transform
           for GPU compositing. No JS on main thread. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -left-[10%] top-[6%] h-[min(580px,60vw)] w-[min(580px,60vw)] rounded-full bg-[#245494]/10 blur-[80px] will-change-transform animate-[hero-blob-1_26s_ease-in-out_infinite] lg:left-[50%]"
        />
        <div
          className="absolute left-[32%] top-[16%] h-[min(520px,55vw)] w-[min(520px,55vw)] rounded-full bg-[#245494]/07 blur-[80px] will-change-transform animate-[hero-blob-2_26s_ease-in-out_4s_infinite] lg:left-[58%] lg:top-[12%]"
        />
        <div
          className="absolute right-[-6%] bottom-[18%] h-[min(420px,48vw)] w-[min(420px,48vw)] rounded-full bg-[#dc2626]/08 blur-[80px] will-change-transform animate-[hero-blob-3_26s_ease-in-out_8s_infinite]"
        />
      </div>

      {/* ─── 12-Column Grid Container ─── */}
      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6">
        <h1 id="hero-heading" className="sr-only">
          {heading}
        </h1>

        <div className="grid min-h-[90vh] grid-cols-1 lg:grid lg:grid-cols-12 lg:h-screen relative">

          {/* ═══════════════════════════════════════════════
              LEFT COLUMN — "Safe Zone" (text never overlapped)
              7 of 12 columns on desktop
              ═══════════════════════════════════════════════ */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center z-10 relative px-2 lg:pl-16 py-12 lg:py-0">
            {/* Entrance animation — runs ONCE, then framer-motion detaches */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="flex max-w-4xl flex-col gap-1 pt-2"
            >
              {line2 === null ? (
                <motion.p
                  aria-hidden
                  className={`${headlineSizes} ${headlineTrack} ${headlineText}`}
                  variants={itemVariants}
                >
                  {line1}
                </motion.p>
              ) : (
                <>
                  <motion.p
                    aria-hidden
                    className={`${headlineSizes} ${headlineTrack} ${headlineText}`}
                    variants={itemVariants}
                  >
                    {line1}
                  </motion.p>
                  <motion.p
                    aria-hidden
                    className={`${headlineSizes} ${headlineTrack} ${headlineText}`}
                    variants={itemVariants}
                  >
                    {"— "}
                    {line2}
                  </motion.p>
                </>
              )}
            </motion.div>

            <motion.div
              className="mt-8 flex max-w-xl flex-col gap-6"
              initial="hidden"
              animate="visible"
              variants={contentVariants}
            >
              <motion.p
                className="text-base leading-relaxed text-foreground/75 sm:text-lg"
                variants={itemVariants}
              >
                {subheading}
              </motion.p>
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                variants={itemVariants}
              >
                <a
                  href={primaryCtaHref}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full bg-acg-red px-6 py-3 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-red-800`}
                >
                  <span className="relative z-20">{primaryCtaLabel}</span>
                </a>
                <a
                  href={secondaryCtaHref}
                  className={`${ctaShineClass} inline-flex items-center justify-center rounded-full border border-acg-blue bg-white/25 px-6 py-3 text-sm font-medium text-acg-blue backdrop-blur-[2px] ring-1 ring-white/40 hover:bg-acg-blue/10`}
                >
                  <span className="relative z-20">{secondaryCtaLabel}</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════
              RIGHT COLUMN — "Dynamic Zone" (figure + badges)
              5 of 12 columns on desktop
              lg:-ml-20 creates controlled overlap onto text
              z-20 puts figure ABOVE text for 3D depth
              ═══════════════════════════════════════════════ */}
          <div className={`col-span-1 lg:col-span-5 relative flex items-end justify-center z-20 lg:-ml-20 overflow-hidden lg:overflow-visible ${figureHeightClass}`}>

            {/* Radial glow behind figure */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(ellipse_80%_55%_at_50%_78%,rgba(36,84,148,0.12),transparent_68%)]"
              aria-hidden
            />

            {/* Contact shadow on floor */}
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[16%] w-[min(92%,480px)] -translate-x-1/2 rounded-[100%] bg-foreground/20 blur-[52px]"
              aria-hidden
            />

            {/* ─── Figure wrapper: pinned to bottom-0, imposing scale ───
                 Entrance via framer-motion (runs once).
                 Responsive scale via Tailwind breakpoints. */}
            {/* Mobile: relative flow, natural aspect ratio.
                Desktop: absolute, fills container height. */}
            <motion.div
              className={`relative lg:absolute lg:bottom-0 lg:inset-x-0 lg:h-full z-[5] origin-bottom ${figureScaleClass} [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.12))]`}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              {/* Mobile: explicit w/h for natural sizing. Desktop: fill parent. */}
              <Image
                src="/images/hero-man.png"
                alt="Експерт бухгалтерського супроводу"
                width={800}
                height={1000}
                priority
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 50vw, 100vw"
                className="object-contain object-bottom w-full h-auto lg:absolute lg:inset-0 lg:w-full lg:h-full"
              />
            </motion.div>

            {/* ─── Dynamic Glassmorphism Badges ───
                 Hidden on mobile to prevent chaos.
                 Entrance: framer-motion (runs once).
                 Breathing: CSS @keyframes (GPU-composited, no JS). */}
            {floatingBadges.map((badge) => (
              <motion.div
                key={badge.id}
                className="pointer-events-none absolute z-[6] w-max hidden lg:flex"
                style={badge.position}
                initial={{ opacity: 0, scale: 0.85, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: 0.6 + badge.animationDelay,
                }}
              >
                {/* Breathing float via CSS — no JS overhead */}
                <div
                  className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl will-change-transform animate-[hero-badge-float_4s_ease-in-out_infinite] ${
                    badge.type === "icon"
                      ? "flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16"
                      : "px-4 py-3 sm:px-5 sm:py-3.5"
                  }`}
                  style={{ animationDelay: `${badge.animationDelay}s` }}
                >
                  {/* Inner glass sheen */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/[0.08] to-transparent opacity-70"
                    aria-hidden
                  />
                  {badge.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
