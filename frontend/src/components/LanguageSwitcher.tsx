'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <button
          disabled
          className="px-3 py-1 rounded text-sm font-medium transition-colors bg-gray-200 text-gray-700"
        >
          English
        </button>
        <button
          disabled
          className="px-3 py-1 rounded text-sm font-medium transition-colors bg-gray-200 text-gray-700"
        >
          ខ្មែរ
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-pink-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => i18n.changeLanguage('kh')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'kh'
            ? 'bg-pink-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ខ្មែរ
      </button>
    </div>
  );
}
