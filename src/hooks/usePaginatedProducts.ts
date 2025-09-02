"use client";
import { useCallback, useEffect, useState } from "react";
import { ProductService, Product, PaginationMeta } from "@/lib/productService";
import { useTranslations } from "./useTranslations";

interface UsePaginatedProductsOptions {
  perPage?: number; // optional; if omitted backend default (12) is used
  initialPage?: number;
  languageOverride?: "en" | "ka" | "ge";
}

export function usePaginatedProducts({
  perPage,
  initialPage = 1,
  languageOverride,
}: UsePaginatedProductsOptions = {}) {
  const { currentLanguage } = useTranslations();
  const rawLang = (languageOverride || (currentLanguage as any) || "en") as "en" | "ka" | "ge";
  const lang = (rawLang === "ge" ? "ka" : rawLang) as "en" | "ka" | "ge";

  const [page, setPage] = useState(initialPage);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number, replace = true) => {
      setIsLoading(true);
      setError(null);
      try {
        const { products: list, pagination: meta } = await ProductService.getProductsPage({
          language: lang,
          page: targetPage,
          perPage, // may be undefined => backend default
        });
        console.debug("Fetched page", targetPage, "lang", lang, meta);
        setPagination(meta);
        setPage(meta.current_page);
        setProducts((prev) => (replace ? list : [...prev, ...list]));
      } catch (e: any) {
        setError(e.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    },
    [lang, perPage]
  );

  // Initial + language change
  useEffect(() => {
    fetchPage(1, true);
  }, [lang, fetchPage]);

  const goToPage = (p: number) => {
    const max = pagination?.last_page || 1;
    if (p < 1 || p > max) return;
    if (p === page) return; // already on requested page
    fetchPage(p, true);
  };

  return {
    products,
    page,
    pagination,
    isLoading,
    error,
    perPage: pagination?.per_page || perPage || 12,
    total: pagination?.total || 0,
    lastPage: pagination?.last_page || 1,
    goToPage,
    reload: () => fetchPage(page, true),
  };
}

export default usePaginatedProducts;
