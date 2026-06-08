import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-[#e5e5e5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <motion.h1
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          404
        </motion.h1>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-md text-[#9ca3af]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 flex items-center gap-2 rounded-lg bg-[#f97316] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#fb923c] hover:shadow-lg hover:shadow-[#f97316]/20"
        >
          <FiArrowLeft />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
