"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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

/** Offset for fixed floating pill: top-6 (~24px) + pill height + зазор до контенту */
const SCROLL_TOP_OFFSET = 104;

const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function anchorFromHash(hash: string) {
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

const NAV: { href: string; label: string }[] = [
  { href: "#about", label: "Про нас" },
  { href: "#services-heading", label: "Послуги" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#advantages", label: "Переваги" },
  { href: "#trust", label: "Відгуки" },
  { href: "#faq", label: "FAQ" },
];

/** Кількість анімованих рядків у мобільному меню: NAV + CTA */
const MOBILE_NAV_ITEM_COUNT = NAV.length + 1;

const MOBILE_NAV_STAGGER_SHOW = 0.06;
const MOBILE_NAV_DELAY_CHILDREN = 0.05;
const MOBILE_NAV_STAGGER_HIDE = 0.04;
const MOBILE_NAV_ITEM_EXIT_DURATION = 0.2;
/** Кінець останнього staggered exit пункту (index 0 має найбільшу затримку) */
const MOBILE_OVERLAY_EXIT_DELAY =
  (MOBILE_NAV_ITEM_COUNT - 1) * MOBILE_NAV_STAGGER_HIDE +
  MOBILE_NAV_ITEM_EXIT_DURATION;
/** Cubic bezier — узгоджено з overlay; `as const` для типу `Easing` у Framer Motion */
const MOBILE_MENU_EASE = [0.22, 1, 0.36, 1] as const;

/** Порядок секцій по DOM зверху вниз — для scroll-spy (не як у наві меню) */
const SPY_SECTION_IDS: string[] = [
  "about",
  "services-heading",
  "pricing",
  "advantages",
  "trust",
  "faq",
  "contact",
];

const linkClass =
  "relative text-sm font-medium text-foreground/80 transition-colors hover:text-acg-blue px-4 py-2 whitespace-nowrap rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80";

/** Активний пункт десктопу: текст на синій пігулці */
const linkActiveClass =
  "!text-white hover:!text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]";

/** Активний пункт мобільного меню (світлий фон — без білого тексту) */
const mobileLinkActiveClass = "text-acg-blue font-semibold !no-underline";

/** Spring config for the sliding pill — snappy but smooth */
const PILL_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.75,
};

const mobileNavLinkClass =
  "block w-full text-2xl font-medium text-foreground py-4 border-b border-foreground/5 transition-colors hover:text-acg-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2 rounded-none";

const mobileCtaClass =
  "inline-flex w-full items-center justify-center rounded-full bg-acg-red py-4 text-lg font-medium text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/40 focus-visible:ring-offset-2";

const ctaClass =
  "inline-flex shrink-0 items-center justify-center rounded-full bg-acg-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 lg:px-6 lg:py-2.5";

const glassPill =
  "pointer-events-auto w-full max-w-5xl rounded-full border border-white/20 bg-white/70 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-md lg:px-6 lg:py-3";

const burgerClass =
  "pointer-events-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/40 text-foreground transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 lg:hidden";

/** Пігулка активного пункту лише на `lg+` (центр наві + CTA) */
const navMeetsLgQuery = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1024px)").matches;

export default function SiteHeader() {
  const lenis = useLenis();
  const reduceMotionPreferred = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = useId();

  // Sliding pill: координати від лівого-верхнього кута `<nav>` (разом із CTA)
  const navShellRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const navLinkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pillRect, setPillRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const measurePill = useCallback(() => {
    if (!activeSectionId || !navShellRef.current) {
      setPillRect(null);
      return;
    }
    if (!navMeetsLgQuery()) {
      setPillRect(null);
      return;
    }

    const navEl = navShellRef.current;
    const cs = getComputedStyle(navEl);
    if (cs.display === "none") {
      setPillRect(null);
      return;
    }

    const targetEl: HTMLElement | null =
      activeSectionId === "contact"
        ? ctaRef.current
        : navLinkRefs.current.get(activeSectionId) ?? null;

    if (!targetEl) {
      setPillRect(null);
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    if (navRect.width <= 0 || targetRect.width <= 0) {
      setPillRect(null);
      return;
    }

    setPillRect({
      x: targetRect.left - navRect.left,
      y: targetRect.top - navRect.top,
      width: targetRect.width,
      height: targetRect.height,
    });
  }, [activeSectionId]);

  // Re-measure whenever active section changes or on resize / layout
  useLayoutEffect(() => {
    measurePill();
  }, [measurePill]);

  useLayoutEffect(() => {
    const el = navShellRef.current;
    if (typeof window === "undefined") return;

    let raf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measurePill());
    };

    window.addEventListener("resize", scheduleMeasure, { passive: true });

    let ro: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleMeasure);
      ro.observe(el);
    }

    scheduleMeasure();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", scheduleMeasure);
      ro?.disconnect();
    };
  }, [measurePill]);

  const overlayVariants = useMemo(
    () => ({
      hidden: reduceMotionPreferred
        ? { opacity: 0 }
        : {
            opacity: 0,
            y: -20,
            transition: {
              duration: 0.3,
              ease: MOBILE_MENU_EASE,
              // motion.a лежать у звичайному <nav>, тому when:"afterChildren"
              // на overlay їх не бачить — виставляємо затримку вручну
              delay: MOBILE_OVERLAY_EXIT_DELAY,
            },
          },
      show: reduceMotionPreferred
        ? { opacity: 1 }
        : {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: MOBILE_MENU_EASE,
              when: "beforeChildren" as const,
            },
          },
    }),
    [reduceMotionPreferred],
  );

  const mobileNavItemMotion = useCallback(
    (index: number) => {
      if (reduceMotionPreferred) {
        return {
          initial: { opacity: 0 } as const,
          animate: { opacity: 1, transition: { duration: 0 } } as const,
          exit: { opacity: 0, transition: { duration: 0 } } as const,
        };
      }
      const hideDelay =
        (MOBILE_NAV_ITEM_COUNT - 1 - index) * MOBILE_NAV_STAGGER_HIDE;
      return {
        initial: { opacity: 0, y: 10 } as const,
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: MOBILE_MENU_EASE,
            delay: MOBILE_NAV_DELAY_CHILDREN + index * MOBILE_NAV_STAGGER_SHOW,
          },
        } as const,
        exit: {
          opacity: 0,
          y: 10,
          transition: {
            duration: MOBILE_NAV_ITEM_EXIT_DURATION,
            delay: hideDelay,
          },
        } as const,
      };
    },
    [reduceMotionPreferred],
  );

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  useEffect(() => {
    const resolveActiveSection = (): string | null => {
      const markerPx = SCROLL_TOP_OFFSET;
      for (let i = 0; i < SPY_SECTION_IDS.length; i++) {
        const id = SPY_SECTION_IDS[i];
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const nextId = SPY_SECTION_IDS[i + 1];
        const nextEl = nextId ? document.getElementById(nextId) : null;
        const nextTop = nextEl
          ? nextEl.getBoundingClientRect().top
          : Number.POSITIVE_INFINITY;
        if (top <= markerPx && nextTop > markerPx) {
          return id;
        }
      }
      return null;
    };

    const tick = () => {
      const nextActive = resolveActiveSection();
      setActiveSectionId((prev) =>
        prev === nextActive ? prev : nextActive,
      );

      if (lenis) {
        setScrollProgress(Math.min(1, Math.max(0, lenis.progress)));
      } else {
        const docEl = document.documentElement;
        const maxScroll = docEl.scrollHeight - docEl.clientHeight;
        setScrollProgress(maxScroll <= 0 ? 0 : docEl.scrollTop / maxScroll);
      }
    };

    if (lenis) {
      const unsub = lenis.on("scroll", tick);
      tick();
      window.addEventListener("resize", tick, { passive: true });
      return () => {
        unsub();
        window.removeEventListener("resize", tick);
      };
    }

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [lenis]);

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

  /** Закрити sheet після переходу (мобільне меню) */
  const scrollToSectionAndCloseMobile = useCallback(
    (hash: string, event?: MouseEvent<HTMLAnchorElement>) => {
      const id = anchorFromHash(hash);
      const el =
        typeof document !== "undefined" ? document.getElementById(id) : null;
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!el) return;

      closeMobile();

      if (event && hash.startsWith("#")) {
        event.preventDefault();
      }

      requestAnimationFrame(() => {
        if (lenis) {
          lenis.scrollTo(el, {
            offset: -SCROLL_TOP_OFFSET,
            duration: reduceMotion ? 0 : 1.35,
            easing: reduceMotion ? undefined : LENIS_EASING,
            immediate: reduceMotion,
          });
          return;
        }
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
    },
    [closeMobile, lenis],
  );

  const scrollToSectionDesktop = (
    hash: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => {
    const id = anchorFromHash(hash);
    const el =
      typeof document !== "undefined" ? document.getElementById(id) : null;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!el) return;

    if (event && hash.startsWith("#")) {
      event.preventDefault();
    }

    if (lenis) {
      lenis.scrollTo(el, {
        offset: -SCROLL_TOP_OFFSET,
        duration: reduceMotion ? 0 : 1.35,
        easing: reduceMotion ? undefined : LENIS_EASING,
        immediate: reduceMotion,
      });
      return;
    }

    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <header
        className={`pointer-events-none fixed left-0 right-0 top-6 flex justify-center px-4 ${mobileOpen ? "max-lg:z-30 lg:z-50" : "z-50"}`}
      >
        <div
          className="pointer-events-none fixed left-0 right-0 top-0 z-60 h-[3px] overflow-hidden bg-foreground/[0.07]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-label="Прогрес прокрутки сторінки"
        >
          <div
            className="h-full origin-left bg-acg-blue motion-reduce:transition-none motion-safe:transition-[transform] motion-safe:duration-150 motion-safe:ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>

        <nav
          ref={navShellRef}
          aria-label="Головна навігація"
          className={`${glassPill} relative flex w-full items-center justify-between gap-3`}
        >
          {pillRect ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-0 hidden rounded-full bg-acg-blue lg:block"
              initial={false}
              animate={{
                x: pillRect.x,
                y: pillRect.y,
                width: pillRect.width,
                height: pillRect.height,
                opacity: 1,
              }}
              transition={
                reduceMotionPreferred ? { duration: 0 } : PILL_SPRING
              }
            />
          ) : null}
          <Link
            href="/"
            className="relative z-10 inline-flex shrink-0 min-w-[120px] self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 rounded-lg"
          >
            <Image
              src="/images/logo.svg"
              alt="Alex Consulting Group"
              width={160}
              height={42}
              priority
              className="h-8 w-auto min-w-[120px] max-w-none object-contain object-left lg:h-10"
            />
          </Link>

          {/* Десктоп: посилання по центру; sliding pill — на рівні всього nav */}
          <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 lg:flex lg:items-center lg:justify-center">
            {NAV.map((item) => {
              const id = anchorFromHash(item.href);
              const isActive = activeSectionId === id;
              return (
                <a
                  key={item.href}
                  ref={(el) => {
                    if (el) navLinkRefs.current.set(id, el);
                    else navLinkRefs.current.delete(id);
                  }}
                  href={item.href}
                  onClick={(e) => scrollToSectionDesktop(item.href, e)}
                  className={`${linkClass} ${isActive ? linkActiveClass : ""} relative z-10`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <a
              ref={ctaRef}
              href="#contact"
              onClick={(e) => scrollToSectionDesktop("#contact", e)}
              className={`${ctaClass} max-lg:hidden ${
                activeSectionId === "contact"
                  ? `${linkActiveClass} bg-transparent! shadow-none ring-0 hover:bg-transparent!`
                  : ""
              }`}
              aria-current={
                activeSectionId === "contact" ? "location" : undefined
              }
            >
              Консультація
            </a>
            <button
              type="button"
              className={burgerClass}
              aria-expanded={mobileOpen}
              aria-controls={mobileOpen ? mobileMenuId : undefined}
              onClick={openMobile}
            >
              <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
              <span className="sr-only">Відкрити меню</span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
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
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col bg-white/90 backdrop-blur-xl lg:hidden"
            style={{
              paddingTop:
                "max(1.25rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))",
            }}
          >
            <div className="flex shrink-0 items-center justify-between px-6 pb-4">
              <Link
                href="/"
                className="inline-flex min-w-[120px] shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 focus-visible:ring-offset-2"
                onClick={closeMobile}
              >
                <Image
                  src="/images/logo.svg"
                  alt="Alex Consulting Group"
                  width={160}
                  height={42}
                  className="h-9 w-auto min-w-[120px] max-w-none object-contain object-left"
                />
              </Link>
              <button
                type="button"
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/40"
                aria-label="Закрити меню"
                onClick={closeMobile}
              >
                <X className="h-10 w-10" strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <nav
              aria-label="Мобільна навігація"
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
            >
              {NAV.map((item, index) => {
                const id = anchorFromHash(item.href);
                const isActive = activeSectionId === id;
                const itemMotion = mobileNavItemMotion(index);
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={itemMotion.initial}
                    animate={itemMotion.animate}
                    exit={itemMotion.exit}
                    onClick={(e) => scrollToSectionAndCloseMobile(item.href, e)}
                    className={`${mobileNavLinkClass} ${isActive ? mobileLinkActiveClass : ""}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
              <motion.a
                href="#contact"
                {...mobileNavItemMotion(NAV.length)}
                onClick={(e) => scrollToSectionAndCloseMobile("#contact", e)}
                className={`${mobileCtaClass} mt-auto mb-8 ${
                  activeSectionId === "contact"
                    ? "ring-2 ring-acg-blue/45 ring-offset-2 ring-offset-white/90 shadow-md shadow-acg-blue/15"
                    : ""
                }`}
                aria-current={
                  activeSectionId === "contact" ? "location" : undefined
                }
              >
                Консультація
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
