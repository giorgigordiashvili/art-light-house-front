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

  const fetchProducts = useCallback(
    async (page: number = 1, filterOptions: UseProductsOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🛒 Fetching products for page ${page} with filters:`, filterOptions);

        // Use the first selected category for API filtering (API accepts single category)
        const categoryFilter =
          filterOptions.categoryIds && filterOptions.categoryIds.length > 0
            ? filterOptions.categoryIds[0]
            : undefined;

        // Fetch products from API with filters
        const fetchedProducts = await productList(
          filterOptions.attributes,
          categoryFilter,
          filterOptions.inStock,
          undefined, // isFeatured
          filterOptions.maxPrice,
          filterOptions.minPrice,
          filterOptions.ordering,
          filterOptions.search
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
    []
  );

  const fetchPage = useCallback(
    async (page: number) => {
      await fetchProducts(page, options);
    },
    [fetchProducts, options]
  );

  const refetch = useCallback(async () => {
    await fetchProducts(1, options);
  }, [fetchProducts, options]);

  // Add method to apply filters manually
  const applyFilters = useCallback(
    async (filterOptions: UseProductsOptions) => {
      await fetchProducts(1, filterOptions);
    },
    [fetchProducts]
  );

  useEffect(() => {
    // Only fetch products once on initial mount, without filters
    const timeoutId = setTimeout(() => {
      fetchProducts(1, {});
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

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
