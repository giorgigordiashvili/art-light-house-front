import { useState, useEffect } from "react";
import { ecommerceClientProductsList } from "@/api/generated/api";
import { ProductList } from "@/api/generated/interfaces";

interface UseSimilarProductsResult {
  similarProducts: ProductList[];
  loading: boolean;
  error: string | null;
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
    let cancelled = false;
    const fetchSimilarProducts = async () => {
      if (!currentProductId) {
        setLoading(false);
        setSimilarProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch a large candidate pool (API max page size) and keep paging until we have
        // enough attribute matches or run out of pages
        const PAGE_SIZE = 100;
        const MAX_PAGES = 5;
        let candidates: ProductList[] = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
          const response = await ecommerceClientProductsList(
            undefined, // attr_Furniture
            undefined, // attrColor
            undefined, // attrMaterial
            undefined, // attrNumberOfLamps
            undefined, // attrSubcategory
            undefined, // isFeatured
            undefined, // language
            undefined, // maxPrice
            undefined, // minPrice
            undefined, // onSale
            undefined, // ordering
            page, // page
            PAGE_SIZE // pageSize
          );

          let pageCandidates = (response.results || []).filter((p) => p.id !== currentProductId);

          // If we have currentProduct with attributes, filter by shared attribute values
          if (currentProduct) {
            pageCandidates = pageCandidates.filter((candidate) =>
              hasSharedAttribute(currentProduct, candidate)
            );
          }

          candidates = candidates.concat(pageCandidates);
          if (candidates.length >= limit || !response.next) break;
        }
        if (cancelled) return;

        // Limit results
        const filtered = candidates.slice(0, limit);
        setSimilarProducts(filtered);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message || "Failed to fetch similar products");
        setSimilarProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSimilarProducts();
    return () => {
      cancelled = true;
    };
  }, [categoryId, currentProductId, limit, currentProduct]);

  return { similarProducts, loading, error };
};
