import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NEXUS_SYSTEM_PROMPT from "../data/nexusKnowledge";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
// In production (Vercel), use the serverless proxy to keep the API key safe.
// In local dev, fall back to the client-side key if the proxy isn't available.
const API_ENDPOINT = '/api/chat';

// ---------------------------------------------------------------------------
// Rotating chip sets — each bot reply cycles to the next group
// ---------------------------------------------------------------------------
const CHIP_SETS = [
  [
    "Tell me about Param 👋",
    "What projects has he built? 🚀",
    "What's his tech stack? 🛠️",
  ],
  [
    "Tell me about his experience",
    "How can I contact Param? 📩",
    "What's his strongest skill?",
  ],
  [
    "Tell me about CareerPath360.AI",
    "What's his GPA / academics?",
    "What leadership roles has he held?",
  ],
  [
    "Tell me about his ML projects",
    "Is he open to opportunities?",
    "What is he working on now?",
  ],
];

// ---------------------------------------------------------------------------
// Custom Icons
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Typing indicator dots
// ---------------------------------------------------------------------------
function TypingDots() {
  return (
    <div className="nexus-typing-dots">
      <span />
      <span />
      <span />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simple markdown-to-JSX renderer for bot messages
// ---------------------------------------------------------------------------
function FormattedMessage({ text }) {
  if (!text) return null;

  // Process the text into segments
  const segments = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks (```)
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      segments.push({ type: 'code', content: codeLines.join('\n') });
      continue;
    }

    // Regular line
    segments.push({ type: 'text', content: line });
    i++;
  }

  return (
    <div className="nexus-formatted">
      {segments.map((seg, idx) => {
        if (seg.type === 'code') {
          return (
            <pre key={idx} className="nexus-code-block">
              <code>{seg.content}</code>
            </pre>
          );
        }

        // Process inline formatting
        let content = seg.content;
        if (!content.trim()) return <br key={idx} />;

        // Convert **bold** and *italic* and `code`
        const parts = [];
        const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
          if (match.index > lastIndex) {
            parts.push(content.slice(lastIndex, match.index));
          }
          if (match[2]) {
            parts.push(<strong key={`b-${idx}-${match.index}`}>{match[2]}</strong>);
          } else if (match[3]) {
            parts.push(<em key={`i-${idx}-${match.index}`}>{match[3]}</em>);
          } else if (match[4]) {
            parts.push(<code key={`c-${idx}-${match.index}`} className="nexus-inline-code">{match[4]}</code>);
          }
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < content.length) {
          parts.push(content.slice(lastIndex));
        }

        // Check if it's a list item
        const bulletMatch = content.match(/^\s*[-•*]\s+(.*)/);
        const numberedMatch = content.match(/^\s*\d+\.\s+(.*)/);
        if (bulletMatch || numberedMatch) {
          return <div key={idx} className="nexus-list-item">{'•'} {parts.length > 0 ? parts : content.replace(/^\s*[-•*\d.]+\s+/, '')}</div>;
        }

        return <p key={idx} className="nexus-paragraph">{parts.length > 0 ? parts : content}</p>;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual message bubble
// ---------------------------------------------------------------------------
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`nexus-msg-row ${isUser ? "nexus-msg-row--user" : "nexus-msg-row--bot"}`}
    >
      {!isUser && (
        <div className="nexus-avatar" aria-hidden="true">
          <SparkleIcon />
        </div>
      )}
      <div className={`nexus-bubble ${isUser ? "nexus-bubble--user" : "nexus-bubble--bot"}`}>
        {msg.typing ? <TypingDots /> : (isUser ? msg.content : <FormattedMessage text={msg.content} />)}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main NexusChat component
// ---------------------------------------------------------------------------
export default function NexusChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [chipSetIndex, setChipSetIndex] = useState(0);
  const [resetting, setResetting] = useState(false); // new-chat flash animation
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for external toggle events (e.g., from Navbar)
  useEffect(() => {
    const handleToggle = () => setOpen((prev) => !prev);
    window.addEventListener("toggleNexusChat", handleToggle);
    return () => window.removeEventListener("toggleNexusChat", handleToggle);
  }, []);

  // Focus input when panel opens and show greeting
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (!hasGreeted) {
        setHasGreeted(true);
        setMessages([
          {
            id: "greeting",
            role: "bot",
            content:
              "Hey there! ✨ I'm NEXUS — Param's AI Copilot. Ask me anything about his projects, skills, or experience!",
          },
        ]);
      }
    }
  }, [open, hasGreeted]);

  // Call Gemini API
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;

      const userMsg = { id: Date.now(), role: "user", content: text };
      const typingMsg = { id: "typing", role: "bot", typing: true, content: "" };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setInput("");
      setLoading(true);

      // Build conversation history for context
      const history = messages
        .filter((m) => !m.typing && m.id !== "greeting")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const body = {
        system_instruction: {
          parts: [{ text: NEXUS_SYSTEM_PROMPT }],
        },
        contents: [
          ...history,
          { role: "user", parts: [{ text }] },
        ],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 512,
        },
      };

      const fetchWithRetry = async (retries = 2) => {
        for (let i = 0; i <= retries; i++) {
          try {
            const res = await fetch(API_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            if (!res.ok) {
              const err = await res.json();
              // If it's a 503 (high demand) or 429 (rate limit) and we have retries left, wait and retry
              if ((res.status === 503 || res.status === 429) && i < retries) {
                await new Promise((r) => setTimeout(r, 1500 * (i + 1))); // Exponential-ish backoff
                continue;
              }
              throw new Error(err?.error?.message || "API error");
            }
            return await res.json();
          } catch (e) {
            // Catch network errors and retry
            if (i === retries) throw e;
            await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
          }
        }
      };

      try {
        const data = await fetchWithRetry(2);

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Hmm, I didn't get a response. Try again?";

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "typing"),
          { id: Date.now() + 1, role: "bot", content: reply },
        ]);

        // Rotate to the next chip set after each bot reply
        setChipSetIndex((prev) => (prev + 1) % CHIP_SETS.length);
      } catch (err) {
        console.error("NEXUS API error:", err);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "typing"),
          {
            id: Date.now() + 1,
            role: "bot",
            content: `Oops, something went wrong. ${err.message}`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  // New chat with a visible flash animation
  const startNewChat = useCallback(() => {
    setResetting(true);
    setTimeout(() => {
      setMessages([
        {
          id: "greeting",
          role: "bot",
          content:
            "Hey there! ✨ I'm NEXUS — Param's AI Copilot. Ask me anything about his projects, skills, or experience!",
        },
      ]);
      setInput("");
      setChipSetIndex(0);
      setResetting(false);
    }, 380); // matches flash animation duration
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const currentChips = CHIP_SETS[chipSetIndex];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating trigger button                                             */}
      {/* ------------------------------------------------------------------ */}
      <motion.button
        layout
        id="nexus-chat-trigger"
        aria-label="Open NEXUS AI Copilot"
        className={`nexus-fab ${open ? 'nexus-fab-open' : 'nexus-fab-closed'}`}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="nexus-fab-icon"
            >
              ✕
            </motion.span>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="nexus-fab-content"
            >
              <SparkleIcon className="nexus-fab-icon-svg" />
              <span className="nexus-fab-text">Nexus - Param's AI Assistant</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && <span className="nexus-fab-pulse" aria-hidden="true" />}
      </motion.button>

      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="nexus-chat-panel"
            role="dialog"
            aria-label="NEXUS AI Copilot chat"
            className="nexus-panel"
            initial={{ opacity: 0, y: 32, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {/* New-chat flash overlay */}
            <AnimatePresence>
              {resetting && (
                <motion.div
                  key="reset-flash"
                  className="nexus-reset-flash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.19 }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="nexus-header">
              <div className="nexus-header-left">
                <div className="nexus-header-avatar" aria-hidden="true"><SparkleIcon /></div>
                <div>
                  <p className="nexus-header-name">NEXUS</p>
                  <p className="nexus-header-sub">Param's AI Copilot</p>
                </div>
              </div>
              <div className="nexus-header-right">
                <motion.button
                  className="nexus-new-chat-btn"
                  onClick={startNewChat}
                  aria-label="New chat"
                  title="Start a new chat"
                  whileHover={{ scale: 1.15, opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ opacity: 0.55 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </motion.button>
                <div className="nexus-status-dot" title="Online" aria-label="Online" />
                <button
                  className="nexus-mobile-close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="nexus-messages" aria-live="polite" aria-label="Chat messages">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
              </AnimatePresence>

              {/* Suggestion chips — shown only when not loading */}
              <AnimatePresence mode="wait">
                {!loading && messages.length > 0 && (
                  <motion.div
                    key={`chips-${chipSetIndex}`}
                    className="nexus-chips"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                  >
                    {currentChips.map((chip) => (
                      <button
                        key={chip}
                        className="nexus-chip"
                        onClick={() => sendMessage(chip)}
                        type="button"
                      >
                        {chip}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="nexus-input-row">
              <textarea
                ref={inputRef}
                id="nexus-input"
                className="nexus-input"
                placeholder="Ask about Param's projects, skills..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Type your message"
                disabled={loading}
              />
              <button
                id="nexus-send-btn"
                className="nexus-send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            {/* Footer note */}
            <p className="nexus-footer-note">
              AI can make mistakes · Contact Param directly for important info
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
