"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Simple admin credentials - in production, this should be in environment variables or database
const ADMIN_CREDENTIALS = {
  email: "admin@artlighthouse.com",
  password: "admin123", // Change this to a secure password
  name: "Admin User",
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("admin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this should call your backend API
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: AdminUser = {
        id: "1",
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
      };

      setUser(adminUser);
      localStorage.setItem("admin_user", JSON.stringify(adminUser));
      return true;
    }

    return false;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
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
