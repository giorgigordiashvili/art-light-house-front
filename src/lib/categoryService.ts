import apiClient from "./api";

export interface Category {
  id: number;
  title: string;
  slug?: string;
}

export interface CategoriesApiResponse {
  data?: Category[];
  categories?: Category[];
}

export const CategoryService = {
  async getCategories(language: "en" | "ka" | "ge" = "en"): Promise<Category[]> {
    const apiLang = language === "ge" ? "ka" : language;
    try {
      const res = await apiClient.get(`/${apiLang}/categories`);
      const raw = res.data;
      if (Array.isArray(raw)) return raw as Category[];
      if (raw?.data && Array.isArray(raw.data)) return raw.data as Category[];
      if (raw?.categories && Array.isArray(raw.categories)) return raw.categories as Category[];
      console.warn("Unexpected categories response shape", raw);
      return [];
    } catch (e: any) {
      console.error("Failed to load categories", e?.response?.data || e);
      throw new Error(e?.response?.data?.message || "Unable to load categories");
    }
  },
};
