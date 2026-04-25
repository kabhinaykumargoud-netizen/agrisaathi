"use client";
import { useState } from "react";

export default function DataDeletionPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div style={{ background: "#05080A", minHeight: "100vh", color: "#fff", padding: "6rem 2rem", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <a href="/" style={{ color: "#00FF7F", fontSize: "0.9rem", textDecoration: "none", fontFamily: "monospace" }}>← Back to AgriSaathi</a>

                <h1 style={{ fontSize: "3rem", fontWeight: 900, marginTop: "2rem", marginBottom: "0.5rem" }}>Data Deletion</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", marginBottom: "3rem" }}>Request deletion of your AgriSaathi account and all associated data.</p>

                <div style={{ padding: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "2rem" }}>
                    <h2 style={{ color: "#00FF7F", fontFamily: "monospace", marginBottom: "1rem", fontSize: "1rem" }}>WHAT WILL BE DELETED</h2>
                    <ul style={{ color: "rgba(255,255,255,0.75)", lineHeight: "2", paddingLeft: "1.5rem", fontSize: "0.95rem" }}>
                        <li>Your AgriSaathi account and profile</li>
                        <li>All chat history with the AI Advisor</li>
                        <li>Saved government schemes and eligibility data</li>
                        <li>Phone number and email address</li>
                        <li>Any linked Facebook / Google OAuth tokens</li>
                    </ul>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "1rem", fontFamily: "monospace" }}>
                        Processing time: 7 business days. You will receive a confirmation email once deletion is complete.
                    </p>
                </div>

                {!submitted ? (
                    <div style={{ padding: "2rem", background: "rgba(255,0,0,0.04)", borderRadius: "12px", border: "1px solid rgba(255,60,60,0.2)" }}>
                        <h2 style={{ color: "#ff6666", fontFamily: "monospace", marginBottom: "1.5rem", fontSize: "1rem" }}>REQUEST ACCOUNT DELETION</h2>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                            YOUR REGISTERED EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{ width: "100%", padding: "1rem", background: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", color: "#000", marginBottom: "1.5rem", boxSizing: "border-box" }}
                        />
                        <button
                            onClick={() => email && setSubmitted(true)}
                            style={{ width: "100%", padding: "1rem", background: "transparent", border: "2px solid #ff6666", color: "#ff6666", borderRadius: "8px", fontFamily: "monospace", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
                        >
                            SUBMIT DELETION REQUEST
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: "2rem", background: "rgba(0,255,127,0.04)", borderRadius: "12px", border: "1px solid rgba(0,255,127,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                        <h2 style={{ color: "#00FF7F", fontFamily: "monospace", marginBottom: "0.5rem" }}>REQUEST RECEIVED</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                            We will delete all data associated with <strong style={{ color: "#fff" }}>{email}</strong> within 7 business days.
                            You will receive a confirmation at that email address.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
