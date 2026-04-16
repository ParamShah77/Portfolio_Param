import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiDownload,
  FiExternalLink,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import projects from "../data/projects";
import experience from "../data/experience";

const SKILLS_DATA = {
  Languages: ["Java", "Python", "JavaScript", "C", "HTML5", "CSS3", "PHP"],
  "Frameworks & Libraries": [
    "React.js",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Tailwind CSS",
  ],
  Databases: ["MySQL", "MongoDB", "PostgreSQL"],
  "Core Concepts": [
    "Machine Learning",
    "REST APIs",
    "Git/GitHub",
    "NumPy",
    "Pandas",
    "NLP",
    "Data Structures",
    "Algorithms",
  ],
};

const CERTIFICATIONS = [
  "Google Cloud Computing Foundations — Google Cloud",
  "Machine Learning Specialization — Coursera (Andrew Ng)",
  "DSA Self-Paced — GeeksforGeeks",
  "Responsive Web Design — freeCodeCamp",
];

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 border-b border-[#2a2a2a]"
        style={{
          backgroundColor: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#9ca3af] transition-colors duration-300 hover:text-[#f97316]"
            aria-label="Go back to home"
          >
            <FiArrowLeft />
            Back
          </Link>
          <h1 className="hidden text-sm font-semibold text-white sm:block">
            Param Nikhil Shah — Resume
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-1.5 rounded-lg border border-[#f97316] px-4 py-2 text-xs font-medium text-[#f97316] transition-all duration-300 hover:bg-[#f97316]/10"
              aria-label="Download resume as PDF"
            >
              <FiDownload />
              Download PDF
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] px-4 py-2 text-xs font-medium text-[#9ca3af] transition-all duration-300 hover:border-[#9ca3af] hover:text-white"
              aria-label="View resume in new tab"
            >
              <FiExternalLink />
              View in New Tab
            </a>
          </div>
        </div>
      </div>

      {/* Resume content */}
      <div className="mx-auto max-w-[900px] px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-extrabold text-white">
            Param Nikhil Shah
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#9ca3af]">
            {/* <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="Phone number"
            >
              <FiPhone className="text-[#f97316]" />
              +91 XXXXXXXXXX
            </a> */}
            <a
              href="mailto:param.shah23@spit.ac.in"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="Email"
            >
              <FiMail className="text-[#f97316]" />
              param.shah23@spit.ac.in
            </a>
            <a
              href="https://www.linkedin.com/in/param-shah-405877290/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="LinkedIn profile"
            >
              <FaLinkedin className="text-[#f97316]" />
              LinkedIn
            </a>
            <a
              href="https://github.com/ParamShah77"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="GitHub profile"
            >
              <FaGithub className="text-[#f97316]" />
              GitHub
            </a>
            <a
              href="https://leetcode.com/u/paramshah0070/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="LeetCode profile"
            >
              <SiLeetcode className="text-[#f97316]" />
              LeetCode
            </a>
          </div>
        </motion.div>

        {/* Education */}
        <ResumeSection title="Education">
          <div
            className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Sardar Patel Institute of Technology (SPIT)
                </h4>
                <p className="text-sm text-[#9ca3af]">
                  B.E. Computer Engineering • Minor in IoT
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#f97316]">GPA: 8.20</p>
                <p className="text-xs text-[#9ca3af]">Aug 2023 – Present</p>
              </div>
            </div>
          </div>
        </ResumeSection>

        {/* Projects */}
        <ResumeSection title="Projects">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5"
              >
                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h4 className="font-bold text-white">{project.name}</h4>
                  <span className="text-xs text-[#9ca3af]">
                    {project.date}
                  </span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-[#e5e5e5]/80">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-[#f97316]/40 bg-[#f97316]/5 px-2 py-0.5 text-[10px] text-[#f97316]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Skills */}
        <ResumeSection title="Skills">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(SKILLS_DATA).map(([category, items]) => (
              <div key={category} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <h4 className="mb-3 text-sm font-semibold text-[#f97316]">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs text-[#e5e5e5]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Certifications */}
        <ResumeSection title="Certifications & Achievements">
          <ul className="space-y-2">
            {CERTIFICATIONS.map((cert, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#e5e5e5]/80">
                <span className="mt-0.5 text-[#f97316]">▸</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </ResumeSection>

        {/* Positions of Responsibility */}
        <ResumeSection title="Positions of Responsibility">
          <div className="space-y-4">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5"
                style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}
              >
                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="font-bold text-white">{exp.role}</h4>
                    <p className="text-sm text-[#f97316]">
                      {exp.organization}
                    </p>
                  </div>
                  <span className="text-xs text-[#9ca3af]">
                    {exp.duration}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#e5e5e5]/80">
                      <span className="mt-0.5 text-[#f97316]">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>
      </div>
    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h3 className="mb-5 border-b border-[#2a2a2a] pb-2 text-xl font-bold text-[#f97316]">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
