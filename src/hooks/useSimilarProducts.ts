import { useState, useEffect } from "react";
import { ecommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseSimilarProductsResult {
  similarProducts: ProductList[];
  loading: boolean;
  error: string | null;
}

// Helper: extract attribute keys from product's attribute_values
function extractAttributeKeys(product: any): Set<string> {
  const keys = new Set<string>();
  if (Array.isArray(product?.attribute_values)) {
    product.attribute_values.forEach((attrVal: any) => {
      const key = attrVal.attribute?.key;
      if (key) keys.add(key);
    });
  }
  return keys;
}

// Helper: check if two products share at least one attribute key with same value
function hasSharedAttribute(productA: any, productB: any): boolean {
  if (!Array.isArray(productA?.attribute_values) || !Array.isArray(productB?.attribute_values)) {
    return false;
  }
  const mapA = new Map<string, any>();
  productA.attribute_values.forEach((attrVal: any) => {
    const key = attrVal.attribute?.key;
    if (key) mapA.set(key, JSON.stringify(attrVal.value_json || attrVal.value || ""));
  });
  for (const attrVal of productB.attribute_values) {
    const key = attrVal.attribute?.key;
    if (key && mapA.has(key)) {
      const valB = JSON.stringify(attrVal.value_json || attrVal.value || "");
      if (mapA.get(key) === valB) return true;
    }
  }
  return false;
}

export const useSimilarProducts = (
  categoryId: number | null | undefined,
  currentProductId: number,
  limit: number = 4,
  currentProduct?: any // pass full product to match attributes
): UseSimilarProductsResult => {
  const [similarProducts, setSimilarProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!currentProductId) {
        setLoading(false);
        setSimilarProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all products (can add pagination or filters as needed)
        const response = await ecommerceClientProductsList(
          undefined, // attrCategory
          undefined, // attrMaterial
          undefined, // attrNumberOfLamps
          undefined, // attrSubcategory
          undefined, // isFeatured
          undefined, // language
          undefined, // maxPrice
          undefined, // minPrice
          undefined, // onSale
          undefined, // ordering
          1 // page
        );

        let candidates = (response.results || []).filter((p) => p.id !== currentProductId);

        // If we have currentProduct with attributes, filter by shared attribute values
        if (currentProduct) {
          candidates = candidates.filter((candidate) =>
            hasSharedAttribute(currentProduct, candidate)
          );
        }

        // Limit results
        const filtered = candidates.slice(0, limit);
        setSimilarProducts(filtered);
      } catch (err: any) {
        setError(err.message || "Failed to fetch similar products");
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId, limit, currentProduct]);

  return { similarProducts, loading, error };
};
