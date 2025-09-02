"use client";
import { useEffect, useState } from "react";
import { Product, ProductService } from "@/lib/productService";
import { useTranslations } from "./useTranslations";

interface UseSimilarProductsOptions {
  product: Product | null;
  limit?: number;
}

export function useSimilarProducts({ product, limit = 4 }: UseSimilarProductsOptions) {
  const { currentLanguage } = useTranslations();
  const langRaw = (currentLanguage as any) || "ge";
  const apiLang = langRaw === "ge" ? "ka" : langRaw;

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    // derive primary category id
    const categoryId =
      product.category_id ||
      product.categoryId ||
      product.category?.id ||
      product.categories?.[0]?.id;
    if (!categoryId) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const all = await ProductService.getProducts(apiLang as any);
        if (!product) return; // double-guard for TS
        const currentId = product.id;
        const filtered = all
          .filter((p) => p.id !== currentId) // exclude current
          .filter((p) => {
            const cid = p.category_id || p.categoryId || p.category?.id || p.categories?.[0]?.id;
            return cid === categoryId;
          })
          .slice(0, limit);
        if (!cancelled) setItems(filtered);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load similar products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [product, apiLang, limit]);

  return { similar: items, loading, error };
}

export default useSimilarProducts;
