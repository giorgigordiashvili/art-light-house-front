import { useState, useEffect, useCallback } from "react";
import { ProductList } from "@/api/generated/interfaces";
import { fetchClientProducts, ProductQueryParams } from "@/api/products";
import { getAttributeKeyMap } from "@/hooks/useFilterAttributeGroups";

interface UseProductsOptions {
  categoryFilters?: string[];
  minPrice?: number;
  maxPrice?: number;
  attributes?: string;
  inStock?: boolean;
  search?: string;
  ordering?: string;
  skipInitialFetch?: boolean; // Add option to skip initial fetch
}

interface UseProductsResult {
  products: ProductList[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchPage: (page: number) => Promise<void>;
  refetch: () => Promise<void>;
  applyFilters: (filterOptions: UseProductsOptions) => Promise<void>;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<UseProductsOptions>(options);

  const fetchProducts = useCallback(
    async (page: number = 1, filterOptions?: UseProductsOptions) => {
      try {
        setLoading(true);
        setError(null);

        const filtersToUse = filterOptions ?? activeFilters;
        const params: ProductQueryParams = {
          page,
        };

        if (filtersToUse.ordering) {
          params.ordering = filtersToUse.ordering;
        }
        if (filtersToUse.search) {
          params.search = filtersToUse.search;
        }
        if (filtersToUse.minPrice !== undefined) {
          params.min_price = filtersToUse.minPrice;
        }
        if (filtersToUse.maxPrice !== undefined) {
          params.max_price = filtersToUse.maxPrice;
        }

        const attributeFilterMap = new Map<string, Set<string>>();
        const addFilterValue = (key?: string, value?: string) => {
          if (!key || !value) return;
          if (!attributeFilterMap.has(key)) {
            attributeFilterMap.set(key, new Set());
          }
          attributeFilterMap.get(key)!.add(value);
        };

        if (filtersToUse.categoryFilters && filtersToUse.categoryFilters.length > 0) {
          filtersToUse.categoryFilters.forEach((entry) => {
            const [attributeKey, value] = entry.split(":");
            addFilterValue(attributeKey, value);
          });
        }

        if (filtersToUse.attributes) {
          const attributePairs = filtersToUse.attributes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

          if (attributePairs.length > 0) {
            const attributeKeyMap = await getAttributeKeyMap();
            attributePairs.forEach((pair) => {
              const [attributeIdStr, option] = pair.split(":");
              const attributeId = Number(attributeIdStr);
              if (!Number.isFinite(attributeId) || !option) return;
              const attribute = attributeKeyMap.get(attributeId);
              if (!attribute) return;
              const attributeKey = attribute.key || `attribute-${attribute.id}`;
              addFilterValue(attributeKey, option);
            });
          }
        }

        attributeFilterMap.forEach((values, key) => {
          if (values.size > 0) {
            params[`attr_${key}`] = Array.from(values).join(",");
          }
        });

        const response = await fetchClientProducts(params);

        // Extract results from paginated response
        const fetchedProducts = response.results || [];

        // Apply client-side filters where backend support is unavailable
        let filteredProducts = fetchedProducts;

        if (filtersToUse.inStock) {
          filteredProducts = filteredProducts.filter((p) => p.is_in_stock);
        }

        setProducts(filteredProducts);
        setCurrentPage(page);
        // Calculate total pages from count
        const totalCount = response.count || 0;
        setTotalPages(Math.ceil(totalCount / 12)); // Assuming 12 items per page
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [activeFilters]
  );

  const fetchPage = useCallback(
    async (page: number) => {
      await fetchProducts(page, activeFilters);
    },
    [fetchProducts, activeFilters]
  );

  const refetch = useCallback(async () => {
    await fetchProducts(1, activeFilters);
  }, [fetchProducts, activeFilters]);

  // Add method to apply filters manually
  const applyFilters = useCallback(
    async (filterOptions: UseProductsOptions) => {
      setActiveFilters(filterOptions);
      await fetchProducts(1, filterOptions);
    },
    [fetchProducts]
  );

  useEffect(() => {
    // Skip initial fetch if requested (for URL filter scenarios)
    if (options.skipInitialFetch) return;

    // Initial fetch with current active filters (defaults to options)
    const timeoutId = setTimeout(() => {
      fetchProducts(1, activeFilters);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts, activeFilters, options.skipInitialFetch]);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    fetchPage,
    refetch,
    applyFilters,
  };
};
