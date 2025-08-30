'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer } from '@/components/Toast';
import type { ToastProps, ToastType } from '@/components/Toast';

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((
    type: ToastType, 
    title: string, 
    message?: string, 
    duration = 5000
  ) => {
    const id = generateId();
    const newToast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: (toastId: string) => dismissToast(toastId)
    };

    setToasts(prev => {
      // Limit to maximum 5 toasts
      const updatedToasts = [newToast, ...prev].slice(0, 5);
      return updatedToasts;
    });
  }, [generateId]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast('error', title, message, 7000); // Error toasts stay longer
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message, 6000);
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissToast,
    clearAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience hook for common toast patterns
export function useToastActions() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  return {
    // Direct toast methods
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Shopping actions
    addedToCart: (productName: string) => 
      showSuccess('Added to Cart', `${productName} has been added to your cart`),
    
    removedFromCart: (productName: string) => 
      showInfo('Removed from Cart', `${productName} has been removed from your cart`),
    
    addedToWishlist: (productName: string) => 
      showSuccess('Added to Wishlist', `${productName} has been saved to your wishlist`),
    
    removedFromWishlist: (productName: string) => 
      showInfo('Removed from Wishlist', `${productName} has been removed from your wishlist`),

    // Order actions
    orderPlaced: (orderNumber: string) => 
      showSuccess('Order Placed', `Your order ${orderNumber} has been placed successfully`),
    
    orderCancelled: (orderNumber: string) => 
      showWarning('Order Cancelled', `Order ${orderNumber} has been cancelled`),

    // Authentication actions
    loginSuccess: (userName: string) => 
      showSuccess('Welcome back', `Hello ${userName}! You've been logged in successfully`),
    
    logoutSuccess: () => 
      showInfo('Logged out', 'You have been logged out successfully'),
    
    registrationSuccess: () => 
      showSuccess('Account Created', 'Your account has been created successfully'),

    // Profile actions
    profileUpdated: () => 
      showSuccess('Profile Updated', 'Your profile has been updated successfully'),
    
    passwordChanged: () => 
      showSuccess('Password Changed', 'Your password has been updated successfully'),

    // Error actions
    networkError: () => 
      showError('Network Error', 'Please check your internet connection and try again'),
    
    genericError: (message?: string) => 
      showError('Something went wrong', message || 'Please try again later'),
    
    validationError: (message: string) => 
      showError('Validation Error', message),

    // Stock alerts
    lowStock: (productName: string, stock: number) => 
      showWarning('Low Stock', `Only ${stock} left for ${productName}`),
    
    outOfStock: (productName: string) => 
      showError('Out of Stock', `${productName} is currently out of stock`),

    // Admin actions
    productAdded: (productName: string) => 
      showSuccess('Product Added', `${productName} has been added successfully`),
    
    productUpdated: (productName: string) => 
      showSuccess('Product Updated', `${productName} has been updated successfully`),
    
    productDeleted: (productName: string) => 
      showInfo('Product Deleted', `${productName} has been deleted`),
  };
}
