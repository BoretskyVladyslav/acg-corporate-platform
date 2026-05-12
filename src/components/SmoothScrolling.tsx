"use client";

import Lenis from "@studio-freight/lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { lenisEasing } from "@/src/lib/lenisEasing";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

type SmoothScrollingProps = {
  children: ReactNode;
};

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      easing: lenisEasing,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis must be constructed in an effect and exposed via context
    setLenis(instance);

    let rafId = 0;

    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
