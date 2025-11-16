"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import adminAxios from "@/api/admin-axios";

// Admin-specific types (not part of ecommerce client API)
interface TenantLogin {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean | string;
}

// Admin login/logout API functions
const tenantLogin = async (data: TenantLogin): Promise<{ token?: string; message?: string }> => {
  const response = await adminAxios.post(`/api/auth/tenant-login/`, data);
  return response.data;
};

const tenantLogout = async (): Promise<void> => {
  await adminAxios.post(`/api/auth/tenant-logout/`);
};

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
      const credentials: TenantLogin = { email, password };

      const response = await tenantLogin(credentials);

      // Check if we have a valid token
      if (!response.token) {
        return false;
      }

      // Store admin tokens
      localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
      // Note: tenantLogin doesn't return refresh token, store the same token or handle differently
      localStorage.setItem(ADMIN_REFRESH_KEY, response.token);

      // Fetch user profile after successful login
      try {
        const profile = await adminUserProfile();
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(profile));
        setUser(profile);
        return true;
      } catch {
        // Failed to fetch profile
        return false;
      }
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
      await tenantLogout();
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
