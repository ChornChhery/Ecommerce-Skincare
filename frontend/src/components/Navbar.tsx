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

  // Show admin navbar on admin pages with luxury theme
  if (isAdminPage) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#A2574F]/95 via-[#993A8B]/95 to-[#A2574F]/95 border-b border-[#BF7587]/30 shadow-2xl shadow-[#E65087]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Luxury Admin Logo */}
            <div className="flex items-center">
              <Link href="/admin" className="group flex items-center space-x-4 hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#E65087] to-[#993A8B] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-[#E65087]/30">
                    <span className="text-3xl">🧴</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#BF7587] to-[#E65087] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs text-white font-bold">✨</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-white via-[#FAF6F2] to-white bg-clip-text text-transparent">
                    Luxury Admin
                  </div>
                  <div className="text-sm text-[#FAF6F2]/80 font-medium">Premium Management Dashboard</div>
                </div>
              </Link>
            </div>

            {/* Luxury Admin Actions */}
            <div className="flex items-center space-x-6">
              {isAdminLoggedIn && adminUser ? (
                <>
                  {/* View Main Site */}
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-[#E65087]/30 hover:shadow-lg hover:shadow-[#E65087]/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="font-medium">View Luxury Site</span>
                  </Link>

                  {/* Luxury Admin Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-4 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-[#E65087]/30 hover:shadow-lg hover:shadow-[#E65087]/20"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#E65087] to-[#BF7587] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#E65087]/30">
                        {adminUser.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-lg font-semibold text-white">{adminUser.name}</div>
                        <div className="text-sm text-[#FAF6F2]/80 capitalize">{adminUser.role}</div>
                      </div>
                      <svg className={`w-5 h-5 text-white/80 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Luxury Admin Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-[#BF7587]/20 rounded-3xl shadow-2xl shadow-[#E65087]/20 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-[#FAF6F2] to-white border-b border-[#BF7587]/20">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#E65087] to-[#BF7587] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#E65087]/30">
                              {adminUser.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-[#A2574F]">{adminUser.name}</div>
                              <div className="text-sm text-[#BF7587]">{adminUser.email}</div>
                              <div className="text-xs text-[#993A8B] font-medium capitalize mt-1">{adminUser.role}</div>
                            </div>
                          </div>
                        </div>
                        <div className="py-3">
                          <Link 
                            href="/admin/settings" 
                            className="flex items-center space-x-4 px-6 py-4 text-[#A2574F] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg className="w-6 h-6 text-[#E65087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Luxury Settings</span>
                          </Link>
                          <button
                            onClick={handleAdminLogout}
                            className="w-full flex items-center space-x-4 px-6 py-4 text-[#E65087] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-8 py-4 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-105"
                >
                  Admin Access
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Luxury user navbar for main site with Desert Dusk theme
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#FAF6F2]/95 via-white/95 to-[#FAF6F2]/95 border-b border-[#BF7587]/20 shadow-2xl shadow-[#E65087]/10">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#E65087]/5 via-[#BF7587]/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-bl from-[#993A8B]/5 via-[#A2574F]/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          {/* Luxury Logo Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group flex items-center space-x-4 hover:scale-105 transition-all duration-500"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#A2574F] via-[#E65087] to-[#993A8B] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-[#E65087]/25">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#BF7587] to-[#E65087] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-xs text-white font-bold">🌸</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#A2574F] via-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
                  Luxury Skincare
                </div>
                <div className="text-sm text-[#BF7587] font-medium">Premium Desert Dusk Collection</div>
              </div>
            </Link>
          </div>

          {/* Luxury Navigation Items */}
          <div className="flex items-center space-x-8">
            {/* Admin Access Link for Users */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center space-x-3 px-4 py-2 text-[#A2574F] hover:text-[#E65087] text-sm font-medium transition-all duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Luxury Admin</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E65087] to-[#993A8B] group-hover:w-full transition-all duration-300"></div>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Luxury User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-4 px-6 py-3 rounded-3xl bg-gradient-to-r from-white/80 to-[#FAF6F2]/80 backdrop-blur-sm border border-[#BF7587]/20 hover:border-[#E65087]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#E65087]/15 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E65087] to-[#993A8B] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#E65087]/30">
                      {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-lg font-bold text-[#A2574F]">
                        {user?.first_name || 'Luxury Member'}
                      </div>
                      <div className="text-sm text-[#BF7587] font-medium">
                        Premium Experience
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-[#A2574F] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Luxury Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl border border-[#BF7587]/20 rounded-3xl shadow-2xl shadow-[#E65087]/20 overflow-hidden">
                      <div className="p-6 bg-gradient-to-r from-[#FAF6F2] to-white border-b border-[#BF7587]/20">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#E65087] to-[#993A8B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#E65087]/30">
                            {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#A2574F]">
                              {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-sm text-[#BF7587]">
                              {user?.email}
                            </div>
                            <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 bg-gradient-to-r from-[#E65087]/10 to-[#993A8B]/10 rounded-full">
                              <span className="w-2 h-2 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-full"></span>
                              <span className="text-xs text-[#993A8B] font-medium">Premium Member</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-3">
                        <Link 
                          href="/profile" 
                          className="flex items-center space-x-4 px-6 py-4 text-[#A2574F] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#E65087]/20 to-[#993A8B]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-[#E65087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-semibold">My Luxury Profile</span>
                        </Link>
                        
                        <Link 
                          href="/orders" 
                          className="flex items-center space-x-4 px-6 py-4 text-[#A2574F] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#BF7587]/20 to-[#E65087]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-[#BF7587]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <span className="font-semibold">Luxury Orders</span>
                        </Link>

                        <Link 
                          href="/cart" 
                          className="flex items-center space-x-4 px-6 py-4 text-[#A2574F] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#993A8B]/20 to-[#A2574F]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-[#993A8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-7h.01M19 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <span className="font-semibold">Shopping Cart</span>
                        </Link>
                        
                        <Link 
                          href="/wishlist" 
                          className="flex items-center space-x-4 px-6 py-4 text-[#A2574F] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#E65087]/20 to-[#BF7587]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-[#E65087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <span className="font-semibold">Luxury Wishlist</span>
                        </Link>
                        
                        <div className="border-t border-[#BF7587]/20 mt-3 pt-3">
                          <button
                            onClick={handleUserLogout}
                            className="flex items-center space-x-4 px-6 py-4 w-full text-left text-[#E65087] hover:bg-gradient-to-r hover:from-[#E65087]/10 hover:to-[#993A8B]/10 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#E65087]/20 to-[#993A8B]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-5 h-5 text-[#E65087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-semibold">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Luxury Login Button */}
                <Link 
                  href="/login" 
                  className="flex items-center space-x-3 px-6 py-3 text-[#A2574F] font-semibold hover:text-[#E65087] transition-all duration-300 relative group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E65087] to-[#993A8B] group-hover:w-full transition-all duration-300"></div>
                </Link>
                
                {/* Luxury Register Button */}
                <Link
                  href="/register"
                  className="relative px-8 py-4 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white font-bold rounded-3xl shadow-2xl shadow-[#E65087]/25 hover:shadow-xl hover:shadow-[#E65087]/40 transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#993A8B] to-[#A2574F] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center space-x-3">
                    <span>Join Luxury</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#BF7587] to-white rounded-full animate-pulse"></div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        /* Luxury gradient text selection */
        ::selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }

        ::-moz-selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }
      `}</style>
    </nav>
  );
}

