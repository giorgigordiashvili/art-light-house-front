"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  const isAuthenticated = isLoaded && isSignedIn;

  // Get user display name (first name or full name or email)
  const getDisplayName = useCallback(() => {
    if (!user) return "";
    return user.firstName || user.fullName || user.primaryEmailAddress?.emailAddress || "";
  }, [user]);

  // Get user profile image
  const getProfileImage = useCallback(() => {
    return user?.imageUrl || "/assets/user.svg";
  }, [user]);

  return {
    user,
    isLoaded,
    isAuthenticated,
    getDisplayName,
    getProfileImage,
    userId: user?.id,
  };
}
