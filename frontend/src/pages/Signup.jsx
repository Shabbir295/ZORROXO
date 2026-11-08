import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🔥 Signup karo
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // 🔥 Agar user ban gaya, toh use turant login karo (bina email verification ke)
    if (data.user) {
      // Login karo
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/account');
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F1E9]">
      
      {/* LEFT SIDE: Image (Sirf PC par) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" alt="Luxury" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-obsidian/30" />
        </motion.div>
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <Link to="/" className="font-heading text-2xl text-white tracking-[0.25em]">ZORROXO</Link>
          <div>
            <h2 className="font-heading text-6xl text-white mb-6 leading-tight">Join the <br /> <span className="italic text-[#D8CBB8]">Inner Circle.</span></h2>
            <p className="text-white/80 text-sm max-w-sm">Create an account to get early access to collections and a tailored luxury experience.</p>
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
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#A18A70] font-bold mb-3">Join Us</p>
            <h1 className="font-heading text-4xl md:text-5xl text-obsidian mb-4">Create <span className="italic text-[#A18A70]">Account</span></h1>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 text-sm rounded flex items-center gap-2">
                <CheckCircle2 size={18} /> Account created! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 p-3 mb-6 text-sm rounded">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian focus:outline-none focus:border-[#A18A70] text-sm" placeholder="Your Name" />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 text-obsidian focus:outline-none focus:border-[#A18A70] text-sm" placeholder="your@email.com" />
            </div>
            
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-obsidian font-bold mb-2 block">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-[#D8CBB8] py-3 pr-10 text-obsidian focus:outline-none focus:border-[#A18A70] text-sm" placeholder="Minimum 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-obsidian/40 hover:text-obsidian">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || success} className="group relative w-full bg-obsidian text-ivory py-4 mt-4 text-xs tracking-[0.2em] uppercase font-semibold overflow-hidden flex items-center justify-center">
              <span className="relative z-10 flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Create Account'} 
                {!loading && !success && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <div className="absolute inset-0 bg-[#A18A70] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </button>
          </form>

          <p className="text-center text-sm text-obsidian/60 mt-10">
            Already have an account? <Link to="/login" className="text-obsidian border-b border-obsidian pb-0.5 hover:text-[#A18A70] transition-colors font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}