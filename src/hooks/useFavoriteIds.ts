"use client";
import { useQuery } from "@tanstack/react-query";
import { ecommerceClientFavoritesList } from "@/api/generated/api";
import { useAuth } from "@/contexts/AuthContext";

// Hard cap to avoid excessive requests for users with many favorites
export const FAVORITES_MAX_PAGES = 10;

// Base key; invalidate with { queryKey: FAVORITE_IDS_KEY } to refetch for every user
export const FAVORITE_IDS_KEY = ["favorites", "ids"] as const;

/** Map of productId -> favoriteId */
export type FavoriteIdMap = Map<number, string>;

const getProductId = (f: any): number => {
  const pid = typeof f?.product === "object" ? f.product?.id : f?.product;
  return Number(pid);
};

/** Pages through the user's favorites (up to FAVORITES_MAX_PAGES) and builds a productId -> favoriteId map. */
export const fetchFavoriteIdMap = async (): Promise<FavoriteIdMap> => {
  const map: FavoriteIdMap = new Map();
  let page = 1;
  while (page <= FAVORITES_MAX_PAGES) {
    const resp = await ecommerceClientFavoritesList(undefined, page);
    for (const f of resp?.results || []) {
      map.set(getProductId(f), String(f.id));
    }
    if (!resp?.next) break;
    page += 1;
  }
  return map;
};

/** Pages through favorites to find the favorite id for a product. Throws on request errors. */
export const findFavoriteId = async (productId: number): Promise<string | null> => {
  let page = 1;
  while (page <= FAVORITES_MAX_PAGES) {
    const resp = await ecommerceClientFavoritesList(undefined, page);
    const existing = (resp?.results || []).find((f) => getProductId(f) === Number(productId));
    if (existing) return String(existing.id);
    if (!resp?.next) break;
    page += 1;
  }
  return null;
};

/**
 * Shared, deduplicated favorites lookup for all heart icons on a page.
 * Disabled (data undefined) while the user is logged out.
 */
export const useFavoriteIds = () => {
  const { token, user } = useAuth();
  const enabled = !!token;
  const queryKey = [...FAVORITE_IDS_KEY, user?.id ?? null] as const;

  const query = useQuery({
    queryKey,
    queryFn: fetchFavoriteIdMap,
    enabled,
    staleTime: 60 * 1000,
  });

  return {
    favoriteIds: enabled ? query.data : undefined,
    queryKey,
    enabled,
  };
};
