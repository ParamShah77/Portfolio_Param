import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import skills from "../../data/skills";

// Helper to filter skills securely
const getSkills = (names) => skills.filter((s) => names.includes(s.name));

const categories = [
  {
    title: "Languages",
    items: getSkills(["Java", "Python", "JavaScript", "C", "HTML5", "CSS3"]),
  },
  {
    title: "Frameworks & Libs",
    items: getSkills([
      "React.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Tailwind CSS",
      "NumPy",
      "Pandas",
      "REST API",
    ]),
  },
  {
    title: "AI & Simulations",
    items: getSkills([
      "Machine Learning",
      "NLP",
      "XGBoost",
      "DoWhy",
      "AutoGen",
      "Monte Carlo",
      "Scikit-learn",
      "Gemini API",
    ]),
  },
  {
    title: "Databases & Tools",
    items: getSkills(["MySQL", "MongoDB", "PostgreSQL", "Git", "GitHub"]),
  },
  {
    title: "Core Concepts",
    items: getSkills([
      "Data Structures",
      "Algorithms",
      "Object-Oriented Programming",
      "Operating Systems",
      "Computer Networks",
      "Agile Development",
      "Database Management Systems",
    ]),
  },
];

export default function Skills() {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // 3D Sphere Mathematics (Fibonacci lattice)
  const RADIUS = 160; // Size of the sphere
  const N = skills.length;

  const points = skills.map((skill, index) => {
    const phi = Math.acos(-1 + (2 * index) / N);
    const theta = Math.sqrt(N * Math.PI) * phi;

    return {
      x: RADIUS * Math.cos(theta) * Math.sin(phi),
      y: RADIUS * Math.sin(theta) * Math.sin(phi),
      z: RADIUS * Math.cos(phi),
      skill,
    };
  });

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      // Auto rotate slowly, plus mouse interaction
      currentRotation.current.y += (mousePos.current.x * 0.00005) + 0.003;
      currentRotation.current.x += (mousePos.current.y * 0.00005) + 0.001;

      setRotation({
        x: currentRotation.current.x,
        y: currentRotation.current.y,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center to influence rotation
    mousePos.current.x = e.clientX - centerX;
    mousePos.current.y = e.clientY - centerY;
  };

  const handleMouseLeave = () => {
    // Return to mild auto-rotation
    mousePos.current.x = 0;
    mousePos.current.y = 0;
  };

  // 3D Rotation Matrix Application
  const getTransformedPoints = () => {
    const sinX = Math.sin(rotation.x);
    const cosX = Math.cos(rotation.x);
    const sinY = Math.sin(rotation.y);
    const cosY = Math.cos(rotation.y);

    return points.map((p) => {
      // Rotate around X axis
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      // Rotate around Y axis
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      // Depth perspective (simple z-sorting scaling)
      const scale = (RADIUS + z2) / (RADIUS * 1.5);
      const opacity = Math.max(0.2, (RADIUS + z2) / (RADIUS * 2));

      return {
        ...p,
        projX: x2,
        projY: y1,
        projZ: z2,
        scale,
        opacity,
      };
    }).sort((a, b) => a.projZ - b.projZ); // Sort by Z so items in front are on top
  };

  const activePoints = getTransformedPoints();

  return (
    <section id="skills" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            <span className="text-[#f97316]">Technical</span> Arsenal
          </h2>
          <p className="text-[#9ca3af] text-lg mt-4">
            A comprehensive overview of my technological stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">

          {/* Left Side: 3D Interactive Sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center h-[350px] sm:h-[450px]"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full h-full flex justify-center items-center">
              {activePoints.map((p, i) => {
                const IconComp = p.skill.icon;
                return (
                  <div
                    key={p.skill.name}
                    className="absolute transition-colors duration-300 group flex justify-center items-center"
                    style={{
                      transform: `translate3d(${p.projX}px, ${p.projY}px, 0) scale(${Math.max(p.scale, 0.4)})`,
                      opacity: p.opacity,
                      zIndex: Math.round(p.projZ + RADIUS),
                    }}
                  >
                    <div className="relative flex flex-col items-center justify-center">
                      <IconComp
                        className="text-4xl text-[#e5e5e5] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-colors duration-300"
                        style={{ color: p.skill.color || "#e5e5e5" }}
                      />
                      {/* Name tooltip shows only on items directly in front and hovered */}
                      <span
                        className={`absolute -bottom-6 text-xs font-bold text-white whitespace-nowrap bg-black/80 px-2 py-1 rounded transition-opacity duration-300 ${p.projZ > RADIUS * 0.5 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
                      >
                        {p.skill.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side: Categorized Legend */}
          <div className="space-y-8 pl-0 lg:pl-10 relative">
            <div className="absolute left-0 lg:left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#2a2a2a] to-transparent hidden lg:block"></div>

            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <h3 className="text-xl font-semibold text-[#f97316] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f97316] hidden lg:block absolute -left-[38px]"></div>
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <span
                      key={`leg-${skill.name}`}
                      className="px-3 py-1.5 text-sm rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] flex items-center gap-2 transition-colors duration-300 hover:border-[#f97316] hover:bg-[#1f1a16]"
                    >
                      <skill.icon style={{ color: skill.color || "#e5e5e5" }} />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#f97316] opacity-5 blur-[120px]"></div>
    </section>
  );
}
