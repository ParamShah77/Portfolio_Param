import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

// This plays on every visit, so it has to be short. Three typed lines and a
// bar that genuinely fills — the old version typed a pre-filled "100% loaded"
// bar character by character, which cost ~2s to render something fake.
const LINES = [
  { prompt: true, text: "initializing Param Shah..." },
  { prompt: true, text: "B.Tech Computer Engineering @ SPIT Mumbai" },
  { bar: true },
  { prompt: true, text: "Welcome." },
];

const TYPE_SPEED = 16; // ms per character
const LINE_PAUSE = 220; // ms between lines
const BAR_DURATION = 850; // ms for the progress bar to fill
const BAR_SEGMENTS = 20;
const HOLD_AFTER = 400; // ms on the finished frame before fading out

/** Block-character progress bar that actually fills, driven by `value` (0..1). */
function ProgressBar({ value }) {
  const filled = Math.round(value * BAR_SEGMENTS);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#f97316]">{">"} </span>
      <span className="tracking-[0.05em] text-[#f97316]">
        {"█".repeat(filled)}
        <span className="text-[#2a2a2a]">
          {"█".repeat(BAR_SEGMENTS - filled)}
        </span>
      </span>
      <span className="tabular-nums text-[#9ca3af]">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState("particles"); // particles | terminal | fadeout | done
  const canvasRef = useRef(null);
  const terminalRef = useRef(null);
  const [typedLines, setTypedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [barProgress, setBarProgress] = useState(0);
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
    const EXPLODE_DURATION = 1000;
    const IMPLODE_START = 700;

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

      if (elapsed < EXPLODE_DURATION + 150) {
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
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.4)" }
      );
    }
  }, [phase]);

  // Progress bar fill — runs when the current line is the bar, then advances.
  useEffect(() => {
    if (phase !== "terminal") return;
    const line = LINES[currentLine];
    if (!line || !line.bar) return;

    let raf;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / BAR_DURATION, 1);
      setBarProgress(t);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        phaseTimerRef.current = setTimeout(() => {
          setTypedLines((prev) => [...prev, { ...line, done: true }]);
          setCurrentLine((l) => l + 1);
          setCurrentChar(0);
        }, LINE_PAUSE);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [phase, currentLine]);

  // Typing logic
  useEffect(() => {
    if (phase !== "terminal") return;
    if (currentLine >= LINES.length) {
      // All lines done — brief hold, then fade out
      phaseTimerRef.current = setTimeout(() => {
        setPhase("fadeout");
      }, HOLD_AFTER);
      return;
    }

    const line = LINES[currentLine];
    if (line.bar) return; // handled by the bar effect above
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

  // Cursor blink — gated on the terminal phase; it previously had no
  // dependency and kept toggling state every 500ms through every phase.
  useEffect(() => {
    if (phase !== "terminal") return;
    const interval = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(interval);
  }, [phase]);

  // Fade out
  useEffect(() => {
    if (phase !== "fadeout") return;
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setPhase("done");
          onComplete();
        },
      });
    }
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const currentLineData = LINES[currentLine];
  const partialText =
    currentLineData && currentLineData.text
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
            {/* Already finished lines */}
            {typedLines.map((line, i) =>
              line.bar ? (
                <ProgressBar key={i} value={1} />
              ) : (
                <div key={i}>
                  {line.prompt && (
                    <span className="text-[#f97316]">{">"} </span>
                  )}
                  <span className="text-[#e5e5e5]">{line.text}</span>
                </div>
              ),
            )}

            {/* The line in progress — either filling or typing */}
            {currentLine < LINES.length &&
              (currentLineData.bar ? (
                <ProgressBar value={barProgress} />
              ) : (
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
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
