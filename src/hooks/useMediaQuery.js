import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query and re-renders when it changes.
 *
 * useSyncExternalStore rather than useState + useEffect so the first render
 * already has the correct value — no flash of the wrong variant.
 */
export default function useMediaQuery(query) {
  const subscribe = (callback) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };

  const getSnapshot = () => window.matchMedia(query).matches;

  // Server snapshot: nothing prerenders here, but React asks for it anyway.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True when the visitor has asked the OS to minimise animation.
 * Respecting this is what keeps a heavily animated site usable for people
 * with vestibular sensitivity.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Matches the media query that gates the custom cursor in index.css. */
export function useHasFinePointer() {
  return useMediaQuery("(pointer: fine) and (min-width: 768px)");
}
