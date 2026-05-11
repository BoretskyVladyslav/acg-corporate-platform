"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

type SmoothScrollingProps = {
  children: React.ReactNode;
};

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useEffect(() => {
    // Drives native scrollTop on the root; Framer `useScroll` / scroll listeners stay aligned.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
