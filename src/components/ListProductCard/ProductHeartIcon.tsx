"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  apiEcommerceClientFavoritesList,
  apiEcommerceClientFavoritesCreate,
  apiEcommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import { apiEcommerceClientProfileMeRetrieve } from "@/api/generated/api";
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

  // Ensure persisted state after refresh: check server favorites on mount
  useEffect(() => {
    let isMounted = true;
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");

    // If we already know it's a favorite, no need to fetch
    if (!hasToken || isFilled) return;

    const checkFavorited = async () => {
      try {
        // Iterate pages defensively in case user has many favorites
        let page = 1;
        let found = false;
        // Hard cap to avoid excessive requests; adjust if needed
        const MAX_PAGES = 10;
        while (!found && page <= MAX_PAGES) {
          const resp = await apiEcommerceClientFavoritesList(undefined, page);
          const list = (resp as any)?.results || [];
          if (list.length > 0) {
            found = list.some((f: any) => {
              const pid = typeof f.product === "object" ? f.product?.id : f.product;
              return Number(pid) === Number(productId);
            });
          }
          if (found) break;
          const next = (resp as any)?.next;
          if (!next) break;
          page += 1;
        }
        if (isMounted && found) setIsFilled(true);
      } catch {
        // ignore
      }
    };

    checkFavorited();

    // Also update reactively if some other component toggles favorites
    const onFavUpdate = () => {
      checkFavorited();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", onFavUpdate as EventListener);
    }
    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", onFavUpdate as EventListener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

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
      // Always query to find existing record id robustly
      let favoriteId: string | null = null;
      try {
        const response = await apiEcommerceClientFavoritesList();
        const list = response.results || [];
        const existing = list.find((f: any) => {
          const pid = typeof f.product === "object" ? f.product?.id : f.product;
          return Number(pid) === Number(productId);
        });
        if (existing) favoriteId = String(existing.id);
      } catch {}

      if (favoriteId) {
        // Remove from favorites
        await apiEcommerceClientFavoritesDestroy(favoriteId);
        setIsFilled(false);
      } else {
        // Add to favorites; include client id from profile
        let clientId: number | undefined;
        try {
          const me = await apiEcommerceClientProfileMeRetrieve();
          clientId = (me as any)?.id;
        } catch {}
        const payload = { client: clientId, product: productId } as any;
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
