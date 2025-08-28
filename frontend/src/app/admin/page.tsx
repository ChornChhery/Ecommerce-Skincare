'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Check, X, Star, MessageSquare, User, Calendar, Clock } from 'lucide-react';
import { mockAdminApi } from '@/lib/mockApi';

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch reviews from mock API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await mockAdminApi.getAdminReviews(
        pagination.page,
        pagination.limit,
        statusFilter === 'all' ? '' : statusFilter
      );
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews on component mount and when filters change
  useEffect(() => {
    fetchReviews();
  }, [pagination.page, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'flagged':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Client-side filtering for search and rating
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || (
      review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const handleSelectReview = (reviewId: number) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReviews(
      selectedReviews.length === filteredReviews.length 
        ? [] 
        : filteredReviews.map(review => review.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    try {
      if (action === 'approve') {
        await mockAdminApi.bulkUpdateReviews(selectedReviews, 'approved');
      } else if (action === 'reject') {
        await mockAdminApi.bulkUpdateReviews(selectedReviews, 'rejected');
      }
      console.log(`Bulk ${action} for reviews:`, selectedReviews);
      setSelectedReviews([]);
      fetchReviews();
    } catch (error) {
      console.error('Error with bulk action:', error);
    }
  };

  const handleReviewAction = async (reviewId: number, action: string) => {
    try {
      if (action === 'approve') {
        await mockAdminApi.updateReviewStatus(reviewId, 'approved');
        fetchReviews();
      } else if (action === 'reject') {
        await mockAdminApi.updateReviewStatus(reviewId, 'rejected');
        fetchReviews();
      } else if (action === 'delete') {
        await mockAdminApi.deleteReview(reviewId);
        fetchReviews();
      }
      console.log(`${action} review ${reviewId}`);
    } catch (error) {
      console.error('Error with review action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Review Moderation</h1>
            <p className="text-gray-600">Manage and moderate customer product reviews</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">
                {pagination.total} total reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews by product, customer, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve All</span>
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject All</span>
              </button>
              <button
                onClick={() => setSelectedReviews([])}
                className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => handleSelectReview(review.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Review #{review.id}</h3>
                    {renderStars(review.rating)}
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{review.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{review.product_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Customer Email:</span> {review.customer_email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => console.log('View review details:', review)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReviewAction(review.id, 'approve')}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReviewAction(review.id, 'reject')}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleReviewAction(review.id, 'delete')}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Reviews will appear here when customers leave feedback on products.'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}