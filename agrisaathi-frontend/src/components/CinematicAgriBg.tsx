"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CinematicAgriBg() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const birdsRef = useRef<SVGSVGElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ── Background Parallax & Zoom ────────────────────────────
        gsap.to(bgRef.current, {
            scale: 1.15,
            duration: 40,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to(bgRef.current, {
                x: xPos,
                y: yPos,
                duration: 2,
                ease: "power2.out"
            });

            // Higher sensitivity for the sun flare
            gsap.to(overlayRef.current, {
                x: xPos * 1.5,
                y: yPos * 1.5,
                duration: 1.5,
                ease: "power2.out"
            });
        };

        window.addEventListener("mousemove", onMouseMove);

        // ── Bird Animation ────────────────────────────────────────
        if (birdsRef.current) {
            const birds = birdsRef.current.querySelectorAll(".bird");
            birds.forEach((bird, i) => {
                gsap.set(bird, {
                    x: -100,
                    y: 100 + Math.random() * 300,
                    scale: 0.5 + Math.random() * 0.5,
                    opacity: 0.6
                });

                const fly = () => {
                    gsap.to(bird, {
                        x: window.innerWidth + 200,
                        y: "+=" + (Math.random() * 200 - 100),
                        duration: 15 + Math.random() * 10,
                        delay: Math.random() * 5 + i * 2,
                        ease: "none",
                        onComplete: () => {
                            gsap.set(bird, { x: -200, y: 100 + Math.random() * 300 });
                            fly();
                        }
                    });
                };
                fly();
            });
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-black">
            {/* Desktop Background (16:9) */}
            <div
                ref={bgRef}
                className="hidden md:block absolute inset-[-10%] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/realistic-farm.png')`,
                    filter: 'contrast(1.1) saturate(1.1)'
                }}
            />

            {/* Mobile Background (9:16) */}
            <div
                className="block md:hidden absolute inset-[-10%] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/realistic-farm-mobile.png')`,
                    filter: 'contrast(1.1) saturate(1.1)'
                }}
            />

            {/* Sunlight / Lens Flare Overlay */}
            <div
                ref={overlayRef}
                className="absolute top-0 right-0 w-[80%] h-[80%] opacity-40 mix-blend-screen pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 70% 30%, rgba(255, 240, 200, 0.8) 0%, rgba(255, 180, 50, 0.2) 30%, transparent 60%)',
                    filter: 'blur(40px)'
                }}
            />

            {/* Animated Dust/Pollen Grains */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="pollen-container absolute inset-0 opacity-30">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full blur-[1px]"
                            style={{
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animation: `float ${10 + Math.random() * 20}s infinite linear`,
                                animationDelay: `-${Math.random() * 20}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Flying Birds SVG */}
            <svg ref={birdsRef} className="absolute inset-0 w-full h-full pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <g key={i} className="bird">
                        <path
                            d="M0,0 C2,4 6,4 10,0 C14,4 18,4 20,0"
                            fill="none"
                            stroke="#111"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <animate
                                attributeName="d"
                                values="M0,0 C2,4 6,4 10,0 C14,4 18,4 20,0; M0,5 C2,0 6,0 10,5 C14,0 18,0 20,5; M0,0 C2,4 6,4 10,0 C14,4 18,4 20,0"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                ))}
            </svg>

            {/* River Water Movement (SVG Displacement Map) */}
            <svg className="hidden">
                <filter id="water-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise">
                        <animate attributeName="baseFrequency" values="0.02; 0.03; 0.02" dur="10s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
                </filter>
            </svg>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translate(100px, -100px) rotate(360deg); opacity: 0; }
                }
            `}</style>

            {/* Bottom Vignette for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
