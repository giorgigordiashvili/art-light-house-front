// Utility functions for working with translations API

import {
  Language,
  Translation,
  LanguagesResponse,
  LanguageResponse,
  TranslationsResponse,
  TranslationResponse,
  DictionaryResponse,
  BulkTranslationsResponse,
  BulkTranslationItem,
  SupportedLanguage,
} from "@/types/translations";

const API_BASE = "/api";

/**
 * Translation API client utility class
 */
export class TranslationAPI {
  // Languages endpoints
  static async getLanguages(): Promise<Language[]> {
    const response = await fetch(`${API_BASE}/languages`);
    if (!response.ok) throw new Error("Failed to fetch languages");
    const data: LanguagesResponse = await response.json();
    return data.languages;
  }

  static async getLanguage(id: string): Promise<Language & { translations?: Translation[] }> {
    const response = await fetch(`${API_BASE}/languages/${id}`);
    if (!response.ok) throw new Error("Failed to fetch language");
    const data: LanguageResponse = await response.json();
    return data.language;
  }

  static async createLanguage(languageData: {
    code: string;
    name: string;
    isDefault?: boolean;
    isActive?: boolean;
  }): Promise<Language> {
    const response = await fetch(`${API_BASE}/languages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(languageData),
    });
    if (!response.ok) throw new Error("Failed to create language");
    const data: LanguageResponse = await response.json();
    return data.language;
  }

  static async updateLanguage(
    id: string,
    updateData: {
      code?: string;
      name?: string;
      isDefault?: boolean;
      isActive?: boolean;
    }
  ): Promise<Language> {
    const response = await fetch(`${API_BASE}/languages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error("Failed to update language");
    const data: LanguageResponse = await response.json();
    return data.language;
  }

  static async deleteLanguage(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/languages/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete language");
  }

  // Translations endpoints
  static async getTranslations(params?: {
    language?: string;
    namespace?: string;
    key?: string;
  }): Promise<Translation[]> {
    const searchParams = new URLSearchParams();
    if (params?.language) searchParams.set("language", params.language);
    if (params?.namespace) searchParams.set("namespace", params.namespace);
    if (params?.key) searchParams.set("key", params.key);

    const response = await fetch(`${API_BASE}/translations?${searchParams}`);
    if (!response.ok) throw new Error("Failed to fetch translations");
    const data: TranslationsResponse = await response.json();
    return data.translations;
  }

  static async getTranslation(id: string): Promise<Translation> {
    const response = await fetch(`${API_BASE}/translations/${id}`);
    if (!response.ok) throw new Error("Failed to fetch translation");
    const data: TranslationResponse = await response.json();
    return data.translation;
  }

  static async createTranslation(translationData: {
    key: string;
    value: string;
    languageId: string;
    namespace?: string;
  }): Promise<Translation> {
    const response = await fetch(`${API_BASE}/translations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(translationData),
    });
    if (!response.ok) throw new Error("Failed to create translation");
    const data: TranslationResponse = await response.json();
    return data.translation;
  }

  static async updateTranslation(
    id: string,
    updateData: {
      key?: string;
      value?: string;
      namespace?: string;
    }
  ): Promise<Translation> {
    const response = await fetch(`${API_BASE}/translations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error("Failed to update translation");
    const data: TranslationResponse = await response.json();
    return data.translation;
  }

  static async deleteTranslation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/translations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete translation");
  }

  // Dictionary endpoint
  static async getDictionary(
    languageCode: SupportedLanguage,
    namespace?: string
  ): Promise<DictionaryResponse> {
    const searchParams = new URLSearchParams();
    if (namespace) searchParams.set("namespace", namespace);

    const response = await fetch(
      `${API_BASE}/translations/dictionary/${languageCode}?${searchParams}`
    );
    if (!response.ok) throw new Error("Failed to fetch dictionary");
    return response.json();
  }

  // Bulk operations
  static async bulkCreateTranslations(data: {
    translations: BulkTranslationItem[];
    languageId: string;
    operation?: "upsert" | "create";
  }): Promise<BulkTranslationsResponse> {
    const response = await fetch(`${API_BASE}/translations/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to bulk create translations");
    return response.json();
  }

  static async bulkDeleteTranslations(data: {
    translationIds?: string[];
    languageId?: string;
    namespace?: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE}/translations/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to bulk delete translations");
  }
}

/**
 * Helper function to get nested value from dictionary using dot notation
 * Example: getValue(dictionary, 'common.welcome') => 'Welcome'
 */
export function getTranslationValue(dictionary: Record<string, any>, key: string): string {
  const keys = key.split(".");
  let current = dictionary;

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  return typeof current === "string" ? current : key;
}

/**
 * Cache for storing dictionaries
 */
class DictionaryCache {
  private cache = new Map<string, { dictionary: Record<string, any>; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get(languageCode: string): Record<string, any> | null {
    const cached = this.cache.get(languageCode);
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.dictionary;
    }
    return null;
  }

  set(languageCode: string, dictionary: Record<string, any>): void {
    this.cache.set(languageCode, {
      dictionary,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const dictionaryCache = new DictionaryCache();
