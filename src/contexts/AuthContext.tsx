"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserLoginRequest, UserLoginResponse } from "@/api/generated/interfaces";
import { userLogin, userLogout } from "@/api/generated/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for forced logout events from axios interceptor
    const handleForceLogout = (event: CustomEvent) => {
      console.warn("🔒 Forced logout triggered:", event.detail?.reason || "unknown");
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

  const login = async (credentials: UserLoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response: UserLoginResponse = await userLogin(credentials);

      // Store tokens and user data
      localStorage.setItem(TOKEN_KEY, response.access);
      localStorage.setItem(REFRESH_KEY, response.refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Update state
      setToken(response.access);
      setUser(response.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call logout API if needed
      await userLogout();
    } catch (error) {
      console.error("Logout API error:", error);
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

  const updateUser = (userData: User): void => {
    try {
      // Update localStorage with new user data
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Update state
      setUser(userData);

      console.log("✅ User data updated in AuthContext:", userData);
    } catch (error) {
      console.error("Error updating user data:", error);
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
