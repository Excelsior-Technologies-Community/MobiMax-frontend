import React from 'react';
import { ShoppingBag } from 'lucide-react';

const PartnerOrders = () => {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Order Management</h2>
        <p className="text-sm text-gray-500 mt-1">Accept, prepare, and dispatch incoming orders.</p>
      </div>
      <div className="p-8">
        <div className="flex flex-col items-center justify-center text-gray-400 py-16">
          <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
          <p className="text-lg font-bold text-gray-900 mb-2">No active orders</p>
          <p className="text-sm max-w-md text-center">You're all caught up! When customers place orders, they will appear here for you to accept and prepare.</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerOrders;
