"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { translationService } from "@/lib/translationService";
import { TranslationDictionary, SupportedLanguage } from "@/types/translations";

interface TranslationContextType {
  currentLanguage: SupportedLanguage;
  dictionary: TranslationDictionary;
  isLoading: boolean;
  error: string | null;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  refresh: () => Promise<void>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export function TranslationProvider({
  children,
  defaultLanguage = "en",
}: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [dictionary, setDictionary] = useState<TranslationDictionary>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDictionary = useCallback(async (language: SupportedLanguage) => {
    try {
      setIsLoading(true);
      setError(null);

      const dict = await translationService.getDictionary(language);
      setDictionary(dict);
      translationService.setCurrentLanguage(language);

      // Store language preference in localStorage
      localStorage.setItem("preferredLanguage", language);
    } catch (err) {
      console.error("Failed to load translations:", err);
      setError(err instanceof Error ? err.message : "Failed to load translations");

      // Fallback to empty dictionary on error
      setDictionary({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLanguage = useCallback(
    (language: SupportedLanguage) => {
      setCurrentLanguage(language);
      loadDictionary(language);
    },
    [loadDictionary]
  );

  const refresh = useCallback(async () => {
    translationService.clearCache();
    await loadDictionary(currentLanguage);
  }, [currentLanguage, loadDictionary]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translationService.getTranslationValue(dictionary, key) || fallback || key;
    },
    [dictionary]
  );

  // Load initial language: prefer route-provided defaultLanguage; only use saved if it matches
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage") as SupportedLanguage;
    let initialLanguage: SupportedLanguage = defaultLanguage;

    if (savedLanguage && ["en", "ka"].includes(savedLanguage)) {
      if (savedLanguage === defaultLanguage) {
        initialLanguage = savedLanguage;
      } else {
        // Route changed; override stored preference to follow route
        localStorage.setItem("preferredLanguage", defaultLanguage);
      }
    } else {
      localStorage.setItem("preferredLanguage", defaultLanguage);
    }

    setCurrentLanguage(initialLanguage);
    loadDictionary(initialLanguage);
  }, [defaultLanguage, loadDictionary]);

  // Sync when defaultLanguage prop changes (e.g., route segment change) and differs from state
  useEffect(() => {
    if (currentLanguage !== defaultLanguage) {
      setCurrentLanguage(defaultLanguage);
      loadDictionary(defaultLanguage);
    }
  }, [defaultLanguage, currentLanguage, loadDictionary]);

  const value: TranslationContextType = {
    currentLanguage,
    dictionary,
    isLoading,
    error,
    setLanguage,
    t,
    refresh,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

// Hook to use translations
export function useTranslations() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslations must be used within a TranslationProvider");
  }
  return context;
}

// Hook for specific namespace
export function useNamespaceTranslations(namespace: string) {
  const { t, currentLanguage, isLoading, error } = useTranslations();

  const nt = useCallback(
    (key: string, fallback?: string): string => {
      return t(`${namespace}.${key}`, fallback);
    },
    [t, namespace]
  );

  return {
    t: nt,
    currentLanguage,
    isLoading,
    error,
  };
}

// Simple hook for cases where you just need the t function
export function useT() {
  const { t } = useTranslations();
  return t;
}
