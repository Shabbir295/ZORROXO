import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCurrency } from '../../context/CurrencyContext'; // 🔥 Import

export default function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency(); // 🔥 Hook

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*').limit(4);
      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-bronze" /></div>;

  return (
    <section className="py-24 bg-ivory-light">
      <div className="container-luxury">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <p className="eyebrow-text mb-4">Signature Pieces</p>
            <h2 className="font-heading text-4xl md:text-5xl text-obsidian">Best<span className="italic text-bronze">sellers</span></h2>
          </div>
          <Link to="/shop" className="text-[11px] tracking-[0.2em] uppercase text-obsidian border-b border-obsidian pb-1 hover:text-bronze transition-colors">View All →</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }} whileHover={{ y: -10 }} className="group">
              <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
                <Link to={`/product/${product.id}`}><img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></Link>
                {product.tag && <span className="absolute top-4 left-4 bg-obsidian text-ivory text-[9px] tracking-[0.2em] uppercase px-3 py-1">{product.tag}</span>}
              </div>
              <Link to={`/product/${product.id}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-heading text-lg text-obsidian group-hover:text-bronze transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 text-bronze"><Star size={11} fill="currentColor" /><span className="text-[10px] text-obsidian/60">{product.rating}</span></div>
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">{product.category}</p>
                {/* 🔥 Formatted Price */}
                <p className="font-heading text-base text-obsidian">{formatPrice(product.price)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}