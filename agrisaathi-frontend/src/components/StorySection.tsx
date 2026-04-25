"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const img1Ref = useRef<HTMLDivElement>(null);
    const img2Ref = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLDivElement>(null);
    const text2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // cinematic reveal masks logic
            [img1Ref, img2Ref].forEach((ref) => {
                if (ref.current) {
                    gsap.fromTo(ref.current,
                        { clipPath: "inset(0 0 100% 0)" },
                        {
                            clipPath: "inset(0 0 0% 0)",
                            duration: 1.8,
                            ease: "power4.inOut",
                            scrollTrigger: {
                                trigger: ref.current,
                                start: "top 85%",
                            }
                        }
                    );
                }
            });

            // Text stagger reveals
            [text1Ref, text2Ref].forEach((ref) => {
                if (ref.current) {
                    gsap.from(ref.current.children, {
                        opacity: 0,
                        y: 40,
                        stagger: 0.2,
                        duration: 1.2,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: ref.current,
                            start: "top 75%",
                        }
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="story-section" style={{ padding: "12rem 0", overflow: "hidden" }}>
            <div className="section-container">
                {/* Story Point 1 */}
                <div className="story-row story-grid" style={{ marginBottom: "18rem" }}>
                    <div ref={text1Ref}>
                        <span className="sub-label">Power to the Farmer</span>
                        <h2 className="section-title text-bright-white">TAKE FULL <span className="text-high-vis">CONTROL</span></h2>
                        <p className="text-bright-white" style={{ marginTop: "2rem", fontSize: "1.2rem", lineHeight: "1.7", opacity: 0.85 }}>
                            Your data, your decisions. Scan your land records and instantly see every Rupee owed to you in subsidies, grants, and loan rebates.
                            AgriSaathi puts the power back into your hands, cutting out the middle-men entirely.
                        </p>
                    </div>
                    <div ref={img1Ref} className="skeuo-clay" style={{ padding: "0", overflow: "hidden", borderRadius: "24px" }}>
                        <Image
                            src="/farmer-tablet.png"
                            alt="Digital Empowerment"
                            width={600}
                            height={400}
                            style={{ display: "block", width: "100%", height: "auto" }}
                        />
                    </div>
                </div>

                {/* Story Point 2 */}
                <div className="story-row story-grid reverse">
                    <div ref={img2Ref} className="skeuo-clay" style={{ padding: "0", overflow: "hidden", borderRadius: "24px" }}>
                        <Image
                            src="/farmers-meeting.png"
                            alt="Community Strength"
                            width={600}
                            height={400}
                            style={{ display: "block", width: "100%", height: "auto" }}
                        />
                    </div>
                    <div ref={text2Ref} className="story-text">
                        <span className="sub-label">Collective Justice</span>
                        <h2 className="section-title text-bright-white">STRONGER <span className="text-high-vis">TOGETHER</span></h2>
                        <p className="text-bright-white" style={{ marginTop: "2rem", fontSize: "1.2rem", lineHeight: "1.7", opacity: 0.85 }}>
                            When whole villages face insurance rejections or water disputes, AgriSaathi's AI unites your community.
                            We find patterns across farms to build rock-solid legal cases, ensuring every small farmer gets the justice they deserve.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .story-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8rem;
                    align-items: center;
                }
                .story-grid.reverse > div:first-child {
                    order: 2;
                }
                .story-grid.reverse > div:last-child {
                    order: 1;
                }

                @media (max-width: 1024px) {
                    .story-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }
                    .story-grid.reverse > div:first-child {
                        order: 1;
                    }
                    .story-grid.reverse > div:last-child {
                        order: 2;
                    }
                    .story-row {
                        margin-bottom: 8rem !important;
                    }
                    .section-title {
                        font-size: 2.5rem !important;
                    }
                }
            `}</style>
        </section>
    );
}
