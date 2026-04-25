"use client";

const SCHEMES = [
    {
        name: "PM-KISAN",
        ministry: "Ministry of Agriculture",
        benefit: "₹6,000 / Year",
        status: "active",
        match: 98
    },
    {
        name: "Kisan Credit Card (KCC)",
        ministry: "Financial Services",
        benefit: "₹3L Loan @ 4% Interest",
        status: "pending",
        match: 75
    },
    {
        name: "Cattle Insurance (NDDB)",
        ministry: "Animal Husbandry",
        benefit: "80% Subsidy on Premium",
        status: "active",
        match: 42
    },
    {
        name: "Kusum Solar Scheme",
        ministry: "New & Renewable Energy",
        benefit: "90% Subsidy on Water Pumps",
        status: "closed",
        match: 15
    }
];

export default function SchemesSection() {
    return (
        <section id="schemes" style={{ padding: "8rem 0" }}>
            <div className="section-container">
                <div style={{ marginBottom: "4rem" }}>
                    <div className="section-label">Central & State Portal</div>
                    <h2 className="section-title">
                        GOVERNMENT <span className="hl">SCHEME HUB</span>
                    </h2>
                </div>

                <div className="scheme-grid">
                    {SCHEMES.map((s) => (
                        <div key={s.name} className="scheme-card">
                            <div className={`scheme-badge ${s.status}`}>
                                {s.status}
                            </div>
                            <h3 className="scheme-name">{s.name}</h3>
                            <p className="scheme-ministry">{s.ministry}</p>
                            <div className="scheme-benefit">{s.benefit}</div>

                            <div className="scheme-eligibility">
                                <div className="scheme-elig-label">Profile Match Probability</div>
                                <div className="scheme-elig-match">
                                    <div className="match-bar">
                                        <div className="match-fill" style={{ width: `${s.match}%` }} />
                                    </div>
                                    <div className="match-pct">{s.match}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "3rem", padding: "1.5rem", border: "1px solid var(--amber)", background: "rgba(245,158,11,0.05)" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>🔔</span>
                        <div>
                            <div style={{ color: "var(--amber)", fontWeight: 700, fontSize: "0.85rem" }}>CONFLICT DETECTED</div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                                Applying for State Solar Subsidy while active in PKVY Cluster might temporarily block your GST credit. Seek advisor guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
