import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  // Suppress the native cursor only while this component is actually mounted,
  // so unmounting (narrow window, touch device) always restores it.
  useEffect(() => {
    document.body.classList.add("has-custom-cursor");
    return () => document.body.classList.remove("has-custom-cursor");
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    const handleOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isClickable =
        tag === "a" ||
        tag === "button" ||
        e.target.closest("a") ||
        e.target.closest("button") ||
        e.target.style.cursor === "pointer" ||
        e.target.getAttribute("role") === "button";
      if (isClickable) setHovering(true);
    };

    const handleOut = () => setHovering(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    // Ring lerp animation
    let animId;
    const lerp = (a, b, f) => a + (b - a) * f;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  const dotSize = hovering ? 12 : 8;
  const ringSize = hovering ? 52 : 36;
  const scale = clicking ? 0.7 : 1;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[99999] rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: "#f97316",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: "width 0.3s, height 0.3s, transform 0.15s",
          opacity: hovering ? 1 : 0.9,
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[99998] rounded-full"
        style={{
          width: ringSize,
          height: ringSize,
          border: "2px solid #f97316",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition:
            "width 0.3s, height 0.3s, opacity 0.3s, transform 0.15s",
          opacity: hovering ? 1 : 0.5,
        }}
      />
    </>
  );
}
