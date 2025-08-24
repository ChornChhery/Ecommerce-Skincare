'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Check admin authentication status
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminUser');
    
    if (adminToken && adminData) {
      try {
        setAdminUser(JSON.parse(adminData));
        setIsAdminLoggedIn(true);
      } catch (error) {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    } else {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
    }
  }, [pathname]);

  const handleUserLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    router.push('/admin/login');
  };

  // Don't show navbar on admin login page
  if (pathname === '/admin/login') {
    return null;
  }

  // Show admin navbar on admin pages
  if (isAdminPage) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/90 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Admin Logo */}
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🧴</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Admin Panel</div>
                  <div className="text-xs text-slate-300">Management Dashboard</div>
                </div>
              </Link>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center space-x-4">
              {isAdminLoggedIn && adminUser ? (
                <>
                  {/* View Main Site */}
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm">View Site</span>
                  </Link>

                  {/* Admin Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {adminUser.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-sm font-medium text-white">{adminUser.name}</div>
                        <div className="text-xs text-slate-300">{adminUser.role}</div>
                      </div>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Admin Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b border-slate-700">
                          <div className="text-sm font-medium text-white">{adminUser.name}</div>
                          <div className="text-xs text-slate-400">{adminUser.email}</div>
                        </div>
                        <div className="py-1">
                          <Link href="/admin/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                            Settings
                          </Link>
                          <button
                            onClick={handleAdminLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Regular user navbar for main site
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-blue-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200/50">
                  <span className="text-2xl">🧴</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Skincare Store
                </div>
                <div className="text-xs text-slate-500 font-medium">Premium Beauty Collection</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Admin Login Link for Users */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* User Info & Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-sm font-semibold text-slate-800">
                        {user?.first_name || 'User'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Premium Member
                      </div>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-blue-100/50 overflow-hidden animate-slideDown">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/60">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">
                              {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50/70 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">My Profile</span>
                        </Link>
                        
                        <Link 
                          href="/orders" 
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50/70 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span className="font-medium">My Orders</span>
                        </Link>

                        <Link href="/cart" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50/70 transition-colors duration-200">
                          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">Shopping Cart</span>
                        </Link>
                        
                        <Link 
                          href="/wishlist" 
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50/70 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="font-medium">Wishlist</span>
                        </Link>
                        
                        <div className="border-t border-slate-200/50 mt-2 pt-2">
                          <button
                            onClick={handleUserLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50/70 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link 
                  href="/login" 
                  className="flex items-center space-x-2 px-6 py-2.5 text-slate-700 font-medium hover:text-blue-600 transition-colors duration-300 relative group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
                
                {/* Register Button */}
                <Link
                  href="/register"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Join Now</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}