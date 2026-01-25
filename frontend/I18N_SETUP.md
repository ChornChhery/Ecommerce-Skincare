# i18next Khmer Language Setup - Complete! 🇰🇭

## What's Been Implemented

### 1. **Translation Files Created**
- ✅ `/public/locales/en/common.json` - English translations
- ✅ `/public/locales/kh/common.json` - Khmer translations (with code `kh`)

### 2. **i18next Configuration** 
- ✅ `src/lib/i18n.ts` - i18next initialization
- ✅ Automatic language detection from browser
- ✅ Local storage persistence

### 3. **Provider Setup**
- ✅ `src/components/I18nProvider.tsx` - i18n wrapper component
- ✅ `src/app/layout.tsx` - Updated to use I18nProvider

### 4. **Language Switcher Component**
- ✅ `src/components/LanguageSwitcher.tsx` - Beautiful language switcher buttons
- ✅ Works on desktop and mobile
- ✅ Integrated into Navbar

### 5. **Navbar Integration**
- ✅ Navbar updated with `useTranslation()` hook
- ✅ Language switcher visible in desktop and mobile menus
- ✅ Ready to use translations throughout the component

---

## How to Use

### In Your Components

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('product.price')}</p>
      <button>{t('product.addToCart')}</button>
    </div>
  );
}
```

### Translation Keys Available

**Navigation:**
- `nav.home`, `nav.products`, `nav.cart`, `nav.checkout`
- `nav.login`, `nav.register`, `nav.profile`, `nav.orders`
- `nav.wishlist`, `nav.logout`, `nav.admin`

**Products:**
- `product.title`, `product.price`, `product.addToCart`
- `product.addToWishlist`, `product.description`, `product.reviews`
- `product.inStock`, `product.outOfStock`, `product.quantity`

**Cart & Checkout:**
- `cart.title`, `cart.empty`, `cart.subtotal`, `cart.total`
- `checkout.title`, `checkout.shippingAddress`, `checkout.paymentMethod`

**Authentication:**
- `auth.email`, `auth.password`, `auth.login`, `auth.register`

**Common:**
- `common.search`, `common.filter`, `common.loading`, `common.error`

---

## Adding More Translations

### Step 1: Add to English file (`public/locales/en/common.json`)
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

### Step 2: Add to Khmer file (`public/locales/kh/common.json`)
```json
{
  "mySection": {
    "myKey": "ការបកប្រែខ្មែរ"
  }
}
```

### Step 3: Use in Component
```tsx
const { t } = useTranslation();
<h1>{t('mySection.myKey')}</h1>
```

---

## Features

✨ **Automatic Language Detection**
- Detects browser language preference
- Saves selection to localStorage

✨ **Smooth Language Switching**
- Click English/ខ្មែរ buttons to switch
- UI updates instantly

✨ **Mobile Friendly**
- Language switcher in mobile menu
- Responsive design

---

## Next Steps

1. **Update all hardcoded text** in your components to use `t()` function
2. **Add more translations** as you build new features
3. **Test with Khmer RTL** if needed in the future

---

## File Structure
```
frontend/
├── public/
│   └── locales/
│       ├── en/
│       │   └── common.json
│       └── kh/
│           └── common.json
├── src/
│   ├── lib/
│   │   └── i18n.ts
│   ├── components/
│   │   ├── I18nProvider.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Navbar.tsx (Updated)
│   └── app/
│       └── layout.tsx (Updated)
```

---

**Ready to go! Your Khmer language support is now live! 🎉**
