import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ge from "../../dictionaries/ge.json";
import en from "../../dictionaries/en.json";

export type Language = "ka" | "en";
export type Dictionary = typeof ge;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ka";
    }
    return "ka";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const dictionary = language === "ka" ? ge : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
