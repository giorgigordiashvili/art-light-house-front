"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { favoritesList } from "@/api/generated/api";

type Props = {
  size?: number;
};

const HeaderHeartIcon = ({ size = 30 }: Props) => {
  const [isFilled, setIsFilled] = useState<boolean>(false);

  // Keep icon in sync with favorites list and updates
  useEffect(() => {
    let isMounted = true;

    const syncFavorites = async () => {
      try {
        const hasToken =
          typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
        if (!hasToken) {
          if (isMounted) setIsFilled(false);
          return;
        }
        const list = await favoritesList();
        if (isMounted) setIsFilled(Array.isArray(list) && list.length > 0);
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
  }, []);

  const src = isFilled ? "/assets/icons/filled-heart.png" : "/assets/icons/heart.png";
  const alt = isFilled ? "favorite" : "add to favorites";

  return (
    <span style={{ display: "inline-flex" }}>
      <Image src={src} alt={alt} width={size} height={size} />
    </span>
  );
};

export default HeaderHeartIcon;
