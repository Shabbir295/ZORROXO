import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Key, CheckCircle, Clock, Phone, Send, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PasswordRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ email: '', phone: '', password: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('password_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (requestId, email, phone) => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setApprovingId(requestId);

    try {
      // 1. Backend API ko call karo (Password Supabase Auth mein update hoga)
      const response = await fetch('https://zorroxo-api.vercel.app/api/admin/reset-password-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update password');

      // 2. Database mein request ko "approved" mark karo
      await supabase
        .from('password_requests')
        .update({ status: 'approved', new_password: newPassword })
        .eq('id', requestId);

      // 3. Success popup show karo
      setSuccessData({ email, phone, password: newPassword });
      setShowSuccessModal(true);
      setNewPassword('');
      fetchRequests();

    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const openWhatsApp = () => {
    const whatsappMsg = `Hello! Your ZORROXO password has been reset. Your new password is: ${successData.password}. Please login and change it.`;
    const cleanPhone = successData.phone.replace(/\D/g, ''); 
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;
    
    window.open(whatsappUrl, '_blank');
    setShowSuccessModal(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-8 relative">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium w-[90%] max-w-md justify-center ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Security</p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Password Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Approve requests and send passwords via WhatsApp.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#F5F1E9]">
          <Key size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-heading text-2xl text-[#111110]">No Requests</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div key={req.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#F5F1E9] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${req.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {req.status === 'approved' ? <CheckCircle size={24} /> : <Clock size={24} />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#111110] truncate">{req.email}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Phone size={12} /> {req.phone_number || 'No phone'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{new Date(req.created_at).toLocaleString()}</p>
                </div>
              </div>

              {req.status === 'pending' ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <input 
                    type="text" 
                    placeholder="Enter new password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full sm:w-56 bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#A18A70]"
                  />
                  <button 
                    onClick={() => handleApprove(req.id, req.email, req.phone_number)}
                    disabled={approvingId === req.id}
                    className="w-full sm:w-auto bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {approvingId === req.id ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Send via WhatsApp</>}
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg w-full sm:w-auto text-center">
                  Approved
                </span>
              )}

            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-heading text-2xl text-[#111110] mb-2">Password Updated!</h2>
              <p className="text-sm text-gray-500 mb-6">
                The new password for <strong>{successData.email}</strong> has been successfully set. 
                Now click below to send it via WhatsApp.
              </p>
              
              <div className="flex flex-col gap-3">
                <button onClick={openWhatsApp} className="w-full py-3.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2">
                  <Send size={16} /> Open WhatsApp
                </button>
                <button onClick={() => setShowSuccessModal(false)} className="w-full py-3.5 border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}