import apiClient from "./api";

// Product image interface
export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
}

// Product interface based on expected backend shape
export interface Product {
  id: number;
  title: string; // product name/title
  price: number;
  currency?: string; // e.g. GEL, ₾, etc
  description?: string | null;
  images: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductsApiResponse {
  data?: Product[]; // some APIs wrap in data
  products?: Product[]; // just in case
  // fallback for bare array response will be handled separately
}

/**
 * Service for product related API calls
 */
export const ProductService = {
  async getProducts(): Promise<Product[]> {
    try {
      // NOTE: documentation shows endpoint includes language prefix /en/products
      // Earlier 401s came from using /products (missing /en).
      const response = await apiClient.get("/en/products");
      const raw = response.data;

      if (Array.isArray(raw)) return raw as Product[];
      if (raw?.data && Array.isArray(raw.data)) return raw.data as Product[];
      if (raw?.products && Array.isArray(raw.products)) return raw.products as Product[];
      console.warn("Unexpected products response shape", raw);
      return [];
    } catch (err: any) {
      console.error("Failed to load products", err?.response?.data || err);
      throw new Error(err?.response?.data?.message || "Unable to load products");
    }
  },
};
