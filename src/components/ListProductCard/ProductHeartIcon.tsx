"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ecommerceClientFavoritesList,
  ecommerceClientFavoritesCreate,
  ecommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import { ecommerceClientProfileMeRetrieve } from "@/api/generated/api";
import { useAuthModal } from "@/contexts/AuthModalContext";
import HeartIcon from "@/app/icons/HeartIcon";
import FilledHeartIcon from "@/app/icons/FilledHeartIcon";

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
    if (!hasToken) return;

    const checkFavorited = async () => {
      try {
        // Iterate pages defensively in case user has many favorites
        let page = 1;
        let found = false;
        // Hard cap to avoid excessive requests; adjust if needed
        const MAX_PAGES = 10;
        while (!found && page <= MAX_PAGES) {
          const resp = await ecommerceClientFavoritesList(undefined, page);
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

    if (!initialFilled) checkFavorited();

    // Stay in sync when favorites change elsewhere (favorites modal, favorites page, another card)
    const onFavUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (detail.productId !== undefined && Number(detail.productId) === Number(productId)) {
        if (detail.removed) setIsFilled(false);
        else if (detail.added) setIsFilled(true);
        return;
      }
      // Clearing all favorites
      if (detail.count === 0 || detail.hasAny === false) {
        setIsFilled(false);
        return;
      }
      checkFavorited();
    };
    window.addEventListener("favoritesUpdated", onFavUpdate as EventListener);
    return () => {
      isMounted = false;
      window.removeEventListener("favoritesUpdated", onFavUpdate as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleClick = async (e: React.MouseEvent) => {
    // Prevent the surrounding product link from navigating
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;

    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // User is not authenticated - open auth modal instead
      openAuthModal();
      return;
    }

    const nextFilled = !isFilled;
    // Optimistic UI: update immediately so it feels responsive.
    setIsFilled(nextFilled);
    // Also update header immediately on add (hasAny becomes true).
    if (typeof window !== "undefined" && nextFilled) {
      window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { hasAny: true } }));
    }

    try {
      setIsSubmitting(true);
      if (!nextFilled) {
        // Remove from favorites (optimistic UI already set)
        let favoriteId: string | null = null;
        try {
          const response = await ecommerceClientFavoritesList();
          const list = response.results || [];
          const existing = list.find((f: any) => {
            const pid = typeof f.product === "object" ? f.product?.id : f.product;
            return Number(pid) === Number(productId);
          });
          if (existing) favoriteId = String(existing.id);
        } catch {}

        if (favoriteId) {
          await ecommerceClientFavoritesDestroy(favoriteId);
        }
      } else {
        // Add to favorites (optimistic UI already set)
        const me = await ecommerceClientProfileMeRetrieve();
        const clientId = (me as any)?.id;
        await ecommerceClientFavoritesCreate({ client: clientId, product: productId } as any);
      }

      // Sync header by dispatching updated count
      try {
        const response = await ecommerceClientFavoritesList();
        const list = response.results || [];
        const count = list.length;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("favoritesUpdated", {
              detail: {
                count,
                hasAny: count > 0,
                productId,
                added: nextFilled,
                removed: !nextFilled,
              },
            })
          );
        }
      } catch {}
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // unauthorized, ensure it's unfilled and exit quietly
        setIsFilled(false);
        return;
      }

      // Revert optimistic update on failure
      setIsFilled(!nextFilled);
    } finally {
      setIsSubmitting(false);
    }
  };

  const IconComponent = isFilled ? FilledHeartIcon : HeartIcon;

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
      <IconComponent width={size} height={size} color={"#ffffff"} />
    </span>
  );
};

export default ProductHeartIcon;
