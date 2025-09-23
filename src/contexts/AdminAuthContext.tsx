"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserLoginRequest } from "@/api/generated/interfaces";
import { userLogin, userLogout } from "@/api/generated/api";
import adminAxios from "@/api/admin-axios";

// The User interface now includes is_admin field from the API
// We can use it directly without extending the interface
type AdminUser = User;

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = "admin_access_token";
const ADMIN_REFRESH_KEY = "admin_refresh_token";
const ADMIN_USER_KEY = "admin_user";

// Admin-specific API function that uses admin axios instance
const adminUserProfile = async (): Promise<User> => {
  console.log("🔐 AdminAuthContext: Making admin profile request with admin axios");
  const response = await adminAxios.get(`/api/auth/profile/`);
  console.log("🔐 AdminAuthContext: Admin profile response:", response.data);
  return response.data;
};

// Function to check if user has admin privileges
const checkAdminStatus = (user: User): boolean => {
  console.log("🔍 Checking admin status for user:", user);
  console.log("🔍 is_admin value:", user.is_admin, "type:", typeof user.is_admin);

  // The API returns is_admin as a string
  const isAdmin = user.is_admin === "true";
  console.log("🔍 Final admin status:", isAdmin);

  return isAdmin;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAdminAuth = async () => {
      try {
        const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
        const savedUser = localStorage.getItem(ADMIN_USER_KEY);

        if (savedToken && savedUser) {
          // Verify token is still valid by fetching user profile
          try {
            console.log("🔄 AdminAuthContext: Verifying admin token with profile fetch");
            const profile = await adminUserProfile();
            console.log("🔄 AdminAuthContext: Profile fetched:", profile);

            if (checkAdminStatus(profile)) {
              console.log("✅ AdminAuthContext: User verified as admin, setting user state");
              setUser(profile);
              localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(profile));
            } else {
              console.log(
                "❌ AdminAuthContext: User no longer has admin privileges, clearing tokens"
              );
              // User is not admin, clear admin tokens
              localStorage.removeItem(ADMIN_TOKEN_KEY);
              localStorage.removeItem(ADMIN_REFRESH_KEY);
              localStorage.removeItem(ADMIN_USER_KEY);
            }
          } catch (error) {
            console.log("❌ AdminAuthContext: Token verification failed, clearing tokens:", error);
            // Token expired or invalid, clear storage
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_REFRESH_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);
          }
        }
      } catch (error) {
        console.error("Error initializing admin auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for forced admin logout events
    const handleAdminForceLogout = (event: CustomEvent) => {
      console.warn("🔒 Admin forced logout triggered:", event.detail?.reason || "unknown");
      setUser(null);
      setIsLoading(false);
    };

    initializeAdminAuth();

    // Add event listener for admin forced logout
    window.addEventListener("adminForceLogout", handleAdminForceLogout as EventListener);

    // Cleanup event listener
    return () => {
      window.removeEventListener("adminForceLogout", handleAdminForceLogout as EventListener);
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const credentials: UserLoginRequest = { email, password };
      console.log("🚀 Attempting admin login with:", { email });

      const response = await userLogin(credentials);
      console.log("✅ Login response received:", response);

      // Check if the logged-in user has admin privileges
      const isAdmin = checkAdminStatus(response.user);

      if (!isAdmin) {
        console.log("❌ User does not have admin privileges");
        // User doesn't have admin privileges
        return false;
      }

      console.log("✅ User has admin privileges, storing tokens and user data");

      // Store admin tokens separately from regular user tokens
      localStorage.setItem(ADMIN_TOKEN_KEY, response.access);
      localStorage.setItem(ADMIN_REFRESH_KEY, response.refresh);

      // The API response now includes is_admin field
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      console.log("✅ Admin login successful");
      return true;
    } catch (error) {
      console.error("❌ Admin login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Call logout API
      await userLogout();
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      // Clear admin tokens and user data
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_REFRESH_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AdminAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
