'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { mockApi, mockProducts } from '@/lib/mockApi';

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  original_price?: number;
  category: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  added_date: string;
  description: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'name'>('newest');
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock wishlist data using your actual products - replace with your actual API call
    const fetchWishlist = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock wishlist using your actual product data
        // This simulates user having saved specific products to wishlist
        const savedProductIds = [3, 7, 6, 16, 5, 12, 14, 19]; // Sample saved product IDs
        
        const mockWishlist: WishlistItem[] = savedProductIds.map((productId, index) => {
          const product = mockProducts.find(p => p.id === productId);
          if (!product) return null;
          
          return {
            id: index + 1,
            product_id: product.id,
            product_name: product.name_en,
            product_image: product.image_url,
            price: product.price,
            original_price: Math.random() > 0.6 ? product.price * 1.3 : undefined, // 40% chance of having original price
            category: product.category,
            rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10, // Random rating between 3.5-5.5
            review_count: Math.floor(Math.random() * 300) + 20, // Random review count 20-320
            in_stock: Math.random() > 0.15, // 85% chance of being in stock
            added_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 30 days
            description: product.description_en
          };
        }).filter(Boolean) as WishlistItem[];
        
        setWishlistItems(mockWishlist);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, router]);

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.added_date).getTime() - new Date(a.added_date).getTime();
      case 'oldest':
        return new Date(a.added_date).getTime() - new Date(b.added_date).getTime();
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
        return a.product_name.localeCompare(b.product_name);
      default:
        return 0;
    }
  });

  const handleRemoveFromWishlist = async (itemId: number) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Replace with actual API call
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.in_stock) return;
    
    try {
      // Simulate API call to add to cart
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Replace with actual add to cart logic
      console.log('Added to cart:', item.product_name);
      
      // Show success message or update UI
      alert(`${item.product_name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.in_stock);
    
    if (inStockItems.length === 0) {
      alert('No items in stock to add to cart.');
      return;
    }

    try {
      // Simulate API call to add all in-stock items to cart
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace with actual bulk add to cart logic
      console.log('Added all in-stock items to cart');
      alert(`${inStockItems.length} items added to cart!`);
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      alert('Failed to add items to cart. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-gray-700">
                Loading Your Wishlist...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Wishlist
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your favorite skincare products saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Start adding products you love to keep track of them!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {wishlistItems.length} item{wishlistItems.length > 1 ? 's' : ''} saved
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">
                  {wishlistItems.filter(item => item.in_stock).length} in stock
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                
                <button
                  onClick={handleMoveAllToCart}
                  disabled={wishlistItems.filter(item => item.in_stock).length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add All to Cart
                </button>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ${
                    removingItems.has(item.id) ? 'opacity-50 scale-95' : 'hover:shadow-lg'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Stock Status */}
                    {!item.in_stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removingItems.has(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100"
                    >
                      {removingItems.has(item.id) ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Discount Badge */}
                    {item.original_price && item.original_price > item.price && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round((1 - item.price / item.original_price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {item.product_name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {renderStars(item.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.rating} ({item.review_count} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl font-bold text-blue-600">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-lg text-gray-400 line-through">
                          ${item.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-400 mb-4">
                      Added {new Date(item.added_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.in_stock}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          item.in_stock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <button
                        onClick={() => handleViewProduct(item.product_id)}
                        className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}