'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
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
      alert(`Maximum ${item.max_quantity} items available for ${item.product_name}`);
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
      alert('Failed to update quantity. Please try again.');
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
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item. Please try again.');
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
        alert(`Promo code applied! ${discountPercent}% discount`);
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      console.error('Failed to apply promo code:', error);
      alert('Failed to apply promo code. Please try again.');
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleCheckout = () => {
    // Replace with actual checkout logic
    console.log('Proceeding to checkout with items:', cartItems);
    alert('Proceeding to checkout...');
    // router.push('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-l-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.3s' }}></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <span className="text-2xl">🛒</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-green-600 to-blue-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Review your selected skincare products
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <h3 className="text-3xl font-bold text-slate-600 mb-4">
              Your cart is empty
            </h3>
            <p className="text-slate-500 text-lg mb-8">
              Add some amazing skincare products to get started!
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Cart Items ({cartItems.length})
                </h2>
                <button
                  onClick={handleContinueShopping}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  ← Continue Shopping
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden">
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
                            <span className="text-sm text-slate-500 capitalize">{item.category}</span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                              {item.product_name}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
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
                                <span className="text-sm font-medium text-slate-600">Qty:</span>
                                <div className="flex items-center border border-slate-200 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || updatingItems.has(item.id) || !item.in_stock}
                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    -
                                  </button>
                                  <span className="w-12 h-8 flex items-center justify-center font-semibold text-sm">
                                    {updatingItems.has(item.id) ? (
                                      <div className="w-3 h-3 border border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={updatingItems.has(item.id) || !item.in_stock}
                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleViewProduct(item.product_id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                                >
                                  View Product
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  disabled={removingItems.has(item.id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                >
                                  {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-slate-500">
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
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-700">Promo Code</span>
                    <button
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-800">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
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
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {cartItems.some(item => !item.in_stock) 
                    ? 'Remove Out of Stock Items to Checkout'
                    : `Proceed to Checkout`
                  }
                </button>

                {/* Security Info */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-500">
                  <span>🔒</span>
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