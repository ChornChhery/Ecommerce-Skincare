'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToastActions } from '@/contexts/ToastContext';

interface Product {
  id: number;
  name_en: string;
  name_th?: string;
  name_kh?: string;
  price: number;
  category: string;
  image_url: string;
  description_en: string;
  description_th?: string;
  description_km?: string;
  stock?: number;
  status?: string;
  skin_type?: string;
  created_at?: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { user, isAuthenticated } = useAuth();
  const toastActions = useToastActions();
  const params = useParams();
  const router = useRouter();
  
  // Get product ID from URL params
  const productId = params?.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!productId) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        // Assuming mockApi has a getProduct method, if not we'll get it from getProducts
        const response = await mockApi.getProducts();
        const foundProduct = response.data.find((p: any) => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Check if product is in favorites
          const currentFavorites = localStorage.getItem('favorites');
          if (currentFavorites) {
            try {
              const favorites = JSON.parse(currentFavorites);
              setIsFavorite(favorites.includes(foundProduct.id));
            } catch (error) {
              setIsFavorite(false);
            }
          }
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isAuthenticated, router]);

  const getProductName = (product: Product) => {
    if (user?.language === 'th') return product.name_th;
    if (user?.language === 'km') return product.name_kh;
    return product.name_en;
  };

  const getProductDescription = (product: Product) => {
    if (user?.language === 'th') return product.description_th || product.description_en;
    if (user?.language === 'km') return product.description_km || product.description_en;
    return product.description_en;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      product_id: product.id,
      quantity: quantity
    };
    
    // Get existing cart
    const existingCart = localStorage.getItem('cart');
    let cart = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (error) {
        cart = [];
      }
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.product_id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    toastActions.addedToCart(getProductName(product));
    
    // Trigger custom event to update navbar counter after state update
    setTimeout(() => {
      window.dispatchEvent(new Event('cartUpdated'));
    }, 0);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', productId, 'quantity:', quantity);
    // Add your purchase logic here
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    const currentFavorites = localStorage.getItem('favorites');
    let favorites = [];
    
    if (currentFavorites) {
      try {
        favorites = JSON.parse(currentFavorites);
      } catch (error) {
        favorites = [];
      }
    }
    
    const isCurrentlyFavorite = favorites.includes(product.id);
    
    if (isCurrentlyFavorite) {
      // Remove from favorites
      favorites = favorites.filter((id: number) => id !== product.id);
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(product.id);
      setIsFavorite(true);
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Show feedback message
    if (isCurrentlyFavorite) {
      toastActions.removedFromWishlist(getProductName(product));
    } else {
      toastActions.addedToWishlist(getProductName(product));
    }
    
    // Trigger custom event to update navbar counter after state update
    setTimeout(() => {
      window.dispatchEvent(new Event('wishlistUpdated'));
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.3s' }}></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading Product Details...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-red-500 mb-2">{error}</div>
          <div className="text-gray-500 mb-6">Product could not be found</div>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock additional images for gallery (you can replace with actual product images)
  const productImages = [
    product.image_url,
    product.image_url, // You can add more image URLs here
    product.image_url,
    product.image_url
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button 
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Products
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 capitalize">{product.category}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-medium">{getProductName(product)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-white/60 shadow-lg">
              <img
                src={productImages[selectedImage]}
                alt={getProductName(product)}
                className="w-full h-full object-cover"
              />
              
              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white rounded-full backdrop-blur-sm capitalize shadow-lg">
                  {product.category}
                </span>
              </div>

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Image Thumbnails */}
            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-3 ring-blue-500 ring-offset-2' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${getProductName(product)} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {getProductName(product)}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                  <span className="text-slate-600 ml-2 font-medium">4.8 (128 reviews)</span>
                </div>
              </div>

              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-6">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Skin Type Compatibility */}
            {user?.skin_type && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✨</span>
                  <span className="font-semibold text-slate-700">
                    Perfect for your <span className="text-blue-600">{user.skin_type}</span> skin type
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {getProductDescription(product)}
              </p>
            </div>

            {/* Key Benefits */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-slate-600">Deeply moisturizes and nourishes skin</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-slate-600">Reduces signs of aging and fine lines</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span className="text-slate-600">Suitable for daily use</span>
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-slate-500">In stock</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Buy Now - ${(product.price * quantity).toFixed(2)}
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Add to Cart
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">🚚</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Free Shipping</p>
                  <p className="text-sm text-slate-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">↩️</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Easy Returns</p>
                  <p className="text-sm text-slate-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}