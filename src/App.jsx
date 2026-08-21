import { useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";
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
      <a
        href="#main"
        className="sr-only rounded-md bg-[#f97316] px-4 py-2 font-medium text-[#0a0a0a] focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[200]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
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

  // Plays on every visit by design. It's ~4s now rather than ~13s, which is
  // what makes that affordable — see the timing constants in IntroAnimation.
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // The custom cursor only makes sense where there's a real pointer to
  // replace. This mirrors the media query in index.css that hides the
  // native one, so the two can never disagree.
  const hasFinePointer = useHasFinePointer();

  return (
    // reducedMotion="user" makes every framer-motion animation in the tree
    // honour the OS setting. The CSS block in index.css cannot reach these —
    // they are JS-driven, not CSS transitions.
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
