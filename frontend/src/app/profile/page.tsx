'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-100/30 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Authentication Required
              </h2>
              <p className="text-slate-600 mb-6">Please login to view your profile</p>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-105"
              >
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const skinTypeLabels: { [key: string]: string } = {
    normal: 'Normal',
    oily: 'Oily',
    dry: 'Dry',
    combination: 'Combination',
    sensitive: 'Sensitive',
  };

  const languageLabels: { [key: string]: string } = {
    en: 'English',
    th: 'ไทย (Thai)',
    km: 'ខ្មែរ (Khmer)',
  };

  const genderLabels: { [key: string]: string } = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  };

  const getSkinTypeIcon = (skinType: string) => {
    const icons = {
      normal: '✨',
      oily: '💧',
      dry: '🌵',
      combination: '🌗',
      sensitive: '🌸',
    };
    return icons[skinType as keyof typeof icons] || '🧴';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-100/30 overflow-hidden mb-8">
            {/* Cover Section */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Profile Image */}
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 relative">
                  {user.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt="Profile"
                      className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 border-4 border-white shadow-xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {getInitials(user.first_name, user.last_name)}
                      </span>
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex space-x-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/60 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="font-medium">Edit</span>
                </Link>
                
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/90 backdrop-blur-sm border border-red-400/60 rounded-xl text-white hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 pb-8 px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-slate-600 text-lg">{user.email}</p>
                </div>
                
                {user.skin_type && (
                  <div className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                    <span className="text-2xl">{getSkinTypeIcon(user.skin_type)}</span>
                    <span className="font-semibold text-slate-700">{skinTypeLabels[user.skin_type]} Skin</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-blue-100/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-600 mb-1">First Name</label>
                    <div className="text-slate-900 font-medium">{user.first_name}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Last Name</label>
                    <div className="text-slate-900 font-medium">{user.last_name}</div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="text-slate-900 font-medium flex items-center space-x-2">
                    <span>{user.email}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
                  <div className="text-slate-900 font-medium">{user.phone || 'Not provided'}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Date of Birth</label>
                    <div className="text-slate-900 font-medium">
                      {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Gender</label>
                    <div className="text-slate-900 font-medium">
                      {user.gender ? genderLabels[user.gender] : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences & Settings */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-blue-100/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Skin Type</label>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSkinTypeIcon(user.skin_type || '')}</span>
                    <span className="text-slate-900 font-medium">
                      {user.skin_type ? skinTypeLabels[user.skin_type] : 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Preferred Language</label>
                  <div className="text-slate-900 font-medium flex items-center space-x-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{languageLabels[user.language] || user.language}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">Quick Actions</h3>
                  
                  <Link
                    href="/orders"
                    className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium text-slate-700">My Orders</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium text-slate-700">Wishlist</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/recommendations"
                    className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="font-medium text-slate-700">Recommendations</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Logout</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to sign out of your account?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-3 px-4 bg-white/60 backdrop-blur-sm border border-white/40 text-slate-700 font-semibold rounded-xl hover:bg-white/80 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-300 hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}