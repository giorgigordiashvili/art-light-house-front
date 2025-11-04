"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  apiEcommerceClientFavoritesList,
  apiEcommerceClientFavoritesCreate,
  apiEcommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import { useAuthModal } from "@/contexts/AuthModalContext";

type Props = {
  productId: number;
  defaultIsFavorite?: boolean | string;
  size?: number;
};

const ProductHeartIcon = ({ productId, defaultIsFavorite, size = 30 }: Props) => {
  const { openAuthModal } = useAuthModal();

  const initialFilled = useMemo(() => {
    if (typeof defaultIsFavorite === "string") {
      const v = defaultIsFavorite.trim().toLowerCase();
      return v === "true" || v === "1" || v === "yes";
    }
    return Boolean(defaultIsFavorite);
  }, [defaultIsFavorite]);

  const [isFilled, setIsFilled] = useState<boolean>(initialFilled);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting) return;

    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // User is not authenticated - open auth modal instead
      openAuthModal();
      return;
    }

    try {
      setIsSubmitting(true);
      // Determine current favorite state; prefer local, fallback to list
      let currentlyFavorite = isFilled;
      let favoriteId: string | null = null;

      if (!currentlyFavorite) {
        try {
          const response = await apiEcommerceClientFavoritesList();
          const list = response.results || [];
          const existing = list.find((f: any) => f.product === productId);
          currentlyFavorite = !!existing;
          if (existing) favoriteId = String(existing.id);
        } catch {}
      }

      if (currentlyFavorite && favoriteId) {
        // Remove from favorites
        await apiEcommerceClientFavoritesDestroy(favoriteId);
        setIsFilled(false);
      } else {
        // Add to favorites
        const payload = { product: productId } as any;
        await apiEcommerceClientFavoritesCreate(payload);
        setIsFilled(true);
      }

      // Sync header by dispatching updated count
      try {
        const response = await apiEcommerceClientFavoritesList();
        const list = response.results || [];
        const count = list.length;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("favoritesUpdated", { detail: { count, hasAny: count > 0 } })
          );
        }
      } catch {}
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // unauthorized, ensure it's unfilled and exit quietly
        setIsFilled(false);
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const src = isFilled ? "/assets/icons/filled-heart.png" : "/assets/icons/heart.png";
  const alt = isFilled ? "favorite" : "add to favorites";

  return (
    <span
      onClick={handleClick}
      data-heart-button="true"
      style={{
        display: "inline-flex",
        position: "absolute",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        right: 8,
        top: 8,
        zIndex: 1,
      }}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </span>
  );
};

export default ProductHeartIcon;
