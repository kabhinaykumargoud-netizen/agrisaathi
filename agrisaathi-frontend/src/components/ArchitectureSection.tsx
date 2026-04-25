"use client";

const STEPS = [
    { num: "01", name: "Data Ingestion", layer: "SOURCE LAYER", tags: ["PIB", "India.gov.in", "RBI", "Mandi Feeds"] },
    { num: "02", name: "Semantic Processing", layer: "COGNITIVE LAYER", tags: ["LLM-v2", "Entity Extraction", "Regional Translation"] },
    { num: "03", name: "Rules Engine", layer: "GOVERNANCE LAYER", tags: ["Scheme Constraints", "Eligibility Auditor", "Conflict Checker"] },
    { num: "04", name: "Financial Audit", layer: "FISCAL LAYER", tags: ["OCR Parser", "Risk Profiling", "Interest Simulator"] },
    { num: "05", name: "User Interface", layer: "DELIVERY LAYER", tags: ["Telemetry Dashboard", "AI Chatbot", "PDF Generator"] },
];

export default function ArchitectureSection() {
    return (
        <section id="architecture" style={{ padding: "8rem 0", background: "rgba(0,0,0,0.3)" }}>
            <div className="section-container">
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <div className="section-label" style={{ justifyContent: "center" }}>Under the Hood</div>
                    <h2 className="section-title">
                        THE <span className="hl">PIPELINE</span>
                    </h2>
                </div>

                <div className="arch-flow">
                    {STEPS.map((step) => (
                        <div key={step.num} className="arch-step">
                            <div className="arch-num">{step.num}</div>
                            <div className="arch-body">
                                <div className="arch-layer">{step.layer}</div>
                                <h3 className="arch-name">{step.name}</h3>
                                <div className="arch-tags">
                                    {step.tags.map(tag => (
                                        <span key={tag} className={`arch-tag ${step.num === "03" ? "amber" : step.num === "02" ? "green" : ""}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
