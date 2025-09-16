"use client";

import { useEffect, useState } from "react";
import { Product, ProductService } from "@/lib/productService";
import { useTranslations } from "./useTranslations";

export const useProducts = (explicitLanguage?: "en" | "ka") => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useTranslations();

  // Accept either 'en','ka','ge' from context; normalize 'ge' to 'ka' for API
  const rawLang = explicitLanguage || (currentLanguage as any) || "en";
  const lang = rawLang === "ge" ? "ka" : rawLang;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const list = await ProductService.getProducts(lang);
        if (!cancelled) setProducts(list);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load products");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { products, isLoading, error };
};

export default useProducts;
