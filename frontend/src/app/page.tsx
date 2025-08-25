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
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Category configurations with luxury desert dusk theme
  const categoryConfig: Record<string, { icon: string; color: string }> = {
    'all': { icon: '✨', color: 'from-[#A2574F] to-[#993A8B]' },
    'cleanser': { icon: '🌸', color: 'from-[#E65087] to-[#BF7587]' },
    'moisturizer': { icon: '💧', color: 'from-[#BF7587] to-[#993A8B]' },
    'serum': { icon: '🔮', color: 'from-[#993A8B] to-[#E65087]' },
    'sunscreen': { icon: '☀️', color: 'from-[#A2574F] to-[#E65087]' },
    'toner': { icon: '🌿', color: 'from-[#BF7587] to-[#A2574F]' },
    'mask': { icon: '🎭', color: 'from-[#993A8B] to-[#BF7587]' },
    'exfoliator': { icon: '✨', color: 'from-[#E65087] to-[#A2574F]' },
    'essence': { icon: '💎', color: 'from-[#A2574F] to-[#BF7587]' },
    'eye cream': { icon: '👁️', color: 'from-[#BF7587] to-[#E65087]' },
    'oil': { icon: '🫒', color: 'from-[#993A8B] to-[#A2574F]' },
    'treatment': { icon: '🧴', color: 'from-[#E65087] to-[#993A8B]' },
    'medicine': { icon: '💊', color: 'from-[#A2574F] to-[#E65087]' }
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
            color: categoryConfig[name]?.color || 'from-[#A2574F] to-[#993A8B]'
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-[#F8F4F0] to-[#FAF6F2]">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#E65087]/20 border-t-[#E65087] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-l-[#993A8B] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.3s' }}></div>
            <div className="mt-8 text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#A2574F] to-[#993A8B] bg-clip-text text-transparent">
                Loading Luxury Collection...
              </div>
              <div className="text-sm text-[#A2574F]/70 mt-2">
                Curating premium skincare for you
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-[#F8F4F0] to-[#FAF6F2]">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <div className="text-8xl mb-6">🌸</div>
          <div className="text-3xl font-bold text-[#A2574F] mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] via-[#F8F4F0] to-[#FAF6F2]">
      {/* Luxury Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-[#E65087]/10 via-[#BF7587]/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-bl from-[#993A8B]/10 via-[#A2574F]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-tr from-[#BF7587]/10 via-[#E65087]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 bg-gradient-to-r from-white to-[#FAF6F2] border border-[#E65087]/20 text-[#A2574F] px-6 py-4 rounded-2xl shadow-2xl shadow-[#E65087]/20 backdrop-blur-sm animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#E65087] to-[#993A8B]"></div>
            <span className="font-medium">{showNotification}</span>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-6 py-16">
        {/* Luxury Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-full blur-xl opacity-30"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#A2574F] to-[#993A8B] rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-[#E65087]/25">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-[#A2574F] via-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
              Luxury
            </span>
            <span className="block bg-gradient-to-r from-[#993A8B] via-[#BF7587] to-[#A2574F] bg-clip-text text-transparent">
              Skincare
            </span>
          </h1>
          
          {isAuthenticated && user?.skin_type && (
            <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-white/80 to-[#FAF6F2]/80 backdrop-blur-sm border border-[#BF7587]/20 rounded-full mb-8 shadow-lg shadow-[#E65087]/10">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#E65087] to-[#993A8B]"></div>
              <p className="text-lg font-medium text-[#A2574F]">
                Personalized for your <span className="font-bold text-[#993A8B]">{user.skin_type}</span> skin type
              </p>
            </div>
          )}

          <p className="text-xl md:text-2xl text-[#A2574F]/70 max-w-3xl mx-auto leading-relaxed font-light">
            Discover our curated collection of premium skincare essentials, 
            <br className="hidden md:block" />
            crafted for those who appreciate true luxury.
          </p>
        </div>

        {/* Elegant Search Section */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E65087]/10 to-[#993A8B]/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl shadow-[#E65087]/10">
                <input
                  type="text"
                  placeholder="Search luxury skincare products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-8 py-6 pl-16 bg-transparent text-xl text-[#A2574F] placeholder-[#A2574F]/50 rounded-3xl focus:outline-none"
                />
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-[#BF7587]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#E65087]/25 transition-all duration-300"
                >
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="max-w-6xl mx-auto mb-12 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl shadow-[#E65087]/10 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Price Range */}
                <div>
                  <label className="block text-lg font-semibold text-[#A2574F] mb-4">Price Range</label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [0, parseInt(e.target.value)] 
                      }))}
                      className="w-full h-2 bg-gradient-to-r from-[#E65087]/20 to-[#993A8B]/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-lg font-medium text-[#A2574F]">
                      $0 - ${filters.priceRange[1]}
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-lg font-semibold text-[#A2574F] mb-4">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      sortBy: e.target.value as Filters['sortBy'] 
                    }))}
                    className="w-full px-4 py-3 bg-white/90 border border-[#BF7587]/20 rounded-2xl text-[#A2574F] focus:outline-none focus:ring-2 focus:ring-[#E65087]/20 focus:border-[#E65087]"
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
                  <label className="block text-lg font-semibold text-[#A2574F] mb-4">Availability</label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        inStockOnly: e.target.checked 
                      }))}
                      className="w-5 h-5 text-[#E65087] bg-white/90 border-[#BF7587]/30 rounded focus:ring-[#E65087]/20 focus:ring-2"
                    />
                    <span className="text-lg text-[#A2574F]">In Stock Only</span>
                  </label>
                </div>

                {/* Results Count */}
                <div>
                  <label className="block text-lg font-semibold text-[#A2574F] mb-4">Results</label>
                  <div className="text-lg text-[#A2574F]/70">
                    <span className="font-bold text-[#993A8B]">{displayedProducts.length}</span> of{' '}
                    <span className="font-bold text-[#993A8B]">{filteredProducts.length}</span> products
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Luxury Category Showcase */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#A2574F] to-[#993A8B] bg-clip-text text-transparent mb-12">
              Explore Collections
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setFilters(prev => ({ ...prev, category: category.name }))}
                  className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                    filters.category === category.name ? 'scale-105' : ''
                  }`}
                >
                  <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl border-2 p-6 h-32 transition-all duration-300 ${
                    filters.category === category.name
                      ? 'border-[#E65087] bg-gradient-to-br from-white via-[#FAF6F2] to-white shadow-2xl shadow-[#E65087]/20'
                      : 'border-white/50 hover:border-[#BF7587]/30 hover:shadow-xl hover:shadow-[#E65087]/10'
                  }`}>
                    {filters.category === category.name && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    <div className="text-center h-full flex flex-col justify-center">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div className={`text-sm font-bold capitalize mb-1 ${
                        filters.category === category.name
                          ? 'bg-gradient-to-r from-[#A2574F] to-[#993A8B] bg-clip-text text-transparent'
                          : 'text-[#A2574F] group-hover:text-[#993A8B]'
                      }`}>
                        {category.name}
                      </div>
                      <div className="text-xs text-[#BF7587] font-medium">
                        {category.count} items
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Viewed - Luxury Style */}
        {recentlyViewed.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#A2574F] flex items-center">
                <span className="mr-4 text-4xl">👁️</span>
                Recently Viewed
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#E65087] to-[#993A8B]"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {recentlyViewed.map((product) => (
                <div
                  key={`recent-${product.id}`}
                  onClick={() => handleProductClick(product.id)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-4 border border-white/50 hover:border-[#BF7587]/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#E65087]/10">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                      <img
                        src={product.image_url}
                        alt={getProductName(product)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-sm font-semibold text-[#A2574F] line-clamp-2 mb-2">
                      {getProductName(product)}
                    </div>
                    <div className="text-lg font-bold bg-gradient-to-r from-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Luxury Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {displayedProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/50 hover:border-[#BF7587]/30 shadow-xl hover:shadow-2xl hover:shadow-[#E65087]/15 transition-all duration-700 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleProductClick(product.id)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Luxury Sale Badge */}
              {product.is_sale && product.sale_percentage && (
                <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl shadow-[#E65087]/30">
                  -{product.sale_percentage}% OFF
                </div>
              )}

              {/* Stock Status */}
              {!product.in_stock && (
                <div className="absolute top-6 right-6 left-6 z-20 bg-[#A2574F]/90 backdrop-blur-sm text-white text-center py-3 rounded-2xl font-bold text-sm">
                  Out of Stock
                </div>
              )}

              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image_url}
                  alt={getProductName(product)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                    !product.in_stock ? 'grayscale opacity-60' : ''
                  }`}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute bottom-6 left-6">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-gradient-to-r ${
                    categoryConfig[product.category.toLowerCase()]?.color || 'from-[#A2574F] to-[#993A8B]'
                  } text-white rounded-full backdrop-blur-sm capitalize shadow-2xl shadow-black/20`}>
                    <span>{categoryConfig[product.category.toLowerCase()]?.icon || '🧴'}</span>
                    <span>{product.category}</span>
                  </span>
                </div>

                {/* Luxury Quick Actions */}
                <div className={`absolute top-6 right-6 flex flex-col space-y-3 transition-all duration-500 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className={`w-12 h-12 rounded-2xl backdrop-blur-lg border border-white/30 flex items-center justify-center transition-all duration-300 shadow-lg ${
                      favorites.has(product.id)
                        ? 'bg-[#E65087] text-white shadow-[#E65087]/30'
                        : 'bg-white/90 text-[#A2574F] hover:bg-[#E65087] hover:text-white hover:shadow-[#E65087]/30'
                    }`}
                  >
                    <svg className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => handleQuickView(e, product)}
                    className="w-12 h-12 rounded-2xl backdrop-blur-lg border border-white/30 bg-white/90 text-[#A2574F] hover:bg-[#993A8B] hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#993A8B]/30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Luxury Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-[#A2574F] group-hover:text-[#993A8B] transition-colors duration-300 line-clamp-2 flex-1 pr-2">
                    {getProductName(product)}
                  </h2>
                  {product.stock_count && product.stock_count <= 5 && product.in_stock && (
                    <span className="text-xs bg-gradient-to-r from-[#E65087]/10 to-[#993A8B]/10 text-[#E65087] px-3 py-1 rounded-full font-medium whitespace-nowrap border border-[#E65087]/20">
                      {product.stock_count} left
                    </span>
                  )}
                </div>
                
                {/* Luxury Rating */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating || 0) ? 'text-[#E65087]' : 'text-[#BF7587]/30'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-[#A2574F]/70 font-medium">
                    {product.rating?.toFixed(1)} ({product.reviews_count} reviews)
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-[#A2574F]/70 mb-6 line-clamp-2 leading-relaxed text-sm">
                  {product.description_en}
                </p>
                
                {/* Luxury Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-[#A2574F]/50 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Luxury Action Buttons */}
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product.id);
                        }}
                        disabled={!product.in_stock}
                        className="flex-1 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {product.in_stock ? 'Buy Now' : 'Unavailable'}
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={!product.in_stock}
                        className="px-4 py-4 bg-white/90 backdrop-blur-sm border border-[#BF7587]/20 text-[#A2574F] rounded-2xl font-semibold hover:bg-[#FAF6F2] hover:border-[#E65087]/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full bg-gradient-to-r from-[#A2574F] to-[#993A8B] text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#A2574F]/25 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Sign in to Purchase
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Luxury Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mb-16">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl text-[#A2574F] hover:bg-[#FAF6F2] hover:border-[#BF7587]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              ← Previous
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
                  className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white shadow-xl shadow-[#E65087]/25'
                      : 'bg-white/80 backdrop-blur-lg border border-white/50 text-[#A2574F] hover:bg-[#FAF6F2] hover:border-[#BF7587]/30'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl text-[#A2574F] hover:bg-[#FAF6F2] hover:border-[#BF7587]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next →
            </button>
          </div>
        )}

        {/* No Products Found - Luxury Style */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E65087]/20 to-[#993A8B]/20 rounded-full blur-3xl"></div>
              <div className="relative text-8xl opacity-60">🔍</div>
            </div>
            <h3 className="text-4xl font-bold text-[#A2574F] mb-6">
              No products found
            </h3>
            <p className="text-[#A2574F]/70 text-xl mb-10 max-w-md mx-auto">
              We couldn't find any products matching your refined criteria
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: 'all',
                priceRange: [0, 1000],
                sortBy: 'name',
                inStockOnly: false
              })}
              className="px-10 py-4 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* All Products Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E65087]/20 to-[#993A8B]/20 rounded-full blur-3xl"></div>
              <div className="relative text-8xl animate-bounce opacity-60">✨</div>
            </div>
            <h3 className="text-4xl font-bold text-[#A2574F] mb-6">Collection Coming Soon</h3>
            <p className="text-[#A2574F]/70 text-xl">Our luxury skincare collection is being curated for you!</p>
          </div>
        )}
      </main>

      {/* Luxury Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-gradient-to-br from-white via-[#FAF6F2] to-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#A2574F] to-[#993A8B] bg-clip-text text-transparent mb-2">Luxury Preview</h2>
                  <div className="w-20 h-px bg-gradient-to-r from-[#E65087] to-[#993A8B]"></div>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="w-12 h-12 bg-gradient-to-r from-[#A2574F]/10 to-[#993A8B]/10 hover:from-[#A2574F]/20 hover:to-[#993A8B]/20 rounded-2xl flex items-center justify-center transition-all duration-300 text-[#A2574F]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-[#E65087]/10">
                    <img
                      src={quickViewProduct.image_url}
                      alt={getProductName(quickViewProduct)}
                      className="w-full h-full object-cover"
                    />
                    {quickViewProduct.is_sale && quickViewProduct.sale_percentage && (
                      <div className="absolute top-6 left-6 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl shadow-[#E65087]/30">
                        -{quickViewProduct.sale_percentage}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-gradient-to-r ${
                      categoryConfig[quickViewProduct.category.toLowerCase()]?.color || 'from-[#A2574F] to-[#993A8B]'
                    } text-white rounded-full capitalize shadow-lg`}>
                      <span>{categoryConfig[quickViewProduct.category.toLowerCase()]?.icon || '🧴'}</span>
                      <span>{quickViewProduct.category}</span>
                    </span>
                    {!quickViewProduct.in_stock && (
                      <span className="bg-gradient-to-r from-[#A2574F]/10 to-[#993A8B]/10 text-[#A2574F] px-4 py-2 rounded-full text-sm font-medium border border-[#A2574F]/20">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-[#A2574F]">
                    {getProductName(quickViewProduct)}
                  </h3>

                  {/* Luxury Rating */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < Math.floor(quickViewProduct.rating || 0) ? 'text-[#E65087]' : 'text-[#BF7587]/30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-lg text-[#A2574F]/70 font-medium">
                      {quickViewProduct.rating?.toFixed(1)} ({quickViewProduct.reviews_count} reviews)
                    </span>
                  </div>

                  {/* Luxury Price */}
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.original_price && (
                      <span className="text-2xl text-[#A2574F]/50 line-through">
                        ${quickViewProduct.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {quickViewProduct.stock_count && quickViewProduct.in_stock && (
                    <div className="p-4 bg-gradient-to-r from-[#E65087]/5 to-[#993A8B]/5 rounded-2xl border border-[#E65087]/20">
                      <span className={`text-lg font-semibold ${
                        quickViewProduct.stock_count <= 5 ? 'text-[#E65087]' : 'text-[#993A8B]'
                      }`}>
                        {quickViewProduct.stock_count <= 5 
                          ? `Only ${quickViewProduct.stock_count} left in our exclusive collection!`
                          : `Available in our luxury collection (${quickViewProduct.stock_count} pieces)`
                        }
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[#A2574F]/80 text-lg leading-relaxed">
                    {quickViewProduct.description_en}
                  </p>

                  {/* Luxury Actions */}
                  {isAuthenticated ? (
                    <div className="space-y-4 pt-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            handleBuyNow(quickViewProduct.id);
                            setQuickViewProduct(null);
                          }}
                          disabled={!quickViewProduct.in_stock}
                          className="flex-1 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {quickViewProduct.in_stock ? 'Buy Now' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => {
                            handleAddToCart({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id);
                          }}
                          disabled={!quickViewProduct.in_stock}
                          className="flex-1 bg-white/90 border-2 border-[#BF7587]/30 text-[#A2574F] py-5 px-8 rounded-2xl font-semibold text-lg hover:bg-[#FAF6F2] hover:border-[#E65087]/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                      
                      <button
                        onClick={() => toggleFavorite({ stopPropagation: () => {} } as React.MouseEvent, quickViewProduct.id)}
                        className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] ${
                          favorites.has(quickViewProduct.id)
                            ? 'bg-gradient-to-r from-[#E65087]/10 to-[#993A8B]/10 text-[#E65087] border-2 border-[#E65087]/30'
                            : 'bg-gradient-to-r from-[#A2574F]/5 to-[#993A8B]/5 text-[#A2574F] border-2 border-[#A2574F]/20 hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 hover:text-[#E65087] hover:border-[#E65087]/30'
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
                      className="w-full bg-gradient-to-r from-[#A2574F] to-[#993A8B] text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#A2574F]/25 transition-all duration-300 hover:scale-[1.02]"
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
                  <div className="mt-16 pt-12 border-t border-[#BF7587]/20">
                    <h4 className="text-2xl font-bold text-[#A2574F] mb-8 flex items-center">
                      <span className="mr-3">✨</span>
                      You might also adore
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => {
                            setQuickViewProduct(rec);
                            addToRecentlyViewed(rec);
                          }}
                          className="group bg-gradient-to-br from-white/80 to-[#FAF6F2]/80 rounded-3xl p-4 cursor-pointer hover:shadow-xl hover:shadow-[#E65087]/10 transition-all duration-300 border border-white/50 hover:border-[#BF7587]/30"
                        >
                          <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                            <img
                              src={rec.image_url}
                              alt={getProductName(rec)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="text-sm font-semibold text-[#A2574F] line-clamp-2 mb-2">
                            {getProductName(rec)}
                          </div>
                          <div className="text-lg font-bold bg-gradient-to-r from-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
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

        /* Custom slider styling for luxury theme */
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E65087, #993A8B);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(230, 80, 135, 0.3);
        }

        .slider::-webkit-slider-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          background: linear-gradient(90deg, rgba(230, 80, 135, 0.2), rgba(153, 58, 139, 0.2));
          border-radius: 4px;
          border: none;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E65087, #993A8B);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(230, 80, 135, 0.3);
        }

        .slider::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          background: linear-gradient(90deg, rgba(230, 80, 135, 0.2), rgba(153, 58, 139, 0.2));
          border-radius: 4px;
          border: none;
        }

        /* Luxury animations */
        @keyframes luxuryPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes luxuryFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        .luxury-pulse {
          animation: luxuryPulse 4s ease-in-out infinite;
        }

        .luxury-float {
          animation: luxuryFloat 6s ease-in-out infinite;
        }

        /* Gradient text selection */
        ::selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }

        ::-moz-selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }

        /* Custom scrollbar for luxury feel */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(191, 117, 135, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #E65087, #993A8B);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #993A8B, #A2574F);
        }
      `}</style>
    </div>
  );
}