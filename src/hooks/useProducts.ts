import { useState, useEffect, useCallback } from "react";
import { ecommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseProductsOptions {
  categoryIds?: number[];
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

        // New API has different parameters: isFeatured, ordering, page, search
        const response = await ecommerceClientProductsList(
          undefined, // isFeatured - not used in this context
          filtersToUse.ordering,
          page,
          filtersToUse.search
        );

        // Extract results from paginated response
        const fetchedProducts = response.results || [];

        // Apply client-side filters
        let filteredProducts = fetchedProducts;

        // Price filtering
        if (filtersToUse.minPrice !== undefined || filtersToUse.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter((p) => {
            const price = parseFloat(p.price || "0");
            const minOk = filtersToUse.minPrice === undefined || price >= filtersToUse.minPrice;
            const maxOk = filtersToUse.maxPrice === undefined || price <= filtersToUse.maxPrice;
            return minOk && maxOk;
          });
        }

        // Stock filtering
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
