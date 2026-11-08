import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Email, 2 = Phone Form, 3 = Success
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('+92');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 STEP 1: Email Check (Dummy Login Trick Se)
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 🔥 TRICK: Ek fake password se login try karo
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: 'dummyPassword123!@#', // Jaan bujh kar galat password
      });

      // Agar error "Invalid login credentials" hai, matlab email EXIST karti hai (bas password galat hai)
      if (authError && authError.message.includes('Invalid login credentials')) {
        // Email registered hai, aage badho
        setEmail(cleanEmail);
        setStep(2);
      } 
      // Agar error "Email not confirmed" hai, matlab email exist karti hai
      else if (authError && authError.message.includes('Email not confirmed')) {
        setEmail(cleanEmail);
        setStep(2);
      }
      // Agar error "User not found" ya "Invalid" ke ilawa kuch aur hai, matlab email registered nahi
      else {
        throw new Error('This email is not registered with us.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 2: Phone Number Ke Saath Request Bhejo
  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from('password_requests')
        .select('id')
        .eq('email', email)
        .eq('status', 'pending');

      if (existing && existing.length > 0) {
        throw new Error('You already have a pending request. Please wait for Admin to respond.');
      }

      const { error: reqError } = await supabase
        .from('password_requests')
        .insert([{ 
          email: email, 
          phone_number: `${country} ${phone}`, 
          status: 'pending' 
        }]);

      if (reqError) throw reqError;

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8CBB8]/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/40 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/50 shadow-xl relative z-10">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-obsidian/60 hover:text-obsidian transition-colors mb-8 uppercase tracking-widest font-bold">
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={28} className="text-[#A18A70]" />
          </div>
          <h1 className="font-heading text-3xl text-obsidian mb-2">Forgot Password?</h1>
          <p className="text-obsidian/60 text-sm">
            {step === 1 ? 'Verify your registered email.' : step === 2 ? 'Enter your WhatsApp number.' : 'Request sent!'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </motion.div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Registered Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-[#A18A70] text-sm" placeholder="your@email.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-obsidian text-ivory py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A18A70] transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Email'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSendRequest} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Country</label>
              <select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian focus:outline-none focus:border-[#A18A70] text-sm">
                <option value="+92">Pakistan (+92)</option>
                <option value="+91">India (+91)</option>
                <option value="+1">USA/Canada (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+971">UAE (+971)</option>
                <option value="+966">Saudi Arabia (+966)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">WhatsApp Number</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-[#A18A70] text-sm" placeholder="3001234567" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-obsidian text-ivory py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A18A70] transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Send Request to Admin'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="font-heading text-2xl text-obsidian mb-2">Request Sent!</h3>
            <p className="text-sm text-obsidian/60 mb-6">
              Admin will reset your password and send it to your WhatsApp number ({country} {phone}).
            </p>
            <Link to="/login" className="btn-primary inline-block w-full">Back to Login</Link>
          </div>
        )}

      </motion.div>
    </div>
  );
}