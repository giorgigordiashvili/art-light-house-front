"use client";

import { useState } from "react";
import { userProfileUpdate } from "@/api/generated/api";
import { User, PatchedUserUpdateRequest } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

interface UseProfileUpdateReturn {
  updateProfile: (data: PatchedUserUpdateRequest) => Promise<User | null>;
  isUpdating: boolean;
  updateError: string | null;
  updateSuccess: boolean;
  clearUpdateStatus: () => void;
}

export const useProfileUpdate = (): UseProfileUpdateReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { isAuthenticated, token } = useAuth();

  const updateProfile = async (data: PatchedUserUpdateRequest): Promise<User | null> => {
    if (!isAuthenticated || !token) {
      setUpdateError("User not authenticated");
      return null;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      const updatedUser = await userProfileUpdate(data);

      setUpdateSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

      return updatedUser;
    } catch (err: any) {
      let errorMessage = "Failed to update profile";
      if (err?.response?.status === 400) {
        errorMessage = "Invalid data provided";
      } else if (err?.response?.status === 401) {
        errorMessage = "Authentication required";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setUpdateError(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearUpdateStatus = () => {
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  return {
    updateProfile,
    isUpdating,
    updateError,
    updateSuccess,
    clearUpdateStatus,
  };
};
