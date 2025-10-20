"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { favoritesAdd, favoritesList, favoritesRemove } from "@/api/generated/api";
import type { AddToFavoritesRequest } from "@/api/generated/interfaces";
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
      if (!currentlyFavorite) {
        try {
          const list = await favoritesList();
          currentlyFavorite = Array.isArray(list) && list.some((f: any) => f.product === productId);
        } catch {}
      }

      if (currentlyFavorite) {
        // Remove from favorites
        await favoritesRemove(productId);
        setIsFilled(false);
      } else {
        // Add to favorites
        const payload: AddToFavoritesRequest = { product_id: productId };
        await favoritesAdd(payload);
        setIsFilled(true);
      }

      // Sync header by dispatching updated count
      try {
        const list = await favoritesList();
        const count = Array.isArray(list) ? list.length : 0;
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
      console.error("Failed to toggle favorites", err);
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
