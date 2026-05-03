import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import projects from "../../data/projects";

export default function Projects() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const project = projects[current];
  const isEven = current % 2 === 1;

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % projects.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section id="projects" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Featured <span className="text-[#f97316]">Projects</span>
          </h2>
          <p className="text-[#9ca3af]">
            Things I've built and worked on
          </p>
        </motion.div>

        {/* Project card */}
        <div className="relative min-h-[420px] overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={project.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -500) {
                  next();
                } else if (offset.x > 50 || velocity.x > 500) {
                  prev();
                }
              }}
              className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 touch-pan-y active:cursor-grabbing ${isEven ? "md:direction-rtl" : ""
                }`}
            >
              {/* Text side */}
              <div className={isEven ? "md:order-2" : "md:order-1"}>
                <h3 className="mb-2 text-2xl font-bold text-[#f97316]">
                  {project.name}
                </h3>
                <p className="mb-4 text-sm text-[#9ca3af]">{project.date}</p>
                <p className="mb-6 leading-relaxed text-[#e5e5e5]/80">
                  {project.description}
                </p>

                {/* Tech stack pills */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-[#f97316]/50 bg-[#1a1a1a] px-3 py-1 text-xs text-[#f97316]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#f97316] transition-colors duration-300 hover:text-[#fb923c]"
                      aria-label={`View source code for ${project.name}`}
                    >
                      <FaGithub />
                      {"< Source Code >"}
                    </a>
                  )}
                </div>
              </div>

              {/* Image side */}
              <div className={isEven ? "md:order-1" : "md:order-2"}>
                {project.deployed ? (
                  <a
                    href={project.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-xl"
                    aria-label={`Go to ${project.name} live project`}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-auto max-h-[320px] w-full rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 text-lg font-semibold text-white">
                        Go to Project <FiExternalLink />
                      </span>
                    </div>
                  </a>
                ) : (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-auto max-h-[320px] w-full rounded-xl object-cover shadow-lg"
                    loading="lazy"
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#141414] text-[#e5e5e5] transition-all duration-300 hover:border-[#f97316] hover:text-[#f97316]"
              aria-label="Previous project"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#141414] text-[#e5e5e5] transition-all duration-300 hover:border-[#f97316] hover:text-[#f97316]"
              aria-label="Next project"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === current
                  ? "scale-125 bg-[#f97316]"
                  : "bg-[#2a2a2a] hover:bg-[#9ca3af]"
                  }`}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
