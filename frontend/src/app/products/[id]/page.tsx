'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockApi, mockProducts, mockReviews } from '@/lib/mockApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

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
  stock: number;
  skin_type: string;
  in_stock?: boolean;
  stock_count?: number;
  original_price?: number;
  rating?: number;
  reviews_count?: number;
  is_sale?: boolean;
  sale_percentage?: number;
}

interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
}

interface CartItem {
  product_id: number;
  quantity: number;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hoveredReviewStar, setHoveredReviewStar] = useState<number | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  // Get product ID from URL params
  const productId = params?.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : null;

  // Category configurations (matching homepage)
  const categoryConfig: Record<string, { icon: string; color: string }> = {
    'all': { icon: '🌟', color: 'from-slate-500 to-slate-600' },
    'cleanser': { icon: '🧼', color: 'from-blue-500 to-cyan-500' },
    'moisturizer': { icon: '💧', color: 'from-blue-400 to-teal-500' },
    'serum': { icon: '✨', color: 'from-purple-500 to-pink-500' },
    'sunscreen': { icon: '☀️', color: 'from-yellow-500 to-orange-500' },
    'toner': { icon: '🌿', color: 'from-green-500 to-emerald-500' },
    'mask': { icon: '🎭', color: 'from-indigo-500 to-purple-500' },
    'exfoliator': { icon: '🔄', color: 'from-red-500 to-pink-500' },
    'essence': { icon: '💎', color: 'from-cyan-500 to-blue-500' },
    'eye cream': { icon: '👁️', color: 'from-rose-500 to-pink-500' },
    'oil': { icon: '🫒', color: 'from-amber-500 to-yellow-500' },
    'treatment': { icon: '🧴', color: 'from-violet-500 to-purple-500' }
  };

  // Enhanced product data
  const enhanceProductData = (product: Product): Product => {
    return {
      ...product,
      in_stock: product.stock > 0,
      stock_count: product.stock,
      original_price: Math.random() > 0.7 ? product.price * 1.3 : undefined,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews_count: Math.floor(Math.random() * 200) + 10,
      is_sale: Math.random() > 0.7,
      sale_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined
    };
  };

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

    const fetchProductData = async () => {
      try {
        // Get product details
        const response = await mockApi.getProducts();
        const foundProduct = response.data.find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          const enhancedProduct = enhanceProductData(foundProduct);
          setProduct(enhancedProduct);
          
          // Get related products (same category, different product)
          const related = response.data
            .filter((p: Product) => p.category === foundProduct.category && p.id !== productId)
            .map(p => enhanceProductData(p))
            .slice(0, 4);
          setRelatedProducts(related);
          
          // Get product reviews
          const productReviews = mockReviews.filter(r => r.product_id === productId && r.status === 'approved');
          setReviews(productReviews);

          // Load user data
          const savedFavorites = localStorage.getItem('favorites');
          const savedCart = localStorage.getItem('cart');
          
          if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
          if (savedCart) setCart(JSON.parse(savedCart));

          // Check if product is in favorites
          if (savedFavorites) {
            const favoritesArray = JSON.parse(savedFavorites);
            setIsFavorite(favoritesArray.includes(productId));
          }

          // Add to recently viewed
          const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const filteredRecentlyViewed = savedRecentlyViewed.filter((p: Product) => p.id !== productId);
          const updatedRecentlyViewed = [enhancedProduct, ...filteredRecentlyViewed].slice(0, 6);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, isAuthenticated, router]);

  const getProductName = (product: Product) => {
    if (user?.language === 'th' && product.name_th) return product.name_th;
    if (user?.language === 'km' && product.name_kh) return product.name_kh;
    return product.name_en;
  };

  const getProductDescription = (product: Product) => {
    if (user?.language === 'th' && product.description_th) return product.description_th;
    if (user?.language === 'km' && product.description_km) return product.description_km;
    return product.description_en;
  };

  const showNotificationMessage = (message: string) => {
    setShowSuccessMessage(message);
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const handleAddToCart = async (productToAdd?: Product, quantityToAdd: number = 1) => {
    const targetProduct = productToAdd || product;
    const targetProductId = targetProduct?.id;
    
    if (!targetProduct || !targetProduct.in_stock) {
      showNotificationMessage('❌ Product is out of stock');
      return;
    }

    if (!productToAdd && quantity > targetProduct.stock_count!) {
      showNotificationMessage('❌ Quantity exceeds available stock');
      return;
    }
    
    if (productToAdd) {
      setIsAddingToCart(true);
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      setIsAddingToCart(true);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Update cart using same structure as homepage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: CartItem) => item.product_id === targetProductId);
    
    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = existingCart.map((item: CartItem) =>
        item.product_id === targetProductId
          ? { ...item, quantity: item.quantity + (productToAdd ? quantityToAdd : quantity) }
          : item
      );
    } else {
      updatedCart = [...existingCart, { product_id: targetProductId, quantity: productToAdd ? quantityToAdd : quantity }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    setIsAddingToCart(false);
    showNotificationMessage('✅ Added to cart successfully!');
  };

  const handleBuyNow = async (productToBuy?: Product) => {
    const targetProduct = productToBuy || product;
    
    if (!targetProduct || !targetProduct.in_stock) {
      showNotificationMessage('❌ Product is out of stock');
      return;
    }

    if (!productToBuy && quantity > targetProduct.stock_count!) {
      showNotificationMessage('❌ Quantity exceeds available stock');
      return;
    }
    
    // Add to cart first
    await handleAddToCart(productToBuy, 1);
    
    // Navigate to cart page
    setTimeout(() => router.push('/cart'), 1000);
  };

  const toggleFavorite = (e?: React.MouseEvent, targetProductId?: number) => {
    if (e) e.stopPropagation();
    
    const productIdToToggle = targetProductId || productId!;
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.has(productIdToToggle)) {
      const updatedFavorites = savedFavorites.filter((id: number) => id !== productIdToToggle);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(productIdToToggle);
        return newFavorites;
      });
      if (!targetProductId) setIsFavorite(false);
      showNotificationMessage('💔 Removed from favorites');
    } else {
      const updatedFavorites = [...savedFavorites, productIdToToggle];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.add(productIdToToggle);
        return newFavorites;
      });
      if (!targetProductId) setIsFavorite(true);
      showNotificationMessage('❤️ Added to favorites');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    const review = {
      id: Date.now(),
      product_id: product.id,
      customer_name: `${user.first_name} ${user.last_name}`,
      rating: newReview.rating,
      comment: newReview.comment,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };

    setReviews([review as Review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
    setHoveredReviewStar(null);
    
    showNotificationMessage('✅ Review submitted! It will be visible after moderation.');
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const renderInteractiveStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredReviewStar || newReview.rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setNewReview({...newReview, rating: starValue})}
          onMouseEnter={() => setHoveredReviewStar(starValue)}
          onMouseLeave={() => setHoveredReviewStar(null)}
          className={`text-3xl transition-all duration-200 hover:scale-110 ${
            isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
        >
          ⭐
        </button>
      );
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : (product?.rating || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Background elements matching homepage */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh] relative z-10">
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
        {/* Background elements matching homepage */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh] relative z-10">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-red-500 mb-2">{error}</div>
          <div className="text-slate-500 mb-6">Product could not be found</div>
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

  // Mock additional images for gallery
  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-white/90 backdrop-blur-sm border border-green-200 text-green-800 px-6 py-3 rounded-xl shadow-lg animate-pulse">
          {showSuccessMessage}
        </div>
      )}

      {/* Background elements matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button 
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:scale-105 duration-200"
          >
            Home
          </button>
          <span className="text-slate-400">→</span>
          <span className="text-slate-600 capitalize">{product.category}</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-800 font-medium truncate">{getProductName(product)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={productImages[selectedImage]}
                alt={getProductName(product)}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  !product.in_stock ? 'grayscale opacity-60' : ''
                }`}
              />
              
              {/* Sale Badge */}
              {product.is_sale && product.sale_percentage && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{product.sale_percentage}% OFF
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute bottom-4 left-4">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-gradient-to-r ${
                  categoryConfig[product.category.toLowerCase()]?.color || 'from-gray-500 to-gray-600'
                } text-white rounded-full backdrop-blur-sm capitalize shadow-lg`}>
                  <span>{categoryConfig[product.category.toLowerCase()]?.icon || '🧴'}</span>
                  <span>{product.category}</span>
                </span>
              </div>

              {/* Stock Status */}
              {!product.in_stock && (
                <div className="absolute top-4 right-4 left-4 z-10 bg-red-500/90 text-white text-center py-2 rounded-xl font-bold text-sm">
                  Out of Stock
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
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
                      ? 'ring-3 ring-blue-500 ring-offset-2 scale-105' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
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
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-slate-600 ml-2 font-medium">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'No rating'} ({product.reviews_count || reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-slate-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.in_stock ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`font-semibold ${
                      (product.stock_count || 0) <= 5 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {(product.stock_count || 0) <= 5 
                        ? `Only ${product.stock_count} left in stock!`
                        : `In Stock (${product.stock_count} available)`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skin Type Compatibility */}
            {user?.skin_type && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✨</span>
                  <span className="font-semibold text-slate-700">
                    {product.skin_type === 'all' || product.skin_type === user.skin_type 
                      ? `Perfect for your ${user.skin_type} skin type!`
                      : `Recommended for ${product.skin_type} skin (you have ${user.skin_type})`
                    }
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

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-xl transition-colors hover:scale-110 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_count || 0, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-xl transition-colors hover:scale-110 active:scale-95"
                    disabled={quantity >= (product.stock_count || 0)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-slate-500">Max: {product.stock_count || 0}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => handleBuyNow()}
                disabled={!product.in_stock}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:grayscale"
              >
                {product.in_stock ? `Buy Now - $${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
              </button>
              <button
                onClick={() => handleAddToCart()}
                disabled={isAddingToCart || !product.in_stock}
                className="flex-1 bg-white/70 backdrop-blur-sm border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-slate-700 font-semibold mb-3">Rating</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderInteractiveStars()}
                    </div>
                    <span className="ml-4 text-lg font-medium text-slate-600">
                      {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    {hoveredReviewStar ? `Click to rate ${hoveredReviewStar} star${hoveredReviewStar !== 1 ? 's' : ''}` : 'Click on a star to rate this product'}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-slate-700 font-semibold mb-3">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full p-4 border border-slate-300 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setHoveredReviewStar(null);
                      setNewReview({ rating: 5, comment: '' });
                    }}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-2xl font-semibold text-slate-600 mb-2">No reviews yet</p>
                <p className="text-slate-500">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{review.customer_name}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-slate-500 text-sm">{review.created_at}</span>
                      </div>
                    </div>
                    {review.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/60 hover:border-blue-200/80 shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  onClick={() => router.push(`/products/${relatedProduct.id}`)}
                  onMouseEnter={() => setHoveredProduct(relatedProduct.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Sale Badge */}
                  {relatedProduct.is_sale && relatedProduct.sale_percentage && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{relatedProduct.sale_percentage}% OFF
                    </div>
                  )}

                  {/* Stock Status */}
                  {!relatedProduct.in_stock && (
                    <div className="absolute top-4 right-4 left-4 z-10 bg-red-500/90 text-white text-center py-2 rounded-xl font-bold text-sm">
                      Out of Stock
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image_url}
                      alt={getProductName(relatedProduct)}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                        !relatedProduct.in_stock ? 'grayscale opacity-60' : ''
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold bg-gradient-to-r ${
                        categoryConfig[relatedProduct.category.toLowerCase()]?.color || 'from-gray-500 to-gray-600'
                      } text-white rounded-full backdrop-blur-sm capitalize shadow-lg`}>
                        <span>{categoryConfig[relatedProduct.category.toLowerCase()]?.icon || '🧴'}</span>
                        <span>{relatedProduct.category}</span>
                      </span>
                    </div>

                    {/* Quick actions */}
                    <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                      hoveredProduct === relatedProduct.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <button
                        onClick={(e) => toggleFavorite(e, relatedProduct.id)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${
                          favorites.has(relatedProduct.id)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <svg className={`w-3 h-3 ${favorites.has(relatedProduct.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${relatedProduct.id}`);
                        }}
                        className="w-8 h-8 rounded-full backdrop-blur-md border border-white/30 bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 flex-1 pr-2">
                        {getProductName(relatedProduct)}
                      </h3>
                      {relatedProduct.stock_count && relatedProduct.stock_count <= 5 && relatedProduct.in_stock && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          Only {relatedProduct.stock_count} left
                        </span>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(relatedProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {relatedProduct.rating?.toFixed(1)} ({relatedProduct.reviews_count} reviews)
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed text-sm">
                      {relatedProduct.description_en}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-3 mb-6">
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                      {relatedProduct.original_price && (
                        <span className="text-lg text-slate-400 line-through">
                          ${relatedProduct.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons - Enhanced like homepage */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(relatedProduct);
                          }}
                          disabled={!relatedProduct.in_stock}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {relatedProduct.in_stock ? 'Buy Now' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(relatedProduct, 1);
                          }}
                          disabled={!relatedProduct.in_stock}
                          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}