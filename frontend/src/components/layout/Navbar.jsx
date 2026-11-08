import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { supabase } from '../../lib/supabase';
import AuthModal from '../ui/AuthModal';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/category/women', label: 'Women' },
  { to: '/category/men', label: 'Men' },
  { to: '/category/home', label: 'Home' },
  { to: '/about', label: 'About' },
];

const sidebarVariants = {
  closed: { x: '-100%' },
  open: { x: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }
};

const linkVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.08, duration: 0.5, ease: 'easeOut' } })
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(data?.is_admin || false);
    }
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (user || location.pathname === '/login' || location.pathname === '/signup') return;
    const timer = setTimeout(() => { setIsAuthModalOpen(true); }, 2500);
    return () => clearTimeout(timer);
  }, [user, location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleUserClick = () => { if (user) { navigate('/account'); } else { setIsAuthModalOpen(true); } };

  return (
    <>
      <nav className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 border-b border-[#D8CBB8]/50 ${scrolled ? 'bg-[#F5F1E9]/95 backdrop-blur-md py-3 shadow-sm' : 'bg-[#F5F1E9] py-4 lg:py-5'}`}>
        <div className="container-luxury flex items-center justify-between px-4 sm:px-6 lg:px-12">
          
          {/* LEFT: Menu Icon + Logo */}
          <div className="flex items-center gap-2 sm:gap-4 justify-start flex-1">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-obsidian p-1 -ml-1">
              <Menu size={20} />
            </button>
            
            {/* 🔥 WAHI PEHLA WALA TEXT LOGO (ZX + ZORROXO) */}
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <span className="font-heading text-3xl font-bold tracking-tighter text-[#A18A70] transition-transform duration-500 group-hover:scale-105">
                ZX
              </span>
              <span className="w-[1px] h-6 bg-[#D8CBB8] hidden sm:block"></span>
              <span className="font-heading text-lg sm:text-xl text-obsidian tracking-[0.25em] transition-colors duration-500 group-hover:text-[#A18A70]">
                ZORROXO
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Menu */}
          <ul className="hidden lg:flex items-center justify-center gap-8 flex-shrink-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => `text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative group ${isActive ? 'text-[#A18A70]' : 'text-obsidian hover:text-[#A18A70]'}`}>
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#A18A70] transition-all duration-500 group-hover:w-full" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT: Icons with Badges */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-5 flex-1">
            {isAdmin && (
              <Link to="/admin" className="hidden sm:flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase bg-[#111110] text-white px-3 py-1.5 rounded-lg hover:bg-[#A18A70] transition-colors" title="Admin Panel">
                <LayoutDashboard size={14} /><span className="hidden md:inline">Admin</span>
              </Link>
            )}
            <Link to="/search" className="text-obsidian hover:text-[#A18A70] transition-colors"><Search size={16} className="sm:w-[18px] sm:h-[18px]" /></Link>
            <Link to="/wishlist" className="text-obsidian hover:text-[#A18A70] transition-colors relative">
              <Heart size={16} className="sm:w-[18px] sm:h-[18px]" />
              {wishlistItems.length > 0 && <span className="absolute -top-2 -right-2 bg-[#A18A70] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" className="text-obsidian hover:text-[#A18A70] transition-colors relative">
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
              {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-obsidian text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>}
            </Link>
            <button onClick={handleUserClick} className="text-obsidian hover:text-[#A18A70] transition-colors"><User size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
          </div>
        </div>
      </nav>

      {/* SIDEBAR MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm lg:hidden" />
            <motion.div variants={sidebarVariants} initial="closed" animate="open" exit="closed" className="fixed top-0 left-0 bottom-0 z-[201] w-[85%] max-w-sm bg-[#EBE5D9] flex flex-col shadow-2xl lg:hidden">
              <div className="flex items-center justify-between p-6 border-b border-[#D8CBB8]">
                
                {/* MOBILE LOGO */}
                <div className="flex items-center gap-3">
                  <span className="font-heading text-2xl font-bold tracking-tighter text-[#A18A70]">ZX</span>
                  <span className="w-[1px] h-5 bg-[#D8CBB8]"></span>
                  <span className="font-heading text-lg text-obsidian tracking-[0.2em]">ZORROXO</span>
                </div>

                <button onClick={() => setMobileOpen(false)} className="text-obsidian hover:text-[#A18A70]"><X size={26} /></button>
              </div>
              <div className="flex-1 flex flex-col justify-center px-8 gap-6">
                {navLinks.map((link, i) => (
                  <motion.div key={link.to} custom={i} variants={linkVariants} initial="closed" animate="open">
                    <Link to={link.to} onClick={() => setMobileOpen(false)} className="font-heading text-3xl text-obsidian hover:text-[#A18A70] transition-colors flex items-center justify-between group">
                      {link.label}
                      <span className="text-[#A18A70] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">→</span>
                    </Link>
                  </motion.div>
                ))}
                {isAdmin && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-heading text-3xl text-[#A18A70] flex items-center gap-3 mt-4 pt-6 border-t border-[#D8CBB8]">
                      <LayoutDashboard size={24} /> Admin Panel
                    </Link>
                  </motion.div>
                )}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-8 border-t border-[#D8CBB8] text-center">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] mb-2 font-bold">Contact Us</p>
                <p className="text-sm text-obsidian/60">hello@zorroxo.com</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}