import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, DollarSign, Ban, CheckCircle, Loader2, ShieldCheck, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 🔥 Custom Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
        setCustomer(profile);

        const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', id).order('created_at', { ascending: false });
        setOrders(ordersData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleToggleBan = async () => {
    if (customer.is_admin) {
      showToast("You cannot ban an admin.", "error");
      return;
    }
    setIsBanning(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !customer.is_banned })
      .eq('id', customer.id);

    if (!error) {
      setCustomer({ ...customer, is_banned: !customer.is_banned });
      showToast(customer.is_banned ? 'User Unbanned' : 'User Banned Successfully');
    } else {
      showToast(error.message, 'error');
    }
    
    setIsBanning(false);
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    
    const { error } = await supabase.from('profiles').delete().eq('id', customer.id);
    
    if (error) {
      showToast(error.message, 'error');
      setIsDeleting(false);
    } else {
      showToast("User deleted successfully!");
      setTimeout(() => navigate('/admin/customers'), 1500);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;
  if (!customer) return <div className="text-center py-20">Customer not found.</div>;

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto relative">
      
      {/* 🔥 CUSTOM TOAST */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/admin/customers" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#111110] transition-colors">
        <ArrowLeft size={16} /> Back to Customers
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F1E9] overflow-hidden">
        <div className={`h-24 md:h-32 w-full ${customer.is_banned ? 'bg-gradient-to-r from-red-900 to-red-700' : 'bg-gradient-to-r from-[#111110] to-[#33332F]'}`} />
        
        <div className="px-5 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-10 md:-mt-12 relative z-10">
          <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-heading text-4xl md:text-5xl border-4 border-white shadow-lg shrink-0 ${customer.is_banned ? 'bg-gray-400' : 'bg-[#A18A70]'}`}>
            {(customer.full_name || customer.email || 'U')[0].toUpperCase()}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-1 flex-wrap">
              <h1 className="font-heading text-2xl md:text-3xl text-[#111110] capitalize">{customer.full_name || 'Anonymous User'}</h1>
              {customer.is_admin && <span className="text-[9px] bg-[#111110] text-white px-2 py-1 rounded-full uppercase font-bold tracking-wider">Admin</span>}
              {customer.is_banned && <span className="text-[9px] bg-red-500 text-white px-2 py-1 rounded-full uppercase font-bold tracking-wider">Banned</span>}
            </div>
            <p className="text-xs md:text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} /> {customer.email}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            {!customer.is_admin && (
              <button onClick={handleToggleBan} disabled={isBanning} className={`w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${customer.is_banned ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100' : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'}`}>
                {isBanning ? <Loader2 className="animate-spin" size={16} /> : (customer.is_banned ? <><CheckCircle size={16} /> Unban</> : <><Ban size={16} /> Ban User</>)}
              </button>
            )}
            <button onClick={() => setShowDeleteModal(true)} className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
              <Trash2 size={16} /> Delete User
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-[#F5F1E9]">
          <h3 className="font-heading text-lg md:text-xl text-[#111110] mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-[#A18A70]" /> Contact Info</h3>
          <div className="space-y-3 text-xs md:text-sm">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-[#111110] font-medium flex items-center gap-2"><Phone size={14} className="text-[#A18A70]"/> {customer.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Joined On</p>
              <p className="text-[#111110] font-medium flex items-center gap-2"><Calendar size={14} className="text-[#A18A70]"/> {new Date(customer.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-[#F5F1E9] flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F5F1E9] flex items-center justify-center text-[#A18A70] mb-3 md:mb-4"><ShoppingBag size={20} /></div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
          <p className="font-heading text-3xl md:text-4xl text-[#111110]">{orders.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-[#F5F1E9] flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F5F1E9] flex items-center justify-center text-[#A18A70] mb-3 md:mb-4"><DollarSign size={20} /></div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Lifetime Value</p>
          <p className="font-heading text-3xl md:text-4xl text-[#111110]">${totalSpent.toFixed(2)}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-[#F5F1E9] overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#F5F1E9]"><h3 className="font-heading text-lg md:text-xl text-[#111110]">Order History</h3></div>
        {orders.length === 0 ? (
          <div className="p-8 md:p-10 text-center text-gray-500 text-sm">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#F5F1E9]/50 text-[10px] uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="p-3 md:p-4 font-bold">Order ID</th>
                  <th className="p-3 md:p-4 font-bold">Date</th>
                  <th className="p-3 md:p-4 font-bold">Amount</th>
                  <th className="p-3 md:p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F1E9]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-3 md:p-4 font-bold text-[#111110]">#ZX-{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="p-3 md:p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-3 md:p-4 font-bold text-[#111110]">${order.total_amount}</td>
                    <td className="p-3 md:p-4"><span className="text-[9px] md:text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 🔥 CUSTOM DELETE MODAL (Bina Localhost Popup Ke) */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h2 className="font-heading text-xl md:text-2xl text-[#111110] mb-2">Delete User?</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8">
                This will permanently delete <strong>{customer.email}</strong> from the database. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-gray-300 text-gray-600 text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleDeleteUser} disabled={isDeleting} className="flex-1 py-3 bg-red-500 text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-red-600 transition-all flex items-center justify-center">
                  {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}