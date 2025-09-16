"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoaded = status !== "loading";
  const isAuthenticated = isLoaded && !!session?.user;

  // Get user display name (name or email)
  const getDisplayName = useCallback(() => {
    if (!session?.user) return "";
    return session.user.name || session.user.email || "";
  }, [session?.user]);

  // Get user profile image
  const getProfileImage = useCallback(() => {
    return session?.user?.image || "/assets/user.svg";
  }, [session?.user]);

  return {
    user: session?.user,
    isLoaded,
    isAuthenticated,
    getDisplayName,
    getProfileImage,
    userId: session?.user?.id,
  };
}
