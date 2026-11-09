import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, Loader2, Check, Pencil, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Profile States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [preferences, setPreferences] = useState('');
  const [address, setAddress] = useState('');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isMasterAdmin = user?.email === 'fayyazriaz2245@gmail.com';

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      setName(user.user_metadata?.full_name || user.email.split('@')[0]);

      const { data } = await supabase
        .from('profiles')
        .select('phone, address, dob, gender, preferences')
        .eq('id', user.id)
        .single();

      if (data) {
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setDob(data.dob || '');
        setGender(data.gender || '');
        setPreferences(data.preferences || '');
      }
    }
    getProfile();
  }, [user]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await supabase.auth.updateUser({ data: { full_name: name } });

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          email: user.email, 
          full_name: name, 
          phone: phone, 
          address: address,
          dob: dob,
          gender: gender,
          preferences: preferences
        }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase Error:', error);
        alert(`Database Error: ${error.message}`);
      } else {
        setSaveSuccess(true);
        setIsEditingProfile(false);
        setIsEditingAddress(false);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-bronze" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20 w-full overflow-x-hidden">
      <div className="container-luxury px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="eyebrow-text mb-3">My Account</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-obsidian">
            Welcome, <span className="italic text-bronze capitalize">{name}</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8 w-full">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id ? 'bg-obsidian text-ivory' : 'text-obsidian hover:bg-ivory-light'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
              
              {/* ADMINISTRATOR ACCESS */}
              {isMasterAdmin && (
                <div className="mt-4 pt-4 border-t border-champagne">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#A18A70] font-bold px-4 mb-2 flex items-center gap-1">
                    <Shield size={10} /> Administrator Access
                  </p>
                  <Link 
                    to="/admin" 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-[#111110] text-white hover:bg-[#A18A70] transition-colors font-semibold rounded-md"
                  >
                    Admin Panel
                  </Link>
                </div>
              )}

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors mt-4 border-t border-champagne pt-4">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-3">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-champagne p-5 sm:p-8 bg-white/40 relative">
                {saveSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow-sm flex items-center gap-2 text-sm z-10">
                    <Check size={16} /> Profile Saved!
                  </motion.div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl sm:text-2xl text-obsidian">Personal Details</h2>
                  {!isEditingProfile && (
                    <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 text-xs uppercase tracking-widest text-bronze hover:text-obsidian transition-colors">
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-2 block">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditingProfile} className={`w-full bg-transparent border-b border-champagne py-2 text-obsidian focus:outline-none ${isEditingProfile ? 'focus:border-bronze' : 'border-transparent cursor-default'}`} />
                    </div>
                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-2 block">Email Address</label>
                      <input type="email" value={user.email} disabled className="w-full bg-transparent border-b border-transparent py-2 text-obsidian/50 cursor-not-allowed" />
                    </div>
                    
                    {/* 🔥 NAYA PASSWORD FIELD (Read-Only) */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-2 block">Password</label>
                      <input 
                        type="text" 
                        value="••••••••••••" 
                        disabled 
                        className="w-full bg-transparent border-b border-transparent py-2 text-obsidian/50 cursor-not-allowed tracking-widest" 
                      />
                      <p className="text-[9px] text-bronze mt-1 flex items-center gap-1">
                        <Shield size={10} /> For security reasons, only Admin can reset your password.
                      </p>
                    </div>

                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-2 block">Phone Number</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditingProfile} placeholder="+92 300 0000000" className={`w-full bg-transparent border-b border-champagne py-2 text-obsidian placeholder-obsidian/30 focus:outline-none ${isEditingProfile ? 'focus:border-bronze' : 'border-transparent cursor-default'}`} />
                    </div>
                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-2 block">Date of Birth</label>
                      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={!isEditingProfile} className={`w-full bg-transparent border-b border-champagne py-2 text-obsidian focus:outline-none ${isEditingProfile ? 'focus:border-bronze' : 'border-transparent cursor-default'}`} />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="pt-4 flex items-center gap-4">
                      <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => setIsEditingProfile(false)} className="text-xs uppercase tracking-widest text-obsidian/60 hover:text-obsidian">Cancel</button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-champagne p-8 text-center bg-white/40">
                <Package size={48} className="mx-auto text-bronze mb-4" strokeWidth={1} />
                <h2 className="font-heading text-2xl text-obsidian mb-3">Order History</h2>
                <p className="text-obsidian/60 mb-6 max-w-sm mx-auto">Track all your past orders, view their status, and check your purchase history.</p>
                <Link to="/orders" className="btn-primary inline-block">View All Orders</Link>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-champagne p-8 text-center bg-white/40">
                <Heart size={48} className="mx-auto text-bronze mb-4" strokeWidth={1} />
                <h2 className="font-heading text-2xl text-obsidian mb-3">Your Wishlist</h2>
                <p className="text-obsidian/60 mb-6">View all your saved items.</p>
                <Link to="/wishlist" className="btn-primary inline-block">View Wishlist</Link>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-champagne p-5 sm:p-8 bg-white/40 relative">
                {saveSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow-sm flex items-center gap-2 text-sm z-10">
                    <Check size={16} /> Address Saved!
                  </motion.div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl sm:text-2xl text-obsidian">Shipping Address</h2>
                  {!isEditingAddress && (
                    <button onClick={() => setIsEditingAddress(true)} className="flex items-center gap-2 text-xs uppercase tracking-widest text-bronze hover:text-obsidian transition-colors">
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>

                <div className="max-w-xl">
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditingAddress}
                    rows={4}
                    placeholder="Enter your full shipping address here..."
                    className={`w-full bg-transparent border border-champagne p-4 text-obsidian placeholder-obsidian/30 focus:outline-none text-sm ${isEditingAddress ? 'focus:border-bronze' : 'border-transparent cursor-default bg-transparent'}`}
                  />
                  
                  {isEditingAddress && (
                    <div className="mt-4 flex items-center gap-4">
                      <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Address'}
                      </button>
                      <button onClick={() => setIsEditingAddress(false)} className="text-xs uppercase tracking-widest text-obsidian/60 hover:text-obsidian">Cancel</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}