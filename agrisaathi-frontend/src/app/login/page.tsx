"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import VideoBg from "@/components/VideoBg";

export default function LoginPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const { login, loginWithSocial, verifyPhone, loginWithPhone } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      if (loginType === "email") {
        await login(email, password);
        router.push("/advisor");
      } else {
        const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+91${phone.trim()}`;
        if (!showOtpField) {
          await verifyPhone(formattedPhone);
          setShowOtpField(true);
          setIsPending(false);
          return;
        }
        await loginWithPhone(formattedPhone, otp.trim());
        router.push("/advisor");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setIsPending(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("");
    setIsPending(true);
    try {
      await loginWithSocial(provider);
    } catch (err: any) {
      setError(err.message || "Social login failed");
      setIsPending(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.2 }
        );
      }
      if (titleRef.current) {
        gsap.from(titleRef.current, { opacity: 0, y: 20, duration: 1, ease: "expo.out", delay: 0.5 });
      }
      if (formRef.current) {
        gsap.from(Array.from(formRef.current.children), {
          opacity: 0, y: 24, stagger: 0.1, duration: 0.9, ease: "expo.out", delay: 0.7,
        });
      }
      if (socialRef.current) {
        gsap.from(Array.from(socialRef.current.children), {
          opacity: 0, y: 16, stagger: 0.1, duration: 0.8, ease: "expo.out", delay: 1.1,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <VideoBg />

      <div className="auth-shell">
        <nav className="auth-nav">
          <Link href="/" className="auth-logo">
            <span style={{ color: "#FFFF00" }}>AGRI</span>
            <span style={{ color: "#00FF7F" }}>SAATHI</span>
          </Link>
          <Link href="/signup" className="auth-nav-link">
            New here? <strong>Sign Up →</strong>
          </Link>
        </nav>

        <main className="auth-center">
          <div ref={cardRef} className="auth-card">
            <div className="auth-card-header">
              <div className="auth-badge">🌾 AgriSaathi Intelligence</div>
              <h1 ref={titleRef} className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to your farming command center</p>
            </div>

            <div className="auth-toggle">
              <button
                type="button"
                className={`auth-toggle-btn ${loginType === "email" ? "active" : ""}`}
                onClick={() => { setLoginType("email"); setShowOtpField(false); }}
              >
                📧 Email
              </button>
              <button
                type="button"
                className={`auth-toggle-btn ${loginType === "phone" ? "active" : ""}`}
                onClick={() => { setLoginType("phone"); setShowOtpField(false); }}
              >
                📱 Phone
              </button>
            </div>

            <form ref={formRef} className="auth-form" onSubmit={handleLogin}>
              {error && (
                <div className="auth-error">
                  ⚠️ {error}
                </div>
              )}

              {loginType === "email" ? (
                <>
                  <div className="auth-field">
                    <label className="auth-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="auth-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className="auth-label">Password</label>
                      <a href="#" className="auth-forgot">Forgot password?</a>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-field">
                    <label className="auth-label">Phone Number <span className="auth-hint">+91 auto-prefixed</span></label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="auth-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={showOtpField}
                      required
                    />
                  </div>
                  {showOtpField && (
                    <div className="auth-field">
                      <label className="auth-label">OTP Code</label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="auth-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <div className="auth-remember">
                <input type="checkbox" id="remember" className="auth-checkbox" />
                <label htmlFor="remember" className="auth-check-label">Stay signed in for 30 days</label>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={isPending}>
                {isPending ? (
                  <span className="auth-spinner">⟳</span>
                ) : (
                  loginType === "phone" && !showOtpField ? "Send OTP →" : "Sign In →"
                )}
              </button>
            </form>

            <div ref={socialRef} className="auth-social-section">
              <div className="auth-divider"><span>or continue with</span></div>
              <div className="auth-social-row">
                <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("google")} disabled={isPending}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("facebook")} disabled={isPending}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            <p className="auth-switch-line">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="auth-switch-link">Create one →</Link>
            </p>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .auth-shell {
          position: relative; z-index: 10;
          min-height: 100vh; display: flex; flex-direction: column;
          font-family: var(--font-body);
        }
        .auth-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.5rem 3rem;
        }
        .auth-logo {
          font-family: var(--font-display); font-size: 2rem; letter-spacing: 4px;
          text-decoration: none; font-weight: 400;
        }
        .auth-nav-link {
          color: rgba(173,255,47,0.6); font-size: 0.85rem; text-decoration: none;
        }
        .auth-nav-link strong { color: #ADFF2F; }

        .auth-center {
          flex: 1; display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .auth-card {
          width: 100%; max-width: 460px;
          background: rgba(10, 16, 10, 0.72);
          border: 1px solid rgba(173,255,47,0.15);
          border-radius: 20px; padding: 2.5rem;
          max-height: 90vh; overflow-y: auto;
          backdrop-filter: blur(24px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }
        .auth-card-header { margin-bottom: 1.75rem; }
        .auth-badge {
          display: inline-flex; background: rgba(0,255,127,0.08);
          border: 1px solid rgba(0,255,127,0.2);
          color: #00FF7F; font-size: 0.72rem; font-weight: 600;
          padding: 0.35rem 0.85rem; border-radius: 20px; margin-bottom: 1rem;
        }
        .auth-title {
          font-family: var(--font-display); font-size: 2.5rem;
          color: #fff; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .auth-subtitle { color: rgba(173,255,47,0.45); font-size: 0.88rem; }

        .auth-toggle {
          display: flex; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 4px; gap: 4px; margin-bottom: 1.75rem;
        }
        .auth-toggle-btn {
          flex: 1; padding: 0.6rem; background: transparent; border: none; border-radius: 7px;
          color: rgba(173,255,47,0.45); font-weight: 600; cursor: pointer;
        }
        .auth-toggle-btn.active { background: rgba(173,255,47,0.12); color: #ADFF2F; }

        .auth-form { display: flex; flex-direction: column; gap: 1.4rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .auth-label { font-size: 0.78rem; font-weight: 600; color: rgba(173,255,47,0.65); }
        .auth-input {
          background: rgba(0,0,0,0.35); border: 1px solid rgba(173,255,47,0.15);
          border-radius: 10px; padding: 0.85rem 1.1rem; color: #fff; outline: none;
        }
        .auth-forgot { font-size: 0.75rem; color: rgba(173,255,47,0.45); text-decoration: none; }
        
        .auth-btn-primary {
          width: 100%; padding: 0.95rem; background: linear-gradient(135deg, #00FF7F, #00cc65);
          color: #000; font-family: var(--font-display); font-size: 1.35rem; border: none; border-radius: 10px; cursor: pointer;
        }

        .auth-divider { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: rgba(173,255,47,0.1); }
        .auth-divider span { font-size: 0.78rem; color: rgba(173,255,47,0.35); }

        .auth-social-row { display: flex; gap: 1rem; }
        .auth-social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.65rem;
          padding: 0.8rem; border-radius: 10px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer;
        }
      `}</style>
    </>
  );
}
