"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { translationService } from "@/lib/translationService";
import { Language, SupportedLanguage } from "@/types/translations";

interface LanguageSwitcherProps {
  className?: string;
  showFlag?: boolean;
}

export function LanguageSwitcher({ className = "", showFlag = true }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, isLoading } = useTranslations();
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languages = await translationService.getLanguages();
        setAvailableLanguages(languages);
      } catch (error) {
        console.error("Failed to load languages:", error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    setLanguage(languageCode);
  };

  if (loadingLanguages) {
    return (
      <div className={`language-switcher loading ${className}`}>
        <span>...</span>
      </div>
    );
  }

  return (
    <div className={`language-switcher ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
        disabled={isLoading}
        className="language-select"
      >
        {availableLanguages.map((language) => (
          <option key={language.id} value={language.code}>
            {showFlag && getLanguageFlag(language.code)} {language.name}
          </option>
        ))}
      </select>

      <style jsx>{`
        .language-switcher {
          display: inline-block;
        }

        .language-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          min-width: 120px;
        }

        .language-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .language-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .loading {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

// Alternative button-style language switcher
export function LanguageSwitcherButtons({ className = "" }: { className?: string }) {
  const { currentLanguage, setLanguage, isLoading } = useTranslations();
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languages = await translationService.getLanguages();
        setAvailableLanguages(languages);
      } catch (error) {
        console.error("Failed to load languages:", error);
      }
    };

    loadLanguages();
  }, []);

  return (
    <div className={`language-buttons ${className}`}>
      {availableLanguages.map((language) => (
        <button
          key={language.id}
          onClick={() => setLanguage(language.code as SupportedLanguage)}
          disabled={isLoading}
          className={`language-button ${currentLanguage === language.code ? "active" : ""}`}
        >
          {getLanguageFlag(language.code)} {language.code.toUpperCase()}
        </button>
      ))}

      <style jsx>{`
        .language-buttons {
          display: flex;
          gap: 4px;
        }

        .language-button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 12px;
          transition: all 0.2s;
        }

        .language-button:hover {
          background: #f5f5f5;
        }

        .language-button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .language-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// Helper function to get flag emoji for language
function getLanguageFlag(languageCode: string): string {
  const flags: Record<string, string> = {
    en: "🇺🇸", // or 🇬🇧 for UK
    ka: "🇬🇪",
  };

  return flags[languageCode] || "🌐";
}
