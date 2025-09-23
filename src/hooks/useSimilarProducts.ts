import { useState, useEffect } from "react";
import { productList } from "@/api/generated/api";
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

        // Fetch products from the same category
        const products = await productList(
          undefined, // attributes
          categoryId?.toString(), // category
          undefined, // inStock
          undefined, // isFeatured
          undefined, // maxPrice
          undefined, // minPrice
          undefined, // ordering
          undefined // search
        );

        // Filter out the current product and limit the results
        const filtered = products
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
