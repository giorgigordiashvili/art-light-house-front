"use client";

import { useCallback } from "react";
import { useAuth as useCustomAuth } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, isAuthenticated } = useCustomAuth();

  // Get user display name
  const getDisplayName = useCallback(() => {
    if (!user) return "";
    return `${user.first_name} ${user.last_name}`.trim() || user.email || "";
  }, [user]);

  // Get user profile image
  const getProfileImage = useCallback(() => {
    return "/assets/user.svg"; // Using default image for basic auth
  }, []);

  return {
    user,
    isLoaded: true, // Always loaded for basic auth
    isAuthenticated,
    getDisplayName,
    getProfileImage,
    userId: user?.id.toString(),
  };
}
