import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import experience from "../../data/experience";

// Only professional roles are featured here. The campus leadership positions
// are still listed on /resume under Positions of Responsibility.
const WORK = experience.filter((e) => e.type === "work");

export default function Experience() {
  if (WORK.length === 0) return null;

  return (
    <section id="experience" className="relative z-10 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Work <span className="text-[#f97316]">Experience</span>
          </h2>
          <p className="text-[#9ca3af]">
            Where I&apos;ve worked and what I built there
          </p>
        </motion.div>

        <div className="relative">
          {WORK.map((exp, index) => (
            <div key={exp.id}>
              {/* Experience card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6"
                style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}
              >
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    {exp.type === "work" && (
                      <span className="mb-2 inline-block rounded-full bg-[#f97316]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#f97316]">
                        Internship
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-[#f97316]">{exp.organization}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <span className="block text-sm text-[#9ca3af] whitespace-nowrap">
                      {exp.duration}
                    </span>
                    {exp.location && (
                      <span className="block text-xs text-[#6b7280]">
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-4 space-y-3">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[#e5e5e5]/80">
                      <span className="mt-0.5 text-[#f97316]">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Connector between cards */}
              {index < WORK.length - 1 && (
                <div className="flex flex-col items-center py-6">
                  <div className="h-12 w-px border-l border-dashed border-[#2a2a2a]" />
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="text-[#f97316]"
                  >
                    <FiChevronDown className="text-xl" />
                  </motion.div>
                  <div className="h-12 w-px border-l border-dashed border-[#2a2a2a]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
