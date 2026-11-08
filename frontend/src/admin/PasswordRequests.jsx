import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Key, CheckCircle, Clock, Phone, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PasswordRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
      // Backend API call (agar aap backend chala rahe hain toh ye zaroori hai)
      const response = await fetch('http://localhost:5000/api/admin/reset-password-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update password');

      // Request update karo
      await supabase
        .from('password_requests')
        .update({ status: 'approved', new_password: newPassword })
        .eq('id', requestId);

      // WhatsApp link banayein
      const whatsappMsg = `Hello! Your ZORROXO password has been reset. Your new password is: ${newPassword}. Please login and change it.`;
      const cleanPhone = phone.replace(/\D/g, ''); 
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;
      
      window.open(whatsappUrl, '_blank');

      showToast(`Password updated! WhatsApp opened for ${email}`);
      setNewPassword('');
      fetchRequests();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-8 relative">
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium w-[90%] max-w-md text-center justify-center ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {toast.message}
        </div>
      )}

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
              
              {/* User Info */}
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

              {/* Action Area (Mobile par stack, Desktop par side-by-side) */}
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
    </div>
  );
}