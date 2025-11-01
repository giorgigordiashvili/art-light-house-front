import { useState, useEffect } from "react";
import { Category } from "@/api/generated/interfaces";
import { categoryList } from "@/api/generated/api";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // simple module-level cache to prevent duplicate fetches across remounts
  const anyGlobal = globalThis as unknown as {
    __categoriesCache?: { data: Category[] | null; promise: Promise<Category[]> | null };
  };
  if (!anyGlobal.__categoriesCache) {
    anyGlobal.__categoriesCache = {
      data: null as Category[] | null,
      promise: null as Promise<Category[]> | null,
    };
  }

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const cache = anyGlobal.__categoriesCache as {
        data: Category[] | null;
        promise: Promise<Category[]> | null;
      };

      if (cache.data) {
        setCategories(cache.data);
        return;
      }

      if (cache.promise) {
        const data = await cache.promise;
        setCategories(data);
        return;
      }

      cache.promise = categoryList();
      const data = await cache.promise;
      cache.data = data;
      cache.promise = null;
      setCategories(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // intentionally run once on mount; fetchCategories reads from global cache
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
