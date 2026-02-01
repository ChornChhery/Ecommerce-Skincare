'use client';

import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import i18n, { initI18nClient } from '@/lib/i18n';
import { ReactNode } from 'react';

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initI18nClient();
  }, []);
  
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
