"use client";
import { useState } from "react";

/* ─── Design tokens (match advisor page palette) ─── */
const C = {
    bg: "#111111",
    border: "rgba(173,255,47,0.12)",
    accent: "#ADFF2F",
    yellow: "#F5C518",
    dim: "rgba(173,255,47,0.55)",
    panel: "rgba(173,255,47,0.04)",
};

const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0a0a", border: `1px solid ${C.border}`,
    color: C.accent, borderRadius: "8px", padding: "0.55rem 0.8rem",
    fontSize: "0.82rem", outline: "none", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
    color: C.dim, fontSize: "0.72rem", letterSpacing: "0.04em",
    textTransform: "uppercase", marginBottom: "4px", display: "block",
};
const rowStyle: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem",
};
const btnStyle: React.CSSProperties = {
    marginTop: "1rem", width: "100%", background: C.accent, color: "#000",
    border: "none", borderRadius: "8px", padding: "0.65rem", fontWeight: 700,
    fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.05em",
};

const ALL_CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Soybean", "Sugarcane", "Groundnut", "Tomato", "Onion", "Potato",
    "Mustard", "Turmeric", "Chilli", "Coffee", "Tea", "Rubber", "Coconut", "Apple", "Mango", "Banana",
    "Grapes", "Pomegranate", "Cardamom", "Black Pepper", "Cinamon", "Clove", "Garlic", "Ginger", "Jute",
    "Tobacco", "Barley", "Bajra", "Jowar", "Ragi", "Sunflower", "Safflower", "Sesame", "Linseed", "Castor",
    "Palm Oil", "Cashew", "Areca Nut", "Betel Leaf", "Cocoa", "Vanilla", "Peppermint", "Lavender", "Saffron"
];

const MODULES = [
    { id: "pest", icon: "🐛", label: "Pest & Disease", group: "Threats" },
    { id: "bird", icon: "🦅", label: "Bird Intrusion", group: "Threats" },
    { id: "animal", icon: "🐗", label: "Animal Intrusion", group: "Threats" },
    { id: "weather", icon: "🌤️", label: "Weather Stress", group: "Threats" },
];

interface Props {
    onSubmit: (question: string, payload?: Record<string, unknown>) => void;
}

export default function ModulePanel({ onSubmit }: Props) {
    const [active, setActive] = useState<string | null>("pest");
    const toggle = (id: string) => setActive(prev => prev === id ? null : id);

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {MODULES.map(m => (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <button onClick={() => toggle(m.id)} style={{
                        background: active === m.id ? C.accent : C.panel,
                        color: active === m.id ? "#000" : C.accent,
                        border: `1px solid ${active === m.id ? C.accent : C.border}`,
                        borderRadius: "10px", padding: "0.6rem 0.9rem",
                        fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        textAlign: "left",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        width: "100%",
                    }}>
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                        <span style={{
                            marginLeft: "auto", fontSize: "0.7rem", opacity: 0.5,
                            transform: active === m.id ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}>▼</span>
                    </button>

                    <div style={{
                        display: "grid",
                        gridTemplateRows: active === m.id ? "1fr" : "0fr",
                        opacity: active === m.id ? 1 : 0,
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        overflow: "hidden"
                    }}>
                        <div style={{ minHeight: "0px", paddingBottom: active === m.id ? "0.35rem" : "0" }}>
                            {active === m.id && m.id === "pest" && <PestPanel onSubmit={onSubmit} />}
                            {active === m.id && m.id === "bird" && <BirdPanel onSubmit={onSubmit} />}
                            {active === m.id && m.id === "animal" && <AnimalPanel onSubmit={onSubmit} />}
                            {active === m.id && m.id === "weather" && <WeatherPanel onSubmit={onSubmit} />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── MODULE COMPONENTS ──

function PestPanel({ onSubmit }: Props) {
    const [f, setF] = useState({ crop: "rice", growth_stage: "Vegetative", temperature: "30", humidity: "80", rainfall_last_week: "20", symptoms_observed: "", region: "Central India" });
    const sel = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));
    const inp = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));

    return (
        <Card title="🐛 Pest & Disease Advisory" desc="Identify and prevent insect infestations and diseases based on symptoms and conditions.">
            <div style={rowStyle}>
                <Field label="Crop">
                    <select style={inputStyle} value={f.crop} onChange={sel("crop")}>
                        {ALL_CROPS.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Growth Stage">
                    <select style={inputStyle} value={f.growth_stage} onChange={sel("growth_stage")}>
                        {["Sowing", "Seedling", "Vegetative", "Flowering", "Fruiting", "Harvesting"].map(s => <option key={s}>{s}</option>)}
                    </select>
                </Field>
                <Field label="Temperature (°C)"><input style={inputStyle} type="number" value={f.temperature} onChange={inp("temperature")} /></Field>
                <Field label="Humidity (%)"><input style={inputStyle} type="number" value={f.humidity} onChange={inp("humidity")} /></Field>
                <Field label="Rainfall Last Week (mm)"><input style={inputStyle} type="number" value={f.rainfall_last_week} onChange={inp("rainfall_last_week")} /></Field>
                <Field label="Region">
                    <select style={inputStyle} value={f.region} onChange={sel("region")}>
                        {["North India", "South India", "East India", "West India", "Central India", "North East India"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </Field>
            </div>
            <Field label="Symptoms Observed (describe in your words)">
                <textarea style={{ ...inputStyle, resize: "none", height: "60px" } as React.CSSProperties}
                    value={f.symptoms_observed} onChange={inp("symptoms_observed")} placeholder="e.g. white spots on leaves, stem turning yellow..." />
            </Field>
            <button style={btnStyle} onClick={() =>
                onSubmit(`pest diagnosis for ${f.crop} at ${f.growth_stage} stage in ${f.region} showing ${f.symptoms_observed || 'no specific symptoms'}`, { module: "pest", ...f, temperature: parseFloat(f.temperature), humidity: parseFloat(f.humidity), rainfall_last_week: parseFloat(f.rainfall_last_week) })}>
                ⚡ Analyze Pest Threat
            </button>
        </Card>
    );
}

function BirdPanel({ onSubmit }: Props) {
    const [f, setF] = useState({ crop: "wheat", growth_stage: "Fruiting", region: "North India", bird_type: "Unknown", damage_observed: "" });
    const sel = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));
    const inp = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));

    return (
        <Card title="🦅 Bird Intrusion Protection" desc="Get preventive measures and safe practices to protect crops from bird damage.">
            <div style={rowStyle}>
                <Field label="Crop">
                    <select style={inputStyle} value={f.crop} onChange={sel("crop")}>
                        {ALL_CROPS.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Growth Stage">
                    <select style={inputStyle} value={f.growth_stage} onChange={sel("growth_stage")}>
                        {["Sowing", "Seedling", "Vegetative", "Flowering", "Fruiting", "Harvesting"].map(s => <option key={s}>{s}</option>)}
                    </select>
                </Field>
                <Field label="Region">
                    <select style={inputStyle} value={f.region} onChange={sel("region")}>
                        {["North India", "South India", "East India", "West India", "Central India", "North East India"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </Field>
                <Field label="Suspected Bird Type">
                    <select style={inputStyle} value={f.bird_type} onChange={sel("bird_type")}>
                        {["Unknown", "Pigeons", "Crows", "Parrots", "Peacocks", "Sparrows", "Other"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
            </div>
            <Field label="Damage Description (optional)">
                <textarea style={{ ...inputStyle, resize: "none", height: "60px" } as React.CSSProperties}
                    value={f.damage_observed} onChange={inp("damage_observed")} placeholder="e.g. seeds eaten from pods, fruits pecked..." />
            </Field>
            <button style={btnStyle} onClick={() =>
                onSubmit(`bird protection for ${f.crop} against ${f.bird_type} in ${f.region}`, { module: "bird", ...f })}>
                ⚡ Get Bird Protection Plan
            </button>
        </Card>
    );
}

function AnimalPanel({ onSubmit }: Props) {
    const [f, setF] = useState({ crop: "maize", growth_stage: "Vegetative", region: "Central India", animal_type: "Wild Boar", field_condition: "Near Forest" });
    const sel = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));

    return (
        <Card title="🐗 Animal Intrusion Protection" desc="Practical action suggestions to protect against animal threats without harm.">
            <div style={rowStyle}>
                <Field label="Crop">
                    <select style={inputStyle} value={f.crop} onChange={sel("crop")}>
                        {ALL_CROPS.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Region">
                    <select style={inputStyle} value={f.region} onChange={sel("region")}>
                        {["North India", "South India", "East India", "West India", "Central India", "North East India"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </Field>
                <Field label="Suspected Animal">
                    <select style={inputStyle} value={f.animal_type} onChange={sel("animal_type")}>
                        {["Unknown", "Wild Boar", "Monkeys", "Elephants", "Nilgai / Blue Bull", "Stray Cattle", "Deer", "Rodents"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
                <Field label="Field Condition">
                    <select style={inputStyle} value={f.field_condition} onChange={sel("field_condition")}>
                        {["Open Field", "Near Forest", "Near Water Body", "Fenced", "Near Village"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
            </div>
            <button style={btnStyle} onClick={() =>
                onSubmit(`animal protection for ${f.crop} against ${f.animal_type} for field ${f.field_condition}`, { module: "animal", ...f })}>
                ⚡ Get Animal Protection Plan
            </button>
        </Card>
    );
}

function WeatherPanel({ onSubmit }: Props) {
    const [f, setF] = useState({ lat: "19.076", lon: "72.877", crop: "Paddy", stage: "Vegetative" });
    const sel = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));
    const locate = () => {
        if ("geolocation" in navigator)
            navigator.geolocation.getCurrentPosition(p => setF(prev => ({ ...prev, lat: String(p.coords.latitude.toFixed(4)), lon: String(p.coords.longitude.toFixed(4)) })));
    };

    return (
        <Card title="🌤️ Weather & Environmental Stress" desc="Timely protection advice based on changing environmental conditions.">
            <div style={rowStyle}>
                <Field label="Latitude"><input style={inputStyle} value={f.lat} onChange={e => setF(p => ({ ...p, lat: e.target.value }))} /></Field>
                <Field label="Longitude"><input style={inputStyle} value={f.lon} onChange={e => setF(p => ({ ...p, lon: e.target.value }))} /></Field>
                <Field label="Crop">
                    <select style={inputStyle} value={f.crop} onChange={sel("crop")}>
                        {ALL_CROPS.map(c => <option key={c}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Growth Stage">
                    <select style={inputStyle} value={f.stage} onChange={sel("stage")}>
                        {["Sowing", "Seedling", "Vegetative", "Flowering", "Fruiting", "Harvesting"].map(s => <option key={s}>{s}</option>)}
                    </select>
                </Field>
            </div>
            <button onClick={locate} style={{ ...btnStyle, background: "transparent", color: C.accent, border: `1px solid ${C.border}`, marginTop: "0.5rem" }}>
                📍 Auto-Detect My Location
            </button>
            <button style={btnStyle} onClick={() =>
                onSubmit(`weather advice at lat=${f.lat} lon=${f.lon} for ${f.crop} at ${f.stage} stage`, { module: "weather", lat: parseFloat(f.lat), lon: parseFloat(f.lon), crop: f.crop, stage: f.stage })}>
                ⚡ Analyze Weather Threats
            </button>
        </Card>
    );
}

/* ── Shared helpers ── */
function Card({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) {
    return (
        <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: "12px",
            padding: "1.25rem 1.5rem", marginTop: "0.25rem",
        }}>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{title}</div>
            <div style={{ color: C.dim, fontSize: "0.75rem", marginBottom: "1rem" }}>{desc}</div>
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>{label}</label>
            {children}
        </div>
    );
}
