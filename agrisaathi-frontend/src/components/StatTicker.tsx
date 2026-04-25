"use client";

const TICKER_ITEMS = [
    { label: "WHEAT MSP", val: "₹2,275/qtl", trend: "up" },
    { label: "PM-KISAN RELEASE", val: "16th Inst.", trend: "stable" },
    { label: "KCC INTEREST", val: "4.0% p.a.", trend: "stable" },
    { label: "MAIZE (CHHINDWARA)", val: "₹2,140/qtl", trend: "down" },
    { label: "PMFBY DEADLINE", val: "MAR 15", trend: "stable" },
    { label: "MUSTARD (BHARATPUR)", val: "₹5,410/qtl", trend: "up" },
    { label: "RICE MSP", val: "₹2,183/qtl", trend: "stable" },
];

export default function StatTicker() {
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div className="stat-ticker">
            <div className="stat-ticker-inner">
                {items.map((item, i) => (
                    <div key={i} className="stat-item">
                        <span className="label">[{item.label}]</span>
                        <span className={`value ${item.trend === "up" ? "green" : item.trend === "down" ? "red" : "amber"}`}>
                            {item.val}
                            {item.trend === "up" ? " ▲" : item.trend === "down" ? " ▼" : ""}
                        </span>
                        <span className="stat-divider">/</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
