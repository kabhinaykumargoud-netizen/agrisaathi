"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import ModulesSection from "@/components/ModulesSection";
import EligibilitySection from "@/components/EligibilitySection";
import MarketSection from "@/components/MarketSection";
import ContractsSection from "@/components/ContractsSection";
import SchemesSection from "@/components/SchemesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import Footer from "@/components/Footer";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Glassmorphism background (replaces video — lighter, GPU-only, works on all devices)
const GlassmorphismBg = dynamic(() => import("@/components/GlassmorphismBg"), { ssr: false });

export default function Home() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Global Velocity Scroll Skew (Awwwards Style)
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".page-content", "skewY", "deg"),
            clamp = gsap.utils.clamp(-10, 10);

        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -400);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, {
                        skew: 0,
                        duration: 0.8,
                        ease: "power3",
                        overwrite: true,
                        onUpdate: () => skewSetter(proxy.skew)
                    });
                }
            }
        });

        gsap.set(".page-content", { transformOrigin: "right center", force3D: true });
    }, []);

    return (
        <>
            <GlassmorphismBg />

            <div className="page-content" ref={mainRef}>
                <Navbar />
                <main>
                    <HeroSection />

                    {/* Immersive Narrative Layer */}
                    <StorySection />

                    <ModulesSection />

                    <div className="feature-layers" style={{ position: "relative", zIndex: 10 }}>
                        <ContractsSection />
                    </div>

                    <SchemesSection />

                    {/* CTA Section - Redesigned with Design Master v2.5 */}
                    <section id="ai-cta" style={{ padding: "12rem 0", textAlign: "center", borderTop: "1px solid rgba(0,255,127,0.1)" }}>
                        <div className="section-container">
                            <div className="sub-label" style={{ margin: "0 auto 1.5rem auto" }}>Final Interface Access</div>
                            <h2 className="section-title text-bright-white" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
                                READY TO UPGRADE <br />
                                <span className="text-high-vis">YOUR FARMING IDENTITY?</span>
                            </h2>
                            <p className="text-bright-white" style={{ marginTop: "2.5rem", opacity: 0.8, maxWidth: "650px", margin: "2.5rem auto", fontSize: "1.1rem" }}>
                                Connect your Aadhar records and land profile to access 24/7 agricultural intelligence.
                                Secure your harvest today with Bharat's most advanced AI advisor.
                            </p>
                            <div style={{ marginTop: "4rem" }}>
                                <Link href="/login" className="btn-auth-primary" style={{ padding: "1.2rem 4rem", fontSize: "1.2rem" }}>
                                    TALK TO AI ADVISOR ▸
                                </Link>
                            </div>
                        </div>
                    </section>

                    <ArchitectureSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
