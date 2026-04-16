import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  "B.Tech Computer Engineering Student",
  "Full Stack Developer",
  "AIML Enthusiast",
  "Competitive Programmer",
];

/*
 * Photo rotation: Vite's import.meta.glob eagerly imports all images
 * from /src/assets/images/. Drop photo1.jpg, photo2.jpg, etc. into
 * that folder and they will automatically appear in the rotation.
 */
const imageModules = import.meta.glob(
  "/src/assets/images/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Collect image paths from the glob
  const photos = useMemo(
    () => Object.values(imageModules),
    []
  );

  // Typewriter effect
  useEffect(() => {
    const current = ROLES[roleIndex];
    let timer;

    if (!isDeleting && displayText.length < current.length) {
      timer = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length + 1));
      }, 60);
    } else if (!isDeleting && displayText.length === current.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length - 1));
      }, 30);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  // Photo rotation — cycle every 4 seconds
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const hasPhotos = photos.length > 0;

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen items-center pt-20"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Hello World tag */}
          <p
            className="mb-3 text-sm tracking-widest text-[#f97316]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {"< Hello People />"}
          </p>

          {/* Name */}
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Param Nikhil Shah
          </h1>

          {/* Animated role */}
          <div className="mb-6 flex h-8 items-center text-lg text-[#fb923c] md:text-xl">
            <span>{displayText}</span>
            <span className="terminal-cursor ml-0.5 text-[#f97316]">|</span>
          </div>

          {/* Summary */}
          <p className="mb-6 max-w-lg leading-relaxed text-[#9ca3af]">
            3rd-year Computer Engineering student at SPIT, Mumbai with a minor
            in IoT. I build full-stack systems that bridge software engineering,
            machine learning, and real-world problem solving. Passionate about
            creating things that actually work.
          </p>

          {/* Education card */}
          <div
            className="mb-8 max-w-md rounded-lg border border-[#2a2a2a] border-l-[#f97316] bg-[#1a1a1a] p-4"
            style={{ borderLeftWidth: "3px" }}
          >
            <p className="font-semibold text-white">
              Sardar Patel Institute of Technology (SPIT)
            </p>
            <p className="text-sm text-[#9ca3af]">
              B.E. Computer Engineering • Minor in IoT
            </p>
            <p className="mt-1 text-sm text-[#9ca3af]">
              GPA: 8.20 • Aug 2023 – Present
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                document
                  .querySelector("#projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#fb923c] hover:shadow-lg hover:shadow-orange-500/20"
              aria-label="View projects"
            >
              View Projects
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#f97316] px-6 py-3 text-sm font-semibold text-[#f97316] transition-all duration-300 hover:bg-[#f97316]/10"
              aria-label="Download resume"
            >
              Download Resume
            </a>
          </div>
        </motion.div>

        {/* Right column — Photo */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 60px rgba(249,115,22,0.15)",
              }}
            />

            {/* Photo display or placeholder */}
            <div className="relative h-64 w-64 overflow-hidden rounded-full md:h-80 md:w-80 lg:h-[400px] lg:w-[400px]">
              {hasPhotos ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={photos[photoIndex]}
                    alt={`Param Shah photo ${photoIndex + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
              ) : (
                <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-[#f97316]/50 bg-[#141414] text-center text-sm text-[#9ca3af]">
                  <span className="px-6">
                    Add your photos to
                    <br />
                    <span className="text-[#f97316]">/assets/images/</span>
                  </span>
                </div>
              )}
            </div>

            {/* Location badge */}
            <div className="absolute -right-2 bottom-4 rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-1.5 text-xs text-[#e5e5e5] shadow-lg md:bottom-8">
              📍 Mumbai, India
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
