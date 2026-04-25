"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navBtnRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { signup, loginWithSocial } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      await signup(fullName, email, password);
      router.push("/advisor");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsPending(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("");
    setIsPending(true);
    try {
      await loginWithSocial(provider);
    } catch (err: any) {
      setError(err.message || "Social signup failed");
      setIsPending(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Velocity Scroll Skew (Awwwards Style)
      let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".auth-page-content", "skewY", "deg"),
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

      gsap.set(".auth-page-content", { transformOrigin: "right center", force3D: true });

      // 2. Cinematic Card Reveal
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { clipPath: "inset(0 0 100% 0)", opacity: 0 },
          { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.8, ease: "power4.inOut", delay: 0.2 }
        );
      }

      // 3. Title char-drift reveal
      if (titleRef.current) {
        const words = titleRef.current.innerText.split(" ");
        titleRef.current.innerHTML = words
          .map(w => `<span class="word-wrap"><span class="char-drift">${w}</span></span>`)
          .join(" ");
        gsap.from(".char-drift", { y: "110%", stagger: 0.1, duration: 1.5, ease: "expo.out", opacity: 0, delay: 0.6 });
      }

      // 4. Subtitle fade
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, { opacity: 0, y: 20, duration: 1, ease: "expo.out", delay: 0.9 });
      }

      // 5. Stagger form fields
      if (formRef.current) {
        gsap.from(formRef.current.children, { opacity: 0, y: 40, stagger: 0.15, duration: 1.2, ease: "expo.out", delay: 1.0 });
      }

      // 6. Social stagger
      if (socialRef.current) {
        gsap.from(socialRef.current.children, { opacity: 0, y: 30, stagger: 0.12, duration: 1, ease: "expo.out", delay: 1.6 });
      }

      // 7. Magnetic CTA
      const btn = btnRef.current;
      if (btn) {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: "power2.out" });
        };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
      }

      // 8. Nav Button Magnetic
      const nbBtn = navBtnRef.current?.querySelector(".nb-btn-brutal-nav") as HTMLElement;
      if (nbBtn) {
        const onNbMove = (e: MouseEvent) => {
          const r = nbBtn.getBoundingClientRect();
          gsap.to(nbBtn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: "power2.out" });
        };
        const onNbLeave = () => gsap.to(nbBtn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        nbBtn.addEventListener("mousemove", onNbMove);
        nbBtn.addEventListener("mouseleave", onNbLeave);
      }

      // 9. Nav Reveal
      gsap.from(".nb-nav", { opacity: 0, y: -20, duration: 1, ease: "expo.out", delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Full-screen video background */}
      <div className="nb-video-bg">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/animation.mp4" type="video/mp4" />
        </video>
        <div className="nb-video-overlay" />
      </div>

      <div className="auth-page-content">
        <nav className="nb-nav-global">
          <Link href="/" className="nb-logo-brutal" id="nav-logo">
            <span style={{ color: "#FFFF00" }}>AGRI</span><span style={{ color: "var(--vibrant-green)" }}>SAATHI</span>
          </Link>
          <div ref={navBtnRef} className="magnetic-wrap">
            <Link href="/login" className="nb-btn-brutal-nav">Sign In →</Link>
          </div>
        </nav>

        <main className="nb-main">
          <div ref={cardRef} className="nb-card">
            <div className="nb-badge">NEW CITIZEN</div>
            <h1 ref={titleRef} className="nb-title">Get Started Now</h1>
            <p ref={subtitleRef} className="nb-subtitle">Create your account and begin your journey</p>

            <form ref={formRef} className="nb-form" onSubmit={handleSignup}>
              {error && (
                <div style={{ background: "rgba(255, 0, 0, 0.2)", border: "2px solid #ff0000", padding: "1rem", color: "#fff", fontFamily: "JetBrains Mono", fontSize: "0.8rem" }}>
                  ERROR: {error}
                </div>
              )}

              <div className="nb-field">
                <label className="nb-label">FULL NAME</label>
                <input
                  type="text"
                  placeholder="Full Name (as per Aadhar)"
                  className="nb-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="nb-field">
                <label className="nb-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="nb-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="nb-field">
                <label className="nb-label">PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="nb-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="nb-check-row">
                <input type="checkbox" id="terms" className="nb-checkbox" required />
                <label htmlFor="terms" className="nb-check-label">I agree to the Terms & Conditions</label>
              </div>

              <button ref={btnRef} type="submit" className="nb-btn-primary" disabled={isPending}>
                {isPending ? "CREATING ACCOUNT..." : "SIGNUP ▸"}
              </button>
            </form>

            <div ref={socialRef} className="nb-social-section">
              <div className="nb-divider"><span>or</span></div>
              <div className="nb-social-row">
                <button
                  type="button"
                  className="nb-btn-social"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isPending}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </button>
                <button
                  type="button"
                  className="nb-btn-social"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isPending}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Facebook
                </button>
              </div>
            </div>

            <p className="nb-switch">
              Have an account? <Link href="/login" className="nb-switch-link">Sign In</Link>
            </p>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .word-wrap { display: inline-block; overflow: hidden; margin-right: 0.3em; }
        .char-drift { display: inline-block; }

        /* ═══ NAVIGATION BRUTALISM ═══ */
        .nb-nav-global {
          display: flex; justify-content: space-between; align-items: center;
          padding: 2rem 4rem;
          position: relative; z-index: 100;
        }
        
        .nb-logo-brutal {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 2.5rem !important; 
          letter-spacing: 4px !important;
          color: #FFFFFF !important; 
          text-decoration: none !important;
          text-shadow: 4px 4px 0px #000000 !important;
          font-weight: 400 !important;
          display: flex;
          align-items: center;
        }

        .nb-btn-brutal-nav {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 1.2rem !important; 
          letter-spacing: 2px !important;
          color: #000000 !important; 
          text-decoration: none !important;
          padding: 0.8rem 2rem !important;
          background: #FFFF00 !important; /* var(--vibrant-yellow) */
          border: 4px solid #000000 !important;
          box-shadow: 5px 5px 0px #000000 !important;
          transition: all 0.1s ease !important;
          display: inline-block !important;
        }
        .nb-btn-brutal-nav:hover {
          transform: translate(2px, 2px) !important;
          box-shadow: 2px 2px 0px #000000 !important;
        }

        /* ═══ VIDEO BG ═══ */
        .nb-video-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #000; }
        .nb-video-bg video {
          position: absolute; top: 50%; left: 50%;
          min-width: 100%; min-height: 100%;
          width: auto; height: auto;
          object-fit: cover;
          transform: translate(-50%, -50%);
        }
        .nb-video-overlay {
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        /* ═══ PAGE WRAPPER ═══ */
        .auth-page-content {
          position: relative; z-index: 10;
          min-height: 100vh;
          display: flex; flex-direction: column;
          will-change: transform;
        }

        /* ═══ MAIN ═══ */
        .nb-main {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 2rem;
        }

        /* ═══ CARD ═══ */
        .nb-card {
          width: 100%; max-width: 480px;
          padding: 3.5rem;
          background: transparent;
        }

        /* ═══ BADGE ═══ */
        .nb-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.75rem; font-weight: 800;
          letter-spacing: 0.2em;
          color: #000;
          background: #FFFF00; /* Yellow for citizen badge on signup */
          padding: 0.4rem 1rem;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        /* ═══ TITLE ═══ */
        .nb-title {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: clamp(2.5rem, 6vw, 4rem);
          letter-spacing: 4px;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 5px 5px 0px #000;
          margin-bottom: 0.5rem;
          line-height: 1;
        }
        .nb-subtitle {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 1.1rem; font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 3rem;
          text-shadow: 2px 2px 0px #000;
        }

        /* ═══ FORM ═══ */
        .nb-form { display: flex; flex-direction: column; gap: 1.8rem; }
        .nb-field { display: flex; flex-direction: column; gap: 0.6rem; }

        .nb-label {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.15em;
          color: #fff;
          text-shadow: 2px 2px 0px #000;
        }

        .nb-input {
          background: #fff;
          border: 4px solid #000;
          padding: 1rem 1.2rem;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 1rem;
          color: #000;
          outline: none;
          box-shadow: 6px 6px 0px #000;
          transition: transform 0.1s;
        }
        .nb-input:focus {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px #00FF7F;
        }

        /* ═══ CHECKBOX ═══ */
        .nb-check-row { display: flex; align-items: center; gap: 0.8rem; }
        .nb-checkbox {
          width: 20px; height: 20px;
          accent-color: #00FF7F;
          cursor: pointer;
          border: 3px solid #000;
        }
        .nb-check-label {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 0.9rem; font-weight: 500;
          color: #fff;
          text-shadow: 2px 2px 0px #000;
        }

        /* ═══ PRIMARY BUTTON ═══ */
        .nb-btn-primary {
          width: 100%; padding: 1.2rem;
          background: #00FF7F;
          color: #000;
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 1.8rem;
          letter-spacing: 4px;
          border: 4px solid #000;
          box-shadow: 8px 8px 0px #000;
          cursor: pointer;
          margin-top: 1rem;
        }
        .nb-btn-primary:hover {
          transform: translate(3px, 3px);
          box-shadow: 4px 4px 0px #000;
        }
        .nb-btn-primary:active {
          transform: translate(6px, 6px);
          box-shadow: 2px 2px 0px #000;
        }

        /* ═══ DIVIDER ═══ */
        .nb-divider {
          display: flex; align-items: center; gap: 1.5rem;
          margin: 2.5rem 0;
        }
        .nb-divider::before, .nb-divider::after {
          content: ''; flex: 1; height: 4px; background: #000;
          box-shadow: 2px 2px 0 rgba(255,255,255,0.2);
        }
        .nb-divider span {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.9rem; color: #fff; font-weight: 800;
        }

        /* ═══ SOCIAL BUTTONS ═══ */
        .nb-social-row { display: flex; gap: 1.5rem; }
        .nb-btn-social {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 0.8rem;
          padding: 1rem;
          background: #fff;
          color: #000;
          border: 4px solid #000;
          box-shadow: 6px 6px 0px #000;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 0.9rem; font-weight: 800;
          cursor: pointer;
          transition: all 0.1s;
        }
        .nb-btn-social:hover {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0px #000;
        }

        /* ═══ SWITCH ═══ */
        .nb-switch {
          text-align: center; margin-top: 2.5rem;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 1rem; font-weight: 500;
          color: #fff;
          text-shadow: 2px 2px 0px #000;
        }
        .nb-switch-link {
          color: #FFFF00;
          font-weight: 800;
          text-decoration: underline;
          margin-left: 0.5rem;
        }

        @media (max-width: 600px) {
          .nb-nav-global { padding: 1.5rem; }
          .nb-card { padding: 2rem 1.5rem; }
          .nb-social-row { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
