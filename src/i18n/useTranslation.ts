import { useLanguage } from './LanguageContext';

export function useTranslation() {
  const { t, language, setLanguage, availableLanguages, currentLanguage } = useLanguage();
  
  return {
    t,
    language,
    setLanguage,
    availableLanguages,
    currentLanguage,
  };
}
