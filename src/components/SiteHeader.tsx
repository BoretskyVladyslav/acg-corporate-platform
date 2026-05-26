"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLenis } from "@/src/components/SmoothScrolling";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { lenisEasing } from "@/src/lib/lenisEasing";
import { telHrefFromDisplay } from "@/src/lib/telHrefFromDisplay";

const FALLBACK_HEADER_OFFSET_PX = 88;
const LENIS_SCROLL_TO_DURATION = 1.15;

/** Єдиний layoutId для shared layout між пунктами меню та CTA. */
const NAV_ACTIVE_PILL_LAYOUT_ID = "activeMenuPill";

const IO_THRESHOLDS = [
  0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.65, 0.8, 1,
] as const;

function anchorFromHash(hash: string) {
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

const NAV: { href: string; label: string }[] = [
  { href: "#about", label: "Про нас" },
  { href: "#services", label: "Послуги" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#advantages", label: "Переваги" },
  { href: "#trust", label: "Відгуки" },
  { href: "#faq", label: "FAQ" },
];

const MOBILE_MENU_PHONE_DISPLAY = "+38 097 505 86 86";
const MOBILE_MENU_PHONE_HREF =
  telHrefFromDisplay(MOBILE_MENU_PHONE_DISPLAY) ?? "tel:+380975058686";
const MOBILE_MENU_EMAIL = "info@acg-ua.com";
const MOBILE_MENU_EMAIL_HREF = "mailto:info@acg-ua.com";

const FLUID_EASE = [0.4, 0, 0.2, 1] as const;

/** Плашка активного пункту: жорсткіший spring — швидкий «переліт», мало залипання. */
const NAV_ACTIVE_PILL_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 0.55,
  restSpeed: 2.5,
  restDelta: 0.01,
};

const BURGER_MORPH_TWEEN = {
  type: "tween" as const,
  ease: [0.25, 1, 0.5, 1] as const,
  duration: 0.22,
};

const MOBILE_MENU_EASE = [0.22, 1, 0.36, 1] as const;

/** Плавна поява / закриття повноекранного мобільного меню (без затримки перед exit). */
const MOBILE_OVERLAY_ENTER_DURATION = 0.38;
const MOBILE_OVERLAY_EXIT_DURATION = 0.34;

const COLOR_FLOW_TRANSITION = {
  duration: 0.7,
  ease: FLUID_EASE,
};

const CTA_LIFT_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const CTA_REST_SHADOW =
  "0 4px 14px -10px rgba(36, 84, 148, 0.12), 0 1px 3px -2px rgba(36, 84, 148, 0.08)";

const CTA_HOVER_SHADOW =
  "0 12px 28px -14px rgba(36, 84, 148, 0.22), 0 6px 14px -8px rgba(36, 84, 148, 0.14)";

const SCROLL_HEADER_RANGE = [0, 100] as const;

function clampScrollProgress(scrollY: number) {
  return Math.min(1, Math.max(0, scrollY / SCROLL_HEADER_RANGE[1]));
}

const SPY_SECTION_IDS: string[] = [
  "about",
  "services",
  "pricing",
  "advantages",
  "trust",
  "contact",
  "faq",
];

const linkBaseClass =
  "relative z-10 whitespace-nowrap px-4 py-2 font-sans text-sm font-medium tracking-wide text-foreground/65 outline-none transition-colors duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:text-foreground/90 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-acg-blue/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white/90";

const linkActiveClass =
  "!text-blue-950 transition-colors duration-200 ease-out hover:!text-blue-950 focus-visible:!ring-offset-white";

const mobileLinkActiveClass =
  "font-light text-acg-blue !no-underline";

const mobileNavLinkClass =
  "block w-full py-3 font-sans text-4xl font-light tracking-tight text-blue-950 outline-none transition-colors duration-300 hover:text-acg-blue focus-visible:text-acg-blue focus-visible:ring-2 focus-visible:ring-acg-blue/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80";

const mobileCtaClass =
  "group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-acg-red py-4 font-sans text-lg font-medium tracking-wide text-white outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2";

const ctaShellClass =
  "group relative z-10 inline-flex max-lg:hidden shrink-0 items-center justify-center overflow-visible rounded-full outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white/90";

const ctaInnerShellClass =
  "relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full";

const ctaLayerSolid =
  "pointer-events-none absolute inset-0 rounded-full bg-acg-red transition-[background-color] duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]";

const ctaLayerGlow =
  "pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.14] via-white/[0.06] to-transparent opacity-0 transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100";

const ctaLabelClass =
  "relative z-10 px-4 py-2 font-sans text-sm font-medium tracking-wide transition-colors duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] lg:px-6 lg:py-2.5";

const navShellClass =
  "relative mx-auto flex w-full items-center justify-between gap-3 px-4 sm:px-6";

const burgerClass =
  "pointer-events-auto relative z-50 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-acg-light/50 text-blue-950 backdrop-blur-sm transition-colors duration-500 hover:border-acg-blue/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white/90 lg:hidden";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function scrollElementNative(
  el: HTMLElement,
  offsetPx: number,
  behavior: ScrollBehavior,
) {
  const top = el.getBoundingClientRect().top + window.scrollY - offsetPx;
  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
}

export default function SiteHeader() {
  const lenis = useLenis();
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const { scrollY } = useScroll();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerOffsetPx, setHeaderOffsetPx] = useState(FALLBACK_HEADER_OFFSET_PX);
  const mobileMenuId = useId();
  const headerRootRef = useRef<HTMLElement | null>(null);
  const pageEnterTimeRef = useRef<number | null>(null);
  const pendingMobileScrollRef = useRef<{
    el: HTMLElement;
    reduceMotion: boolean;
  } | null>(null);
  const intersectionRatiosRef = useRef<Map<string, number>>(new Map());

  useLayoutEffect(() => {
    if (
      pageEnterTimeRef.current === null &&
      typeof performance !== "undefined"
    ) {
      pageEnterTimeRef.current = performance.now();
    }
  }, []);

  const navPaddingY = useTransform(scrollY, (y) => {
    const t = clampScrollProgress(y);
    return reduceMotionPreferred ? 20 : 20 - 8 * t;
  });

  const backdropFilter = useTransform(scrollY, (y) => {
    const t = clampScrollProgress(y);
    const blur = reduceMotionPreferred ? 0 : 12 * t;
    return `blur(${blur}px)`;
  });

  const capsuleBackgroundColor = useTransform(scrollY, (y) => {
    const t = clampScrollProgress(y);
    const a = reduceMotionPreferred ? 0.94 : 0.94 - 0.14 * t;
    return `rgba(255, 255, 255, ${a})`;
  });

  const capsuleBoxShadow = useTransform(scrollY, (y) => {
    const t = clampScrollProgress(y);
    if (reduceMotionPreferred) {
      return "0 14px 48px -28px rgba(36, 84, 148, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.72)";
    }
    const outerA = 0.18 + 0.02 * t;
    const insetA = 0.72 - 0.17 * t;
    const spread = 48 - 4 * t;
    const blurSpread = 28 - 2 * t;
    const yOff = 14 - 2 * t;
    return `0 ${yOff}px ${spread}px -${blurSpread}px rgba(36, 84, 148, ${outerA}), inset 0 1px 0 rgba(255, 255, 255, ${insetA})`;
  });

  useLayoutEffect(() => {
    const el = headerRootRef.current;
    if (!el || typeof window === "undefined") return;

    const apply = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      const next = h > 8 ? h : FALLBACK_HEADER_OFFSET_PX;
      setHeaderOffsetPx(next);
      document.documentElement.style.setProperty("--header-offset", `${next}px`);
    };

    apply();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(apply);
      ro.observe(el);
    }

    window.addEventListener("resize", apply, { passive: true });

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ratios = intersectionRatiosRef.current;
    ratios.clear();

    const pickActiveFromRatios = () => {
      let bestId: string | null = null;
      let bestRatio = -1;
      for (const id of SPY_SECTION_IDS) {
        const r = ratios.get(id);
        if (r !== undefined && r > bestRatio) {
          bestRatio = r;
          bestId = id;
        }
      }
      setActiveSectionId((prev) => (bestId !== null ? bestId : prev));
    };

    const elements = SPY_SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((n): n is HTMLElement => Boolean(n));

    if (elements.length === 0) return;

    const rootMargin = `-${headerOffsetPx}px 0px -40% 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!SPY_SECTION_IDS.includes(id)) continue;
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            ratios.set(id, entry.intersectionRatio);
          } else {
            ratios.delete(id);
          }
        }
        pickActiveFromRatios();
      },
      {
        root: null,
        rootMargin,
        threshold: [...IO_THRESHOLDS],
      },
    );

    for (const el of elements) observer.observe(el);

    return () => {
      observer.disconnect();
      ratios.clear();
    };
  }, [headerOffsetPx]);

  useEffect(() => {
    const updateProgress = () => {
      if (lenis) {
        setScrollProgress(Math.min(1, Math.max(0, lenis.progress)));
        return;
      }
      const docEl = document.documentElement;
      const maxScroll = docEl.scrollHeight - docEl.clientHeight;
      setScrollProgress(maxScroll <= 0 ? 0 : docEl.scrollTop / maxScroll);
    };

    if (lenis) {
      const unsub = lenis.on("scroll", updateProgress);
      updateProgress();
      window.addEventListener("resize", updateProgress, { passive: true });
      return () => {
        unsub();
        window.removeEventListener("resize", updateProgress);
      };
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [lenis]);

  const overlayVariants = useMemo(
    () => ({
      hidden: reduceMotionPreferred
        ? {
            opacity: 0,
            transition: { duration: 0.15, ease: FLUID_EASE },
          }
        : {
            opacity: 0,
            y: -50,
            scale: 0.98,
            transition: {
              duration: MOBILE_OVERLAY_EXIT_DURATION,
              ease: MOBILE_MENU_EASE,
            },
          },
      show: reduceMotionPreferred
        ? {
            opacity: 1,
            transition: { duration: 0.15, ease: FLUID_EASE },
          }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: MOBILE_OVERLAY_ENTER_DURATION,
              ease: MOBILE_MENU_EASE,
            },
          },
    }),
    [reduceMotionPreferred],
  );

  const mobileMenuListVariants = useMemo(
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
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.03,
              },
            },
          },
    [reduceMotionPreferred],
  );

  const mobileMenuLinkVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: { opacity: 1, y: 0 },
            show: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
          }
        : {
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.26,
                ease: MOBILE_MENU_EASE,
              },
            },
            exit: {
              opacity: 0,
              y: 8,
              transition: { duration: 0.2, ease: FLUID_EASE },
            },
          },
    [reduceMotionPreferred],
  );

  const toggleMobile = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const performScrollTo = useCallback(
    (el: HTMLElement, reduceMotion: boolean) => {
      if (lenis) {
        lenis.scrollTo(el, {
          offset: -headerOffsetPx,
          duration: reduceMotion ? 0 : LENIS_SCROLL_TO_DURATION,
          easing: reduceMotion ? undefined : lenisEasing,
          immediate: reduceMotion,
        });
        return;
      }
      scrollElementNative(
        el,
        headerOffsetPx,
        reduceMotion ? "auto" : "smooth",
      );
    },
    [lenis, headerOffsetPx],
  );

  const onMobileOverlayExitComplete = useCallback(() => {
    const p = pendingMobileScrollRef.current;
    if (!p) return;
    pendingMobileScrollRef.current = null;
    requestAnimationFrame(() => performScrollTo(p.el, p.reduceMotion));
  }, [performScrollTo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    if (pageEnterTimeRef.current == null) return;
    if (performance.now() - pageEnterTimeRef.current > 2000) return;
    const target = document.getElementById(anchorFromHash(hash));
    if (!target || headerOffsetPx < 32) return;

    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(target, {
          offset: -headerOffsetPx,
          duration: 0,
          immediate: true,
        });
        return;
      }
      scrollElementNative(target, headerOffsetPx, "auto");
    });
  }, [lenis, headerOffsetPx]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  const scrollToSectionAndCloseMobile = useCallback(
    (hash: string, event?: MouseEvent<HTMLAnchorElement>) => {
      const id = anchorFromHash(hash);
      const el =
        typeof document !== "undefined" ? document.getElementById(id) : null;
      const reduceMotion = prefersReducedMotion();

      if (!el) return;

      if (event && hash.startsWith("#")) {
        event.preventDefault();
      }

      setActiveSectionId(id);

      if (mobileOpen) {
        pendingMobileScrollRef.current = { el, reduceMotion };
        closeMobile();
        return;
      }

      requestAnimationFrame(() => performScrollTo(el, reduceMotion));
    },
    [closeMobile, mobileOpen, performScrollTo],
  );

  const scrollToSectionDesktop = useCallback(
    (hash: string, event?: MouseEvent<HTMLAnchorElement>) => {
      const id = anchorFromHash(hash);
      const el =
        typeof document !== "undefined" ? document.getElementById(id) : null;
      const reduceMotion = prefersReducedMotion();

      if (!el) return;

      if (event && hash.startsWith("#")) {
        event.preventDefault();
      }

      setActiveSectionId(id);
      performScrollTo(el, reduceMotion);
    },
    [performScrollTo],
  );

  const ctaWhileHover = reduceMotionPreferred
    ? undefined
    : {
        y: -1,
        boxShadow: CTA_HOVER_SHADOW,
        transition: {
          y: CTA_LIFT_SPRING,
          boxShadow: COLOR_FLOW_TRANSITION,
        },
      };

  return (
    <>
      <header
        ref={headerRootRef}
        className="pointer-events-none fixed left-0 right-0 top-0 z-50"
      >
        <div
          className="pointer-events-none h-[3px] w-full overflow-hidden bg-acg-blue/[0.07]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-label="Прогрес прокрутки сторінки"
        >
          <div
            className="h-full origin-left bg-acg-blue motion-reduce:transition-none motion-safe:transition-[transform] motion-safe:duration-[600ms] motion-safe:[transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>

        <div className="pointer-events-none px-4 pt-3 sm:px-6 sm:pt-4">
          <motion.div
            className="pointer-events-auto mx-auto w-full max-w-7xl overflow-hidden rounded-[999px] border border-acg-blue/[0.08] will-change-transform [transform:translateZ(0)]"
            initial={false}
            style={
              isMdUp && !reduceMotionPreferred
                ? {
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                    backgroundColor: capsuleBackgroundColor,
                    boxShadow: capsuleBoxShadow,
                  }
                : {
                    backdropFilter: reduceMotionPreferred ? "none" : "blur(10px)",
                    WebkitBackdropFilter: reduceMotionPreferred
                      ? "none"
                      : "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.94)",
                    boxShadow:
                      "0 14px 48px -28px rgba(36, 84, 148, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.72)",
                  }
            }
          >
            <motion.nav
              aria-label="Головна навігація"
              className={`${navShellClass} pointer-events-auto`}
              initial={false}
              style={
                isMdUp
                  ? {
                      paddingTop: navPaddingY,
                      paddingBottom: navPaddingY,
                    }
                  : { paddingTop: 20, paddingBottom: 20 }
              }
            >
              <Link
                href="/"
                className="relative z-10 inline-flex min-w-[138px] shrink-0 items-center self-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white/90"
              >
                <Image
                  src="/images/logo.svg"
                  alt="Alex Consulting Group"
                  width={176}
                  height={46}
                  priority
                  className="h-10 w-auto min-w-[138px] max-w-none object-contain object-left opacity-[0.88] transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:opacity-100 lg:h-11"
                />
              </Link>

              <LayoutGroup id="site-header-desktop-nav">
                <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 items-center justify-center lg:flex">
                  <ul className="m-0 flex list-none items-center justify-center p-0">
                    {NAV.map((item) => {
                      const id = anchorFromHash(item.href);
                      const isActive = activeSectionId === id;
                      const showNavPill =
                        isActive && activeSectionId !== "contact";
                      return (
                        <li key={item.href} className="relative list-none">
                          {showNavPill ? (
                              <motion.div
                              layoutId={NAV_ACTIVE_PILL_LAYOUT_ID}
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-0 rounded-full bg-blue-50/80 shadow-sm ring-1 ring-slate-900/[0.06] will-change-transform"
                              transition={
                                reduceMotionPreferred
                                  ? { duration: 0 }
                                  : NAV_ACTIVE_PILL_SPRING
                              }
                            />
                          ) : null}
                          <a
                            href={item.href}
                            onClick={(e) =>
                              scrollToSectionDesktop(item.href, e)
                            }
                            className={`group ${linkBaseClass} ${isActive ? linkActiveClass : ""}`}
                            aria-current={isActive ? "location" : undefined}
                          >
                            <span className="relative z-10">{item.label}</span>
                            {!isActive ? (
                              <span
                                aria-hidden
                                className="pointer-events-none absolute left-4 right-4 z-10 h-px origin-center bg-current opacity-60 scale-x-0 transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none group-hover:scale-x-100 group-focus-visible:scale-x-100"
                                style={{ bottom: "-4px" }}
                              />
                            ) : null}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="relative z-10 flex shrink-0 items-center gap-2">
                  <motion.a
                    href="#contact"
                    onClick={(e) => scrollToSectionDesktop("#contact", e)}
                    className={ctaShellClass}
                    style={{
                      boxShadow: CTA_REST_SHADOW,
                      willChange: "transform",
                    }}
                    initial={false}
                    whileHover={ctaWhileHover}
                    aria-current={
                      activeSectionId === "contact" ? "location" : undefined
                    }
                  >
                    {activeSectionId === "contact" ? (
                      <motion.div
                        layoutId={NAV_ACTIVE_PILL_LAYOUT_ID}
                        aria-hidden
                        className="pointer-events-none absolute -inset-1 z-0 rounded-full bg-blue-50/80 shadow-sm ring-1 ring-slate-900/[0.06] backdrop-blur-[2px] will-change-transform"
                        transition={
                          reduceMotionPreferred
                            ? { duration: 0 }
                            : NAV_ACTIVE_PILL_SPRING
                        }
                      />
                    ) : null}
                    <span className={ctaInnerShellClass}>
                      <span className={ctaLayerSolid} aria-hidden />
                      <span className={ctaLayerGlow} aria-hidden />
                      <span
                        className={`relative z-10 ${ctaLabelClass} text-white`}
                      >
                        Консультація
                      </span>
                    </span>
                  </motion.a>
                  <button
                    type="button"
                    className={burgerClass}
                    aria-expanded={mobileOpen}
                    aria-controls={mobileOpen ? mobileMenuId : undefined}
                    onClick={toggleMobile}
                  >
                    <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
                      <motion.span
                        aria-hidden
                        className="block h-[2px] w-5 origin-center rounded-full bg-current will-change-transform"
                        animate={{
                          rotate: mobileOpen ? 45 : 0,
                          y: mobileOpen ? 7 : 0,
                        }}
                        transition={
                          reduceMotionPreferred
                            ? { duration: 0 }
                            : BURGER_MORPH_TWEEN
                        }
                      />
                      <motion.span
                        aria-hidden
                        className="block h-[2px] w-5 origin-center rounded-full bg-current will-change-transform"
                        animate={{
                          opacity: mobileOpen ? 0 : 1,
                          scaleX: mobileOpen ? 0 : 1,
                        }}
                        transition={
                          reduceMotionPreferred
                            ? { duration: 0 }
                            : BURGER_MORPH_TWEEN
                        }
                      />
                      <motion.span
                        aria-hidden
                        className="block h-[2px] w-5 origin-center rounded-full bg-current will-change-transform"
                        animate={{
                          rotate: mobileOpen ? -45 : 0,
                          y: mobileOpen ? -7 : 0,
                        }}
                        transition={
                          reduceMotionPreferred
                            ? { duration: 0 }
                            : BURGER_MORPH_TWEEN
                        }
                      />
                    </span>
                    <span className="sr-only">
                      {mobileOpen ? "Закрити меню" : "Відкрити меню"}
                    </span>
                  </button>
                </div>
              </LayoutGroup>
            </motion.nav>
          </motion.div>
        </div>
      </header>

      <AnimatePresence onExitComplete={onMobileOverlayExitComplete}>
        {mobileOpen ? (
          <motion.div
            key="mobile-fullscreen-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Мобільне меню"
            id={mobileMenuId}
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="pointer-events-auto fixed inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white/90 backdrop-blur-2xl will-change-[transform,opacity] lg:hidden"
          >
            <motion.nav
              aria-label="Мобільна навігація"
              variants={mobileMenuListVariants}
              initial="hidden"
              animate="show"
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[max(1.25rem,calc(var(--header-offset,88px)+1rem))] text-left"
            >
              {NAV.map((item) => {
                const id = anchorFromHash(item.href);
                const isActive = activeSectionId === id;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    variants={mobileMenuLinkVariants}
                    onClick={(e) =>
                      scrollToSectionAndCloseMobile(item.href, e)
                    }
                    className={`${mobileNavLinkClass} will-change-transform ${isActive ? mobileLinkActiveClass : ""}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
              <motion.a
                href="#contact"
                variants={mobileMenuLinkVariants}
                onClick={(e) =>
                  scrollToSectionAndCloseMobile("#contact", e)
                }
                className={`${mobileCtaClass} mt-12 will-change-transform ${
                  activeSectionId === "contact"
                    ? "ring-2 ring-acg-blue/30 ring-offset-2 ring-offset-white/90"
                    : ""
                }`}
                style={{
                  boxShadow: CTA_REST_SHADOW,
                  willChange: "transform",
                }}
                whileHover={isMdUp ? ctaWhileHover : undefined}
                aria-current={
                  activeSectionId === "contact" ? "location" : undefined
                }
              >
                <span className={ctaLayerSolid} aria-hidden />
                <span className={ctaLayerGlow} aria-hidden />
                <span className="relative z-10">Консультація</span>
              </motion.a>

              <motion.div
                variants={mobileMenuLinkVariants}
                className="mt-auto border-t border-foreground/10 pt-10 will-change-transform"
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground/45">
                  Контакти
                </p>
                <a
                  href={MOBILE_MENU_PHONE_HREF}
                  className="mt-4 block text-sm font-normal tracking-wide text-foreground/70 transition-colors hover:text-acg-blue"
                >
                  {MOBILE_MENU_PHONE_DISPLAY}
                </a>
                <a
                  href={MOBILE_MENU_EMAIL_HREF}
                  className="mt-2 block text-sm font-normal tracking-wide text-foreground/70 transition-colors hover:text-acg-blue"
                >
                  {MOBILE_MENU_EMAIL}
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
