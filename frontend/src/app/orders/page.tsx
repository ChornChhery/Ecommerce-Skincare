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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-gray-700">
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage your skincare purchases
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
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
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {filterStatus === 'all' 
                ? 'Start shopping to see your orders here!' 
                : `You don't have any ${filterStatus} orders.`}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getStatusIcon(order.status)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-gray-500">
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
                        <div className="text-2xl font-bold text-blue-600">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
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
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {item.product_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize">{item.category}</span>
                            <span>Qty: {item.quantity}</span>
                            <span className="font-semibold text-gray-700">
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <div><span className="font-medium">Shipping:</span> {order.shipping_address}</div>
                      <div><span className="font-medium">Payment:</span> {order.payment_method}</div>
                    </div>
                    
                    <div className="flex space-x-3">
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Reorder
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Order Timeline</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600">Order placed - {order.date}</span>
                            </div>
                            {order.status !== 'pending' && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Order confirmed</span>
                              </div>
                            )}
                            {['processing', 'shipped', 'delivered'].includes(order.status) && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-gray-600">Processing</span>
                              </div>
                            )}
                            {['shipped', 'delivered'].includes(order.status) && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-600">Shipped</span>
                              </div>
                            )}
                            {order.status === 'delivered' && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-gray-600">Delivered</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Order Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">${(order.total * 0.9).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="font-medium">Free</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span className="font-medium">${(order.total * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
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