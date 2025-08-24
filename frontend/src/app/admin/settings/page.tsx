'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Mail, Shield, Bell, Globe, Palette, Database, Key, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface AdminSettings {
  general: {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    timezone: string;
    currency: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    orderNotifications: boolean;
    reviewNotifications: boolean;
    lowStockAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordRequirements: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    logo: string;
    favicon: string;
  };
  advanced: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    general: {
      siteName: 'Skincare Store Admin',
      siteDescription: 'Premium skincare products for all skin types',
      adminEmail: 'admin@skincare.com',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      reviewNotifications: true,
      lowStockAlerts: true,
      systemAlerts: false
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordRequirements: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      }
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      logo: '',
      favicon: ''
    },
    advanced: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      autoBackup: true,
      backupFrequency: 'weekly'
    }
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Settings are already initialized in state
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof AdminSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (section: keyof AdminSettings, nestedKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section] as any)[nestedKey],
          [key]: value
        }
      }
    }));
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'advanced', name: 'Advanced', icon: Database }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="flex gap-6">
          <div className="w-64 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex-1 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-slate-600 mt-1">Manage your admin panel configuration and preferences</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Settings saved!</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        value={settings.general.adminEmail}
                        onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                        <p className="text-sm text-slate-600">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Order Notifications</h4>
                        <p className="text-sm text-slate-600">Get notified of new orders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.orderNotifications}
                        onChange={(e) => updateSetting('notifications', 'orderNotifications', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Review Notifications</h4>
                        <p className="text-sm text-slate-600">Get notified of new product reviews</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.reviewNotifications}
                        onChange={(e) => updateSetting('notifications', 'reviewNotifications', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Low Stock Alerts</h4>
                        <p className="text-sm text-slate-600">Alert when products are running low</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.lowStockAlerts}
                        onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">System Alerts</h4>
                        <p className="text-sm text-slate-600">Receive system maintenance notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemAlerts}
                        onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                  
                  {/* Two Factor Authentication */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h4>
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e) => updateSetting('security', 'twoFactorEnabled', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-slate-600">Add an extra layer of security to your admin account</p>
                  </div>

                  {/* Session Timeout */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="5"
                      max="480"
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-900 mb-3">Password Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Minimum length: {settings.security.passwordRequirements.minLength} characters</span>
                        <input
                          type="range"
                          min="6"
                          max="20"
                          value={settings.security.passwordRequirements.minLength}
                          onChange={(e) => updateNestedSetting('security', 'passwordRequirements', 'minLength', parseInt(e.target.value))}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Require special characters</span>
                        <input
                          type="checkbox"
                          checked={settings.security.passwordRequirements.requireSpecialChars}
                          onChange={(e) => updateNestedSetting('security', 'passwordRequirements', 'requireSpecialChars', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Require numbers</span>
                        <input
                          type="checkbox"
                          checked={settings.security.passwordRequirements.requireNumbers}
                          onChange={(e) => updateNestedSetting('security', 'passwordRequirements', 'requireNumbers', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Require uppercase letters</span>
                        <input
                          type="checkbox"
                          checked={settings.security.passwordRequirements.requireUppercase}
                          onChange={(e) => updateNestedSetting('security', 'passwordRequirements', 'requireUppercase', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-sm font-medium text-slate-900 mb-4">Change Password</h4>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        disabled={!currentPassword || !newPassword || !confirmPassword || saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Appearance Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Logo Upload</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                        <div className="text-slate-400 mb-2">
                          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-600">Click to upload logo</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Favicon Upload</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                        <div className="text-slate-400 mb-2">
                          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-600">Click to upload favicon</p>
                        <p className="text-xs text-slate-500 mt-1">ICO, PNG 16x16 or 32x32</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-orange-900">Maintenance Mode</h4>
                        <input
                          type="checkbox"
                          checked={settings.advanced.maintenanceMode}
                          onChange={(e) => updateSetting('advanced', 'maintenanceMode', e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <p className="text-sm text-orange-700">Put the site in maintenance mode for updates</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">Debug Mode</h4>
                          <p className="text-sm text-slate-600">Enable detailed error reporting</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.advanced.debugMode}
                          onChange={(e) => updateSetting('advanced', 'debugMode', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">Cache Enabled</h4>
                          <p className="text-sm text-slate-600">Enable system caching for better performance</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.advanced.cacheEnabled}
                          onChange={(e) => updateSetting('advanced', 'cacheEnabled', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">Auto Backup</h4>
                          <p className="text-sm text-slate-600">Automatically backup your data</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.advanced.autoBackup}
                          onChange={(e) => updateSetting('advanced', 'autoBackup', e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      {settings.advanced.autoBackup && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Backup Frequency</label>
                          <select
                            value={settings.advanced.backupFrequency}
                            onChange={(e) => updateSetting('advanced', 'backupFrequency', e.target.value)}
                            className="w-48 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-sm font-medium text-slate-900 mb-4">System Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Clear Cache
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Create Backup
                        </button>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                          System Check
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Reset Settings
                        </button>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-sm font-medium text-slate-900 mb-4">System Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="font-medium text-slate-700">Version</div>
                          <div className="text-slate-600">v2.1.3</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="font-medium text-slate-700">Last Backup</div>
                          <div className="text-slate-600">July 30, 2025 3:22 PM</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="font-medium text-slate-700">Database Size</div>
                          <div className="text-slate-600">45.2 MB</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="font-medium text-slate-700">Cache Size</div>
                          <div className="text-slate-600">12.8 MB</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}