import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';

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
  const handleLogoClick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="bg-obsidian text-ivory pt-20 pb-8">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" onClick={handleLogoClick} className="inline-flex items-center gap-3 mb-6 group">
              
              {/* 🔥 FOOTER LOGO (ZX + ZORROXO) */}
              <span className="font-heading text-3xl font-bold tracking-tighter text-[#A18A70] transition-transform duration-500 group-hover:scale-105">
                ZX
              </span>
              <span className="w-[1px] h-6 bg-[#A18A70]/30"></span>
              <span className="font-heading text-2xl text-ivory tracking-[0.25em] transition-colors duration-500 group-hover:text-[#A18A70]">
                ZORROXO
              </span>

            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed max-w-sm mb-8">
              The art of elevated living. Curated luxury for the modern
              connoisseur, crafted with intention since 2018.
            </p>
            <div className="flex gap-4">
              {[Globe, Mail, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/70 hover:border-bronze hover:text-bronze transition-colors">
                  <Icon size={16} />
                </a>
              ))}
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