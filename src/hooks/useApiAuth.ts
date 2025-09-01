"use client";

import { useState, useEffect } from "react";
import { ApiAuthManager, ApiUser } from "@/lib/apiAuthManager";

/**
 * Hook to manage API authentication state
 */
export const useApiAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      const storedToken = ApiAuthManager.getToken();
      const storedUser = ApiAuthManager.getUser();

      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(ApiAuthManager.isAuthenticated());
      setIsLoading(false);

      console.log("🔍 API Auth Status:", {
        isAuthenticated: ApiAuthManager.isAuthenticated(),
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        user: storedUser,
      });
    };

    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "api_token" || e.key === "api_user") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Logout function
   */
  const logout = () => {
    ApiAuthManager.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("🚪 Logged out from API");
  };

  /**
   * Update authentication state (call after login/register)
   */
  const updateAuthState = () => {
    const storedToken = ApiAuthManager.getToken();
    const storedUser = ApiAuthManager.getUser();

    setToken(storedToken);
    setUser(storedUser);
    setIsAuthenticated(ApiAuthManager.isAuthenticated());
  };

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    logout,
    updateAuthState,
    // Helper functions
    getAuthHeader: ApiAuthManager.getAuthHeader,
  };
};
