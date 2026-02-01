'use client';

import { Suspense } from 'react';
import OrdersContent from './orders-content';

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
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
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
