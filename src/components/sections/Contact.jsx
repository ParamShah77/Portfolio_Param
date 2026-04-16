import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import emailjs from "@emailjs/browser";

/*
 * =====================================================
 *  EmailJS Configuration
 * =====================================================
 *  Replace the placeholder values below with your
 *  actual EmailJS credentials:
 *
 *  1. SERVICE_ID:  Found in your EmailJS dashboard
 *                   under "Email Services"
 *  2. TEMPLATE_ID: Found under "Email Templates"
 *  3. PUBLIC_KEY:  Found under "Account" → "API Keys"
 *
 *  Sign up at: https://www.emailjs.com/
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
    <section id="contact" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Get <span className="text-[#f97316]">In Touch</span>
          </h2>
          <p className="text-[#9ca3af]">
            Have something to say? Fill this out and I&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left — Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium text-[#e5e5e5]"
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
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-[#f97316]"
                placeholder="Your name"
                aria-label="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium text-[#e5e5e5]"
              >
                Email{" "}
                <span className="text-xs text-[#9ca3af]">(optional)</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-[#f97316]"
                placeholder="your@email.com"
                aria-label="Your email (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-[#e5e5e5]"
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
                className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-[#f97316]"
                placeholder="Your message..."
                aria-label="Your message"
              />
            </div>

            {status === "success" ? (
              <div className="w-full rounded-lg bg-green-500/10 py-3 text-center text-sm font-semibold text-green-400">
                ✓ Message Sent!
              </div>
            ) : (
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg bg-[#f97316] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#fb923c] hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
                aria-label="Send message"
              >
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
            )}

            {status === "error" && (
              <p className="text-center text-sm text-red-400">
                Something went wrong. Try again.
              </p>
            )}
          </motion.form>

          {/* Right — Social + Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <p className="mb-6 text-lg text-[#e5e5e5]">
              Or reach me directly at —
            </p>
            <a
              href="mailto:param.shah23@spit.ac.in"
              className="mb-10 text-lg font-medium text-[#f97316] transition-colors duration-300 hover:text-[#fb923c]"
              aria-label="Email param.shah23@spit.ac.in"
            >
              param.shah23@spit.ac.in
            </a>

            <div className="flex gap-6">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-4xl text-[#e5e5e5] transition-all duration-300 hover:scale-110 hover:text-[#f97316]"
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
