"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ModulePanel from "@/components/ModulePanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatLog from "@/components/ChatLog";

const ML_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ─── Types ─── */
interface Message { id: number; role: "user" | "ai"; text: string; timestamp?: number; }

/* ─── Format backend module responses cleanly ─── */
const formatModuleResponse = (mod: string, d: Record<string, any>): string => {
  if (mod === "weather") {
    const w = d.current_weather || {};
    return `🌤️ WEATHER & PREDICTIVE RISK [Score: ${d.risk?.score}/100]\nStatus: ${d.risk?.level} ${d.risk?.color}\n\n🌡️ Current: ${w.temp}°C | ${w.description}\n📅 Forecast: ${d.forecast_summary}\n\n🤖 AI Advice:\n${d.ai_advice}`;
  }

  if (mod === "pest") {
    let text = `🐛 PEST & DISEASE DIAGNOSIS [${d.risk_level}]\nScore: ${d.risk_score}/100\n\n`;
    if (d.ai_diagnosis) text += `🧪 AI Diagnosis:\n${d.ai_diagnosis}\n\n`;
    text += `🦠 Identified Threats:\n${((d.threats as string[]) || []).map(t => "• " + t).join("\n")}\n\n`;
    text += `💊 Immediate Actions:\n${((d.actions as string[]) || []).map(a => "• " + a).join("\n")}\n\n`;
    text += `📝 Summary: ${d.summary || "N/A"}`;
    return text;
  }

  if (mod === "bird") {
    let text = `🦅 BIRD PROTECTION ADVISORY\n\n`;
    text += `🛡️ Prevention Strategies:\n${((d.prevention_strategies as string[]) || []).map(s => "• " + s).join("\n")}\n\n`;
    text += `⚙️ Safe Practices:\n${((d.safe_practices as string[]) || []).map(s => "• " + s).join("\n")}\n\n`;
    text += `💡 Immediate Action: ${d.action_suggestion || "N/A"}`;
    return text;
  }

  if (mod === "animal") {
    let text = `🐗 ANIMAL INTRUSION ADVISORY\n\n`;
    text += `🛡️ Prevention Strategies:\n${((d.prevention_strategies as string[]) || []).map(s => "• " + s).join("\n")}\n\n`;
    text += `⚙️ Safe Practices:\n${((d.safe_practices as string[]) || []).map(s => "• " + s).join("\n")}\n\n`;
    text += `💡 Immediate Action: ${d.action_suggestion || "N/A"}`;
    return text;
  }

  return JSON.stringify(d, null, 2);
};

/* ─── Design tokens ─── */
const C = {
  bg: "#080C08",
  sidebar: "#0d120d",
  panel: "#111611",
  border: "rgba(173,255,47,0.1)",
  accent: "#ADFF2F",
  yellow: "#F5C518",
  dim: "rgba(173,255,47,0.5)",
  header: "linear-gradient(90deg,#106f8c,#083c50)",
};

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [chatSessions, setChatSessions] = useState<Array<{ id: string; title: string; date: string; messages: Message[] }>>([]);
  const [mounted, setMounted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* ── Load chat history from localStorage on mount ── */
  useEffect(() => {
    if (mounted && user) {
      const savedHistory = localStorage.getItem(`agrisaathi_chat_${user.id}`);
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          setMessages(parsed);
        } catch (e) {
          console.error("Failed to load chat history", e);
        }
      }

      // Load all chat sessions
      const savedSessions = localStorage.getItem(`agrisaathi_sessions_${user.id}`);
      if (savedSessions) {
        try {
          setChatSessions(JSON.parse(savedSessions));
        } catch (e) {
          console.error("Failed to load chat sessions", e);
        }
      }
    }
  }, [user]);

  /* ── Save chat history to localStorage whenever messages change ── */
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`agrisaathi_chat_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  /* ── Sync language from Navbar dropdown ── */
  useEffect(() => {
    const saved = localStorage.getItem("agrisaathi_lang");
    if (saved) setSelectedLang(saved);
    const handler = (e: Event) => setSelectedLang((e as CustomEvent<string>).detail);
    window.addEventListener("agrisaathi_lang_change", handler);
    return () => window.removeEventListener("agrisaathi_lang_change", handler);
  }, []);

  /* ── Scroll to bottom on new messages ── */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Main submit handler (used by ModulePanel + chat input) ── */
  const handleSubmit = async (question: string, payload?: Record<string, unknown>) => {
    setShowMobileSidebar(false);
    const userMsg: Message = { id: Date.now(), role: "user", text: question, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const mod = payload?.module as string | undefined;
      let body: Record<string, unknown> = { ...payload, lang: selectedLang };
      delete body.module;

      /* ── Module-specific calls ── */
      const ENDPOINTS: Record<string, string> = {
        weather: "/api/weather-advice",
        pest: "/api/pest-disease",
        bird: "/api/bird-protection",
        animal: "/api/animal-protection",
      };

      if (mod && ENDPOINTS[mod]) {
        // FastAPI Pydantic handles string-to-number casting, but we ensure field_size is sent as a number if it exists
        if (body.field_size) body.field_size = parseFloat(body.field_size as string);
        if (body.area_acres) body.area_acres = parseFloat(body.area_acres as string);
        if (body.N) body.N = parseInt(body.N as string);
        if (body.P) body.P = parseInt(body.P as string);
        if (body.K) body.K = parseInt(body.K as string);
        const res = await fetch(`${ML_BASE}${ENDPOINTS[mod]}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const d = await res.json();
          pushAI(formatModuleResponse(mod, d));
          setIsTyping(false); // Immediate unlock
          return;
        }
      }

      /* ── General chat fallback → LLM ── */
      const chatRes = await fetch(`${ML_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, lang: selectedLang }),
      });

      if (chatRes.ok) {
        const d = await chatRes.json();
        pushAI(d.message);
      } else {
        pushAI(`⚠️ Backend Error (${chatRes.status}): Server returned an error. Please check if your Vercel environment variables are set and the backend is deployed.`);
      }
    } catch (err: any) {
      console.error("Backend connection failed:", err);
      pushAI(`⚠️ Connection Failed: ${err.message || 'Network error'}. Make sure the backend is reachable.`);
    } finally {
      setIsTyping(false);
    }
  };

  const pushAI = (text: string) =>
    setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text, timestamp: Date.now() }]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    handleSubmit(input.trim());
    setInput("");
  };

  const clearHistory = () => {
    if (confirm("Clear all chat history? This cannot be undone.")) {
      setMessages([]);
      if (user) {
        localStorage.removeItem(`agrisaathi_chat_${user.id}`);
      }
    }
  };

  const saveCurrentSession = () => {
    if (user && messages.length > 0) {
      const sessionTitle = messages[0]?.text.slice(0, 50) || "New Chat";
      const newSession = {
        id: Date.now().toString(),
        title: sessionTitle,
        date: new Date().toLocaleDateString(),
        messages: [...messages]
      };
      const updatedSessions = [newSession, ...chatSessions].slice(0, 20); // Keep last 20 sessions
      setChatSessions(updatedSessions);
      localStorage.setItem(`agrisaathi_sessions_${user.id}`, JSON.stringify(updatedSessions));
    }
  };

  const loadSession = (session: { id: string; title: string; date: string; messages: Message[] }) => {
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = (sessionId: string) => {
    if (confirm("Delete this chat session?")) {
      const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
      setChatSessions(updatedSessions);
      if (user) {
        localStorage.setItem(`agrisaathi_sessions_${user.id}`, JSON.stringify(updatedSessions));
      }
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
    setMessages([]);
  };

  /* ── Render ── */
  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--font-body)", color: C.accent, display: "flex", flexDirection: "column" }}>
        <Navbar />

        {/* ── Main 2-column dashboard ── */}
        <div style={{
          display: "flex", flex: 1,
          paddingTop: "90px", /* accounts for fixed Navbar height */
          height: "calc(100vh - 90px)",
          overflow: "hidden",
        }}>

          {/* ══ LEFT SIDEBAR — Module Selector ══ */}
          <aside className={`sidebar ${showMobileSidebar ? "mobile-open" : ""}`} style={{
            width: "300px", flexShrink: 0,
            background: C.sidebar,
            borderRight: `1px solid ${C.border}`,
            overflowY: "auto",
            padding: "1.25rem 0.75rem",
            display: "flex", flexDirection: "column", gap: "0.75rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem", padding: "0 0.5rem" }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: C.dim }}>
                SELECT AI MODULE
              </div>
              <button className="mobile-close-btn" onClick={() => setShowMobileSidebar(false)}>✕</button>
            </div>
            <ModulePanel onSubmit={handleSubmit} />

            {/* Climate map link */}
            <Link href="/climate-map" style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(173,255,47,0.04)", border: `1px solid ${C.border}`,
              color: C.accent, padding: "0.65rem 0.9rem", borderRadius: "10px",
              fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
              marginTop: "0.5rem",
            }}>
              🗺️ Open Climate Map
            </Link>
          </aside>

          {/* ══ RIGHT — Chat Panel ══ */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>

            {/* Chat header */}
            <div style={{
              background: C.header, padding: "1rem 1.5rem",
              color: C.accent, fontWeight: 600, fontSize: "0.9rem",
              letterSpacing: "0.04em", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button className="mobile-menu-btn" onClick={() => setShowMobileSidebar(true)}>☰ Modules</button>
                <span>🌾 AgriSaathi AI</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", color: C.dim, fontWeight: 400 }}>
                  Lang: {selectedLang.toUpperCase()}
                </span>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  style={{
                    background: "rgba(173,255,47,0.1)", border: `1px solid ${C.border}`,
                    color: C.accent, padding: "0.4rem 0.8rem", borderRadius: "6px",
                    fontSize: "0.75rem", cursor: "pointer", fontWeight: 600
                  }}
                  title="Chat History"
                >
                  📜 History
                </button>
                <button
                  onClick={startNewChat}
                  style={{
                    background: "rgba(173,255,47,0.1)", border: `1px solid ${C.border}`,
                    color: C.accent, padding: "0.4rem 0.8rem", borderRadius: "6px",
                    fontSize: "0.75rem", cursor: "pointer", fontWeight: 600
                  }}
                  title="New Chat"
                >
                  ➕ New
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    background: "rgba(173,255,47,0.1)", border: `1px solid ${C.border}`,
                    color: C.accent, padding: "0.4rem 0.8rem", borderRadius: "6px",
                    fontSize: "0.75rem", cursor: "pointer", fontWeight: 600
                  }}
                  title="Settings"
                >
                  ⚙️
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "1.5rem",
              display: "flex", flexDirection: "column", gap: "1.25rem",
            }}>
              {/* Welcome message */}
              {messages.length === 0 && (
                <div style={{
                  alignSelf: "flex-start", maxWidth: "75%",
                  background: "rgba(173,255,47,0.04)",
                  border: `1px solid ${C.border}`,
                  borderRadius: "0 12px 12px 12px",
                  padding: "0.9rem 1.2rem",
                  color: C.accent, fontSize: "0.92rem", lineHeight: 1.6,
                }}>
                  <strong>👋 Hi, I am AgriSaathi!</strong><br />
                  Select a module from the left panel to get AI advice, or just type your farming question below.
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "78%",
                }}>
                  {msg.role === "user" ? (
                    <div style={{
                      background: "rgba(173,255,47,0.1)",
                      border: `1px solid rgba(173,255,47,0.2)`,
                      borderRadius: "12px 12px 0 12px",
                      padding: "0.75rem 1.1rem",
                      color: C.accent, fontSize: "0.9rem", lineHeight: 1.5,
                    }}>{msg.text}</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{
                        background: C.panel,
                        border: `1px solid ${C.border}`,
                        borderRadius: "0 12px 12px 12px",
                        padding: "0.9rem 1.2rem",
                        color: "rgba(173,255,47,0.9)", fontSize: "0.88rem", lineHeight: 1.7,
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>{msg.text}</div>

                      <button
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          const originalText = btn.innerHTML;
                          btn.innerHTML = "⏳ Generating Audio...";
                          try {
                            // Strip asterisks for cleaner audio
                            const cleanText = msg.text.replace(/\*/g, '').slice(0, 1500);
                            const ttsUrl = `${ML_BASE}/api/tts?text=${encodeURIComponent(cleanText)}&lang=${selectedLang}`;
                            const res = await fetch(ttsUrl);
                            if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            const audio = new Audio(blobUrl);
                            btn.innerHTML = `🔊 Playing Audio...`;
                            audio.play();
                            audio.onended = () => {
                              URL.revokeObjectURL(blobUrl);
                              btn.innerHTML = originalText;
                            };
                          } catch (err) {
                            console.error("TTS error:", err);
                            btn.innerHTML = "⚠️ Audio Failed";
                            setTimeout(() => btn.innerHTML = originalText, 2000);
                          }
                        }}
                        style={{
                          alignSelf: "flex-start",
                          background: "rgba(173,255,47,0.06)",
                          border: `1px solid ${C.border}`,
                          color: C.accent,
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(173,255,47,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(173,255,47,0.06)"}
                      >
                        ▶ Listen in {selectedLang.toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={{ alignSelf: "flex-start" }}>
                  <div style={{
                    background: C.panel, border: `1px solid ${C.border}`,
                    borderRadius: "0 12px 12px 12px", padding: "0.75rem 1.2rem",
                    color: C.dim, fontSize: "0.82rem",
                  }}>
                    <span style={{ animation: "pulse 1s infinite" }}>● ● ●</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div style={{
              borderTop: `1px solid ${C.border}`,
              padding: "0.9rem 1.25rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: C.sidebar, flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a question about your farm…"
                style={{
                  flex: 1, background: "rgba(173,255,47,0.04)",
                  border: `1px solid ${C.border}`, color: C.accent,
                  borderRadius: "10px", padding: "0.65rem 1rem",
                  outline: "none", fontSize: "0.9rem", fontFamily: "inherit",
                }}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                title={!input.trim() ? "Type a question" : "Send message"}
                style={{
                  background: input.trim() ? C.accent : "rgba(173,255,47,0.1)",
                  color: input.trim() ? "#000" : C.dim,
                  border: "none", borderRadius: "10px",
                  padding: "0.65rem 1.4rem", fontWeight: 700,
                  fontSize: "0.85rem", cursor: (isTyping || !input.trim()) ? "not-allowed" : "pointer",
                  transition: "all 0.2s", letterSpacing: "0.03em",
                  opacity: isTyping ? 0.7 : 1,
                  boxShadow: input.trim() ? "0 4px 12px rgba(173,255,47,0.2)" : "none"
                }}
              >
                {isTyping ? "..." : "Send ▶"}
              </button>
            </div>
          </main>

          {/* ══ CHAT LOG PANEL ══ */}
          {showHistory && user && (
            <ChatLog
              userId={user.id}
              currentMessages={messages}
              onLoadSession={(msgs) => { setMessages(msgs); }}
              onNewChat={startNewChat}
              onClose={() => setShowHistory(false)}
            />
          )}

          {/* ══ SETTINGS PANEL ══ */}
          {showSettings && (
            <div style={{
              position: "fixed", top: "90px", right: "20px", width: "350px",
              background: C.sidebar, border: `1px solid ${C.border}`,
              borderRadius: "12px", padding: "1.5rem", zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: C.accent }}>⚙️ Settings</h3>
                <button onClick={() => setShowSettings(false)} style={{
                  background: "transparent", border: "none", color: C.accent,
                  fontSize: "1.5rem", cursor: "pointer", padding: 0
                }}>×</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: C.dim, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    User Profile
                  </div>
                  <div style={{
                    background: "rgba(173,255,47,0.04)", border: `1px solid ${C.border}`,
                    borderRadius: "8px", padding: "1rem"
                  }}>
                    <div style={{ fontSize: "0.9rem", color: C.accent, fontWeight: 600, marginBottom: "0.25rem" }}>
                      {user?.name || "User"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: C.dim }}>
                      {user?.email || "No email"}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: C.dim, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Language
                  </div>
                  <div style={{
                    background: "rgba(173,255,47,0.04)", border: `1px solid ${C.border}`,
                    borderRadius: "8px", padding: "0.75rem", color: C.accent, fontSize: "0.85rem"
                  }}>
                    Current: {selectedLang.toUpperCase()}
                    <div style={{ fontSize: "0.7rem", color: C.dim, marginTop: "0.25rem" }}>
                      Change from Navbar dropdown
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: C.dim, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Chat Settings
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <button onClick={saveCurrentSession} style={{
                      width: "100%", padding: "0.65rem", background: "rgba(173,255,47,0.1)",
                      border: `1px solid ${C.border}`, color: C.accent, borderRadius: "8px",
                      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textAlign: "left"
                    }}>
                      💾 Save Current Chat
                    </button>
                    <button onClick={startNewChat} style={{
                      width: "100%", padding: "0.65rem", background: "rgba(173,255,47,0.1)",
                      border: `1px solid ${C.border}`, color: C.accent, borderRadius: "8px",
                      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textAlign: "left"
                    }}>
                      ➕ Start New Chat
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: C.dim, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Storage Info
                  </div>
                  <div style={{
                    background: "rgba(173,255,47,0.04)", border: `1px solid ${C.border}`,
                    borderRadius: "8px", padding: "0.75rem", fontSize: "0.75rem", color: C.dim
                  }}>
                    <div>Current messages: {messages.length}</div>
                    <div>Saved sessions: {chatSessions.length}</div>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.7rem" }}>
                      Data stored locally in browser
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        aside::-webkit-scrollbar { width: 4px; }
        aside::-webkit-scrollbar-track { background: transparent; }
        aside::-webkit-scrollbar-thumb { background: rgba(173,255,47,0.15); border-radius: 4px; }
        main > div::-webkit-scrollbar { width: 4px; }
        main > div::-webkit-scrollbar-track { background: transparent; }
        main > div::-webkit-scrollbar-thumb { background: rgba(173,255,47,0.1); border-radius: 4px; }
        
        .mobile-menu-btn {
          display: none;
          background: rgba(173,255,47,0.1);
          border: 1px solid rgba(173,255,47,0.3);
          color: #ADFF2F;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .mobile-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: #ADFF2F;
          font-size: 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            left: -100%;
            top: 90px;
            bottom: 0px;
            height: calc(100vh - 90px) !important;
            z-index: 1000;
            transition: left 0.3s ease;
            box-shadow: 10px 0 30px rgba(0,0,0,0.8);
            width: 85% !important; /* Take up 85% of screen to allow clicking outside/showing chat under */
          }
          .sidebar.mobile-open {
            left: 0;
          }
          .mobile-menu-btn, .mobile-close-btn { display: block; }
        }
      `}</style>
      </div>
    </ProtectedRoute>
  );
}
