import { useState, useEffect } from "react";
import { ecommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseFeaturedProductsResult {
  featuredProducts: ProductList[];
  loading: boolean;
  error: string | null;
}

interface UseFeaturedProductsOptions {
  initialProducts?: ProductList[];
}

export const useFeaturedProducts = (
  options: UseFeaturedProductsOptions = {}
): UseFeaturedProductsResult => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductList[]>(
    options.initialProducts || []
  );
  const [loading, setLoading] = useState(!options.initialProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip client-side fetch if we have initial products from server
    if (options.initialProducts) {
      return;
    }

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products with is_featured = true
        const response = await ecommerceClientProductsList(
          undefined, // attrCategory
          undefined, // attrMaterial
          undefined, // attrNumberOfLamps
          undefined, // attrSubcategory
          true // isFeatured
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
  }, [options.initialProducts]);

  return { featuredProducts, loading, error };
};
