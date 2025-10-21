"use client";

import { useState, useEffect } from "react";
import { userProfile } from "@/api/generated/api";
import { User } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

interface UseProfileDataReturn {
  profileData: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfileData = (): UseProfileDataReturn => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  const fetchProfile = async () => {
    if (!isAuthenticated || !token) {
      setIsLoading(false);
      setError("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await userProfile();
      setProfileData(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setProfileData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const refetch = async () => {
    await fetchProfile();
  };

  return {
    profileData,
    isLoading,
    error,
    refetch,
  };
};
