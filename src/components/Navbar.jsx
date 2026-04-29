import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors duration-300 ${
                activeSection === link.href.slice(1)
                  ? "text-[#f97316]"
                  : "text-[#9ca3af] hover:text-[#e5e5e5]"
              }`}
              aria-label={`Navigate to ${link.label}`}
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
            aria-label="Navigate to Resume page"
          >
            Resume
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-2xl text-[#e5e5e5] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#2a2a2a] bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-lg md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`block w-full py-3 text-left text-sm font-medium transition-colors duration-300 ${
                activeSection === link.href.slice(1)
                  ? "text-[#f97316]"
                  : "text-[#9ca3af]"
              }`}
              aria-label={`Navigate to ${link.label}`}
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/resume"
            className="block w-full py-3 text-left text-sm font-medium text-[#9ca3af] transition-colors duration-300 hover:text-[#f97316]"
            onClick={() => setMobileOpen(false)}
            aria-label="Navigate to Resume page"
          >
            Resume
          </Link>
        </div>
      )}
    </nav>
  );
}
