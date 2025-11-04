import { useState, useEffect } from "react";
import { apiEcommerceClientProductsRetrieve } from "@/api/generated/api";
import { ProductDetail } from "@/api/generated/interfaces";

interface UseProductDetailResult {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
}

export const useProductDetail = (productId: number): UseProductDetailResult => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await apiEcommerceClientProductsRetrieve(productId);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};
