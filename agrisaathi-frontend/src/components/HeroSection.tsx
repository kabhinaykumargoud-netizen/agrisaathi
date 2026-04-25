"use client";
import { useEffect, useRef } from "react";
import StatTicker from "./StatTicker";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // High-End Title Reveal
        if (titleRef.current) {
            const splitText = titleRef.current.innerText.split(" ");
            titleRef.current.innerHTML = splitText
                .map(word => `<span class="word-wrap" style="display:inline-block; overflow:hidden;">
                    <span class="char-drift" style="display:inline-block;">${word}</span>
                </span>`)
                .join(" ");

            gsap.from(".char-drift", {
                y: "110%",
                stagger: 0.1,
                duration: 1.5,
                ease: "expo.out",
                opacity: 0
            });
        }

        // Magnetic CTA
        const btn = btnRef.current;
        if (btn) {
            const onMouseMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.5,
                    ease: "power2.out"
                });
            };
            const onMouseLeave = () => {
                gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
            };
            btn.addEventListener("mousemove", onMouseMove);
            btn.addEventListener("mouseleave", onMouseLeave);
            return () => {
                btn.removeEventListener("mousemove", onMouseMove);
                btn.removeEventListener("mouseleave", onMouseLeave);
            };
        }
    }, []);

    return (
        <section className="hero-section" ref={heroRef} style={{ padding: "12rem 0 8rem 0", overflow: "visible" }}>
            <div className="section-container hero-grid">
                <div className="hero-content">
                    <div className="sub-label">
                        Bharat's First AI Agriculture Copilot
                    </div>

                    <h1 className="hero-title text-bright-white" ref={titleRef} style={{
                        marginTop: "1.5rem",
                        fontSize: "clamp(3rem, 5.5vw, 6rem)",
                        lineHeight: "1",
                        fontWeight: "900",
                        letterSpacing: "-2px"
                    }}>
                        GROW SMARTER <br />
                        <span className="text-high-vis">OWN YOUR FUTURE</span>
                    </h1>

                    <p className="hero-subtitle text-bright-white" style={{
                        marginTop: "2.5rem",
                        fontSize: "1.25rem",
                        lineHeight: "1.6",
                        maxWidth: "600px",
                        opacity: 0.85
                    }}>
                        Unlock government subsidies instantly and track market prices in real-time.
                        We handle the paperwork, you handle the harvest. Secure, simple, and 100% free.
                    </p>

                    <div className="hero-cta-row" style={{ marginTop: "4rem" }}>
                        <div ref={btnRef} className="magnetic-wrap">
                            <Link href="/login" className="btn-auth-primary" style={{ padding: "1.2rem 3rem", fontSize: "1.1rem" }}>
                                Start Now ▸
                            </Link>
                        </div>
                        <a href="#modules" className="text-bright-white how-it-works-link">
                            How it works
                        </a>
                    </div>
                </div>

                <div className="hero-visual desktop-only">
                    <div className="skeuo-clay" style={{ borderRadius: "24px", padding: "12px", background: "rgba(0,0,0,0.4)" }}>
                        <Image
                            src="/farmer-hero.png"
                            alt="AgriSaathi Vision"
                            width={600}
                            height={700}
                            className="hero-image"
                            style={{ borderRadius: "16px", objectFit: "cover" }}
                            priority
                        />
                        <div className="scan-line"></div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "10rem" }}>
                <StatTicker />
            </div>

            <style jsx>{`
                .word-wrap { margin-right: 0.3em; }
                .hero-image { width: 100%; height: auto; }
                .hero-visual { position: relative; }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 4rem;
                    align-items: center;
                }
                .scan-line {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: var(--vibrant-green);
                    box-shadow: 0 0 25px var(--vibrant-green);
                    animation: scan 6s linear infinite;
                    opacity: 0.6;
                }
                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 2rem;
                    }
                    .hero-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-title {
                        font-size: 3.5rem !important;
                    }
                    .hero-subtitle {
                        margin: 2rem auto 0 auto !important;
                    }
                    .hero-visual {
                        display: none;
                    }
                    .hero-section {
                        padding: 8rem 0 4rem 0 !important;
                    }
                    .hero-cta-row {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        align-items: center;
                    }
                    .how-it-works-link {
                        font-size: 0.9rem;
                        font-weight: 800;
                        text-decoration: underline;
                        text-underline-offset: 8px;
                    }
                }

                @media (min-width: 1025px) {
                    .hero-cta-row {
                        display: flex;
                        gap: 2rem;
                        align-items: center;
                    }
                    .how-it-works-link {
                        font-size: 0.9rem;
                        font-weight: 800;
                        text-decoration: underline;
                        text-underline-offset: 8px;
                    }
                }
            `}</style>
        </section>
    );
}
