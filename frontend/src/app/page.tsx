'use client';

import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/mockApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name_en: string;
  name_th: string;
  name_kh: string;
  price: number;
  category: string;
  image_url: string;
  description_en: string;
  description_th?: string;
  description_km?: string;
  in_stock?: boolean;
  stock_count?: number;
  original_price?: number;
  rating?: number;
  reviews_count?: number;
  is_sale?: boolean;
  sale_percentage?: number;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface CartItem {
  product_id: number;
  quantity: number;
}

interface Filters {
  search: string;
  category: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'popularity';
  inStockOnly: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showNotification, setShowNotification] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name',
    inStockOnly: false
  });

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

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

  const enhanceProductData = (products: Product[]): Product[] => {
    return products.map(product => ({
      ...product,
      in_stock: Math.random() > 0.1,
      stock_count: Math.floor(Math.random() * 50) + 1,
      original_price: Math.random() > 0.6 ? Math.round(product.price * (1.2 + Math.random() * 0.5) * 100) / 100 : undefined,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews_count: Math.floor(Math.random() * 500) + 10,
      is_sale: Math.random() > 0.6,
      sale_percentage: Math.random() > 0.6 ? Math.floor(Math.random() * 40) + 10 : undefined
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await mockApi.getProducts();
        const enhancedProducts = enhanceProductData(response.data);
        setProducts(enhancedProducts);
        setFilteredProducts(enhancedProducts);
        
        const categoryMap = new Map<string, number>();
        enhancedProducts.forEach((product: Product) => {
          const category = product.category.toLowerCase();
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const categoriesData: Category[] = [
          {
            name: 'all',
            icon: categoryConfig['all'].icon,
            count: enhancedProducts.length,
          },
          ...Array.from(categoryMap.entries()).map(([name, count]) => ({
            name,
            icon: categoryConfig[name]?.icon || '🧴',
            count,
          }))
        ];

        setCategories(categoriesData);
        
        if (isAuthenticated) {
          const savedFavorites = localStorage.getItem('favorites');
          const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
          const savedCart = localStorage.getItem('cart');
          
          if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
          if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
          if (savedCart) setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description_en.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category
      );
    }

    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.in_stock);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.reviews_count || 0) - (a.reviews_count || 0);
        default:
          return a.name_en.localeCompare(b.name_en);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getProductName = (product: Product) => {
    if (user?.language === 'th') return product.name_th;
    if (user?.language === 'km') return product.name_kh;
    return product.name_en;
  };

  const showNotificationMessage = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const addToRecentlyViewed = (product: Product) => {
    if (!isAuthenticated) return;
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const handleProductClick = (productId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product) addToRecentlyViewed(product);
    router.push(`/products/${productId}`);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    addToRecentlyViewed(product);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product?.in_stock) {
      showNotificationMessage('Product is out of stock');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.product_id === productId);
      let updated;
      
      if (existingItem) {
        updated = prev.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { product_id: productId, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });

    showNotificationMessage('Added to cart successfully');
  };

  const toggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showNotificationMessage('Removed from favorites');
      } else {
        newFavorites.add(productId);
        showNotificationMessage('Added to favorites');
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: [0, 1000],
      sortBy: 'name',
      inStockOnly: false
    });
    setShowFilters(false);
  };

  const handleBuyNow = (product: Product) => {
  if (!isAuthenticated) {
    router.push('/login');
    return;
  }

  if (!product.in_stock) {
    showNotificationMessage('Product is out of stock');
    return;
  }

  // Add to cart first (if not already added, or increment)
  setCart(prev => {
      const existingItem = prev.find(item => item.product_id === product.id);
      let updated;
      if (existingItem) {
        updated = prev.map(item =>
      item.product_id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
      } else {
        updated = [...prev, { product_id: product.id, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });

    // Then navigate to checkout
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[70vh] px-4">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-gray-600 mb-6">Please try refreshing the page or contact support if the problem persists.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-white border-l-4 border-green-500 px-6 py-4 rounded-lg shadow-lg max-w-sm">
          <p className="text-gray-800 font-medium">{showNotification}</p>
        </div>
      )}

      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Skincare Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover professional-grade skincare products carefully selected for quality, 
            effectiveness, and outstanding results.
          </p>
          
          {isAuthenticated && user?.skin_type && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-full mt-6">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">
                Recommendations for <strong>{user.skin_type}</strong> skin
              </span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search skincare products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-5 py-4 pl-12 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setFilters(prev => ({ ...prev, category: category.name }))}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          filters.category === category.name
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-base">{category.icon}</span>
                          <span className="capitalize">{category.name}</span>
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [0, parseInt(e.target.value)] 
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>$0</span>
                    <span className="font-medium text-gray-900">${filters.priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Sort By</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      sortBy: e.target.value as Filters['sortBy'] 
                    }))}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Name (A to Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        inStockOnly: e.target.checked 
                      }))}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{displayedProducts.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {recentlyViewed.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {recentlyViewed.map((product) => (
                    <div
                      key={`recent-${product.id}`}
                      onClick={() => handleProductClick(product.id)}
                      className="group cursor-pointer"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="aspect-square rounded-md overflow-hidden mb-3">
                          <img
                            src={product.image_url}
                            alt={getProductName(product)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                          {getProductName(product)}
                        </h3>
                        <p className="text-sm font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {displayedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {!product.in_stock && (
                        <div className="absolute top-4 left-4 right-4 z-10 bg-gray-900/90 text-white text-center py-2 rounded-lg font-medium text-sm">
                          Out of Stock
                        </div>
                      )}

                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={getProductName(product)}
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                            !product.in_stock ? 'grayscale opacity-60' : ''
                          }`}
                        />
                        
                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => toggleFavorite(e, product.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                              favorites.has(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <svg className="w-4 h-4" fill={favorites.has(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => handleQuickView(e, product)}
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
                            <span>{categoryConfig[product.category.toLowerCase()]?.icon || '🧴'}</span>
                            <span>{product.category}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                            {getProductName(product)}
                          </h2>
                          {product.stock_count && product.stock_count <= 5 && product.in_stock && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                              {product.stock_count} left
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {product.rating?.toFixed(1)} ({product.reviews_count})
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {product.description_en}
                        </p>
                        
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.original_price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.original_price.toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                                  {calculateDiscount(product.original_price, product.price)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product);
                        }}
                        disabled={!product.in_stock}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {product.in_stock ? 'Buy Now' : 'Unavailable'}
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={!product.in_stock}
                        className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/login');
                            }}
                            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                          >
                            Sign In to Purchase
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mb-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = index + 1;
                      } else if (currentPage <= 4) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + index;
                      } else {
                        pageNum = currentPage - 3 + index;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-300 text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-gray-300 text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Available</h3>
                <p className="text-gray-600 text-lg">Our product collection is currently being updated. Please check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Product Preview</h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={quickViewProduct.image_url}
                      alt={getProductName(quickViewProduct)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                      <span>{categoryConfig[quickViewProduct.category.toLowerCase()]?.icon || '🧴'}</span>
                      <span>{quickViewProduct.category}</span>
                    </span>
                    {!quickViewProduct.in_stock && (
                      <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                    {getProductName(quickViewProduct)}
                  </h3>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(quickViewProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg text-gray-600 font-medium">
                      {quickViewProduct.rating?.toFixed(1)} ({quickViewProduct.reviews_count} reviews)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.original_price && (
                      <>
                        <span className="text-2xl text-gray-500 line-through">
                          ${quickViewProduct.original_price.toFixed(2)}
                        </span>
                        <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                          {calculateDiscount(quickViewProduct.original_price, quickViewProduct.price)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {quickViewProduct.stock_count && quickViewProduct.in_stock && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className={`font-medium ${
                        quickViewProduct.stock_count <= 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {quickViewProduct.stock_count <= 5 
                          ? `Only ${quickViewProduct.stock_count} left in stock!`
                          : `In stock (${quickViewProduct.stock_count} available)`
                        }
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed text-lg">
                    {quickViewProduct.description_en}
                  </p>

                  {isAuthenticated ? (
                    <div className="space-y-4 pt-4">
                      <button
                        onClick={() => {
                          handleAddToCart({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id);
                        }}
                        disabled={!quickViewProduct.in_stock}
                        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {quickViewProduct.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <button
                        onClick={() => toggleFavorite({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id)}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                          favorites.has(quickViewProduct.id)
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {favorites.has(quickViewProduct.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        router.push('/login');
                        setQuickViewProduct(null);
                      }}
                      className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors"
                    >
                      Sign In to Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .slider::-webkit-slider-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: #e5e7eb;
          border-radius: 3px;
          border: none;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .slider::-moz-range-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: #e5e7eb;
          border-radius: 3px;
          border: none;
        }
      `}</style>
    </div>
  );
}