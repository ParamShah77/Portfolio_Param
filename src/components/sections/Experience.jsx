import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import experience from "../../data/experience";

export default function Experience() {
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
            <span className="text-[#f97316]">Experience</span> & Leadership
          </h2>
          <p className="text-[#9ca3af]">
            Roles and responsibilities I&apos;ve held
          </p>
        </motion.div>

        <div className="relative">
          {experience.map((exp, index) => (
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
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-[#f97316]">{exp.organization}</p>
                  </div>
                  <span className="text-sm text-[#9ca3af] whitespace-nowrap">
                    {exp.duration}
                  </span>
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
              {index < experience.length - 1 && (
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
