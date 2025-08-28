'use client';

import { useState, useEffect } from 'react';
import { mockAdminApi, mockProducts } from '@/lib/mockApi';

interface Product {
  id: number;
  name_en: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  status: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updating, setUpdating] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<{ id: number; currentStock: number } | null>(null);
  const [newStock, setNewStock] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, stockFilter, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await mockAdminApi.getAdminProducts(1, 100);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (stockFilter === 'out_of_stock') return product.stock === 0;
        if (stockFilter === 'low_stock') return product.stock > 0 && product.stock <= 10;
        if (stockFilter === 'good_stock') return product.stock > 10;
        return true;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Good Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleUpdateStock = async () => {
    if (!showUpdateModal || !newStock) return;

    try {
      setUpdating(showUpdateModal.id);
      await mockAdminApi.updateProduct(showUpdateModal.id, { stock: parseInt(newStock) });
      
      setProducts(prev => prev.map(p => 
        p.id === showUpdateModal.id ? { ...p, stock: parseInt(newStock) } : p
      ));
      
      setShowUpdateModal(null);
      setNewStock('');
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentPageProducts = getCurrentPageProducts();

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))];

  // Calculate stats
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your product stock levels</p>
        </div>
        <button
          onClick={fetchProducts}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Inventory
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, category..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock (≤10)</option>
              <option value="good_stock">Good Stock ({'>10'})</option>
            </select>
          </div>

          {/* Results */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Results</label>
            <div className="flex items-center py-2">
              <span className="text-slate-600">
                Showing {currentPageProducts.length} of {filteredProducts.length} products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Stock Value</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentPageProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url}
                          alt={product.name_en}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{product.name_en}</p>
                          <p className="text-sm text-slate-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-slate-900">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        ${(product.price * product.stock).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setShowUpdateModal({ id: product.id, currentStock: product.stock });
                          setNewStock(product.stock.toString());
                        }}
                        disabled={updating === product.id}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
                      >
                        {updating === product.id ? 'Updating...' : 'Update Stock'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'No products in inventory.'
            }
          </p>
          {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUpdateModal(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Update Stock</h3>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Stock: {showUpdateModal.currentStock}
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new stock quantity"
                min="0"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateStock}
                disabled={!newStock || updating === showUpdateModal.id}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating === showUpdateModal.id ? 'Updating...' : 'Update Stock'}
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(null);
                  setNewStock('');
                }}
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