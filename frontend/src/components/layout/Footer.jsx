import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const iconMap = {
  instagram: { icon: FaInstagram, color: 'hover:text-[#E4405F]' },
  facebook: { icon: FaFacebookF, color: 'hover:text-[#1877F2]' },
  twitter: { icon: FaTwitter, color: 'hover:text-[#1DA1F2]' },
  youtube: { icon: FaYoutube, color: 'hover:text-[#FF0000]' },
  tiktok: { icon: FaTiktok, color: 'hover:text-white' },
  linkedin: { icon: FaLinkedin, color: 'hover:text-[#0A66C2]' },
  pinterest: { icon: FaPinterest, color: 'hover:text-[#E60023]' },
};

const links = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'Women', to: '/category/women' },
    { label: 'Men', to: '/category/men' },
    { label: 'Home', to: '/category/home' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
  ],
  Support: [
    { label: 'Shipping', to: '/shipping' },
    { label: 'Returns', to: '/returns' },
    { label: 'Size Guide', to: '/size-guide' },
  ],
};

export default function Footer() {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    async function fetchSocials() {
      const { data } = await supabase.from('social_links').select('*');
      if (data) {
        // 🔥 Filter karo: Sirf wo links jo khaali nahi hain, aur max 4
        const active = data.filter(s => s.url && s.url.trim() !== '').slice(0, 4);
        setSocials(active);
      }
    }
    fetchSocials();
  }, []);

  const handleLogoClick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="bg-obsidian text-ivory pt-20 pb-8">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" onClick={handleLogoClick} className="inline-block mb-6">
              <span className="font-heading text-3xl tracking-[0.25em] text-ivory">ZORROXO</span>
            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed max-w-sm mb-8">
              The art of elevated living. Curated luxury for the modern
              connoisseur, crafted with intention since 2018.
            </p>
            
            {/* 🔥 DYNAMIC SOCIAL ICONS */}
            <div className="flex gap-4">
              {socials.map((social) => {
                const IconData = iconMap[social.platform];
                if (!IconData) return null;
                return (
                  <a 
                    key={social.platform}
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/70 transition-colors ${IconData.color} hover:border-current`}
                  >
                    <IconData.icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-[11px] tracking-[0.2em] uppercase text-champagne mb-6">{title}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-ivory/60 hover:text-ivory transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">© {new Date().getFullYear()} ZORROXO. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-ivory/40 hover:text-ivory/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-ivory/40 hover:text-ivory/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}