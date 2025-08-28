'use client';

import { useState, useEffect } from 'react';
import { mockAdminApi, mockProducts } from '@/lib/mockApi';
import { Search, Plus, Edit, Trash2, Tag, Package, CheckCircle, X, Filter } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState<{ type: 'add' | 'edit', category?: Category } | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });
  const [showDeleteModal, setShowDeleteModal] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, statusFilter]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Generate categories from products
      const response = await mockAdminApi.getAdminProducts(1, 100);
      const products = response.data;
      
      const categoryMap = new Map();
      products.forEach((product: any) => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, {
            id: categoryMap.size + 1,
            name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            slug: product.category.toLowerCase(),
            description: `Premium ${product.category} products for healthy, radiant skin`,
            productCount: 0,
            status: 'active' as const,
            created_at: '2024-01-15'
          });
        }
        categoryMap.get(product.category).productCount++;
      });

      setCategories(Array.from(categoryMap.values()));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => category.status === statusFilter);
    }

    setFilteredCategories(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (showModal?.type === 'add') {
        const newCategory: Category = {
          id: Math.max(...categories.map(c => c.id)) + 1,
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          productCount: 0,
          status: formData.status as 'active' | 'inactive',
          created_at: new Date().toISOString().split('T')[0]
        };
        setCategories(prev => [...prev, newCategory]);
      } else if (showModal?.category) {
        setCategories(prev => prev.map(c => 
          c.id === showModal.category!.id 
            ? { ...c, name: formData.name, description: formData.description, status: formData.status as 'active' | 'inactive' }
            : c
        ));
      }
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setShowModal(null);
      setFormData({ name: '', description: '', status: 'active' });
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setCategories(prev => prev.filter(c => c.id !== category.id));
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setSaving(false);
    }
  };

  const openModal = (type: 'add' | 'edit', category?: Category) => {
    setShowModal({ type, category });
    if (type === 'edit' && category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status
      });
    } else {
      setFormData({ name: '', description: '', status: 'active' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="ml-4 space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="flex justify-between items-center pt-4">
                  <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-slate-200 rounded w-12 animate-pulse"></div>
                    <div className="h-8 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
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
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-600 mt-1">Organize and manage your product categories</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Categories</p>
              <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Active Categories</p>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-2xl font-bold text-purple-600">
                {categories.reduce((sum, c) => sum + c.productCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Categories</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Results</label>
            <div className="flex items-center py-3">
              <span className="text-slate-600 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                Showing <span className="font-semibold text-slate-900">{filteredCategories.length}</span> of <span className="font-semibold text-slate-900">{categories.length}</span> categories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{category.description}</p>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-700">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(category.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => openModal('edit', category)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(category)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories found</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Get started by creating your first product category to organize your skincare products.'
            }
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 mr-2" />
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Category
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {showModal.type === 'add' ? 'Add New Category' : 'Edit Category'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter category description"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (showModal.type === 'add' ? 'Create Category' : 'Update Category')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Category</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{showDeleteModal.name}"</span>?
              </p>
              
              {showDeleteModal.productCount > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 text-sm">
                    <strong>Warning:</strong> This category contains {showDeleteModal.productCount} product{showDeleteModal.productCount !== 1 ? 's' : ''}. Deleting this category may affect these products.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Deleting...' : 'Delete Category'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}