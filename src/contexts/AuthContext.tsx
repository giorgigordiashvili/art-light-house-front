"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { EcommerceClient, ClientLogin } from "@/api/generated/interfaces";
import { loginClient, getCurrentClient } from "@/api/generated/api";

interface AuthContextType {
  user: EcommerceClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ClientLogin) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: EcommerceClient) => void;
  token: string | null;
  loginWithTokens: (user: EcommerceClient, access: string, refresh: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<EcommerceClient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage or API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedToken !== "cookie-based" && storedUser) {
          // We have a token stored, verify it's still valid
          try {
            const currentUser = await getCurrentClient();
            setUser(currentUser);
            setToken(storedToken);
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
          } catch {
            // Token invalid, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_KEY);
            localStorage.removeItem(USER_KEY);
          }
        } else if (storedToken === "cookie-based" && storedUser) {
          // Using cookie-based auth, just load user from storage
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        // If no token at all, user is not authenticated - don't call API
      } catch {
        // Clear corrupted data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for forced logout events from axios interceptor
    const handleForceLogout = () => {
      // Clear state immediately when forced logout occurs
      setToken(null);
      setUser(null);
      setIsLoading(false);
    };

    initializeAuth();

    // Add event listener for forced logout
    window.addEventListener("forceLogout", handleForceLogout as EventListener);

    // Cleanup event listener
    return () => {
      window.removeEventListener("forceLogout", handleForceLogout as EventListener);
    };
  }, []);

  const login = async (credentials: ClientLogin): Promise<void> => {
    setIsLoading(true);
    try {
      // New API returns just the client, tokens are in httpOnly cookies
      const client = await loginClient(credentials);

      // Store user data (tokens handled by cookies)
      localStorage.setItem(USER_KEY, JSON.stringify(client));
      localStorage.setItem(TOKEN_KEY, "cookie-based"); // Placeholder

      // Update state
      setToken("cookie-based");
      setUser(client);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call logout API if available (cookies will be cleared by backend)
      // Note: There's no specific client logout endpoint in new API,
      // tokens are httpOnly cookies cleared by backend
    } catch {
      // Continue with local logout even if API fails
    } finally {
      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);

      // Clear state
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = (userData: EcommerceClient): void => {
    try {
      // Update localStorage with new user data
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Update state
      setUser(userData);
    } catch {
      // Failed to update user data
    }
  };

  const loginWithTokens = (userData: EcommerceClient, access: string, refresh: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(access);
      setUser(userData);
    } catch {
      // Failed to store tokens
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser,
    token,
    loginWithTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
