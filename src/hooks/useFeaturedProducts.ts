import { useState, useEffect } from "react";
import { apiEcommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseFeaturedProductsResult {
  featuredProducts: ProductList[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedProducts = (): UseFeaturedProductsResult => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products with is_featured = true
        const response = await apiEcommerceClientProductsList(
          true, // isFeatured
          undefined, // ordering
          undefined, // page
          undefined // search
        );

        setFeaturedProducts(response.results || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch featured products");
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { featuredProducts, loading, error };
};
