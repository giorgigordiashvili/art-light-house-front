"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialFromQuery = (() => {
    const p = searchParams?.get("page");
    const n = p ? parseInt(p, 10) : NaN;
    return !isNaN(n) && n > 0 ? n : initialPage;
  })();

  const [page, setPage] = useState(initialFromQuery);
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
    // If language changes, reset to page from query (or 1 if absent)
    fetchPage(initialFromQuery, true);
  }, [lang, fetchPage, initialFromQuery]);

  // Keep URL in sync with current page (shallow push to avoid full reload)
  useEffect(() => {
    if (!pathname) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    // Avoid unnecessary push
    if (
      typeof window !== "undefined" &&
      newUrl !== window.location.pathname + window.location.search
    ) {
      router.replace(newUrl, { scroll: true });
    }
  }, [page, pathname, searchParams, router]);

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
