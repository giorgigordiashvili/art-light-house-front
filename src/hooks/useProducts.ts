import { useState, useEffect, useCallback } from "react";
import { productList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseProductsOptions {
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  attributes?: string;
  inStock?: boolean;
  search?: string;
  ordering?: string;
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

const PRODUCTS_PER_PAGE = 12;

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

        // Build comma-separated category IDs string for API (supports multiple IDs)
        const categoryFilter =
          filtersToUse.categoryIds && filtersToUse.categoryIds.length > 0
            ? filtersToUse.categoryIds.join(",")
            : undefined;

        // Fetch products from API with filters
        const fetchedProducts = await productList(
          filtersToUse.attributes,
          categoryFilter,
          filtersToUse.inStock,
          undefined, // isFeatured
          filtersToUse.maxPrice,
          filtersToUse.minPrice,
          filtersToUse.ordering,
          filtersToUse.search
        );

        // Client-side pagination
        const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const paginatedProducts = fetchedProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setCurrentPage(page);
        setTotalPages(Math.ceil(fetchedProducts.length / PRODUCTS_PER_PAGE));

        console.log(`✅ Products fetched successfully:`, {
          total: fetchedProducts.length,
          page,
          productsOnPage: paginatedProducts.length,
          totalPages: Math.ceil(fetchedProducts.length / PRODUCTS_PER_PAGE),
        });
      } catch (err: any) {
        console.error("❌ Failed to fetch products:", err);
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
    // Initial fetch with current active filters (defaults to options)
    const timeoutId = setTimeout(() => {
      fetchProducts(1, activeFilters);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts, activeFilters]);

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
