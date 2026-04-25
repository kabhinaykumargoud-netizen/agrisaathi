"use client";
import { useEffect, useRef } from "react";

/**
 * GlassmorphismBg — replaces the heavy video background.
 * Renders a CSS-animated multi-orb gradient + a thin canvas particle field.
 * Runs entirely on GPU (transform + opacity only). Zero external assets.
 */
export default function GlassmorphismBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    return (
        <>
            {/* ── Animated gradient orbs (CSS-only, GPU) ── */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 0,
                background: "linear-gradient(135deg, #05080A 0%, #040d06 50%, #05080A 100%)",
                overflow: "hidden", pointerEvents: "none",
            }}>
                {/* Orb 1 — large green */}
                <div style={{
                    position: "absolute", width: "900px", height: "900px",
                    borderRadius: "50%", top: "-200px", left: "-250px",
                    background: "radial-gradient(circle, rgba(0,255,127,0.07) 0%, transparent 70%)",
                    animation: "orbDrift1 18s ease-in-out infinite",
                }} />
                {/* Orb 2 — mid teal */}
                <div style={{
                    position: "absolute", width: "700px", height: "700px",
                    borderRadius: "50%", top: "30%", right: "-180px",
                    background: "radial-gradient(circle, rgba(0,200,180,0.06) 0%, transparent 70%)",
                    animation: "orbDrift2 22s ease-in-out infinite",
                }} />
                {/* Orb 3 — small amber accent */}
                <div style={{
                    position: "absolute", width: "500px", height: "500px",
                    borderRadius: "50%", bottom: "-100px", left: "40%",
                    background: "radial-gradient(circle, rgba(245,197,11,0.05) 0%, transparent 70%)",
                    animation: "orbDrift3 14s ease-in-out infinite",
                }} />
                {/* Subtle grid lines */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(0,255,127,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,255,127,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }} />
            </div>

            {/* ── Canvas particle layer ── */}
            <canvas ref={canvasRef} style={{
                position: "fixed", inset: 0, zIndex: 1,
                pointerEvents: "none", opacity: 0.7,
            }} />

            <style>{`
                @keyframes orbDrift1 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33% { transform: translate(80px,-60px) scale(1.08); }
                    66% { transform: translate(-40px,80px) scale(0.96); }
                }
                @keyframes orbDrift2 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    40% { transform: translate(-100px,50px) scale(1.05); }
                    70% { transform: translate(60px,-80px) scale(0.97); }
                }
                @keyframes orbDrift3 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    50% { transform: translate(-60px,-40px) scale(1.1); }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation: none !important; }
                }
            `}</style>
        </>
    );
}
