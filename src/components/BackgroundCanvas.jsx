import { useEffect, useRef, useState } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const particlesRef = useRef([]);
  const animId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const NUM = 60;
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < NUM; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1.5 + Math.random() * 1.5,
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sp = scrollPercent;

      // Determine alpha based on scroll zone
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
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Contact zone orange glow
      if (sp > 0.7) {
        const glowAlpha = (sp - 0.7) / 0.3 * 0.06;
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height, 0,
          canvas.width / 2, canvas.height, canvas.height * 0.6
        );
        gradient.addColorStop(0, `rgba(249,115,22,${glowAlpha})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw particles and connections
      const particles = particlesRef.current;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${particleAlpha})`;
        ctx.fill();
      });

      // Draw connections (only in hero zone for perf)
      if (sp < 0.35) {
        const connectionAlpha = particleAlpha * 0.4;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(249, 115, 22, ${connectionAlpha * (1 - dist / 150)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId.current = requestAnimationFrame(draw);
    };

    animId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animId.current) cancelAnimationFrame(animId.current);
    };
  }, [scrollPercent]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
