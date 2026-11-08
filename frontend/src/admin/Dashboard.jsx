import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Users, Activity, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCurrency, currencies } from '../context/CurrencyContext'; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { currency, setCurrency, formatPrice } = useCurrency(); 

  useEffect(() => {
    async function fetchStats() {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      const { data: allOrders } = await supabase.from('orders').select('total_amount');
      
      setStats({
        revenue: allOrders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0,
        orders: ordersRes.data?.length || 0,
        products: productsRes.count || 0,
        customers: customersRes.count || 0,
      });

      if (ordersRes.data) setRecentOrders(ordersRes.data);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Products', value: stats.products, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Customers', value: stats.customers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">ZORROXO Dashboard</p>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Store Overview</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm w-full md:w-auto justify-center">
            Add New Product <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-[#F5F1E9]">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                <card.icon size={20} />
              </div>
              <Activity size={20} className="text-gray-300" />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{card.title}</p>
            <p className="font-heading text-2xl md:text-3xl text-[#111110]">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#F5F1E9] p-5 md:p-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="font-heading text-xl md:text-2xl text-[#111110]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[10px] md:text-xs text-[#A18A70] font-bold tracking-widest uppercase hover:text-[#111110] transition-colors">View All</Link>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No orders yet.</p>
            ) : (
              recentOrders.map((order, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-[#F5F1E9]/30 rounded-xl hover:bg-[#F5F1E9]/60 transition-colors gap-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <ShoppingBag size={14} className="text-[#A18A70]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-[#111110]">#ZX-{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-[9px] md:text-[10px] uppercase px-2 md:px-3 py-1 rounded-full font-bold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {order.status}
                    </span>
                    <p className="text-xs md:text-sm font-bold text-[#111110]">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#111110] rounded-2xl shadow-xl p-5 md:p-8 flex flex-col text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A18A70]/20 rounded-full blur-[80px]" />
          <div className="relative z-10 flex-1">
            <h2 className="font-heading text-xl md:text-2xl mb-2 flex items-center gap-2"><Globe size={20} className="text-[#A18A70]"/> Store Currency</h2>
            <p className="text-[10px] md:text-xs text-white/50 mb-6">Change the display currency for your entire store.</p>
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-xl p-3 md:p-4 focus:outline-none focus:border-[#A18A70] cursor-pointer mb-4 appearance-none"
            >
              {Object.entries(currencies).map(([code, data]) => (
                <option key={code} value={code} className="bg-[#111110] text-white">
                  {data.symbol} {code} - {data.name}
                </option>
              ))}
            </select>
            
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 mt-6">
              <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider mb-1">Current Rate (Base: USD)</p>
              <p className="text-xs md:text-sm text-white/80">1 USD = {currencies[currency].rate} {currency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}