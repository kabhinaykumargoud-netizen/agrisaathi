"use client";
export default function PrivacyPolicyPage() {
    return (
        <div style={{ background: "#05080A", minHeight: "100vh", color: "#fff", padding: "6rem 2rem", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <a href="/" style={{ color: "#00FF7F", fontSize: "0.9rem", textDecoration: "none", fontFamily: "monospace" }}>← Back to AgriSaathi</a>

                <h1 style={{ fontSize: "3rem", fontWeight: 900, marginTop: "2rem", marginBottom: "0.5rem" }}>Privacy Policy</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", marginBottom: "3rem" }}>Last updated: March 2026</p>

                {[
                    {
                        title: "1. Information We Collect",
                        body: "When you sign in using Facebook or Google OAuth, we collect your name, email address, and profile picture as provided by those services. If you use phone login, we collect your phone number. We do not collect any data beyond what is necessary to create and manage your account on AgriSaathi."
                    },
                    {
                        title: "2. How We Use Your Information",
                        body: "We use your information solely to: (a) Create and manage your AgriSaathi account, (b) Personalize your experience on the platform, (c) Send you agricultural advice and government scheme updates you request, (d) Send OTP verification codes for phone login. We do not sell, trade, or rent your personal information to any third parties."
                    },
                    {
                        title: "3. Data Storage",
                        body: "Your account data is stored securely in Supabase, a PostgreSQL-based cloud database hosted in Singapore. All data is encrypted in transit (TLS) and at rest. We retain your data for as long as your account is active. You may request deletion at any time."
                    },
                    {
                        title: "4. Facebook Login",
                        body: "When you use 'Sign in with Facebook,' we access only your public profile and email address as permitted by your Facebook privacy settings. We do not access your friends list, posts, or any other data. We do not post anything to your Facebook account."
                    },
                    {
                        title: "5. Third-Party Services",
                        body: "AgriSaathi uses Supabase for authentication and database services. We may use SMS providers (Twilio, Fast2SMS) to send OTP verification codes to your phone number. These services have their own privacy policies."
                    },
                    {
                        title: "6. Your Rights",
                        body: "You have the right to: (a) Access the personal data we hold about you, (b) Request correction of inaccurate data, (c) Request deletion of your account and all associated data, (d) Withdraw consent for data processing at any time. To exercise these rights, visit our Data Deletion page or contact us."
                    },
                    {
                        title: "7. Contact Us",
                        body: "For any privacy-related concerns, contact us at: privacy@agrisaathi.ai\n\nAgriSaathi AI\nPune, Maharashtra, India"
                    }
                ].map((section, i) => (
                    <div key={i} style={{ marginBottom: "2.5rem", padding: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <h2 style={{ fontSize: "1.2rem", color: "#00FF7F", marginBottom: "1rem", fontFamily: "monospace" }}>{section.title}</h2>
                        <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.8", fontSize: "0.95rem" }}>{section.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
