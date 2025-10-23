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
  const response = await adminAxios.get(`/api/auth/profile/`);
  return response.data;
};

// Function to check if user has admin privileges
const checkAdminStatus = (user: User): boolean => {
  // Handle both boolean and string types for is_admin
  const isAdmin = (user.is_admin as any) === true || user.is_admin === "true";

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
            const profile = await adminUserProfile();

            if (checkAdminStatus(profile)) {
              setUser(profile);
              localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(profile));
            } else {
              // User is not admin, clear admin tokens
              localStorage.removeItem(ADMIN_TOKEN_KEY);
              localStorage.removeItem(ADMIN_REFRESH_KEY);
              localStorage.removeItem(ADMIN_USER_KEY);
            }
          } catch {
            // Token expired or invalid, clear storage
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_REFRESH_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);
          }
        }
      } catch {
        // Error initializing admin auth
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for forced admin logout events
    const handleAdminForceLogout = () => {
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

      const response = await userLogin(credentials);

      // Check if the logged-in user has admin privileges
      const isAdmin = checkAdminStatus(response.user);

      if (!isAdmin) {
        // User doesn't have admin privileges
        return false;
      }

      // Store admin tokens separately from regular user tokens
      localStorage.setItem(ADMIN_TOKEN_KEY, response.access);
      localStorage.setItem(ADMIN_REFRESH_KEY, response.refresh);

      // The API response now includes is_admin field
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      return true;
    } catch {
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
    } catch {
      // Continue with logout even if API call fails
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
