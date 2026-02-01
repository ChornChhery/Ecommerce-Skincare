import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n with default resources for SSR compatibility
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      defaultNS: 'common',
      ns: ['common'],
      supportedLngs: ['en', 'kh'],
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false,
      },
      debug: false, // Set to true to see logs
      react: {
        useSuspense: false,
      },
      // Preload basic resources to avoid build issues
      resources: {
        en: {
          common: {
            home: {
              title: 'Premium Skincare Collection',
              subtitle: 'Discover professional-grade skincare products carefully selected for quality, effectiveness, and outstanding results.',
              loading: 'Loading products...',
              errorMsg: 'Please try refreshing the page or contact support if the problem persists.'
            },
            common: {
              searchPlaceholder: 'Search skincare products...',
              refresh: 'Refresh Page',
              previous: 'Previous',
              next: 'Next',
              pagination: {
                showingResults: 'Showing {{start}} to {{end}} of {{total}} results',
                previous: 'Previous',
                next: 'Next'
              }
            },
            auth: {
              signInToPurchase: 'Sign In to Purchase'
            },
            product: {
              filters: 'Filters',
              filterProducts: 'Filter Products',
              clearAll: 'Clear all',
              categories: 'Categories',
              skinCare: 'Skincare',
              cleanser: 'Cleanser',
              moisturizer: 'Moisturizer',
              serum: 'Serum',
              sunscreen: 'Sunscreen',
              toner: 'Toner',
              mask: 'Mask',
              exfoliator: 'Exfoliator',
              essence: 'Essence',
              eye_cream: 'Eye Cream',
              oil: 'Oil',
              treatment: 'Treatment',
              medicine: 'Medicine',
              priceRange: 'Price Range',
              sortBy: 'Sort By',
              sortName: 'Name (A to Z)',
              sortPriceLow: 'Price (Low to High)',
              sortPriceHigh: 'Price (High to Low)',
              sortRating: 'Highest Rated',
              sortPopular: 'Most Popular',
              inStockOnly: 'In Stock Only',
              noFound: 'No Products Found',
              noFoundMsg: "We couldn't find any products matching your current filters. Try adjusting your search criteria.",
              noAvailable: 'No Products Available',
              noAvailableMsg: 'Our product collection is currently being updated. Please check back soon!',
              buyNow: 'Buy Now',
              unavailable: 'Unavailable'
            }
          }
        },
        kh: {
          common: {
            home: {
              title: 'សំណុំផ្នែកថែរក្សាសើបសំបក',
              subtitle: 'រកមើលផលិតផលថែរក្សាសើបសំបកដែលមានគុណភាព បានជ្រើសរើសដោយបារម្ភចំពោះគុណភាព ប្រសិទ្ធភាព និងលទ្ធផលអស្ចារ្យ។',
              loading: 'កំពុងផ្ទុកផលិតផល...',
              errorMsg: 'សូមព្យាយាមផ្ទុកឡើងវិញ ឬទាក់ទងផ្នែកសេវាកម្មប្រសិនបើបញ្ហាមិនអាក់រាំង។'
            },
            common: {
              searchPlaceholder: 'ស្វែងរកផលិតផលថែរក្សាសើបសំបក...',
              refresh: 'ផ្ទុកឡើងវិញ',
              previous: 'មុន',
              next: 'បន្ទាប់',
              pagination: {
                showingResults: 'បង្ហាញ {{start}} ទៅ {{end}} នៃ {{total}} លទ្ធផល',
                previous: 'មុន',
                next: 'បន្ទាប់'
              }
            },
            auth: {
              signInToPurchase: 'ចូលដើម្បីទិញ'
            },
            product: {
              filters: 'តម្រង',
              filterProducts: 'តម្រងផលិតផល',
              clearAll: 'សម្អាតទាំងអស់',
              categories: 'ប្រភេទ',
              skinCare: 'ថែរក្សាសើបសំបក',
              cleanser: 'ធ្វើសំអាត',
              moisturizer: 'ជួយរក្សាសំបក',
              serum: 'ធាតុបំប៉ន',
              sunscreen: 'ការពារពីពន្លឺថ្ងៃ',
              toner: 'ធាតុបន្សុត',
              mask: 'ម៉ាស់',
              exfoliator: 'ធាតុសម្អាត',
              essence: 'ធាតុសំខាន់',
              eye_cream: 'គ្រឿងសម្អាតភ្នែក',
              oil: 'ប្រេង',
              treatment: 'ការព្យាបាល',
              medicine: 'ឱសថ',
              priceRange: 'ចន្លោះតម្លៃ',
              sortBy: 'តម្រៀបតាម',
              sortName: 'ឈ្មោះ (ក ទៅ អ)',
              sortPriceLow: 'តម្លៃ (ទាបទៅខ្ពស់)',
              sortPriceHigh: 'តម្លៃ (ខ្ពស់ទៅទាប)',
              sortRating: 'វាយតម្លៃខ្ពស់បំផុត',
              sortPopular: 'ពេញនិយមបំផុត',
              inStockOnly: 'នៅសល់ក្នុងស្តុកប៉ុណ្ណោះ',
              noFound: 'រកមិនឃើញផលិតផល',
              noFoundMsg: 'យើងមិនអាចរកឃើញផលិតផលណាមួយដែលផ្គូរផ្គងនឹងតម្រងបច្ចុប្បន្នរបស់អ្នកទេ។ សូមព្យាយាមកែសម្រួលលក្ខខណ្ឌស្វែងរក។',
              noAvailable: 'គ្មានផលិតផលដែលអាចប្រើបាន',
              noAvailableMsg: 'សំណុំផលិតផលរបស់យើងកំពុងត្រូវបានធ្វើបច្ចុប្បន្នភាព។ សូមត្រួតពិនិត្យឡើងវិញក្នុងពេលឆាប់ៗ!',
              buyNow: 'ទិញឥឡូវនេះ',
              unavailable: 'មិនអាចប្រើបាន'
            }
          }
        }
      },
    } as const)
    .catch(error => {
      console.error('Failed to initialize i18n:', error);
    });
}
// Export a function to initialize with backend resources on client side
export const initI18nClient = async () => {
  if (typeof window !== 'undefined' && !i18n.isInitialized) {
    const HttpBackend = (await import('i18next-http-backend')).default;
    const LanguageDetector = (await import('i18next-browser-languagedetector')).default;
    
    await i18n
      .use(HttpBackend)
      .use(LanguageDetector)
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
      } as const);
      
    // Ensure we need to use only the base language code
    const currentLang = i18n.language;
    if (currentLang && currentLang.includes('-')) {
      const baseLanguage = currentLang.split('-')[0];
      if (['en', 'kh'].includes(baseLanguage)) {
        i18n.changeLanguage(baseLanguage);
      }
    }
  }
};

export default i18n;


