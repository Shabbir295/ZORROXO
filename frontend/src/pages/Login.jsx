import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Login karo
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // 2. Check karo ke user banned hai ya nahi
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', data.user.id)
      .single();

    if (profile?.is_banned) {
      await supabase.auth.signOut();
      setError('You have been banned by the Admin. Please contact support.');
      setLoading(false);
      return;
    }

    // 3. Account page par bhejo
    navigate('/account');
  };

  return (
    <div className="min-h-screen flex bg-[#F5F1E9]">
      
      {/* LEFT SIDE: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop" alt="Luxury Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-obsidian/30" />
        </motion.div>
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <Link to="/" className="font-heading text-2xl text-white tracking-[0.25em]">ZORROXO</Link>
          <div>
            <h2 className="font-heading text-6xl text-white mb-6 leading-tight">The Art of <br /> <span className="italic text-[#D8CBB8]">Elevated</span> Living.</h2>
            <p className="text-white/80 text-sm max-w-sm tracking-wide">Sign in to access your personal atelier.</p>
          </div>
          <p className="text-[10px] text-white/50 tracking-widest uppercase">© {new Date().getFullYear()} ZORROXO</p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8CBB8]/30 rounded-full blur-[100px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 bg-white/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-8 lg:p-0 rounded-3xl lg:rounded-none border border-white/50 lg:border-none shadow-xl lg:shadow-none">
          <Link to="/" className="block lg:hidden font-heading text-2xl text-obsidian tracking-[0.25em] mb-10 text-center">ZORROXO</Link>

          <div className="mb-10 text-center lg:text-left">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#A18A70] font-bold mb-3">Welcome Back</p>
            <h1 className="font-heading text-4xl md:text-5xl text-obsidian mb-4">Sign <span className="italic text-[#A18A70]">In</span></h1>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 mb-6 text-sm rounded flex items-center gap-2 border ${error.includes('banned') ? 'bg-red-100 border-red-300 text-red-700 font-bold' : 'bg-red-50 border-red-200 text-red-600'}`}>
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-[#A18A70] transition-colors text-sm" placeholder="your@email.com" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold block">
                  Password
                </label>
                {/* 🔥 FORGOT PASSWORD BUTTON WAPAS LAGA DIYA */}
                <Link to="/forgot-password" className="text-[10px] text-[#A18A70] hover:text-obsidian transition-colors font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 pr-10 text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-[#A18A70] transition-colors text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-obsidian/40 hover:text-obsidian transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="group relative w-full bg-obsidian text-ivory py-4 mt-4 text-xs tracking-[0.2em] uppercase font-semibold overflow-hidden flex items-center justify-center">
              <span className="relative z-10 flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'} 
                {!loading && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <div className="absolute inset-0 bg-[#A18A70] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </button>
          </form>

          <p className="text-center text-sm text-obsidian/60 mt-10">
            Don't have an account? <Link to="/signup" className="text-obsidian border-b border-obsidian pb-0.5 hover:text-[#A18A70] transition-colors font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}