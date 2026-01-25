# Complete i18n Implementation Guide 🌍

## Status: ✅ Phase 1 Complete

### What's Already Translated
- ✅ **Navbar** - All navigation items
- ✅ **Footer** - All footer content
- ✅ **LanguageSwitcher** - Language toggle buttons
- ✅ **All translation keys added** to JSON files (English & Khmer)

---

## How to Add Translations to Your Pages

### Quick Pattern - Use `<TranslatedText>` Component

```tsx
import { TranslatedText } from '@/components/TranslatedText';

// In your JSX:
<h1><TranslatedText translationKey="home.title" defaultText="Welcome to Skincare Store" /></h1>
<p><TranslatedText translationKey="home.featured" defaultText="Featured Products" /></p>
```

### Available Translation Keys by Page

#### Home Page (`/`)
```
home.title
home.featured
home.newArrivals
home.allCategories
home.shopNow
home.priceRange
home.inStock
home.sortBy
home.noProducts
```

#### Products Page (`/products/[id]`)
```
productPage.relatedProducts
productPage.productDetails
productPage.howToUse
productPage.ingredients
productPage.rating
productPage.reviews
productPage.writeReview
```

#### Cart Page (`/cart`)
```
cartPage.title
cartPage.empty
cartPage.continueShopping
cartPage.proceedToCheckout
cartPage.itemSubtotal
cartPage.shipping
cartPage.tax
cartPage.totalPrice
cartPage.quantity
cartPage.remove
```

#### Checkout Page (`/checkout`)
```
checkoutPage.title
checkoutPage.shippingInfo
checkoutPage.billingInfo
checkoutPage.orderSummary
checkoutPage.paymentMethod
checkoutPage.cardNumber
checkoutPage.expiryDate
checkoutPage.cvv
checkoutPage.placeOrder
checkoutPage.editCart
```

#### Login Page (`/login`)
```
loginPage.title
loginPage.email
loginPage.password
loginPage.signIn
loginPage.forgotPassword
loginPage.noAccount
loginPage.registerHere
loginPage.rememberMe
```

#### Register Page (`/register`)
```
registerPage.title
registerPage.firstName
registerPage.lastName
registerPage.email
registerPage.password
registerPage.confirmPassword
registerPage.skinType
registerPage.register
registerPage.haveAccount
registerPage.signInHere
```

#### Profile Page (`/profile`)
```
profilePage.title
profilePage.myOrders
profilePage.myWishlist
profilePage.editProfile
profilePage.changePassword
profilePage.logout
profilePage.personalInfo
profilePage.address
profilePage.phone
profilePage.city
profilePage.state
profilePage.zipCode
```

#### Orders Page (`/orders`)
```
ordersPage.title
ordersPage.orderID
ordersPage.date
ordersPage.status
ordersPage.total
ordersPage.viewDetails
ordersPage.pending
ordersPage.shipped
ordersPage.delivered
ordersPage.cancelled
```

#### Wishlist Page (`/wishlist`)
```
wishlistPage.title
wishlistPage.empty
wishlistPage.addedToCart
wishlistPage.moveToCart
wishlistPage.removeFromWishlist
```

---

## Step-by-Step: Update a Page

### Example: Update Home Page

1. **Open** `src/app/page.tsx`

2. **Import** the TranslatedText component at the top:
```tsx
import { TranslatedText } from '@/components/TranslatedText';
```

3. **Replace hardcoded text** with `<TranslatedText>`:
```tsx
// Before:
<h1>Welcome to Skincare Store</h1>

// After:
<h1><TranslatedText translationKey="home.title" defaultText="Welcome to Skincare Store" /></h1>
```

4. **Test** - Click English/ខ្មែរ button in navbar, the text should change!

---

## Adding New Translations

### 1. Add to JSON files:

**English** (`public/locales/en/common.json`):
```json
{
  "myPage": {
    "myKey": "My English Text"
  }
}
```

**Khmer** (`public/locales/kh/common.json`):
```json
{
  "myPage": {
    "myKey": "ទម្រង់ខ្មែរ"
  }
}
```

### 2. Use in component:
```tsx
<TranslatedText translationKey="myPage.myKey" defaultText="My English Text" />
```

---

## Pages Needing Updates (Priority Order)

1. **High Priority** (Most User-Facing):
   - [ ] Home page (`/src/app/page.tsx`)
   - [ ] Products page (`/src/app/products/page.tsx`)
   - [ ] Product details (`/src/app/products/[id]/page.tsx`)
   - [ ] Cart (`/src/app/cart/page.tsx`)
   - [ ] Checkout (`/src/app/checkout/page.tsx`)

2. **Medium Priority**:
   - [ ] Login (`/src/app/login/page.tsx`)
   - [ ] Register (`/src/app/register/page.tsx`)
   - [ ] Profile (`/src/app/profile/page.tsx`)

3. **Low Priority**:
   - [ ] Orders (`/src/app/orders/page.tsx`)
   - [ ] Wishlist (`/src/app/wishlist/page.tsx`)
   - [ ] Admin pages (if needed)

---

## File Structure Reference

```
frontend/
├── public/locales/
│   ├── en/common.json         ← English translations
│   └── kh/common.json         ← Khmer translations
├── src/
│   ├── components/
│   │   ├── TranslatedText.tsx ← Use this everywhere
│   │   ├── Navbar.tsx         ✅ Done
│   │   └── Footer.tsx         ✅ Done
│   ├── lib/
│   │   └── i18n.ts            ✅ Configured
│   └── app/
│       ├── page.tsx           ⏳ Todo
│       ├── login/page.tsx     ⏳ Todo
│       ├── register/page.tsx  ⏳ Todo
│       ├── products/page.tsx  ⏳ Todo
│       └── ...
```

---

## Quick Checklist for Each Page

When updating any page:
- [ ] Import `TranslatedText` component
- [ ] Find all hardcoded text
- [ ] Replace with `<TranslatedText>`
- [ ] Use appropriate `translationKey`
- [ ] Provide `defaultText` (same as English)
- [ ] Add keys to JSON files if new
- [ ] Test with language switcher

---

## Common Patterns

### Form Labels:
```tsx
<label><TranslatedText translationKey="auth.email" defaultText="Email" /></label>
```

### Button Text:
```tsx
<button><TranslatedText translationKey="nav.login" defaultText="Login" /></button>
```

### Titles:
```tsx
<h1><TranslatedText translationKey="cartPage.title" defaultText="Shopping Cart" /></h1>
```

### Error Messages:
```tsx
<div><TranslatedText translationKey="common.error" defaultText="Error" /></div>
```

---

## Need Help?

If you get stuck:
1. Check the available keys in `public/locales/en/common.json`
2. Make sure `TranslatedText` is imported
3. Use the same key structure: `section.key`
4. The app works even if translation key is missing (shows defaultText)

---

## Next Steps

1. **Update home page** - Most important, users see this first
2. **Update product pages** - Users browse products
3. **Update cart & checkout** - Critical for purchase flow
4. **Update auth pages** - For user registration/login
5. **Update profile pages** - User account management

**Ready to translate! Start with any page above! 🚀**
