"use client";
import { useState } from "react";

const INITIAL_MSGS = [
    { sender: "ai", text: "Welcome to AgriSaathi Command. I am your AI governance agent. How can I assist your farm operation today?" }
];

export default function AdvisorSection() {
    const [messages, setMessages] = useState(INITIAL_MSGS);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsgs = [...messages, { sender: "user", text: input }];
        setMessages(newMsgs);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: "ai",
                text: "Analyzing your request... Based on your Gorakhpur land records, you should apply for the KCC interest subvention before March 15th to save ₹12,400."
            }]);
        }, 1000);
    };

    return (
        <section id="advisor" className="advisor-section" style={{ padding: "6rem 0" }}>
            <div className="section-container">
                <div className="feature-row">
                    <div>
                        <div className="section-label">Interactive Agent</div>
                        <h2 className="section-title">
                            TALK TO <span className="hl">AGRISAATHI</span>
                        </h2>
                        <p style={{ marginTop: "1.5rem", color: "var(--text-dim)", lineHeight: 1.8 }}>
                            Our multi-lingual LLM-based assistant understands 22 Indian languages.
                            Ask about crops, market fluctuations, or legal jargon in your documents.
                            It is trained on India's latest agricultural gazettes.
                        </p>
                        <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
                            {[
                                "What schemes am I eligible for in UP?",
                                "Analyze my KCC loan document",
                                "Best time to sell wheat in Gorakhpur?"
                            ].map(q => (
                                <button
                                    key={q}
                                    onClick={() => setInput(q)}
                                    className="btn-ghost"
                                    style={{ fontSize: "0.65rem", padding: "0.5rem 1rem" }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="chat-panel">
                        <div className="chat-header">
                            <div className="chat-ai-dot"></div>
                            <div className="chat-name">AGRISAATHI AI ENGINE v2.0 // ONLINE</div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((m, i) => (
                                <div key={i} className={`chat-bubble ${m.sender}`}>
                                    {m.text}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-row">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Type your agricultural query..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button className="chat-send" onClick={handleSend}>SEND ▸</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
