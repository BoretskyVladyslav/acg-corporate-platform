"use client";

import { useEffect, useState } from "react";

/** Tailwind `md` breakpoint — matches `min-width: 768px`. */
const MD_QUERY = "(min-width: 768px)";

/**
 * Mobile-first: `false` until mounted, then tracks viewport ≥ md.
 * Use to disable heavy motion below the `md` breakpoint.
 */
export function useIsMdUp(): boolean {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MD_QUERY);
    const update = () => setIsMd(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMd;
}
