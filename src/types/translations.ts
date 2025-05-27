// Types for the translation system
export interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  key: string;
  value: string;
  languageId: string;
  namespace?: string;
  created_at: string;
  updated_at: string;
  language?: Language;
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface BulkTranslationItem {
  key: string;
  value: string;
  namespace?: string;
}

// API Response types
export interface LanguagesResponse {
  languages: Language[];
}

export interface LanguageResponse {
  language: Language & {
    translations?: Translation[];
  };
}

export interface TranslationsResponse {
  translations: Translation[];
}

export interface TranslationResponse {
  translation: Translation;
}

export interface DictionaryResponse {
  dictionary: TranslationDictionary;
  language: string;
  totalTranslations: number;
}

export interface BulkTranslationsResponse {
  translations: Translation[];
  processed: number;
}

// Supported language codes
export type SupportedLanguage = "en" | "ka";

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  en: "English",
  ka: "ქართული",
} as const;
