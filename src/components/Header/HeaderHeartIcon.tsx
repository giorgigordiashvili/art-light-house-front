"use client";
import React, { useEffect, useState } from "react";
import { ecommerceClientFavoritesList } from "@/api/generated/api";
import HeartIcon from "@/app/icons/HeartIcon";
import FilledHeartIcon from "@/app/icons/FilledHeartIcon";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  size?: number;
  isModalOpen?: boolean;
};

const HeaderHeartIcon = ({ size = 30, isModalOpen = false }: Props) => {
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Keep icon in sync with favorites list and updates
  useEffect(() => {
    let isMounted = true;

    const syncFavorites = async () => {
      try {
        const hasToken =
          typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
        if (!hasToken || !isAuthenticated) {
          if (isMounted) setIsFilled(false);
          return;
        }
        const response = await ecommerceClientFavoritesList();
        if (isMounted) setIsFilled((response.results || []).length > 0);
      } catch {
        if (isMounted) setIsFilled(false);
      }
    };

    const onFavoritesUpdated = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { hasAny?: boolean; count?: number };
        if (typeof detail?.hasAny === "boolean") {
          setIsFilled(detail.hasAny);
        } else if (typeof detail?.count === "number") {
          setIsFilled(detail.count > 0);
        } else {
          // fallback: re-fetch
          syncFavorites();
        }
      } catch {
        syncFavorites();
      }
    };

    // Sync favorites when component mounts or authentication state changes
    syncFavorites();

    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", onFavoritesUpdated as EventListener);
    }
    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", onFavoritesUpdated as EventListener);
      }
    };
  }, [isAuthenticated]); // Add isAuthenticated as dependency

  const IconComponent = isFilled ? FilledHeartIcon : HeartIcon;
  const alt = isFilled ? "favorite" : "add to favorites";
  const iconColor = isModalOpen ? "#FFCB40" : "#ffffff"; // Yellow when modal open, white when closed

  return (
    <span style={{ display: "inline-flex" }} title={alt}>
      <IconComponent width={size} height={size} color={iconColor} />
    </span>
  );
};

export default HeaderHeartIcon;
