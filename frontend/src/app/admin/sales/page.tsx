'use client';

import { useState, useEffect } from 'react';
import { mockAdminApi, mockProducts, mockOrders } from '@/lib/mockApi';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Star,
  Calendar,
  Filter,
  Download,
  Eye,
  BarChart3,
  Target,
  Award,
  Zap,
  RefreshCw,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ProductSalesData {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
  orders: number;
  conversionRate: number;
  stockLevel: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  rating: number;
  reviews: number;
}

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  topCategory: string;
  conversionRate: number;
}

export default function SalesAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [salesData, setSalesData] = useState<ProductSalesData[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnitsSold: 0,
    averageOrderValue: 0,
    topCategory: '',
    conversionRate: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchSalesData();
  }, [timeFilter, categoryFilter]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Get dashboard stats from your mock API
      const dashboardStats = await mockAdminApi.getDashboardStats();
      
      // Generate realistic sales data based on your mock products and orders
      const mockSalesData: ProductSalesData[] = mockProducts.map(product => {
        // Calculate sales metrics based on product data
        const baseUnitsSold = Math.floor(Math.random() * 200) + 50;
        const revenue = baseUnitsSold * product.price;
        const orders = Math.floor(baseUnitsSold * 0.8); // Assuming some multi-quantity orders
        const conversionRate = Math.random() * 10 + 2; // 2-12%
        const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down';
        const trendPercentage = trend === 'up' ? Math.random() * 20 + 5 : 
                               trend === 'down' ? -(Math.random() * 15 + 2) : 
                               Math.random() * 4 - 2;

        return {
          id: product.id,
          name: product.name_en,
          image: product.image_url,
          category: product.category,
          price: product.price,
          unitsSold: baseUnitsSold,
          revenue: revenue,
          orders: orders,
          conversionRate: conversionRate,
          stockLevel: product.stock,
          trend: trend,
          trendPercentage: Math.round(trendPercentage * 10) / 10,
          rating: Math.random() * 1 + 4, // 4.0-5.0
          reviews: Math.floor(Math.random() * 200) + 20
        };
      });

      // Sort by revenue for realistic top performers
      mockSalesData.sort((a, b) => b.revenue - a.revenue);

      // Filter data based on category
      const filteredData = categoryFilter === 'all' 
        ? mockSalesData 
        : mockSalesData.filter(item => item.category === categoryFilter);

      setSalesData(filteredData);

      // Calculate metrics using your dashboard stats + calculated data
      const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
      const totalUnitsSold = filteredData.reduce((sum, item) => sum + item.unitsSold, 0);
      
      // Get category counts from your products
      const categoryCount = mockProducts.reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      
      const topCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'cleanser';

      setMetrics({
        totalRevenue,
        totalOrders,
        totalUnitsSold,
        averageOrderValue: totalRevenue / totalOrders || 0,
        topCategory,
        conversionRate: filteredData.reduce((sum, item) => sum + item.conversionRate, 0) / filteredData.length || 0
      });

      // Prepare chart data
      const topProducts = filteredData.slice(0, 8);
      setChartData(topProducts.map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        revenue: Math.round(item.revenue),
        units: item.unitsSold,
        orders: item.orders
      })));

      // Category breakdown based on your actual product categories
      const categoryBreakdown = filteredData.reduce((acc: any, item) => {
        const existing = acc.find((c: any) => c.name === item.category);
        if (existing) {
          existing.value += item.revenue;
          existing.units += item.unitsSold;
        } else {
          acc.push({
            name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            value: Math.round(item.revenue),
            units: item.unitsSold
          });
        }
        return acc;
      }, []);

      setCategoryData(categoryBreakdown);

    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = salesData.map(item => ({
      'Product Name': item.name,
      'Category': item.category,
      'Price': item.price,
      'Units Sold': item.unitsSold,
      'Revenue': item.revenue,
      'Orders': item.orders,
      'Stock Level': item.stockLevel,
      'Trend': item.trend,
      'Rating': item.rating.toFixed(1)
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 bg-slate-300 rounded-full" />;
  };

  // Get unique categories from your products
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-slate-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Stats Cards Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="w-16 h-6 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-80 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-80 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
          <p className="text-slate-600 mt-1">Track your best-selling products and sales performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => fetchSalesData()}
            className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.totalRevenue)}</p>
            <p className="text-sm text-slate-600">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalOrders.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Total Orders</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.2%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalUnitsSold.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Units Sold</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.7%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.averageOrderValue)}</p>
            <p className="text-sm text-slate-600">Avg Order Value</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Top Products by Revenue</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(Number(value)) : value,
                  name === 'revenue' ? 'Revenue' : 'Units Sold'
                ]}
                labelStyle={{ color: '#64748b' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Sales by Category</h3>
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`category-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((entry, index) => (
              <div key={`legend-${index}-${entry.name}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Top Selling Products</h3>
            <p className="text-sm text-slate-600">Best performing products {timeFilter === 'month' ? 'this month' : timeFilter === 'week' ? 'this week' : 'this period'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesData.slice(0, 6).map((product, index) => (
              <div key={product.id} className="group relative border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm text-slate-600 capitalize">{product.category}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Revenue</span>
                    <span className="font-semibold text-green-600">{formatCurrency(product.revenue)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Units Sold</span>
                    <span className="font-semibold text-slate-900">{product.unitsSold.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Orders</span>
                    <span className="font-semibold text-blue-600">{product.orders.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Trend</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(product.trend, product.trendPercentage)}
                      <span className={`text-sm font-medium ${
                        product.trend === 'up' ? 'text-green-600' : 
                        product.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {product.trend === 'stable' ? 'Stable' : `${Math.abs(product.trendPercentage)}%`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-500 ml-1">({product.reviews})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stockLevel < 20 ? 'bg-red-100 text-red-800' :
                      product.stockLevel < 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.stockLevel} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Rank</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Product</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Category</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Revenue</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Units Sold</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Orders</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Trend</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Rating</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900">Stock</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((product, index) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <span className="font-bold text-lg text-slate-700">#{index + 1}</span>
                        {index < 3 && <Award className="w-4 h-4 text-yellow-500 ml-2" />}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-600">{formatCurrency(product.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-semibold text-green-600">{formatCurrency(product.revenue)}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-semibold text-slate-900">{product.unitsSold.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-semibold text-blue-600">{product.orders.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(product.trend, product.trendPercentage)}
                        <span className={`text-sm font-medium ${
                          product.trend === 'up' ? 'text-green-600' : 
                          product.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {product.trend === 'stable' ? 'Stable' : `${Math.abs(product.trendPercentage)}%`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        <span className="text-sm text-slate-500 ml-1">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stockLevel < 20 ? 'bg-red-100 text-red-800' :
                        product.stockLevel < 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stockLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Top Performers</h3>
              <p className="text-sm text-slate-600">Products with highest growth</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {salesData
              .filter(p => p.trend === 'up')
              .sort((a, b) => b.trendPercentage - a.trendPercentage)
              .slice(0, 4)
              .map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{product.name}</div>
                      <div className="text-xs text-slate-600">{product.unitsSold} units sold</div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{product.trendPercentage}%
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Low Stock Alert</h3>
              <p className="text-sm text-slate-600">Top sellers running low</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {salesData
              .filter(p => p.stockLevel < 50)
              .sort((a, b) => a.stockLevel - b.stockLevel)
              .slice(0, 4)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{product.name}</div>
                      <div className="text-xs text-slate-600">{product.unitsSold} units sold</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stockLevel < 20 ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {product.stockLevel} left
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ready to boost your sales?</h3>
            <p className="text-blue-100">Analyze your data and take action to improve performance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              View Detailed Report
            </button>
            <button className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
              Create Marketing Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}