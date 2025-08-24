'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  category: string;
}

interface Order {
  id: number;
  order_number: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock orders data - replace with your actual API call
    const fetchOrders = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data using your actual products - replace with actual API call
        const mockOrders: Order[] = [
          {
            id: 1,
            order_number: 'ORD-2024-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 89.97,
            items: [
              {
                id: 1,
                product_id: 3,
                product_name: 'Vitamin C Serum',
                product_image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&h=300',
                quantity: 1,
                price: 45.99,
                category: 'serum'
              },
              {
                id: 2,
                product_id: 16,
                product_name: 'Ceramide Moisturizer',
                product_image: 'https://mintyshopaus.com/cdn/shop/files/SKIN-CERE1.jpg?v=1724668758&width=1445',
                quantity: 1,
                price: 32.99,
                category: 'moisturizer'
              }
            ],
            shipping_address: '123 Main St, Hat Yai, Songkhla 90110',
            payment_method: 'Credit Card'
          },
          {
            id: 2,
            order_number: 'ORD-2024-002',
            date: '2024-01-20',
            status: 'shipped',
            total: 25.99,
            items: [
              {
                id: 3,
                product_id: 1,
                product_name: 'Gentle Cleanser',
                product_image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300',
                quantity: 1,
                price: 25.99,
                category: 'cleanser'
              }
            ],
            shipping_address: '123 Main St, Hat Yai, Songkhla 90110',
            payment_method: 'PayPal'
          },
          {
            id: 3,
            order_number: 'ORD-2024-003',
            date: '2024-01-25',
            status: 'processing',
            total: 75.98,
            items: [
              {
                id: 4,
                product_id: 6,
                product_name: 'Sunscreen Anessa',
                product_image: 'https://princesscosmeticsqa.com/cdn/shop/files/shiseido-anessa-perfect-uv-sunscreen-skincare-milk-spf50-pa-60ml-shysydo-anysa-hlyb-alaanay-balbshr-aloaky-mn-alshms-balashaa-fok-albnfsjy-spf50-pa-60-ml-473043.jpg?v=1738160101&width=1946',
                quantity: 1,
                price: 39.99,
                category: 'sunscreen'
              },
              {
                id: 5,
                product_id: 2,
                product_name: 'Hydrating Moisturizer',
                product_image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=300&h=300',
                quantity: 1,
                price: 35.99,
                category: 'moisturizer'
              }
            ],
            shipping_address: '123 Main St, Hat Yai, Songkhla 90110',
            payment_method: 'Credit Card'
          },
          {
            id: 4,
            order_number: 'ORD-2024-004',
            date: '2024-01-28',
            status: 'pending',
            total: 49.98,
            items: [
              {
                id: 6,
                product_id: 5,
                product_name: 'Skinoren',
                product_image: 'https://www.binsina.ae/media/catalog/product/1/2/12300_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=600&width=600&canvas=600:600',
                quantity: 1,
                price: 29.99,
                category: 'medicine'
              },
              {
                id: 7,
                product_id: 7,
                product_name: 'Ordinary Niacinamide',
                product_image: 'https://n.nordstrommedia.com/it/032c0fca-afb7-44a2-9a72-732cefc78538.jpeg?h=368&w=240&dpr=2',
                quantity: 1,
                price: 19.99,
                category: 'serum'
              }
            ],
            shipping_address: '123 Main St, Hat Yai, Songkhla 90110',
            payment_method: 'Bank Transfer'
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '⏳';
      case 'pending':
        return '📋';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleReorder = (order: Order) => {
    console.log('Reordering:', order.id);
    // Add your reorder logic here
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.3s' }}></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading Your Orders...
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <span className="text-2xl">📦</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Track and manage your skincare purchases
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 capitalize ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200 hover:border-slate-300'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                  {orders.filter(order => order.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-3xl font-bold text-slate-600 mb-4">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-slate-500 text-lg mb-8">
              {filterStatus === 'all' 
                ? 'Start shopping to see your orders here!' 
                : `You don't have any ${filterStatus} orders.`}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 px-6 py-4 border-b border-slate-200/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getStatusIcon(order.status)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-slate-500">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1">
                            {item.product_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="capitalize">{item.category}</span>
                            <span>Qty: {item.quantity}</span>
                            <span className="font-semibold text-slate-700">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleViewProduct(item.product_id)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          View Product
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200/50">
                    <div className="text-sm text-slate-600">
                      <div><span className="font-medium">Shipping:</span> {order.shipping_address}</div>
                      <div><span className="font-medium">Payment:</span> {order.payment_method}</div>
                    </div>
                    
                    <div className="flex space-x-3">
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Reorder
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-3">Order Timeline</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-slate-600">Order placed - {order.date}</span>
                            </div>
                            {order.status !== 'pending' && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-slate-600">Order confirmed</span>
                              </div>
                            )}
                            {['processing', 'shipped', 'delivered'].includes(order.status) && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-slate-600">Processing</span>
                              </div>
                            )}
                            {['shipped', 'delivered'].includes(order.status) && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-slate-600">Shipped</span>
                              </div>
                            )}
                            {order.status === 'delivered' && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-slate-600">Delivered</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-3">Order Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Subtotal:</span>
                              <span className="font-medium">${(order.total * 0.9).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Shipping:</span>
                              <span className="font-medium">Free</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Tax:</span>
                              <span className="font-medium">${(order.total * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}