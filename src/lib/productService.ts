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

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedProductsResponse {
  data: Product[];
  pagination: PaginationMeta;
}

/**
 * Service for product related API calls
 */
export const ProductService = {
  async getProducts(language: "en" | "ka" | "ge" = "en"): Promise<Product[]> {
    try {
      // Normalize 'ge' from route to backend expected 'ka'
      const apiLang = language === "ge" ? "ka" : language;
      // Language-aware endpoint. Backend expects /{lang}/products where lang is en|ka
      const response = await apiClient.get(`/${apiLang}/products`);
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
  async getProductsPage({
    language = "en",
    page = 1,
    perPage,
  }: { language?: "en" | "ka" | "ge"; page?: number; perPage?: number } = {}): Promise<{
    products: Product[];
    pagination: PaginationMeta;
  }> {
    const apiLang = language === "ge" ? "ka" : language;
    try {
      const params: Record<string, any> = { page };
      if (perPage) params.per_page = perPage; // only send per_page if explicitly requested
      const response = await apiClient.get(`/${apiLang}/products`, { params });
      const raw = response.data as PaginatedProductsResponse;
      if (raw && Array.isArray(raw.data) && raw.pagination) {
        return { products: raw.data, pagination: raw.pagination };
      }
      // Fallback: emulate pagination if backend returned array only
      const list = Array.isArray(raw) ? (raw as unknown as Product[]) : [];
      const effectivePerPage = perPage || list.length || 1;
      const total = list.length;
      return {
        products: list.slice((page - 1) * effectivePerPage, page * effectivePerPage),
        pagination: {
          current_page: page,
          last_page: Math.max(1, Math.ceil(total / effectivePerPage)),
          per_page: effectivePerPage,
          total,
          from: total ? (page - 1) * effectivePerPage + 1 : 0,
          to: Math.min(page * effectivePerPage, total),
        } as PaginationMeta,
      };
    } catch (err: any) {
      console.error("Failed to load paginated products", err?.response?.data || err);
      throw new Error(err?.response?.data?.message || "Unable to load paginated products");
    }
  },
};
