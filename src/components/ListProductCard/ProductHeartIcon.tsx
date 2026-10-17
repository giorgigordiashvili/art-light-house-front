"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ecommerceClientFavoritesList,
  ecommerceClientFavoritesCreate,
  ecommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import { ecommerceClientProfileMeRetrieve } from "@/api/generated/api";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  FAVORITE_IDS_KEY,
  FavoriteIdMap,
  findFavoriteId,
  useFavoriteIds,
} from "@/hooks/useFavoriteIds";
import HeartIcon from "@/app/icons/HeartIcon";
import FilledHeartIcon from "@/app/icons/FilledHeartIcon";

type Props = {
  productId: number;
  defaultIsFavorite?: boolean | string;
  size?: number;
};

const ProductHeartIcon = ({ productId, defaultIsFavorite, size = 30 }: Props) => {
  const { openAuthModal } = useAuthModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { favoriteIds, queryKey } = useFavoriteIds();

  const initialFilled = useMemo(() => {
    if (typeof defaultIsFavorite === "string") {
      const v = defaultIsFavorite.trim().toLowerCase();
      return v === "true" || v === "1" || v === "yes";
    }
    return Boolean(defaultIsFavorite);
  }, [defaultIsFavorite]);

  // Local optimistic override while a toggle is in flight; null = follow server state
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serverFilled = favoriteIds ? favoriteIds.has(Number(productId)) : undefined;
  const isFilled = optimistic ?? serverFilled ?? initialFilled;

  // Once fresh server data arrives (and no toggle is in flight), drop the optimistic override
  useEffect(() => {
    if (!isSubmitting && favoriteIds) setOptimistic(null);
  }, [favoriteIds, isSubmitting]);

  const updateCache = (updater: (map: FavoriteIdMap) => void) => {
    queryClient.setQueriesData<FavoriteIdMap>({ queryKey: FAVORITE_IDS_KEY }, (prev) => {
      if (!prev) return prev;
      const next = new Map(prev);
      updater(next);
      return next;
    });
  };

  // Stay in sync when favorites change elsewhere (favorites modal, favorites page, another card).
  // Never fetches per card: updates the shared cache or triggers one deduped refetch.
  useEffect(() => {
    const onFavUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      // Clearing all favorites
      if (detail.count === 0 || detail.hasAny === false) {
        queryClient.setQueriesData<FavoriteIdMap>({ queryKey: FAVORITE_IDS_KEY }, (prev) =>
          prev ? new Map() : prev
        );
        return;
      }
      if (detail.productId !== undefined) {
        const pid = Number(detail.productId);
        if (detail.removed) {
          updateCache((map) => map.delete(pid));
          return;
        }
        if (detail.added) {
          const cached = queryClient.getQueryData<FavoriteIdMap>(queryKey);
          if (cached && !cached.has(pid)) {
            queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_KEY });
          }
          return;
        }
      }
      // Optimistic "{ hasAny: true }" ping dispatched by a heart click: nothing to sync yet
      if (detail.hasAny === true && detail.productId === undefined) return;
      queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_KEY });
    };
    window.addEventListener("favoritesUpdated", onFavUpdate as EventListener);
    return () => {
      window.removeEventListener("favoritesUpdated", onFavUpdate as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, queryKey[2]]);

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
    setOptimistic(nextFilled);
    // Also update header immediately on add (hasAny becomes true).
    if (typeof window !== "undefined" && nextFilled) {
      window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { hasAny: true } }));
    }

    try {
      setIsSubmitting(true);
      let cacheUpdated = false;
      if (!nextFilled) {
        // Remove from favorites (optimistic UI already set)
        let favoriteId: string | null = favoriteIds?.get(Number(productId)) ?? null;
        if (!favoriteId) {
          try {
            favoriteId = await findFavoriteId(productId);
          } catch {
            // Could not look up the favorite: revert instead of pretending it was removed
            setOptimistic(null);
            return;
          }
        }

        if (favoriteId) {
          await ecommerceClientFavoritesDestroy(favoriteId);
        }
        updateCache((map) => {
          map.delete(Number(productId));
        });
        cacheUpdated = true;
      } else {
        // Add to favorites (optimistic UI already set)
        let clientId: number | undefined = user?.id;
        if (!clientId) {
          const me = await ecommerceClientProfileMeRetrieve();
          clientId = (me as any)?.id;
        }
        const created = await ecommerceClientFavoritesCreate({
          client: clientId,
          product: productId,
        } as any);
        if (created?.id !== undefined) {
          updateCache((map) => {
            map.set(Number(productId), String(created.id));
          });
          cacheUpdated = true;
        }
      }
      if (queryClient.getQueryData<FavoriteIdMap>(queryKey) && cacheUpdated) {
        setOptimistic(null);
      } else {
        // No cached favorites yet: keep the optimistic value until the refetch lands
        queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_KEY });
      }

      // Sync header by dispatching updated count
      try {
        const response = await ecommerceClientFavoritesList(undefined, 1, 1);
        const count = response.count ?? (response.results || []).length;
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
        setOptimistic(false);
        return;
      }

      // Revert optimistic update on failure
      setOptimistic(null);
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
