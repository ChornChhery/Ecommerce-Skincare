'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, Download, Calendar, Filter, RefreshCw } from 'lucide-react';

interface ReportData {
  salesByMonth: Array<{ month: string; sales: number; orders: number; }>;
  topProducts: Array<{ name: string; sales: number; quantity: number; }>;
  customerAcquisition: Array<{ month: string; new: number; returning: number; }>;
  categoryBreakdown: Array<{ name: string; value: number; color: string; id?: string; }>;
  revenueByCategory: Array<{ category: string; revenue: number; }>;
  conversionRates: Array<{ date: string; rate: number; visitors: number; }>;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for reports
  const mockReportData: ReportData = {
    salesByMonth: [
      { month: 'Jan', sales: 4200, orders: 42 },
      { month: 'Feb', sales: 3800, orders: 38 },
      { month: 'Mar', sales: 5100, orders: 51 },
      { month: 'Apr', sales: 4600, orders: 46 },
      { month: 'May', sales: 5800, orders: 58 },
      { month: 'Jun', sales: 6200, orders: 62 },
      { month: 'Jul', sales: 7100, orders: 71 }
    ],
    topProducts: [
      { name: 'Vitamin C Serum', sales: 15420, quantity: 335 },
      { name: 'Hydrating Moisturizer', sales: 12800, quantity: 356 },
      { name: 'Gentle Cleanser', sales: 11200, quantity: 431 },
      { name: 'Sunscreen Anessa', sales: 9800, quantity: 245 },
      { name: 'Retinol', sales: 8900, quantity: 1486 }
    ],
    customerAcquisition: [
      { month: 'Jan', new: 15, returning: 27 },
      { month: 'Feb', new: 12, returning: 26 },
      { month: 'Mar', new: 18, returning: 33 },
      { month: 'Apr', new: 16, returning: 30 },
      { month: 'May', new: 22, returning: 36 },
      { month: 'Jun', new: 25, returning: 37 },
      { month: 'Jul', new: 28, returning: 43 }
    ],
    categoryBreakdown: [
      { name: 'Serums', value: 35, color: '#3B82F6', id: 'serums' },
      { name: 'Moisturizers', value: 25, color: '#10B981', id: 'moisturizers' },
      { name: 'Cleansers', value: 20, color: '#F59E0B', id: 'cleansers' },
      { name: 'Sunscreens', value: 12, color: '#EF4444', id: 'sunscreens' },
      { name: 'Treatments', value: 8, color: '#8B5CF6', id: 'treatments' }
    ],
    revenueByCategory: [
      { category: 'Serums', revenue: 18500 },
      { category: 'Moisturizers', revenue: 15200 },
      { category: 'Cleansers', revenue: 12800 },
      { category: 'Sunscreens', revenue: 9600 },
      { category: 'Treatments', revenue: 7400 },
      { category: 'Toners', revenue: 5800 },
      { category: 'Masks', revenue: 4200 }
    ],
    conversionRates: [
      { date: '2024-01', rate: 2.1, visitors: 1250 },
      { date: '2024-02', rate: 1.9, visitors: 1180 },
      { date: '2024-03', rate: 2.4, visitors: 1420 },
      { date: '2024-04', rate: 2.2, visitors: 1350 },
      { date: '2024-05', rate: 2.6, visitors: 1580 },
      { date: '2024-06', rate: 2.8, visitors: 1650 },
      { date: '2024-07', rate: 3.1, visitors: 1720 }
    ]
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockReportData);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setReportData(mockReportData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting report as ${format}`);
    // Implement export functionality
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load reports</h3>
          <p className="text-gray-600 mb-4">There was an error loading the analytics data.</p>
          <button
            onClick={fetchReportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = reportData.salesByMonth.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = reportData.salesByMonth.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const totalCustomers = reportData.customerAcquisition.reduce((sum, item) => sum + item.new + item.returning, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600">+12.5% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
              <p className="text-sm text-blue-600">+8.3% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</p>
              <p className="text-sm text-orange-600">+3.8% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <p className="text-sm text-purple-600">+15.2% from last period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Sales</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => [
                name === 'sales' ? formatCurrency(value as number) : value,
                name === 'sales' ? 'Sales' : 'Orders'
              ]} />
              <Area yAxisId="left" type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              <Area yAxisId="right" type="monotone" dataKey="orders" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const percent = entry.percent || 0;
                  return `${entry.name} ${Math.round(percent * 100)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.categoryBreakdown.map((entry) => (
                  <Cell key={entry.id || entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Acquisition</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">New</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Returning</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.customerAcquisition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="new" stackId="a" fill="#3B82F6" />
              <Bar dataKey="returning" stackId="a" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Rate (%)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.conversionRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData.topProducts} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value, name) => [
              name === 'sales' ? formatCurrency(value as number) : `${value} units`,
              name === 'sales' ? 'Revenue' : 'Quantity Sold'
            ]} />
            <Bar dataKey="sales" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.revenueByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">2.4%</div>
            <div className="text-sm text-gray-600">Average Conversion Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">4.2</div>
            <div className="text-sm text-gray-600">Average Items per Order</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Export Options Modal Trigger */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Export Reports</h3>
            <p className="text-gray-600">Download detailed analytics reports for offline analysis</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Excel
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}