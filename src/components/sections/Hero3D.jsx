import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

/*
 * The 3D avatar is decorative and expensive — three.js, fiber and drei are the
 * largest dependencies on the site. Loading the canvas lazily lets the name
 * and the rest of the page render without waiting for any of it; the avatar
 * fades in a moment later.
 */
const HeroScene = lazy(() => import("./HeroScene"));

export default function Hero3D() {
  const mousePos = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollY } = useScroll();
  /* fade + lift on scroll */
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const translateY = useTransform(scrollY, [0, 400], [0, -80]);

  /*
   * The WebGL scene is the most expensive thing on the page, so it only runs
   * while it is actually on screen and the tab is in front. BackgroundCanvas
   * already reasoned this way ("Don't burn frames on a background canvas
   * nobody is looking at") — the 3D scene never got the same treatment.
   */
  const [sceneActive, setSceneActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let onScreen = true;
    const sync = () => setSceneActive(onScreen && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    // No point tracking the pointer for a scene that isn't rendering.
    if (!sceneActive) return;

    /* normalise pointer coords to [-1, 1] */
    const track = (clientX, clientY) => {
      const { innerWidth: w, innerHeight: h } = window;
      mousePos.current = {
        x: (clientX / w - 0.5) * 2,
        y: (clientY / h - 0.5) * 2,
      };
    };

    const handleMouseMove = (e) => track(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [sceneActive]);

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      style={{ opacity, y: translateY }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Name overlay ── */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none">
        {/* large faded name behind avatar */}
        <p
          className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(4rem,18vw,12rem)]"
          style={{
            fontFamily: "'Pacifico', cursive",
            color: "transparent",
            WebkitTextStroke: "2px rgba(249,115,22,0.08)",
          }}
          aria-hidden="true"
        >
          Param Shah
        </p>

        {/* Foreground name at top in Pacifico font */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="absolute top-[12%] text-center"
        >
          {/* A <p>, not an <h1>. This is the decorative display treatment of
              the name; the real document heading lives in Home. Two <h1>s on
              one page is an SEO and screen-reader problem. */}
          <p
            className="text-6xl md:text-7xl lg:text-8xl tracking-wide px-8 py-4 leading-normal"
            style={{
              fontFamily: "'Pacifico', cursive",
              background: "linear-gradient(to right, #ffeedb, #f97316, #fb923c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 20px rgba(249,115,22,0.6))",
            }}
          >
            Param Shah
          </p>
        </motion.div>
      </div>

      {/* ── Three.js Canvas (code-split) ── */}
      <div className="h-screen w-full">
        <Suspense fallback={null}>
          <HeroScene active={sceneActive} mousePos={mousePos} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
    </motion.section>
  );
}
