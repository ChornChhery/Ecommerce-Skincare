'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useToastActions } from '@/contexts/ToastContext';

interface Product {
  id: number;
  name_en: string;
  price: number;
  category: string;
  image_url: string;
  description_en: string;
  in_stock?: boolean;
  original_price?: number;
  rating?: number;
  is_sale?: boolean;
  sale_percentage?: number;
}

interface RecentlyViewedProductsProps {
  currentProductId?: number;
  maxItems?: number;
  className?: string;
  showTitle?: boolean;
}

export default function RecentlyViewedProducts({ 
  currentProductId, 
  maxItems = 6,
  className = '',
  showTitle = true 
}: RecentlyViewedProductsProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toastActions = useToastActions();

  useEffect(() => {
    loadRecentlyViewed();
    loadFavorites();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        const products = JSON.parse(stored) as Product[];
        // Filter out current product if specified
        const filtered = currentProductId 
          ? products.filter(p => p.id !== currentProductId)
          : products;
        setRecentlyViewed(filtered.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    const newFavorites = new Set(favorites);
    if (favorites.has(product.id)) {
      newFavorites.delete(product.id);
      toastActions.removedFromWishlist(product.name_en);
    } else {
      newFavorites.add(product.id);
      toastActions.addedToWishlist(product.name_en);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (!product.in_stock) {
      toastActions.outOfStock(product.name_en);
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          product_id: product.id,
          quantity: 1,
          product_name: product.name_en,
          price: product.price,
          image_url: product.image_url
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      toastActions.addedToCart(product.name_en);
    } catch (error) {
      toastActions.genericError('Failed to add item to cart');
    }
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentlyViewed([]);
    toastActions.showInfo('Cleared', 'Recently viewed products have been cleared');
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recentlyViewed.length === 0) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
          </div>
        )}
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recently Viewed Products</h3>
          <p className="text-gray-600">Products you view will appear here for easy access</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
          {recentlyViewed.length > 0 && (
            <button
              onClick={clearRecentlyViewed}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {recentlyViewed.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleProductClick(product)}
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name_en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Sale Badge */}
              {product.is_sale && product.sale_percentage && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.sale_percentage}%
                </div>
              )}

              {/* Out of Stock Overlay */}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Out of Stock</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => handleToggleFavorite(e, product)}
                  className="bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                >
                  {favorites.has(product.id) ? (
                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                
                {product.in_stock && (
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {product.name_en}
              </h3>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs text-gray-600 ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-1">
                <span className="text-xs text-gray-500 capitalize">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {recentlyViewed.length >= maxItems && (
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}

// Utility function to add product to recently viewed
export function addToRecentlyViewed(product: Product) {
  try {
    const stored = localStorage.getItem('recentlyViewed');
    const recentlyViewed = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    const filtered = recentlyViewed.filter((p: Product) => p.id !== product.id);
    
    // Add to beginning
    const updated = [product, ...filtered].slice(0, 12); // Keep max 12 items
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
}