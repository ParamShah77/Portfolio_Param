import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import IntroAnimation from "./components/IntroAnimation";
import BackgroundCanvas from "./components/BackgroundCanvas";
import Home from "./components/sections/Home";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

// Lazy-load ResumePage for code-splitting
const ResumePage = lazy(() => import("./pages/ResumePage"));

function MainPage({ showIntro, onIntroComplete }) {
  return (
    <>
      {showIntro && <IntroAnimation onComplete={onIntroComplete} />}
      <BackgroundCanvas />
      <Navbar />
      <main>
        <Home />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Check sessionStorage so intro plays only once per session
    const played = sessionStorage.getItem("introPlayed");
    // Allow ?intro=1 query param to force replay during dev
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") return true;
    return !played;
  });

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem("introPlayed", "true");
  }, []);

  // Hide custom cursor on mobile/touch devices
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <BrowserRouter>
      {!isMobile && <Cursor />}
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              showIntro={showIntro}
              onIntroComplete={handleIntroComplete}
            />
          }
        />
        <Route
          path="/resume"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                  <div className="text-[#f97316]">Loading...</div>
                </div>
              }
            >
              <BackgroundCanvas />
              <ResumePage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
