import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { TrendingUp, Users, Package, DollarSign, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLLECTION_NAME = 'collection id';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    lowStock: 0,
    activeOrders: 0
  });
  
  const [loading, setLoading] = useState(true);

  // Fake chart data for preview (ideally fetched from DB order history)
  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, COLLECTION_NAME), (snap) => {
      let totalStockValue = 0;
      let lowStockCount = 0;
      
      snap.forEach(doc => {
        const data = doc.data();
        if (data.stock <= 5) lowStockCount++;
        totalStockValue += (data.price || 0) * (data.stock || 1); // Mock revenue calc for now
      });

      setStats(prev => ({
        ...prev,
        totalProducts: snap.size,
        totalRevenue: totalStockValue,
        lowStock: lowStockCount,
      }));
      setLoading(false);
    });

    return () => unsubProducts();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: `LE ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'from-[#0069A8]/20 to-transparent' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, trend: '+3', color: 'from-emerald-500/20 to-transparent' },
    { title: 'Active Orders', value: '45', icon: TrendingUp, trend: '+18.2%', color: 'from-purple-500/20 to-transparent' },
    { title: 'Low Stock Alerts', value: stats.lowStock, icon: AlertCircle, trend: '-2', color: 'from-orange-500/20 to-transparent' },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-[#F8F9FA] min-h-screen">
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full font-sans text-gray-800 bg-[#F8F9FA] min-h-screen">
      <header>
        <h2 className="text-3xl font-black uppercase tracking-widest text-[#0069A8]">Analytics Overview</h2>
        <p className="text-gray-500 text-sm mt-2 font-mono uppercase">Real-time store metrics</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-50 ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {card.trend}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</h3>
                  <div className="text-2xl font-black text-gray-900">{card.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#0069A8]">Revenue Growth</h3>
            <p className="text-xs text-gray-500 font-mono mt-1">Monthly performance</p>
          </div>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none">
            <option>Last 7 Months</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0069A8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0069A8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '8px', fontSize: '12px', color: '#111827' }}
                itemStyle={{ color: '#111827', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0069A8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
