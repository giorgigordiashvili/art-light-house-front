"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
}

export function useAuthState(): AuthState {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthState = () => {
      // If NextAuth session exists, use it
      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          user: session.user,
          isLoading: false,
        });
        return;
      }

      // If NextAuth is still loading, wait
      if (status === "loading") {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        return;
      }

      // If no NextAuth session, check localStorage for backend tokens
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("api_user");

        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("🔄 Using stored authentication data:", {
              hasToken: !!storedToken,
              user: userData.first_name || userData.name,
            });

            setAuthState({
              isAuthenticated: true,
              user: {
                id: userData.id?.toString(),
                name: userData.first_name || userData.name,
                email: userData.email,
                // Create a fallback user object for UI compatibility
              },
              isLoading: false,
            });
            return;
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            // Clean up invalid data
            localStorage.removeItem("api_user");
          }
        }
      }

      // No authentication found
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    checkAuthState();
  }, [session, status]);

  return authState;
}
