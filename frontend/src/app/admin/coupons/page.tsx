'use client';

import { useState, useEffect } from 'react';
import { Percent, Gift, Calendar, Users, Eye, Edit, Trash2, Plus, Search, Filter, TrendingUp, Clock, MoreVertical, CheckSquare, Square } from 'lucide-react';
import { mockAdminApi } from '@/lib/mockApi';

interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  created_at: string;
  applicableCategories?: string[];
  isFirstTimeOnly?: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<{ type: 'add' | 'edit', coupon?: Coupon } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Coupon | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalUses: 0,
    expired: 0,
    totalSavings: 0,
    averageDiscount: 0
  });
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'inactive',
    isFirstTimeOnly: false,
    applicableCategories: ['all'] as string[]
  });

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, statusFilter, typeFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await mockAdminApi.getCoupons(1, 100, searchTerm, statusFilter, typeFilter);
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await mockAdminApi.getCouponStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.type === typeFilter);
    }

    setFilteredCoupons(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'percentage' ? <Percent className="w-4 h-4" /> : <span className="font-bold">$</span>;
  };

  const formatValue = (coupon: Coupon) => {
    return coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (showModal?.type === 'add') {
        await mockAdminApi.createCoupon(formData);
      } else if (showModal?.coupon) {
        await mockAdminApi.updateCoupon(showModal.coupon.id, formData);
      }
      
      await fetchCoupons();
      await fetchStats();
      setShowModal(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    try {
      await mockAdminApi.deleteCoupon(coupon.id);
      await fetchCoupons();
      await fetchStats();
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        // Delete selected coupons
        for (const id of selectedCoupons) {
          await mockAdminApi.deleteCoupon(id);
        }
      } else {
        // Update status of selected coupons
        const status = action === 'activate' ? 'active' : 'inactive';
        await mockAdminApi.bulkUpdateCoupons(selectedCoupons, { status });
      }
      
      await fetchCoupons();
      await fetchStats();
      setSelectedCoupons([]);
      setShowBulkModal(false);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const toggleCouponSelection = (couponId: number) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId) 
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCoupons.length === filteredCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(filteredCoupons.map(c => c.id));
    }
  };

  const openModal = (type: 'add' | 'edit', coupon?: Coupon) => {
    setShowModal({ type, coupon });
    if (type === 'edit' && coupon) {
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount || 0,
        usageLimit: coupon.usageLimit,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
        isFirstTimeOnly: coupon.isFirstTimeOnly || false,
        applicableCategories: coupon.applicableCategories || ['all']
      });
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      usageLimit: 100,
      startDate: '',
      endDate: '',
      status: 'active',
      isFirstTimeOnly: false,
      applicableCategories: ['all']
    });
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coupon Management</h1>
          <p className="text-slate-600 mt-1">Create and manage discount coupons</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          {selectedCoupons.length > 0 && (
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Bulk Actions ({selectedCoupons.length})
            </button>
          )}
          <button
            onClick={() => openModal('add')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Coupons</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Uses</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalUses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Savings</p>
              <p className="text-2xl font-bold text-purple-600">${stats.totalSavings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avg Discount</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.averageDiscount}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Coupons</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code, name, or description..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Results</label>
            <div className="flex items-center py-2">
              <span className="text-slate-600">
                {filteredCoupons.length} of {coupons.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Selection Header */}
      {filteredCoupons.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                {selectedCoupons.length === filteredCoupons.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                Select All
              </button>
              {selectedCoupons.length > 0 && (
                <span className="text-sm text-slate-600">
                  {selectedCoupons.length} selected
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleCouponSelection(coupon.id)}
                  className="mt-1"
                >
                  {selectedCoupons.includes(coupon.id) ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(coupon.type)}
                      <span className="text-xl font-bold text-slate-900 font-mono">
                        {coupon.code}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon.status)}`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                    {isExpired(coupon.endDate) && coupon.status === 'active' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                    {coupon.isFirstTimeOnly && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        First Time Only
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{coupon.name}</h3>
                  <p className="text-slate-600 mb-3">{coupon.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Discount:</span>
                      <p className="font-semibold text-green-600">{formatValue(coupon)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Min Order:</span>
                      <p className="font-semibold">${coupon.minOrderValue}</p>
                    </div>
                    {coupon.maxDiscount && (
                      <div>
                        <span className="text-slate-500">Max Discount:</span>
                        <p className="font-semibold">${coupon.maxDiscount}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Usage:</span>
                      <p className="font-semibold">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Valid Until:</span>
                      <p className="font-semibold">
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Categories:</span>
                      <p className="font-semibold capitalize">
                        {coupon.applicableCategories?.join(', ') || 'All'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Usage Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-500">Usage Progress</span>
                      <span className="text-slate-700">
                        {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => console.log('View coupon analytics:', coupon.id)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                  title="View Analytics"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal('edit', coupon)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="Edit Coupon"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(coupon)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No coupons found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first coupon to start offering discounts.'
            }
          </p>
          {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Coupon
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {showModal.type === 'add' ? 'Create New Coupon' : 'Edit Coupon'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder="Enter coupon code"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCouponCode}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter coupon name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter coupon description"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Discount Settings */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Discount Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Discount Value * {formData.type === 'percentage' ? '(%)' : '($)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      max={formData.type === 'percentage' ? '100' : undefined}
                      required
                    />
                  </div>

                  {formData.type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Max Discount ($)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="No limit"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Conditions & Limits */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Conditions & Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Min Order Value ($)</label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Usage Limit *</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFirstTimeOnly}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFirstTimeOnly: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">First-time customers only</span>
                  </label>
                </div>
              </div>

              {/* Date Range & Status */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Validity & Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={formData.startDate}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applicable Categories */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Applicable Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['all', 'cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment', 'toner', 'mask'].map(category => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(category)}
                        onChange={(e) => {
                          if (category === 'all') {
                            setFormData(prev => ({ 
                              ...prev, 
                              applicableCategories: e.target.checked ? ['all'] : [] 
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              applicableCategories: e.target.checked
                                ? [...prev.applicableCategories.filter(c => c !== 'all'), category]
                                : prev.applicableCategories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showModal.type === 'add' ? 'Create Coupon' : 'Update Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBulkModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MoreVertical className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Bulk Actions</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Perform actions on {selectedCoupons.length} selected coupons
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleBulkAction('activate')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Deactivate Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Delete Coupon</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete coupon "{showDeleteModal.code}"? This coupon has been used {showDeleteModal.usedCount} times. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Coupon
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}