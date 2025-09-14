"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SessionRestoreProps {
  children: React.ReactNode;
}

export default function SessionRestore({ children }: SessionRestoreProps) {
  const { data: session, status } = useSession();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      // If already have NextAuth session, no need to restore
      if (session?.user) {
        setIsRestoring(false);
        return;
      }

      // If NextAuth is still loading, wait
      if (status === "loading") {
        return;
      }

      // Check if we have stored tokens but no NextAuth session
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("access_token");
        const storedTokenType = localStorage.getItem("token_type");

        if (storedToken && storedTokenType) {
          console.log("🔄 Found stored tokens, attempting to restore session...");

          try {
            // Verify token with backend by making a test API call
            const response = await fetch("https://api.artlighthouse.ge/me", {
              headers: {
                Authorization: `${storedTokenType} ${storedToken}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const userData = await response.json();
              console.log("✅ Token is valid, user data:", userData);

              // Store user data if not already stored
              const storedUser = localStorage.getItem("api_user");
              if (!storedUser && userData.user) {
                localStorage.setItem("api_user", JSON.stringify(userData.user));
                console.log("👤 User data stored in localStorage");
              }

              console.log("🎉 Session restoration successful");
            } else {
              console.warn("❌ Stored token is invalid, cleaning up...");
              // Token is invalid, clean up
              localStorage.removeItem("access_token");
              localStorage.removeItem("token_type");
              localStorage.removeItem("api_user");
            }
          } catch (error) {
            console.error("❌ Error verifying stored token:", error);
            // On error, clean up potentially invalid tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");
            localStorage.removeItem("api_user");
          }
        }
      }

      setIsRestoring(false);
    };

    restoreSession();
  }, [session, status]);

  // Show loading state while restoring session
  if (isRestoring) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0b0b0b",
          color: "#ffffff",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
