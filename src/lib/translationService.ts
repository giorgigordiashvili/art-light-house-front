import {
  Language,
  Translation,
  TranslationDictionary,
  BulkTranslationItem,
  SupportedLanguage,
  LanguagesResponse,
  LanguageResponse,
  TranslationsResponse,
  TranslationResponse,
  DictionaryResponse,
  BulkTranslationsResponse,
} from "@/types/translations";

class TranslationService {
  private baseUrl = "/api";
  private cache = new Map<string, TranslationDictionary>();
  private currentLanguage: SupportedLanguage = "en";

  // Language methods
  async getLanguages(): Promise<Language[]> {
    const response = await fetch(`${this.baseUrl}/languages`);
    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }
    const data: LanguagesResponse = await response.json();
    return data.languages;
  }

  async getLanguage(id: string): Promise<Language & { translations?: Translation[] }> {
    const response = await fetch(`${this.baseUrl}/languages/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch language");
    }
    const data: LanguageResponse = await response.json();
    return data.language;
  }

  async createLanguage(language: {
    code: string;
    name: string;
    isDefault?: boolean;
    isActive?: boolean;
  }): Promise<Language> {
    const response = await fetch(`${this.baseUrl}/languages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(language),
    });

    if (!response.ok) {
      throw new Error("Failed to create language");
    }

    const data: LanguageResponse = await response.json();
    return data.language;
  }

  async updateLanguage(id: string, updates: Partial<Language>): Promise<Language> {
    const response = await fetch(`${this.baseUrl}/languages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update language");
    }

    const data: LanguageResponse = await response.json();
    return data.language;
  }

  async deleteLanguage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/languages/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete language");
    }
  }

  // Translation methods
  async getTranslations(filters?: {
    language?: string;
    namespace?: string;
    key?: string;
  }): Promise<Translation[]> {
    const params = new URLSearchParams();
    if (filters?.language) params.append("language", filters.language);
    if (filters?.namespace) params.append("namespace", filters.namespace);
    if (filters?.key) params.append("key", filters.key);

    const response = await fetch(`${this.baseUrl}/translations?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch translations");
    }

    const data: TranslationsResponse = await response.json();
    return data.translations;
  }

  async getTranslation(id: string): Promise<Translation> {
    const response = await fetch(`${this.baseUrl}/translations/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch translation");
    }

    const data: TranslationResponse = await response.json();
    return data.translation;
  }

  async createTranslation(translation: {
    key: string;
    value: string;
    languageId: string;
    namespace?: string;
  }): Promise<Translation> {
    const response = await fetch(`${this.baseUrl}/translations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(translation),
    });

    if (!response.ok) {
      throw new Error("Failed to create translation");
    }

    const data: TranslationResponse = await response.json();

    // Clear cache for this language
    this.clearCache();

    return data.translation;
  }

  async updateTranslation(
    id: string,
    updates: {
      key?: string;
      value?: string;
      namespace?: string;
    }
  ): Promise<Translation> {
    const response = await fetch(`${this.baseUrl}/translations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update translation");
    }

    const data: TranslationResponse = await response.json();

    // Clear cache for this language
    this.clearCache();

    return data.translation;
  }

  async deleteTranslation(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/translations/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete translation");
    }

    // Clear cache
    this.clearCache();
  }

  // Dictionary methods for frontend consumption
  async getDictionary(languageCode: string, namespace?: string): Promise<TranslationDictionary> {
    const cacheKey = `${languageCode}${namespace ? `-${namespace}` : ""}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new URLSearchParams();
    if (namespace) params.append("namespace", namespace);

    const response = await fetch(
      `${this.baseUrl}/translations/dictionary/${languageCode}?${params}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch dictionary");
    }

    const data: DictionaryResponse = await response.json();

    // Cache the result
    this.cache.set(cacheKey, data.dictionary);

    return data.dictionary;
  }

  // Bulk operations
  async bulkCreateTranslations(
    languageId: string,
    translations: BulkTranslationItem[],
    operation: "upsert" | "create" = "upsert"
  ): Promise<Translation[]> {
    const response = await fetch(`${this.baseUrl}/translations/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translations,
        languageId,
        operation,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to bulk create translations");
    }

    const data: BulkTranslationsResponse = await response.json();

    // Clear cache
    this.clearCache();

    return data.translations;
  }

  async bulkDeleteTranslations(filters: {
    translationIds?: string[];
    languageId?: string;
    namespace?: string;
  }): Promise<number> {
    const response = await fetch(`${this.baseUrl}/translations/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error("Failed to bulk delete translations");
    }

    const data = await response.json();

    // Clear cache
    this.clearCache();

    return data.deleted;
  }

  // Utility methods
  setCurrentLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Helper function to get nested value from dictionary
  getTranslationValue(dictionary: TranslationDictionary, key: string): string {
    const keys = key.split(".");
    let current: any = dictionary;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return key; // Return key as fallback if translation not found
      }
    }

    return typeof current === "string" ? current : key;
  }

  // Create a translation function for use in components
  createT(dictionary: TranslationDictionary) {
    return (key: string, fallback?: string): string => {
      const value = this.getTranslationValue(dictionary, key);
      return value !== key ? value : fallback || key;
    };
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default TranslationService;
