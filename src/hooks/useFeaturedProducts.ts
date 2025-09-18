import { useState, useEffect } from "react";
import { productList } from "@/api/generated/api";
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
        const products = await productList(
          undefined, // attributes
          undefined, // category
          undefined, // inStock
          true, // isFeatured - KEY FILTER
          undefined, // maxPrice
          undefined, // minPrice
          undefined, // ordering
          undefined // search
        );

        setFeaturedProducts(products);
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
