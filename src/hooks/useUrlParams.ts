"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export interface FilterParams {
  categories?: string; // comma-separated category IDs
  minPrice?: string;
  maxPrice?: string;
  attributes?: string; // comma-separated attribute pairs
  page?: string;
  search?: string;
  ordering?: string;
}

export const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  // Get current filter parameters from URL
  const getFilterParams = useCallback((): FilterParams => {
    const params = new URLSearchParams(searchParamsString);
    return {
      categories: params.get("categories") || undefined,
      minPrice: params.get("minPrice") || undefined,
      maxPrice: params.get("maxPrice") || undefined,
      attributes: params.get("attributes") || undefined,
      page: params.get("page") || undefined,
      search: params.get("search") || undefined,
      ordering: params.get("ordering") || undefined,
    };
  }, [searchParamsString]);

  // Update URL parameters while preserving existing ones
  const updateUrlParams = useCallback(
    (params: Partial<FilterParams>, replace: boolean = false) => {
      const current = new URLSearchParams(searchParamsString);

      // Update or remove parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      // Reset page to 1 when filters change (unless page is being explicitly set)
      if (!params.hasOwnProperty("page") && Object.keys(params).some((key) => key !== "page")) {
        current.delete("page");
      }

      const newUrl = `${pathname}?${current.toString()}`;

      if (replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }

      // Ensure server-rendered data updates when only query params change.
      setTimeout(() => router.refresh(), 0);
    },
    [router, pathname, searchParamsString]
  );

  // Clear all filter parameters
  const clearUrlParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    getFilterParams,
    updateUrlParams,
    clearUrlParams,
  };
};
