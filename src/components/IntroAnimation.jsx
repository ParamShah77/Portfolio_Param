import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const LINES = [
  { prompt: true, text: "initializing Param Shah..." },
  {
    prompt: true,
    text: "loading: B.Tech Computer Engineering @ SPIT, Mumbai  ✓",
  },
  {
    prompt: true,
    text: "passion: building systems that bridge code and reality",
  },
  { prompt: false, text: "status: [████████████████████] 100% loaded" },
  { prompt: true, text: "Welcome." },
];

const TYPE_SPEED = 40; // ms per character
const LINE_PAUSE = 400; // ms between lines

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState("particles"); // particles | terminal | fadeout | done
  const canvasRef = useRef(null);
  const terminalRef = useRef(null);
  const [typedLines, setTypedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const overlayRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const phaseTimerRef = useRef(null);

  // Particle explosion + implosion on canvas
  useEffect(() => {
    if (phase !== "particles") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const NUM = 200;
    const particles = [];

    for (let i = 0; i < NUM; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.5 + Math.random() * 2,
        alpha: 0.6 + Math.random() * 0.4,
        life: 0,
      });
    }
    particlesRef.current = particles;

    const startTime = Date.now();
    const EXPLODE_DURATION = 1500;
    const IMPLODE_START = 1100;

    const draw = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        if (elapsed < IMPLODE_START) {
          // Explode outward with deceleration
          const progress = elapsed / EXPLODE_DURATION;
          const ease = 1 - Math.pow(1 - progress, 3);
          p.x += p.vx * (1 - ease * 0.8);
          p.y += p.vy * (1 - ease * 0.8);
        } else {
          // Implode back to center
          const implodeProgress = (elapsed - IMPLODE_START) / 400;
          const ease = Math.min(implodeProgress, 1);
          p.x = p.x + (cx - p.x) * ease * 0.15;
          p.y = p.y + (cy - p.y) * ease * 0.15;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * (elapsed > IMPLODE_START ? Math.max(0, 1 - (elapsed - IMPLODE_START) / 600) : 1)})`;
        ctx.fill();
      });

      if (elapsed < EXPLODE_DURATION + 200) {
        animFrameRef.current = requestAnimationFrame(draw);
      } else {
        setPhase("terminal");
      }
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  // Terminal typewriter
  useEffect(() => {
    if (phase !== "terminal") return;

    // Animate terminal entrance
    if (terminalRef.current) {
      gsap.fromTo(
        terminalRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }
      );
    }
  }, [phase]);

  // Typing logic
  useEffect(() => {
    if (phase !== "terminal") return;
    if (currentLine >= LINES.length) {
      // All lines typed — pause, then fade out
      phaseTimerRef.current = setTimeout(() => {
        setPhase("fadeout");
      }, 1000);
      return;
    }

    const line = LINES[currentLine];
    const fullText = line.text;

    if (currentChar < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(timer);
    } else {
      // Line complete, add to typed lines and move to next
      const timer = setTimeout(() => {
        setTypedLines((prev) => [...prev, { ...line, text: fullText }]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, LINE_PAUSE);
      return () => clearTimeout(timer);
    }
  }, [phase, currentLine, currentChar]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Fade out
  useEffect(() => {
    if (phase !== "fadeout") return;
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          setPhase("done");
          onComplete();
        },
      });
    }
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const currentLineData = LINES[currentLine];
  const partialText = currentLineData
    ? currentLineData.text.slice(0, currentChar)
    : "";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Particles canvas */}
      {phase === "particles" && (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}

      {/* Terminal */}
      {(phase === "terminal" || phase === "fadeout") && (
        <div
          ref={terminalRef}
          className="relative w-[90vw] max-w-[580px] rounded-lg border border-[#f97316] p-6"
          style={{
            backgroundColor: "#111111",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* Traffic light dot */}
          <div className="absolute top-3 left-4 flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#f97316]" />
          </div>

          <div className="mt-4 space-y-1.5 text-sm leading-relaxed">
            {/* Already typed lines */}
            {typedLines.map((line, i) => (
              <div key={i}>
                {line.prompt && (
                  <span className="text-[#f97316]">{">"} </span>
                )}
                <span className="text-[#e5e5e5]">{line.text}</span>
              </div>
            ))}

            {/* Currently typing line */}
            {currentLine < LINES.length && (
              <div>
                {currentLineData.prompt && (
                  <span className="text-[#f97316]">{">"} </span>
                )}
                <span className="text-[#e5e5e5]">{partialText}</span>
                <span
                  className="text-[#f97316]"
                  style={{ opacity: showCursor ? 1 : 0 }}
                >
                  █
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
