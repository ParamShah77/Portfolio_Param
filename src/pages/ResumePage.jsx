import { Link } from "react-router-dom";
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
import skills from "../data/skills";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Build resume skills from the shared skills data source
const SKILLS_DATA = (() => {
  const categoryMap = {
    Languages: ["Java", "Python", "JavaScript", "C", "HTML", "CSS"],
    "Frameworks & Libraries": [
      "React.js",
      "Spring Boot",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Thymeleaf",
      "REST API",
      "Tailwind CSS",
      "NumPy",
      "Pandas",
    ],
    "Databases & Tools": [
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Maven",
      "Linux",
    ],
    "Core Concepts": [
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "Operating Systems",
      "Computer Networks",
      "Agile Development",
      "Database Management Systems",
      "NLP",
      "Machine Learning",
    ],
  };
  // Validate that listed skills actually exist in the shared data
  const knownNames = new Set(skills.map((s) => s.name));
  const normalized = (name) => {
    if (name === "HTML") return "HTML5";
    if (name === "CSS") return "CSS3";
    if (name === "Data Structures and Algorithms") return "Data Structures";
    return name;
  };
  for (const [, items] of Object.entries(categoryMap)) {
    items.forEach((item) => {
      const norm = normalized(item);
      // Authoring aid only — never warn real visitors in production.
      if (import.meta.env.DEV && !knownNames.has(norm)) {
        console.warn(
          `Resume page skill "${item}" is missing from the technical skills database.`,
        );
      }
    });
  }
  return categoryMap;
})();

const WORK = experience.filter((e) => e.type === "work");
const LEADERSHIP = experience.filter((e) => e.type !== "work");

const CERTIFICATIONS = [
  "SCOPE - Certification by JP Morgan Chase in Agile methodology and Cloud — Aug 2024 – Present",
  "JEE - Secured a rank of 33.1k across India in JEE-Mains and qualified for JEE Advanced — Jun 2023",
  "Google Cloud Computing Foundations — Google Cloud",
  "Machine Learning Specialization — Coursera (Andrew Ng)",
  "DSA Self-Paced — GeeksforGeeks",
  "Responsive Web Design — freeCodeCamp",
];

export default function ResumePage() {
  useDocumentTitle(
    "Resume | Param Nikhil Shah",
    "Resume of Param Nikhil Shah — final-year Computer Engineering student at SPIT Mumbai, former Barclays Technology Intern. Experience, projects, skills, and certifications."
  );

  return (
    // relative z-10 to sit above the fixed BackgroundCanvas (z-0), the same
    // way every section on the main page does. Without it the particle field
    // paints over the resume text.
    <div className="relative z-10 min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
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
          <h1 className="sr-only text-sm font-semibold text-white sm:not-sr-only sm:block">
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
        <div className="fade-up mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-white">
            Param Nikhil Shah
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#9ca3af]">
            <a
              href="tel:+917447780270"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="Phone number"
            >
              <FiPhone className="text-[#f97316]" />
              +91 74477 80270
            </a>
            <a
              href="mailto:paramshah0070@gmail.com"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="Email"
            >
              <FiMail className="text-[#f97316]" />
              paramshah0070@gmail.com
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
              href="https://leetcode.com/u/ParamShah070/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#f97316]"
              aria-label="LeetCode profile"
            >
              <SiLeetcode className="text-[#f97316]" />
              LeetCode
            </a>
          </div>
        </div>

        {/* Education */}
        <ResumeSection title="Education">
          <div
            className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Sardar Patel Institute of Technology (S.P.I.T.)
                </h4>
                <p className="text-sm text-[#9ca3af]">
                  Bachelors of Computer Engineering • Minor in Internet of Things
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#f97316]">CGPA: 8.29</p>
                <p className="text-xs text-[#9ca3af]">Aug 2023 – 2027 (expected)</p>
              </div>
            </div>
          </div>
        </ResumeSection>

        {/* Experience */}
        {WORK.length > 0 && (
          <ResumeSection title="Experience">
            <div className="space-y-4">
              {WORK.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          </ResumeSection>
        )}

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
                {project.bullets && project.bullets.length > 0 ? (
                  <ul className="mb-3 space-y-2">
                    {project.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#e5e5e5]/80">
                        <span className="mt-0.5 text-[#f97316]">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-3 text-sm leading-relaxed text-[#e5e5e5]/80">
                    {project.description}
                  </p>
                )}
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
          <div className="space-y-4 rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
            {Object.entries(SKILLS_DATA).map(([category, items]) => (
              <div
                key={category}
                className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 pb-4 border-b border-[#2a2a2a]/40 last:border-0 last:pb-0"
              >
                <h4 className="w-full shrink-0 text-sm font-bold text-[#f97316] sm:w-[200px]">
                  {category}:
                </h4>
                <p className="text-sm leading-relaxed text-[#e5e5e5]/90">
                  {items.join(", ")}
                </p>
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
            {LEADERSHIP.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </ResumeSection>
      </div>
    </div>
  );
}

function ExperienceCard({ exp }) {
  return (
    <div
      className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5"
      style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}
    >
      <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <div>
          <h4 className="font-bold text-white">{exp.role}</h4>
          <p className="text-sm text-[#f97316]">{exp.organization}</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="block text-xs text-[#9ca3af]">{exp.duration}</span>
          {exp.location && (
            <span className="block text-xs text-[#6b7280]">{exp.location}</span>
          )}
        </div>
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
  );
}

function ResumeSection({ title, children }) {
  return (
    <div className="fade-up mb-10">
      <h3 className="mb-5 border-b border-[#2a2a2a] pb-2 text-xl font-bold text-[#f97316]">
        {title}
      </h3>
      {children}
    </div>
  );
}
