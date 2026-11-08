import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // 🔥 Supabase Import

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    // 🔥 Database mein Email save karo
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email }]);

    if (error) {
      setStatus('error');
      // Agar email pehle se hai toh specific message dikhao
      if (error.code === '23505') {
        setMessage('You are already subscribed to our newsletter!');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } else {
      setStatus('success');
      setMessage('Welcome to the inner circle. Your email has been subscribed!');
      setEmail(''); // Input field clear kar do
    }
  };

  return (
    <section className="py-24 bg-ivory">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="eyebrow-text mb-4">Join the Inner Circle</p>
          <h2 className="font-heading text-4xl md:text-5xl text-obsidian mb-6">
            Be the first to <span className="italic text-bronze">know</span>
          </h2>
          <p className="text-obsidian/60 mb-10 max-w-md mx-auto">
            Early access to new collections, private sales, and stories from
            the atelier — delivered monthly.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex border-b border-obsidian/30 focus-within:border-bronze transition-colors relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 bg-transparent py-4 text-obsidian placeholder:text-obsidian/40 outline-none text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-obsidian hover:text-bronze transition-colors pl-4 disabled:opacity-50 disabled:hover:text-obsidian"
              >
                {status === 'loading' ? (
                  <>Processing <Loader2 size={14} className="animate-spin" /></>
                ) : status === 'success' ? (
                  <>Subscribed <CheckCircle2 size={14} className="text-green-600" /></>
                ) : (
                  <>Subscribe <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </form>

          {/* 🔥 Success / Error Message */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 flex items-center justify-center gap-2 text-sm ${
                  status === 'success' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-obsidian/40 mt-6">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}