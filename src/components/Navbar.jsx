import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

function SparkleIcon({ className = "" }) {
  return (
    <svg 
      className={className} 
      width="1em" height="1em" 
      viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 3v0c.53 4.41 3.59 7.47 8 8v0c-4.41.53-7.47 3.59-8 8v0c-.53-4.41-3.59-7.47-8-8v0c4.41-.53 7.47-3.59 8-8v0z"/>
    </svg>
  );
}

// "Home" points at #hero — the actual top of the page. It used to point at
// #home, the second screen, which meant clicking Home left you 100vh down and
// no nav item was highlighted while the first screen was on show.
const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  // Escape closes the mobile menu and hands focus back to the button that
  // opened it, so keyboard users aren't stranded behind an open panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);

    // Coming from another route (e.g. /resume): navigate within the SPA and
    // scroll once the section exists. Setting window.location here would
    // throw away the app and re-download the whole bundle.
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: href } });
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle the scroll target handed over by a cross-route navigation above.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (location.pathname !== "/" || !target) return;

    // One frame so the freshly mounted sections are laid out and measurable.
    const raf = requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [location]);

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-[100] transition-all duration-300"
      style={{
        backgroundColor: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid #2a2a2a" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("#hero")}
          className="text-xl font-bold tracking-wider text-[#f97316]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          aria-label="Scroll to top"
        >
          PS
        </button>

        {/* Desktop links — tighter gap at md so the extra Experience link fits */}
        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors duration-300 ${
                activeSection === link.href.slice(1)
                  ? "text-[#f97316]"
                  : "text-[#9ca3af] hover:text-[#e5e5e5]"
              }`}
              aria-current={
                activeSection === link.href.slice(1) ? "true" : undefined
              }
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/resume"
            className={`text-sm font-medium transition-colors duration-300 ${
              location.pathname === "/resume"
                ? "text-[#f97316]"
                : "text-[#9ca3af] hover:text-[#e5e5e5]"
            }`}
          >
            Resume
          </Link>
          {/* Same weight as every other nav item. It used to carry a permanent
              glow and a pill background, which made the chatbot louder than
              the work it talks about. */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggleNexusChat"))}
            className="flex items-center gap-1.5 text-sm font-medium text-[#9ca3af] transition-colors duration-300 hover:text-[#f97316]"
          >
            <SparkleIcon className="text-base" /> NEXUS
          </button>
        </div>

        {/* Mobile hamburger */}
        {/* -mr-2 keeps the icon optically aligned while p-2 takes the tap
            target from 24px to 44px. */}
        <button
          ref={menuButtonRef}
          className="-mr-2 p-2 text-2xl text-[#e5e5e5] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-[#2a2a2a] bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-lg md:hidden overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full py-3 text-left text-sm font-medium transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? "text-[#f97316]"
                    : "text-[#9ca3af]"
                }`}
                aria-current={
                  activeSection === link.href.slice(1) ? "true" : undefined
                }
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/resume"
              className="block w-full py-3 text-left text-sm font-medium text-[#9ca3af] transition-colors duration-300 hover:text-[#f97316]"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new CustomEvent("toggleNexusChat"));
              }}
              className="flex w-full items-center gap-1.5 py-3 text-left text-sm font-medium text-[#9ca3af] transition-colors duration-300 hover:text-[#f97316]"
            >
              <SparkleIcon className="text-base" /> NEXUS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
