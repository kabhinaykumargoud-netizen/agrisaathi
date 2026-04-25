"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function EligibilitySection() {
    const linesRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const validLines = linesRef.current.filter(el => el !== null);
        gsap.fromTo(validLines,
            { opacity: 0, x: -10 },
            {
                opacity: 1,
                x: 0,
                stagger: 0.4,
                duration: 0.8,
                scrollTrigger: {
                    trigger: ".terminal-widget",
                    start: "top 80%"
                }
            }
        );
    }, []);

    return (
        <section id="eligibility" className="eligibility-section" style={{ padding: "8rem 0" }}>
            <div className="section-container">
                <div className="feature-row">
                    <div className="feature-content">
                        <div className="section-label" style={{ color: "var(--vibrant-yellow)" }}>Live Audit Engine</div>
                        <h2 className="section-title text-bright-white">
                            INSTANT <span className="text-high-vis">SUBSIDY SCAN</span>
                        </h2>
                        <p className="text-bright-white" style={{ marginTop: "1.5rem", fontSize: "1.1rem", opacity: 0.9 }}>
                            AgriSaathi checks your profile against 100+ government systems in seconds.
                            We find exactly what you are eligible for and help you apply without the stress of complicated forms.
                        </p>
                        <ul style={{ marginTop: "2rem", listStyle: "none", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                            {[
                                "Avoid double-claiming mistakes",
                                "Auto-prepare Bank loan (KCC) papers",
                                "State-specific bonus alerts"
                            ].map((item, i) => (
                                <li key={i} className="text-bright-white" style={{ display: "flex", alignItems: "center", gap: "1rem", fontWeight: "bold" }}>
                                    <div style={{ width: "8px", height: "8px", background: "var(--vibrant-green)", transform: "rotate(45deg)" }}></div> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="feature-vis">
                        <div className="terminal-widget skeuo-clay" style={{ padding: "0", background: "#05080A" }}>
                            <div className="terminal-header" style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "#0D1117" }}>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <span style={{ width: "10px", height: "10px", background: "#FF5F56", borderRadius: "50%" }}></span>
                                    <span style={{ width: "10px", height: "10px", background: "#FFBD2E", borderRadius: "50%" }}></span>
                                    <span style={{ width: "10px", height: "10px", background: "#27C93F", borderRadius: "50%" }}></span>
                                </div>
                            </div>
                            <div style={{ padding: "2rem", fontFamily: "monospace", fontSize: "0.9rem" }}>
                                <div ref={el => { linesRef.current[0] = el; }} className="text-bright-white" style={{ marginBottom: "0.8rem" }}>
                                    <span style={{ color: "var(--vibrant-green)" }}>admin@agrisaathi:</span><span style={{ color: "var(--vibrant-yellow)" }}>~$</span> scan_eligibility --farmer_id=UP4102
                                </div>
                                <div ref={el => { linesRef.current[1] = el; }} style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>[ANALYZING] Connecting to State Land Records...</div>
                                <div ref={el => { linesRef.current[2] = el; }} className="text-high-vis" style={{ marginBottom: "0.5rem" }}>[FOUND] Land Area: 2.1 Hectares Corrected</div>
                                <div ref={el => { linesRef.current[3] = el; }} style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>[SCANNING] PM-KISAN Beneficiary Status...</div>
                                <div ref={el => { linesRef.current[4] = el; }} className="text-high-vis" style={{ marginBottom: "0.5rem" }}>[ELIGIBLE] PM-KISAN Active Installation: OK</div>
                                <div ref={el => { linesRef.current[5] = el; }} style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>[CALCULATING] New Credit Potential...</div>
                                <div ref={el => { linesRef.current[6] = el; }} style={{ color: "var(--vibrant-green)", fontWeight: "bold", fontSize: "1.1rem" }}>[RESULT] Suggested Credit Limit: ₹2,45,000</div>
                                <div ref={el => { linesRef.current[7] = el; }} style={{ color: "var(--vibrant-yellow)", marginTop: "1.5rem" }}>[ALERT] Your Interest Rebate is Pending!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
