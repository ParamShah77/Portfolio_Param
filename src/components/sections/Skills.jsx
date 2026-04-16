import { motion } from "framer-motion";
import skills from "../../data/skills";
import "./Skills.css"; // We will create this for the keyframes

export default function Skills() {
  // Split skills into two rows for a dynamic look
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  // 4 sets to ensure smooth seamless scrolling across ultra-wide monitors
  const extendedRow1 = [...row1, ...row1, ...row1, ...row1];
  const extendedRow2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <section id="skills" className="relative z-10 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            <span className="text-[#f97316]">Skills</span> & Technologies
          </h2>
          <p className="text-[#9ca3af] text-lg mt-4">
            The arsenal I use to build scalable, high-performance applications
          </p>
        </motion.div>

        {/* Carousel Container with gradient mask for smooth fading on edges */}
        <div className="carousel-mask relative flex flex-col gap-6 py-8">
          
          {/* Row 1: Scrolling Left */}
          <div className="flex w-[200%] gap-6 animate-scroll-left">
            {extendedRow1.map((skill, index) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={`r1-${skill.name}-${index}`}
                  className="group flex h-[100px] w-[180px] flex-shrink-0 flex-col items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#f97316] hover:bg-[#202020] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                >
                  <IconComp 
                    className="mb-3 text-4xl text-[#e5e5e5] transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]" 
                    style={{ color: skill.color || '#e5e5e5' }}
                  />
                  <span className="text-sm font-medium tracking-wide text-[#9ca3af] group-hover:text-white transition-colors duration-300">
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex w-[200%] justify-end gap-6 animate-scroll-right">
            {extendedRow2.map((skill, index) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={`r2-${skill.name}-${index}`}
                  className="group flex h-[100px] w-[180px] flex-shrink-0 flex-col items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#f97316] hover:bg-[#202020] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                >
                  <IconComp 
                    className="mb-3 text-4xl text-[#e5e5e5] transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: skill.color || '#e5e5e5' }}
                  />
                  <span className="text-sm font-medium tracking-wide text-[#9ca3af] group-hover:text-white transition-colors duration-300">
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      {/* Background ambient light for the section */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-[#f97316] opacity-5 blur-[100px]"></div>
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-[#f97316] opacity-5 blur-[100px]"></div>
    </section>
  );
}
