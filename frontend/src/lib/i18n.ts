'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

if (!i18n.isInitialized) {
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
        checkWhitelist: true,
      },
      supportedLngs: ['en', 'kh'],
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false,
      },
    });

  // Ensure we use only the base language code
  const currentLang = i18n.language;
  if (currentLang && currentLang.includes('-')) {
    const baseLanguage = currentLang.split('-')[0];
    if (['en', 'kh'].includes(baseLanguage)) {
      i18n.changeLanguage(baseLanguage);
    }
  }
}

export default i18n;
