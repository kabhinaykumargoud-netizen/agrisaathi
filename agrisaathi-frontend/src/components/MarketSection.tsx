"use client";
import { useEffect, useState, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface MarketCenter {
    market: string;
    price: number;
    min_price: number;
    max_price: number;
    change_pct: number;
}

interface TrendPoint {
    date: string;
    price: number;
}

interface MarketData {
    commodity: string;
    state: string;
    current_price_inr: number;
    unit: string;
    msp: number | null;
    trend: TrendPoint[];
    market_centers: MarketCenter[];
    market_insights: string[];
    source: "live" | "demo";
    last_updated: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────
const COMMODITIES = [
    { key: "rice", label: "Rice", icon: "🌾", unit: "quintal" },
    { key: "wheat", label: "Wheat", icon: "🌿", unit: "quintal" },
    { key: "cotton", label: "Cotton", icon: "☁️", unit: "quintal" },
    { key: "mustard", label: "Mustard", icon: "🌻", unit: "quintal" },
    { key: "soybean", label: "Soybean", icon: "🫘", unit: "quintal" },
    { key: "maize", label: "Maize", icon: "🌽", unit: "quintal" },
    { key: "arhar", label: "Arhar Dal", icon: "🟡", unit: "quintal" },
    { key: "groundnut", label: "Groundnut", icon: "🥜", unit: "quintal" },
];

const STATES = [
    "Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh",
    "Rajasthan", "Gujarat", "Karnataka", "Andhra Pradesh", "West Bengal",
];

// ─── Mini Sparkline ──────────────────────────────────────────────────────────
function Sparkline({ data }: { data: TrendPoint[] }) {
    if (!data || data.length < 2) return null;
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const W = 120, H = 36, PAD = 4;
    const stepX = (W - PAD * 2) / (prices.length - 1);
    const points = prices.map((p, i) => {
        const x = PAD + i * stepX;
        const y = PAD + (1 - (p - min) / range) * (H - PAD * 2);
        return `${x},${y}`;
    });
    const isUp = prices[prices.length - 1] >= prices[0];
    const color = isUp ? "#00FF7F" : "#FF4444";
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={`grad-${isUp}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points.join(" ")}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </svg>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MarketSection() {
    const [selectedCommodity, setSelectedCommodity] = useState("rice");
    const [selectedState, setSelectedState] = useState("Maharashtra");
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

    const fetchMarketData = useCallback(async (commodity: string, state: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `/api/market-prices?commodity=${encodeURIComponent(commodity)}&state=${encodeURIComponent(state)}`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: MarketData = await res.json();
            setData(json);
            setLastFetchTime(new Date());
        } catch (e) {
            setError("Failed to fetch market data. Please try again.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMarketData(selectedCommodity, selectedState);
    }, [selectedCommodity, selectedState, fetchMarketData]);

    // ─── Chart bar heights (normalise market center prices) ─────────────────
    const maxPrice = data ? Math.max(...data.market_centers.map((c) => c.price)) : 1;

    const mspDiff = data?.msp && data?.current_price_inr
        ? (((data.current_price_inr - data.msp) / data.msp) * 100).toFixed(1)
        : null;
    const mspColor = mspDiff ? (parseFloat(mspDiff) >= 0 ? "#00FF7F" : "#FF4444") : "#FFBD2E";

    const comm = COMMODITIES.find((c) => c.key === selectedCommodity);

    return (
        <section id="market" className="market-section" style={{ padding: "8rem 0", position: "relative" }}>
            {/* ── Background glow ── */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,189,46,0.05) 0%, transparent 70%)",
            }} />

            <div className="section-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

                {/* ── Section Header ── */}
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <div className="sub-label" style={{ color: "var(--vibrant-yellow)", marginBottom: "1rem" }}>
                        🏪 Live Mandi Intelligence
                    </div>
                    <h2 className="section-title text-bright-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: 0 }}>
                        SELL AT THE <span className="text-high-vis">HIGHEST PRICE</span>
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "1rem", fontSize: "1.05rem", maxWidth: "600px", margin: "1rem auto 0" }}>
                        Real-time wholesale mandi prices from across India — updated every 5 minutes.
                    </p>
                </div>

                {/* ── Controls ── */}
                <div style={{
                    display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center",
                    justifyContent: "center", marginBottom: "3rem",
                }}>
                    {/* Commodity chips */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                        {COMMODITIES.map((c) => (
                            <button
                                key={c.key}
                                id={`commodity-btn-${c.key}`}
                                onClick={() => setSelectedCommodity(c.key)}
                                style={{
                                    padding: "0.5rem 1.1rem",
                                    borderRadius: "50px",
                                    border: `1.5px solid ${selectedCommodity === c.key ? "var(--vibrant-yellow)" : "rgba(255,255,255,0.12)"}`,
                                    background: selectedCommodity === c.key
                                        ? "rgba(255,189,46,0.15)"
                                        : "rgba(255,255,255,0.04)",
                                    color: selectedCommodity === c.key ? "var(--vibrant-yellow)" : "rgba(255,255,255,0.7)",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    transition: "all 0.2s",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                {c.icon} {c.label}
                            </button>
                        ))}
                    </div>

                    {/* State select */}
                    <select
                        id="state-select"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        style={{
                            padding: "0.5rem 1.2rem",
                            borderRadius: "50px",
                            border: "1.5px solid rgba(255,255,255,0.2)",
                            background: "rgba(255,255,255,0.06)",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            backdropFilter: "blur(8px)",
                            outline: "none",
                        }}
                    >
                        {STATES.map((s) => (
                            <option key={s} value={s} style={{ background: "#1a1a2e" }}>{s}</option>
                        ))}
                    </select>

                    {/* Refresh button */}
                    <button
                        id="refresh-market-btn"
                        onClick={() => fetchMarketData(selectedCommodity, selectedState)}
                        disabled={loading}
                        title="Refresh data"
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "50px",
                            border: "1.5px solid rgba(255,255,255,0.2)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.7)",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "1rem",
                            transition: "all 0.2s",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        {loading ? "⏳" : "🔄"}
                    </button>
                </div>

                {/* ── Loading skeleton ── */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.5)" }}>
                        <div style={{
                            display: "inline-block", width: "48px", height: "48px",
                            border: "3px solid rgba(255,189,46,0.3)", borderTopColor: "var(--vibrant-yellow)",
                            borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }} />
                        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>Fetching live mandi data…</p>
                    </div>
                )}

                {/* ── Error State ── */}
                {error && !loading && (
                    <div style={{
                        textAlign: "center", padding: "3rem",
                        background: "rgba(255,68,68,0.1)", borderRadius: "16px",
                        border: "1px solid rgba(255,68,68,0.3)", color: "#FF4444",
                    }}>
                        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</p>
                        <p>{error}</p>
                        <button
                            onClick={() => fetchMarketData(selectedCommodity, selectedState)}
                            style={{
                                marginTop: "1rem", padding: "0.5rem 1.5rem",
                                background: "rgba(255,68,68,0.2)", border: "1px solid #FF4444",
                                borderRadius: "8px", color: "#FF4444", cursor: "pointer",
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Data Display ── */}
                {data && !loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                        {/* ─ Hero Price Card ─ */}
                        <div className="skeuo-clay" style={{
                            gridColumn: "1 / -1",
                            padding: "2rem 2.5rem",
                            borderRadius: "20px",
                            display: "flex",
                            gap: "2rem",
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            border: "1px solid rgba(255,189,46,0.2)",
                        }}>
                            <div>
                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                                    {comm?.icon} {data.commodity.toUpperCase()} · {data.state}
                                </div>
                                <div style={{
                                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900,
                                    color: "#fff", lineHeight: 1, letterSpacing: "-0.02em",
                                }}>
                                    ₹{data.current_price_inr.toLocaleString("en-IN")}
                                    <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: 400, marginLeft: "0.5rem" }}>
                                        /{data.unit}
                                    </span>
                                </div>
                                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                                    Last updated: {data.last_updated}
                                </div>
                            </div>

                            {/* Sparkline + MSP badge */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.8rem" }}>
                                <Sparkline data={data.trend} />

                                {data.msp && (
                                    <div style={{
                                        background: `${mspColor}18`,
                                        border: `1px solid ${mspColor}55`,
                                        borderRadius: "10px",
                                        padding: "0.4rem 0.9rem",
                                        fontSize: "0.78rem",
                                        fontWeight: 700,
                                        color: mspColor,
                                    }}>
                                        MSP ₹{data.msp.toLocaleString("en-IN")} &nbsp;
                                        ({parseFloat(mspDiff!) >= 0 ? "+" : ""}{mspDiff}%)
                                    </div>
                                )}

                                <div style={{
                                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
                                    color: data.source === "live" ? "#00FF7F" : "rgba(255,255,255,0.35)",
                                    display: "flex", alignItems: "center", gap: "0.4rem",
                                }}>
                                    <div style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: data.source === "live" ? "#00FF7F" : "rgba(255,255,255,0.3)",
                                        boxShadow: data.source === "live" ? "0 0 8px #00FF7F" : "none",
                                        animation: data.source === "live" ? "pulse 1.5s infinite" : "none",
                                    }} />
                                    {data.source === "live" ? "LIVE AGMARKNET" : "DEMO DATA"}
                                </div>
                            </div>
                        </div>

                        {/* ─ Mandi Price Bars ─ */}
                        <div className="skeuo-clay" style={{
                            padding: "2rem",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginBottom: "1.5rem",
                            }}>
                                <h3 style={{ color: "#fff", margin: 0, fontSize: "1rem", fontWeight: 800 }}>
                                    📊 Mandi Prices
                                </h3>
                                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                                    ₹/QUINTAL
                                </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {data.market_centers.map((center, i) => {
                                    const barPct = Math.round((center.price / maxPrice) * 100);
                                    const isUp = center.change_pct >= 0;
                                    const barColor = isUp ? "#00FF7F" : "#FF4444";
                                    return (
                                        <div key={`${center.market}-${i}`}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                                                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                                                    {center.market}
                                                </span>
                                                <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 800 }}>
                                                        ₹{center.price.toLocaleString("en-IN")}
                                                    </span>
                                                    <span style={{
                                                        fontSize: "0.7rem", fontWeight: 700,
                                                        color: isUp ? "#00FF7F" : "#FF4444",
                                                    }}>
                                                        {isUp ? "▲" : "▼"} {Math.abs(center.change_pct)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${barPct}%`,
                                                    background: barColor,
                                                    boxShadow: `0 0 8px ${barColor}`,
                                                    borderRadius: "2px",
                                                    transition: "width 0.6s ease",
                                                }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
                                                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                                                    Min ₹{center.min_price.toLocaleString("en-IN")}
                                                </span>
                                                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                                                    Max ₹{center.max_price.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─ AI Insights Panel ─ */}
                        <div className="skeuo-clay" style={{
                            padding: "2rem",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.07)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0",
                        }}>
                            <h3 style={{ color: "#fff", margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: 800 }}>
                                🤖 AI Market Insights
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", flex: 1 }}>
                                {data.market_insights.map((insight, i) => (
                                    <div key={i} style={{
                                        padding: "0.85rem 1rem",
                                        background: "rgba(255,255,255,0.04)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                        fontSize: "0.83rem",
                                        color: "rgba(255,255,255,0.85)",
                                        lineHeight: 1.55,
                                        fontWeight: 500,
                                        animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
                                    }}>
                                        {insight}
                                    </div>
                                ))}
                            </div>

                            {/* Summary stats */}
                            <div style={{
                                marginTop: "1.5rem",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "0.75rem",
                            }}>
                                {[
                                    { label: "Mandis Tracked", value: data.market_centers.length.toString() },
                                    { label: "Best Mandi", value: data.market_centers[0]?.market?.split(" ")[0] ?? "—" },
                                    { label: "Price Range", value: `₹${Math.min(...data.market_centers.map(c => c.price)).toLocaleString("en-IN")} – ₹${Math.max(...data.market_centers.map(c => c.price)).toLocaleString("en-IN")}` },
                                    { label: "MSP Compliance", value: data.msp ? (data.current_price_inr >= data.msp ? "✅ Above" : "❌ Below") : "N/A" },
                                ].map((stat) => (
                                    <div key={stat.label} style={{
                                        padding: "0.75rem",
                                        background: "rgba(255,189,46,0.06)",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,189,46,0.15)",
                                    }}>
                                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                                            {stat.label.toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 800 }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Refresh note */}
                            {lastFetchTime && (
                                <div style={{
                                    marginTop: "1rem", fontSize: "0.7rem",
                                    color: "rgba(255,255,255,0.3)", textAlign: "center",
                                }}>
                                    Fetched at {lastFetchTime.toLocaleTimeString("en-IN")} · Auto-refresh every 5 min
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%  { opacity: 0.5; transform: scale(1.5); }
        }
        @media (max-width: 768px) {
          #market .grid-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
}
