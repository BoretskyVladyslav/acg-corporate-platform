import type Lenis from "@studio-freight/lenis";

import { lenisEasing } from "@/src/lib/lenisEasing";

const FALLBACK_OFFSET_PX = 88;
const LENIS_SCROLL_DURATION = 1.15;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function getHeaderOffsetPx(): number {
  if (typeof document === "undefined") return FALLBACK_OFFSET_PX;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-offset")
    .trim();
  if (raw.endsWith("px")) {
    const n = parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : FALLBACK_OFFSET_PX;
  }
  if (raw.endsWith("rem")) {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n * 16 : FALLBACK_OFFSET_PX;
  }
  return FALLBACK_OFFSET_PX;
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

/**
 * Плавний скрол до секції з урахуванням висоти фіксованого хедера (як у SiteHeader).
 */
export function scrollToSectionById(
  id: string,
  lenis: Lenis | null,
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(id);
  if (!el) return null;

  const offsetPx = getHeaderOffsetPx();
  const reduceMotion = prefersReducedMotion();

  if (lenis) {
    lenis.scrollTo(el, {
      offset: -offsetPx,
      duration: reduceMotion ? 0 : LENIS_SCROLL_DURATION,
      easing: reduceMotion ? undefined : lenisEasing,
      immediate: reduceMotion,
    });
  } else {
    scrollElementNative(el, offsetPx, reduceMotion ? "auto" : "smooth");
  }

  return el;
}
