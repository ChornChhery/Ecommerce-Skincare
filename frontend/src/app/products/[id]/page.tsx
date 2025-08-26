'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockApi, mockReviews } from '@/lib/mockApi';
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
  stock?: number;
  skin_type?: string;
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
  const [showNotification, setShowNotification] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const productId = params?.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : null;

  const categoryConfig: Record<string, { icon: string }> = {
    'all': { icon: '🌟' },
    'cleanser': { icon: '🧼' },
    'moisturizer': { icon: '💧' },
    'serum': { icon: '✨' },
    'sunscreen': { icon: '☀️' },
    'toner': { icon: '🌿' },
    'mask': { icon: '🎭' },
    'exfoliator': { icon: '🔄' },
    'essence': { icon: '💎' },
    'eye cream': { icon: '👁️' },
    'oil': { icon: '🫒' },
    'treatment': { icon: '🧴' },
    'medicine': { icon: '💊' }
  };

  const enhanceProductData = (product: Product): Product => {
    return {
      ...product,
      in_stock: Math.random() > 0.1,
      stock_count: Math.floor(Math.random() * 50) + 1,
      original_price: Math.random() > 0.6 ? Math.round(product.price * (1.2 + Math.random() * 0.5) * 100) / 100 : undefined,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews_count: Math.floor(Math.random() * 500) + 10,
      is_sale: Math.random() > 0.6,
      sale_percentage: Math.random() > 0.6 ? Math.floor(Math.random() * 40) + 10 : undefined
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
        const response = await mockApi.getProducts();
        const foundProduct = response.data.find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          const enhancedProduct = enhanceProductData(foundProduct);
          setProduct(enhancedProduct);
          
          const related = response.data
            .filter((p: Product) => p.category === foundProduct.category && p.id !== productId)
            .map(p => enhanceProductData(p))
            .slice(0, 4);
          setRelatedProducts(related);
          
          const productReviews = mockReviews.filter(r => r.product_id === productId && r.status === 'approved');
          setReviews(productReviews);

          const savedFavorites = localStorage.getItem('favorites');
          const savedCart = localStorage.getItem('cart');
          
          if (savedFavorites) {
            const favoritesArray = JSON.parse(savedFavorites);
            setFavorites(new Set(favoritesArray));
            setIsFavorite(favoritesArray.includes(productId));
          }
          if (savedCart) setCart(JSON.parse(savedCart));

          const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const filteredRecentlyViewed = savedRecentlyViewed.filter((p: Product) => p.id !== productId);
          const updatedRecentlyViewed = [enhancedProduct, ...filteredRecentlyViewed].slice(0, 8);
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
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const handleAddToCart = async (productToAdd?: Product, quantityToAdd: number = 1) => {
    const targetProduct = productToAdd || product;
    const targetProductId = targetProduct?.id;
    
    if (!targetProduct || !targetProduct.in_stock) {
      showNotificationMessage('Product is out of stock');
      return;
    }

    if (!productToAdd && quantity > targetProduct.stock_count!) {
      showNotificationMessage('Quantity exceeds available stock');
      return;
    }
    
    if (!productToAdd) {
      setIsAddingToCart(true);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setCart(prev => {
      const existingItem = prev.find(item => item.product_id === targetProductId);
      let updated;
      
      if (existingItem) {
        updated = prev.map(item =>
          item.product_id === targetProductId
            ? { ...item, quantity: item.quantity + (productToAdd ? quantityToAdd : quantity) }
            : item
        );
      } else {
        updated = [...prev, { product_id: targetProductId, quantity: productToAdd ? quantityToAdd : quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    
    setIsAddingToCart(false);
    showNotificationMessage('Added to cart successfully');
  };

  const handleBuyNow = async (productToBuy?: Product) => {
    const targetProduct = productToBuy || product;
    
    if (!targetProduct || !targetProduct.in_stock) {
      showNotificationMessage('Product is out of stock');
      return;
    }

    if (!productToBuy && quantity > targetProduct.stock_count!) {
      showNotificationMessage('Quantity exceeds available stock');
      return;
    }
    
    await handleAddToCart(productToBuy, 1);
    setTimeout(() => router.push('/cart'), 1000);
  };

  const toggleFavorite = (e?: React.MouseEvent, targetProductId?: number) => {
    if (e) e.stopPropagation();
    
    const productIdToToggle = targetProductId || productId!;
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productIdToToggle)) {
        newFavorites.delete(productIdToToggle);
        if (!targetProductId) setIsFavorite(false);
        showNotificationMessage('Removed from favorites');
      } else {
        newFavorites.add(productIdToToggle);
        if (!targetProductId) setIsFavorite(true);
        showNotificationMessage('Added to favorites');
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
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
    
    showNotificationMessage('Review submitted! It will be visible after moderation.');
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const renderInteractiveStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= newReview.rating;
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setNewReview({...newReview, rating: starValue})}
          className={`text-2xl transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : (product?.rating || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[70vh] px-4">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-gray-600 mb-6">The product you're looking for could not be found.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-white border-l-4 border-green-500 px-6 py-4 rounded-lg shadow-lg max-w-sm">
          <p className="text-gray-800 font-medium">{showNotification}</p>
        </div>
      )}

      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button 
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Home
          </button>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600 capitalize">{product.category}</span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{getProductName(product)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <img
                src={productImages[selectedImage]}
                alt={getProductName(product)}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  !product.in_stock ? 'grayscale opacity-60' : ''
                }`}
              />
              
              {!product.in_stock && (
                <div className="absolute top-4 left-4 right-4 z-10 bg-gray-900/90 text-white text-center py-2 rounded-lg font-medium text-sm">
                  Out of Stock
                </div>
              )}

              {product.is_sale && product.sale_percentage && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{product.sale_percentage}% OFF
                </div>
              )}

              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-gray-900/80 text-white rounded-lg backdrop-blur-sm capitalize">
                  <span>{categoryConfig[product.category.toLowerCase()]?.icon || '🧴'}</span>
                  <span>{product.category}</span>
                </span>
              </div>

              <button
                onClick={toggleFavorite}
                className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {getProductName(product)}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-gray-600 ml-2 font-medium">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'No rating'} ({product.reviews_count || reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                      {calculateDiscount(product.original_price, product.price)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <div className="mb-6">
                {product.in_stock ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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

            {user?.skin_type && product.skin_type && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✨</span>
                  <span className="font-semibold text-gray-700">
                    {product.skin_type === 'all' || product.skin_type === user.skin_type 
                      ? `Perfect for your ${user.skin_type} skin type!`
                      : `Recommended for ${product.skin_type} skin (you have ${user.skin_type})`
                    }
                  </span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {getProductDescription(product)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_count || 0, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                    disabled={quantity >= (product.stock_count || 0)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-gray-500">Max: {product.stock_count || 0}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => handleBuyNow()}
                disabled={!product.in_stock}
                className="flex-1 bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.in_stock ? `Buy Now - $${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
              </button>
              <button
                onClick={() => handleAddToCart()}
                disabled={isAddingToCart || !product.in_stock}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-3">Rating</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderInteractiveStars()}
                    </div>
                    <span className="ml-4 text-gray-600 font-medium">
                      {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewReview({ rating: 5, comment: '' });
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</p>
                <p className="text-gray-500">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{review.customer_name}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-gray-500 text-sm">{review.created_at}</span>
                      </div>
                    </div>
                    {review.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => router.push(`/products/${relatedProduct.id}`)}
                >
                  {!relatedProduct.in_stock && (
                    <div className="absolute top-4 left-4 right-4 z-10 bg-gray-900/90 text-white text-center py-2 rounded-lg font-medium text-sm">
                      Out of Stock
                    </div>
                  )}

                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={relatedProduct.image_url}
                      alt={getProductName(relatedProduct)}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        !relatedProduct.in_stock ? 'grayscale opacity-60' : ''
                      }`}
                    />
                    
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => toggleFavorite(e, relatedProduct.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                          favorites.has(relatedProduct.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <svg className={`w-4 h-4 ${favorites.has(relatedProduct.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${relatedProduct.id}`);
                        }}
                        className="w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium bg-gray-900/80 text-white rounded-lg backdrop-blur-sm capitalize">
                        <span>{categoryConfig[relatedProduct.category.toLowerCase()]?.icon || '🧴'}</span>
                        <span>{relatedProduct.category}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                        {getProductName(relatedProduct)}
                      </h2>
                      {relatedProduct.stock_count && relatedProduct.stock_count <= 5 && relatedProduct.in_stock && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          {relatedProduct.stock_count} left
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(relatedProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {relatedProduct.rating?.toFixed(1)} ({relatedProduct.reviews_count})
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {relatedProduct.description_en}
                    </p>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.original_price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ${relatedProduct.original_price.toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                              {calculateDiscount(relatedProduct.original_price, relatedProduct.price)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(relatedProduct);
                        }}
                        disabled={!relatedProduct.in_stock}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {relatedProduct.in_stock ? 'Buy Now' : 'Unavailable'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(relatedProduct, 1);
                        }}
                        disabled={!relatedProduct.in_stock}
                        className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
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