'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, User, ShoppingBag, Star } from 'lucide-react';
import { mockAdminApi } from '@/lib/mockApi'; // Import the mock API
import { useTranslation } from 'react-i18next';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  skin_type: string;
  total_orders: number;
  total_spent: number;
  avg_rating: number;
  status: string;
  created_at: string;
}

export default function CustomersPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch customers from mock API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await mockAdminApi.getAdminCustomers(
        pagination.page,
        pagination.limit,
        searchTerm
      );
      setCustomers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on component mount and when search/pagination changes
  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchTerm]);

  const getSkinTypeColor = (skinType: string) => {
    switch (skinType) {
      case 'dry':
        return 'bg-orange-100 text-orange-800';
      case 'oily':
        return 'bg-blue-100 text-blue-800';
      case 'combination':
        return 'bg-blue-100 text-blue-800';
      case 'sensitive':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vip':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter customers by skin type (client-side filtering for skin type)
  const filteredCustomers = customers.filter(customer => {
    const matchesSkinType = skinTypeFilter === 'all' || customer.skin_type === skinTypeFilter;
    return matchesSkinType;
  });

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length 
        ? [] 
        : filteredCustomers.map(customer => customer.id)
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  // Handle search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
          <p className="text-gray-600">{t('admin.customers.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {t('admin.customers.count', { count: pagination.total })}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('admin.customers.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={skinTypeFilter}
                onChange={(e) => setSkinTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('admin.customers.allSkinTypes')}</option>
                <option value="dry">{t('admin.customers.skinTypes.dry')}</option>
                <option value="oily">{t('admin.customers.skinTypes.oily')}</option>
                <option value="combination">{t('admin.customers.skinTypes.combination')}</option>
                <option value="sensitive">{t('admin.customers.skinTypes.sensitive')}</option>
                <option value="normal">{t('admin.customers.skinTypes.normal')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {t('admin.customers.selectedCount', { count: selectedCustomers.length })}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => console.log('Send email to selected customers')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('admin.customers.sendEmail')}
              </button>
              <button
                onClick={() => console.log('Export selected customers')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t('admin.common.export')}
              </button>
              <button
                onClick={() => setSelectedCustomers([])}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {t('admin.customers.clearSelection')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.customer')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.contact')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.skinType')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.orders')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.totalSpent')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.rating')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.status')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.customers.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {t('admin.customers.joined', { date: new Date(customer.created_at).toLocaleDateString() })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail className="w-3 h-3 mr-2" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSkinTypeColor(customer.skin_type)}`}>
                      {customer.skin_type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {t('admin.customers.orderCount', { count: customer.total_orders })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ${customer.total_spent.toFixed(2)}
                    </div>
                    {customer.total_orders > 0 && (
                      <div className="text-xs text-gray-500">
                        {t('admin.customers.avgSpent', { amount: (customer.total_spent / customer.total_orders).toFixed(2) })}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {customer.avg_rating > 0 ? (
                      renderStars(customer.avg_rating)
                    ) : (
                      <span className="text-sm text-gray-400">{t('admin.customers.noReviews')}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => console.log('View customer', customer.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t('admin.customers.viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => console.log('Email customer', customer.email)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title={t('admin.customers.sendEmail')}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('admin.customers.noCustomersFound')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || skinTypeFilter !== 'all' 
                ? t('admin.customers.noCustomersFoundFilters')
                : t('admin.customers.noCustomersFoundStart')}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {t('admin.pagination.showingResults', { start: ((pagination.page - 1) * pagination.limit) + 1, end: Math.min(pagination.page * pagination.limit, pagination.total), total: pagination.total })}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('admin.pagination.previous')}
            </button>
            <span className="px-3 py-1 text-sm">
              {t('admin.customers.pageInfo', { currentPage: pagination.page, totalPages: pagination.totalPages })}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('admin.pagination.next')}
            </button>
          </div>
        </div>
      )}

      {/* Customer Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{t('admin.customers.stats.total')}</div>
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{t('admin.customers.stats.active')}</div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{t('admin.customers.stats.vip')}</div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'vip').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{t('admin.customers.stats.avgOrders')}</div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.length > 0 
                  ? (customers.reduce((sum, c) => sum + c.total_orders, 0) / customers.length).toFixed(1)
                  : '0'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}