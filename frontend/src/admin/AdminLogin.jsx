import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const MASTER_ADMIN_EMAIL = 'fayyazriaz2245@gmail.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Check karo ke email master admin ki hai ya nahi
    if (email.trim().toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      setError('Access Denied. You are not authorized.');
      return;
    }

    setLoading(true);

    // Supabase se login
    const { error: loginError } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password 
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // Login successful, ab AdminRoute check karega ke is_admin true hai ya nahi
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1A1A18] border border-white/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A18A70]/10 rounded-full blur-[80px]" />

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-[#A18A70]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#A18A70]/20">
            <Lock size={28} className="text-[#A18A70]" />
          </div>
          <h1 className="font-heading text-3xl text-white mb-2">Admin Access</h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Restricted Area</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2 block">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-xl text-white text-sm focus:outline-none focus:border-[#A18A70] transition-all" 
                placeholder="admin@zorroxo.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-xl text-white text-sm focus:outline-none focus:border-[#A18A70] transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#A18A70] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Sign In <ArrowRight size={14} /></>}
          </button>
        </form>

        <p className="text-center text-[10px] text-white/30 mt-8 relative z-10">
          This is a secure admin portal. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}