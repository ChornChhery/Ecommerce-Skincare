'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface TranslatedTextProps {
  translationKey: string;
  defaultText?: string;
}

export function TranslatedText({ translationKey, defaultText }: TranslatedTextProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{defaultText || translationKey}</>;
  }

  return <>{t(translationKey)}</>;
}
