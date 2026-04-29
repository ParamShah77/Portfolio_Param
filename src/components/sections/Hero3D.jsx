import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Colour palette (matches orange portfolio theme)
───────────────────────────────────────────── */
const SKIN = "#c68642";
const SKIN_D = "#a0622a";   // darker – ears, shading
const ORANGE = "#f97316";
const ORANGE_D = "#c05a0c";
const WHITE = "#f5f5f5";
const DARK = "#111111";
const GREY = "#2a2a2a";
const HAT_W = "#e8e0d0";   // off-white cap

/* ─────────────────────────────────────────────
   Reusable part helpers
───────────────────────────────────────────── */
function Part({ geo, col, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, rough = 0.55, metal = 0 }) {
  return (
    <mesh position={pos} rotation={rot} scale={scale} castShadow>
      {geo}
      <meshStandardMaterial
        color={col}
        roughness={rough}
        metalness={metal}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Avatar — fully built from Three.js primitives
───────────────────────────────────────────── */
function Avatar({ mousePos, clicked }) {
  const groupRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const lEyeRef = useRef();
  const rEyeRef = useRef();
  const rArmRef = useRef();
  const bounceRef = useRef({ t: 0, active: false });

  /* idle float handled by <Float>, here we add mouse-look + click */
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!groupRef.current || !headRef.current) return;

    /* --- Mouse tracking: head tilts toward cursor --- */
    const targetRY = mousePos.current.x * 0.45;   // left/right
    const targetRX = mousePos.current.y * 0.25;   // up/down

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y, targetRY, 0.06
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x, targetRX, 0.06
    );

    /* --- Blinking eyes (every ~4 s) --- */
    const blink = Math.sin(t * 0.5) > 0.95 ? 0 : 1;
    if (lEyeRef.current) lEyeRef.current.scale.y = THREE.MathUtils.lerp(lEyeRef.current.scale.y, blink, 0.25);
    if (rEyeRef.current) rEyeRef.current.scale.y = THREE.MathUtils.lerp(rEyeRef.current.scale.y, blink, 0.25);

    /* --- Click bounce --- */
    if (bounceRef.current.active) {
      bounceRef.current.t += 0.18;
      const bounce = Math.sin(bounceRef.current.t) * 0.22 * Math.exp(-bounceRef.current.t * 0.35);
      groupRef.current.position.y = bounce;
      if (bounceRef.current.t > 18) {
        bounceRef.current.active = false;
        bounceRef.current.t = 0;
        groupRef.current.position.y = 0;
      }
    }

    /* --- Periodic Waving --- */
    if (rArmRef.current) {
      const cycle = t % 10; // 10 second cycle
      if (cycle < 2.5) {
        // Waving phase for 2.5 seconds
        // Raise arm to ~2.2 rads and oscillate
        const waveOscillation = Math.sin(t * 15) * 0.4;
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rArmRef.current.rotation.z, 2.2 + waveOscillation, 0.1
        );
      } else {
        // Resting phase
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rArmRef.current.rotation.z, 0, 0.08
        );
      }
    }
  });

  const handleClick = () => {
    bounceRef.current.active = true;
    bounceRef.current.t = 0;
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* ── BODY ── */}
      <group ref={bodyRef} position={[0, -1.55, 0]}>
        {/* Torso */}
        <Part
          geo={<cylinderGeometry args={[0.62, 0.72, 1.3, 32]} />}
          col={ORANGE}
          pos={[0, 0, 0]}
          rough={0.7}
        />
        {/* Neck */}
        <Part
          geo={<cylinderGeometry args={[0.22, 0.25, 0.35, 24]} />}
          col={SKIN}
          pos={[0, 0.82, 0]}
        />
        {/* Collar ring */}
        <Part
          geo={<torusGeometry args={[0.24, 0.045, 12, 32]} />}
          col={DARK}
          pos={[0, 0.72, 0]}
          rot={[Math.PI / 2, 0, 0]}
          rough={0.85}
        />
        {/* Left Arm (Screen Left) */}
        <Part geo={<sphereGeometry args={[0.38, 24, 24]} />} col={ORANGE} pos={[-0.82, 0.35, 0]} rough={0.7} />
        <Part geo={<cylinderGeometry args={[0.22, 0.2, 0.7, 20]} />} col={ORANGE} pos={[-1.08, -0.08, 0]} rot={[0, 0, 0.4]} rough={0.7} />
        <Part geo={<sphereGeometry args={[0.22, 20, 20]} />} col={SKIN} pos={[-1.3, -0.55, 0]} />

        {/* Right Arm (Screen Right) - Grouped for waving */}
        <group ref={rArmRef} position={[0.82, 0.35, 0]}>
          {/* Shoulder pivot */}
          <Part geo={<sphereGeometry args={[0.38, 24, 24]} />} col={ORANGE} pos={[0, 0, 0]} rough={0.7} />
          {/* Upper arm */}
          <Part geo={<cylinderGeometry args={[0.22, 0.2, 0.7, 20]} />} col={ORANGE} pos={[0.26, -0.43, 0]} rot={[0, 0, -0.4]} rough={0.7} />
          {/* Hand */}
          <Part geo={<sphereGeometry args={[0.22, 20, 20]} />} col={SKIN} pos={[0.48, -0.9, 0]} />
        </group>
      </group>

      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, -0.28, 0]}>
        {/* Main skull */}
        <Part
          geo={<sphereGeometry args={[0.72, 48, 48]} />}
          col={SKIN}
          pos={[0, 0, 0]}
          rough={0.55}
        />
        {/* Chin/jaw — slightly squarish */}
        <Part
          geo={<sphereGeometry args={[0.62, 32, 32]} />}
          col={SKIN}
          pos={[0, -0.18, 0.08]}
          rough={0.55}
        />

        {/* ── Ears ── */}
        <Part geo={<sphereGeometry args={[0.18, 20, 20]} />} col={SKIN_D} pos={[-0.72, 0, 0]} />
        <Part geo={<sphereGeometry args={[0.18, 20, 20]} />} col={SKIN_D} pos={[0.72, 0, 0]} />

        {/* ── Eyebrows (thick, slightly angled) ── */}
        <Part geo={<boxGeometry args={[0.28, 0.075, 0.08]} />} col={DARK} pos={[-0.22, 0.23, 0.68]} rot={[0, 0, 0.18]} />
        <Part geo={<boxGeometry args={[0.28, 0.075, 0.08]} />} col={DARK} pos={[0.22, 0.23, 0.68]} rot={[0, 0, -0.18]} />

        {/* ── Eyes ── */}
        {/* Sclera */}
        <mesh ref={lEyeRef} position={[-0.22, 0.1, 0.64]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color={WHITE} roughness={0.2} />
        </mesh>
        <mesh ref={rEyeRef} position={[0.22, 0.1, 0.64]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color={WHITE} roughness={0.2} />
        </mesh>
        {/* Iris */}
        <Part geo={<circleGeometry args={[0.08, 20]} />} col={DARK} pos={[-0.22, 0.1, 0.78]} />
        <Part geo={<circleGeometry args={[0.08, 20]} />} col={DARK} pos={[0.22, 0.1, 0.78]} />
        {/* Pupil glint */}
        <Part geo={<circleGeometry args={[0.03, 12]} />} col={WHITE} pos={[-0.19, 0.13, 0.79]} rough={0.1} />
        <Part geo={<circleGeometry args={[0.03, 12]} />} col={WHITE} pos={[0.25, 0.13, 0.79]} rough={0.1} />

        {/* ── Blushes ── */}
        <Part geo={<sphereGeometry args={[0.18, 16, 16]} />} col={ORANGE_D} pos={[-0.38, -0.08, 0.6]} rough={0.9} transparent opacity={0.45} />
        <Part geo={<sphereGeometry args={[0.18, 16, 16]} />} col={ORANGE_D} pos={[ 0.38, -0.08, 0.6]} rough={0.9} transparent opacity={0.45} />

        {/* ── Nose ── */}
        <Part geo={<sphereGeometry args={[0.09, 16, 16]} />} col={SKIN_D} pos={[0, -0.04, 0.72]} />
        {/* Nostrils */}
        <Part geo={<sphereGeometry args={[0.04, 12, 12]} />} col={SKIN_D} pos={[-0.07, -0.1, 0.7]} />
        <Part geo={<sphereGeometry args={[0.04, 12, 12]} />} col={SKIN_D} pos={[0.07, -0.1, 0.7]} />

        {/* ── Mouth — gritted smile ── */}
        <Part geo={<torusGeometry args={[0.16, 0.035, 10, 20, Math.PI]} />} col={DARK} pos={[0, -0.25, 0.62]} rot={[0.2, 0, 0]} />
        {/* Teeth row */}
        <Part geo={<boxGeometry args={[0.28, 0.06, 0.06]} />} col={WHITE} pos={[0, -0.22, 0.66]} rough={0.25} />

        {/* ── Stubble shadow (subtle) ── */}
        <Part geo={<sphereGeometry args={[0.38, 24, 24]} />} col={SKIN_D} pos={[0, -0.28, 0.38]} rough={0.9} />

        {/* ── CAP ── */}
        {/* Dome */}
        <Part
          geo={<sphereGeometry args={[0.74, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />}
          col={HAT_W}
          pos={[0, 0.08, 0]}
          rough={0.65}
        />
        {/* Brim */}
        <Part
          geo={<cylinderGeometry args={[0.9, 0.82, 0.09, 32]} />}
          col={HAT_W}
          pos={[0, -0.1, 0.22]}
          rot={[0.22, 0, 0]}
          rough={0.65}
        />
        {/* Cap button top */}
        <Part geo={<cylinderGeometry args={[0.07, 0.07, 0.07, 16]} />} col={GREY} pos={[0, 0.74, 0]} rough={0.5} />
        {/* Cap logo strip */}
        <Part geo={<boxGeometry args={[0.18, 0.12, 0.02]} />} col={ORANGE} pos={[0, 0.2, 0.72]} rough={0.4} />
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Orange glow orbs floating in background
───────────────────────────────────────────── */
function FloatingOrb({ pos, size, speed, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = pos[1] + Math.sin(clock.elapsedTime * speed) * 0.4;
    ref.current.position.x = pos[0] + Math.cos(clock.elapsedTime * speed * 0.7) * 0.2;
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.55} roughness={0.1} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Responsive Camera for Mobile
───────────────────────────────────────────── */
function ResponsiveCamera() {
  const { viewport, camera } = useThree();
  useFrame(() => {
    const aspect = viewport.width / viewport.height;
    let targetZ = 5.5;
    let targetY = 0.3;
    
    if (aspect < 1) {
      // For mobile (portrait), push camera further back so it scales down.
      targetZ = 5.5 + (1 - aspect) * 4.5; 
      // Lower the camera slightly so the avatar moves UP on the screen
      // leaving plenty of room for the text at the bottom.
      targetY = 0.1; 
    }
    
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
  });
  return null;
}

/* ─────────────────────────────────────────────
   Scene wrapper
───────────────────────────────────────────── */
function Scene({ mousePos, clicked }) {
  return (
    <>
      <ResponsiveCamera />
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#fff8f0" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#f97316" />
      <pointLight position={[0, -2, 3]} intensity={0.8} color="#f97316" distance={8} />

      {/* Background orbs */}
      <FloatingOrb pos={[-2.8, 1.2, -2]} size={0.18} speed={0.5} color="#f97316" />
      <FloatingOrb pos={[2.6, -0.8, -3]} size={0.24} speed={0.38} color="#fb923c" />
      <FloatingOrb pos={[1.4, 2.2, -4]} size={0.13} speed={0.72} color="#f97316" />
      <FloatingOrb pos={[-1.8, -1.4, -2]} size={0.1} speed={0.6} color="#fdba74" />

      {/* Avatar wrapped in gentle idle float */}
      <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.35}>
        <Avatar mousePos={mousePos} clicked={clicked} />
      </Float>

      <Environment preset="night" />
    </>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────── */
export default function Hero3D() {
  const mousePos = useRef({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  /* fade + lift on scroll */
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const translateY = useTransform(scrollY, [0, 400], [0, -80]);

  /* normalise mouse coords [-1, 1] */
  const handleMouseMove = (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    mousePos.current = {
      x: (e.clientX / w - 0.5) * 2,
      y: (e.clientY / h - 0.5) * 2,
    };
  };

  /* touch support for mobile */
  const handleTouchMove = (e) => {
    const t = e.touches[0];
    const { innerWidth: w, innerHeight: h } = window;
    mousePos.current = {
      x: (t.clientX / w - 0.5) * 2,
      y: (t.clientY / h - 0.5) * 2,
    };
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl tracking-wide px-8 py-4 leading-normal"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              background: "linear-gradient(to right, #ffeedb, #f97316, #fb923c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 20px rgba(249,115,22,0.6))"
            }}
          >
            Param Shah
          </h1>
        </motion.div>

      </div>

      {/* ── Three.js Canvas ── */}
      <div className="h-screen w-full">
        <Canvas
          shadows
          camera={{ position: [0, 0.3, 5.5], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene mousePos={mousePos} clicked={clicked} />
          </Suspense>
        </Canvas>
      </div>
    </motion.section>
  );
}
