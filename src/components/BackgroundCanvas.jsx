import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

const NUM_PARTICLES = 80;
const CONNECT_DISTANCE = 150;

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animId = useRef(null);
  // Scroll progress lives in a ref, not state: it changes on every scroll
  // frame, and re-rendering (or restarting the animation loop) for it was the
  // single most expensive thing this component did.
  const scrollRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = docHeight > 0 ? window.scrollY / docHeight : 0;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Match the backing store to the device pixel ratio so particles aren't
    // blurry on high-DPI screens, but cap it — at 3x the connection pass gets
    // expensive for no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1.5 + Math.random() * 1.5,
        });
      }
    }

    const paint = (animate) => {
      ctx.clearRect(0, 0, width, height);
      const sp = scrollRef.current;

      // Particle opacity fades as the visitor scrolls past the hero
      let particleAlpha;
      if (sp < 0.2) {
        particleAlpha = 0.3;
      } else if (sp < 0.7) {
        particleAlpha = 0.3 - (sp - 0.2) * 0.4;
      } else {
        particleAlpha = 0.1;
      }
      particleAlpha = Math.max(0.05, particleAlpha);

      // Background gradient shift
      if (sp >= 0.2 && sp < 0.7) {
        const blend = (sp - 0.2) / 0.5;
        const r = Math.round(10 + blend * 3);
        const g = Math.round(10 + blend * 5);
        const b = Math.round(10 + blend * 10);
        ctx.fillStyle = `rgba(${r},${g},${b},0.03)`;
        ctx.fillRect(0, 0, width, height);
      }

      // Contact zone orange glow
      if (sp > 0.7) {
        const glowAlpha = ((sp - 0.7) / 0.3) * 0.06;
        const gradient = ctx.createRadialGradient(
          width / 2, height, 0,
          width / 2, height, height * 0.6
        );
        gradient.addColorStop(0, `rgba(249,115,22,${glowAlpha})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const particles = particlesRef.current;
      ctx.fillStyle = `rgba(249, 115, 22, ${particleAlpha})`;

      for (const p of particles) {
        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connections are O(n²), so only draw them in the hero zone
      if (sp < 0.35) {
        const connectionAlpha = particleAlpha * 0.4;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            // Compare squared distances to skip a sqrt per pair
            if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(249, 115, 22, ${
                connectionAlpha * (1 - dist / CONNECT_DISTANCE)
              })`;
              ctx.stroke();
            }
          }
        }
      }
    };

    if (reducedMotion) {
      // Draw the field once and leave it there — the particles are decorative,
      // so a still frame keeps the look without the drifting motion.
      paint(false);
      const repaint = () => paint(false);
      window.addEventListener("resize", repaint);
      window.addEventListener("scroll", repaint, { passive: true });
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", repaint);
        window.removeEventListener("scroll", repaint);
      };
    }

    const draw = () => {
      paint(true);
      animId.current = requestAnimationFrame(draw);
    };
    animId.current = requestAnimationFrame(draw);

    // Don't burn frames on a background canvas nobody is looking at.
    const handleVisibility = () => {
      if (document.hidden) {
        if (animId.current) cancelAnimationFrame(animId.current);
        animId.current = null;
      } else if (!animId.current) {
        animId.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animId.current) cancelAnimationFrame(animId.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
