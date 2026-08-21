import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiArrowUp } from "react-icons/fi";

const SOCIALS = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/param-shah-405877290/",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/ParamShah77",
  },
  {
    name: "LeetCode",
    icon: SiLeetcode,
    url: "https://leetcode.com/u/ParamShah070/",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-[#2a2a2a] bg-[#0a0a0a] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8 lg:gap-12">
          {/* Brand & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <button
              onClick={scrollToTop}
              className="mb-6 text-2xl font-bold tracking-wider text-[#f97316]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              aria-label="Scroll to top"
            >
              PS
            </button>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#9ca3af]">
              Final-year Computer Engineering student at SPIT Mumbai. Building full-stack and AI systems — open to SDE and ML roles from mid-2027.
            </p>
            <div className="flex gap-4">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#141414] text-[#e5e5e5] transition-all duration-300 hover:border-[#f97316] hover:bg-[#f97316]/10 hover:text-[#f97316]"
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <Icon className="text-lg" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-[#9ca3af] transition-colors hover:text-[#f97316]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Get in Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:paramshah0070@gmail.com"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f97316]"
                >
                  paramshah0070@gmail.com
                </a>
              </li>
              <li className="text-sm text-[#9ca3af]">
                Mumbai, India
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between border-t border-[#1a1a1a] pt-8 sm:flex-row"
        >
          <p className="mb-4 text-sm text-[#9ca3af] sm:mb-0">
            © {new Date().getFullYear()} Param Shah. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-[#9ca3af] transition-colors hover:text-[#f97316]"
            aria-label="Back to top"
          >
            Back to Top <FiArrowUp />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
