import { useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useHasFinePointer, usePrefersReducedMotion } from "./hooks/useMediaQuery";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import IntroAnimation from "./components/IntroAnimation";
import BackgroundCanvas from "./components/BackgroundCanvas";
import Hero3D from "./components/sections/Hero3D";
import Home from "./components/sections/Home";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import NexusChat from "./components/NexusChat";

// Lazy-load ResumePage for code-splitting
const ResumePage = lazy(() => import("./pages/ResumePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function MainPage({ showIntro, onIntroComplete }) {
  return (
    <>
      {showIntro && <IntroAnimation onComplete={onIntroComplete} />}
      <BackgroundCanvas />
      <Navbar />
      <main>
        <Hero3D />
        <Home />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <NexusChat />
    </>
  );
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

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

  // The custom cursor only makes sense where there's a real pointer to
  // replace. This mirrors the media query in index.css that hides the
  // native one, so the two can never disagree.
  const hasFinePointer = useHasFinePointer();

  return (
    <BrowserRouter>
      {hasFinePointer && <Cursor />}
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              // The intro is a full-screen particle explosion — skip it
              // entirely rather than animate it slower.
              showIntro={showIntro && !reducedMotion}
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
        <Route
          path="*"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                  <div className="text-[#f97316]">Loading...</div>
                </div>
              }
            >
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
