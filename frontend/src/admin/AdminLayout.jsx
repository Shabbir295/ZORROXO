import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, Store, Menu, X, Key } from 'lucide-react'; // 🔥 Key icon add kiya
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/password-requests', label: 'Password Requests', icon: Key }, // 🔥 Naya Menu Item
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/5 relative z-10">
        <Link to="/" className="flex items-center gap-2 mb-2">
          <Store size={18} className="text-[#A18A70]" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold">ZORROXO</span>
        </Link>
        <h1 className="font-heading text-2xl tracking-widest text-white">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-6 space-y-2 relative z-10 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 text-sm transition-all duration-300 rounded-xl relative group ${
                isActive ? 'bg-[#A18A70] text-white shadow-lg shadow-[#A18A70]/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={`relative z-10 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white transition-colors'}`} />
              <span className={`relative z-10 tracking-wide font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-2 relative z-10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#A18A70] flex items-center justify-center text-white font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate font-medium">Administrator</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>
        
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft size={18} /> Back to Store
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex flex-col md:flex-row font-body">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#111110] text-white p-4 flex items-center justify-between sticky top-0 z-[80]">
        <div className="flex items-center gap-2">
          <Store size={18} className="text-[#A18A70]" />
          <span className="font-heading text-lg tracking-widest">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 bg-white/10 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-[#111110] text-[#F5F1E9] flex-col shadow-2xl z-20 relative h-screen sticky top-0 overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-[#A18A70]/10 blur-[80px] pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setMobileOpen(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden" 
            />
            
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#111110] text-[#F5F1E9] flex flex-col shadow-2xl z-[100] md:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white z-20">
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full min-h-screen md:h-screen md:overflow-y-auto">
        <div className="p-4 md:p-12 max-w-7xl mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}