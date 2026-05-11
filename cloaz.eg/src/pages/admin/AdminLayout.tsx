import React from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLogin from './AdminLogin';
import ProductsDashboard from './ProductsDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import OrdersDashboard from './OrdersDashboard';
import { Package, LayoutDashboard, LogOut, ShoppingCart, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
         <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0069A8] rounded-full animate-spin" />
         </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  const navLinks = [
    { name: 'Analytics', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row text-gray-800 font-sans selection:bg-[#0069A8] selection:text-white">
       {/* Sidebar (Desktop) / Top Nav (Mobile) */}
       <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col z-40 relative md:sticky top-0 md:h-screen shrink-0 shadow-sm">
          <div className="p-6 md:p-8 flex justify-between items-center md:block">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0069A8] rounded-lg flex items-center justify-center">
                <span className="font-black text-sm text-white">C</span>
              </div>
              <h1 className="text-xl font-black uppercase tracking-widest text-gray-900">
                Admin
              </h1>
            </div>
            {/* Mobile Nav Trigger could go here in future */}
          </div>

          <nav className="flex-1 px-4 md:px-6 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar py-2 md:py-0">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative shrink-0
                    ${active ? 'text-[#0069A8]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  {active && (
                    <motion.div 
                      layoutId="admin-active-nav"
                      className="absolute inset-0 bg-[#0069A8]/10 border border-[#0069A8]/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-bold text-xs uppercase tracking-widest relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 md:p-6 mt-auto hidden md:block">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
       </aside>

       {/* Main Content Area */}
       <main className="flex-1 overflow-x-hidden min-h-screen relative pb-20 md:pb-0">
          <Routes>
            <Route index element={<AnalyticsDashboard />} />
            <Route path="products" element={<ProductsDashboard />} />
            <Route path="orders" element={<OrdersDashboard />} />
          </Routes>
       </main>
       
       {/* Mobile Logout Button (Fixed bottom right or inside top nav) */}
       <button 
          onClick={logout}
          className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-white shadow-lg border border-gray-200 rounded-full flex items-center justify-center z-50 text-gray-500 hover:text-red-600"
       >
         <LogOut className="w-5 h-5" />
       </button>
    </div>
  );
}
