'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAdminApi } from '@/lib/mockApi';

export default function AdminQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleQuickLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Use demo admin credentials
      const response = await mockAdminApi.adminLogin('admin@skincare.com', 'admin123');
      
      // Store admin auth data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Quick Admin Access Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-full shadow-lg shadow-slate-900/25 hover:shadow-xl hover:shadow-slate-900/40 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="Quick Admin Access"
      >
        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Quick Admin Access</h3>
                <p className="text-slate-600 text-sm">Access admin panel with demo credentials</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Demo Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-slate-800 mb-2">Demo Admin Credentials:</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><strong>Email:</strong> admin@skincare.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickLogin}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:from-slate-800 hover:to-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login as Admin'
                  )}
                </button>
              </div>

              {/* Alternative */}
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500 mb-2">Or login manually:</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/admin/login');
                  }}
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
                >
                  Go to Admin Login Page →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}