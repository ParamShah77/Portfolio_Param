import { motion } from "framer-motion";
import experience from "../../data/experience";

// Professional roles lead, campus leadership follows. Both are shown here now:
// filtering to type === "work" left a whole titled section rendering a single
// card, and hid the Placement Coordinator role — arguably the most
// recruiter-relevant item on the site — on /resume only.
const WORK = experience.filter((e) => e.type === "work");
const LEADERSHIP = experience.filter((e) => e.type === "leadership");

function ExperienceCard({ exp, badge }) {
  return (
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
          {badge && (
            <span className="mb-2 inline-block rounded-full bg-[#f97316]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#f97316]">
              {badge}
            </span>
          )}
          <h3 className="text-xl font-bold text-white">{exp.role}</h3>
          <p className="text-[#f97316]">{exp.organization}</p>
        </div>
        <div className="shrink-0 sm:text-right">
          <span className="block text-sm whitespace-nowrap text-[#9ca3af]">
            {exp.duration}
          </span>
          {exp.location && (
            /* was #6b7280 — 4.1:1 on this background, under the AA floor */
            <span className="block text-xs text-[#9ca3af]/80">
              {exp.location}
            </span>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {exp.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm leading-relaxed text-[#e5e5e5]/80"
          >
            <span aria-hidden="true" className="mt-0.5 text-[#f97316]">
              ▸
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Experience() {
  if (WORK.length === 0 && LEADERSHIP.length === 0) return null;

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
            Experience &amp; <span className="text-[#f97316]">Leadership</span>
          </h2>
          <p className="text-[#9ca3af]">
            Where I&apos;ve worked, and what I&apos;ve run on campus
          </p>
        </motion.div>

        <div className="space-y-6">
          {WORK.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} badge="Internship" />
          ))}
        </div>

        {LEADERSHIP.length > 0 && (
          <>
            <h3 className="mt-14 mb-6 text-sm font-semibold tracking-[0.2em] text-[#9ca3af] uppercase">
              Positions of Responsibility
            </h3>
            <div className="space-y-6">
              {LEADERSHIP.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
