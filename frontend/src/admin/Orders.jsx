import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (s === 'processing') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (s === 'shipped') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (s === 'delivered') return 'bg-green-100 text-green-800 border-green-200';
  if (s === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const { formatPrice } = useCurrency();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    
    // 🔥 Data fetch query
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      showToast('Failed to load orders.', 'error');
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      showToast(`Error: ${error.message}`, 'error');
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
    }
    setUpdating(null);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium w-[90%] max-w-md justify-center ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Management</p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage customer orders and delivery status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F5F1E9] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-[#F5F1E9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-[#A18A70]" />
          </div>
          <h3 className="font-heading text-2xl text-[#111110] mb-2">No Orders Yet</h3>
          <p className="text-sm text-gray-500">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F1E9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[1000px]">
              <thead className="bg-[#F5F1E9]/50 border-b border-[#F5F1E9] text-[10px] uppercase tracking-[0.15em] text-gray-500">
                <tr>
                  <th className="p-5 font-bold">Order ID</th>
                  <th className="p-5 font-bold">Customer</th>
                  <th className="p-5 font-bold">Phone</th> {/* 🔥 Naya Column */}
                  <th className="p-5 font-bold">Products</th>
                  <th className="p-5 font-bold">Total</th>
                  <th className="p-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F1E9]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F1E9]/30 transition-colors group">
                    
                    {/* Order ID & Date */}
                    <td className="p-5 align-top">
                      <p className="font-bold text-[#111110]">#ZX-{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>

                    {/* Customer Name (Sirf Naam) */}
                    <td className="p-5 align-top">
                      <p className="font-medium text-[#111110] capitalize">{order.customer_name || 'Guest'}</p>
                      <p className="text-[9px] uppercase tracking-wider text-[#A18A70] mt-1 font-bold">{order.payment_method || 'COD'}</p>
                    </td>

                    {/* 🔥 Phone Number (Alag Column) */}
                    <td className="p-5 align-top">
                      <p className="text-xs text-gray-600">{order.customer_phone || 'No phone'}</p>
                    </td>

                    {/* Products List */}
                    <td className="p-5 align-top">
                      <div className="space-y-1">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <span className="text-xs font-medium text-[#111110]">• {item.product_name || 'Product'}</span>
                            <span className="text-[10px] text-gray-500">(x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="p-5 align-top">
                      <p className="font-bold text-[#111110]">{formatPrice(order.total_amount)}</p>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-5 align-top">
                      <div className="relative inline-block">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)} 
                          disabled={updating === order.id} 
                          className={`appearance-none border text-[10px] font-bold uppercase tracking-wider py-2 pl-3 pr-8 rounded-lg focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        {updating === order.id && (
                          <Loader2 size={14} className="animate-spin absolute -right-6 top-1/2 -translate-y-1/2 text-[#A18A70]" />
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}