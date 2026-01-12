import { vi, enUS, zhCN, ja, ko, Locale } from 'date-fns/locale';

export const getDateLocale = (lang: string): Locale => {
  const locales: Record<string, Locale> = {
    vi,
    en: enUS,
    zh: zhCN,
    ja,
    ko,
  };
  return locales[lang] || vi;
};
