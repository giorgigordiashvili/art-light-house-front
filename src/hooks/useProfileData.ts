"use client";

import { useState, useEffect } from "react";
import { getCurrentClient } from "@/api/generated/api";
import { EcommerceClient } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

interface UseProfileDataReturn {
  profileData: EcommerceClient | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfileData = (): UseProfileDataReturn => {
  const [profileData, setProfileData] = useState<EcommerceClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setError("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCurrentClient();
      setProfileData(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setProfileData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
