'use client';

import { useEffect, useState, useCallback } from 'react';
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
  color: string;
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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showNotification, setShowNotification] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name',
    inStockOnly: false
  });

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Category configurations
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

  // Enhanced mock data with all features
  const enhanceProductData = (products: Product[]): Product[] => {
    return products.map(product => ({
      ...product,
      in_stock: Math.random() > 0.1, // 90% chance in stock
      stock_count: Math.floor(Math.random() * 50) + 1,
      original_price: Math.random() > 0.7 ? product.price * 1.2 : undefined,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 rating
      reviews_count: Math.floor(Math.random() * 500) + 10,
      is_sale: Math.random() > 0.7,
      sale_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : undefined
    }));
  };

  // Load data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await mockApi.getProducts();
        const enhancedProducts = enhanceProductData(response.data);
        setProducts(enhancedProducts);
        setFilteredProducts(enhancedProducts);
        
        // Generate categories
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
            color: categoryConfig['all'].color
          },
          ...Array.from(categoryMap.entries()).map(([name, count]) => ({
            name,
            icon: categoryConfig[name]?.icon || '🧴',
            count,
            color: categoryConfig[name]?.color || 'from-gray-500 to-gray-600'
          }))
        ];

        setCategories(categoriesData);
        
        // Load user data
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

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description_en.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.in_stock);
    }

    // Sorting
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

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Helper functions
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
      const updated = [product, ...filtered].slice(0, 6);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  // Event handlers
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
      showNotificationMessage('❌ Product is out of stock');
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

    showNotificationMessage('✅ Added to cart successfully!');
  };

  const handleBuyNow = (productId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product?.in_stock) {
      showNotificationMessage('❌ Product is out of stock');
      return;
    }

    // Add to cart and redirect to checkout
    handleAddToCart({ stopPropagation: () => {} } as React.MouseEvent, productId);
    setTimeout(() => router.push('/cart'), 500);
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
        showNotificationMessage('💔 Removed from favorites');
      } else {
        newFavorites.add(productId);
        showNotificationMessage('❤️ Added to favorites');
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const getRecommendations = (currentProduct: Product): Product[] => {
    return products
      .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
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
                Loading Premium Products...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-red-500 mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-white/90 backdrop-blur-sm border border-green-200 text-green-800 px-6 py-3 rounded-xl shadow-lg animate-pulse">
          {showNotification}
        </div>
      )}

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <span className="text-2xl">🧴</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skincare Products Store
            </h1>
          </div>
          
          {isAuthenticated && user?.skin_type && (
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full mb-8">
              <span className="text-xl">✨</span>
              <p className="text-lg font-medium text-slate-700">
                Curated for your <span className="font-bold text-blue-600">{user.skin_type}</span> skin
              </p>
            </div>
          )}

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover premium skincare solutions crafted for your unique beauty journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, categories, or ingredients..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-6 py-4 pl-12 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [0, parseInt(e.target.value)] 
                    }))}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600">
                    $0 - ${filters.priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as Filters['sortBy'] 
                  }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      inStockOnly: e.target.checked 
                    }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">In Stock Only</span>
                </label>
              </div>

              {/* Results Count */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Results</label>
                <div className="text-sm text-slate-600">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-6">
              Shop by Category
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => setFilters(prev => ({ ...prev, category: category.name }))}
                  className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl border-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    filters.category === category.name
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-200/50'
                      : 'border-white/60 hover:border-blue-200'
                  }`}
                >
                  {filters.category === category.name && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className={`text-sm font-bold capitalize mb-1 ${
                      filters.category === category.name
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                        : 'text-slate-700 group-hover:text-blue-600'
                    }`}>
                      {category.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {category.count} items
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="mr-3">👀</span>
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((product) => (
                <div
                  key={`recent-${product.id}`}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:scale-105 transition-all duration-300 border border-white/60 hover:border-blue-200"
                >
                  <img
                    src={product.image_url}
                    alt={getProductName(product)}
                    className="w-full aspect-square object-cover rounded-xl mb-2"
                  />
                  <div className="text-sm font-medium text-slate-800 line-clamp-2">
                    {getProductName(product)}
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {displayedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/60 hover:border-blue-200/80 shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleProductClick(product.id)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Sale Badge */}
              {product.is_sale && product.sale_percentage && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  -{product.sale_percentage}% OFF
                </div>
              )}

              {/* Stock Status */}
              {!product.in_stock && (
                <div className="absolute top-4 right-4 left-4 z-10 bg-red-500/90 text-white text-center py-2 rounded-xl font-bold text-sm">
                  Out of Stock
                </div>
              )}

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image_url}
                  alt={getProductName(product)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                    !product.in_stock ? 'grayscale opacity-60' : ''
                  }`}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category badge */}
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold bg-gradient-to-r ${
                    categoryConfig[product.category.toLowerCase()]?.color || 'from-gray-500 to-gray-600'
                  } text-white rounded-full backdrop-blur-sm capitalize shadow-lg`}>
                    <span>{categoryConfig[product.category.toLowerCase()]?.icon || '🧴'}</span>
                    <span>{product.category}</span>
                  </span>
                </div>

                {/* Quick actions */}
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${
                      favorites.has(product.id)
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => handleQuickView(e, product)}
                    className="w-10 h-10 rounded-full backdrop-blur-md border border-white/30 bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 flex-1 pr-2">
                    {getProductName(product)}
                  </h2>
                  {product.stock_count && product.stock_count <= 5 && product.in_stock && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      Only {product.stock_count} left
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
                          i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {product.rating?.toFixed(1)} ({product.reviews_count} reviews)
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed text-sm">
                  {product.description_en}
                </p>
                
                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-slate-400 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product.id);
                        }}
                        disabled={!product.in_stock}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {product.in_stock ? 'Buy Now' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={!product.in_stock}
                        className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/login');
                    }}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    Sign in to Purchase
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/70 backdrop-blur-sm border border-white/60 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* No Products Found */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-slate-600 mb-4">
              No products found
            </h3>
            <p className="text-slate-500 text-lg mb-8">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: 'all',
                priceRange: [0, 1000],
                sortBy: 'name',
                inStockOnly: false
              })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* All Products Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🧴</div>
            <h3 className="text-3xl font-bold text-slate-600 mb-4">No products available</h3>
            <p className="text-slate-500 text-lg">Check back soon for amazing skincare products!</p>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Quick View</h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={quickViewProduct.image_url}
                    alt={getProductName(quickViewProduct)}
                    className="w-full h-full object-cover"
                  />
                  {quickViewProduct.is_sale && quickViewProduct.sale_percentage && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{quickViewProduct.sale_percentage}% OFF
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-bold bg-gradient-to-r ${
                      categoryConfig[quickViewProduct.category.toLowerCase()]?.color || 'from-gray-500 to-gray-600'
                    } text-white rounded-full capitalize`}>
                      <span>{categoryConfig[quickViewProduct.category.toLowerCase()]?.icon || '🧴'}</span>
                      <span>{quickViewProduct.category}</span>
                    </span>
                    {!quickViewProduct.in_stock && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {getProductName(quickViewProduct)}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < Math.floor(quickViewProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">
                      {quickViewProduct.rating?.toFixed(1)} ({quickViewProduct.reviews_count} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.original_price && (
                      <span className="text-xl text-slate-400 line-through">
                        ${quickViewProduct.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {quickViewProduct.stock_count && quickViewProduct.in_stock && (
                    <div className="mb-6">
                      <span className={`text-sm font-medium ${
                        quickViewProduct.stock_count <= 5 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {quickViewProduct.stock_count <= 5 
                          ? `Only ${quickViewProduct.stock_count} left in stock!`
                          : `In stock (${quickViewProduct.stock_count} available)`
                        }
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {quickViewProduct.description_en}
                  </p>

                  {/* Actions */}
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            handleBuyNow(quickViewProduct.id);
                            setQuickViewProduct(null);
                          }}
                          disabled={!quickViewProduct.in_stock}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {quickViewProduct.in_stock ? 'Buy Now' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => {
                            handleAddToCart({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id);
                          }}
                          disabled={!quickViewProduct.in_stock}
                          className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                      
                      <button
                        onClick={() => toggleFavorite({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id)}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] ${
                          favorites.has(quickViewProduct.id)
                            ? 'bg-red-50 text-red-600 border-2 border-red-200'
                            : 'bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                        }`}
                      >
                        {favorites.has(quickViewProduct.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        router.push('/login');
                        setQuickViewProduct(null);
                      }}
                      className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      Sign in to Purchase
                    </button>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {(() => {
                const recommendations = getRecommendations(quickViewProduct);
                return recommendations.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">You might also like</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => {
                            setQuickViewProduct(rec);
                            addToRecentlyViewed(rec);
                          }}
                          className="bg-slate-50 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                        >
                          <img
                            src={rec.image_url}
                            alt={getProductName(rec)}
                            className="w-full aspect-square object-cover rounded-xl mb-3"
                          />
                          <div className="text-sm font-medium text-slate-800 line-clamp-2 mb-2">
                            {getProductName(rec)}
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            ${rec.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
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