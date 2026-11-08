import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2, X, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import html2pdf from 'html2pdf.js';

// 🔥 Status Colors (Har case handle kiya hai)
const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (s === 'processing') return 'bg-blue-100 text-blue-800';
  if (s === 'shipped') return 'bg-purple-100 text-purple-800';
  if (s === 'delivered' || s === 'success' || s === 'completed') return 'bg-green-100 text-green-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800'; // Default
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            product_id,
            products (id, name, image_url, category)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setOrders(data);
      
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  const handleDownloadReceipt = () => {
    const element = document.getElementById('receipt-modal-content');
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: `ZORROXO-Receipt-${selectedOrder.id.split('-')[0].toUpperCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-bronze" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20 w-full overflow-x-hidden relative">
      <div className="container-luxury max-w-4xl px-4 sm:px-6">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <p className="eyebrow-text mb-3">Your Account</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-obsidian">Order History</h1>
        </motion.div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="border border-champagne p-5 sm:p-8 bg-white/40">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-champagne">
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-1 font-bold">
                      Order #ZX-{order.id.split('-')[0].toUpperCase()}
                    </p>
                    <p className="text-xs text-obsidian/60">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* 🔥 Status Badge with Fixed Colors */}
                    <span className={`text-[10px] tracking-editorial uppercase px-3 py-1 font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-heading text-lg">${order.total_amount}</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-4">
                  {order.order_items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img src={item.products?.image_url} alt={item.products?.name} className="w-16 h-20 object-cover bg-champagne/30 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm sm:text-base text-obsidian truncate">{item.products?.name || 'Product Deleted'}</p>
                        <p className="text-[10px] tracking-editorial uppercase text-bronze mt-1">{item.products?.category}</p>
                        <p className="text-xs sm:text-sm mt-1 text-obsidian/70">Qty: {item.quantity} x ${item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.order_items.length > 2 && (
                    <p className="text-xs text-obsidian/50 italic">+ {order.order_items.length - 2} more items</p>
                  )}
                </div>

                {/* View Receipt Button */}
                <div className="mt-6 pt-4 border-t border-champagne flex justify-end">
                  <button 
                    onClick={() => setSelectedOrder(order)} 
                    className="text-xs tracking-[0.2em] uppercase text-bronze hover:text-obsidian transition-colors flex items-center gap-2 font-bold"
                  >
                    View Receipt <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 border border-champagne">
            <Package size={64} className="mx-auto text-bronze mb-6" strokeWidth={1} />
            <h2 className="font-heading text-3xl text-obsidian mb-4">No Orders Yet</h2>
            <Link to="/shop" className="btn-primary inline-block mt-4">Start Shopping</Link>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white p-8 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-obsidian">
                <X size={24} />
              </button>

              <div id="receipt-modal-content" className="bg-white">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-3xl tracking-[0.25em] text-[#22221F] mb-2">ZORROXO</h2>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold">Order Receipt</p>
                </div>

                <div className="border-t border-dashed border-gray-300 py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Order No.</span>
                    <span className="font-bold text-sm text-[#22221F]">#ZX-{selectedOrder.id.split('-')[0].toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Date</span>
                    <span className="text-sm text-[#22221F]">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Payment</span>
                    <span className="text-sm uppercase font-semibold text-[#22221F]">{selectedOrder.payment_method}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 py-6 space-y-4">
                  {selectedOrder.order_items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-[#22221F] font-medium">{item.products?.name || 'Product Deleted'}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm text-[#22221F]">${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-300 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Total Amount</span>
                    <span className="font-heading text-2xl text-[#22221F]">${selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDownloadReceipt} 
                className="w-full bg-[#22221F] text-white py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A18A70] transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download PDF
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}