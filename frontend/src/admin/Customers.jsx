import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Search, Eye, ShoppingBag, DollarSign, Ban, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

        const customersWithStats = await Promise.all(
          (profilesData || []).map(async (profile) => {
            const { data: ordersData } = await supabase.from('orders').select('total_amount').eq('user_id', profile.id);
            const totalOrders = ordersData?.length || 0;
            const totalSpent = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
            return { ...profile, totalOrders, totalSpent };
          })
        );
        setCustomers(customersWithStats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    (c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Community</p>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Customers</h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs text-gray-500">Total Users:</span>
          <span className="font-bold text-[#111110] ml-2">{customers.length}</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#F5F1E9] pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] shadow-sm" />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No customers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`backdrop-blur-md border p-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group ${customer.is_banned ? 'bg-red-50/50 border-red-200' : 'bg-white/50 border-white/60'}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A18A70]/10 rounded-full blur-[40px]" />

              <div className="absolute top-4 right-4 flex flex-col gap-1 items-end z-10">
                {customer.is_admin && <span className="text-[9px] bg-[#111110] text-white px-2 py-1 rounded-full uppercase font-bold tracking-wider">Admin</span>}
                {customer.is_banned && <span className="text-[9px] bg-red-500 text-white px-2 py-1 rounded-full uppercase font-bold tracking-wider">Banned</span>}
              </div>

              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-heading text-xl md:text-2xl shadow-md shrink-0 ${customer.is_banned ? 'bg-gray-400' : 'bg-gradient-to-br from-[#A18A70] to-[#D8CBB8]'}`}>
                  {(customer.full_name || customer.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-base md:text-lg text-[#111110] truncate capitalize">{customer.full_name || 'Anonymous'}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 truncate flex items-center gap-1 mt-1"><Mail size={12} /> {customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 md:pt-4 border-t border-white/50 relative z-10 mb-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><ShoppingBag size={10} /> Orders</p>
                  <p className="font-heading text-base md:text-lg text-[#111110]">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign size={10} /> Spent</p>
                  <p className="font-heading text-base md:text-lg text-[#111110]">${customer.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <Link 
                to={`/admin/customers/${customer.id}`}
                className="w-full py-2.5 bg-[#111110] text-white text-[10px] uppercase font-bold tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-[#A18A70] transition-colors relative z-10"
              >
                <Eye size={14} /> View Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}