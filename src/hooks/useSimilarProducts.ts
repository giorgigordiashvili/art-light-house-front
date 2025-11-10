import { useState, useEffect } from "react";
import { ecommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseSimilarProductsResult {
  similarProducts: ProductList[];
  loading: boolean;
  error: string | null;
}

export const useSimilarProducts = (
  categoryId: number | null | undefined,
  currentProductId: number,
  limit: number = 4
): UseSimilarProductsResult => {
  const [similarProducts, setSimilarProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!categoryId) {
        setLoading(false);
        setSimilarProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch products (category filtering will need to be done client-side or backend needs update)
        const response = await ecommerceClientProductsList(false, undefined, 1, undefined);

        // Filter out the current product and limit the results
        const filtered = (response.results || [])
          .filter((product) => product.id !== currentProductId)
          .slice(0, limit);

        setSimilarProducts(filtered);
      } catch (err: any) {
        setError(err.message || "Failed to fetch similar products");
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId, limit]);

  return { similarProducts, loading, error };
};
