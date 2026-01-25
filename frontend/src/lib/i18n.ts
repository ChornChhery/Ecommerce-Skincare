'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Initialize i18n only if not already initialized
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      defaultNS: 'common',
      ns: ['common'],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'language',
      },
      supportedLngs: ['en', 'kh'],
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false,
      },
      debug: false, // Set to true to see logs
      react: {
        useSuspense: false,
      },
    } as const)
    .then(() => {
      // Ensure we use only the base language code
      const currentLang = i18n.language;
      if (currentLang && currentLang.includes('-')) {
        const baseLanguage = currentLang.split('-')[0];
        if (['en', 'kh'].includes(baseLanguage)) {
          i18n.changeLanguage(baseLanguage);
        }
      }
    })
    .catch(error => {
      console.error('Failed to initialize i18n:', error);
    });
}

export default i18n;
