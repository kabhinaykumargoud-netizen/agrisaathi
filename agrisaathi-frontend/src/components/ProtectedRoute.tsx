"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{
                height: "100vh",
                background: "#05080A",
                color: "#ADFF2F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                letterSpacing: "0.1em"
            }}>
                🔐 AUTHENTICATING...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
