"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { favoritesAdd, favoritesList, favoritesRemove } from "@/api/generated/api";
import type { AddToFavoritesRequest } from "@/api/generated/interfaces";

type Props = {
  productId?: number;
  defaultIsFavorite?: boolean | string;
  size?: number;
};

const HeartIcon = ({ productId, defaultIsFavorite, size = 30 }: Props) => {
  const initialFilled = useMemo(() => {
    if (productId != null) {
      if (typeof defaultIsFavorite === "string") {
        const v = defaultIsFavorite.trim().toLowerCase();
        return v === "true" || v === "1" || v === "yes";
      }
      return Boolean(defaultIsFavorite);
    }
    return false; // header mode initializes as not filled; will fetch below
  }, [productId, defaultIsFavorite]);

  const [isFilled, setIsFilled] = useState<boolean>(initialFilled);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Header mode: no productId -> do nothing on click
    if (productId == null) return;
    if (isSubmitting) return;

    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // not authorized; ignore silently
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

  // Header mode: keep icon in sync with favorites list and updates
  useEffect(() => {
    if (productId != null) return; // only header mode
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
  }, [productId]);

  const src = isFilled ? "/assets/icons/filled-heart.png" : "/assets/icons/heart.png";
  const alt = isFilled ? "favorite" : "add to favorites";

  const isCardMode = productId != null;
  return (
    <span
      onClick={isCardMode ? handleClick : undefined}
      data-heart-button={isCardMode ? "true" : undefined}
      style={{ display: "inline-flex" }}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </span>
  );
};

export default HeartIcon;
