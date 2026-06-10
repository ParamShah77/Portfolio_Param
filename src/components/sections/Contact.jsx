import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiMail, FiMapPin } from "react-icons/fi";
import emailjs from "@emailjs/browser";

/*
 * =====================================================
 *  EmailJS Configuration
 * =====================================================
 */
const EMAILJS_SERVICE_ID = "service_t5xm44g";
const EMAILJS_TEMPLATE_ID = "template_12hst4l";
const EMAILJS_PUBLIC_KEY = "i9gQ5NCQnUALPXkF9";

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

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            Let&apos;s <span className="text-[#f97316]">Connect</span>
          </h2>
          <p className="text-[#9ca3af] text-lg">
            Have an idea or a project in mind? I&apos;d love to hear about it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
          
          {/* Left — Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center lg:col-span-2 lg:items-start lg:text-left"
          >
            <div className="mb-10 flex flex-col items-center gap-8 lg:items-start">
              <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                  <FiMail className="text-2xl" />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <h3 className="mb-1 text-lg font-semibold text-white">Email</h3>
                  <a
                    href="mailto:paramshah0070@gmail.com"
                    className="text-[#9ca3af] transition-colors hover:text-[#f97316]"
                  >
                    paramshah0070@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                  <FiMapPin className="text-2xl" />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <h3 className="mb-1 text-lg font-semibold text-white">Location</h3>
                  <p className="text-[#9ca3af]">Mumbai, India</p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center border-t border-[#2a2a2a] pt-8 lg:items-start">
              <p className="mb-5 text-sm uppercase tracking-wider text-[#9ca3af]">
                Follow me
              </p>
              <div className="flex justify-center gap-4 lg:justify-start">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#141414] border border-[#2a2a2a] text-[#e5e5e5] transition-all duration-300 hover:border-[#f97316] hover:bg-[#f97316]/10 hover:text-[#f97316]"
                      aria-label={`Visit ${social.name} profile`}
                    >
                      <Icon className="text-xl transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Contact Form in a Glass Card */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-3 rounded-2xl border border-[#2a2a2a] bg-[#141414]/60 p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden"
          >
            {/* Decorative background glow for the card */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#f97316]/10 blur-[60px] pointer-events-none"></div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative z-10">
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-[#9ca3af]"
                >
                  Name <span className="text-[#f97316]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/50"
                  placeholder="John Doe"
                  aria-label="Your name"
                />
              </div>

              <div className="relative z-10">
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-[#9ca3af]"
                >
                  Email <span className="text-xs text-[#6b7280]">(optional)</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/50"
                  placeholder="john@example.com"
                  aria-label="Your email (optional)"
                />
              </div>
            </div>

            <div className="relative z-10">
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-medium text-[#9ca3af]"
              >
                Message <span className="text-[#f97316]">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/50"
                placeholder="What are you working on?"
                aria-label="Your message"
              />
            </div>

            <div className="relative z-10 pt-2">
              {status === "success" ? (
                <div className="w-full rounded-xl bg-green-500/10 py-4 text-center text-sm font-bold text-green-400 border border-green-500/20">
                  ✓ Message successfully delivered!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-xl bg-[#f97316] py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#fb923c] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50"
                  aria-label="Send message"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              )}

              {status === "error" && (
                <p className="mt-4 text-center text-sm text-red-500">
                  Oops! Something went wrong. Please try again.
                </p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
