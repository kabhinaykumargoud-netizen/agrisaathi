"use client";

const MODULES = [
    {
        idx: "01",
        icon: "🧧",
        title: "SUBSIDY MATCHER",
        desc: "Get matched with every government scheme instantly. Claim your central and state grants without any middlemen.",
        tag: "Active Verification",
        col: "col-span-4",
        details: "Direct bridge to PM-KISAN & KCC nodes. Automated land document validation."
    },
    {
        idx: "02",
        icon: "📈",
        title: "MARKET COPILOT",
        desc: "Don't guess the price. Track Mandis across India in real-time and sell where you get the most value.",
        tag: "Real-time Tracker",
        col: "col-span-4",
        details: "AI price forecasting with 92% historical accuracy across 150+ commodities."
    },
    {
        idx: "03",
        icon: "⚖️",
        title: "CONTRACT AUDIT",
        desc: "Scan your farm contracts and loan papers. Our AI finds hidden traps so your land stays safe.",
        tag: "Risk Shield",
        col: "col-span-4",
        details: "OCR-powered legal analysis for predatory interest rates and hidden subvention clauses."
    },
    {
        idx: "04",
        icon: "🗞️",
        title: "DIRECT GOVERNANCE",
        desc: "Stay ahead of every rule change. We filter the Gazette lists so you only see what affects your district.",
        tag: "Official Feed",
        col: "col-span-6",
        details: "Live scraping of Central & State Gazettes mapped specifically to your geolocation."
    },
    {
        idx: "05",
        icon: "🤖",
        title: "DISPUTE ADVISOR",
        desc: "Expert help for insurance rejections and land record errors. We help you build a winning case.",
        tag: "Justice System",
        col: "col-span-6",
        details: "Procedural Copilot for PMFBY claims and resolving Khata-Pouni discrepancies."
    }
];

export default function ModulesSection() {
    return (
        <section id="modules" style={{ padding: "10rem 0" }}>
            <div className="section-container">
                <div className="sub-label">Intelligence Network</div>
                <h2 className="section-title text-bright-white" style={{ marginTop: "1rem" }}>
                    WHAT <span className="text-high-vis">AGRISAATHI</span> BRINGS TO YOU
                </h2>

                <div style={{ marginTop: "6rem" }} className="module-grid">
                    {MODULES.map((m) => (
                        <div key={m.idx} className={`flip-card ${m.col}`}>
                            <div className="flip-card-inner">
                                {/* FRONT */}
                                <div className="flip-card-front liquid-glass" style={{ border: "1px solid rgba(0, 255, 127, 0.15)" }}>
                                    <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.7rem", fontWeight: "900" }}>MODULE_{m.idx}</div>
                                    <div style={{ fontSize: "2.8rem", margin: "2rem 0" }}>{m.icon}</div>
                                    <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--vibrant-yellow)" }}>{m.title}</h3>
                                    <p style={{ marginTop: "1rem", color: "var(--vibrant-yellow)", opacity: 0.85, fontSize: "0.95rem", lineHeight: "1.6" }}>{m.desc}</p>
                                    <div style={{ marginTop: "auto", fontWeight: "900", color: "var(--vibrant-green)", fontSize: "0.75rem", letterSpacing: "1px" }}>{m.tag} ▸</div>
                                </div>
                                {/* BACK */}
                                <div className="flip-card-back skeuo-clay" style={{ borderRadius: "12px" }}>
                                    <div className="sub-label" style={{ marginBottom: "1.5rem", fontSize: "0.6rem" }}>Technical Blueprint</div>
                                    <p className="text-bright-white" style={{ fontSize: "1.1rem", lineHeight: "1.7", padding: "0 1rem", fontWeight: "600" }}>
                                        {m.details}
                                    </p>
                                    <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                                        <div className="aether-soft" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem", color: "var(--vibrant-yellow)", borderRadius: "4px" }}>AGRI_NODE_v2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
