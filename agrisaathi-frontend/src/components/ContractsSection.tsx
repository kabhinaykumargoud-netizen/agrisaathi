"use client";

export default function ContractsSection() {
    const RISKS = [
        { label: "Interest Compounding", score: 82, status: "danger" },
        { label: "Default Clause Clarity", score: 45, status: "caution" },
        { label: "Early Repayment Fee", score: 10, status: "safe" }
    ];

    return (
        <section id="contracts" className="contracts-section" style={{ padding: "8rem 0" }}>
            <div className="section-container">
                <div className="feature-row">
                    <div className="feature-content">
                        <div className="sub-label">Legal Defense Node</div>
                        <h2 className="section-title text-bright-white" style={{ marginTop: "1rem" }}>
                            SAFEGUARD <span className="text-high-vis">YOUR LAND</span>
                        </h2>
                        <p className="text-bright-white" style={{ marginTop: "1.5rem", fontSize: "1.1rem", opacity: 0.9 }}>
                            Don't let complicated words take away your farm. Upload any paper—loan documents, sugar mill contracts, or lease agreements.
                            AgriSaathi's legal AI finds the traps hidden in small text and tells you exactly what to sign.
                        </p>

                        <div className="aether-soft" style={{ marginTop: "2.5rem", padding: "2rem", textAlign: "center", borderStyle: "dashed", cursor: "pointer", borderRadius: "8px" }}>
                            <div className="text-high-vis" style={{ fontSize: "1.2rem" }}>UPLOAD DOCUMENTS ▸</div>
                            <div className="text-bright-white" style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.6 }}>Supports PDFs, Images & Hand-written Scans</div>
                        </div>
                    </div>

                    <div className="feature-vis">
                        <div className="skeuo-clay" style={{ padding: "2.5rem", borderRadius: "24px" }}>
                            <div className="sub-label" style={{ marginBottom: "2rem", color: "var(--vibrant-yellow)" }}>AI RISK ANALYSIS: KCC_DOC_V4</div>

                            {RISKS.map((r) => (
                                <div key={r.label} style={{ marginBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem", fontSize: "0.85rem", fontWeight: "800" }}>
                                        <span className="text-bright-white">{r.label}</span>
                                        <span style={{ color: r.status === 'danger' ? 'var(--red-alert)' : 'var(--vibrant-green)' }}>{r.score}% Risk</span>
                                    </div>
                                    <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${r.score}%`,
                                            background: r.status === 'danger' ? 'var(--red-alert)' : 'var(--vibrant-green)',
                                            boxShadow: `0 0 10px ${r.status === 'danger' ? 'var(--red-alert)' : 'var(--vibrant-green)'}`
                                        }}></div>
                                    </div>
                                </div>
                            ))}

                            <div className="liquid-glass" style={{ marginTop: "2.5rem", padding: "1.5rem", border: "1px solid var(--red-alert)", background: "rgba(255, 59, 59, 0.1)" }}>
                                <div className="text-high-vis" style={{ color: "var(--red-alert)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>⚠️ CRITICAL TRAP DETECTED</div>
                                <p className="text-bright-white" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
                                    "Section 4.2 implies daily compounding interest during drought declarations. This violates RBI Master Circular 2024-25."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
