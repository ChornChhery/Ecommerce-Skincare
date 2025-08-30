'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToastActions } from '@/contexts/ToastContext';
import { mockApi, mockProducts } from '@/lib/mockApi';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  in_stock: boolean;
  max_quantity?: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const toastActions = useToastActions();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock cart data using your actual products - replace with your actual API call
    const fetchCart = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock cart using your actual product data
        // This simulates user having added specific products to cart
        const cartProductData = [
          { product_id: 3, quantity: 2 },
          { product_id: 7, quantity: 1 },
          { product_id: 16, quantity: 1 },
          { product_id: 12, quantity: 3 },
          { product_id: 6, quantity: 1 }
        ];
        
        const mockCart: CartItem[] = cartProductData.map((cartData, index) => {
          const product = mockProducts.find(p => p.id === cartData.product_id);
          if (!product) return null;
          
          return {
            id: index + 1,
            product_id: product.id,
            product_name: product.name_en,
            product_image: product.image_url,
            price: product.price,
            quantity: cartData.quantity,
            category: product.category,
            description: product.description_en,
            in_stock: Math.random() > 0.1, // 90% chance of being in stock
            max_quantity: Math.floor(Math.random() * 8) + 3 // Random max quantity 3-10
          };
        }).filter(Boolean) as CartItem[];
        
        setCartItems(mockCart);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, router]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;
    
    if (item.max_quantity && newQuantity > item.max_quantity) {
      toastActions.validationError(`Maximum ${item.max_quantity} items available for ${item.product_name}`);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Replace with actual API call
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toastActions.genericError('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (itemId: number) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Replace with actual API call
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      const removedItem = cartItems.find(item => item.id === itemId);
      if (removedItem) {
        toastActions.removedFromCart(removedItem.product_name);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      toastActions.genericError('Failed to remove item. Please try again.');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock promo code logic
      const validCodes = {
        'SAVE10': 10,
        'WELCOME20': 20,
        'SKINCARE15': 15
      };
      
      const discountPercent = validCodes[promoCode.toUpperCase() as keyof typeof validCodes];
      
      if (discountPercent) {
        setDiscount(discountPercent);
        toastActions.showSuccess('Promo Code Applied', `${discountPercent}% discount applied to your order`);
      } else {
        toastActions.showError('Invalid Promo Code', 'Please check the code and try again');
      }
    } catch (error) {
      console.error('Failed to apply promo code:', error);
      toastActions.genericError('Failed to apply promo code. Please try again.');
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleCheckout = () => {
    // Check if all items are in stock
    const outOfStockItems = cartItems.filter(item => !item.in_stock);
    if (outOfStockItems.length > 0) {
      toastActions.showError('Items Out of Stock', 'Please remove out of stock items before proceeding to checkout.');
      return;
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      toastActions.showError('Cart Empty', 'Add some products before checkout.');
      return;
    }
    
    // Redirect to checkout page
    router.push('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-gray-700">
                Loading Your Cart...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 18a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review your selected skincare products
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 18a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Add some amazing skincare products to get started!
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
                <button
                  onClick={handleContinueShopping}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  ← Continue Shopping
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                    removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                        {!item.in_stock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {item.product_name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {item.description}
                            </p>
                            
                            {/* Stock Status */}
                            <div className="flex items-center space-x-4 mb-4">
                              <span className={`text-sm font-medium ${
                                item.in_stock ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {item.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                              </span>
                              {item.max_quantity && (
                                <span className="text-sm text-slate-500">
                                  Max: {item.max_quantity}
                                </span>
                              )}
                            </div>

                            {/* Actions Row */}
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-600">Qty:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || updatingItems.has(item.id) || !item.in_stock}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    -
                                  </button>
                                  <span className="w-12 h-8 flex items-center justify-center font-semibold text-sm">
                                    {updatingItems.has(item.id) ? (
                                      <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={updatingItems.has(item.id) || !item.in_stock}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleViewProduct(item.product_id)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                                >
                                  View Product
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  disabled={removingItems.has(item.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                >
                                  {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Promo Code</span>
                    <button
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showPromoInput ? 'Cancel' : 'Add Code'}
                    </button>
                  </div>
                  
                  {showPromoInput && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      ✓ {discount}% discount applied
                    </div>
                  )}
                </div>

                {/* Summary Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.some(item => !item.in_stock)}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartItems.some(item => !item.in_stock) 
                    ? 'Remove Out of Stock Items to Checkout'
                    : `Proceed to Checkout`
                  }
                </button>

                {/* Security Info */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}