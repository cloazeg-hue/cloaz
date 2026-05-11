import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrdersDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full font-sans">
      <header>
        <h2 className="text-3xl font-black uppercase tracking-widest text-[#0069A8]">Orders Manager</h2>
        <p className="text-gray-500 text-sm mt-2 font-mono uppercase">Track and fulfill customer orders</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px] shadow-sm"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-2">No Active Orders</h3>
        <p className="text-gray-500 max-w-sm mb-8 text-sm">Once you connect your storefront checkout to Firestore 'orders' collection, they will appear here.</p>
        <button className="bg-[#0069A8] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-[#00558a] transition-colors">
          Create Manual Order
        </button>
      </motion.div>
    </div>
  );
}
