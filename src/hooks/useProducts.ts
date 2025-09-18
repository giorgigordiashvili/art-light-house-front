import { useState, useEffect, useCallback } from "react";
import { productList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseProductsResult {
  products: ProductList[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchPage: (page: number) => Promise<void>;
}

const PRODUCTS_PER_PAGE = 12;

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🛒 Fetching products for page ${page}`);

      // Fetch products from API
      // Note: The API might not support pagination directly, so we fetch all and paginate client-side
      // If your API supports pagination, you can modify this to use offset/limit parameters
      const fetchedProducts = await productList();

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
  }, []);

  const fetchPage = useCallback(
    async (page: number) => {
      await fetchProducts(page);
    },
    [fetchProducts]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1);
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
  };
};
