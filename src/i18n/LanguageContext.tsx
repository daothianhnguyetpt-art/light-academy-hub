import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import all locale files
import vi from './locales/vi.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

export type LanguageCode = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const availableLanguages: Language[] = [
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

// Define translations type based on vi.json structure
type Translations = typeof vi;

// Locale type definitions - use explicit casting to avoid type inference issues
const locales: Record<LanguageCode, Translations> = {
  vi,
  en: en as unknown as Translations,
  zh: zh as unknown as Translations,
  ja: ja as unknown as Translations,
  ko: ko as unknown as Translations,
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: Language[];
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'fun-academy-language';

// Get nested value from object using dot notation
const getNestedValue = (obj: Record<string, any>, path: string): string => {
  const keys = path.split('.');
  let result: any = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof result === 'string' ? result : path;
};

// Detect browser language
const detectBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLang = availableLanguages.find(lang => lang.code === browserLang);
  return supportedLang ? supportedLang.code : 'vi'; // Default to Vietnamese
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && availableLanguages.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    // Otherwise detect from browser
    return detectBrowserLanguage();
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const locale = locales[language];
    let translation = getNestedValue(locale as Record<string, any>, key);
    
    // Replace parameters like {{name}} with actual values
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), value);
      });
    }
    
    return translation;
  };

  const currentLanguage = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages,
    currentLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
