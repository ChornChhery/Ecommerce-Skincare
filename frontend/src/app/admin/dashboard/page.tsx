'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockAdminApi } from '@/lib/mockApi';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Star,
  Calendar,
  Filter,
  Eye,
  BarChart3,
  Target,
  Award,
  Zap,
  RefreshCw,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  avgOrderValue: number;
  conversionRate: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
}

interface RecentOrder {
  id: number;
  customer_name: string;
  total: number;
  created_at: string;
  status: string;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: string; // This is actually a string like "245.99" from the API
}

export default function AdminDashboard() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get dashboard stats from your mock API
      const dashboardStatsResponse = await mockAdminApi.getDashboardStats();
      
      // Transform the response to match our interface
      const transformedStats: DashboardStats = {
        totalRevenue: dashboardStatsResponse.revenue.total,
        totalOrders: dashboardStatsResponse.orders.total,
        totalProducts: dashboardStatsResponse.products.total,
        totalCustomers: dashboardStatsResponse.customers.total,
        avgOrderValue: dashboardStatsResponse.revenue.total / dashboardStatsResponse.orders.total,
        conversionRate: 3.2, // Mock conversion rate
        monthlyGrowth: dashboardStatsResponse.revenue.growth,
        weeklyGrowth: dashboardStatsResponse.orders.growth
      };
      
      setStats(transformedStats);
      setRecentOrders(dashboardStatsResponse.recentOrders);
      setTopProducts(dashboardStatsResponse.topProducts);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
          <h1 className="text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
          <p className="text-slate-600 mt-1">{t('admin.welcome')}! {t('admin.recentOrders')}.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="today">{t('common.today', 'Today')}</option>
              <option value="week">{t('common.thisWeek', 'This Week')}</option>
              <option value="month">{t('common.thisMonth', 'This Month')}</option>
              <option value="year">{t('common.thisYear', 'This Year')}</option>
            </select>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
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
              +{stats.monthlyGrowth}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-slate-600">{t('admin.totalRevenue')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.weeklyGrowth}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalOrders.toLocaleString()}</p>
            <p className="text-sm text-slate-600">{t('admin.totalOrders')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.2%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalProducts.toLocaleString()}</p>
            <p className="text-sm text-slate-600">{t('admin.totalProducts')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.7%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers.toLocaleString()}</p>
            <p className="text-sm text-slate-600">{t('admin.totalCustomers')}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{t('admin.analytics')}</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">{t('admin.analytics')}</p>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{t('admin.analytics')}</h3>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="text-center">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">{t('admin.analytics')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{t('admin.recentOrders')}</h3>
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
          </div>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{t('admin.orders')} #{order.id}</div>
                  <div className="text-sm text-slate-600">{order.customer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{formatCurrency(order.total)}</div>
                  <div className="text-sm text-slate-500">{order.created_at}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-center text-blue-600 hover:bg-slate-50 rounded-lg transition-colors">
            {t('admin.viewAll')}
          </button>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{t('admin.topProducts')}</h3>
            <Award className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{product.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{product.sales} {t('admin.sales')}</div>
                  <div className="text-sm text-slate-500">{formatCurrency(parseFloat(product.revenue))}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-center text-blue-600 hover:bg-slate-50 rounded-lg transition-colors">
            {t('admin.viewAll')}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('admin.sales')}</h3>
            <p className="text-blue-100">{t('admin.analytics')}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              {t('admin.reports')}
            </button>
            <button className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
              {t('admin.analytics')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}