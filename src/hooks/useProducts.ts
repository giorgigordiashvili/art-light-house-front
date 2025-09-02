"use client";

import { useEffect, useState } from "react";
import { Product, ProductService } from "@/lib/productService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const list = await ProductService.getProducts();
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
  }, []);

  return { products, isLoading, error };
};

export default useProducts;
