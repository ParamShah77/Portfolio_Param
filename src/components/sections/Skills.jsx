import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import skills from "../../data/skills";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

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
      "Spring Boot",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Thymeleaf",
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
    items: getSkills([
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "GitHub",
      "Maven",
      "Linux",
    ]),
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

// 3D sphere geometry (Fibonacci lattice). Fixed for a given skills list, so
// it's computed once at module load rather than on every render.
const RADIUS = 160;
const POINTS = skills.map((skill, index) => {
  const phi = Math.acos(-1 + (2 * index) / skills.length);
  const theta = Math.sqrt(skills.length * Math.PI) * phi;

  return {
    x: RADIUS * Math.cos(theta) * Math.sin(phi),
    y: RADIUS * Math.sin(theta) * Math.sin(phi),
    z: RADIUS * Math.cos(phi),
    skill,
  };
});

export default function Skills() {
  const containerRef = useRef(null);
  const sphereRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  // One DOM node per skill, addressed by index — the animation writes
  // transforms straight to these instead of going through React.
  const nodeRefs = useRef([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let animationFrameId = null;
    let visible = true;

    /* Apply the rotation matrix and write the result to the DOM.
     *
     * This used to call setState on every frame, which re-rendered the whole
     * section — recomputing and re-sorting every point 60 times a second, for
     * as long as the page was open, whether or not the sphere was on screen.
     * Positioning the nodes directly keeps the maths but skips React entirely. */
    const applyRotation = () => {
      const sinX = Math.sin(currentRotation.current.x);
      const cosX = Math.cos(currentRotation.current.x);
      const sinY = Math.sin(currentRotation.current.y);
      const cosY = Math.cos(currentRotation.current.y);

      for (let i = 0; i < POINTS.length; i++) {
        const node = nodeRefs.current[i];
        if (!node) continue;
        const p = POINTS[i];

        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        const scale = Math.max((RADIUS + z2) / (RADIUS * 1.5), 0.4);
        const opacity = Math.max(0.2, (RADIUS + z2) / (RADIUS * 2));

        node.style.transform = `translate3d(${x2}px, ${y1}px, 0) scale(${scale})`;
        node.style.opacity = opacity;
        // zIndex stands in for depth sorting, so the DOM order never changes
        node.style.zIndex = Math.round(z2 + RADIUS);
      }
    };

    const animate = () => {
      currentRotation.current.y += mousePos.current.x * 0.00005 + 0.003;
      currentRotation.current.x += mousePos.current.y * 0.00005 + 0.001;
      applyRotation();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (reducedMotion) {
      // Lay the sphere out once, without spinning it.
      applyRotation();
      return;
    }

    // Only spin while the section is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && animationFrameId === null) {
          animationFrameId = requestAnimationFrame(animate);
        } else if (!visible && animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0 }
    );

    const target = sphereRef.current;
    if (target) observer.observe(target);
    applyRotation();

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance from centre influences rotation speed
    mousePos.current.x = e.clientX - centerX;
    mousePos.current.y = e.clientY - centerY;
  };

  const handleMouseLeave = () => {
    // Return to mild auto-rotation
    mousePos.current.x = 0;
    mousePos.current.y = 0;
  };

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
            <div
              ref={sphereRef}
              className="relative w-full h-full flex justify-center items-center"
            >
              {POINTS.map((p, i) => {
                const IconComp = p.skill.icon;
                return (
                  <div
                    key={p.skill.name}
                    ref={(el) => { nodeRefs.current[i] = el; }}
                    className="absolute group flex justify-center items-center"
                    title={p.skill.name}
                  >
                    <div className="relative flex flex-col items-center justify-center">
                      <IconComp
                        className="text-4xl drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                        style={{ color: p.skill.color || "#e5e5e5" }}
                        aria-hidden="true"
                      />
                      {/* Name label on hover */}
                      <span className="pointer-events-none absolute -bottom-6 rounded bg-black/85 px-2 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
